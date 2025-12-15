import type { BrandConfig } from '../types';

/**
 * Zoo Labs brand icon component
 */
export function ZooIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z" />
    </svg>
  );
}

/**
 * Zoo Labs Foundation Documentation brand configuration
 */
export const zooBrand: BrandConfig = {
  id: 'zoo',
  name: 'Zoo',
  fullName: 'Zoo Labs Foundation',
  tagline: 'Democratizing AI Through Decentralization',

  colors: {
    primary: 'hsl(145, 63%, 49%)',           // Emerald Green
    primaryForeground: 'white',
    secondary: 'hsl(43, 89%, 50%)',          // Amber
    secondaryForeground: '#1a1a1a',
    accent: 'hsl(155, 70%, 45%)',            // Forest Green
    themeColorLight: '#ffffff',
    themeColorDark: '#0A0A0A',
    // Dark mode overrides
    darkPrimary: 'hsl(145, 70%, 60%)',       // Lighter emerald
    darkPrimaryForeground: 'black',
    darkSecondary: 'hsl(43, 89%, 60%)',
    darkSecondaryForeground: '#1a1a1a',
  },

  logo: {
    component: <ZooIcon className="size-5" />,
    alt: 'Zoo Labs',
    width: 24,
    height: 24,
  },

  links: {
    github: 'https://github.com/zooai',
    twitter: 'https://x.com/zoolabs',
    discord: 'https://discord.gg/zoo',
    website: 'https://zoo.ngo',
    docs: 'https://docs.zoo.ngo',
    custom: [
      {
        text: 'Gym',
        url: 'https://gym.zoo.ngo',
        icon: (
          <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
            <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z" />
          </svg>
        ),
      },
      {
        text: 'AI Chat',
        url: 'https://ai.zoo.ngo',
        icon: (
          <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
          </svg>
        ),
      },
    ],
  },

  metadata: {
    title: 'Zoo Docs',
    titleTemplate: '%s | Zoo Docs',
    description: 'Documentation for Zoo Labs Foundation - Democratizing AI through decentralized training and open source frontier models.',
    keywords: ['Zoo', 'AI', 'Decentralized', 'Training', 'Zen', 'DSO', 'PoAI', 'Documentation'],
    ogImage: '/og/zoo.png',
    twitterHandle: '@zoolabs',
  },

  footer: {
    copyright: `© ${new Date().getFullYear()} Zoo Labs Foundation (501c3). All rights reserved.`,
    showBuiltWith: true,
    links: [
      {
        title: 'Learn',
        items: [
          { label: 'Introduction', href: '/docs/learn/introduction' },
          { label: 'DSO Protocol', href: '/docs/learn/dso' },
          { label: 'Proof of AI', href: '/docs/learn/poai' },
          { label: 'Zen Models', href: '/docs/learn/zen' },
        ],
      },
      {
        title: 'Build',
        items: [
          { label: 'Quick Start', href: '/docs/build/quickstart' },
          { label: 'Gym SDK', href: '/docs/build/gym' },
          { label: 'Training', href: '/docs/build/training' },
          { label: 'Inference', href: '/docs/build/inference' },
        ],
      },
      {
        title: 'Research',
        items: [
          { label: 'Papers', href: 'https://papers.zoo.ngo', external: true },
          { label: 'ZIPs', href: 'https://zips.zoo.ngo', external: true },
          { label: 'Models', href: 'https://huggingface.co/zenlm', external: true },
          { label: 'Blog', href: '/blog' },
        ],
      },
      {
        title: 'Community',
        items: [
          { label: 'GitHub', href: 'https://github.com/zooai', external: true },
          { label: 'Twitter', href: 'https://x.com/zoolabs', external: true },
          { label: 'Discord', href: 'https://discord.gg/zoo', external: true },
          { label: 'Forum', href: 'https://forum.zoo.ngo', external: true },
        ],
      },
    ],
  },

  rootClassName: 'brand-zoo',
};

export default zooBrand;
