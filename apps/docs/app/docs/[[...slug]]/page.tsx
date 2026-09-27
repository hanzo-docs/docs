import type { Metadata } from 'next';
import { type ComponentProps, type FC, type ReactNode } from 'react';
import * as Twoslash from '@hanzo/docs-twoslash/ui';
import { Callout } from '@hanzo/docs-base-ui/components/callout';
import { TypeTable } from '@hanzo/docs-base-ui/components/type-table';
import * as Preview from '@/components/preview';
import { createMetadata } from '@/lib/metadata';
import { source } from '@/lib/source';
import { inlineCode } from '@/lib/inline-code';
import { Wrapper } from '@/components/preview/wrapper';
import { Mermaid } from '@/components/mdx/mermaid';
import { PageFeedback, PageFeedbackBlock } from '@/components/feedback';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@hanzo/docs-base-ui/components/ui/hover-card';
import Link from '@hanzo/docs-core/link';
import { Card, Cards } from '@hanzo/docs-base-ui/components/card';
import { getMDXComponents } from '@/components/mdx';
import { Banner } from '@hanzo/docs-base-ui/components/banner';
import { Installation } from '@/components/preview/installation';
import { Customization } from '@/components/preview/customization';
import { Page as Frame } from '@/components/page';
import { getBreadcrumbItems } from '@hanzo/docs-core/breadcrumb';
import { findNeighbour, findSiblings } from '@hanzo/docs-core/page-tree';
import { NotFound } from '@/components/layouts/not-found';
import { MdxErrorBoundary } from '@/components/mdx-error-boundary';
import { getSuggestions } from './suggestions';
import { PathUtils } from '@hanzo/docs-core/source';

function PreviewRenderer({ preview }: { preview: string }): ReactNode {
  if (preview && preview in Preview) {
    const Comp = Preview[preview as keyof typeof Preview];
    return <Comp />;
  }

  return null;
}

export const revalidate = false;

export default async function Page(props: PageProps<'/docs/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug);

  if (!page)
    return (
      <NotFound
        getSuggestions={async () => (params.slug ? getSuggestions(params.slug.join(' ')) : [])}
      />
    );

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
      {/* The body is still Tailwind's typography until the MDX components move
          onto @hanzo/gui (LLM.md, "Moving onto @hanzo/gui", phase 3). */}
      <div className="prose flex-1 text-fd-foreground/90">
        {page.data.preview && <PreviewRenderer preview={page.data.preview} />}
        <MdxErrorBoundary>
          <Mdx
            components={getMDXComponents({
              ...Twoslash,
              a({ href, ...props }) {
                const found = source.getPageByHref(href ?? '', {
                  dir: PathUtils.dirname(page.path),
                });

                if (!found) return <Link href={href} {...props} />;

                return (
                  <HoverCard>
                    <HoverCardTrigger
                      href={found.hash ? `${found.page.url}#${found.hash}` : found.page.url}
                      {...props}
                    >
                      {props.children}
                    </HoverCardTrigger>
                    <HoverCardContent className="text-sm">
                      <p className="font-medium">{found.page.data.title}</p>
                      <p className="text-fd-muted-foreground">{inlineCode(found.page.data.description)}</p>
                    </HoverCardContent>
                  </HoverCard>
                );
              },
              FeedbackBlock: ({ children, ...props }) => (
                <PageFeedbackBlock {...props}>
                  {children}
                </PageFeedbackBlock>
              ),
              Banner,
              Mermaid,
              TypeTable,
              Wrapper,
              blockquote: Callout as unknown as FC<ComponentProps<'blockquote'>>,
              DocsCategory: ({ url }) => {
                return <DocsCategory url={url ?? page.url} />;
              },
              Installation,
              Customization,
            })}
          />
        </MdxErrorBoundary>
        {page.data.index ? <DocsCategory url={page.url} /> : null}
      </div>
      <PageFeedback />
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
