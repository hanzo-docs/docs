import { expect, test } from 'vitest';
import { createContentHighlighter } from '@/search';

test('highlight search results', () => {
  const highlighter = createContentHighlighter('hello world helloworld');

  expect(
    highlighter.highlightMarkdown('oops hello, world hello! worldhello'),
  ).toMatchInlineSnapshot(
    `"oops <mark>hello</mark>, <mark>world</mark> <mark>hello</mark>! <mark>world</mark><mark>hello</mark>"`,
  );
  expect(highlighter.highlightMarkdown('helloworld!!!')).toMatchInlineSnapshot(
    `"<mark>hello</mark><mark>world</mark>!!!"`,
  );
  expect(highlighter.highlightMarkdown('wor ld hello')).toMatchInlineSnapshot(
    `"wor ld <mark>hello</mark>"`,
  );
});

test('excerpt a long section around what matched', () => {
  const highlighter = createContentHighlighter('eviction_policy');
  const long = `${'filler '.repeat(60)}eviction_policy ${'filler '.repeat(60)}`;

  const excerpt = highlighter.highlightExcerpt(long, 40);
  expect(excerpt).toContain('<mark>eviction_policy</mark>');
  expect(excerpt.startsWith('…')).toBe(true);
  expect(excerpt.endsWith('…')).toBe(true);
  expect(excerpt.length).toBeLessThan(long.length / 4);

  // Short enough to show whole, shown whole.
  expect(highlighter.highlightExcerpt('eviction_policy', 40)).toBe(
    '<mark>eviction_policy</mark>',
  );
});
