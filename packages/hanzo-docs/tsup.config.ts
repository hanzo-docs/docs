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
    '@hanzo/docs-core',
    '@hanzo/docs-ui',
    '@hanzo/docs-mdx',
    '@hanzo/docs-openapi',
    '@hanzo/docs-twoslash',
    '@hanzo/docs-typescript',
    '@hanzo/docs-docgen',
    '@hanzo/docs-cli',
    '@hanzo/docs-mdx-remote',
    '@hanzo/docs-python',
    '@hanzo/docs-obsidian',
    '@hanzo/docs-content-collections',
    '@hanzo/docs-press',
    'react',
    'react-dom',
    'next'
  ],
});
