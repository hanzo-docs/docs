import type { Suggestion } from '@/components/layouts/not-found';
import { retrieveDocs } from '@/lib/hanzo/retrieve';

// "Did you mean" suggestions for a 404 path — the same native retrieval the AI
// chat grounds on (one and one way to query the docs index). retrieveDocs
// dedupes by page and degrades to no suggestions when the index/key isn't live.
export async function getSuggestions(pathname: string): Promise<Suggestion[]> {
  const hits = await retrieveDocs(pathname, 5);
  return hits.map((hit) => ({ id: hit.id, href: hit.url, title: hit.title }));
}
