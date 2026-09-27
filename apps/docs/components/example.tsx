import { highlight } from '@hanzo/docs-core/highlight';
import { Code } from '@/components/mdx/code';
import { shikiConfig } from '@/lib/shiki';

/**
 * A generated code example, highlighted as its page renders.
 *
 * lib/rehype-example.ts turns the API reference's plain fenced blocks into this
 * element so the compile holds a string and not a tree of tokens. It renders
 * what rehype-code would have: the same code block, the same two themes, the
 * same AA colour replacements.
 */
export async function Example({ lang, code }: { lang: string; code: string }) {
  return highlight(code, { lang, ...shikiConfig, components: { pre: Code } });
}
