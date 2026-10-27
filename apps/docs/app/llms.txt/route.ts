import { blog, source } from '@/lib/source';
import { ORIGIN, twinPath } from '@/lib/twin';

// THE INDEX: every page, not every page a human navigates to. Each line links
// the page's Markdown twin (`<page>.md`, scripts/twins.ts), absolute, so an
// agent reading this file reads Markdown at every hop.
//
// This rendered the sidebar — `llms(source).index()` walks the page TREE — and
// the tree is a navigation decision. A capability's folder deliberately lists
// only its own page, because a sidebar folder holding 200 operations is a tree
// nobody opens; that choice is right for a reader and wrong for an agent, and
// with one structure answering both questions it silently kept 2,283 operation
// pages out of the index while they published, sat in the sitemap and served
// their own markdown twin.
//
// So the index is built from the PAGES, grouped by section. What a human
// navigates and what an agent enumerates are different questions, and they now
// have different answers.
export const revalidate = false;

/**
 * Sections whose heading says more than their title does. Everything else takes
 * the title the section already carries — a folder's meta.json or a page's own
 * frontmatter — rather than falling back to the slug.
 *
 * Measured on the live file before this: 26 of 35 headings were raw slugs
 * (api-keys, apps, chat, concepts, console, credits, ...), because the map below
 * held 8 entries and everything absent from it printed its directory name. This
 * is the canonical entry point for an agent reading the site, so a heading that
 * reads "api-keys" instead of "Authentication" is the first thing it learns.
 */
const TITLES: Record<string, string> = {
  agents: 'Agents — start here, the prompt to hand one, and a campaign run from one',
  openapi: 'API reference — one page per capability, one per operation',
  cli: 'CLI — the `hanzo` command line, one page per capability',
  start: 'Start — six journeys, each shown as CLI, SDK, HTTP and MCP',
  'mcp-tools': 'MCP — one page per tool MCP exposes',
  projects: 'Open source — docs ported from the repositories themselves',
  sdks: 'SDKs — one page per language',
  architecture: 'Architecture',
  contributing: 'Contributing',
  // `...about` inlines the company page into the root sidebar, so the tree has
  // no folder to name this section and it would print its slug.
  about: 'About Hanzo',
};

/**
 * What the file says before the index: who Hanzo is, the way in for an agent,
 * and the company. An agent reads the top of this file first, so the answer to
 * "how do I start" is there rather than after thousands of index lines. Every
 * line is the same fact the linked page states; the page explains it.
 */
