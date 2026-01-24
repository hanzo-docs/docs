/**
 * Lux Network Organization Configuration
 */

export const config = {
  org: {
    name: 'Lux Network',
    github: 'luxfi',
    tagline: 'Open Source',
    description: 'Multi-consensus blockchain with post-quantum cryptography. High-performance settlement layer for AI compute.',
  },

  links: {
    website: 'https://lux.network',
    docs: 'https://docs.lux.network',
    github: 'https://github.com/luxfi',
    discord: 'https://discord.gg/lux',
    twitter: 'https://twitter.com/luxnetwork',
  },

  featuredRepos: [
    'node',
    'cli',
    'sdk',
    'wallet',
    'genesis',
    'netrunner',
    'bridge',
    'explorer',
  ],

  footer: {
    sections: [
      {
        title: 'Lux Network',
        links: [
          { label: 'Website', href: 'https://lux.network' },
          { label: 'Documentation', href: 'https://docs.lux.network' },
          { label: 'GitHub', href: 'https://github.com/luxfi' },
        ],
      },
      {
        title: 'Infrastructure',
        links: [
          { label: 'Node', href: 'https://github.com/luxfi/node' },
          { label: 'CLI', href: 'https://github.com/luxfi/cli' },
          { label: 'SDK', href: 'https://github.com/luxfi/sdk' },
          { label: 'Wallet', href: 'https://github.com/luxfi/wallet' },
        ],
      },
      {
        title: 'Ecosystem',
        links: [
          { label: 'Hanzo AI', href: 'https://hanzoai.github.io' },
          { label: 'Zoo AI', href: 'https://zooai.github.io' },
          { label: 'Lux C++', href: 'https://luxcpp.github.io' },
          { label: 'Lux FHE', href: 'https://luxfhe.github.io' },
        ],
      },
      {
        title: 'Community',
        links: [
          { label: 'Discord', href: 'https://discord.gg/lux' },
          { label: 'Twitter', href: 'https://twitter.com/luxnetwork' },
          { label: 'Explorer', href: 'https://explorer.lux.network' },
        ],
      },
    ],
    copyright: {
      text: 'Lux Partners Ltd.',
      badge: 'Post-Quantum Ready',
    },
  },

  meta: {
    title: 'Lux Network - Open Source',
    description: 'Open source blockchain infrastructure from Lux Network',
  },

  brandColor: '#ffffff', // Monochrome for Lux
};
