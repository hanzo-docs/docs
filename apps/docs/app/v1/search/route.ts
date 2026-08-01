import { source } from '@/lib/source';
import { buildIndexDefault, flexsearchFromSource } from '@hanzo/docs-core/search/flexsearch';
import { getSection } from '@/lib/source/navigation';

// The search corpus this site carries: every page, every section, as data.
//
// docs.hanzo.ai is a static export served by a file server. There is no request
// this site can answer, so search cannot be a query to something — the pages
// have to travel with the site. `staticGET` writes the corpus to /v1/search at
// build time; the dialog (`type: 'flexsearch-static'`) fetches it once, indexes
// it in the browser and searches locally. No key, no service, no network beyond
// the one file.
//
// This is also why the artifact is the corpus and not a prebuilt index: an
// index over this corpus is 54MB to the corpus's 13MB, and the host serves it
// uncompressed, so shipping the index would cost a reader 41MB to save about
// two seconds of indexing. What ships is the smaller, more useful one.
//
// scripts/post-build.ts indexes the exported file and searches it for text only
// a generated reference page has, before the build is allowed to finish.
//
// The dialog's "Products" filter covers Zen LM, Chat, MCP, Dev and ZAP.
// getSection keeps those as distinct sections, so we additionally tag their
// pages `products` for that one filter. The other filters (Services/SDKs/API)
// match the single section tag — tags are a set, so a page can carry both its
// section and `products`.
const PRODUCT_SECTIONS = new Set(['chat', 'llm', 'mcp', 'dev', 'zap']);

function sectionTags(slug: string | undefined): string | string[] {
  const section = getSection(slug);
  return PRODUCT_SECTIONS.has(section) ? [section, 'products'] : section;
}

export const { staticGET: GET } = flexsearchFromSource(source, {
  async buildIndex(page) {
    const tag = sectionTags(page.slugs[0]);

    // OpenAPI pages carry no MDX structured data; index title/description only.
    // (In static-export mode they aren't generated at all, so this is a no-op
    // there — it keeps `next dev`, where specs are present, from throwing.)
    if (page.type === 'openapi') {
      return {
        id: page.url,
        url: page.url,
        title: page.data.title ?? page.url,
        description: page.data.description,
        tag,
        structuredData: { headings: [], contents: [] },
      };
    }

    return { ...(await buildIndexDefault(page)), tag };
  },
});

export const revalidate = false;
