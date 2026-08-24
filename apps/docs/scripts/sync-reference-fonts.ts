import { copyFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);

/**
 * public/reference/ is static HTML served as-is — no bundler runs over it, so it
 * cannot `@import '@hanzo/font/css'` the way every stylesheet here does. It
 * declares its own @font-face against two files in public/reference/fonts/, and
 * this copies them out of the installed package so the package stays the one
 * source of the bytes and nothing is hand-vendored.
 *
 * The directory is gitignored, same rule as public/openapi/: an asset derived
 * from a source we already track does not get a second copy in git.
 */
export function syncReferenceFonts() {
  const faces = {
    'zen-sans.woff2': '@hanzo/font/dist/fonts/zen-sans/Zen-Variable.woff2',
    'zen-mono.woff2': '@hanzo/font/dist/fonts/zen-mono/ZenMono-Variable.woff2',
  };
  const dir = path.join(import.meta.dirname, '../public/reference/fonts');
  mkdirSync(dir, { recursive: true });
  for (const [name, specifier] of Object.entries(faces)) {
    copyFileSync(require.resolve(specifier), path.join(dir, name));
  }
  console.log(`[reference] ${Object.keys(faces).length} Zen faces copied from @hanzo/font`);
}
