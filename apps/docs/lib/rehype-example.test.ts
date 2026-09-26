import { describe, expect, it } from 'vitest';
import type { Root } from 'hast';
import { rehypeExample } from './rehype-example';

// The reference's examples reach the page as <Example lang code />, a string the
// page highlights as it renders, so the compile never holds their tokens.

const block = (lang: string, code: string, meta?: string): Root => ({
  type: 'root',
  children: [
    {
      type: 'element',
      tagName: 'pre',
      properties: {},
      children: [
        {
          type: 'element',
          tagName: 'code',
          properties: { className: [`language-${lang}`] },
          data: meta ? ({ meta } as never) : undefined,
          children: [{ type: 'text', value: `${code}\n` }],
        },
      ],
    },
  ],
});

const run = (tree: Root, path: string): Root => {
  type File = Parameters<ReturnType<typeof rehypeExample>>[1];
  rehypeExample()(tree, { path, history: [path] } as File, () => undefined);
  return tree;
};

describe('an example in the generated reference', () => {
  it('becomes <Example> with its language and its code', () => {
    const tree = run(
      block('bash', 'hanzo bot runs list'),
      '/w/apps/docs/content/docs/openapi/bot/get-bot-runs.mdx',
    );
    expect(tree.children).toEqual([
      {
        type: 'mdxJsxFlowElement',
        name: 'Example',
        attributes: [
          { type: 'mdxJsxAttribute', name: 'lang', value: 'bash' },
          { type: 'mdxJsxAttribute', name: 'code', value: 'hanzo bot runs list' },
        ],
        children: [],
      },
    ]);
  });

  it('keeps a block with a meta string for the compile-time pass', () => {
    const tree = run(
      block('ts', 'const a = 1;', 'twoslash'),
      '/w/apps/docs/content/docs/openapi/bot/index.mdx',
    );
    expect((tree.children[0] as { tagName?: string }).tagName).toBe('pre');
  });
});

describe('a code block anywhere else', () => {
  it('is left to rehype-code', () => {
    const tree = run(block('bash', 'npm i -g hanzo'), '/w/apps/docs/content/docs/quickstart.mdx');
    expect((tree.children[0] as { tagName?: string }).tagName).toBe('pre');
  });
});
