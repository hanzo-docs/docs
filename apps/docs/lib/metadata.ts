import type { Metadata } from 'next/types';
import { twinPath } from '@/lib/twin';

const feed = {
  'application/rss+xml': [{ title: 'Hanzo Docs Blog', url: 'https://docs.hanzo.ai/blog/rss.xml' }],
};

/** The page's `<link rel="alternate">`s: the blog feed, and the page as Markdown (lib/twin twinPath). */
export function alternates(path: string): NonNullable<Metadata['alternates']> {
  return { types: { ...feed, 'text/markdown': twinPath(path) } };
}

export function createMetadata(override: Metadata): Metadata {
  return {
    ...override,
    openGraph: {
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      url: 'https://docs.hanzo.ai',
      images: '/banner.png',
      siteName: 'Hanzo Docs',
      ...override.openGraph,
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@hanzoai',
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      images: '/banner.png',
      ...override.twitter,
    },
    alternates: {
      types: feed,
      ...override.alternates,
    },
  };
}

export const baseUrl =
  process.env.NODE_ENV === 'development'
    ? new URL('http://localhost:3000')
    : new URL('https://docs.hanzo.ai');
