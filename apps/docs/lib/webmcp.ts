import type { SortedResult } from '@hanzo/docs-core/search';
import { ORIGIN, twinPath } from './twin';

/**
 * The docs as WebMCP tools (https://webmachinelearning.github.io/webmcp/): an
 * agent in the reader's browser can search the docs and read any page as
 * Markdown. Both only read. `search_docs` is the search the ⌘K dialog runs —
 * the static index at /v1/search — and `get_page` returns a page's twin.
 */

/** What a tool call answers: MCP's text content. */
export interface Result {
  content: { type: 'text'; text: string }[];
  isError?: boolean;
}

export interface Tool {
  name: string;
  title: string;
  description: string;
  inputSchema: object;
  annotations: { readOnlyHint: boolean };
  execute: (input: Record<string, unknown>) => Promise<Result>;
}

/** `document.modelContext`, or the earlier `navigator.modelContext`. */
export interface ModelContext {
  registerTool: (tool: Tool, options?: { signal?: AbortSignal }) => unknown;
}

export function modelContext(): ModelContext | undefined {
  const at = (o: unknown) => (o as { modelContext?: ModelContext } | undefined)?.modelContext;
  for (const ctx of [typeof document === 'undefined' ? undefined : at(document), typeof navigator === 'undefined' ? undefined : at(navigator)]) {
    if (typeof ctx?.registerTool === 'function') return ctx;
  }
  return undefined;
}

const text = (t: string, isError = false): Result => ({ content: [{ type: 'text', text: t }], ...(isError && { isError }) });

/** A path on this site, from a path or a docs.hanzo.ai URL; anything else is refused. */
export function sitePath(input: string, origin = ORIGIN): string | undefined {
  try {
    const url = new URL(input.trim(), origin);
    if (url.origin !== new URL(origin).origin && url.origin !== ORIGIN) return undefined;
    return url.pathname;
  } catch {
    return undefined;
  }
}

/** Search hits as one row each: what matched, where, and its Markdown twin. */
export function format(hits: SortedResult[], limit: number): string {
  const rows = hits.slice(0, limit).map((hit) => {
    const words = hit.content.replace(/<\/?mark>/g, '').replace(/\s+/g, ' ').trim();
    const [page] = hit.url.split('#');
    return { type: hit.type, text: words, url: `${ORIGIN}${hit.url}`, markdown: `${ORIGIN}${twinPath(page)}` };
  });
  return JSON.stringify(rows, null, 1);
}

export interface Deps {
  /** The docs search: query in, ranked hits out. */
  search: (query: string) => Promise<SortedResult[]>;
  fetch: typeof fetch;
  /** This page's origin, where the twins are fetched from. */
  origin: string;
}

export function tools({ search, fetch, origin }: Deps): Tool[] {
  return [
    {
      name: 'search_docs',
      title: 'Search Hanzo docs',
      description:
        'Search the Hanzo documentation (docs.hanzo.ai): guides, the API reference, CLI, SDKs and MCP tools. Returns the matching pages and sections, each with its URL and the URL of its Markdown.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Words to search for, e.g. "api keys" or "wallet sign in".' },
          limit: { type: 'integer', minimum: 1, maximum: 50, description: 'Most results to return. Default 10.' },
        },
        required: ['query'],
      },
      annotations: { readOnlyHint: true },
      async execute(input) {
        const query = typeof input.query === 'string' ? input.query.trim() : '';
        if (!query) return text('query is required', true);
        const limit = Math.min(50, Math.max(1, Math.trunc(Number(input.limit) || 10)));
        const hits = await search(query);
        return text(hits.length ? format(hits, limit) : `No page matches "${query}".`);
      },
    },
    {
      name: 'get_page',
      title: 'Read a Hanzo docs page',
      description:
        'Read one page of the Hanzo documentation as Markdown, by its path ("/docs/quickstart") or its docs.hanzo.ai URL. "/" is the front page.',
      inputSchema: {
        type: 'object',
        properties: {
          path: { type: 'string', description: 'The page, e.g. "/docs/agents" or "https://docs.hanzo.ai/docs/api-keys".' },
        },
        required: ['path'],
      },
      annotations: { readOnlyHint: true },
      async execute(input) {
        const path = typeof input.path === 'string' ? sitePath(input.path, origin) : undefined;
        if (!path) return text('path must be a docs.hanzo.ai page, e.g. "/docs/quickstart"', true);
        const twin = path.endsWith('.md') ? path : twinPath(path);
        const res = await fetch(new URL(twin, origin), { headers: { Accept: 'text/markdown' } });
        if (!res.ok) return text(`${twin}: ${res.status}, no such page`, true);
        return text(await res.text());
      },
    },
  ];
}

/** Register each tool; the signal unregisters them. A refused registration is skipped. */
export function register(ctx: ModelContext, list: Tool[], signal: AbortSignal): void {
  for (const tool of list) {
    try {
      // The spec answers a promise and unregisters on the signal; the earlier
      // API answered a handle with `unregister()`.
      const handle = ctx.registerTool(tool, { signal }) as { then?: unknown; catch?: (f: () => void) => void; unregister?: () => void } | undefined;
      if (typeof handle?.then === 'function') handle.catch?.(() => undefined);
      else if (typeof handle?.unregister === 'function') signal.addEventListener('abort', () => handle.unregister?.());
    } catch {
      // The name is taken or the context refused it; the other tools still register.
    }
  }
}
