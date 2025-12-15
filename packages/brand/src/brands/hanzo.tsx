import type { BrandConfig } from '../types';

/**
 * Hanzo AI brand icon component
 */
export function HanzoIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  );
}

/**
 * Hanzo AI Documentation brand configuration
 */
export const hanzoBrand: BrandConfig = {
  id: 'hanzo',
  name: 'Hanzo',
  fullName: 'Hanzo AI Inc',
  tagline: 'AI Infrastructure for the Future',

  colors: {
    primary: 'hsl(26, 73%, 51%)',           // Vibrant Orange
    primaryForeground: 'white',
    secondary: '#c6bb58',                    // Gold accent
    secondaryForeground: '#97890c',
    accent: 'hsl(33, 100%, 50%)',
    themeColorLight: '#ffffff',
    themeColorDark: '#0A0A0A',
    // Dark mode overrides
    darkPrimary: '#fff383',                  // Bright yellow
    darkPrimaryForeground: 'black',
    darkSecondary: '#fc7744',
    darkSecondaryForeground: '#521700',
  },

  logo: {
    component: <HanzoIcon className="size-5" />,
    alt: 'Hanzo AI',
    width: 24,
    height: 24,
  },

  links: {
    github: 'https://github.com/hanzoai',
    twitter: 'https://x.com/hanaboroshi',
    discord: 'https://discord.gg/hanzo',
    website: 'https://hanzo.ai',
    docs: 'https://docs.hanzo.ai',
  },

  metadata: {
    title: 'Hanzo Docs',
    titleTemplate: '%s | Hanzo Docs',
    description: 'Documentation for Hanzo AI infrastructure, agents, MCP tools, and SDKs.',
    keywords: ['Hanzo', 'AI', 'MCP', 'Agents', 'LLM', 'Documentation'],
    ogImage: '/og/hanzo.png',
    twitterHandle: '@hanzoai',
  },

  footer: {
    copyright: `© ${new Date().getFullYear()} Hanzo AI Inc. All rights reserved.`,
    showBuiltWith: true,
    links: [
      {
        title: 'Products',
        items: [
          { label: 'LLM Gateway', href: '/docs/llm' },
          { label: 'Agent SDK', href: '/docs/agent' },
          { label: 'MCP Tools', href: '/docs/mcp' },
          { label: 'Chat', href: '/docs/chat' },
        ],
      },
      {
        title: 'Resources',
        items: [
          { label: 'Blog', href: '/blog' },
          { label: 'API Reference', href: '/docs/api' },
          { label: 'Examples', href: '/docs/examples' },
          { label: 'Changelog', href: '/docs/changelog' },
        ],
      },
      {
        title: 'Company',
        items: [
          { label: 'About', href: 'https://hanzo.ai/about', external: true },
          { label: 'GitHub', href: 'https://github.com/hanzoai', external: true },
          { label: 'Twitter', href: 'https://x.com/hanzoai', external: true },
          { label: 'Discord', href: 'https://discord.gg/hanzo', external: true },
        ],
      },
    ],
  },

  rootClassName: 'brand-hanzo',
};

export default hanzoBrand;
