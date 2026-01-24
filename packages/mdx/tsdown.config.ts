import { defineConfig } from 'tsdown';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const external = ['next', 'typescript', 'bun'];

const noExternal = [
  // TODO: remove this when the min `@hanzo/docs-core` version is above 16.2.3
  '@hanzo/docs-core/source/schema',
];

// Resolve @/* path alias
const alias = {
  '@/': resolve(__dirname, './src') + '/',
};

export default defineConfig([
  {
    entry: [
      './src/{index,bin}.ts',
      './src/{config,next,vite,bun}/index.ts',
      './src/webpack/{mdx,meta}.ts',
      './src/node/loader.ts',
      './src/runtime/*.{ts,tsx}',
      './src/plugins/*.ts',
    ],
    format: 'esm',
    noExternal,
    external,
    dts: true,
    fixedExtension: false,
    target: 'node22',
    alias,
  },
  {
    outDir: 'dist/next',
    // ensure Next.js CJS config compatibility
    // because next.config.ts by default uses CJS
    entry: ['./src/next/index.ts'],
    format: 'cjs',
    noExternal,
    external,
    dts: false,
    fixedExtension: false,
    target: 'node22',
    alias,
  },
]);
