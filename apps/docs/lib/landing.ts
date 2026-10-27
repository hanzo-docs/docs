/**
 * The front page's words, in one place: components/landing.tsx draws them and
 * app/llms.mdx/content.md writes them as /index.md, so the page and its
 * Markdown twin cannot say different things. Text in `backticks` is set in the
 * mono face on the page and as code in the twin.
 */

/**
 * What the landing states about the gateway's catalogue, read off
 * `GET /v1/models` at build time (`scripts/gen-pricing-page.ts` writes it into
 * `openapi-specs/pricing.json`). Nothing here is typed by hand.
 */
export type Catalogue = { models: number; makers: number; kai: { input?: number | null; output?: number | null } };

/** "400+": floored to the hundred, so it stays true as the catalogue moves between builds. */
export const counted = (n: number) => `${Math.floor(n / 100) * 100}+`;

/** USD per million tokens: "$0.021", "$3.00". */
const usd = (v: number) => (v >= 1 ? `$${v.toFixed(2)}` : `$${+v.toPrecision(2)}`);

export const hero = {
  title: 'The AI operating system for business.',
  lede: "Building business software since 2014. Techstars '17. Every model, every tool and Kai on one key, free to start: in the browser, from your terminal, or on your own hardware, with the same software we run in production.",
  install: 'curl hanzo.sh | sh',
  installNote: 'Installs the `hanzo` CLI. Then `hanzo auth login` to get a key.',
};

/** Enso, Kai and Zen: the three model families, before the whole catalogue. */
export function families({ kai }: Catalogue) {
  const rate =
    (kai.input != null ? `, ${usd(kai.input)} per million input tokens` : '') +
    (kai.output === 0 ? ', output free' : kai.output != null ? `, ${usd(kai.output)} per million output` : '');
  return [
    {
      name: 'Enso',
      verb: 'routes',
      body: 'The router. It picks the model for every request: send `model: "auto"` or an `enso-*` id.',
      docs: '/docs/models/enso',
      site: 'https://hanzo.ai/enso',
    },
    {
      name: 'Kai',
      verb: 'decides',
      body: `The decision model. Typed answers with calibrated probabilities at \`POST /v1/decisions\`${rate}.`,
      docs: '/docs/models/kai',
      site: 'https://hanzo.ai/kai',
    },
    {
      name: 'Zen',
      verb: 'reasons',
      body: 'The open-weight family: text, vision and audio, with the weights on Hugging Face.',
      docs: '/docs/models/zen',
      site: 'https://hanzo.ai/zen',
    },
  ];
}

export function catalogueCard({ models, makers }: Catalogue) {
  return {
    count: counted(models),
    title: 'All models',
    body: `Every model the gateway serves, from ${makers} makers, on one key and one bill. The catalogue lists each id with its live rate.`,
    cta: 'Browse the catalogue',
    href: '/docs/models',
  };
}

export const agentNote = {
  before: 'Or hand this to your agent — it installs the CLI, the MCP server and the',
  skills: { label: 'skills', href: 'https://hanzoskills.com' },
  after: ', then points its own model calls at Hanzo.',
  start: { label: 'Agents: start here', href: '/docs/agents' },
};

/** The three doors, in descending order of how much you type. */
export const doors = (models: string) => [
  { eyebrow: 'No code', title: 'Build with App', body: 'Describe it in English and watch it build. Chat, agents and MCP tools in the browser.', href: 'https://hanzo.app' },
  { eyebrow: 'In your terminal', title: 'Build with Dev', body: 'Our coding agent, in your repo. Or bring Claude Code and Codex — they work here too.', href: '/docs/cli' },
  { eyebrow: 'Lower level', title: 'Build with API', body: `${models} models behind one REST endpoint, with SDKs for every language we ship.`, href: '/docs/openapi' },
];

