/**
 * Lux C++ Organization Configuration
 */

export const config = {
  org: {
    name: 'Lux C++',
    github: 'luxcpp',
    tagline: 'Open Source',
    description: 'High-performance C++ libraries for blockchain and cryptography. Core infrastructure components.',
  },

  links: {
    website: 'https://luxcpp.github.io',
    docs: 'https://luxcpp.github.io/docs',
    github: 'https://github.com/luxcpp',
    discord: 'https://discord.gg/lux',
    twitter: 'https://twitter.com/luxnetwork',
  },

  featuredRepos: [
    'core',
    'crypto',
    'network',
    'vm',
  ],

  footer: {
    sections: [
      {
        title: 'Lux C++',
        links: [
          { label: 'Website', href: 'https://luxcpp.github.io' },
          { label: 'Documentation', href: 'https://luxcpp.github.io/docs' },
          { label: 'GitHub', href: 'https://github.com/luxcpp' },
        ],
      },
      {
        title: 'Libraries',
        links: [
          { label: 'Core', href: 'https://github.com/luxcpp/core' },
          { label: 'Crypto', href: 'https://github.com/luxcpp/crypto' },
          { label: 'Network', href: 'https://github.com/luxcpp/network' },
        ],
      },
      {
        title: 'Ecosystem',
        links: [
          { label: 'Lux Network', href: 'https://luxfi.github.io' },
          { label: 'Lux FHE', href: 'https://luxfhe.github.io' },
          { label: 'Hanzo AI', href: 'https://hanzoai.github.io' },
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
      badge: 'C++20',
    },
  },

  meta: {
    title: 'Lux C++ - Open Source',
    description: 'High-performance C++ libraries for blockchain infrastructure',
  },

  brandColor: '#ffffff', // Monochrome for Lux
};
