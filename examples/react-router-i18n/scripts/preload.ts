import { createMdxPlugin } from '@hanzo/docs-mdx/bun';
import { postInstall } from '@hanzo/docs-mdx/vite';

Bun.plugin(createMdxPlugin());

await postInstall({
  index: {
    target: 'default',
  },
});