export const quickstart = {
  title: 'Quick Start',
  lead: 'Install the CLI, log in, and reach every capability from your terminal.',
  between: 'Sign in once, then reach every capability from the terminal — or from any SDK, over HTTP, or through MCP.',
  // The same two steps /docs/quickstart shows: install, then the first calls.
  install: [
    ['npm', 'bash', 'npm i -g hanzo'],
    ['Script', 'bash', 'curl -fsSL hanzo.sh | sh'],
    ['Homebrew', 'bash', 'brew install hanzoai/tap/hanzo'],
    ['From source', 'bash', 'git clone https://github.com/hanzoai/cli && cd cli && cargo install --path .'],
  ] as const,
  use: [
    ['CLI', 'bash', `hanzo auth login\n\nhanzo "explain quantum computing"\nhanzo models list\nhanzo projects deploy my-app`],
    ['TypeScript', 'typescript', `// npm i hanzoai\nimport { AiApi, Configuration } from 'hanzoai'\n\nconst ai = new AiApi(new Configuration())\n\nconst { data } = await ai.getModels()\nconsole.log(data.data?.length, 'models')`],
    ['Python', 'python', `# pip install hanzoai\nfrom hanzoai.cloud import AiApi, ApiClient, Configuration\n\nai = AiApi(ApiClient(Configuration()))\n\nprint(len(ai.get_models().data or []), "models")`],
    ['Go', 'go', `// go get github.com/hanzoai/go-sdk/v8\nimport hanzoai "github.com/hanzoai/go-sdk/v8"\n\nclient := hanzoai.NewAPIClient(hanzoai.NewConfiguration())\n\nmodels, _, err := client.AiAPI.GetModels(ctx).Execute()`],
    ['Rust', 'rust', `// cargo add hanzo-client\nuse hanzo_client::apis::{ai_api, configuration::Configuration};\n\nlet cfg = Configuration::new();\n\nlet models = ai_api::get_models(&cfg).await?;`],
    ['HTTP', 'bash', `curl https://api.hanzo.ai/v1/chat/completions \\\n  -H "Authorization: Bearer $HANZO_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{"model":"zen6","messages":[{"role":"user","content":"Hello!"}]}'`],
  ] as const,
};

export const platform = {
  title: 'One binary. The whole platform.',
  lead: 'Every capability has one name and one route. Browse by domain — click any card to go deep.',
};

export const domains = [
  { name: 'Identity & trust', desc: 'Who someone is, what they may touch, and where secrets stay safe. IAM, AuthZ, KMS, MPC, Zero-Trust.', icon: 'Shield', href: '/docs/openapi/iam', tag: 'Identity' },
  { name: 'Intelligence', desc: 'The mind of the cloud — every model, agent, and tool you can call. Models, Agents, MCP, Embeddings, Prompts, GPUs, Functions.', icon: 'Sparkle', href: '/docs/openapi/ai', tag: 'Intelligence' },
  { name: 'Data', desc: 'Somewhere to put your data and read it back fast. SQL, Vector, KV, Search, Object, Base, DocDB.', icon: 'Database', href: '/docs/openapi/provisioning', tag: 'Data' },
  { name: 'Streams', desc: 'Move messages and run work in the background, reliably. PubSub, Tasks, Pipelines, Crawl.', icon: 'Workflow', href: '/docs/openapi/pubsub', tag: 'Streams' },
  { name: 'Observability', desc: 'See exactly what your system is doing, live. Metrics, Logs, Traces, Sessions, Evals, Analytics.', icon: 'Activity', href: '/docs/openapi/o11y', tag: 'Observe' },
  { name: 'Commerce', desc: 'Turn usage into money — meter it, price it, bill it, reward it. Commerce, Billing, Marketplace, Referrals.', icon: 'ShoppingCart', href: '/docs/openapi/commerce', tag: 'Commerce' },
  { name: 'Platform', desc: 'Ship your code and run it anywhere. Gateway, Machines, Edge, Registry.', icon: 'Server', href: '/docs/openapi/gateway', tag: 'Platform' },
  { name: 'Applications', desc: 'The finished products people use every day. Chat, Studio, Dev, Integrations, Apps.', icon: 'LayoutGrid', href: '/docs/openapi/git', tag: 'Apps' },
  { name: 'Chain', desc: "The networks the cloud speaks to — enumerate them, call one, read a holder's balances. Web3, Explorer.", icon: 'Globe', href: '/docs/openapi/web3', tag: 'Chain' },
] as const;

