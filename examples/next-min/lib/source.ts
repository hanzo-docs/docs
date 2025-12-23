import { docs } from '@hanzo/docs-mdx:collections/server';
import { loader } from '@hanzo/docs/source';

export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
});
