import type { ListItem } from 'mdast';
import { findSiblings } from '@hanzo/docs-core/page-tree';
import { source, type Page } from '@/lib/source';
import { ORIGIN, toMarkdown, twin } from '@/lib/markdown';

/** Text a page's MDX compiles to, or its raw source when that does not compile. */
export async function bodyOf(data: { getText: (kind: 'raw' | 'processed') => Promise<string> }): Promise<string> {
  // `processed` is the MDX after the site's remark plugins: includes resolved,
  // links rewritten. A page that FAILED to compile (ported upstream docs under
  // `projects/` written for another renderer) has none and throws; its raw
  // source is what a reader can still use.
  for (const kind of ['processed', 'raw'] as const) {
    try {
      return await data.getText(kind);
    } catch {
      continue;
    }
  }
  return '';
}

/** The pages a section's index lists under it, as the HTML's cards do. */
function siblings(page: Page): ListItem[] {
  return findSiblings(source.getPageTree(), page.url).flatMap((node): ListItem[] => {
    const leaf = node.type === 'folder' ? node.index : node.type === 'page' ? node : undefined;
    if (!leaf || leaf.url === page.url) return [];
    const target = source.getPageByHref(leaf.url)?.page;
    const title = target?.data.title ?? (typeof leaf.name === 'string' ? leaf.name : leaf.url);
    const about = target?.data.description?.replace(/\s+/g, ' ').trim();
    return [
      {
        type: 'listItem',
        spread: false,
        children: [
          {
            type: 'paragraph',
            children: [
              { type: 'link', url: `${ORIGIN}${leaf.url}`, children: [{ type: 'text', value: title }] },
              ...(about ? [{ type: 'text' as const, value: `: ${about}` }] : []),
            ],
          },
        ],
      },
    ];
  });
}

/** A docs page's Markdown twin: served at `<page>.md` and concatenated into llms-full.txt. */
export async function getLLMText(page: Page): Promise<string> {
  const raw = await bodyOf(page.data);
  const category = () => siblings(page);
  let body: string;
  try {
    body = toMarkdown(raw, { url: page.url, category });
    if (page.data.index) body = `${body}\n\n${toMarkdown('<DocsCategory />', { url: page.url, category })}`;
  } catch {
    body = raw;
  }
  return twin({ title: page.data.title, description: page.data.description, url: page.url, body });
}
