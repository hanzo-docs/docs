import { defineConfig } from 'tsup';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

function getEntries(dir: string, base = ''): Record<string, string> {
  const entries: Record<string, string> = {};
  const items = readdirSync(dir);

  for (const item of items) {
    const fullPath = join(dir, item);
    const relativePath = base ? `${base}/${item}` : item;

    if (statSync(fullPath).isDirectory()) {
      Object.assign(entries, getEntries(fullPath, relativePath));
    } else if (item.endsWith('.ts') && !item.endsWith('.d.ts')) {
      const name = relativePath.replace(/\.ts$/, '');
      entries[name] = fullPath;
    }
  }

  return entries;
}

const entries = getEntries('./src');

export default defineConfig({
  entry: entries,
  format: ['esm'],
  dts: true, // Generate declaration files for type support
  splitting: false,
  clean: true,
  external: [
    'fumadocs-core',
    'fumadocs-ui',
    '@fumadocs/base-ui',
    'fumadocs-mdx',
    'fumadocs-openapi',
    'fumadocs-twoslash',
    '@hanzo/docs-typescript',
    '@hanzo/docs-docgen',
    '@fumadocs/cli',
    '@hanzo/mdx-runtime',
    '@hanzo/docs-python',
    'fumadocs-obsidian',
    '@hanzo/docs-content-collections',
    '@hanzo/docs-press',
    'react',
    'react-dom',
    'next'
  ],
});
