import { loader } from '@hanzo/docs/source';
import { docs } from '@hanzo/docs-mdx:collections/server';
import { lucideIconsPlugin } from '@hanzo/docs/source/lucide-icons';

export const source = loader({
  source: docs.toFumadocsSource(),
  baseUrl: '/docs',
  plugins: [lucideIconsPlugin()],
});
