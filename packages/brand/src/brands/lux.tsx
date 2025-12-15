import type { BrandConfig } from '../types';

/**
 * Lux Network brand icon component
 */
export function LuxIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  );
}

/**
 * Lux Network Documentation brand configuration
 * Pure black/white minimalist theme
 */
export const luxBrand: BrandConfig = {
  id: 'lux',
  name: 'Lux',
  fullName: 'Lux Network',
  tagline: 'Post-Quantum Blockchain Infrastructure',

  colors: {
    // Monochrome palette - pure black/white
    primary: 'hsl(0, 0%, 10%)',              // Near black
    primaryForeground: 'white',
    secondary: 'hsl(0, 0%, 96%)',            // Near white
    secondaryForeground: 'hsl(0, 0%, 10%)',
    accent: 'hsl(0, 0%, 96%)',
    themeColorLight: '#ffffff',              // Pure white
    themeColorDark: '#000000',               // Pure black
    // Dark mode overrides
    darkPrimary: 'hsl(0, 0%, 98%)',          // Near white
    darkPrimaryForeground: 'hsl(0, 0%, 6%)',
    darkSecondary: 'hsl(0, 0%, 12%)',
    darkSecondaryForeground: 'hsl(0, 0%, 98%)',
  },

  logo: {
    component: <LuxIcon className="size-5" />,
    alt: 'Lux Network',
    width: 24,
    height: 24,
  },

  links: {
    github: 'https://github.com/luxfi',
    twitter: 'https://x.com/luxnetwork',
    discord: 'https://discord.gg/lux',
    website: 'https://lux.network',
    docs: 'https://docs.lux.network',
  },

  metadata: {
    title: 'Lux Docs',
    titleTemplate: '%s | Lux Docs',
    description: 'Documentation for Lux Network - Post-quantum secure, multi-consensus blockchain infrastructure.',
    keywords: ['Lux', 'Blockchain', 'Post-Quantum', 'Consensus', 'DeFi', 'Documentation'],
    ogImage: '/og/lux.png',
    twitterHandle: '@luxnetwork',
  },

  footer: {
    copyright: `© ${new Date().getFullYear()} Lux Network. All rights reserved.`,
    showBuiltWith: true,
    links: [
      {
        title: 'Learn',
        items: [
          { label: 'Introduction', href: '/docs/learn/introduction' },
          { label: 'Architecture', href: '/docs/learn/architecture' },
          { label: 'Consensus', href: '/docs/learn/consensus' },
          { label: 'Post-Quantum', href: '/docs/learn/post-quantum' },
        ],
      },
      {
        title: 'Build',
        items: [
          { label: 'Quick Start', href: '/docs/build/quickstart' },
          { label: 'SDK', href: '/docs/build/sdk' },
          { label: 'Smart Contracts', href: '/docs/build/contracts' },
          { label: 'API Reference', href: '/docs/reference/api' },
        ],
      },
      {
        title: 'Run',
        items: [
          { label: 'Run a Node', href: '/docs/nodes/run' },
          { label: 'Validators', href: '/docs/nodes/validators' },
          { label: 'Staking', href: '/docs/nodes/staking' },
          { label: 'CLI Reference', href: '/docs/reference/cli' },
        ],
      },
      {
        title: 'Community',
        items: [
          { label: 'GitHub', href: 'https://github.com/luxfi', external: true },
          { label: 'Twitter', href: 'https://x.com/luxnetwork', external: true },
          { label: 'Discord', href: 'https://discord.gg/lux', external: true },
          { label: 'Forum', href: 'https://forum.lux.network', external: true },
        ],
      },
    ],
  },

  rootClassName: 'brand-lux',
};

export default luxBrand;
