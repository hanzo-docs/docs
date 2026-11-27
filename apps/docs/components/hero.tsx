import { highlight } from '@hanzo/docs-core/highlight';
import { DocsHero, type Door } from '@/components/docs-hero';
import { Listing } from '@/components/mdx/code';
import { shikiConfig } from '@/lib/shiki';

/**
 * The three entry paths: Build with App, Build with CLI, Build with Platform.
 * Each carries its real first step — commands and requests that work out of the box.
 */
const PATHS = [
  {
    id: 'app',
    eyebrow: 'Visual & Agentic OS',
    title: 'Build with App',
    body: 'Describe what you want in English or work inside Hanzo Desktop, Studio, Bot & Team — full-stack apps, workflows, media, and MCP tools ready out of the box.',
    href: 'https://hanzo.app',
    external: true,
    cta: 'Open hanzo.app',
    lang: 'You type',
    grammar: 'text',
    code: 'Build a real-time customer support workspace with Kai triage,\nx402 usage billing, and deploy it to production.',
  },
  {
    id: 'cli',
    eyebrow: 'Local Runtime & Coding Agent',
    title: 'Build with CLI',
    body: 'Boot your local k3s runtime & OSS Cloud (hanzo start, hanzo up), deploy multi-project apps, and ship code in your repo with hanzo dev.',
    href: '/docs/cli',
    external: false,
    cta: 'Read the CLI docs',
    lang: 'Terminal',
    grammar: 'bash',
    code: 'curl -fsSL https://hanzo.sh | sh\nhanzo up\nhanzo dev "add live leaderboard + x402 billing and deploy"',
  },
  {
    id: 'platform',
    eyebrow: 'OSS Cloud, SDKs & /v1 APIs',
    title: 'Build with Platform',
    body: '500+ models behind one key (Enso, Kai, Zen), plus ~110 self-hostable OSS Cloud capabilities (/v1/iam, /v1/kms, /v1/base, /v1/kv, /v1/vector, /v1/pubsub, /v1/commerce, /v1/sandbox, Zero-Trust K8s) in our cloud or on your own hardware.',
    href: '/docs/architecture',
    external: false,
    cta: 'Explore the Platform',
    lang: 'Request',
    grammar: 'bash',
    code: 'curl https://api.hanzo.ai/v1/chat/completions \\\n  -H "Authorization: Bearer $HANZO_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d \'{"model":"enso-auto","messages":[{"role":"user","content":"Design our /v1 architecture"}]}\'',
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
