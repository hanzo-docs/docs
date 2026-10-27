import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';
import type { BlockContent, Link, ListItem, Paragraph, PhrasingContent, Root, RootContent } from 'mdast';
import { ORIGIN } from './twin';

export { ORIGIN, twinPath } from './twin';

/**
 * A page as Markdown: its twin, what an agent reads instead of the HTML.
 *
 * The body is the page's MDX after the site's remark plugins ran (includes
 * resolved, links rewritten), parsed back and lowered to plain CommonMark + GFM:
 * every component becomes the Markdown it stands for (a callout a quote, cards a
 * list of links, tabs labelled sections, an Example a fenced block), widgets
 * that only draw in a browser leave, and every link is absolute.
 */

export interface Twin {
  title: string;
  description?: string;
  /** The page's own path, `/docs/a/b`. */
  url: string;
  body: string;
}

/** `# Title`, the canonical URL, the description, then the body. */
export function twin({ title, description, url, body }: Twin): string {
  const lede = description?.replace(/\s+/g, ' ').trim();
  return [`# ${title}`, '', `URL: ${ORIGIN}${url}`, '', ...(lede ? [`> ${lede}`, ''] : []), body.trim(), ''].join('\n');
}

export interface Options {
  /** The page's own path, which relative links and `#anchors` resolve against. */
  url: string;
  /** The pages a `<DocsCategory />` lists. */
  category?: () => ListItem[];
}

type Jsx = Extract<RootContent, { type: 'mdxJsxFlowElement' | 'mdxJsxTextElement' }>;
type Node = RootContent;

const parser = remark().use(remarkGfm).use(remarkMdx);
const plain = remark().use(remarkGfm);
const writer = remark()
  .use(remarkGfm)
  .data('settings', { bullet: '-', emphasis: '_', fences: true, listItemIndent: 'one', rule: '-' });

/** Lower MDX source to Markdown. Source that is not valid MDX is read as Markdown. */
export function toMarkdown(source: string, options: Options): string {
  const text = source.replace(/^---\n[\s\S]*?\n---\n/, '');
  let tree: Root;
  try {
    tree = parser.parse(text);
  } catch {
    tree = plain.parse(text);
  }
  tree.children = lower(tree.children, options) as Root['children'];
  return writer.stringify(tree).replace(/\n{3,}/g, '\n\n').trim();
}

/** A link target as an absolute URL: root paths and anchors land on docs.hanzo.ai. */
export function absolute(url: string, page: string): string {
  if (/^[a-z][a-z\d+.-]*:/i.test(url)) return url;
  if (url.startsWith('//')) return `https:${url}`;
  if (url.startsWith('#')) return `${ORIGIN}${page}${url}`;
  try {
    return new URL(url, `${ORIGIN}${page}`).href;
  } catch {
    return url;
  }
}

function lower(nodes: Node[], o: Options): Node[] {
  return nodes.flatMap((node) => one(node, o));
}

