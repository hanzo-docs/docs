import { loader } from '@hanzo/docs/core/source';
import { docs } from '@hanzo/docs/mdx:collections/server';
import { i18n } from '@/lib/i18n';

export const source = loader({
  source: docs.toHanzo DocsSource(),
  baseUrl: '/docs',
  i18n,
});
