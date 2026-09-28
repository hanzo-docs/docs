import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';

// Every public Jev asset in parity/jev.yaml names the Kai page that answers it,
// or says why none does. A listed page that stops existing fails here.

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ROOT = path.resolve(APP, '../..');
const CONTENT = path.join(APP, 'content/docs');

type Row = { jev: string; kind: string; kai?: string; none?: string };
const rows: Row[] = parse(fs.readFileSync(path.join(ROOT, 'parity/jev.yaml'), 'utf8')).assets;

/** The content file a `/docs/...` path is served from, or '' when there is none. */
function page(href: string): string {
  const rel = href.replace(/^\/docs\/?/, '').replace(/#.*$/, '').replace(/\/$/, '');
  for (const f of [`${rel}.mdx`, `${rel}/index.mdx`, rel === '' ? 'index.mdx' : '']) {
    if (f && fs.existsSync(path.join(CONTENT, f))) return f;
  }
  return '';
}

describe('parity/jev.yaml', () => {
  it('lists assets', () => {
    expect(rows.length).toBeGreaterThan(100);
  });

  it('names each asset once', () => {
    const jev = rows.map((r) => r.jev);
    expect(jev.filter((j, i) => jev.indexOf(j) !== i)).toEqual([]);
  });

  it.each(rows.map((r) => [r.jev, r] as const))('%s has a Kai page or a reason', (_, r) => {
    expect(['doc', 'api', 'example', 'app', 'skill', 'list', 'tooling']).toContain(r.kind);
    if (r.none !== undefined) {
      expect(r.kai).toBeUndefined();
      expect(r.none.trim().length).toBeGreaterThan(10);
      return;
    }
    expect(r.kai).toMatch(/^\/docs\//);
    expect(page(r.kai!), `${r.kai} is not a page`).not.toBe('');
  });
});
