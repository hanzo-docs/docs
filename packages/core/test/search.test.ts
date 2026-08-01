import { createI18nSearchAPI, createSearchAPI, type ExportedData } from '@/search/server';
import { expect, test } from 'vitest';
import { structure } from '@/mdx-plugins';
import {
  createDocument,
  flexsearch,
  search,
  type ExportedData as StaticExport,
} from '@/search/flexsearch';

// A page whose facts live in its body, not its headings — which is every
// generated reference page: the heading names the operation, the body is the
// fields, types and defaults someone is actually searching for.
const REFERENCE = {
  id: '/docs/openapi/kv',
  title: 'Kv',
  url: '/docs/openapi/kv',
  structuredData: structure(`## Update cluster

Set \`max_memory_mb\` to resize the cluster.

Set \`eviction_policy\` to choose what it drops first.
`),
};

test('a static export carries page bodies, and finds a page by them', async () => {
  const api = flexsearch({ indexes: [REFERENCE] });
  const exported = (await api.export()) as Extract<StaticExport, { type: 'default' }>;

  // One document for the page, one for the section — not one per paragraph.
  expect(exported.docs.map((d) => [d.type, d.url])).toEqual([
    ['page', '/docs/openapi/kv'],
    ['heading', '/docs/openapi/kv#update-cluster'],
  ]);

  const section = exported.docs[1].content;
  expect(section).toContain('Update cluster');
  expect(section).toContain('max_memory_mb');
  expect(section).toContain('eviction_policy');

  // What a browser does with that file: index it, then search it.
  const index = createDocument();
  for (const doc of exported.docs) index.add(doc.id, doc);

  const results = await search(index, 'eviction_policy');
  expect(results.map((r) => r.url)).toContain('/docs/openapi/kv#update-cluster');

  // The words a reader types are the start of a word, not all of it.
  expect(await search(index, 'eviction_pol')).not.toHaveLength(0);
  expect(await search(index, 'pterodactyl')).toHaveLength(0);
});

test('Search API', async () => {
  const api = createSearchAPI('simple', {
    indexes: [
      {
        title: 'Hello World',
        content: 'Hello World',
        url: '/hello-world',
      },
      {
        title: 'Nothing',
        content: 'Nothing',
        url: '/nothing',
      },
    ],
  });

  expect(await api.search('Hello')).toHaveLength(1);
  expect(await api.search('pterodactyl')).toHaveLength(0);
});

test('Search API Advanced', async () => {
  const api = createSearchAPI('advanced', {
    indexes: [
      {
        id: '1',
        title: 'Index',
        structuredData: structure(
          `## Hello World

something`,
        ),
        url: '/',
        tag: 'my-tag',
      },
      {
        id: '2',
        title: 'Page',
        structuredData: structure(
          `## My Page

something`,
        ),
        url: '/page',
        tag: 'test',
      },
    ],
  });

  expect(await api.search('Page')).toHaveLength(2);
  expect(await api.search('something')).toHaveLength(4);
  // Two documents per page here, not three: `something` is the body of the
  // `Hello World` section, so it is indexed as part of that section.
  expect(await api.search('', { tag: 'my-tag' })).toHaveLength(2);

  expect(await api.search('Hello')).toMatchInlineSnapshot(`
    [
      {
        "breadcrumbs": undefined,
        "content": "Index",
        "id": "1",
        "type": "page",
        "url": "/",
      },
      {
        "breadcrumbs": undefined,
        "content": "<mark>Hello</mark> World
    something",
        "id": "1-0",
        "type": "heading",
        "url": "/#hello-world",
      },
    ]
  `);
});

test('Search API I18n', async () => {
  const api = createI18nSearchAPI('simple', {
    i18n: {
      languages: ['italian', 'en'],
      defaultLanguage: 'en',
    },
    indexes: [
      {
        title: 'ciao mondo amico italian',
        content: 'ciao mondo amico',
        url: '/hello-world',
        locale: 'italian',
      },
      {
        title: 'Hello World English',
        content: 'Hello World',
        url: '/hello-world',
        locale: 'en',
      },
    ],
  });

  expect(await api.search('English', { locale: 'en' })).toHaveLength(1);
  expect(await api.search('amico', { locale: 'italian' })).toHaveLength(1);
  expect(await api.search('italian', { locale: 'en' })).toHaveLength(0);
  const exported = (await api.export()) as ExportedData;
  expect(exported.type).toBe('i18n');

  if (exported.type === 'i18n')
    expect(Object.keys(exported.data)).toMatchInlineSnapshot(`
    [
      "italian",
      "en",
    ]
  `);
});
