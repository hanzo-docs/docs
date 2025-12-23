import type { BaseLayoutProps } from '@hanzo/radix/layouts/shared';
import { i18n } from '@/lib/i18n';

export function baseOptions(locale: string): BaseLayoutProps {
  return {
    nav: {
      title: 'Waku',
      url: `/${locale}`,
    },
    i18n,
  };
}
