import pricing from '@/openapi-specs/pricing.json';
import { hero, markdown } from '@/lib/landing';
import { twin } from '@/lib/markdown';

// The front page as Markdown. scripts/twins.ts copies it to /index.md, the
// address the edge serves `/` at for `Accept: text/markdown`.
export const revalidate = false;

export function GET() {
  return new Response(twin({ title: 'Hanzo Docs', description: hero.title, url: '/', body: markdown(pricing.catalogue) }), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