export const tooling = {
  title: 'Developer Tools',
  lead: 'SDKs, APIs, and protocols for every stack.',
};

export const tools = [
  { name: 'The Network', desc: 'Run the whole cloud yourself', href: '/docs/network', icon: 'Globe' },
  { name: 'SDKs', desc: 'Python, TypeScript, Go, Rust, C++, Swift, Kotlin', href: '/docs/sdks', icon: 'Code2' },
  { name: 'API Reference', desc: 'Every /v1 endpoint, live', href: '/docs/openapi', icon: 'FileJson2' },
  { name: 'Architecture', desc: 'One binary, one contract', href: '/docs/architecture', icon: 'Package' },
] as const;

export const providerSection = (models: string) => ({
  title: 'Every model, one API',
  lead: `${models} models across every major provider — call any of them with one credential, one request shape.`,
});

export const providers = [
  { name: 'Zen', spec: 'Open weights' },
  { name: 'OpenAI', spec: 'GPT' },
  { name: 'Anthropic', spec: 'Claude' },
  { name: 'Qwen', spec: 'Open' },
  { name: 'Llama', spec: 'Open' },
  { name: 'DeepSeek', spec: 'Open' },
  { name: 'Mistral', spec: 'Open' },
  { name: 'Gemma', spec: 'Open' },
];

export const surfaces = [
  {
    icon: 'Code2',
    title: 'SDKs in every language',
    body: 'Generated from one contract — the same /v1 surface, typed for your stack.',
    chips: ['Python', 'TypeScript', 'Go', 'Rust', 'C++', 'Dart'],
    href: '/docs/sdks',
    cta: 'SDK reference',
  },
  {
    icon: 'Workflow',
    title: 'Every tool, one MCP surface',
    body: 'Native connectors + the open MCP registry — Slack, GitHub, Notion, Stripe, and more — exposed as MCP tools any agent can call.',
    chips: ['Slack', 'GitHub', 'Notion', 'Stripe', 'Google', 'Linear', '+700 more'],
    href: '/docs/mcp',
    cta: 'MCP tools',
  },
] as const;

export const cli = {
  title: 'The `hanzo` CLI',
  lead: 'A ~15 MB Rust client for any live cloud — prod, laptop, or self-host',
  commands: [
    { cmd: 'hanzo chat', desc: 'Chat with any model interactively' },
    { cmd: 'hanzo models list', desc: 'Browse every available model' },
    { cmd: 'hanzo keys create', desc: 'Create and manage API keys' },
    { cmd: 'hanzo deploy', desc: 'Deploy apps with git push' },
    { cmd: 'hanzo logs', desc: 'Stream logs from any service' },
    { cmd: 'hanzo storage', desc: 'Manage S3-compatible storage' },
    { cmd: 'hanzo secrets', desc: 'Manage secrets and env vars' },
    { cmd: 'hanzo bot', desc: 'Deploy and manage AI bots' },
    { cmd: 'hanzo flow', desc: 'Run workflow automations' },
  ],
};

