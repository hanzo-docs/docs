import { defineConfig } from 'tsup';

export default defineConfig({
  external: ['@hanzo/docs-core', 'next', 'react'],
  dts: true,
  target: 'es2021',
  entry: ['./src/index.ts', './src/client/index.ts'],
  format: 'esm',
});
