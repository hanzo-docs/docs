import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import {
  isSuccess,
  loadDocument,
  opHref,
  opSlug,
  type Document,
  type Operation,
  type Product,
  type Response,
} from './openapi-doc';
import { fields, typeName, type Field } from './openapi-schema';
import { SDKS, cli, http, mcp } from './openapi-surfaces';
import { MCP_DOOR, loadMcpTools } from './sync-mcp-tools';
import type { CliCommand } from './sync-cli-commands';

// The API reference, generated from THE document.
//
// hanzoai/openapi `hanzo.yaml` describes every Hanzo endpoint once. This script
// renders ONE PAGE PER OPERATION — same sections, same order, every time — and
// one index page per product that reaches them all. The tag's description (the
// owning package's doc synopsis) is the product's intro; each operation's prose
// and schema are its own, out of the document. Nothing here is authored; if a
// sentence about an endpoint appears on docs.hanzo.ai, it was written next to
// the code and travelled here through hanzo.yaml.
//
// Where the document has no prose, no request schema or no response schema, the
// page SAYS SO in the section that would have carried it. A visible gap is what
// gets a route written up; a page that quietly drops the section reads finished
// and never does.
//
// Static MDX, not the runtime <APIPage>: the site ships as a static export
// (NEXT_EXPORT=1), which disables the interactive loader (lib/openapi/index.ts).
// MDX exports cleanly and can never 530.

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(SCRIPT_DIR, '..');
const DOCUMENT = path.join(APP_ROOT, 'openapi-specs/hanzo.yaml');
const FLOWS = path.join(APP_ROOT, 'openapi-specs/flows.yaml');
const CLI_TABLE = path.join(APP_ROOT, 'openapi-specs/cli-commands.json');
const OUT_DIR = path.join(APP_ROOT, 'content/docs/openapi');
const SERVICES_DIR = path.join(APP_ROOT, 'content/docs/services');
const PUBLIC_COPY = path.join(APP_ROOT, 'public/openapi/hanzo.yaml');

// A few products document their concepts under a slug that differs from the
// product name. Everything else resolves by looking for a guide on disk.
const GUIDE_OVERRIDES: Record<string, string> = {
  ai: '/docs/llm',
  app: '/docs/services/paas',
  evals: '/docs/experiments',
};

function guideHref(svc: string): string | null {
  if (GUIDE_OVERRIDES[svc]) return GUIDE_OVERRIDES[svc];
  if (
    fs.existsSync(path.join(SERVICES_DIR, `${svc}.mdx`)) ||
    fs.existsSync(path.join(SERVICES_DIR, svc, 'index.mdx'))
  ) {
    return `/docs/services/${svc}`;
  }
  return null;
}

// ---------------------------------------------------------------- MDX safety

/** Inline code: only the GFM table pipe needs escaping. */
const code = (s: unknown): string =>
  String(s ?? '').replace(/[\r\n]+/g, ' ').trim().replace(/\|/g, '\\|');

/** Table/heading text: neutralise MDX expressions and JSX. */
const text = (s: unknown): string =>
  String(s ?? '')
    .replace(/[\r\n]+/g, ' ')
    .trim()
    .replace(/\|/g, '\\|')
    .replace(/[<>]/g, (c) => (c === '<' ? '&lt;' : '&gt;'))
    .replace(/[{}]/g, (c) => (c === '{' ? '&#123;' : '&#125;'));

/**
 * Operation prose lifted from Go doc comments is markdown, not MDX: a stray
 * `{` or `<T>` is a build failure. Escape those in running text while leaving
 * fenced blocks and inline code spans verbatim — MDX parses neither.
 */
