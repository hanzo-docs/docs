import { describe, expect, it } from 'vitest';
import { remark } from 'remark';
import remarkMdx from 'remark-mdx';
import type { Root } from 'mdast';
import { remarkTitle } from './remark-title';

// The page header prints the frontmatter title, so a body that opens with its
// own `# heading` loses that heading and keeps every other one.

const headings = (mdx: string) => {
  const tree = remark().use(remarkMdx).parse(mdx) as Root;
  remarkTitle()(tree);
  return tree.children
    .filter((node) => node.type === 'heading')
    .map((node) => `${node.depth}:${(node.children[0] as { value: string }).value}`);
};

describe('remarkTitle', () => {
  it('drops the heading that opens the body', () => {
    expect(headings('# SDKs\n\nText.\n\n## Install\n')).toEqual(['2:Install']);
  });

  it('looks past imports to find the opening', () => {
    expect(headings("import { Cards } from 'x'\n\n# Every capability\n\n## Domains\n")).toEqual(['2:Domains']);
  });

  it('keeps an h1 that does not open the body', () => {
    expect(headings('Intro.\n\n# Later\n')).toEqual(['1:Later']);
  });

  it('keeps a body that opens with a lower heading', () => {
    expect(headings('## Install\n\n# Appendix\n')).toEqual(['2:Install', '1:Appendix']);
  });
});
