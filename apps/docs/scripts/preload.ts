import { createMdxPlugin } from '@hanzo/docs-mdx/bun';
import { postInstall } from '@hanzo/docs-mdx/next';

const configPath = 'source.script.ts';
await postInstall({ configPath });
Bun.plugin(createMdxPlugin({ configPath }));
