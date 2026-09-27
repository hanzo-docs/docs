import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { ComponentProps } from 'react';
import { createMetadata } from '@/lib/metadata';
import { source } from '@/lib/source';
import { inlineCode } from '@/lib/inline-code';
import { Mermaid } from '@/components/mdx/mermaid';
import { Feedback } from '@/components/feedback';
import { getMDXComponents } from '@/components/mdx';
import { A, Body } from '@/components/mdx/prose';
import { Card, Cards } from '@/components/mdx/blocks';
import { Page as Frame } from '@/components/page';
import { getBreadcrumbItems } from '@hanzo/docs-core/breadcrumb';
import { findNeighbour, findSiblings } from '@hanzo/docs-core/page-tree';
import { MdxErrorBoundary } from '@/components/mdx-error-boundary';
import { PathUtils } from '@hanzo/docs-core/source';

export const revalidate = false;

export default async function Page(props: PageProps<'/docs/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug);

  // The export holds only the pages the source lists; any other address is the
  // site's 404 (app/not-found.tsx).
  if (!page) notFound();

  const { body: Mdx, toc, lastModified } = await page.data.load();
  const tree = source.getPageTree();
  const { previous, next } = findNeighbour(tree, page.url);

  return (
    <Frame
      title={page.data.title}
      description={inlineCode(page.data.description)}
      crumbs={getBreadcrumbItems(page.url, tree)}
      toc={toc}
      previous={previous && { name: previous.name, url: previous.url }}
      next={next && { name: next.name, url: next.url }}
      updated={lastModified ? DAY.format(new Date(lastModified)) : undefined}
    >
      <Body>
        <MdxErrorBoundary>
          <Mdx
            components={getMDXComponents({
              // A link to another page here says where it goes before it is
              // followed: its title and description, as the link's own title.
              a({ href, ...props }: ComponentProps<'a'>) {
                const found = source.getPageByHref(href ?? '', {
                  dir: PathUtils.dirname(page.path),
                });
                if (!found) return <A href={href} {...props} />;
                const to = found.hash ? `${found.page.url}#${found.hash}` : found.page.url;
                const about = [found.page.data.title, found.page.data.description].filter(Boolean).join(' — ');
                return <A href={to} title={about} {...props} />;
              },
              Mermaid,
              DocsCategory: ({ url }: { url?: string }) => <DocsCategory url={url ?? page.url} />,
            })}
          />
        </MdxErrorBoundary>
        {page.data.index ? <DocsCategory url={page.url} /> : null}
      </Body>
      <Feedback />
    </Frame>
  );
}

// One formatter, fixed locale and zone, so the export and the browser print the
// same date and hydration has nothing to disagree about.
const DAY = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeZone: 'UTC' });

function DocsCategory({ url }: { url: string }) {
  return (
    <Cards>
      {findSiblings(source.getPageTree(), url).map((item) => {
        if (item.type === 'separator') return;
        if (item.type === 'folder') {
          if (!item.index) return;
          item = item.index;
        }

        return (
          <Card key={item.url} title={item.name} href={item.url}>
            {item.description}
          </Card>
        );
      })}
    </Cards>
  );
}

export async function generateMetadata(props: PageProps<'/docs/[[...slug]]'>): Promise<Metadata> {
  const { slug = [] } = await props.params;
  const page = source.getPage(slug);
  if (!page)
    return createMetadata({
      title: 'Not Found',
    });

  const description = page.data.description?.replaceAll('`', '') || 'Hanzo AI Cloud documentation';

  return createMetadata({
    title: page.data.title,
    description,
    openGraph: {
      url: `/docs/${page.slugs.join('/')}`,
    },
  });
}

export function generateStaticParams() {
  return source.generateParams();
}
