import type { Root } from '@hanzo/docs/page-tree';

export default {
  name: 'Docs',
  children: [
    {
      type: 'page',
      name: 'Home',
      url: '/docs',
    },
    {
      type: 'page',
      name: 'Comparisons',
      url: '/docs/comparisons',
    },
    {
      type: 'page',
      name: 'Test',
      url: '/docs/test',
    },
  ],
} satisfies Root;
