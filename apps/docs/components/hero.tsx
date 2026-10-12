import { highlight } from '@hanzo/docs-core/highlight';
import { DocsHero, type Door } from '@/components/docs-hero';
import { Listing } from '@/components/mdx/code';
import { shikiConfig } from '@/lib/shiki';

/**
 * The three paths, the CLI first and the browser and the API as the alternatives. Each carries its real first
 * step — these are commands that work, not illustrative pseudocode.
 */
const PATHS = [
  {
    id: 'cli',
    eyebrow: 'Start here',
    title: 'Start with the CLI',
    body: 'Install it, then run hanzo: it signs you in, asks which coding agent is your favourite and launches it. Every other path on this site starts here.',
    href: '/docs/quickstart',
    external: false,
    cta: 'Open the quickstart',
    lang: 'Terminal',
    grammar: 'bash',
    code: 'curl -fsSL hanzo.sh | sh\nhanzo',
  },
  {
    id: 'app',
    eyebrow: 'In the browser',
    title: 'Use the dashboard',
    body: 'Chat, agents and MCP tools at hanzo.app, and your keys and usage on the platform — nothing to install.',
    href: 'https://hanzo.app',
    external: true,
    cta: 'Open hanzo.app',
    lang: 'You type',
    grammar: 'text',
    code: 'Build me a multiplayer snake game with a\nleaderboard, and deploy it.',
  },
  {
    id: 'api',
    eyebrow: 'From code',
    title: 'Use an SDK or the API',
    body: 'Over 400 models behind one REST endpoint. One API key works across every service we run.',
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