const HEAD = [
  '# Hanzo',
  '',
  "> The AI operating system for business. Building business software since 2014. Techstars '17.",
  '',
  `Every page below is Markdown: a page's address with \`.md\` appended. How an agent authenticates: [auth.md](${ORIGIN}/auth.md). Everything in one file: [llms-full.txt](${ORIGIN}/llms-full.txt).`,
  '',
  '## For agents',
  '',
  'Sign up free with a wallet. Get an API key free. A small free allowance to try it. Top up in USDC or USDT over the API to raise your limits and pay as you go. No human required.',
  '',
  `- Wallet sign-up: \`GET /v1/iam/web3/nonce?chain=evm&address=<address>\` on hanzo.id, sign the message it describes with EIP-191, \`POST /v1/iam/web3/verify\`, exchange the code with \`POST /v1/iam/oauth/token\`, then \`POST /v1/account/keys\` on api.hanzo.ai. A first-seen wallet gets its own account and organization with a small free allowance to try it. The whole flow as one TypeScript file: [Agents: start here](${ORIGIN}/docs/agents.md).`,
  `- [Headless, step by step](${ORIGIN}/docs/agents/headless.md): each request and its answer: challenge, signature, verify, token, key, limits, a 429, the USDC or USDT deposit and the balance.`,
  `- [auth.md](${ORIGIN}/auth.md): the wallet flow, the device flow, API keys and revocation, with IAM's discovery documents.`,
  `- [Agents: start here](${ORIGIN}/docs/agents.md): a credential, the free tier, the first call, MCP, Kai, rate limits and spend control.`,
  `- [The prompt](${ORIGIN}/docs/agents/prompt.md): one block to hand any agent that builds on Hanzo.`,
  '- Key: `hanzo auth login`, then `hanzo account keys create --name agent --type secret`. With an inbox, the four-request email-code sequence on /docs/agents ends in the same key mint.',
  '- Free: a wallet account gets a small free allowance to try it; read it live with `GET /v1/allowance` and `GET /v1/billing/tier` on api.hanzo.ai. A person on the Free plan gets 50 requests a day on `zen-free` and `enso-free`, and 50 Kai decisions a day. No card.',
  '- Limits: a 429 with code `free_plan_cap` means the free allowance is used. Wait for `resets_at`, or raise it: `POST /v1/billing/crypto/deposit`, send to the address it returns, and calls past the allowance draw on the balance (`GET /v1/billing/balance`).',
  '- Pay: plans from $20 a month ([pricing](https://hanzo.ai/pricing)), card, Apple Pay or Google Pay at [hanzo.ai/pay](https://hanzo.ai/pay), or USDC and USDT over the API: `POST /v1/billing/crypto/deposit`.',
  '- Evaluate Kai: `POST /v1/decisions`; the frozen harness is [hanzoai/benchmarks](https://github.com/hanzoai/benchmarks) (`decision/`); published runs: [app.phishing](https://api.hanzo.ai/v1/research/runs?org=hanzo&benchmark=app.phishing).',
  '- Skills: [hanzoskills.com](https://hanzoskills.com)',
  '',
  '## Company',
  '',
  '- Since 2014: founded as Crowdstart, renamed Hanzo in 2016. First commit 2014-09-29; Go-native since October 2014. First customer SKULLY raised $1M in about 45 hours, the fastest fully funded campaign on Indiegogo.',
  '- AI and machine learning in commercial use since 2014; GPT models by 2019.',
  '- 2017: the first blockchain-native commerce platform; the Unikrn ICO raised over 120,000 ETH. Techstars \'17.',
  '- 2020: Damon Motorcycles sold $8.4M of motorcycles in 30 days at a 541:1 return on ad spend, on AI-generated ads.',
  '- Hundreds of venture-funded startups served, funded by Y Combinator, 500 Startups and Techstars; billions in client revenue; two companies past 100 million users; two went public on Nasdaq in 2024, Damon Motorcycles and Triller.',
  '- People: Antje Worring, CEO; Zach Kelling, CTO.',
  '- Talk to us: [cal.com/hanzo](https://cal.com/hanzo), [hanzo.ai/contact](https://hanzo.ai/contact). Investors: ir@hanzo.ai.',
  `- [About Hanzo](${ORIGIN}/docs/about/company.md); the full history is [hanzo.ai/about](https://hanzo.ai/about).`,
  '',
];

export function GET() {
  const pages = source.getPages();

  // The section's own title, from the tree the sidebar renders — so a section
  // is named the same way in both places and adding one needs no edit here.
  const named = new Map<string, string>();
  for (const node of source.getPageTree().children) {
    if (node.type === 'separator') continue;
    const slug = ('$id' in node ? String(node.$id) : '').split('/').filter(Boolean).pop();
    if (slug && typeof node.name === 'string') named.set(slug, node.name);
  }
  const titleOf = (section: string): string => {
    if (!section) return 'Docs';
    const fromTree = named.get(section);
    if (fromTree) return fromTree;
    const index = source.getPage([section]);
    return (index?.data.title as string | undefined) ?? section;
  };

  const bySection = new Map<string, typeof pages>();
  for (const page of pages) {
    const section = page.slugs.length ? page.slugs[0] : '';
    const list = bySection.get(section) ?? [];
    list.push(page);
    bySection.set(section, list);
  }

  const line = (page: (typeof pages)[number]): string => {
    const desc = String(page.data.description ?? '').replace(/\s+/g, ' ').trim();
    return `- [${page.data.title}](${ORIGIN}${twinPath(page.url)})${desc ? `: ${desc}` : ''}`;
  };

  const out: string[] = [...HEAD];
  // Sections in the order the root sidebar declares them, then anything else —
  // so the file reads like the site and cannot silently drop a new section.
  const sections = [...bySection.keys()].sort((a, b) => {
    const ai = Object.keys(TITLES).indexOf(a);
    const bi = Object.keys(TITLES).indexOf(b);
    if (ai !== bi) return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi);
    return a.localeCompare(b);
  });

  for (const section of sections) {
    const list = bySection.get(section)!;
    out.push(`## ${TITLES[section] ?? titleOf(section)}`, '');
    for (const page of list.sort((a, b) => a.url.localeCompare(b.url))) out.push(line(page));
    out.push('');
  }

  // The pages outside /docs, each with its twin too.
  out.push(
    '## Site',
    '',
    `- [Hanzo Docs](${ORIGIN}/index.md): the front page.`,
    `- [API reference](${ORIGIN}/reference.md): where the OpenAPI document is, and the same reference as pages.`,
    `- [Blog](${ORIGIN}/blog.md)`,
    ...blog.getPages().map((post) => `- [${post.data.title}](${ORIGIN}${twinPath(post.url)})`),
    '',
  );

  return new Response(out.join('\n'), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
