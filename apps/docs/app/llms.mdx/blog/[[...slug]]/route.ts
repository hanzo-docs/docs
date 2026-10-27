import { notFound } from 'next/navigation';
import { PathUtils } from '@hanzo/docs/core/source';
import { blog } from '@/lib/source';
import { bodyOf } from '@/lib/get-llm-text';
import { ORIGIN, toMarkdown, twin } from '@/lib/markdown';

// The blog as Markdown: `content.md` alone is /blog, `<post>/content.md` a post.
// scripts/twins.ts copies each to /blog.md and /blog/<post>.md.
export const revalidate = false;

interface Post {
  title: string;
  description?: string;
  author?: string;
  date?: string | Date;
}

const DAY = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeZone: 'UTC' });
const dated = (page: (typeof blog)['$inferPage']) => {
  const data = page.data as unknown as Post;
  return new Date(data.date ?? PathUtils.basename(page.path, PathUtils.extname(page.path)));
};

export async function GET(_req: Request, { params }: { params: Promise<{ slug?: string[] }> }) {
  const slug = ((await params).slug ?? []).slice(0, -1);
  let text: string;
  if (slug.length === 0) {
    const posts = blog.getPages().sort((a, b) => dated(b).getTime() - dated(a).getTime());
    const lines = posts.map((page) => {
      const data = page.data as unknown as Post;
      const about = data.description ? `: ${data.description}` : '';
      return `- [${data.title}](${ORIGIN}${page.url}) (${DAY.format(dated(page))})${about}`;
    });
    text = twin({ title: 'Blog', url: '/blog', body: lines.join('\n') });
  } else {
    const page = blog.getPage(slug);
    if (!page) notFound();
    const data = page.data as unknown as Post & { getText: (kind: 'raw' | 'processed') => Promise<string> };
    const byline = [data.author, DAY.format(dated(page))].filter(Boolean).join(' · ');
    const body = toMarkdown(await bodyOf(data), { url: page.url });
    text = twin({ title: data.title, description: data.description, url: page.url, body: `_${byline}_\n\n${body}` });
  }
  return new Response(text, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}

export function generateStaticParams() {
  return [{ slug: ['content.md'] }, ...blog.getPages().map((page) => ({ slug: [...page.slugs, 'content.md'] }))];
}
