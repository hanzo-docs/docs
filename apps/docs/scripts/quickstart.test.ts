import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { loadCliTable } from './sync-cli-commands';

// THE FIRST CALL, held to what the platform serves.
//
// A page that names a model the catalogue does not list, or a flag the CLI does
// not take, fails on the reader's first paste — and a refusal on the first call
// reads like a bad key. These pages are checked against the snapshots the rest
// of the site is generated from: the CLI's own command table and the catalogue
// captured in pricing.json.

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (rel: string) => fs.readFileSync(path.join(APP, rel), 'utf8');

const PAGES = [
  'content/docs/quickstart.mdx',
  'content/docs/index.mdx',
  'content/docs/concepts/agents.mdx',
  'content/docs/concepts/budgets.mdx',
];

const table = [...loadCliTable().values()];
const products = new Set(table.map((c) => c.product));
const served = new Set<string>(
  JSON.parse(read('openapi-specs/pricing.json')).hanzoModels.map((m: { name: string }) => m.name),
);

/**
 * Every fenced code block on the first-call pages, and the page's snippet props,
 * which are shell. `shell` says whether a line of it is a command a reader types.
 */
const code = PAGES.flatMap((page) => {
  const src = read(page);
  const blocks = [...src.matchAll(/```([a-z]*)\n([\s\S]*?)```/g)].map((m) => ({
    text: m[2],
    shell: ['bash', 'sh', 'shell', ''].includes(m[1]),
  }));
  const props = [...src.matchAll(/snippet="([^"]*)"/g)].map((m) => ({ text: m[1], shell: true }));
  return [...blocks, ...props].map((b) => ({ page, ...b }));
});

/** A shell line with its continuations joined, split into words, quotes kept whole. */
const words = (line: string) => [...line.matchAll(/'[^']*'|"[^"]*"|\S+/g)].map((m) => m[0]);

/** The CLI's own commands, which are not capabilities and are not in the table. */
const NATIVE = new Set(['auth', 'version', 'up', 'run', 'dev', 'code']);

const lines = code
  .filter((b) => b.shell)
  .flatMap(({ page, text }) =>
    text
      .replace(/\\\n\s*/g, ' ')
      .split('\n')
      .map((line) => ({ page, line: line.trim() })),
  );

/** The commands on a line: `hanzo auth login && hanzo account keys create` is two. */
const commands = (line: string) => line.split(/\s*&&\s*/).map(words);

/**
 * Where a first call is made: the quickstart, and the home page's line that mints
 * the key it uses.
 */
const firstCalls = lines.filter(
  ({ page, line }) =>
    page.endsWith('quickstart.mdx') || (page.endsWith('index.mdx') && /\bkeys\b/.test(line)),
);

describe('first-call pages', () => {
  it('run only CLI commands the CLI has, with the flags it takes', () => {
    const run = firstCalls.flatMap(({ page, line }) =>
      commands(line)
        .filter((w) => w[0] === 'hanzo' && !NATIVE.has(w[1]))
        .map((w) => ({ page, line: w.join(' '), w })),
    );
    expect(run.length).toBeGreaterThan(0);
    for (const { page, line, w } of run) {
      expect(products.has(w[1]), `${page}: \`${line}\` names no capability`).toBe(true);
      const flagAt = w.findIndex((x) => x.startsWith('--'));
      const said = w.slice(1, flagAt < 0 ? undefined : flagAt);
      const cmd = table.find(
        (c) =>
          [c.product, ...c.nodes, c.verb].join(' ') === said.slice(0, 2 + c.nodes.length).join(' '),
      );
      expect(cmd, `${page}: \`${line}\` is not a command`).toBeDefined();
      // The table records path parameters and REQUIRED flags; a body travels as
      // --data. Nothing else is a flag a first call needs.
      const flags = w.filter((x) => x.startsWith('--')).map((x) => x.slice(2));
      for (const f of flags) {
        expect(['data', 'json', ...cmd!.required], `${page}: \`${line}\` passes --${f}`).toContain(
          f,
        );
      }
    }
  });

  it('name only models the catalogue lists', () => {
    const named = code.flatMap(({ page, text }) =>
      [...text.matchAll(/"model"\s*:\s*"([^"]+)"|model:\s*'([^']+)'/g)].map((m) => ({
        page,
        model: m[1] ?? m[2],
      })),
    );
    expect(named.length).toBeGreaterThan(0);
    for (const { page, model } of named) {
      expect(served.has(model), `${page}: model "${model}" is not in the catalogue`).toBe(true);
    }
  });

  it('parse every JSON body they send', () => {
    for (const { page, line } of lines) {
      for (const m of line.matchAll(/(?:--data|-d)\s+'([^']*)'/g)) {
        expect(() => JSON.parse(m[1]), `${page}: body ${m[1]}`).not.toThrow();
      }
    }
  });

  it('address the API under /v1', () => {
    for (const { page, text } of code) {
      for (const m of text.matchAll(/https:\/\/api\.hanzo\.ai(\/[^\s"'\\]*)/g)) {
        expect(m[1], `${page}: ${m[0]}`).toMatch(/^\/v1\//);
      }
    }
  });
});
