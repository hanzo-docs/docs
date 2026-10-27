import { getLLMText } from '@/lib/get-llm-text';
import { getPageMarkdownUrl, source } from '@/lib/source';
import { notFound } from 'next/navigation';

// The Markdown twin of every docs page (lib/markdown). It prerenders here, under
// its own namespace, because the docs route cannot also answer `<page>.md`;
// scripts/twins.ts copies each file to `<page>.md`, the address the page's
// `<link rel="alternate" type="text/markdown">`, llms.txt and the edge's
// `Accept: text/markdown` rewrite all name. This address stays served too:
// earlier builds handed it out from the page's Markdown buttons.
//
// The last slug segment is `content.md` (see getPageMarkdownUrl), so it is
// dropped before the page lookup.
export const revalidate = false;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug?: string[] }> },
) {
  const { slug } = await params;
  const page = source.getPage(slug?.slice(0, -1));
  if (!page) notFound();

  return new Response(await getLLMText(page), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}

// Prerenders every twin as a real file, which is what makes this work under
// `output: 'export'` — this site is served by hanzoai/static, so nothing
// computes a response at request time.
export function generateStaticParams() {
  return source.getPages().map((page) => ({
    slug: getPageMarkdownUrl(page).segments,
  }));
}
