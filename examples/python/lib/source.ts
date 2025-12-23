import { docs } from '@hanzo/docs-mdx:collections/server';
import { loader } from '@hanzo/docs/source';

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  // it assigns a URL to your pages
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
});
