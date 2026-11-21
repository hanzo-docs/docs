import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = resolve(import.meta.dirname, '..');
const PUBLIC = join(ROOT, 'public');
const CONTENT = join(ROOT, 'content/docs');

const pages = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? pages(join(dir, e.name)) : /\.mdx?$/.test(e.name) ? [join(dir, e.name)] : [],
  );

// A page that names an image the site does not carry is a 404 on every visit and a
// broken picture where the page put it. The app is a static export, so the files a
// page can name are `public/`'s, at the root: a relative name is read from the root
// of the host, as the browser reads `whatsapp-bot.jpg` on /docs.
describe('the images a docs page names', () => {
  it('are files the export carries', () => {
    const missing: string[] = [];
    for (const page of pages(CONTENT)) {
      const text = readFileSync(page, 'utf8');
      for (const [, src] of text.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["']/g)) {
        if (/^(?:[a-z]+:|\/\/|data:)/i.test(src)) continue;
        if (!existsSync(join(PUBLIC, src.replace(/^\//, '').split(/[?#]/)[0]!))) {
          missing.push(`${page.slice(CONTENT.length + 1)}: ${src}`);
        }
      }
    }
    expect(missing).toEqual([]);
  });

  it('has the icons a browser asks for by itself', () => {
    expect(existsSync(join(ROOT, 'app/icon.svg'))).toBe(true);
    expect(existsSync(join(ROOT, 'app/favicon.ico'))).toBe(true);
  });
});
