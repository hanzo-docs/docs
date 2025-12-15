import './global.css';
import type { Viewport } from 'next';
import { baseUrl, createMetadata } from '@/lib/metadata';
import { Body } from '@/app/layout.client';
import { Provider } from './provider';
import type { ReactNode } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import { TreeContextProvider } from 'fumadocs-ui/contexts/tree';
import { source } from '@/lib/source';
import { NextProvider } from 'fumadocs-core/framework/next';

// Brand configuration
const brandId = (process.env.NEXT_PUBLIC_BRAND ?? 'hanzo') as 'hanzo' | 'lux' | 'zoo';

const brandMeta = {
  hanzo: {
    title: 'Hanzo Docs',
    description: 'Documentation for Hanzo AI infrastructure, agents, MCP tools, and SDKs.',
  },
  lux: {
    title: 'Lux Docs',
    description: 'Documentation for Lux Network - Post-quantum secure blockchain infrastructure.',
  },
  zoo: {
    title: 'Zoo Docs',
    description: 'Documentation for Zoo Labs Foundation - Democratizing AI through decentralization.',
  },
};

const meta = brandMeta[brandId];

export const metadata = createMetadata({
  title: {
    template: `%s | ${meta.title}`,
    default: meta.title,
  },
  description: meta.description,
  metadataBase: baseUrl,
});

const geist = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
});

const mono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
    { media: '(prefers-color-scheme: light)', color: '#fff' },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${mono.variable} brand-${brandId}`}
      suppressHydrationWarning
    >
      <Body>
        <NextProvider>
          <TreeContextProvider tree={source.pageTree}>
            <Provider>{children}</Provider>
          </TreeContextProvider>
        </NextProvider>
      </Body>
    </html>
  );
}
