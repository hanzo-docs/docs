import { loader } from '@hanzo/docs-core/source';
import { openapiPlugin } from '@hanzo/docs-openapi/server';
import { docs } from '@hanzo/docs-mdx:collections/server';

export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
  plugins: [openapiPlugin()],
});
