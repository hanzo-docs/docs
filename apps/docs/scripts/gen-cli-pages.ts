import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DOCUMENT, canonical, loadDocument, titleCase, type Document, type Operation } from './openapi-doc';
import { cli, command as lookup } from './openapi-surfaces';
import { loadCliTable, type CliCommand } from './sync-cli-commands';
import { domains, icon } from './capabilities';
import { firstSentence, text, yamlString } from './mdx';

// THE CLI, one page per capability.
//
// `openapi-specs/cli-commands.json` is the CLI's own command table — 2,356
// commands, folded from the document by hanzoai/cli's `genproduct` and committed
// there as data. It has been synced on every build and rendered on no page: a
// reader who wanted to know what `hanzo` can do had to run `hanzo --help` 185
// times.
//
// The operation pages already print the ONE command that calls that route. What
// they cannot show is the shape of the tool itself — which groups exist, how
// deep a group goes, what a group can do end to end. That is what this section
// is, and it is the whole of the CLI rather than a selection.
//
// FILED BY OWNER, PRINTED AS INVOKED. A command is grouped here under the
// capability that SERVES its route — the tag — so the CLI section, the sidebar,
// the reference and the taxonomy all cut the estate the same way. The command
// itself is printed exactly as `hanzo` spells it, `cmd.product` and all, which
// is not always the same word: the CLI's grouping came from the address. Filing
// by one and printing the other is the only way both stay true.

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(SCRIPT_DIR, '..');
const OUT_DIR = path.join(APP_ROOT, 'content/docs/cli');

/**
 * Guides a capability's product keeps on its own docs site. The reference says
 * what the commands do, not how to adopt the product; a reader who came here
 * from the product's own page is pointed at the guide from this page and from
 * the capability's place in the sidebar.
 */
export const GUIDES: Record<string, Array<{ title: string; href: string; lead: string }>> = {
  bot: [
    {
      title: 'Migrate from OpenClaw',
      href: 'https://docs.hanzo.bot/docs/install/migrate-from-openclaw',
      lead: 'Coming from OpenClaw? One command moves your install to Hanzo Bot.',
    },
  ],
};

/** The lines a capability page carries for its guides. */
export function guideLines(name: string): string[] {
  return (GUIDES[name] ?? []).flatMap((g) => [`${g.lead} [${g.title} →](${g.href})`, '']);
}

/** The sidebar entries under a capability: its guides, as links. */
export function guidePages(name: string): string[] {
  return (GUIDES[name] ?? []).map((g) => `[${g.title}](${g.href})`);
}

interface Group {
  /** The capability that serves these routes. */
  name: string;
  title: string;
  description: string;
  rows: Array<{ op: Operation; command: string; cmd: CliCommand }>;
}

function groups(doc: Document, table: Map<string, CliCommand>): Group[] {
  const out = new Map<string, Group>();
  for (const p of doc.products) {
    for (const op of p.operations) {
      const cmd = lookup(op, table);
      const command = cli(op, doc, table);
      if (!cmd || !command) continue;
      let g = out.get(p.name);
      if (!g) {
        g = { name: p.name, title: p.title, description: p.description, rows: [] };
        out.set(p.name, g);
      }
      g.rows.push({ op, command, cmd });
    }
  }
  return [...out.values()];
}

/** The words a command spells its capability with: through the word that names
 *  it, or the product alone when none does. A capability the CLI files under
 *  another command is spelled there — `/v1/link` is `hanzo auth link` — so the
 *  page names the spelling a reader types, not the tag it is filed under. */
export function spelling(command: string, name: string): string[] {
  const words = command.replace(/\s*\\\n\s*/g, ' ').split(/\s+/).slice(1);
  const at = words.indexOf(name);
  return words.slice(0, at >= 0 ? at + 1 : 1);
}

/** The words after `hanzo <capability>` that name what a command acts on — its
 *  noun and its verb — read from the CLI's own coordinates rather than from the
 *  printed command. The printed command also carries the arguments a reader
 *  fills in, spelled as an example when the document gives one (`1`, `true`, an
 *  enum's first value), and counting those as words made `hanzo campaign rm
 *  <id>` a noun `rm` with a verb `<id>`: the page grew a section called "rm".
 *  The capability's own spelling is dropped the way `spelling` finds it. */
export function words(cmd: CliCommand, name: string): string[] {
  const all = [cmd.product, ...cmd.nodes, cmd.verb];
  const at = all.indexOf(name);
  return all.slice(at >= 0 ? at + 1 : 1);
}

/** A section heading for a noun, written as a reader says it: `members` ->
 *  "Members", `service-accounts` -> "Service accounts", `api-keys` -> "API keys".
 *  The noun is a CLI token, spelled for a shell; the heading is a title, and it
 *  is the line the page's table of contents repeats. The command itself is in
 *  every row below it, spelled as typed. A literal path (`.well-known`) is code. */
