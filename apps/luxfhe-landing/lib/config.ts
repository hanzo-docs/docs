/**
 * Lux FHE Organization Configuration
 */

export const config = {
  org: {
    name: 'Lux FHE',
    github: 'luxfhe',
    tagline: 'Open Source',
    description: 'Fully Homomorphic Encryption libraries. Privacy-preserving computation for AI and blockchain.',
  },

  links: {
    website: 'https://luxfhe.github.io',
    docs: 'https://luxfhe.github.io/docs',
    github: 'https://github.com/luxfhe',
    discord: 'https://discord.gg/lux',
    twitter: 'https://twitter.com/luxnetwork',
  },

  featuredRepos: [
    'tfhe',
    'concrete',
    'openfhe',
    'lattigo',
    'seal',
    'palisade',
  ],

  footer: {
    sections: [
      {
        title: 'Lux FHE',
        links: [
          { label: 'Website', href: 'https://luxfhe.github.io' },
          { label: 'Documentation', href: 'https://luxfhe.github.io/docs' },
          { label: 'GitHub', href: 'https://github.com/luxfhe' },
        ],
      },
      {
        title: 'Libraries',
        links: [
          { label: 'TFHE', href: 'https://github.com/luxfhe/tfhe' },
          { label: 'Concrete', href: 'https://github.com/luxfhe/concrete' },
          { label: 'OpenFHE', href: 'https://github.com/luxfhe/openfhe' },
          { label: 'Lattigo', href: 'https://github.com/luxfhe/lattigo' },
        ],
      },
      {
        title: 'Ecosystem',
        links: [
          { label: 'Lux Network', href: 'https://luxfi.github.io' },
          { label: 'Lux C++', href: 'https://luxcpp.github.io' },
          { label: 'Hanzo AI', href: 'https://hanzoai.github.io' },
        ],
      },
      {
        title: 'Community',
        links: [
          { label: 'Discord', href: 'https://discord.gg/lux' },
          { label: 'Twitter', href: 'https://twitter.com/luxnetwork' },
          { label: 'Research', href: 'https://github.com/luxfhe/papers' },
        ],
      },
    ],
    copyright: {
      text: 'Lux Partners Ltd.',
      badge: 'FHE Research',
    },
  },

  meta: {
    title: 'Lux FHE - Open Source',
    description: 'Fully Homomorphic Encryption libraries for privacy-preserving computation',
  },

  brandColor: '#ffffff', // Monochrome for Lux
};
