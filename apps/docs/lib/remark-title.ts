import type { Root } from 'mdast';

/**
 * One title per page.
 *
 * The page header prints the frontmatter's `title`. A body that opens with its
 * own `# heading` printed a second one under it — /docs/sdks said "SDKs" twice,
 * /docs/openapi said "Capabilities" and then "Every capability". So a depth-1
 * heading that OPENS the body (nothing but imports, exports and frontmatter
 * before it) is dropped. A `#` further down is the author's and stays.
 */
const PREAMBLE = new Set(['mdxjsEsm', 'yaml', 'toml']);

export function remarkTitle() {
  return (tree: Root) => {
    const at = tree.children.findIndex((node) => !PREAMBLE.has(node.type));
    const first = tree.children[at];
    if (first?.type === 'heading' && first.depth === 1) tree.children.splice(at, 1);
  };
}
