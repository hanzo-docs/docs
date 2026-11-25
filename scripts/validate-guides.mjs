#!/usr/bin/env node
/**
 * Automated validator for Intelligence Engineering docs and the 50-Guide catalog.
 * Zero external runtime dependencies so it runs identically under Node or Vitest.
 *
 * Enforces:
 * 1. Exact 8 categories and 50 flagship practical guides in guides-catalog.json match files on disk.
 * 2. Every guide and Intelligence Engineering page carries valid canonical frontmatter:
 *    title, description, product, level, duration, surfaces, related_courses, status.
 * 3. Zero forbidden legacy path regressions (strict /v1/ enforcement).
 * 4. Every /docs/... internal link resolves to a real MDX file or known generated section.
 * 5. Every related_courses code and hanzo.university / hanzo.app/learn URL matches the canonical 25-course catalog.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, '..');
const DOCS_APP = path.join(REPO_ROOT, 'apps/docs');
const CONTENT = path.join(DOCS_APP, 'content/docs');
const CATALOG_PATH = path.join(DOCS_APP, 'scripts/guides-catalog.json');

const VALID_PRODUCTS = new Set([
  'kai',
  'enso',
  'zen',
  'science',
  'cyber',
  'autopilot',
  'infrastructure',
  'business',
  'platform',
]);
const VALID_LEVELS = new Set(['foundations', 'practitioner', 'specialist', 'architect', 'fellow']);
const VALID_SURFACES = new Set(['cli', 'sdk', 'http', 'mcp', 'ui']);
const VALID_STATUS = new Set(['shipped', 'preview', 'research']);

// Generated directories created by build:pre (not always checked into git)
const GENERATED_ROOTS = new Set(['openapi', 'cli', 'mcp-tools', 'pricing']);

// Strict legacy route check (same boundary rule as apps/docs/scripts/no-api-prefix.test.ts)
const FORBIDDEN_API_PATH = /(?<![A-Za-z0-9._~\-/])\/api(\/|(?![\w.\-]))/;

const EXPECTED_CATEGORY_COUNTS = {
  kai: 8,
  enso: 6,
  zen: 6,
  science: 8,
  cyber: 7,
  autopilot: 6,
  infrastructure: 5,
  business: 4,
};

const SCOPE_DIRS = [
  'training',
  'science',
  'cybersecurity',
  'autopilot',
  'business',
  'university',
  'guides/kai',
  'guides/enso',
  'guides/zen',
  'guides/science',
  'guides/cyber',
  'guides/autopilot',
  'guides/infrastructure',
  'guides/business',
];

const SCOPE_FILES = ['choose-architecture.mdx'];

function walkMdx(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkMdx(full, out);
    else if (entry.isFile() && entry.name.endsWith('.mdx')) out.push(full);
  }
  return out;
}

function unquote(val) {
  const s = val.trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    if (s.startsWith('"')) {
      try {
        return JSON.parse(s);
      } catch {
        return s.slice(1, -1);
      }
    }
    return s.slice(1, -1);
  }
  if (s === 'true') return true;
  if (s === 'false') return false;
  return s;
}

function parseFrontmatter(src) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(src);
  if (!m) return null;
  const fm = {};
  let currentKey = null;
  for (const rawLine of m[1].split(/\r?\n/)) {
    const line = rawLine.trimEnd();
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const itemMatch = /^\s+-\s+(.*)$/.exec(line);
    if (itemMatch && currentKey) {
      if (!Array.isArray(fm[currentKey])) fm[currentKey] = [];
      fm[currentKey].push(unquote(itemMatch[1]));
      continue;
    }
    const kvMatch = /^([A-Za-z0-9_]+)\s*:\s*(.*)$/.exec(line);
    if (kvMatch) {
      const [, key, rest] = kvMatch;
      currentKey = key;
      const trimmed = rest.trim();
      if (trimmed === '') {
        fm[key] = [];
      } else if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        fm[key] = trimmed
          .slice(1, -1)
          .split(',')
          .map((x) => unquote(x))
          .filter((x) => x !== '');
      } else {
        fm[key] = unquote(trimmed);
      }
    }
  }
  return fm;
}

function docsHrefExists(href) {
  const clean = href.replace(/[#?].*$/, '').replace(/\/$/, '');
  if (clean === '/docs' || clean === '') return true;
  if (!clean.startsWith('/docs/')) return true;
  const slug = clean.slice('/docs/'.length);
  const top = slug.split('/')[0];
  if (GENERATED_ROOTS.has(top)) return true;
  if (/^guides\/(hello|chat|money|store|agent|tools)$/.test(slug)) return true;
  const base = path.join(CONTENT, slug);
  return ['.mdx', '/index.mdx', '.md', '/index.md'].some((ext) => fs.existsSync(base + ext));
}

export function validateGuides() {
  const errors = [];
  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
  const validCourses = new Set(Object.keys(catalog.courses));
  const validSlugs = new Set(Object.values(catalog.courses).map((c) => c.slug));

  if (validCourses.size !== 25) {
    errors.push(`Expected 25 canonical courses in guides-catalog.json, found ${validCourses.size}`);
  }

  let totalCatalogGuides = 0;
  for (const [catId, expectedCount] of Object.entries(EXPECTED_CATEGORY_COUNTS)) {
    const cat = catalog.categories.find((c) => c.id === catId);
    if (!cat) {
      errors.push(`Missing guide category "${catId}" in guides-catalog.json`);
      continue;
    }
    if (cat.guides.length !== expectedCount) {
      errors.push(
        `Category "${catId}" has ${cat.guides.length} guides in catalog, expected ${expectedCount}`,
      );
    }
    totalCatalogGuides += cat.guides.length;

    const hub = path.join(CONTENT, 'guides', catId, 'index.mdx');
    if (!fs.existsSync(hub)) errors.push(`Missing category hub: guides/${catId}/index.mdx`);
    const meta = path.join(CONTENT, 'guides', catId, 'meta.json');
    if (!fs.existsSync(meta)) errors.push(`Missing category meta: guides/${catId}/meta.json`);

    for (const g of cat.guides) {
      const file = path.join(CONTENT, 'guides', catId, `${g.slug}.mdx`);
      if (!fs.existsSync(file)) {
        errors.push(`Missing guide file for catalog entry: guides/${catId}/${g.slug}.mdx`);
      }
      for (const code of g.courses) {
        if (!validCourses.has(code)) {
          errors.push(`Catalog entry ${catId}/${g.slug} references unknown course "${code}"`);
        }
      }
    }
  }

  if (totalCatalogGuides !== 50) {
    errors.push(`Expected exactly 50 guides in catalog, found ${totalCatalogGuides}`);
  }

  const files = [
    ...SCOPE_FILES.map((f) => path.join(CONTENT, f)).filter((f) => fs.existsSync(f)),
    ...SCOPE_DIRS.flatMap((d) => walkMdx(path.join(CONTENT, d))),
  ];

  for (const file of files) {
    const rel = path.relative(CONTENT, file);
    const src = fs.readFileSync(file, 'utf8');
    const fm = parseFrontmatter(src);
    if (!fm) {
      errors.push(`${rel}: missing YAML frontmatter`);
      continue;
    }

    for (const reqStr of ['title', 'description', 'product', 'level', 'duration', 'status']) {
      if (typeof fm[reqStr] !== 'string' || !fm[reqStr].trim()) {
        errors.push(`${rel}: missing or invalid frontmatter field "${reqStr}"`);
      }
    }
    if (fm.product && !VALID_PRODUCTS.has(fm.product)) {
      errors.push(`${rel}: invalid product "${fm.product}"`);
    }
    if (fm.level && !VALID_LEVELS.has(fm.level)) {
      errors.push(`${rel}: invalid level "${fm.level}"`);
    }
    if (fm.status && !VALID_STATUS.has(fm.status)) {
      errors.push(`${rel}: invalid status "${fm.status}"`);
    }

    if (!Array.isArray(fm.surfaces) || fm.surfaces.length === 0) {
      errors.push(`${rel}: missing non-empty "surfaces" array`);
    } else {
      for (const s of fm.surfaces) {
        if (!VALID_SURFACES.has(s)) errors.push(`${rel}: invalid surface "${s}"`);
      }
    }

    if (!Array.isArray(fm.related_courses) || fm.related_courses.length === 0) {
      errors.push(`${rel}: missing non-empty "related_courses" array`);
    } else {
      for (const code of fm.related_courses) {
        if (!validCourses.has(code)) {
          errors.push(`${rel}: unknown course code "${code}" in related_courses`);
        }
      }
    }

    const isIndividualGuide =
      /^guides\/(kai|enso|zen|science|cyber|autopilot|infrastructure|business)\/[^/]+\.mdx$/.test(
        rel,
      ) && !rel.endsWith('/index.mdx');
    if (isIndividualGuide && Array.isArray(fm.surfaces)) {
      for (const requiredSurface of ['cli', 'sdk', 'http', 'mcp']) {
        if (!fm.surfaces.includes(requiredSurface)) {
          errors.push(`${rel}: guide must declare surface "${requiredSurface}"`);
        }
      }
    }

    src.split('\n').forEach((line, idx) => {
      if (FORBIDDEN_API_PATH.test(line)) {
        errors.push(`${rel}:${idx + 1}: forbidden legacy route literal -> ${line.trim().slice(0, 100)}`);
      }
    });

    const linkPattern = /(?:href=["'](\/docs[^"'#?]*)["']|\]\((\/docs[^)\s#?]*)\))/g;
    for (const match of src.matchAll(linkPattern)) {
      const href = match[1] ?? match[2];
      if (!docsHrefExists(href)) {
        errors.push(`${rel}: broken internal docs link "${href}"`);
      }
    }

    const uniPattern = /https:\/\/(?:hanzo\.university|hanzo\.app\/learn)\/([a-z0-9-]+)/g;
    for (const match of src.matchAll(uniPattern)) {
      const slug = match[1];
      if (!validSlugs.has(slug)) {
        errors.push(`${rel}: non-canonical university/learn course slug "${slug}"`);
      }
    }
  }

  return { checkedFiles: files.length, totalCatalogGuides, errors };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = validateGuides();
  if (result.errors.length > 0) {
    console.error(
      `[validate-guides] FAIL — ${result.errors.length} issue(s) across ${result.checkedFiles} files:`,
    );
    for (const err of result.errors) console.error(`  - ${err}`);
    process.exit(1);
  }
  console.log(
    `[validate-guides] OK — ${result.checkedFiles} files validated, ${result.totalCatalogGuides} guides across 8 categories, 0 broken links, strict /v1/ clean`,
  );
}