export function heading(noun: string): string {
  if (noun.startsWith('.')) return `\`${noun}\``;
  const parts = noun
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .split(/[-_\s]+/)
    .filter(Boolean);
  return parts
    .map((w, i) => {
      if (/^[A-Z0-9]{2,}s?$/.test(w)) return w;
      const lower = w.toLowerCase();
      const titled = titleCase(lower);
      const written = titled !== lower[0].toUpperCase() + lower.slice(1);
      return written ? titled : i === 0 ? titled : lower;
    })
    .join(' ');
}

function renderGroup(g: Group, doc: Document): string {
  const L: string[] = [];
  const spelled = g.rows.length ? spelling(g.rows[0].command, g.name).join(' ') : g.name;
  L.push('---');
  L.push(`title: ${yamlString(g.title)}`);
  L.push(`description: ${yamlString(`The \`hanzo ${spelled}\` commands.`)}`);
  L.push('---');
  L.push('');
  if (g.description) {
    L.push(text(firstSentence(g.description)));
    L.push('');
  }
  // The CLI names a capability at ITS lock, which can be a spelling the
  // document has since swept. Link only where a page exists; a group whose name
  // resolves to nothing gets the count and no dead link.
  const ref = canonical(doc, g.name);
  if (ref) {
    L.push(`[API reference →](/docs/openapi/${ref})`);
    L.push('');
  }
  L.push(...guideLines(g.name));

  // ONE command, spelled out and runnable. A page that lists two hundred
  // commands and shows none of them being run tells a reader what exists and
  // not how to start — and the shortest read is the honest opener, because it
  // is the one that costs nothing to try.
  //
  // It is CHOSEN, not written: the shortest GET the capability actually serves,
  // so the example moves with the surface and can never name a command the
  // table below does not carry. A capability that serves no read gets no
  // example rather than an invented one.
  //
  // A LIST first, because listing what you have is what a person actually runs
  // first and it reads as an invitation; the shortest remaining read otherwise.
  // Anything taking a `<placeholder>` is skipped — an example you must edit
  // before it runs is not an example.
  const reads = g.rows.filter(
    (r) => r.op.method.toUpperCase() === 'GET' && !r.command.includes('<'),
  );
  // SHALLOWEST first, not shortest: depth is how central a noun is, so
  // `hanzo iam service-accounts list` opens the page and `hanzo iam scim v2
  // Users list` does not, even though the SCIM one is the shorter string.
  const depth = (c: string) => c.split(/\s+/).length;
  const shortest = (rs: typeof reads) =>
    [...rs].sort((a, b) => depth(a.command) - depth(b.command) || a.command.length - b.command.length)[0];
  const first = shortest(reads.filter((r) => / list$/.test(r.command))) ?? shortest(reads);
  if (first) {
    L.push('```bash');
    L.push(first.command.replace(/\s*\\\n\s*/g, ' '));
    L.push('```');
    L.push('');
    L.push(
      'Every command takes `--json` for the raw response and `--help` for its own ' +
        'flags. Sign in once with `hanzo auth login`; the commands below use that ' +
        'session, and the org they act in is the one it carries.',
    );
    L.push('');
  }

  // Grouped by the NOUN the command acts on, nouns and commands both in
  // alphabetical order. The rows arrive in the order the document happens to
  // list its operations, which is neither, so a reader scanning for "the one
  // that downloads a document" had to read all of them.
  //
  // The HTTP route is not a column. It is how the command is implemented, not
  // how it is used, and repeating it per row made the widest column in the
  // table the one a CLI reader never needs. The reference is linked once above.
  const byNoun = new Map<string, { one: string; what: string }[]>();
  for (const { op, command, cmd } of g.rows) {
    // The multi-flag form breaks a command across lines for a code block; a
    // table row needs the one-line spelling.
    const one = command.replace(/\s*\\\n\s*/g, ' ');
    // `hanzo <capability> <noun> <verb> …` — the noun is the word after the
    // capability, and a command with no noun acts on the capability itself.
    const parts = words(cmd, g.name);
    const noun = parts.length > 1 ? parts[0] : '';
    const list = byNoun.get(noun) ?? [];
    list.push({ one, what: text(firstSentence(op.summary || op.description)) });
    byNoun.set(noun, list);
  }

  for (const noun of [...byNoun.keys()].sort()) {
    if (noun) {
      L.push(`### ${heading(noun)}`);
      L.push('');
    }
    L.push('| Command | What it does |');
    L.push('|---|---|');
    for (const r of byNoun.get(noun)!.sort((a, b) => a.one.localeCompare(b.one))) {
      L.push(`| \`${r.one.replace(/\|/g, '\\|')}\` | ${r.what} |`);
    }
    L.push('');
  }
  return L.join('\n');
}