function prose(s: string): string {
  if (!s) return '';
  const parts = String(s).split(/(```[\s\S]*?```|`[^`\n]*`)/g);
  return parts
    .map((part, i) =>
      i % 2 === 1
        ? part
        : part
            .replace(/[{}]/g, (c) => (c === '{' ? '&#123;' : '&#125;'))
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;'),
    )
    .join('')
    .trim();
}

const yamlString = (s: string): string =>
  JSON.stringify(String(s ?? '').replace(/\s+/g, ' ').trim());

const firstSentence = (s: string, max = 200): string => {
  const t = String(s ?? '').replace(/\s+/g, ' ').trim();
  if (t.length <= max) {
    const m = t.match(/^(.+?[.!?])(\s|$)/);
    return (m ? m[1] : t).trim();
  }
  const head = t.slice(0, max);
  const stop = head.lastIndexOf('. ');
  return (stop > 40 ? head.slice(0, stop + 1) : head).trim();
};

const fence = (lang: string, body: string): string[] => ['```' + lang, body, '```'];

/** `create-chat-completion` -> `Create chat completion` — a title where the document gives none. */
const humanise = (slug: string): string => {
  const words = slug.split('-').filter(Boolean);
  if (!words.length) return slug;
  return [words[0][0].toUpperCase() + words[0].slice(1), ...words.slice(1)].join(' ');
};

// The raw document, which `typeName`/`fields` need to resolve a `$ref`. Set
// once per run rather than threaded through every render function's signature.
let RAW_DOC: any = null;

// ------------------------------------------------------------- field tables

const literal = (v: unknown): string => (typeof v === 'string' ? v : JSON.stringify(v));

/**
 * ONE field-table shape, used by REQUEST and RESPONSE alike, so a reader learns
 * the columns once. Every row of every schema is printed — no slice, no "N more
 * fields". That is the difference between a reference and a summary.
 */
function fieldTable(rows: Field[]): string[] {
  if (!rows.length) return [];
  return [
    '| Field | Type | Required | Default | Description |',
    '|---|---|---|---|---|',
    ...rows.map((f) => {
      const desc = [
        text(f.description),
        f.enum.length ? `One of: ${f.enum.map((v) => `\`${code(v)}\``).join(', ')}.` : '',
      ]
        .filter(Boolean)
        .join(' ');
      return `| \`${code(f.name)}\` | ${text(f.type)} | ${f.required ? 'yes' : '—'} | ${
        f.default ? `\`${code(f.default)}\`` : '—'
      } | ${desc || '—'} |`;
    }),
    '',
  ];
}

function paramTable(op: Operation): string[] {
  return [
    '| Parameter | In | Type | Required | Default | Description |',
    '|---|---|---|---|---|---|',
    ...op.parameters.map((p) => {
      const enums: unknown[] = Array.isArray(p.schema?.enum)
        ? p.schema.enum
        : Array.isArray(p.schema?.items?.enum)
          ? p.schema.items.enum
          : [];
      const desc = [
        text(p.description),
        enums.length ? `One of: ${enums.map((v) => `\`${code(literal(v))}\``).join(', ')}.` : '',
      ]
        .filter(Boolean)
        .join(' ');
      const def = p.schema?.default;
      return `| \`${code(p.name)}\` | ${p.in} | ${text(typeName(RAW_DOC, p.schema) || 'any')} | ${
        p.required ? 'yes' : '—'
      } | ${def === undefined ? '—' : `\`${code(literal(def))}\``} | ${desc || '—'} |`;
    }),
    '',
  ];
}

// -------------------------------------------------------- operation sections
//
// EIGHT SECTIONS, ALWAYS THE SAME EIGHT, ALWAYS IN THIS ORDER. The page is
// composed by walking `SECTIONS` at the bottom of this block, so uniformity is
// structural: a section cannot be skipped when the document is thin about an
// operation, only filled with the sentence that says so. Each renderer below
// returns the section's BODY; the heading is the table's business.

/** Everything a section renderer may need. One shape, so the table is one type. */
export interface Ctx {
  op: Operation;
  product: Product;
  doc: Document;
  cliTable: Map<string, CliCommand>;
  mcpTools: Map<string, { name: string }>;
  /** The flow this operation belongs to, when one calls it. */
  flow?: string;
}

/** What a caller MUST supply — the one-line contract under SYNOPSIS. */
function requiredOf(op: Operation): string[] {
  const params = op.parameters.filter((p) => p.required).map((p) => `\`${code(p.name)}\` (${p.in})`);
  const bodyRequired: string[] = Array.isArray(op.body?.schema?.required)
    ? op.body!.schema.required
    : [];
  return [...params, ...bodyRequired.map((n) => `\`${code(n)}\` (body)`)];
}

function nameSection({ op }: Ctx): string[] {
  const line = op.summary || firstSentence(op.description);
  return [
    `\`${code(op.id)}\` — ${
      line
        ? text(line)
        : `${op.method.toUpperCase()} ${text(op.path)}. The document gives this operation no summary.`
    }`,
    '',
  ];
}

