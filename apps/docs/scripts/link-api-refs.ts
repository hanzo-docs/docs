import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DOCUMENT, loadDocument } from './openapi-doc';
import { guideFile } from './guide';

// Cross-link the human guides to their API reference (the other half of the
// bidirectional link — gen-openapi-pages.ts links reference -> guide). For every
// product that has an OpenAPI spec AND a prose guide, insert one prominent
// "API reference" callout near the top of the guide.
//
// Source-derived (iterates THE DOCUMENT, not a hardcoded list) and idempotent,
// so it is safe to re-run. It edits committed guide MDX in place.
//
// IT RUNS IN THE BUILD, which is the only way the link can be trusted. It used
// to be a script a person remembered to run: not in package.json, not in
// pre-build, referenced from nowhere in the repo. So the reference→guide half of
// the link was generated on every build and the guide→reference half was
// whatever somebody last swept by hand, and only one of the two could be stale.
// Both halves are now the same pass over the same document, so a product that
// arrives, moves or leaves changes both in the same build.
//
// Where a product's guide lives is scripts/guide.ts's question — the same
// resolver the reference pages link DOWN through, so the two directions cannot
// disagree about which page is the guide.
//
// RECONCILES, not appends. It used to only ever add, which meant a callout
// outlived the product it pointed at: when `db` was renamed `sql` the generated
// page moved to /docs/openapi/sql and services/sql.mdx kept advertising
// /docs/openapi/db — a 404 that nothing failed on. Twelve guides had drifted
// that way. A callout whose product is no longer in the document is now
// removed on the same pass that adds the missing ones, so one run leaves the
// tree consistent with the document and a rename repairs itself.

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(SCRIPT_DIR, '..');
const CONTENT = path.join(APP_ROOT, 'content/docs');

/** The callout this script writes, and the only shape it will remove. */
const CALLOUT = /^> \*\*API reference\*\* · \[[^\]]*\]\(\/docs\/openapi\/([a-z0-9-]+)\)[^\n]*\n?/gm;

function mdxFiles(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (!fs.existsSync(full)) continue; // broken symlink / uninitialised submodule
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      // Vendored upstream docs are not ours to rewrite.
      if (entry !== 'projects') mdxFiles(full, out);
    } else if (entry.endsWith('.mdx')) out.push(full);
  }
  return out;
}

// Products and their titles come from THE document, the same source the
// reference pages are generated from — never from a second per-product file.
const DOC = loadDocument(DOCUMENT);
const TITLES = new Map(DOC.products.map((p) => [p.name, p.title]));

// Insert `block` after the first H1 that follows the frontmatter; if there is no
// H1, insert right after the frontmatter (skipping leading blank/import lines).
function insertCallout(src: string, block: string): string {
  const lines = src.split('\n');
  let i = 0;
  if (lines[0]?.trim() === '---') {
    i = 1;
    while (i < lines.length && lines[i].trim() !== '---') i++;
    i++; // past closing ---
  }
  // Prefer just after the first H1.
  for (let j = i; j < lines.length; j++) {
    if (/^#\s+\S/.test(lines[j])) {
      lines.splice(j + 1, 0, '', block);
      return lines.join('\n');
    }
    if (lines[j].trim() && !/^#{2,}\s/.test(lines[j])) break; // hit body before any H1
  }
  // No H1: skip blank + import lines, then insert.
  while (i < lines.length && (lines[i].trim() === '' || /^import\s/.test(lines[i]))) i++;
  lines.splice(i, 0, block, '');
  return lines.join('\n');
}

/**
 * Drop every callout pointing at a product the document no longer serves.
 * Runs FIRST so the add pass below sees a clean slate — a guide whose product
 * was renamed then gets the new callout in the same run.
 */
function prune(products: Set<string>): number {
  let dropped = 0;
  for (const file of mdxFiles(CONTENT)) {
    const src = fs.readFileSync(file, 'utf8');
    if (!src.includes('/docs/openapi/')) continue;
    const next = src.replace(CALLOUT, (whole, svc: string) => {
      if (products.has(svc)) return whole;
      dropped++;
      return '';
    });
    if (next !== src) fs.writeFileSync(file, next.replace(/\n{3,}/g, '\n\n'));
  }
  return dropped;
}

export function linkApiRefs(): void {
  const specs = DOC.products.map((p) => p.name);
  const dropped = prune(new Set(specs));

  let linked = 0;
  let already = 0;
  const missing: string[] = [];

  for (const svc of specs) {
    const file = guideFile(svc);
    if (!file) {
      missing.push(svc);
      continue;
    }
    const src = fs.readFileSync(file, 'utf8');
    if (src.includes(`/docs/openapi/${svc}`)) {
      already++;
      continue;
    }
    const title = TITLES.get(svc) ?? `${svc} API`;
    const callout = `> **API reference** · [${title} →](/docs/openapi/${svc}) — every endpoint, generated from the OpenAPI spec.`;
    fs.writeFileSync(file, insertCallout(src, callout));
    linked++;
  }

  console.log(`[link-api-refs] dropped ${dropped}, linked ${linked}, already-linked ${already}, no-guide ${missing.length}${missing.length ? ` (${missing.join(', ')})` : ''}`);
}

