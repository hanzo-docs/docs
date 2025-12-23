import { DocsLayout } from '@hanzo/radix/layouts/docs';
import { DocsPage, type DocsPageProps } from '@hanzo/radix/layouts/docs/page';
import type { Root } from '@hanzo/docs/page-tree';
import type { ReactNode } from 'react';
import { FrameworkProvider } from '@hanzo/docs/framework';
import { navigate } from 'astro:transitions/client';
import { RootProvider } from '@hanzo/radix/provider/base';
import SearchDialog from './search';

export function Docs({
  tree,
  children,
  pathname,
  params,
  page,
}: {
  tree: Root;
  children: ReactNode;
  pathname: string;
  params: Record<string, string | string[]>;
  page?: DocsPageProps;
}) {
  return (
    <FrameworkProvider
      usePathname={() => pathname}
      useParams={() => params}
      useRouter={() => ({
        push(pathname) {
          void navigate(pathname);
        },
        refresh() {
          window.location.reload();
        },
      })}
    >
      <RootProvider theme={{ enabled: false }} search={{ SearchDialog }}>
        <DocsLayout
          tree={tree}
          themeSwitch={{
            enabled: false,
          }}
          nav={{
            title: 'Fumadocs on Astro',
          }}
        >
          <DocsPage {...page}>{children}</DocsPage>
        </DocsLayout>
      </RootProvider>
    </FrameworkProvider>
  );
}
