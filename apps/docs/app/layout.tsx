// Brand tokens (monochrome --hanzo-*, --font-size-*, --z-*) load first so the
// Fumadocs theme + Tailwind layers in global.css can override where they meet.
import '@hanzo/brand/styles/variables.css';
import './global.css';
import type { Viewport } from 'next';
import { baseUrl, createMetadata } from '@/lib/metadata';
import { Provider } from './provider';
import type { ReactNode } from 'react';
import { Zen, ZenMono } from '@hanzo/font';
import { TreeProvider } from '@/lib/tree';
import { clientTree } from '@/lib/source';
import { NextProvider } from '@hanzo/docs/core/framework/next';
import { Analytics } from '@hanzo/docs-analytics';

export const metadata = createMetadata({
  title: {
    template: '%s | Hanzo Docs',
    default: 'Hanzo — Documentation',
  },
  description:
    'Documentation for Hanzo AI Cloud — every model, every tool, one key.',
  metadataBase: baseUrl,
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
    { media: '(prefers-color-scheme: light)', color: '#fff' },
  ],
};

// <html> ships `t_dark`, the default, so a page read before any script runs is
// already themed. The theme script swaps it for the reader's stored choice
// before the first paint, which is why the element does not warn about a class
// it did not render with.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${Zen.variable} ${ZenMono.variable} t_dark`} suppressHydrationWarning>
      <body>
        <NextProvider>
          <TreeProvider tree={clientTree()}>
            <Provider>{children}</Provider>
          </TreeProvider>
        </NextProvider>
        <Analytics product="docs" />
      </body>
    </html>
  );
}