function renderIndex(gs: Group[], commands: number, covered: number): string {
  const total = gs.reduce((n, g) => n + g.rows.length, 0);
  const L: string[] = [];
  L.push('---');
  L.push('title: CLI');
  L.push(
    `description: ${yamlString(
      `The \`hanzo\` command line — ${total} commands across ${gs.length} capabilities, generated from the CLI's own command table.`,
    )}`,
  );
  L.push('icon: SquareTerminal');
  L.push('---');
  L.push('');
  L.push('# The `hanzo` command line');
  L.push('');
  L.push(
    'Every Hanzo capability is a real subcommand — there is no `hanzo api` passthrough. ' +
      'The command tree is folded from the same OpenAPI document the SDKs and the MCP tools ' +
      'come from, so a command exists exactly where an operation does.',
  );
  L.push('');
  L.push('```bash');
  L.push('curl -fsSL hanzo.sh | sh');
  L.push('hanzo auth login');
  L.push('```');
  L.push('');
  L.push('| | |');
  L.push('|---|---|');
  L.push(`| **Commands** | ${total} |`);
  L.push(`| **Capabilities** | ${gs.length} |`);
  L.push('');
  // The gap is stated, not hidden: the CLI is pinned to its own commit, and a
  // command whose route the public contract does not carry has no page to link
  // to. Saying how many keeps the number honest as both sides move.
  if (commands > total) {
    L.push(
      `> ${commands - total} of the CLI's ${commands} commands call an address the public ` +
        'API document does not carry — the operator surface, and routes the CLI\'s own pin ' +
        'is ahead of or behind on. They are omitted here rather than linked to a page that ' +
        'does not exist.',
    );
    L.push('');
  }
  if (covered > gs.length) {
    L.push(
      `> ${covered - gs.length} capabilities have no \`hanzo\` command yet. Their operations ` +
        'are reachable over HTTP, from the SDKs and through MCP.',
    );
    L.push('');
  }
  L.push('## Command groups');
  L.push('');
  L.push('| Group | Commands | What it is |');
  L.push('|---|---|---|');
  for (const g of gs) {
    const spelled = g.rows.length ? spelling(g.rows[0].command, g.name).join(' ') : g.name;
    L.push(
      `| [\`hanzo ${spelled}\`](/docs/cli/${g.name}) | ${g.rows.length} | ${text(
        firstSentence(g.description),
      )} |`,
    );
  }
  L.push('');
  return L.join('\n');
}

/** The same nine domains the reference is grouped by — one taxonomy, not two. */
function sidebar(gs: Group[]): string[] {
  const have = new Set(gs.map((g) => g.name));
  const out: string[] = [];
  for (const d of domains()) {
    const names = d.tags.filter((t) => have.has(t));
    if (!names.length) continue;
    const mark = icon(d.id);
    out.push(`---${mark ? `[${mark}]` : ''}${d.title}---`);
    out.push(...names);
  }
  return out;
}

export async function genCliPages(): Promise<void> {
  const doc = loadDocument(DOCUMENT);
  const table = loadCliTable();
  const gs = groups(doc, table);

  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  // Every group is a FOLDER — `<name>/index.mdx` — for the reason the reference
  // is: one capability is called `index` (Hanzo Index, full-text search), and
  // flat files put its page at the same filename as this section's own. One
  // shape for all of them retires the special case.
  for (const g of gs) {
    const folder = path.join(OUT_DIR, g.name);
    fs.mkdirSync(folder, { recursive: true });
    fs.writeFileSync(path.join(folder, 'index.mdx'), renderGroup(g, doc));
    // Never `['index']` — the same shape the reference uses, for the same
    // reason. A folder's own `index.mdx` is already its landing page; the tree
    // builder resolves it before it reads `pages`. Naming it demotes the page
    // from BEING the folder to being a child OF it, so the sidebar reads
    // `Agents > Agents` — once per capability. The folder holds one page; its
    // only children are the product's guides, as links.
    fs.writeFileSync(
      path.join(folder, 'meta.json'),
      JSON.stringify({ title: g.title, pages: guidePages(g.name), collapsible: false }, null, 2) +
        '\n',
    );
  }
  fs.writeFileSync(
    path.join(OUT_DIR, 'index.mdx'),
    renderIndex(gs, table.size, doc.products.length),
  );
  fs.writeFileSync(
    path.join(OUT_DIR, 'meta.json'),
    JSON.stringify(
      {
        title: 'CLI',
        description: "The `hanzo` command line, one page per capability.",
        // Not led by `index`, and here it is worse than redundant: a name in
        // `pages` resolves to a FOLDER before it resolves to a file, and `index`
        // is Hanzo Index — a capability with a folder of its own. The entry
        // published that capability twice and left this section with no landing
        // page at all.
        pages: sidebar(gs),
      },
      null,
      2,
    ) + '\n',
  );

  const total = gs.reduce((n, g) => n + g.rows.length, 0);
  console.log(
    `[cli-ref] ${gs.length} command groups, ${total} of the CLI's ${table.size} commands ` +
      `call a public operation`,
  );
}

if (import.meta.main) {
  genCliPages().catch((e) => {
    console.error('[cli-ref] failed', e);
    process.exit(1);
  });
}
