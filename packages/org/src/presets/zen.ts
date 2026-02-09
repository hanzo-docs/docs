import { defineOrg } from '../config';

export const zen = defineOrg({
  name: 'Zen LM',
  slug: 'zen',
  domain: 'zen.lm',
  docsPattern: '{project}.zen.lm',
  github: 'https://github.com/zen-lm',
  logo: 'Z',
  brand: {
    primary: '270 60% 55%',
  },
  projects: [
    {
      slug: 'models',
      name: 'Models',
      description: 'Frontier model documentation',
      icon: 'brain',
      category: 'Core',
    },
    {
      slug: 'coder',
      name: 'Coder',
      description: 'Code generation models',
      icon: 'code',
      category: 'Models',
    },
    {
      slug: 'training',
      name: 'Training',
      description: 'Model training infrastructure',
      icon: 'cpu',
      category: 'Infrastructure',
    },
    {
      slug: 'eval',
      name: 'Eval',
      description: 'Model evaluation and benchmarks',
      icon: 'bar-chart',
      category: 'Tools',
    },
  ],
});
