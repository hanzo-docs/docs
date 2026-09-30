import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Nodes, Root } from 'mdast';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';
import YAML from 'yaml';

// Zen is told in Zen's names.
//
// A Zen page reads as Zen from its title to its last table. The upstream models
// some Zen weights are built from are named in two places only, and both carry
// `data-upstream` so this check can step over them:
//
//   Architecture       the loader string from the weights' own config.json or
//                      GGUF header, which a developer passes verbatim
//   License & attribution   the fine print at the bottom of the page
//
// Everything else a reader meets is read here: the title and description (the
// page's meta and OG tags), headings, prose, tables, code, image alt text and
// the string props of components. A name from zen.upstream in any of it fails
// the build. The list lives in that one file.

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MODELS = path.join(APP, 'content/docs/models');
export const NAMES = path.join(APP, 'zen.upstream');

/** The Zen pages: the families overview, which carries Zen's generations, and every zen page. */
export const isZen = (rel: string) => rel === 'index.mdx' || rel.startsWith('zen');

/** The names in zen.upstream: one per line, `#` comments and blank lines ignored. */
export function loadNames(file = NAMES): string[] {
  const names = fs
    .readFileSync(file, 'utf8')
    .split('\n')
    .map((l) => l.replace(/#.*$/, '').trim())
    .filter(Boolean);
  if (!names.length) throw new Error(`${file} names nothing, so the check would pass anything`);
  return names;
}

/** Any of `names` as a whole word, in any case: no letter directly before or after it. */
export function matcher(names: string[]): RegExp {
  const alt = names.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  return new RegExp(`(?<![a-z])(?:${alt})(?![a-z])`, 'gi');
}

type Jsx = Extract<Nodes, { type: 'mdxJsxFlowElement' | 'mdxJsxTextElement' }>;

const isJsx = (n: Nodes): n is Jsx =>
  n.type === 'mdxJsxFlowElement' || n.type === 'mdxJsxTextElement';

/** Every string of an MDX page a reader reads, leaving out `data-upstream` elements. */
export function readThrough(src: string): string[] {
  const out: string[] = [];
  let body = src;
  const fm = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(src);
  if (fm) {
    const meta = (YAML.parse(fm[1]) ?? {}) as Record<string, unknown>;
    for (const key of ['title', 'description']) {
      if (typeof meta[key] === 'string') out.push(meta[key]);
    }
    body = src.slice(fm[0].length);
  }
  const visit = (node: Nodes) => {
    if (isJsx(node)) {
      if (node.attributes.some((a) => a.type === 'mdxJsxAttribute' && a.name === 'data-upstream'))
        return;
      for (const a of node.attributes) {
        if (a.type === 'mdxJsxAttribute' && typeof a.value === 'string') out.push(a.value);
      }
    }
    // Imports, exports and `{/* comments */}` are the page's source, never rendered.
    const unread =
      node.type === 'mdxjsEsm' ||
      ((node.type === 'mdxFlowExpression' || node.type === 'mdxTextExpression') &&
        /^\s*\/\*[\s\S]*\*\/\s*$/.test(node.value));
    if ('value' in node && typeof node.value === 'string' && !unread) out.push(node.value);
    if ('alt' in node && node.alt) out.push(node.alt);
    if ('title' in node && node.title) out.push(node.title);
    if ('children' in node) for (const child of node.children) visit(child as Nodes);
  };
  visit(remark().use(remarkMdx).use(remarkGfm).parse(body) as Root);
  return out;
}

export interface ZenCheck {
  /** The Zen pages read, relative to content/docs/models. */
  pages: string[];
  /** Page, the name found, and the text it was found in. */
  found: Array<[string, string, string]>;
}

export function checkZen(): ZenCheck {
  const re = matcher(loadNames());
  const pages = fs
    .readdirSync(MODELS, { recursive: true, encoding: 'utf8' })
    .filter((rel) => rel.endsWith('.mdx') && isZen(rel))
    .sort();
  // A check over no pages passes everything: the section moved, not the story.
  if (!pages.length) throw new Error(`no Zen pages under ${MODELS}`);
  const found: ZenCheck['found'] = [];
  for (const rel of pages) {
    for (const text of readThrough(fs.readFileSync(path.join(MODELS, rel), 'utf8'))) {
      for (const m of text.matchAll(re)) {
        const at = m.index ?? 0;
        found.push([
          rel,
          m[0],
          text.slice(Math.max(0, at - 40), at + m[0].length + 40).replace(/\s+/g, ' '),
        ]);
      }
    }
  }
  return { pages, found };
}

/** Report every upstream name a Zen page says outside `data-upstream`. */
export function report(found: ZenCheck['found']): void {
  for (const [page, name, text] of found)
    console.error(`   models/${page}: "${name}" in …${text}…`);
}

if (import.meta.main) {
  const { pages, found } = checkZen();
  if (found.length) {
    console.error(`[zen] FAIL — ${found.length} upstream name(s) outside data-upstream:`);
    report(found);
    process.exit(1);
  }
  console.log(
    `[zen] ${pages.length} Zen pages read; no name from zen.upstream outside data-upstream`,
  );
}
