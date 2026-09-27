import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { TOCItemType } from '@hanzo/docs-core/toc';
import path from 'node:path';
import { blog } from '@/lib/source';
import { createMetadata } from '@/lib/metadata';
import { getMDXComponents } from '@/components/mdx';
import { Body } from '@/components/mdx/prose';
import { Page as Frame } from '@/components/page';

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

// Force static generation for the export.
export const dynamic = 'force-static';

const DAY = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeZone: 'UTC' });

export default async function Page(props: BlogPageProps) {
  const params = await props.params;
  const page = blog.getPage([params.slug]);
  if (!page) notFound();

  // A plain copy of the data: Next's proxy around it trips an ownKeys invariant
  // during static generation.
  const data = page.data as unknown as {
    author: string;
    date?: string;
    title: string;
    description?: string;
    load: () => Promise<{ body: React.ComponentType<{ components: object }>; toc: TOCItemType[] }>;
  };
  const { body: Mdx, toc } = await data.load();
  const when = DAY.format(new Date(data.date ?? path.basename(page.path, path.extname(page.path))));

  return (
    <Frame
      title={data.title}
      description={data.description}
      crumbs={[{ name: 'Blog', url: '/blog' }, { name: data.author ? `${data.author} · ${when}` : when }]}
      toc={toc}
    >
      <Body>
        <Mdx components={getMDXComponents()} />
      </Body>
    </Frame>
  );
}

export async function generateMetadata(props: BlogPageProps): Promise<Metadata> {
  const params = await props.params;
  const page = blog.getPage([params.slug]);

  if (!page) notFound();

  return createMetadata({
    title: page.data.title,
    description: page.data.description ?? 'The library for building documentation sites',
  });
}

export function generateStaticParams(): { slug: string }[] {
  return blog.getPages().map((page) => ({
    slug: page.slugs[0],
  }));
}