function synopsisSection({ op, product: p, doc }: Ctx): string[] {
  const req = requiredOf(op);
  return [
    ...fence('http', `${op.method.toUpperCase()} ${op.path}`),
    '',
    '| | |',
    '|---|---|',
    `| **Product** | [${text(p.title)}](/docs/openapi/${p.name}) |`,
    `| **Operation ID** | \`${code(op.id)}\` |`,
    `| **Base URL** | \`${doc.server}\` |`,
    '| **Auth** | `Authorization: Bearer $HANZO_API_KEY` |',
    `| **Required** | ${
      req.length ? req.join(', ') : 'nothing — the call takes no required parameter or body field'
    } |`,
    ...(op.deprecated ? ['| **Status** | **deprecated** |'] : []),
    '',
  ];
}

function descriptionSection({ op }: Ctx): string[] {
  if (op.description) return [prose(op.description), ''];
  return [
    'The document carries no description for this operation. Prose is written beside the code in the owning package and reaches this page through `hanzo.yaml`, so an operation with none here has none there yet.',
    '',
  ];
}

function requestSection({ op }: Ctx): string[] {
  const L: string[] = [];
  if (!op.body) {
    L.push(
      `\`${op.method.toUpperCase()}\` on this route takes no request body — everything it accepts is under [PARAMETERS](#parameters).`,
      '',
    );
    return L;
  }
  L.push(`\`${op.body.contentType}\`${op.body.required ? ' · **required**' : ' · optional'}`, '');
  const rows = fields(RAW_DOC, op.body.schema, '(body)');
  if (!rows.length) {
    L.push(
      `The document declares a \`${op.body.contentType}\` body for this operation but no schema for it, so there are no fields to enumerate. That is a gap in \`hanzo.yaml\`, not on this page.`,
      '',
    );
    return L;
  }
  L.push(...fieldTable(rows));
  return L;
}

function responseBody(r: Response): string[] {
  const L = [`### ${r.status}${r.description ? ` — ${text(r.description)}` : ''}`, ''];
  if (!r.contentType) {
    L.push('Answers with no body.', '');
    return L;
  }
  L.push(`\`${r.contentType}\``, '');
  const rows = fields(RAW_DOC, r.schema, '(response)');
  if (!rows.length) {
    L.push(
      `The document declares \`${r.contentType}\` here but no schema, so there are no fields to enumerate. That is a gap in \`hanzo.yaml\`, not on this page.`,
      '',
    );
    return L;
  }
  L.push(...fieldTable(rows));
  return L;
}

function responseSection({ op }: Ctx): string[] {
  const ok = op.responses.filter((r) => isSuccess(r.status));
  const L: string[] = [];
  if (!ok.length) {
    L.push(
      'The document declares no success response for this operation, so what a successful call answers with is not described yet. Every status it does declare is under [ERRORS](#errors).',
      '',
    );
    return L;
  }
  for (const r of ok) L.push(...responseBody(r));
  return L;
}

function parametersSection({ op }: Ctx): string[] {
  const L: string[] = [];
  if (!op.parameters.length) {
    L.push('This operation declares no path, query or header parameters.', '');
    return L;
  }
  L.push(...paramTable(op));
  return L;
}

function errorsSection({ op }: Ctx): string[] {
  const L: string[] = [];
  if (!op.errors.length) {
    L.push(
      'The document declares no failure response for this operation. Any Hanzo route can still answer `401` on a missing or rejected credential and `429` when a limit is hit — see [Errors](/docs/errors) — but this operation names none of its own, which is a gap in `hanzo.yaml`.',
      '',
    );
    return L;
  }
  L.push('| Status | Body | Description |', '|---|---|---|');
  for (const r of op.errors) {
    const shape = r.contentType
      ? `\`${code(r.contentType)}\`${
          r.schema ? ` · ${text(typeName(RAW_DOC, r.schema) || 'object')}` : ' · no schema declared'
        }`
      : 'no body';
    L.push(`| \`${code(r.status)}\` | ${shape} | ${text(r.description) || '—'} |`);
  }
  L.push('');
  return L;
}

/**
 * EXAMPLES: the same four surfaces the flow pages show, for one operation.
 *
 * Every one of them is a projection of THIS operation in the document — none is
 * a hand-written sample that can drift from the route it demonstrates. Where
 * the CLI does not serve the route or the MCP door does not expose it, the page
 * says so instead of printing a command that would not run.
 */
