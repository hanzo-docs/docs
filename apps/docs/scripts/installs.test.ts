import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

// The install lines a reader copies, held to what the registries answer.

const APP = path.resolve(import.meta.dirname, '..');
const CATALOG = fs.readFileSync(path.join(APP, 'components/install-catalog.tsx'), 'utf8');

function pages(dir: string, out: string[] = []): string[] {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    // projects/ mirrors other repos' docs; their install lines are theirs.
    if (e.isDirectory()) {
      if (e.name !== 'projects') pages(p, out);
    } else if (e.name.endsWith('.mdx')) out.push(p);
  }
  return out;
}

const SOURCES: Array<[string, string]> = [
  ...pages(path.join(APP, 'content/docs')).map((p): [string, string] => [path.relative(APP, p), fs.readFileSync(p, 'utf8')]),
  ['components/install-catalog.tsx', CATALOG],
];

describe('pip install hanzoai', () => {
  // hanzoai 8 requires Python 3.12, and PyPI still serves 2.1.3 to 3.9-3.11.
  // Unpinned, pip on an older interpreter installs 2.1.3 without a word, and
  // `from hanzoai.cloud import ...` then fails with ModuleNotFoundError. The
  // floor makes pip refuse and name the Python it needs instead.
  it.each(SOURCES)('%s pins the 8 line', (_, text) => {
    const lines = [...text.matchAll(/pip install\s+["']?hanzoai(?![-\w])([^\s"'`]*)/g)].map((m) => m[0]);
    for (const line of lines) expect(line).toMatch(/hanzoai>=8$/);
  });
});

describe('install catalog', () => {
  const rows = [...CATALOG.matchAll(/\{ id: '([^']+)'.*?install: '((?:[^'\\]|\\.)*)'/g)].map((m) => [m[1], m[2]]);

  it('has rows', () => {
    expect(rows.length).toBeGreaterThan(10);
  });

  // A row is a command a package registry answers for, or a line of the HTTP
  // API. "Hanzo plugin", "Hanzo app" and "Hanzo node" named WordPress, Shopify,
  // Zapier, Segment, Bubble and n8n listings that do not exist, and the HTML row
  // loaded https://cdn.hanzo.ai/event.js, which answers 404.
  const VERBS =
    /^(npm i |npx |pip install |go get |cargo add |gem install |composer require |flutter pub add |\.package\(url: |find_package\(|base_url="https:\/\/api\.hanzo\.ai\/v1"$|POST https:\/\/api\.hanzo\.ai\/v1\/)/;
  it.each(rows)('%s installs from a registry', (_, install) => {
    expect(install).toMatch(VERBS);
  });
});
