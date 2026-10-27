import fs from 'node:fs';
import path from 'node:path';
import { parse } from './emit-redirects';

/**
 * Put every page's Markdown twin at the address the edge serves it from.
 *
 * The twins prerender under `llms.mdx/<page>/content.md` (app/llms.mdx), the one
 * shape a route can take beside the docs route. This copies each to
 * `<page>.md` — `/` -> `/index.md`, `/docs/a/b` -> `/docs/a/b.md` — which is
 * what `<link rel="alternate" type="text/markdown">`, llms.txt and the edge's
 * `Accept: text/markdown` rewrite name. An alias page emit-redirects wrote gets
 * its target's twin, so a Markdown client following an old link reads the page
 * a browser lands on.
 */

const APP = path.resolve(import.meta.dirname, '..');
const OUT = path.join(APP, 'out');

/** `llms.mdx/docs/a/content.md` -> `docs/a.md`; `llms.mdx/content.md` -> `index.md`. */
export function destination(rel: string): string {
  const dir = path.posix.dirname(rel.split(path.sep).join('/'));
  return dir === '.' ? 'index.md' : `${dir}.md`;
}

function walk(dir: string, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

/** Pages served as HTML that are not documents: the 404, the sign-in callback. */
const NOT_DOCUMENTS = new Set(['404.html', 'callback/index.html', '_not-found/index.html']);
const STUB = '<meta name="generator" content="emit-redirects">';

/** The twin file for a served path: `/docs/a/` and `/docs/a/index.html` -> `docs/a.md`. */
function twin(p: string): string {
  const clean = p.replace(/[?#].*$/, '').replace(/(^|\/)index\.html$/, '').replace(/\.html$/, '').replace(/\/+$/, '');
  return clean === '' ? 'index.md' : `${clean.replace(/^\//, '')}.md`;
}

export function place(out = OUT): { copied: number; aliases: number; missing: string[] } {
  if (!fs.existsSync(path.join(out, 'llms.mdx'))) return { copied: 0, aliases: 0, missing: [] };
  let copied = 0;
  for (const file of walk(path.join(out, 'llms.mdx'))) {
    if (path.basename(file) !== 'content.md') continue;
    const dest = path.join(out, destination(path.relative(path.join(out, 'llms.mdx'), file)));
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(file, dest);
    copied++;
  }

  // An alias's twin is its target's. Exact rules only, internal targets only.
  let aliases = 0;
  const redirects = path.join(APP, 'public/_redirects');
  if (fs.existsSync(redirects)) {
    for (const { from, to } of parse(fs.readFileSync(redirects, 'utf8')).exact) {
      if (!to.startsWith('/')) continue;
      const target = path.join(out, twin(to));
      const alias = path.join(out, twin(from));
      if (!fs.existsSync(target) || fs.existsSync(alias)) continue;
      fs.mkdirSync(path.dirname(alias), { recursive: true });
      fs.copyFileSync(target, alias);
      aliases++;
    }
  }

  // Every document the export serves as HTML has a twin, or is named here.
  const missing: string[] = [];
  for (const file of walk(out)) {
    if (!file.endsWith('.html')) continue;
    const rel = path.relative(out, file).split(path.sep).join('/');
    if (NOT_DOCUMENTS.has(rel) || rel.startsWith('llms.mdx/') || rel.startsWith('_next/')) continue;
    // An alias: its twin came from its target above, or it leaves the site.
    if (fs.readFileSync(file, 'utf8').includes(STUB)) continue;
    if (!fs.existsSync(path.join(out, twin(`/${rel}`)))) missing.push(`/${rel}`);
  }
  return { copied, aliases, missing };
}

export function run(): void {
  const { copied, aliases, missing } = place();
  if (!copied) return; // not an export build
  console.log(`[twins] ${copied} pages at <page>.md, ${aliases} aliases, ${missing.length} HTML pages without one`);
  for (const m of missing.slice(0, 50)) console.warn(`[twins] no Markdown twin: ${m}`);
}
