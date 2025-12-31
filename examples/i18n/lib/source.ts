import { loader } from '@hanzo/docs/core/source';
import { i18n } from '@/lib/i18n';
import { docs } from '@hanzo/docs/mdx:collections/server';

export const source = loader({
  baseUrl: '/docs',
  source: docs.toHanzo DocsSource(),
  i18n,
});
