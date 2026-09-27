import type { Root } from 'mdast';
import type { MdxJsxFlowElement } from 'mdast-util-mdx';
import { visit } from 'unist-util-visit';

/**
 * Steps as parts, not classes.
 *
 * docs-core's remark-steps marks a numbered run of headings with two classes,
 * `fd-steps` and `fd-step`, on plain divs, for a stylesheet to draw. The docs
 * draw them with the `Steps` / `Step` parts instead (components/mdx/blocks.tsx),
 * so this renames each marked div to the part it stands for. Runs after
 * remark-steps.
 */
const PART: Record<string, string> = { 'fd-steps': 'Steps', 'fd-step': 'Step' };

export function remarkParts() {
  return (tree: Root) => {
    visit(tree, 'mdxJsxFlowElement', (node: MdxJsxFlowElement) => {
      if (node.name !== 'div') return;
      const cls = node.attributes.find((a) => a.type === 'mdxJsxAttribute' && a.name === 'className');
      const part = typeof cls?.value === 'string' ? PART[cls.value] : undefined;
      if (!part) return;
      node.name = part;
      node.attributes = node.attributes.filter((a) => a !== cls);
    });
  };
}