function examplesSection({ op, doc, cliTable, mcpTools, flow }: Ctx): string[] {
  const L: string[] = [];
  const command = cli(op, doc, cliTable);
  const tool = mcp(op, doc, mcpTools);

  L.push("<Tabs items={['cURL', 'SDK', 'CLI', 'MCP']}>");

  L.push('<Tab value="cURL">');
  L.push(...fence('bash', http(op, doc)));
  L.push('</Tab>');

  L.push('<Tab value="SDK">');
  L.push(`<Tabs items={[${SDKS.map((s) => `'${s.label}'`).join(', ')}]}>`);
  for (const sdk of SDKS) {
    L.push(`<Tab value="${sdk.label}">`);
    L.push(...fence(sdk.lang, sdk.render(op, doc)));
    L.push('</Tab>');
  }
  L.push('</Tabs>');
  L.push('</Tab>');

  L.push('<Tab value="CLI">');
  if (command) L.push(...fence('bash', command));
  else
    L.push(
      "`hanzo` has no subcommand for this operation — the CLI serves only what cloud's live route table confirms. Use cURL or an SDK.",
    );
  L.push('</Tab>');

  L.push('<Tab value="MCP">');
  if (tool) {
    L.push(`Tool \`${tool.tool}\` — POST the JSON-RPC envelope to \`${MCP_DOOR}\`.`, '');
    L.push(
      ...fence(
        'bash',
        `curl -X POST ${MCP_DOOR} \\\n  -H "Authorization: Bearer $HANZO_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '${tool.call.split('\n').join('\n     ')}'`,
      ),
    );
  } else {
    L.push(
      `The MCP door does not expose this operation as a tool. It answers \`tools/list\` at \`${MCP_DOOR}\` with the ones it does.`,
    );
  }
  L.push('</Tab>');

  L.push('</Tabs>', '');
  if (flow) {
    L.push(
      `This operation is part of the **${humanise(flow)}** journey, which every Hanzo SDK ships as a runnable \`examples/${flow}/\` program — see [${humanise(
        flow,
      )}, four surfaces →](/docs/start/${flow}).`,
      '',
    );
  }
  return L;
}

/**
 * THE SHAPE OF AN OPERATION PAGE. One table, walked in order, on every page.
 *
 * Exported because it is the contract the reference is judged against: a test
 * asserts a real operation renders exactly these headings, in this order, and
 * nothing can add a ninth section on some pages and not others without changing
 * this list.
 */
export const SECTIONS: Array<{ heading: string; render(c: Ctx): string[] }> = [
  { heading: 'NAME', render: nameSection },
  { heading: 'SYNOPSIS', render: synopsisSection },
  { heading: 'DESCRIPTION', render: descriptionSection },
  { heading: 'REQUEST', render: requestSection },
  { heading: 'RESPONSE', render: responseSection },
  { heading: 'PARAMETERS', render: parametersSection },
  { heading: 'ERRORS', render: errorsSection },
  { heading: 'EXAMPLES', render: examplesSection },
];

export function renderOperation(c: Ctx): string {
  const { op, product: p, doc } = c;
  const L: string[] = [];
  L.push('---');
  L.push(`title: ${yamlString(op.summary || humanise(opSlug(op)))}`);
  L.push(
    `description: ${yamlString(
      `${op.method.toUpperCase()} ${op.path} — ${
        firstSentence(op.description) || op.summary || `${op.id} on ${doc.server}`
      }`,
    )}`,
  );
  L.push(`method: ${op.method.toUpperCase()}`);
  L.push('---');
  L.push('');
  L.push("import { Tab, Tabs } from '@hanzo/docs-ui/components/tabs'");
  L.push('');
  for (const s of SECTIONS) {
    L.push(`## ${s.heading}`);
    L.push('');
    L.push(...s.render(c));
  }
  L.push('---');
  L.push('');
  L.push(
    [
      `[${text(p.title)} reference](/docs/openapi/${p.name})`,
      '[All Hanzo APIs](/docs/openapi)',
      '[Interactive reference](/reference)',
    ].join(' · '),
  );
  L.push('');
  return L.join('\n');
}

// ------------------------------------------------------------ product index

