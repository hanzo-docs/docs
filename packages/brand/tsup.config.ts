import { defineConfig } from 'tsup';

export default defineConfig({
  dts: true,
  target: 'es2022',
  format: 'esm',
  entry: [
    'src/index.ts',
    'src/types.ts',
    'src/context.tsx',
    'src/css.ts',
    'src/brands/hanzo.tsx',
    'src/brands/lux.tsx',
    'src/brands/zoo.tsx',
  ],
  external: ['react', 'fumadocs-ui'],
});
