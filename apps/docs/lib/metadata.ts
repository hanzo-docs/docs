import type { Metadata } from 'next/types';
import { Page } from './source';

// Brand configuration
const brandId = (process.env.NEXT_PUBLIC_BRAND ?? 'hanzo') as 'hanzo' | 'lux' | 'zoo';

const brandConfig = {
  hanzo: {
    name: 'Hanzo Docs',
    url: 'https://docs.hanzo.ai',
    twitter: '@hanzoai',
    description: 'Documentation for Hanzo AI infrastructure, agents, MCP tools, and SDKs.',
  },
  lux: {
    name: 'Lux Docs',
    url: 'https://docs.lux.network',
    twitter: '@luxnetwork',
    description: 'Documentation for Lux Network - Post-quantum secure blockchain infrastructure.',
  },
  zoo: {
    name: 'Zoo Docs',
    url: 'https://docs.zoo.ngo',
    twitter: '@zoolabs',
    description: 'Documentation for Zoo Labs Foundation - Democratizing AI through decentralization.',
  },
};

const brand = brandConfig[brandId];

export function createMetadata(override: Metadata): Metadata {
  return {
    ...override,
    openGraph: {
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      url: brand.url,
      images: '/banner.png',
      siteName: brand.name,
      ...override.openGraph,
    },
    twitter: {
      card: 'summary_large_image',
      creator: brand.twitter,
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      images: '/banner.png',
      ...override.twitter,
    },
    alternates: {
      types: {
        'application/rss+xml': [
          {
            title: `${brand.name} Blog`,
            url: `${brand.url}/blog/rss.xml`,
          },
        ],
      },
      ...override.alternates,
    },
  };
}

export function getPageImage(page: Page) {
  const segments = [...page.slugs, 'image.webp'];

  return {
    segments,
    url: `/og/${segments.join('/')}`,
  };
}

export const baseUrl =
  process.env.NODE_ENV === 'development' ||
  !process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? new URL('http://localhost:3000')
    : new URL(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
