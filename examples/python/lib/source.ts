import { docs } from '@hanzo/docs/mdx:collections/server';
import { loader } from '@hanzo/docs/core/source';

// See https://hanzo-docs.dev/docs/headless/source-api for more info
export const source = loader({
  // it assigns a URL to your pages
  baseUrl: '/docs',
  source: docs.toHanzo DocsSource(),
});
