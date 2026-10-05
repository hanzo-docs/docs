import { highlight } from '@hanzo/docs-core/highlight';
import { DocsHero, type Door } from '@/components/docs-hero';
import { Listing } from '@/components/mdx/code';
import { shikiConfig } from '@/lib/shiki';

/**
 * The three paths, ordered by how much you type. Each carries its real first
 * step — these are commands that work, not illustrative pseudocode.
 */
const PATHS = [
  {
    id: 'app',
    eyebrow: 'No code',
    title: 'Build with App',
    body: 'Describe what you want in English. Chat, agents and MCP tools in the browser — nothing to install.',
    href: 'https://hanzo.app',
    external: true,
    cta: 'Open hanzo.app',
    lang: 'You type',
    grammar: 'text',
    code: 'Build me a multiplayer snake game with a\nleaderboard, and deploy it.',
  },
  {
    id: 'cli',
    eyebrow: 'In your terminal',
    title: 'Build with Dev',
    body: 'Our coding agent, in your repo. It reads the codebase, writes the change and runs the tests.',
    href: '/docs/cli',
    external: false,
    cta: 'Read the CLI docs',
    lang: 'Terminal',
    grammar: 'bash',
    code: 'curl -fsSL https://hanzo.sh | sh\nhanzo auth login\nhanzo dev "add a leaderboard to the game"',
  },
  {
    id: 'api',
    eyebrow: 'Lower level',
    title: 'Build with API',
    body: 'Over 400 models behind one REST endpoint. One bearer token works across every service we run.',
    href: '/docs/openapi',
    external: false,
    cta: 'Read the API reference',
    lang: 'Request',
    grammar: 'bash',
    code: 'curl https://api.hanzo.ai/v1/chat/completions \\\n  -H "Authorization: Bearer sk-..." \\\n  -d \'{"model":"enso","messages":[...]}\'',
  },
] as const;

/**
 * The docs masthead, with each door's first step highlighted as the page
 * renders: the same themes as every other block, and no highlighter in the
 * browser. The tabs that switch between them are DocsHero's.
 */
export async function Hero() {
  const doors: Door[] = await Promise.all(
    PATHS.map(async ({ grammar, code, ...door }) => ({
      ...door,
      sample: await highlight(code, { lang: grammar, ...shikiConfig, components: { pre: Listing } }),
    })),
  );
  return <DocsHero doors={doors} />;
}
