import { loader } from '@hanzo/docs-core/source';
import { lucideIconsPlugin } from '@hanzo/docs-core/source/lucide-icons';
import { docs } from '@hanzo/docs-mdx:collections/server';

export const source = loader({
  source: docs.toHanzoDocsSource(),
  baseUrl: '/docs',
  plugins: [lucideIconsPlugin()],
});
