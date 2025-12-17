import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { source } from '../../../lib/instance';
import { brand } from '../../../lib/config';

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = source.getPage(slug);

  if (!page) {
    return {};
  }

  return {
    title: page.data.title,
    description: page.data.description || page.data.title,
    openGraph: {
      title: `${brand.proposalPrefix}-${page.data.frontmatter.proposal}: ${page.data.title}`,
      description: page.data.description || page.data.title,
      type: 'article',
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const page = source.getPage(slug);

  if (!page) {
    notFound();
  }

  const { frontmatter, content, title, description } = page.data;

  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      {/* Frontmatter Header */}
      <div className="not-prose mb-8 pb-8 border-b border-fd-border">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {frontmatter.proposal && (
            <span className="text-sm font-mono px-2 py-1 rounded bg-fd-primary/10 text-fd-primary">
              {brand.proposalPrefix}-{frontmatter.proposal}
            </span>
          )}
          {frontmatter.status && (
            <span
              className={`text-sm px-2 py-1 rounded ${
                frontmatter.status === 'Final'
                  ? 'bg-green-500/10 text-green-500'
                  : frontmatter.status === 'Draft'
                  ? 'bg-yellow-500/10 text-yellow-500'
                  : frontmatter.status === 'Review'
                  ? 'bg-blue-500/10 text-blue-500'
                  : frontmatter.status === 'Last Call'
                  ? 'bg-orange-500/10 text-orange-500'
                  : 'bg-fd-muted text-fd-muted-foreground'
              }`}
            >
              {frontmatter.status}
            </span>
          )}
          {frontmatter.type && (
            <span className="text-sm px-2 py-1 rounded bg-fd-muted text-fd-muted-foreground">
              {frontmatter.type}
            </span>
          )}
          {frontmatter.category && (
            <span className="text-sm px-2 py-1 rounded bg-fd-muted text-fd-muted-foreground">
              {frontmatter.category}
            </span>
          )}
        </div>

        <h1 className="text-3xl font-bold tracking-tight mb-3">{title}</h1>

        {description && (
          <p className="text-lg text-fd-muted-foreground">{description}</p>
        )}

        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
          {frontmatter.author && (
            <div>
              <dt className="text-fd-muted-foreground">Author</dt>
              <dd className="font-medium">{frontmatter.author}</dd>
            </div>
          )}
          {frontmatter.created && (
            <div>
              <dt className="text-fd-muted-foreground">Created</dt>
              <dd className="font-medium">{frontmatter.created}</dd>
            </div>
          )}
          {frontmatter.updated && (
            <div>
              <dt className="text-fd-muted-foreground">Updated</dt>
              <dd className="font-medium">{frontmatter.updated}</dd>
            </div>
          )}
          {frontmatter.requires && (
            <div>
              <dt className="text-fd-muted-foreground">Requires</dt>
              <dd className="font-medium">
                {Array.isArray(frontmatter.requires)
                  ? frontmatter.requires.map((r) => `${brand.proposalPrefix}-${r}`).join(', ')
                  : `${brand.proposalPrefix}-${frontmatter.requires}`}
              </dd>
            </div>
          )}
        </dl>
      </div>

      {/* Markdown Content */}
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </article>
  );
}
