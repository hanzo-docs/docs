import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { check, holds, target } from './check-links';

// A tiny export in the two shapes this site writes: a directory index
// (trailingSlash) and the flat sibling other generators emit.
function site(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'links-'));
  for (const sub of ['docs', 'models', '_next/static/chunks']) {
    fs.mkdirSync(path.join(dir, sub), { recursive: true });
  }
  const files: Record<string, string> = {
    'index.html': '<a href="/docs">docs</a><a href="/nope">nope</a><a href="#top">top</a>',
    'docs/index.html':
      '<a href="../models/glm-5.2">rel</a><a href="https://docs.hanzo.ai/docs/gone">self</a>' +
      '<a href="https://hanzo.ai/pricing">off site</a><a data-href="not-a-link">style</a>',
    'models/glm-5.2.html': 'a page whose last segment carries a dot',
    '_next/static/chunks/main.js': 'console.log(1)',
  };
  for (const [name, body] of Object.entries(files)) {
    fs.writeFileSync(path.join(dir, name), body);
  }
  return dir;
}

describe('target', () => {
  it('keeps our own links and drops everyone else’s', () => {
    expect(target('/docs/x', '/')).toBe('/docs/x');
    expect(target('../models/x', '/docs/')).toBe('/models/x');
    expect(target('https://docs.hanzo.ai/docs/x', '/')).toBe('/docs/x');
    expect(target('/docs/x?q=1#frag', '/')).toBe('/docs/x');
    for (const off of ['https://hanzo.ai/x', 'mailto:z@hanzo.ai', '#top', 'tel:+1']) {
      expect(target(off, '/')).toBeNull();
    }
  });
});

describe('holds', () => {
  it('resolves the way the edge does', () => {
    const dir = site();
    expect(holds(dir, '/')).toBe(true);
    expect(holds(dir, '/docs')).toBe(true); // docs/index.html
    expect(holds(dir, '/docs/')).toBe(true);
    expect(holds(dir, '/models/glm-5.2')).toBe(true); // the flat .html sibling
    expect(holds(dir, '/_next/static/chunks/main.js')).toBe(true);
    expect(holds(dir, '/nope')).toBe(false);
  });
});

describe('check', () => {
  it('counts the links a reader can click and names the dead ones', () => {
    // 2 on the index (the hash is not a link), 2 on /docs (the off-site one is
    // not ours, data-href is not an anchor). /nope and /docs/gone are dead.
    expect(check(site())).toBe(2);
  });

  it('is silent about a directory that is not an export', () => {
    expect(check(path.join(os.tmpdir(), 'no-such-export'))).toBe(0);
  });
});
