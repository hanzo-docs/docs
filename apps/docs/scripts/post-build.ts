import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  createDocument,
  search,
  type Doc,
  type SharedDocument,
} from '@hanzo/docs-core/search/flexsearch';
import { GENERATED } from './check-endpoints';

// Search, proven — on the build that produced it, not on a deploy.
//
// The corpus the export carries (app/v1/search) is the only thing standing
// between a reader and "no results". It is written by a route handler, so every
// way it can go wrong ends with a file that exists: an empty corpus, a corpus
// of titles with no page bodies in it, a corpus that no longer answers to the
// words a reference page is made of. None of those break a build, and all of
// them read, from outside, exactly like search being off.
//
// So the build asks. It indexes the exported file the same way a browser will —
// the same createDocument, the same search — then takes text out of the pages
// the generators wrote and requires the index to hand those pages back. What
// this proves is what a reader gets, because it is the same code over the same
// bytes. It has no key and reaches no network: it can run anywhere the build
// runs, and it runs on every build.
//
// A failure here fails the build. There is no degraded mode: an export whose
// search does not work is not a release.

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(SCRIPT_DIR, '..');
const CONTENT = path.join(APP_ROOT, 'content/docs');

/**
 * Where the route's answer lands: the export when there is one, the build
 * output otherwise. Same bytes either way.
 */
const CORPUS = [
  path.join(APP_ROOT, 'out/v1/search'),
  path.join(APP_ROOT, '.next/server/app/v1/search.body'),
];

/** Frontmatter, code fences and headings — everything a page is not saying in its body. */
const FRONTMATTER = /^---\n[\s\S]*?\n---\n/;
const HEADING = /^#{1,6} .*$/gm;
/** `like_this` — the identifiers a reference page is written in: fields, enum values, flags. */
const IDENTIFIER = /`([a-z][a-z0-9_.-]{4,})`/g;

/**
 * How many candidate terms a page is allowed to offer. The rarest of a dozen is
 * already rare; reading more costs time and finds nothing better.
 */
const CANDIDATES = 12;

/**
 * Enough hits to tell rare terms apart. A term at this ceiling is a word the
 * whole corpus uses — `limit` is a real word, and no page is "the limit page".
 */
const CEILING = 500;

interface Probe {
  /** Page the term was taken out of. */
  url: string;
  /** Term that appears in that page's body and not in its title or headings. */
  term: string;
  /** Corpus documents that term reaches. 1 means it belongs to this page alone. */
  hits: number;
}

function walk(dir: string, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.mdx') || e.name.endsWith('.md')) out.push(p);
  }
  return out;
}

/** `content/docs/openapi/kv.mdx` -> `/docs/openapi/kv`, `.../index.mdx` -> its directory. */
function pageUrl(file: string): string {
  const rel = path.relative(CONTENT, file).replace(/\.mdx?$/, '');
  const slug = rel.endsWith('/index') ? rel.slice(0, -'/index'.length) : rel;
  return `/docs/${slug}`;
}

/**
 * The terms a page's BODY carries that its title and headings do not.
 *
 * A term from a heading proves nothing this build needs proving: headings were
 * searchable even while the bodies were not. What is left is what a reference
 * page is made of — field names, enum values, flags.
 */
function bodyTerms(file: string): string[] {
  const src = fs.readFileSync(file, 'utf8');
  const front = src.match(FRONTMATTER)?.[0] ?? '';
  const body = src.slice(front.length);
  const headings = (body.match(HEADING) ?? []).join('\n');
  const excluded = `${front}\n${headings}`.toLowerCase();

  const terms = new Set<string>();
  for (const m of body.matchAll(IDENTIFIER)) {
    const term = m[1];
    if (excluded.includes(term.toLowerCase())) continue;
    terms.add(term);
    if (terms.size === CANDIDATES) break;
  }

  return [...terms];
}

/** Documents the index hands back for a term, counted, capped at the ceiling. */
async function reach(index: ReturnType<typeof createDocument>, term: string): Promise<number> {
  const found = await index.searchAsync(term, { index: 'content', limit: CEILING });
  return found.length === 0 ? 0 : found[0].result.length;
}

