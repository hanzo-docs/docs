/**
 * Lux DeFi Organization Configuration
 */

export const config = {
  org: {
    name: 'Lux DeFi',
    github: 'luxdefi',
    tagline: 'Open Source',
    description: 'Decentralized finance infrastructure for the Lux ecosystem. Bridges, DEX, lending, and yield protocols.',
  },

  links: {
    website: 'https://lux.finance',
    docs: 'https://docs.lux.finance',
    github: 'https://github.com/luxdefi',
    discord: 'https://discord.gg/lux',
    twitter: 'https://twitter.com/luxdefi',
  },

  featuredRepos: [
    'bridge',
    'swap',
    'pool',
    'lend',
    'yield',
    'vault',
    'oracle',
    'sdk',
  ],

  footer: {
    sections: [
      {
        title: 'Lux DeFi',
        links: [
          { label: 'Website', href: 'https://lux.finance' },
          { label: 'Documentation', href: 'https://docs.lux.finance' },
          { label: 'GitHub', href: 'https://github.com/luxdefi' },
        ],
      },
      {
        title: 'Protocols',
        links: [
          { label: 'Bridge', href: 'https://github.com/luxdefi/bridge' },
          { label: 'Swap', href: 'https://github.com/luxdefi/swap' },
          { label: 'Pool', href: 'https://github.com/luxdefi/pool' },
          { label: 'Lend', href: 'https://github.com/luxdefi/lend' },
        ],
      },
      {
        title: 'Ecosystem',
        links: [
          { label: 'Lux Network', href: 'https://luxfi.github.io' },
          { label: 'Hanzo AI', href: 'https://hanzoai.github.io' },
          { label: 'Zoo AI', href: 'https://zooai.github.io' },
          { label: 'Lux FHE', href: 'https://luxfhe.github.io' },
        ],
      },
      {
        title: 'Community',
        links: [
          { label: 'Discord', href: 'https://discord.gg/lux' },
          { label: 'Twitter', href: 'https://twitter.com/luxdefi' },
          { label: 'Explorer', href: 'https://explorer.lux.network' },
        ],
      },
    ],
    copyright: {
      text: 'Lux Partners Ltd.',
      badge: 'DeFi Infrastructure',
    },
  },

  meta: {
    title: 'Lux DeFi - Open Source',
    description: 'Open source DeFi infrastructure from Lux DeFi',
  },

  brandColor: '#10b981', // Emerald for DeFi
};
