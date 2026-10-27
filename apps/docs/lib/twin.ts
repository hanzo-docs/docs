/** Where docs.hanzo.ai is served: every link in a Markdown twin is absolute against it. */
export const ORIGIN = 'https://docs.hanzo.ai';

/**
 * A page's Markdown twin's address: `/` -> `/index.md`; `/a/b`, `/a/b/` and
 * `/a/b.html` -> `/a/b.md`. The edge rewrites `Accept: text/markdown` to it.
 */
export function twinPath(url: string): string {
  const path = url.replace(/[?#].*$/, '').replace(/\.html$/, '').replace(/\/+$/, '');
  return path === '' || path === '/index' ? '/index.md' : `${path}.md`;
}
