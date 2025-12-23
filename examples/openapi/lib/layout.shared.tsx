import type { BaseLayoutProps } from '@hanzo/radix/layouts/shared';
import { Logo } from '@/app/logo';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <Logo />,
    },
  };
}
