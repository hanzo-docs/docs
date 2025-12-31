import { defineConfig, defineDocs } from '@hanzo/docs/mdx/config';

// Options: https://hanzo-docs.dev/docs/mdx/collections#define-docs
export const docs = defineDocs({
  dir: 'content/docs',
});

export default defineConfig({
  mdxOptions: {
    // MDX options
  },
});
