'use client';
import type { ReactNode } from 'react';
import { RootProvider } from '@hanzo/radix/provider/waku';

export function Provider({ children }: { children: ReactNode }) {
  return <RootProvider>{children}</RootProvider>;
}
