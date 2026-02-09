import { defineOrg } from '../config';

export const lux = defineOrg({
  name: 'Lux Network',
  slug: 'lux',
  domain: 'lux.network',
  docsPattern: '{project}.lux.network',
  github: 'https://github.com/luxfi',
  logo: 'L',
  brand: {
    primary: '45 93% 47%',
  },
  projects: [
    {
      slug: 'node',
      name: 'Lux Node',
      description: 'Core blockchain node software',
      icon: 'server',
      category: 'Core',
    },
    {
      slug: 'wallet',
      name: 'Wallet',
      description: 'HD wallet and key management',
      icon: 'wallet',
      category: 'Tools',
    },
    {
      slug: 'cli',
      name: 'CLI',
      description: 'Command line interface for Lux',
      icon: 'terminal',
      category: 'Tools',
    },
    {
      slug: 'sdk',
      name: 'SDK',
      description: 'Client libraries and tools',
      icon: 'code',
      category: 'SDKs',
    },
    {
      slug: 'bridge',
      name: 'Bridge',
      description: 'Cross-chain bridge',
      icon: 'link',
      category: 'Infrastructure',
    },
    {
      slug: 'explorer',
      name: 'Explorer',
      description: 'Blockchain explorer',
      icon: 'search',
      category: 'Apps',
    },
  ],
});
