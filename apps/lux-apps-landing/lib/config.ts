/**
 * Lux Apps Organization Configuration
 */

export const config = {
  org: {
    name: 'Lux Apps',
    github: 'lux-apps',
    tagline: 'Open Source',
    description: 'Application templates and tools for the Lux ecosystem. Build on Lux Network.',
  },

  links: {
    website: 'https://lux.network',
    docs: 'https://docs.lux.network',
    github: 'https://github.com/lux-apps',
    discord: 'https://discord.gg/lux',
    twitter: 'https://twitter.com/luxnetwork',
  },

  featuredRepos: [
    'wallet',
    'explorer',
    'bridge',
    'staking',
  ],

  footer: {
    sections: [
      {
        title: 'Lux Apps',
        links: [
          { label: 'Website', href: 'https://lux.network' },
          { label: 'Documentation', href: 'https://docs.lux.network' },
          { label: 'GitHub', href: 'https://github.com/lux-apps' },
        ],
      },
      {
        title: 'Applications',
        links: [
          { label: 'Wallet', href: 'https://github.com/lux-apps' },
          { label: 'Explorer', href: 'https://github.com/lux-apps' },
          { label: 'Bridge', href: 'https://github.com/lux-apps' },
        ],
      },
      {
        title: 'Ecosystem',
        links: [
          { label: 'Lux Network', href: 'https://luxfi.github.io' },
          { label: 'Lux C++', href: 'https://luxcpp.github.io' },
          { label: 'Lux FHE', href: 'https://luxfhe.github.io' },
        ],
      },
      {
        title: 'Community',
        links: [
          { label: 'Discord', href: 'https://discord.gg/lux' },
          { label: 'Twitter', href: 'https://twitter.com/luxnetwork' },
        ],
      },
    ],
    copyright: {
      text: 'Lux Partners Ltd.',
      badge: 'Applications',
    },
  },

  meta: {
    title: 'Lux Apps - Open Source',
    description: 'Application templates and tools for the Lux ecosystem',
  },

  brandColor: '#ffffff',
};
