import type { SearchClient } from '../client';
import type { ExportedData } from '../flexsearch';
import type { SharedDocument } from '../server/build-doc';
import type { Document } from 'flexsearch';
import { createDocument, search, type Doc } from '../flexsearch/utils';

export interface FlexsearchStaticOptions {
  /**
   * @defaultValue `/v1/search`
   */
  from?: string;
  locale?: string;
  tag?: string | string[];
}

const cacheMap = new Map<string, Promise<Map<string, Document<Doc>>>>();

export function flexsearchStaticClient(options: FlexsearchStaticOptions = {}): SearchClient {
  const { from = '/v1/search', locale = '', tag } = options;

  let dbs = cacheMap.get(from);
  if (!dbs && typeof window !== 'undefined') {
    dbs = init(from);
    cacheMap.set(from, dbs);
  }

  return {
    deps: [from, locale, tag],
    async search(query) {
      const loaded = await dbs!;
      const db = loaded.get(locale);
      if (!db) return [];
      return search(db, query, tag);
    },
  };
}

async function init(from: string) {
  const res = await fetch(from);

  if (!res.ok)
    throw new Error(
      `failed to fetch the exported search corpus from ${from}, make sure the build exports it and the host serves it.`,
    );

  const data = (await res.json()) as ExportedData;
  const dbs = new Map<string, Document<Doc>>();

  if (data.type === 'i18n') {
    for (const [locale, docs] of Object.entries(data.docs)) {
      dbs.set(locale, await indexDocuments(docs));
    }

    return dbs;
  }

  dbs.set('', await indexDocuments(data.docs));
  return dbs;
}

async function indexDocuments(docs: SharedDocument[]) {
  const index = createDocument();

  for (let i = 0; i < docs.length; i++) {
    index.add(docs[i].id, docs[i] as Doc);
    // Indexing a corpus is seconds of work. Yield often enough that the page
    // keeps painting and the dialog keeps taking keystrokes while it runs.
    if (i % 500 === 499) await new Promise((resolve) => setTimeout(resolve, 0));
  }

  return index;
}
