import type { SearchAPI, SearchServer } from './server';
import Search, { type DocumentOptions } from 'flexsearch';
import { createEndpoint } from './server/endpoint';
import { buildBreadcrumbs, buildIndexDefault, type SharedIndex } from './server/build-index';
import { buildDocuments, type SharedDocument } from './server/build-doc';
import type { LoaderConfig, LoaderOutput } from '@/source';
import type { Awaitable } from '@/types';
import type { I18nConfig } from '@/i18n';
import { createDocument, search, type Doc } from './flexsearch/utils';

// Re-exported so apps can wrap the default page->index builder (e.g. to attach
// a `tag` for filtered client-side search) instead of reimplementing it.
export { buildIndexDefault } from './server/build-index';
// Re-exported so a build can index an exported corpus exactly the way a browser
// does — a check that indexes it some other way proves something else.
export { createDocument, search } from './flexsearch/utils';
export type { SharedDocument } from './server/build-doc';

export type Index = SharedIndex;
export interface IndexWithLocale extends Index {
  locale: string;
}

export interface Options {
  indexes: Index[] | (() => Awaitable<Index[]>);
  document?: DocumentOptions<Doc>;
}

/**
 * What a build hands the browser: the CORPUS, not a serialized index.
 *
 * A serialized index is an inverted map plus a copy of every document, so it
 * runs several times the size of the text it came from — on the Hanzo docs
 * corpus, 54MB of index for 13MB of documents, and the host serves it
 * uncompressed. The browser can rebuild the index from the documents in about
 * two seconds, so the documents are what ships. It is also the corpus itself:
 * one artifact, readable by anything that wants these pages as data.
 */
export type ExportedData =
  | {
      type: 'default';
      docs: SharedDocument[];
    }
  | {
      type: 'i18n';
      docs: Record<string, SharedDocument[]>;
    };

export interface I18nOptions extends Omit<Options, 'indexes'> {
  i18n: I18nConfig;
  indexes: IndexWithLocale[] | (() => Awaitable<IndexWithLocale[]>);

  /**
   * options for each locale, see https://github.com/nextapps-de/flexsearch/blob/master/doc/encoder.md.
   */
  localeMap?: Record<string, Partial<DocumentOptions<Doc>> | 'cjk'>;
}

function server(options: Options): SearchServer {
  function init(indexes: Index[]) {
    const docs = buildDocuments(indexes);
    const index = createDocument(options.document);

    for (const doc of docs) {
      index.add(doc.id, doc as Doc);
    }

    return { docs, index };
  }

  const initialized =
    typeof options.indexes === 'function'
      ? Promise.resolve(options.indexes()).then(init)
      : init(options.indexes);

  return {
    async export(): Promise<ExportedData> {
      return { type: 'default', docs: (await initialized).docs };
    },
    async search(query, searchOptions) {
      const { index } = await initialized;
      return search(index, query, searchOptions?.tag, searchOptions?.limit);
    },
  };
}

function serverI18n(options: I18nOptions): SearchServer {
  const { indexes: inputIndexes, localeMap } = options;

  async function initSearchServers() {
    const map = new Map<string, SearchServer>();
    const indexMap = new Map<string, IndexWithLocale[]>();
    const indexes = typeof inputIndexes === 'function' ? await inputIndexes() : inputIndexes;

    for (const index of indexes) {
      let list = indexMap.get(index.locale);
      if (!list) {
        list = [];
        indexMap.set(index.locale, list);
      }
      list.push(index);
    }

    for (const [locale, list] of indexMap) {
      const override = localeMap?.[locale];

      map.set(
        locale,
        server({
          indexes: list,
          document:
            override === 'cjk'
              ? { ...options.document, encoder: Search.Charset.CJK }
              : { ...options.document, ...override },
        }),
      );
    }

    return map;
  }

  const get = initSearchServers();
  return {
    async export(): Promise<ExportedData> {
      const map = await get;
      const entries = Array.from(map.entries()).map(async ([k, v]) => {
        const data = (await v.export()) as Extract<ExportedData, { type: 'default' }>;
        return [k, data.docs];
      });

      return {
        type: 'i18n',
        docs: Object.fromEntries(await Promise.all(entries)),
      };
    },
    async search(query, searchOptions) {
      const map = await get;
      const handler = map.get(searchOptions?.locale ?? options.i18n.defaultLanguage);

      if (handler) return handler.search(query, searchOptions);
      return [];
    },
  };
}

export function flexsearch(options: Options): SearchAPI {
  return createEndpoint(server(options));
}

export function flexsearchI18n(options: I18nOptions): SearchAPI {
  return createEndpoint(serverI18n(options));
}

export interface FromSourceOptions<C extends LoaderConfig> extends Pick<
  I18nOptions,
  'localeMap' | 'document'
> {
  buildIndex?: (page: C['page']) => Awaitable<Index>;
}

/**
 * create server from loader, if passed as function, the server will re-index all records once a different instance of loader is returned.
 */
export function flexsearchFromSource<C extends LoaderConfig>(
  loader: LoaderOutput<C> | (() => Awaitable<LoaderOutput<C>>),
  options: FromSourceOptions<NoInfer<C>> = {},
) {
  const cache = new WeakMap<LoaderOutput<C>, Promise<SearchServer>>();
  const { buildIndex = buildIndexDefault, ...rest } = options;

  async function initServer(loader: LoaderOutput<C>): Promise<SearchServer> {
    const indexes = await Promise.all(
      loader.getPages().map(async (page): Promise<IndexWithLocale> => {
        const index = await buildIndex(page);
        return {
          ...index,
          locale: page.locale!,
          breadcrumbs: index.breadcrumbs ?? buildBreadcrumbs(loader, page),
        };
      }),
    );

    if (loader._i18n)
      return serverI18n({
        indexes,
        i18n: loader._i18n,
        ...rest,
      });

    return server({ indexes, ...rest });
  }

  async function getCurrentServer() {
    const l = typeof loader === 'function' ? await loader() : loader;
    let server = cache.get(l);
    if (!server) {
      server = initServer(l);
      cache.set(l, server);
    }
    return await server;
  }

  return createEndpoint({
    async export() {
      return (await getCurrentServer()).export();
    },
    async search(query, options) {
      return (await getCurrentServer()).search(query, options);
    },
  });
}
