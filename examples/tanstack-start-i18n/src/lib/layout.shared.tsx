import type { BaseLayoutProps } from '@hanzo/radix/layouts/shared';
import { i18n } from '@/lib/i18n';

export function baseOptions(
  locale: string = i18n.defaultLanguage,
): BaseLayoutProps {
  return {
    i18n,
    nav: {
      title: `Tanstack Start ${locale}`,
    },
  };
}
