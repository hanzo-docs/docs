/**
 * Zap Protocol Organization Configuration
 */

export const config = {
  org: {
    name: 'Zap Protocol',
    github: 'zap-protocol',
    tagline: 'Open Source',
    description: 'Decentralized oracle and data protocol. Powering Web3 with reliable off-chain data.',
  },

  links: {
    website: 'https://zap.org',
    docs: 'https://docs.zap.org',
    github: 'https://github.com/zap-protocol',
    discord: 'https://discord.gg/zap',
    twitter: 'https://twitter.com/zapprotocol',
  },

  featuredRepos: [
    'zap-monorepo',
    'zap-ethereum',
    'zap-solidity',
    'oracle',
    'bonding-curves',
  ],

  footer: {
    sections: [
      {
        title: 'Zap Protocol',
        links: [
          { label: 'Website', href: 'https://zap.org' },
          { label: 'Documentation', href: 'https://docs.zap.org' },
          { label: 'GitHub', href: 'https://github.com/zap-protocol' },
        ],
      },
      {
        title: 'Products',
        links: [
          { label: 'Oracle', href: 'https://github.com/zap-protocol/oracle' },
          { label: 'Bonding Curves', href: 'https://github.com/zap-protocol/bonding-curves' },
          { label: 'Smart Contracts', href: 'https://github.com/zap-protocol/zap-solidity' },
        ],
      },
      {
        title: 'Ecosystem',
        links: [
          { label: 'Hanzo AI', href: 'https://hanzoai.github.io' },
          { label: 'Lux Network', href: 'https://luxfi.github.io' },
        ],
      },
      {
        title: 'Community',
        links: [
          { label: 'Discord', href: 'https://discord.gg/zap' },
          { label: 'Twitter', href: 'https://twitter.com/zapprotocol' },
        ],
      },
    ],
    copyright: {
      text: 'Zap Protocol',
      badge: 'Oracles',
    },
  },

  meta: {
    title: 'Zap Protocol - Open Source',
    description: 'Decentralized oracle and data protocol for Web3',
  },

  brandColor: '#facc15',
};
