import type { Route } from './+types/page';
import { DocsLayout } from '@hanzo/radix/layouts/docs';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from '@hanzo/radix/layouts/docs/page';
import { source } from '@/lib/source';
import defaultMdxComponents from '@hanzo/radix/mdx';
import browserCollections from '@hanzo/docs-mdx:collections/browser';
import { baseOptions } from '@/lib/layout.shared';
import { useDocsLoader } from '@hanzo/docs-core/source/client';

export async function loader({ params }: Route.LoaderArgs) {
  const slugs = params['*'].split('/').filter((v) => v.length > 0);
  const page = source.getPage(slugs, params.lang);
  if (!page) throw new Response('Not found', { status: 404 });

  return {
    path: page.path,
    pageTree: await source.serializePageTree(source.getPageTree(params.lang)),
  };
}

const clientLoader = browserCollections.docs.createClientLoader({
  component({ toc, default: Mdx, frontmatter }) {
    return (
      <DocsPage toc={toc}>
        <title>{frontmatter.title}</title>
        <meta name="description" content={frontmatter.description} />
        <DocsTitle>{frontmatter.title}</DocsTitle>
        <DocsDescription>{frontmatter.description}</DocsDescription>
        <DocsBody>
          <Mdx components={{ ...defaultMdxComponents }} />
        </DocsBody>
      </DocsPage>
    );
  },
});

export default function Page({ loaderData, params }: Route.ComponentProps) {
  const Content = clientLoader.getComponent(loaderData.path);
  const { pageTree } = useDocsLoader(loaderData);

  return (
    <DocsLayout {...baseOptions(params.lang)} tree={pageTree}>
      <Content />
    </DocsLayout>
  );
}
