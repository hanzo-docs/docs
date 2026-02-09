'use client';
import * as base from '@hanzo/docs-core/highlight/core/client';
import { configDefault } from '@hanzo/docs-core/highlight';
import type { ReactNode } from 'react';

export function ShikiConfigProvider({ children }: { children: ReactNode }) {
  const config = base.useShikiConfigOptional() ?? configDefault;
  return <base.ShikiConfigProvider config={config}>{children}</base.ShikiConfigProvider>;
}
