import fs from 'node:fs';
import path from 'node:path';

const APP = path.resolve(import.meta.dirname, '..');
const OUT = path.join(APP, 'out');
const MARK = '<meta name="generator" content="emit-redirects">';
const SITE = 'docs.hanzo.bot';

const ALIAS_LINKS: Record<string, string> = {
  '/tui': '/docs/web/tui',
  '/tts': '/docs/nodes/tts',
  '/environment': '/docs/reference/environment',
  '/scripts': '/docs/reference/scripts',
  '/testing': '/docs/reference/testing',
  '/debug': '/docs/help/debug',
  '/debug/node-issue': '/docs/help/troubleshooting',
  '/vps': '/docs/platforms/vps',
  '/network': '/docs/gateway/network',
  '/prose': '/docs/tools/prose',
  '/date-time': '/docs/concepts/date-time',
  '/brave-search': '/docs/tools/brave-search',
  '/perplexity': '/docs/tools/perplexity',
  '/plugin': '/docs/tools/plugin',
  '/plugins': '/docs/cli/plugins',
  '/hooks': '/docs/automation/hooks',
  '/hooks/soul-evil': '/docs/automation/hooks',
  '/logging': '/docs/gateway/logging',
  '/broadcast-groups': '/docs/channels/broadcast-groups',
  '/token-use': '/docs/reference/token-use',
  '/multi-agent-sandbox-tools': '/docs/tools/multi-agent-sandbox-tools',
  '/bedrock': '/docs/providers/bedrock',
  '/experiments/onboarding-config-protocol': '/docs/start/onboarding',
  '/experiments/plans/cron-add-hardening': '/docs/automation/cron-jobs',
  '/experiments/plans/group-policy-hardening': '/docs/concepts/groups',
  '/experiments/research/memory': '/docs/concepts/memory',
  '/experiments/proposals/model-config': '/docs/providers/models',
  '/docs/LICENSE': 'https://github.com/hanzoai/bot/blob/main/LICENSE',
  '/docs/NOTICE': 'https://github.com/hanzoai/bot/blob/main/NOTICE',
  '/docs/LICENSES/MIT.txt': 'https://github.com/hanzoai/bot/blob/main/LICENSES/MIT.txt',
};

const page = (to: string) =>
  `<!doctype html><html lang="en"><head><meta charset="utf-8">` +
  `<title>Moved</title>${MARK}<link rel="canonical" href="${to}">` +
  `<meta name="robots" content="noindex,follow">` +
  `<meta http-equiv="refresh" content="0; url=${to}">` +
  `<script>location.replace(${JSON.stringify(to)})</script></head>` +
  `<body><a href="${to}">${to}</a></body></html>\n`;

function walkHtml(dir: string, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkHtml(p, out);
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

export function emitRedirects(): void {
  if (!fs.existsSync(OUT)) return;

  const at = (p: string) => path.join(OUT, p.replace(/^\/+/, '').replace(/\/+$/, ''), 'index.html');
  const ours = (p: string) =>
    fs.existsSync(at(p)) && fs.readFileSync(at(p), 'utf8').includes(MARK);
  const served = (p: string) => fs.existsSync(at(p)) && !ours(p);

  const rules = new Map<string, string>();
  const docsDir = path.join(OUT, 'docs');
  for (const file of walkHtml(docsDir)) {
    const rel = path.relative(docsDir, file).split(path.sep).join('/');
    if (!rel.endsWith('/index.html')) continue;
    const sub = rel.slice(0, -'/index.html'.length);
    if (!sub) continue;
    rules.set(`/${sub}`, `/docs/${sub}`);
  }
  for (const [from, to] of Object.entries(ALIAS_LINKS)) {
    rules.set(from, to);
    if (!from.startsWith('/docs/')) {
      rules.set(`/docs${from}`, to);
    }
  }

  let wrote = 0;
  for (const [from, to] of rules) {
    if (served(from)) continue;
    if (to.startsWith('/') && !served(to)) continue;
    const dest = to.startsWith('/') ? `${to.replace(/\/+$/, '')}/` : to;
    fs.mkdirSync(path.dirname(at(from)), { recursive: true });
    fs.writeFileSync(at(from), page(dest));
    wrote++;
  }
  console.log(`[redirects] ${wrote} bare-path and alias redirects emitted`);
}

const ANCHOR = /<a\b[^>]*?\shref="([^"]*)"/gi;

function urlOf(out: string, file: string): string {
  const rel = '/' + path.relative(out, file).split(path.sep).join('/');
  return rel.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
}

function target(href: string, from: string): string | null {
  const h = href.trim();
  if (!h || h.startsWith('#')) return null;
  let u: URL;
  try {
    u = new URL(h, `https://${SITE}${from}`);
  } catch {
    return null;
  }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
  if (u.hostname !== SITE) return null;
  return decodeURIComponent(u.pathname);
}

function holds(out: string, p: string): boolean {
  const rel = p.replace(/^\/+/, '').replace(/\/+$/, '');
  const file = (x: string) => {
    try {
      return fs.statSync(path.join(out, x)).isFile();
    } catch {
      return false;
    }
  };
  if (rel === '') return file('index.html');
  return file(rel) || file(`${rel}.html`) || file(`${rel}/index.html`);
}

export function checkLinks(out = OUT): number {
  if (!fs.existsSync(out)) return 0;
  const dead = new Map<string, string>();
  let links = 0;
  for (const file of walkHtml(out)) {
    const from = urlOf(out, file);
    const html = fs.readFileSync(file, 'utf8');
    for (const m of html.matchAll(ANCHOR)) {
      const p = target(m[1].replace(/&amp;/g, '&'), from);
      if (p === null) continue;
      links++;
      if (!holds(out, p) && !dead.has(p)) dead.set(p, from);
    }
  }
  console.log(`[links] ${links} internal links, ${dead.size} pointing nowhere`);
  for (const [p, from] of [...dead].sort()) console.warn(`[links] dead: ${p} (linked from ${from})`);
  return dead.size;
}

if (import.meta.main) {
  console.log('Running post-build...');
  emitRedirects();
  checkLinks();
  console.log('Post-build complete');
}
