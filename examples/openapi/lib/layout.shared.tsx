import type { BaseLayoutProps } from '@hanzo/docs/ui/layouts/shared';
import { Logo } from '@/app/logo';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <Logo />,
    },
  };
}
