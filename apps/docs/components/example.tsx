import { ServerCodeBlock } from '@hanzo/docs-base-ui/components/codeblock.rsc';
import { shikiConfig } from '@/lib/shiki';

/**
 * A generated code example, highlighted as its page renders.
 *
 * lib/rehype-example.ts turns the API reference's plain fenced blocks into this
 * element so the compile holds a string and not a tree of tokens. It renders
 * what rehype-code would have: the same CodeBlock with its copy button, the same
 * two themes with the same AA colour replacements, the same margin.
 */
export function Example({ lang, code }: { lang: string; code: string }) {
  return (
    <ServerCodeBlock
      lang={lang}
      code={code}
      {...shikiConfig}
      defaultColor={false}
      codeblock={{ className: 'my-4' }}
    />
  );
}
