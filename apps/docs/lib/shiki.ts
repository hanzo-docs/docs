import { configDefault } from '@hanzo/docs-core/highlight';
import type { ResolvedShikiConfig } from '@hanzo/docs-core/highlight/config';

export const shikiConfig: ResolvedShikiConfig = {
  ...configDefault,
  defaultThemes: {
    themes: {
      light: 'github-light',
      dark: 'vesper',
    },
  },
};
