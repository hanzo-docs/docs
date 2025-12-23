import { loader } from '@hanzo/docs/source';
import { docs } from '@hanzo/docs-mdx:collections/server';

export const source = loader({
  source: docs.toFumadocsSource(),
  baseUrl: '/docs',
});