/** What the document does and does not say about a set of operations — measured, not claimed. */
function coverage(ops: Operation[]) {
  return {
    total: ops.length,
    prose: ops.filter((o) => o.description).length,
    bodied: ops.filter((o) => o.body).length,
    request: ops.filter((o) => o.body && fields(RAW_DOC, o.body.schema).length).length,
    response: ops.filter((o) => o.responses.some((r) => isSuccess(r.status) && r.schema)).length,
    errors: ops.filter((o) => o.errors.length).length,
  };
}

function coverageTable(c: ReturnType<typeof coverage>): string[] {
  return [
    '| | |',
    '|---|---|',
    `| Operations | ${c.total} |`,
    `| Carrying prose | ${c.prose} |`,
    `| Declaring a request body | ${c.bodied}, of which ${c.request} carry a schema |`,
    `| Declaring a success schema | ${c.response} |`,
    `| Naming their own error statuses | ${c.errors} |`,
    '',
    'Counted from the document at build time. Where a number falls short of the total, the operations concerned say so on their own pages — the gap is in `hanzo.yaml` and closes there.',
    '',
  ];
}

function renderProduct(p: Product, doc: Document): string {
  const guide = guideHref(p.name);
  const L: string[] = [];

  // The product's intro IS the tag description — the owning package's synopsis.
  // Where the document carries only a title-length tag, there is no synopsis to
  // print yet: say what the reference covers rather than echoing the heading.
  const synopsis = p.description.trim() === p.title.trim() ? '' : p.description;

  L.push('---');
  L.push(`title: ${yamlString(p.title)}`);
  L.push(
    `description: ${yamlString(
      firstSentence(synopsis) ||
        `${p.title} — ${p.operations.length} operations on ${doc.server}, a page each.`,
    )}`,
  );
  L.push('---');
  L.push('');
  L.push(
    synopsis
      ? prose(synopsis)
      : `The REST reference for **${text(p.title)}** — ${p.operations.length} operations, generated from the OpenAPI document.`,
  );
  L.push('');

  const nav = [
    ...(guide ? [`[Guide & examples →](${guide})`] : []),
    '[All API references →](/docs/openapi)',
    '[Six flows, four surfaces →](/docs/start)',
  ];
  L.push(`> ${nav.join(' · ')}`);
  L.push('');
  L.push('| | |');
  L.push('|---|---|');
  L.push(`| **Base URL** | \`${doc.server}\` |`);
  L.push(`| **Operations** | ${p.operations.length}, one page each |`);
  L.push('| **Auth** | `Authorization: Bearer $HANZO_API_KEY` |');
  L.push('');

  const sections = new Map<string, Operation[]>();
  for (const op of p.operations) {
    if (!sections.has(op.tag)) sections.set(op.tag, []);
    sections.get(op.tag)!.push(op);
  }

  for (const [tag, ops] of [...sections.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    L.push(`## ${text(tag)}`);
    L.push('');
    L.push('| Operation | Endpoint | Summary |');
    L.push('|---|---|---|');
    for (const op of ops) {
      L.push(
        `| [\`${code(op.id)}\`](${opHref(op)}) | \`${op.method.toUpperCase()} ${code(op.path)}\`${
          op.deprecated ? ' · **deprecated**' : ''
        } | ${text(op.summary || firstSentence(op.description, 110)) || '—'} |`,
      );
    }
    L.push('');
  }

  L.push('## Coverage');
  L.push('');
  L.push(...coverageTable(coverage(p.operations)));

  L.push('---');
  L.push('');
  L.push(
    [
      ...(guide ? [`[${text(p.title)} guide](${guide})`] : []),
      '[All Hanzo APIs](/docs/openapi)',
      '[Interactive reference](/reference)',
    ].join(' · '),
  );
  L.push('');
  return L.join('\n');
}

function renderIndex(doc: Document): string {
  const ops = doc.products.reduce((n, p) => n + p.operations.length, 0);
  const L: string[] = [];
  L.push('---');
  L.push('title: API Reference');
  L.push(
    `description: ${yamlString(
      `The unified REST API reference for every Hanzo product — ${doc.products.length} products, ${ops} operations, a page each, generated from the OpenAPI document.`,
    )}`,
  );
  L.push('icon: BookOpen');
  L.push('---');
  L.push('');
  L.push("import { Cards, Card } from '@hanzo/docs-ui/components/card'");
  L.push('');
  L.push('# Hanzo API Reference');
  L.push('');
  L.push(
    `One cloud, one credential. Every Hanzo product speaks REST over HTTPS, shares a single API key, and is documented here straight from the OpenAPI document that also generates the SDKs, the CLI and the MCP tools — **${doc.products.length} products, ${ops} operations, one page each**.`,
  );
  L.push('');
  L.push(
    'Every operation page carries the same eight sections in the same order — NAME, SYNOPSIS, DESCRIPTION, REQUEST, RESPONSE, PARAMETERS, ERRORS, EXAMPLES — so a route you have never opened reads like one you already know.',
  );
  L.push('');
  L.push('## Authentication');
  L.push('');
  L.push('Every product accepts the same bearer credential — a Hanzo IAM JWT or an `hk-` API key.');
  L.push('');
  L.push('```bash');
  L.push(`curl -H "Authorization: Bearer $HANZO_API_KEY" ${doc.server}/v1/models`);
  L.push('```');
  L.push('');
  L.push(
    'Get a key at [console.hanzo.ai](https://console.hanzo.ai). New here? [Six flows, four surfaces](/docs/start) walks the same journeys as CLI, SDK, HTTP and MCP.',
  );
  L.push('');
  L.push('## Products');
  L.push('');
  L.push('<Cards>');
  for (const p of doc.products) {
    L.push(`  <Card title=${JSON.stringify(p.title)} href="/docs/openapi/${p.name}">`);
    L.push(`    ${text(firstSentence(p.description, 130))} · ${p.operations.length} operations`);
    L.push('  </Card>');
  }
  L.push('</Cards>');
  L.push('');
  L.push('## What the document covers');
  L.push('');
  L.push(...coverageTable(coverage(doc.products.flatMap((p) => p.operations))));
  L.push('---');
  L.push('');
  L.push('Prefer to click? The [interactive reference](/reference) renders the same document.');
  L.push('');
  return L.join('\n');
}

// -------------------------------------------------------------------- main

function syncDocument(): void {
  try {
    execFileSync('bash', [path.join(SCRIPT_DIR, 'sync-openapi.sh')], { stdio: 'inherit' });
  } catch (e) {
    console.warn('[openapi] sync failed; building from the committed snapshot', e);
  }
}

/** operationId -> the flow that calls it, for the runnable-example pointer. */
function flowByOperation(): Map<string, string> {
  const out = new Map<string, string>();
  if (!fs.existsSync(FLOWS)) return out;
  const raw = parseYaml(fs.readFileSync(FLOWS, 'utf8'))?.flows;
  for (const [id, f] of Object.entries<any>(raw ?? {})) {
    for (const op of f?.operations ?? []) if (!out.has(op)) out.set(op, id);
  }
  return out;
}

/**
 * Every operation page linked from its product index, and present on disk.
 *
 * Read back off the files that were written, so this audits the reference that
 * shipped rather than what the renderer meant to write. A page nobody links to
 * is the same as no page, so an orphan fails the build.
 */
function orphanPages(doc: Document): string[] {
  const orphans: string[] = [];
  for (const p of doc.products) {
    const dir = path.join(OUT_DIR, p.name);
    const index = fs.readFileSync(path.join(dir, 'index.mdx'), 'utf8');
    for (const op of p.operations) {
      const slug = opSlug(op);
      if (!index.includes(`(${opHref(op)})`) || !fs.existsSync(path.join(dir, `${slug}.mdx`))) {
        orphans.push(`${p.name}/${slug}`);
      }
    }
  }
  return orphans;
}

export async function genOpenapiPages(): Promise<void> {
  syncDocument();
  if (!fs.existsSync(DOCUMENT)) {
    throw new Error(
      `[openapi] ${DOCUMENT} is missing — the API reference cannot be generated without the document`,
    );
  }

  const doc = loadDocument(DOCUMENT);
  RAW_DOC = doc.raw;
  if (!doc.products.length) throw new Error('[openapi] the document resolved to zero products');
  if (doc.unresolved.length) {
    console.warn(
      `[openapi] ${doc.unresolved.length} operations name no product and are omitted:`,
      doc.unresolved.slice(0, 5).map((o) => `${o.method.toUpperCase()} ${o.path}`),
    );
  }

  const tools = loadMcpTools();
  const table = new Map<string, CliCommand>(
    (fs.existsSync(CLI_TABLE)
      ? (JSON.parse(fs.readFileSync(CLI_TABLE, 'utf8')) as CliCommand[])
      : []
    ).map((c) => [c.key, c]),
  );
  const flows = flowByOperation();

  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  // A folder per product with `index.mdx` as its own page: `/docs/openapi/<product>`
  // is unchanged and every operation hangs beneath it. This also retires the one
  // special case the flat layout needed — a product slugged `index` (Hanzo Index,
  // full-text search) is now a folder like every other and cannot collide with
  // this folder's own `index.mdx`.
  let pages = 0;
  const written = new Set<string>();
  for (const p of doc.products) {
    const dir = path.join(OUT_DIR, p.name);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.mdx'), renderProduct(p, doc));

    for (const op of p.operations) {
      const slug = opSlug(op);
      const file = path.join(dir, `${slug}.mdx`);
      // Two operations at one address is a lost page, not a near miss.
      if (written.has(file)) {
        throw new Error(
          `[openapi] ${p.name}: "${op.id}" and an earlier operation both address "${slug}" — the slug rule in openapi-doc.ts must separate them`,
        );
      }
      written.add(file);
      fs.writeFileSync(
        file,
        renderOperation({
          op,
          product: p,
          doc,
          cliTable: table,
          mcpTools: tools,
          flow: flows.get(op.id),
        }),
      );
      pages++;
    }

    // THE SIDEBAR LISTS PRODUCTS; THE PRODUCT PAGE LISTS OPERATIONS.
    //
    // `pages` is the sidebar tree, and the tree is serialized into EVERY page
    // the site exports. Listing all 2,454 operations here took one small
    // operation page from 858 KB to 2.76 MB and the whole export past the
    // build's memory — measured, not feared: that build was OOM-killed at page
    // 2,114 of 4,228 with .next already at 26 GB.
    //
    // It is also the worse index. A sidebar can show a slug; the product page
    // shows method, path and summary in one table, and that table is what
    // `orphanPages` holds every operation to. One index, and it is the one that
    // says something.
    fs.writeFileSync(
      path.join(dir, 'meta.json'),
      JSON.stringify({ title: p.title, pages: ['index'] }, null, 2) + '\n',
    );
  }
  fs.writeFileSync(path.join(OUT_DIR, 'index.mdx'), renderIndex(doc));
  fs.writeFileSync(
    path.join(OUT_DIR, 'meta.json'),
    JSON.stringify(
      {
        title: 'API Reference',
        description:
          'REST API reference for every Hanzo product, one page per operation, generated from the OpenAPI document.',
        pages: ['index', ...doc.products.map((p) => p.name)],
      },
      null,
      2,
    ) + '\n',
  );

  // The interactive reference at /reference reads the same document. Copy it at
  // build time rather than checking in a second one — one document, one copy.
  fs.mkdirSync(path.dirname(PUBLIC_COPY), { recursive: true });
  fs.copyFileSync(DOCUMENT, PUBLIC_COPY);

  const ops = doc.products.reduce((n, p) => n + p.operations.length, 0);
  if (pages !== ops) throw new Error(`[openapi] ${ops} operations produced ${pages} pages`);
  const orphans = orphanPages(doc);
  if (orphans.length) {
    throw new Error(
      `[openapi] ${orphans.length} operation pages are unreachable from their product index: ${orphans
        .slice(0, 5)
        .join(', ')}`,
    );
  }

  const c = coverage(doc.products.flatMap((p) => p.operations));
  const withSynopsis = doc.products.filter((p) => p.description).length;
  console.log(
    `[openapi] ${doc.products.length} product indexes + ${pages} operation pages, ` +
      `0 orphans, ${c.prose} carrying prose`,
  );
  console.log(
    `[openapi] the document declares a request body on ${c.bodied} operations ` +
      `(${c.request} of them with a schema), a success schema on ${c.response}, ` +
      `own error statuses on ${c.errors} — every shortfall is stated on the page it belongs to`,
  );
  console.log(
    `[openapi] ${withSynopsis} products carry the owning package's synopsis; ` +
      `${doc.undeclared.size} are served but declare no tag ` +
      `(${doc.products.filter((p) => doc.undeclared.has(p.name)).reduce((n, p) => n + p.operations.length, 0)} operations) ` +
      `— those want a tag in hanzoai/openapi`,
  );
}

if (import.meta.main) {
  genOpenapiPages().catch((e) => {
    console.error('[openapi] failed', e);
    process.exit(1);
  });
}
