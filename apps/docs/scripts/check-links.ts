import fs from 'node:fs';
import path from 'node:path';

/**
 * Every link a reader can click, checked against the bytes that ship.
 *
 * The export is the only place this question has an answer. A link lives in MDX,
 * in a component, in a generated page or in a redirect stub, and only after the
 * build are all four in one directory — so scanning sources finds some of them
 * and trusts the rest. `next-validate-link` (pnpm lint) reads the MDX; this reads
 * the site.
 *
 * Resolution is the SERVING ladder, not the filesystem: the edge answers "/docs"
 * with docs.html or docs/index.html (ingress staticFiles pageCandidates, cloud
 * apps/sites candidates), so a link is alive if any of those exist. Checking for
 * a literal file would report every route in the site as dead.
 */

const APP = path.resolve(import.meta.dirname, '..');

/** Anchors only. `data-href` and `<link rel=preload href>` are not links a reader follows. */
const ANCHOR = /<a\b[^>]*?\shref="([^"]*)"/gi;

function pages(dir: string, out: string[] = []): string[] {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) pages(p, out);
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

/** The URL path an exported file is served at. */
function urlOf(out: string, file: string): string {
  const rel = '/' + path.relative(out, file).split(path.sep).join('/');
  return rel.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
}

const SITE = 'docs.hanzo.ai';

/**
 * Resolve an href against the page it sits on; null when it leaves the site.
 *
 * An absolute link to our own host is one of ours: a page that spells its
 * sibling `https://docs.hanzo.ai/docs/…` can rot exactly like a rooted one, and
 * several do — the shared footer and the product registry both write links that
 * way.
 */
export function target(href: string, from: string): string | null {
  const h = href.trim();
  if (!h || h.startsWith('#')) return null;
  let u: URL;
  try {
    u = new URL(h, `https://${SITE}${from}`);
  } catch {
    return null; // not a URL at all (a template that never rendered, say)
  }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
  if (u.hostname !== SITE) return null;
  return decodeURIComponent(u.pathname);
}

/** Does the export hold this path, the way the edge resolves it? */
export function holds(out: string, p: string): boolean {
  const rel = p.replace(/^\/+/, '').replace(/\/+$/, '');
  const file = (x: string) => {
    try {
      return fs.statSync(path.join(out, x)).isFile();
    } catch {
      return false;
    }
  };
  if (rel === '') return file('index.html');
  return file(rel) || file(`${rel}.html`) || file(`${rel}/index.html`);
}

export function check(out = path.join(APP, 'out')): number {
  if (!fs.existsSync(out)) return 0; // not an export build

  const dead = new Map<string, string>(); // target -> one page that links it
  let links = 0;

  for (const file of pages(out)) {
    const from = urlOf(out, file);
    const html = fs.readFileSync(file, 'utf8');
    for (const m of html.matchAll(ANCHOR)) {
      const p = target(m[1].replace(/&amp;/g, '&'), from);
      if (p === null) continue;
      links++;
      if (!holds(out, p) && !dead.has(p)) dead.set(p, from);
    }
  }

  console.log(`[links] ${links} internal links, ${dead.size} pointing nowhere`);
  // Sorted, so two builds of the same site print the same list.
  for (const [p, from] of [...dead].sort()) console.warn(`[links] dead: ${p} (linked from ${from})`);
  return dead.size;
}
