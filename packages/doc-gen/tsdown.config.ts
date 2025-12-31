import { defineConfig } from 'tsdown';

export default defineConfig({
  external: [/^@hanzo\/docs\//],
  dts: true,
  fixedExtension: false,
  target: 'es6',
  format: 'esm',
  entry: ['src/index.ts', 'src/remark-ts2js.ts'],
});
