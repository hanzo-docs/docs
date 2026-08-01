import type { SharedIndex } from './build-index';

export interface SharedDocument {
  id: string;
  content: string;
  page_id: string;
  type: 'page' | 'heading' | 'text';
  breadcrumbs?: string[];
  tags: string[];
  url: string;
}

/**
 * Flatten pages into the documents a search index holds.
 *
 * One document per SECTION, not per paragraph: a section is what a result
 * links to (`page.url#heading`), so it is also what a result should be. A
 * document per paragraph puts dozens of rows behind the same anchor and, on a
 * corpus of any size, costs several times the text it indexes — a page's table
 * cells alone are hundreds of documents whose id, url and tags outweigh their
 * content.
 *
 * This is the ONE projection from pages to searchable documents. Everything
 * that searches — the index a build exports, the index a browser holds, the
 * server handler in dev — indexes what this returns.
 */
export function buildDocuments(indexes: SharedIndex[]) {
  const docs: SharedDocument[] = [];

  for (const page of indexes) {
    const pageTag = page.tag ?? [];
    const tags = Array.isArray(pageTag) ? pageTag : [pageTag];
    const data = page.structuredData;
    let id = 0;

    docs.push({
      id: page.id,
      page_id: page.id,
      type: 'page',
      content: page.title,
      breadcrumbs: page.breadcrumbs,
      tags,
      url: page.url,
    });

    const nextId = () => `${page.id}-${id++}`;

    if (page.description) {
      docs.push({
        id: nextId(),
        page_id: page.id,
        tags,
        type: 'text',
        url: page.url,
        content: page.description,
      });
    }

    // Each heading opens a section; the paragraphs that name it are its body.
    const sections = new Map<string, string[]>();
    for (const heading of data.headings) sections.set(heading.id, [heading.content]);

    // Text above the first heading, and text naming a heading the page does not
    // have, belongs to the page itself.
    const lead: string[] = [];
    for (const content of data.contents) {
      const section = content.heading ? sections.get(content.heading) : undefined;
      (section ?? lead).push(content.content);
    }

    if (lead.length > 0) {
      docs.push({
        id: nextId(),
        page_id: page.id,
        tags,
        type: 'text',
        url: page.url,
        content: lead.join('\n'),
      });
    }

    for (const heading of data.headings) {
      docs.push({
        id: nextId(),
        page_id: page.id,
        type: 'heading',
        tags,
        url: `${page.url}#${heading.id}`,
        content: sections.get(heading.id)!.join('\n'),
      });
    }
  }

  return docs;
}
