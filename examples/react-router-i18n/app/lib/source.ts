import { loader } from '@hanzo/docs/source';
import { docs } from '@hanzo/docs-mdx:collections/server';
import { i18n } from '@/lib/i18n';

export const source = loader({
  source: docs.toFumadocsSource(),
  baseUrl: '/docs',
  i18n,
});
