import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

// The files an agent reads before any page: robots.txt, the API catalog and
// auth.md. Each is served as written from public/.

const PUBLIC = path.resolve(import.meta.dirname, '../public');
const read = (rel: string) => fs.readFileSync(path.join(PUBLIC, rel), 'utf8');

/** robots.txt as groups: the user agents a group names and its rules. */
function groups(src: string) {
  const out: { agents: string[]; rules: string[] }[] = [];
  let open = false;
  for (const raw of src.split('\n')) {
    const line = raw.replace(/#.*$/, '').trim();
    if (!line) continue;
    const [key, ...rest] = line.split(':');
    const value = rest.join(':').trim();
    if (key.toLowerCase() === 'user-agent') {
      if (!open) out.push({ agents: [], rules: [] });
      out[out.length - 1].agents.push(value);
      open = true;
    } else if (key.toLowerCase() !== 'sitemap') {
      out[out.length - 1]?.rules.push(`${key}: ${value}`);
      open = false;
    }
  }
  return out;
}

const SIGNAL = 'Content-Signal: search=yes, ai-input=yes, ai-train=yes';
const CRAWLERS = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-User', 'Claude-SearchBot', 'Claude-Web', 'anthropic-ai',
  'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'CCBot', 'Applebot-Extended', 'Meta-ExternalAgent', 'Amazonbot',
  'cohere-ai', 'DuckAssistBot', 'Bingbot', 'Googlebot',
];

describe('robots.txt', () => {
  const src = read('robots.txt');
  const all = groups(src);

  it('signals search, AI input and AI training for every crawler', () => {
    const star = all.find((g) => g.agents.includes('*'));
    expect(star?.rules).toContain(SIGNAL);
    expect(star?.rules).toContain('Allow: /');
  });

  it('names each AI crawler, with the same rules as everyone', () => {
    const star = all.find((g) => g.agents.includes('*'))!;
    for (const name of CRAWLERS) {
      const group = all.find((g) => g.agents.includes(name));
      expect(group, name).toBeDefined();
      expect(group!.rules).toEqual(star.rules);
    }
  });

  it('leaves Bytespider unnamed, as the site always has', () => {
    expect(src).not.toMatch(/bytespider/i);
  });

  it('ends with the sitemap', () => {
    expect(src.trim().split('\n').pop()).toBe('Sitemap: https://docs.hanzo.ai/sitemap.xml');
  });
});

describe('/.well-known/api-catalog', () => {
  const catalog = JSON.parse(read('.well-known/api-catalog')) as { linkset: Record<string, unknown>[] };

  it('is an RFC 9727 linkset naming the API, the MCP endpoint and the agents guide', () => {
    expect(catalog.linkset.map((e) => e.anchor)).toEqual(['https://api.hanzo.ai/v1', 'https://api.hanzo.ai/v1/mcp', 'https://hanzo.ai/agents']);
    expect(catalog.linkset[0]).toMatchObject({
      'service-desc': [{ href: 'https://api.hanzo.ai/v1/openapi.json', type: 'application/json' }],
      'service-meta': [{ href: 'https://api.hanzo.ai/.well-known/oauth-protected-resource' }],
      status: [{ href: 'https://status.hanzo.ai' }],
    });
  });

  it('links only absolute https URLs, each with a media type', () => {
    for (const entry of catalog.linkset)
      for (const [rel, links] of Object.entries(entry)) {
        if (rel === 'anchor') continue;
        for (const link of links as { href: string; type: string }[]) {
          expect(link.href).toMatch(/^https:\/\//);
          expect(link.type).toMatch(/^[a-z]+\/[a-z+.-]+$/);
        }
      }
  });
});

describe('auth.md', () => {
  const src = read('auth.md');

  it('names IAM and the API as the servers, and every step an agent takes', () => {
    expect(src).toContain('https://hanzo.id/.well-known/openid-configuration');
    expect(src).toContain('https://api.hanzo.ai/.well-known/oauth-protected-resource');
    for (const step of ['/v1/iam/web3/nonce', '/v1/iam/web3/verify', '/v1/iam/oauth/token', '/v1/account/keys', 'hanzo auth login', '/v1/iam/oauth/device'])
      expect(src).toContain(step);
  });

  it('names no address but an absolute https one', () => {
    for (const [, href] of src.matchAll(/\]\(([^)]+)\)/g)) expect(href).toMatch(/^https:\/\//);
    expect(src).not.toMatch(/https?:\/\/(?!hanzo\.id|api\.hanzo\.ai|hanzoskills\.com|hanzo\.sh|platform\.hanzo\.ai|localhost:3000)/);
  });
});
