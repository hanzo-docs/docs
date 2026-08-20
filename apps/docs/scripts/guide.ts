import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// WHERE A PRODUCT'S PROSE GUIDE LIVES — asked once, answered once.
//
// Two scripts need this and they need opposite halves of it: the reference
// generator wants the ROUTE, so a product page can link down to its guide;
// link-api-refs wants the FILE, so it can staple the reverse callout into that
// guide. They used to each carry their own copy of the rule and their own table
// of exceptions, and the copies had already diverged — one resolved only
// `content/docs/services/<svc>`, the other the same plus three named pages —
// which is why every top-level guide on the site was linked in one direction and
// not the other.
//
// So the rule is here, once, and both halves come out of the same lookup: the
// file IS the route. A product whose guide moves, or whose page is deleted, moves
// or disappears from BOTH directions on the next build, with nothing to remember.
//
// The lookup is by NAME, on disk, in the order a reader would guess:
//
//	content/docs/services/<svc>.mdx        →  /docs/services/<svc>
//	content/docs/services/<svc>/index.mdx  →  /docs/services/<svc>
//	content/docs/<svc>.mdx                 →  /docs/<svc>
//	content/docs/<svc>/index.mdx           →  /docs/<svc>
//
// ALIASES are the only hand-written part, and each is a page whose slug is a
// deliberate editorial choice rather than the product's name. There is no fourth
// kind of exception: anything else is resolved by looking.

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(SCRIPT_DIR, '..');
const CONTENT = path.join(APP_ROOT, 'content/docs');

/**
 * Products whose guide is filed under a slug that is not the product's name.
 *
 * `approvals` is the one that is not a slug choice: policy and approvals are two
 * halves of one thing — the rules that hold a call, and the queue it waits in —
 * and a reader needs them explained together or not at all. One guide, so both
 * references link to it and it links back to both.
 */
const ALIAS: Record<string, string> = {
  ai: 'llm',
  app: 'services/paas',
  approvals: 'policy',
  evals: 'experiments',
};

/**
 * Two slugs are SECTION LANDINGS that happen to share a product's name, and
 * neither is a guide for it.
 *
 *	index     `services/index.mdx` is the services catalogue. The document does
 *	          serve a product called index — full-text search — and matching it
 *	          here pointed the Index reference at the whole catalogue.
 *	projects  `projects/index.mdx` is the hub for other repos' mirrored docs. The
 *	          document also serves a Projects API, and matching it stapled that
 *	          API's callout onto the mirror's front page.
 */
const NOT_A_GUIDE = new Set(['index', 'projects']);

const at = (slug: string): string | null => {
  for (const rel of [`${slug}.mdx`, path.join(slug, 'index.mdx')]) {
    const file = path.join(CONTENT, rel);
    if (fs.existsSync(file)) return file;
  }
  return null;
};

/** The slug a product's guide is filed under, or null when it has no guide. */
export function guideSlug(svc: string): string | null {
  if (NOT_A_GUIDE.has(svc)) return null;
  const alias = ALIAS[svc];
  if (alias) return at(alias) ? alias : null;
  for (const slug of [`services/${svc}`, svc]) if (at(slug)) return slug;
  return null;
}

/** The file on disk, for a pass that edits the guide. */
export function guideFile(svc: string): string | null {
  const slug = guideSlug(svc);
  return slug ? at(slug) : null;
}

/** The route, for a page that links to the guide. */
export function guideHref(svc: string): string | null {
  const slug = guideSlug(svc);
  return slug ? `/docs/${slug}` : null;
}
