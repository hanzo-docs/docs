import { defineOrg } from '../config';

export const zoo = defineOrg({
  name: 'Zoo Labs',
  slug: 'zoo',
  domain: 'zoo.ngo',
  docsPattern: '{project}.zoo.ngo',
  github: 'https://github.com/zoo-labs',
  logo: 'Z',
  brand: {
    primary: '142 72% 42%',
  },
  projects: [
    {
      slug: 'core',
      name: 'Zoo Core',
      description: 'Core ecosystem application',
      icon: 'layout-grid',
      category: 'Core',
    },
    {
      slug: 'contracts',
      name: 'Contracts',
      description: 'Smart contracts and DeFi protocols',
      icon: 'file-code',
      category: 'Core',
    },
    {
      slug: 'zips',
      name: 'ZIPs',
      description: 'Zoo Improvement Proposals',
      icon: 'scroll-text',
      category: 'Governance',
      url: 'https://zips.zoo.ngo',
      external: true,
    },
    {
      slug: 'sdk',
      name: 'SDK',
      description: 'TypeScript SDK for Zoo ecosystem',
      icon: 'code',
      category: 'SDKs',
    },
  ],
});
