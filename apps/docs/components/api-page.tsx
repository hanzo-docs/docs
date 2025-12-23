import { openapi } from '@/lib/openapi';
import { createAPIPage } from '@hanzo/docs-openapi/ui';

export const APIPage = createAPIPage(openapi, {
  shikiOptions: {
    themes: {
      dark: 'vesper',
      light: 'vitesse-light',
    },
  },
});
