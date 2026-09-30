import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

// Every Hanzo route is /v1/... — there is no /api/ prefix, on the API host or on
// this site. A page that teaches `/api/...`, or a component that fetches it,
// sends the reader to a 404.
//
// The pattern is a path that STARTS at `/api`: a third-party URL such as
// `https://sentry.io/api/0/` or `@tauri-apps/api/path` has a host or a name in
// front of it and is not matched.

const APP = path.resolve(import.meta.dirname, '..');
const REPO = path.resolve(APP, '../..');
const API_PATH = /(?<![A-Za-z0-9._~\-/])\/api(\/|(?![\w.\-]))/;

// Not ours to hold: migration guides show the OTHER vendor's API on the left of
// each table; projects/ mirrors other repos' docs; public/reference is vendored;
// the rest states this very rule or is the SDK-owned segment the API documents.
const SKIP = [
  'content/docs/guides/migrate/',
  'content/docs/projects/',
  'content/docs/contributing/style.mdx',
  'public/reference/',
  'openapi-specs/',
  'scripts/',
  'node_modules/',
  '.next/',
  'out/',
];

const TEXT = /\.(tsx?|mdx?|json|ya?ml|sh|toml|txt)$|_redirects$|\.gitignore$/;

function walk(root: string, skip: string[], out: string[] = []): string[] {
  for (const e of fs.readdirSync(root, { withFileTypes: true })) {
    const p = path.join(root, e.name);
    const rel = path.relative(root === APP ? APP : APP, p);
    if (e.name === 'node_modules' || e.name === '.next' || e.name === '.git') continue;
    if (skip.some((s) => rel.startsWith(s) || rel.startsWith(s.replace(/\/$/, '')))) continue;
    if (e.isDirectory()) walk(p, skip, out);
    else if (e.isFile() && TEXT.test(e.name)) out.push(p);
  }
  return out;
}

function hits(files: string[], base: string): string[] {
  const found: string[] = [];
  for (const f of files) {
    fs.readFileSync(f, 'utf8')
      .split('\n')
      .forEach((line, i) => {
        if (API_PATH.test(line)) found.push(`${path.relative(base, f)}:${i + 1}: ${line.trim().slice(0, 120)}`);
      });
  }
  return found;
}

describe('no /api prefix', () => {
  it('the docs site names no /api path', () => {
    expect(hits(walk(APP, SKIP), APP)).toEqual([]);
  });

  it('the framework, its templates and its examples name no /api path', () => {
    const files: string[] = [];
    for (const dir of ['packages', 'examples']) {
      const root = path.join(REPO, dir);
      const stack = [root];
      while (stack.length) {
        const d = stack.pop()!;
        for (const e of fs.readdirSync(d, { withFileTypes: true })) {
          const p = path.join(d, e.name);
          const rel = path.relative(REPO, p);
          if (['node_modules', '.next', 'dist', '.git'].includes(e.name)) continue;
          // The OpenAPI renderer's own fixtures use `/api/users` as a made-up path.
          if (rel.startsWith('packages/openapi/') || e.name.startsWith('CHANGELOG')) continue;
          if (e.isDirectory()) stack.push(p);
          else if (e.isFile() && TEXT.test(e.name)) files.push(p);
        }
      }
    }
    expect(hits(files, REPO)).toEqual([]);
  });

  it('the OpenAPI document serves only /v1 paths', () => {
    const yaml = fs.readFileSync(path.join(APP, 'openapi-specs/openapi.yaml'), 'utf8');
    const bad = yaml.split('\n').filter((l) => /^ {2}\/[^\s]*:\s*$/.test(l) && !/^  \/v1(\/|:)/.test(l));
    expect(bad).toEqual([]);
  });
});
