import * as Base from '@hanzo/docs-ui/components/codeblock';
import { cn } from '@/lib/cn';
import { highlight } from '@hanzo/docs-core/highlight/core';
import { shikiConfig } from '@/lib/shiki';

export interface CodeBlockProps {
  code: string;
  wrapper?: Base.CodeBlockProps;
  lang: string;
}

export async function CodeBlock({ code, lang, wrapper }: CodeBlockProps) {
  const rendered = await highlight(code, {
    config: shikiConfig,
    lang,
    components: {
      pre: Base.Pre,
    },
  });

  return (
    <Base.CodeBlock {...wrapper} className={cn('my-0', wrapper?.className)}>
      {rendered}
    </Base.CodeBlock>
  );
}
