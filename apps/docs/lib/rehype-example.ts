import type { Element, ElementContent, Root } from 'hast';
import type { Transformer } from 'unified';
import { visit } from 'unist-util-visit';

// The API reference's code examples, highlighted when a page renders rather
// than when the site compiles.
//
// Each of the 2,400 operation pages carries eight examples (the CLI, five SDKs,
// HTTP and MCP). Highlighted at compile time, every token of every one is a JSX
// element in the page's module — 50 KB of module for a 4.5 KB page — and the
// bundler holds all 2,400 at once: the export's compile peaked at 24 GB against
// the build runner's 24 GiB, and died there. As <Example lang code />, a module
// carries the code as one string, and components/example.tsx highlights it with
// the same themes when the page is rendered, one page at a time. Measured: the
// compile peaks at 9.5 GB.
//
// Only the generated reference, and only a plain block: one with a meta string
// (a title, twoslash, line numbers, a highlighted line) needs the compile-time
// pass, and no generated example has one. Runs before rehype-code, which then
// never sees these blocks; the page's markdown twin is written earlier, in the
// remark pass, so it keeps its fenced code.

const GENERATED = /[\\/]content[\\/]docs[\\/]openapi[\\/]/;

/** A JSX element in the hast tree, the shape remark-mdx gives one. */
interface Jsx {
  type: 'mdxJsxFlowElement';
  name: string;
  attributes: Array<{ type: 'mdxJsxAttribute'; name: string; value: string }>;
  children: [];
}

const text = (nodes: ElementContent[]): string =>
  nodes
    .map((n) => (n.type === 'text' ? n.value : 'children' in n ? text(n.children) : ''))
    .join('');

export function rehypeExample(): Transformer<Root, Root> {
  return (tree, file) => {
    if (!GENERATED.test(file.path ?? file.history[0] ?? '')) return;
    visit(tree, 'element', (node: Element, index, parent) => {
      if (node.tagName !== 'pre' || index === undefined || !parent) return;
      const code = node.children[0];
      if (node.children.length !== 1 || code.type !== 'element' || code.tagName !== 'code') return;
      if (code.data && 'meta' in code.data && code.data.meta) return;
      const lang = (Array.isArray(code.properties.className) ? code.properties.className : [])
        .map(String)
        .find((c) => c.startsWith('language-'))
        ?.slice('language-'.length);
      const example: Jsx = {
        type: 'mdxJsxFlowElement',
        name: 'Example',
        attributes: [
          { type: 'mdxJsxAttribute', name: 'lang', value: lang ?? 'text' },
          { type: 'mdxJsxAttribute', name: 'code', value: text(code.children).replace(/\n$/, '') },
        ],
        children: [],
      };
      parent.children.splice(index, 1, example as unknown as ElementContent);
      return 'skip';
    });
  };
}
