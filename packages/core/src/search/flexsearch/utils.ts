import Search, { type DocumentOptions, type Document, type DocumentData } from 'flexsearch';
import { createContentHighlighter, type SortedResult } from '..';
import type { SharedDocument } from '../server/build-doc';

export type Doc = SharedDocument & DocumentData;

export async function search(
  index: Document<Doc>,
  query: string,
  tag?: string | string[],
  limit = 60,
) {
  const arr = await index.searchAsync(query, {
    index: 'content',
    limit,
    tag: tag
      ? ({
          tags: tag,
        } as Record<string, string>)
      : undefined,
  });
  const out: SortedResult[] = [];
  if (arr.length === 0) return out;

  const results = arr[0].result;
  const highlighter = createContentHighlighter(query);
  // page id -> heading/content item
  const grouped = new Map<string, Doc[]>();

  for (const id of results) {
    const doc = index.get(id);
    if (!doc) continue;
    let list = grouped.get(doc.page_id);
    if (!list) {
      list = [];
      grouped.set(doc.page_id, list);
    }

    if (doc.type !== 'page') {
      list.push(doc);
    }
  }

  for (const [page_id, items] of grouped) {
    const page = index.get(page_id);
    if (!page) continue;

    out.push({
      id: page_id,
      type: 'page',
      content: highlighter.highlightMarkdown(page.content),
      breadcrumbs: page.breadcrumbs,
      url: page.url,
    });

    for (const item of items) {
      out.push({
        id: item.id,
        // A section can be a whole reference table; a result row shows the part
        // that matched, not the section.
        content: highlighter.highlightExcerpt(item.content),
        breadcrumbs: item.breadcrumbs,
        type: item.type,
        url: item.url,
      });
    }
  }

  return out;
}

/**
 * The ONE index shape. A build and a browser both call this, so the tokenizer a
 * query is cut with is always the tokenizer the documents were cut with.
 *
 * `forward` indexes every prefix of every word, which is what search-as-you-type
 * needs; `full` would also match inside words, at several times the memory.
 */
export function createDocument(options?: DocumentOptions<Doc>) {
  return new Search.Document<Doc>({
    tokenize: 'forward',
    ...options,
    document: {
      id: 'id',
      index: ['content'],
      tag: ['tags'],
      store: true,
      ...options?.document,
    },
  });
}
