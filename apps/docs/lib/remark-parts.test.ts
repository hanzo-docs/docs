import { describe, expect, it } from 'vitest';
import { remark } from 'remark';
import remarkMdx from 'remark-mdx';
import type { Root } from 'mdast';
import { remarkSteps } from '@hanzo/docs-core/mdx-plugins/remark-steps';
import { remarkParts } from './remark-parts';

// remark-steps marks a numbered run of headings with classes; the docs draw it
// with the Steps / Step parts, so the marked divs become those parts.

const names = (mdx: string) => {
  const processor = remark().use(remarkMdx);
  const tree = processor.parse(mdx) as Root;
  remarkSteps()(tree, undefined as never, () => undefined);
  remarkParts()(tree);
  const out: string[] = [];
  const walk = (node: { type: string; name?: string; children?: unknown[] }) => {
    if (node.type === 'mdxJsxFlowElement') out.push(node.name ?? '');
    for (const child of (node.children ?? []) as (typeof node)[]) walk(child);
  };
  walk(tree);
  return out;
};

describe('remarkParts', () => {
  it('turns a numbered run of headings into Steps of Step', () => {
    expect(names('### 1. Install\n\nnpm i\n\n### 2. Run\n\nhanzo\n')).toEqual(['Steps', 'Step', 'Step']);
  });

  it('leaves other divs alone', () => {
    expect(names('<div className="note">\n\nx\n\n</div>\n')).toEqual(['div']);
  });
});
