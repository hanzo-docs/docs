import { source } from '@/lib/source';

// THE INDEX: every page, not every page a human navigates to.
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
  '## For agents',
  '',
  'No human required: sign in with a wallet, get a key, call the API, top up in USDC.',
  '',
  '- Wallet sign-up: GET https://hanzo.id/v1/iam/web3/nonce?chain=evm&address=<address>, sign the message it describes with EIP-191, POST https://hanzo.id/v1/iam/web3/verify, exchange the code at https://hanzo.id/v1/iam/oauth/token, then POST https://api.hanzo.ai/v1/account/keys. A first-seen wallet gets its own account and organization on the Free plan. The whole flow as one TypeScript file: [Headless: sign in with a wallet](/docs/agents#1-headless-sign-in-with-a-wallet).',
  '- [Agents: start here](/docs/agents): a credential, the free tier, the first call, MCP, Kai, rate limits and spend control.',
  '- [The prompt](/docs/agents/prompt): one block to hand any agent that builds on Hanzo.',
  '- Key: `hanzo auth login`, then `hanzo account keys create --name agent --type secret`. With an inbox, the four-request email-code sequence on /docs/agents ends in the same key mint.',
  '- Free: 50 requests a day per person on `zen-free` and `enso-free`, and 50 Kai decisions a day. No card.',
  '- Pay: plans from $20 a month (https://hanzo.ai/pricing), card, Apple Pay or Google Pay at https://hanzo.ai/pay, or USDC and USDT over the API: POST https://api.hanzo.ai/v1/billing/crypto/deposit.',
  '- Evaluate Kai: POST https://api.hanzo.ai/v1/decisions; the frozen harness is https://github.com/hanzoai/benchmarks (decision/); published runs: https://api.hanzo.ai/v1/research/runs?org=hanzo&benchmark=app.phishing',
  '- Skills: https://hanzoskills.com',
  '',
  '## Company',
  '',
  '- Since 2014: founded as Crowdstart, renamed Hanzo in 2016. First commit 2014-09-29; Go-native since October 2014. First customer SKULLY raised $1M in about 45 hours, the fastest fully funded campaign on Indiegogo.',
  '- AI and machine learning in commercial use since 2014; GPT models by 2019.',
  '- 2017: the first blockchain-native commerce platform; the Unikrn ICO raised over 120,000 ETH. Techstars \'17.',
  '- 2020: Damon Motorcycles sold $8.4M of motorcycles in 30 days at a 541:1 return on ad spend, on AI-generated ads.',
  '- Hundreds of venture-funded startups served, funded by Y Combinator, 500 Startups and Techstars; billions in client revenue; two companies past 100 million users; two went public on Nasdaq in 2024, Damon Motorcycles and Triller.',
  '- People: Antje Worring, CEO; Zach Kelling, CTO.',
  '- Talk to us: https://cal.com/hanzo, https://hanzo.ai/contact. Investors: ir@hanzo.ai.',
  '- [About Hanzo](/docs/about/company); the full history is https://hanzo.ai/about',
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
    return `- [${page.data.title}](${page.url})${desc ? `: ${desc}` : ''}`;
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

  return new Response(out.join('\n'), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
