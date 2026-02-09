'use client';
import { useShikiConfigOptional } from '@hanzo/docs-core/highlight/core/client';
import * as base from './dynamic-codeblock.core';
import { configDefault } from '@hanzo/docs-core/highlight';

export function DynamicCodeBlock(props: base.DynamicCodeblockProps) {
  const config = useShikiConfigOptional() ?? configDefault;
  return (
    <base.DynamicCodeBlock
      {...props}
      options={{
        config,
        ...props.options,
      }}
    />
  );
}

export type { DynamicCodeblockProps } from './dynamic-codeblock.core';