function one(node: Node, o: Options): Node[] {
  switch (node.type) {
    case 'mdxjsEsm':
      return [];
    case 'mdxFlowExpression':
    case 'mdxTextExpression': {
      const value = literal(node.value);
      return value === undefined ? [] : [{ type: 'text', value }];
    }
    case 'mdxJsxFlowElement':
    case 'mdxJsxTextElement':
      return component(node, o);
    case 'heading': {
      const last = node.children[node.children.length - 1];
      // The heading's own `[#id]`: the HTML anchor, not words a reader says.
      if (last?.type === 'text') last.value = last.value.replace(/\s*\[#[^\]]+\]\s*$/, '');
      break;
    }
    case 'link':
    case 'image':
    case 'definition':
      node.url = absolute(node.url, o.url);
      break;
  }
  if ('children' in node) node.children = lower(node.children as Node[], o) as typeof node.children;
  return [node];
}

/** A string an attribute or `{expression}` spells literally, else undefined. */
function literal(src: string): string | undefined {
  const t = src.trim();
  const m = /^(['"`])([\s\S]*)\1$/.exec(t);
  if (!m || (m[1] === '`' && m[2].includes('${'))) return undefined;
  return m[2].replace(/\\(['"`\\])/g, '$1');
}

function attr(node: Jsx, name: string): string | undefined {
  for (const a of node.attributes) {
    if (a.type !== 'mdxJsxAttribute' || a.name !== name) continue;
    if (typeof a.value === 'string') return a.value;
    if (a.value && typeof a.value === 'object') return literal(a.value.value) ?? a.value.value;
  }
  return undefined;
}

const text = (value: string): PhrasingContent => ({ type: 'text', value });
const strong = (value: string): PhrasingContent => ({ type: 'strong', children: [text(value)] });
const para = (...children: PhrasingContent[]): Paragraph => ({ type: 'paragraph', children });
const link = (url: string, label: string, o: Options): Link => ({
  type: 'link',
  url: absolute(url, o.url),
  children: [text(label)],
});
const item = (...children: PhrasingContent[]): ListItem => ({ type: 'listItem', spread: false, children: [para(...children)] });
const list = (children: ListItem[]): Node => ({ type: 'list', ordered: false, spread: false, children });

/** The words of lowered block content, as one line of phrasing. */
function inline(nodes: Node[]): PhrasingContent[] {
  const out: PhrasingContent[] = [];
  for (const n of nodes) {
    const parts =
      n.type === 'paragraph' ? n.children : 'children' in n ? inline(n.children as Node[]) : n.type === 'text' || n.type === 'inlineCode' ? [n] : [];
    if (!parts.length) continue;
    if (out.length) out.push(text(' '));
    out.push(...(parts as PhrasingContent[]));
  }
  return out;
}

/** Each `{ name|label: '…', href: '…' }` an expression attribute spells. */
function entries(src: string | undefined): { name: string; href: string }[] {
  const out: { name: string; href: string }[] = [];
  for (const m of (src ?? '').matchAll(/\{[^{}]*\}/g)) {
    const name = /(?:name|label|title)\s*:\s*(['"])(.*?)\1/.exec(m[0])?.[2];
    const href = /href\s*:\s*(['"])(.*?)\1/.exec(m[0])?.[2];
    if (name && href) out.push({ name, href });
  }
  return out;
}

/** A labelled section: the label in bold, then its content. */
function labelled(label: string | undefined, children: Node[], o: Options): Node[] {
  return [...(label ? [para(strong(label))] : []), ...lower(children, o)];
}

function component(node: Jsx, o: Options): Node[] {
  const flow = node.type === 'mdxJsxFlowElement';
  const kids = node.children as Node[];
  const name = node.name ?? '';

  switch (name) {
    case '':
    case 'Steps':
    case 'Step':
    case 'Accordions':
    case 'ProductSections':
    case 'CodeBlockTabs':
      // A fragment, or a wrapper whose parts carry the words.
      return lower(kids, o);
    case 'TabsList':
    case 'TabsTrigger':
    case 'CodeBlockTabsList':
    case 'CodeBlockTabsTrigger':
      // A tab's label, which its content repeats as `value`.
      return [];
    case 'Callout': {
      const title = attr(node, 'title');
      if (!flow) return lower(kids, o);
      return [{ type: 'blockquote', children: labelled(title, kids, o) as BlockContent[] }];
    }
    case 'Cards':
      return [list(kids.flatMap((k) => (k.type === 'mdxJsxFlowElement' && k.name === 'Card' ? [card(k, o)] : [])))];
    case 'Card':
      return flow ? [list([card(node, o)])] : (card(node, o).children[0] as Paragraph).children;
    case 'Tabs': {
      // `items={['A', 'B']}` names the tabs that carry no `value` of their own.
      const labels = [...(attr(node, 'items') ?? '').matchAll(/(['"])(.*?)\1/g)].map((m) => m[2]);
      let i = 0;
      return kids.flatMap((k) => {
        if (k.type !== 'mdxJsxFlowElement' || (k.name !== 'Tab' && k.name !== 'TabsContent')) return lower([k], o);
        const label = attr(k, 'value') ?? attr(k, 'title') ?? labels[i];
        i++;
        return labelled(label, k.children as Node[], o);
      });
    }
    case 'Tab':
    case 'TabsContent':
    case 'CodeBlockTab':
    case 'Accordion':
      return labelled(attr(node, 'value') ?? attr(node, 'title'), kids, o);
    case 'Files':
      return [list(files(kids))];
    case 'Folder':
    case 'File':
      return [list(files([node]))];
    case 'Example': {
      const code = attr(node, 'code');
      return code === undefined ? [] : [{ type: 'code', lang: attr(node, 'lang') ?? null, meta: null, value: code }];
    }
    case 'Mermaid': {
      const chart = attr(node, 'chart');
      return chart === undefined ? [] : [{ type: 'code', lang: 'mermaid', meta: null, value: chart }];
    }
    case 'ProductSection': {
      const title = attr(node, 'title') ?? '';
      const href = attr(node, 'href');
      const snippet = attr(node, 'snippet');
      const action = entries(attr(node, 'action'))[0];
      const links = entries(attr(node, 'links'));
      return [
        { type: 'heading', depth: 3, children: [href ? link(href, title, o) : text(title)] },
        ...lower(kids, o),
        ...(snippet ? example(snippet, o) : []),
        ...(links.length ? [list(links.map((l) => item(link(l.href, l.name, o))))] : []),
        ...(action ? [para(link(action.href, action.name, o))] : []),
      ];
    }
    case 'DocsCategory': {
      const items = o.category?.() ?? [];
      return items.length ? [list(items)] : [];
    }
    case 'ModelsCatalog':
      return [para(text('The live model catalogue: '), link('https://api.hanzo.ai/v1/models', 'GET https://api.hanzo.ai/v1/models', o))];
    case 'ConnectorsCatalog':
      return [para(text('The live connector catalogue: '), link('https://registry.modelcontextprotocol.io', 'the MCP registry', o))];
    case 'DocsHero':
    case 'ProviderStrip':
    case 'InstallCatalog':
      // Drawn in the browser from data the page's prose already states.
      return [];
    case 'a': {
      const href = attr(node, 'href');
      const words = inline(lower(kids, o));
      if (!href) return flow ? [para(...words)] : words;
      const l: Link = { type: 'link', url: absolute(href, o.url), children: words.length ? words : [text(href)] };
      return flow ? [para(l)] : [l];
    }
    case 'img': {
      const src = attr(node, 'src');
      if (!src) return [];
      const img: PhrasingContent = { type: 'image', url: absolute(src, o.url), alt: attr(node, 'alt') ?? '' };
      return flow ? [para(img)] : [img];
    }
    case 'br':
      return flow ? [] : [{ type: 'break' }];
    case 'code':
    case 'kbd': {
      const value = inline(lower(kids, o))
        .map((p) => ('value' in p ? p.value : ''))
        .join('');
      return flow ? [para({ type: 'inlineCode', value })] : [{ type: 'inlineCode', value }];
    }
    case 'summary':
      return [para(strong(inline(lower(kids, o)).map((p) => ('value' in p ? p.value : '')).join('')))];
    case 'script':
    case 'style':
    case 'iframe':
    case 'video':
    case 'audio':
    case 'source':
    case 'svg':
      return [];
  }

  // Anything else is a wrapper: its title, if it has one, then what it holds.
  const title = /^[A-Z]/.test(name) ? attr(node, 'title') : undefined;
  return flow ? labelled(title, kids, o) : lower(kids, o);
}

/**
 * An element written into an attribute, `snippet={<Example lang code />}`. The
 * processed source carries it as a string whose inner quotes are decoded, so a
 * `code` holding `"` is no longer valid JSX; the Example's two fields are read
 * off it directly then.
 */
function example(src: string, o: Options): Node[] {
  try {
    return lower(parser.parse(src).children, o);
  } catch {
    const m = /^\s*<Example\s+lang="([^"]*)"\s+code="([\s\S]*)"\s*\/>\s*$/.exec(src);
    return m ? [{ type: 'code', lang: m[1], meta: null, value: m[2] }] : [];
  }
}

/** A card: its title linked to where it goes, then what it says. */
function card(node: Jsx, o: Options): ListItem {
  const title = attr(node, 'title') ?? '';
  const href = attr(node, 'href');
  const about = attr(node, 'description');
  const words = about ? [text(about)] : inline(lower(node.children as Node[], o));
  const head = href ? link(href, title, o) : strong(title);
  return item(head, ...(words.length ? [text(': '), ...words] : []));
}

/** A file tree as a nested list. */
function files(nodes: Node[]): ListItem[] {
  return nodes.flatMap((n): ListItem[] => {
    if (n.type !== 'mdxJsxFlowElement' && n.type !== 'mdxJsxTextElement') return [];
    if (n.name === 'Files') return files(n.children as Node[]);
    const entry = attr(n, 'name') ?? '';
    const name: PhrasingContent = { type: 'inlineCode', value: n.name === 'Folder' ? `${entry}/` : entry };
    const inner = n.name === 'Folder' ? files(n.children as Node[]) : [];
    return [{ type: 'listItem', spread: false, children: [para(name), ...(inner.length ? [list(inner) as BlockContent] : [])] }];
  });
}
