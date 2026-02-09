import { createMdxPlugin } from '@hanzo/docs/mdx/bun';
import { postInstall } from '@hanzo/docs/mdx/next';

process.env.LINT = '1';
const configPath = 'source.config.ts';
await postInstall({ configPath });
Bun.plugin(createMdxPlugin({ configPath }));
