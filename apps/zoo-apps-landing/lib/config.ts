/**
 * Zoo Apps Organization Configuration
 */

export const config = {
  org: {
    name: 'Zoo Apps',
    github: 'zoo-apps',
    tagline: 'Open Source',
    description: 'Open-source applications from Zoo Labs. AI-powered tools, blockchain infrastructure, and developer utilities.',
  },

  links: {
    website: 'https://zoo.network',
    docs: 'https://docs.zoo.network',
    github: 'https://github.com/zoo-apps',
    discord: 'https://discord.gg/zoo',
    twitter: 'https://twitter.com/zoolabs',
  },

  featuredRepos: [
    'zoo',
    'zdk',
    'sdk',
    'contracts',
    'app',
    'api',
    'docs',
    'cli',
  ],

  footer: {
    sections: [
      {
        title: 'Zoo Apps',
        links: [
          { label: 'Website', href: 'https://zoo.network' },
          { label: 'Documentation', href: 'https://docs.zoo.network' },
          { label: 'GitHub', href: 'https://github.com/zoo-apps' },
        ],
      },
      {
        title: 'Applications',
        links: [
          { label: 'Zoo App', href: 'https://github.com/zoo-apps/zoo' },
          { label: 'SDK', href: 'https://github.com/zoo-apps/sdk' },
          { label: 'CLI', href: 'https://github.com/zoo-apps/cli' },
          { label: 'API', href: 'https://github.com/zoo-apps/api' },
        ],
      },
      {
        title: 'Ecosystem',
        links: [
          { label: 'Hanzo AI', href: 'https://hanzoai.github.io' },
          { label: 'Zoo AI', href: 'https://zooai.github.io' },
          { label: 'Lux Network', href: 'https://luxfi.github.io' },
          { label: 'Lux DeFi', href: 'https://luxdefi.github.io' },
        ],
      },
      {
        title: 'Community',
        links: [
          { label: 'Discord', href: 'https://discord.gg/zoo' },
          { label: 'Twitter', href: 'https://twitter.com/zoolabs' },
          { label: 'Foundation', href: 'https://zoo.ngo' },
        ],
      },
    ],
    copyright: {
      text: 'Zoo Labs Foundation',
      badge: 'Open AI Research',
    },
  },

  meta: {
    title: 'Zoo Apps - Open Source',
    description: 'Open source applications from Zoo Labs',
  },

  brandColor: '#06b6d4', // Cyan for Zoo
};