export const zen = {
  title: 'Zen',
  badge: 'open weights',
  body: "The open-weight family, chosen for two jobs: agentic coding that runs on your own machine, and marketing work — copy in your brand's voice and the images and speech beside it. Weights on Hugging Face; the same ids hosted on api.hanzo.ai, routed by Enso.",
  models: [
    { name: 'zen6', spec: '27B, reads images' },
    { name: 'zen6-flash', spec: 'Ternary, fits a laptop' },
    { name: 'zen5', spec: 'Hosted' },
    { name: 'zen-embedding', spec: 'Retrieval' },
    { name: 'zen-guard', spec: 'Safety' },
  ],
  docs: { label: 'Zen models →', href: '/docs/models/zen' },
  weights: { label: 'HuggingFace →', href: 'https://huggingface.co/zenlm' },
};

export const close = {
  title: 'Start building',
  lead: 'Free tier with generous limits. No credit card required.',
  install: 'curl hanzo.sh | sh',
  primary: { label: 'Try Hanzo', href: 'https://hanzo.ai/login' },
  secondary: { label: 'Browse documentation', href: '/docs' },
};

const at = (href: string) => (href.startsWith('/') ? `https://docs.hanzo.ai${href}` : href);

/** The front page as Markdown, section by section, in the order it is drawn. */
export function markdown(catalogue: Catalogue): string {
  const models = counted(catalogue.models);
  const all = catalogueCard(catalogue);
  const fence = (lang: string, code: string) => ['```' + lang, code, '```'];
  const tabs = (rows: readonly (readonly [string, string, string])[]) =>
    rows.flatMap(([name, lang, code]) => [`**${name}**`, '', ...fence(lang, code), '']);
  return [
    hero.lede,
    '',
    ...families(catalogue).flatMap((f) => [
      `## ${f.name} ${f.verb}.`,
      '',
      f.body,
      '',
      `[Docs](${at(f.docs)}) · [${f.site.replace('https://', '')}](${f.site})`,
      '',
    ]),
    `## ${all.title}: ${all.count}`,
    '',
    `${all.body} [${all.cta}](${at(all.href)})`,
    '',
    ...fence('bash', hero.install),
    '',
    hero.installNote,
    '',
    `${agentNote.before} [${agentNote.skills.label}](${agentNote.skills.href})${agentNote.after} [${agentNote.start.label}](${at(agentNote.start.href)})`,
    '',
    ...doors(models).map((d) => `- [${d.title}](${at(d.href)}) (${d.eyebrow}): ${d.body}`),
    '',
    `## ${quickstart.title}`,
    '',
    quickstart.lead,
    '',
    ...tabs(quickstart.install),
    quickstart.between,
    '',
    ...tabs(quickstart.use),
    `## ${platform.title}`,
    '',
    platform.lead,
    '',
    ...domains.map((d) => `- [${d.name}](${at(d.href)}): ${d.desc}`),
    '',
    `## ${tooling.title}`,
    '',
    tooling.lead,
    '',
    ...tools.map((t) => `- [${t.name}](${at(t.href)}): ${t.desc}`),
    '',
    `## ${providerSection(models).title}`,
    '',
    providerSection(models).lead,
    '',
    ...providers.map((p) => `- ${p.name}: ${p.spec}`),
    '',
    ...surfaces.flatMap((s) => [`## ${s.title}`, '', s.body, '', s.chips.join(', '), '', `[${s.cta}](${at(s.href)})`, '']),
    `## ${cli.title}`,
    '',
    cli.lead,
    '',
    ...cli.commands.map((c) => `- \`${c.cmd}\`: ${c.desc}`),
    '',
    `## ${zen.title} (${zen.badge})`,
    '',
    zen.body,
    '',
    ...zen.models.map((m) => `- \`${m.name}\`: ${m.spec}`),
    '',
    `[${zen.docs.label.replace(' →', '')}](${at(zen.docs.href)}) · [${zen.weights.label.replace(' →', '')}](${zen.weights.href})`,
    '',
    `## ${close.title}`,
    '',
    close.lead,
    '',
    ...fence('bash', close.install),
    '',
    `[${close.primary.label}](${close.primary.href}) · [${close.secondary.label}](${at(close.secondary.href)})`,
  ].join('\n');
}
