import { publishableKey, searchBackend, searchEndpoint, searchIndex } from '@/lib/hanzo/client';

// The ONE retrieval path for the docs corpus, reused by the AI chat (grounding)
// and the 404 page (suggestions). It queries the SAME native search index the
// ⌘K search uses — Meilisearch `POST {endpoint}/indexes/{index}/search`
// (backend 'meilisearch', the canonical contract in
// packages/core/src/search/client/hanzo.ts) or the cloud `POST {endpoint}`
// search gateway. Auth is the PUBLISHABLE search key: read-only, ships in the
// static bundle by design (like an Algolia search key), never the gateway
// secret. Retrieval is NOT balance-gated (it hits Meilisearch, not the billed
// gateway), so grounding works the instant a valid search key is set — even
// before the chat wallet is funded. Any failure resolves to `[]` and every
// caller degrades gracefully: the chat answers ungrounded, suggestions hide.

export interface DocHit {
  id: string;
  title: string;
  url: string;
  content: string;
  breadcrumbs?: string[];
}

interface RawHit {
  id?: string;
  page_id?: string;
  title?: string;
  url?: string;
  section_id?: string;
  content?: string;
  breadcrumbs?: string[];
}

// Cap per-hit content so a handful of chunks stay well inside the model's
// context budget while still carrying enough signal to ground an answer.
const MAX_CONTENT = 1200;

export async function retrieveDocs(
  query: string,
  limit = 8,
  signal?: AbortSignal,
): Promise<DocHit[]> {
  const q = query.trim();
  // No key → no retrieval (fail secure: never fire an unauthenticated request).
  if (!q || !publishableKey) return [];

  const url =
    searchBackend === 'meilisearch'
      ? `${searchEndpoint.replace(/\/$/, '')}/indexes/${searchIndex}/search`
      : searchEndpoint;
  const body =
    searchBackend === 'meilisearch'
      ? { q, limit: limit * 3 } // over-fetch: hits are section-level, we dedupe to pages
      : { query: q, mode: 'hybrid', limit: limit * 3 };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${publishableKey}`,
      },
      body: JSON.stringify(body),
      signal,
    });
    if (!res.ok) return [];

    const data = (await res.json()) as { hits?: RawHit[] };
    const hits = Array.isArray(data.hits) ? data.hits : [];

    // One entry per page (the top-ranked section stands in for the page): breadth
    // of relevant pages beats many sections of one, and citations stay clean.
    const seen = new Set<string>();
    const out: DocHit[] = [];
    for (const h of hits) {
      if (!h.url) continue;
      const pageKey = h.page_id ?? h.url;
      if (seen.has(pageKey)) continue;
      seen.add(pageKey);
      out.push({
        id: h.id ?? h.url,
        title: h.title ?? h.url,
        url: h.url,
        content: (h.content ?? '').slice(0, MAX_CONTENT),
        breadcrumbs: h.breadcrumbs,
      });
      if (out.length >= limit) break;
    }
    return out;
  } catch {
    return [];
  }
}