/**
 * The rarest thing a page says.
 *
 * Rarity is measured against the corpus itself rather than guessed from the
 * shape of the word, because it decides what "found" can mean: a term two
 * documents carry proves the page is reachable by it, and `limit` — which every
 * page uses — proves only that some page mentions limits. It also bounds the
 * search that follows, so the check reads every document the term reaches
 * instead of the first screenful.
 */
async function rarest(
  index: ReturnType<typeof createDocument>,
  file: string,
  url: string,
): Promise<Probe | undefined> {
  let best: Probe | undefined;

  for (const term of bodyTerms(file)) {
    const hits = await reach(index, term);
    // Zero is the answer this whole script exists to catch: a word printed on
    // the page that the index has never heard of. Nothing is rarer, and nothing
    // is more wrong — stop here and let it fail.
    if (hits === 0) return { url, term, hits };
    if (!best || hits < best.hits) best = { url, term, hits };
    if (best.hits === 1) break;
  }

  return best;
}

function readCorpus(): SharedDocument[] {
  const found = CORPUS.find((p) => fs.existsSync(p));
  if (!found) {
    throw new Error(
      `no search corpus was exported — looked for ${CORPUS.map((p) => path.relative(APP_ROOT, p)).join(' and ')}. ` +
        `app/v1/search/route.ts writes it; without it the search dialog has nothing to fetch.`,
    );
  }

  const bytes = fs.statSync(found).size;
  const data = JSON.parse(fs.readFileSync(found, 'utf8'));
  const docs: SharedDocument[] =
    data.type === 'i18n' ? Object.values(data.docs).flat() : data.docs;

  if (!Array.isArray(docs) || docs.length === 0) {
    throw new Error(`the exported search corpus (${path.relative(APP_ROOT, found)}) holds no documents`);
  }

  console.log(
    `[search] corpus ${path.relative(APP_ROOT, found)}: ${docs.length} documents, ` +
      `${docs.filter((d) => d.type === 'page').length} pages, ${(bytes / 1e6).toFixed(1)}MB`,
  );
  return docs;
}

async function main() {
  const docs = readCorpus();

  const index = createDocument();
  for (const doc of docs) index.add(doc.id, doc as Doc);

  const pages = new Set(docs.filter((d) => d.type === 'page').map((d) => d.url));

  let checked = 0;
  let alone = 0;
  const missing: string[] = [];
  const unsearchable: Probe[] = [];

  for (const dir of GENERATED) {
    const files = walk(path.join(CONTENT, dir));
    const probes: Probe[] = [];

    for (const file of files) {
      const url = pageUrl(file);
      // Every generated page has to BE in the corpus before anything can find it.
      if (!pages.has(url)) {
        missing.push(url);
        continue;
      }

      const probe = await rarest(index, file, url);
      if (probe) probes.push(probe);
    }

    for (const probe of probes) {
      // Read every document the term reaches, not the first screenful: with the
      // limit set past its reach, absence from these results is absence from the
      // index, and never a page that ranked 201st.
      const results = await search(index, probe.term, undefined, probe.hits + 5);
      const hit = results.some((r) => r.url === probe.url || r.url.startsWith(`${probe.url}#`));
      if (!hit) unsearchable.push(probe);
      if (probe.hits === 1) alone++;
      checked++;
    }

    console.log(
      `[search] ${dir}: ${files.length} generated pages, ${probes.length} searched for the rarest term their body carries`,
    );
  }

  if (checked === 0) {
    throw new Error(
      'no generated page yielded a body term to search for — the probe stopped reading pages, so this build proved nothing',
    );
  }

  if (missing.length > 0) {
    for (const url of missing.slice(0, 20)) console.error(`  not in the corpus: ${url}`);
    throw new Error(`${missing.length} generated pages are missing from the search corpus`);
  }

  if (unsearchable.length > 0) {
    for (const p of unsearchable.slice(0, 20))
      console.error(`  ${p.url}: "${p.term}" reaches ${p.hits} documents, none of them this page`);
    throw new Error(
      `${unsearchable.length} of ${checked} generated pages cannot be found by text they alone carry`,
    );
  }

  console.log(
    `[search] ${checked} generated pages found by their own body text — ${alone} by a term no other page in the corpus carries. Search works.`,
  );
}

await main().catch((e) => {
  console.error('[search] FAIL —', e instanceof Error ? e.message : e);
  process.exit(1);
});
