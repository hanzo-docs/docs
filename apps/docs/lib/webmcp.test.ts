import { afterEach, describe, expect, it, vi } from 'vitest';
import { format, modelContext, register, sitePath, tools, type Tool } from './webmcp';

const hit = (url: string, content: string, type: 'page' | 'heading' | 'text' = 'page') => ({ id: url, url, type, content });

afterEach(() => vi.unstubAllGlobals());

describe('modelContext', () => {
  it('prefers document.modelContext, then navigator.modelContext', () => {
    const doc = { registerTool: () => undefined };
    const nav = { registerTool: () => undefined };
    vi.stubGlobal('document', { modelContext: doc });
    vi.stubGlobal('navigator', { modelContext: nav });
    expect(modelContext()).toBe(doc);
    vi.stubGlobal('document', {});
    expect(modelContext()).toBe(nav);
    vi.stubGlobal('navigator', {});
    expect(modelContext()).toBeUndefined();
  });
});

describe('sitePath', () => {
  it('takes a path or a docs.hanzo.ai URL and refuses other hosts', () => {
    expect(sitePath('/docs/agents', 'http://localhost:3000')).toBe('/docs/agents');
    expect(sitePath('https://docs.hanzo.ai/docs/api-keys?x=1#y', 'http://localhost:3000')).toBe('/docs/api-keys');
    expect(sitePath('https://evil.example/docs', 'https://docs.hanzo.ai')).toBeUndefined();
  });
});

describe('tools', () => {
  const fetch = vi.fn(async (url: URL | string) =>
    String(url).endsWith('/docs/quickstart.md') ? new Response('# Quickstart\n') : new Response('no', { status: 404 }),
  ) as unknown as typeof globalThis.fetch;
  const search = vi.fn(async () => [hit('/docs/api-keys', 'API <mark>keys</mark>'), hit('/docs/agents#key', 'Get a <mark>key</mark>', 'heading')]);
  const [searchDocs, getPage] = tools({ search, fetch, origin: 'https://docs.hanzo.ai' });

  it('are read-only, named, and describe their input', () => {
    expect([searchDocs.name, getPage.name]).toEqual(['search_docs', 'get_page']);
    for (const t of [searchDocs, getPage]) {
      expect(t.annotations.readOnlyHint).toBe(true);
      expect(t.description.length).toBeGreaterThan(20);
      expect(t.inputSchema).toMatchObject({ type: 'object', required: [expect.any(String)] });
    }
  });

  it('search_docs answers each hit with its URL and its Markdown', async () => {
    const out = await searchDocs.execute({ query: 'keys', limit: 1 });
    expect(search).toHaveBeenCalledWith('keys');
    expect(JSON.parse(out.content[0].text)).toEqual([
      { type: 'page', text: 'API keys', url: 'https://docs.hanzo.ai/docs/api-keys', markdown: 'https://docs.hanzo.ai/docs/api-keys.md' },
    ]);
    expect((await searchDocs.execute({})).isError).toBe(true);
  });

  it('get_page returns the twin, and refuses what is not a page here', async () => {
    expect((await getPage.execute({ path: '/docs/quickstart' })).content[0].text).toBe('# Quickstart\n');
    expect((await getPage.execute({ path: 'https://docs.hanzo.ai/docs/quickstart/' })).content[0].text).toBe('# Quickstart\n');
    expect((await getPage.execute({ path: '/docs/nope' })).isError).toBe(true);
    expect((await getPage.execute({ path: 'https://evil.example/x' })).isError).toBe(true);
  });

  it('format strips the match marks and points at the page twin', () => {
    expect(JSON.parse(format([hit('/docs/agents#key', 'a <mark>b</mark>', 'heading')], 5))[0]).toEqual({
      type: 'heading',
      text: 'a b',
      url: 'https://docs.hanzo.ai/docs/agents#key',
      markdown: 'https://docs.hanzo.ai/docs/agents.md',
    });
  });
});

describe('register', () => {
  it('registers every tool, survives a refusal, and unregisters on abort', async () => {
    const seen: string[] = [];
    const gone: string[] = [];
    const ctx = {
      registerTool(tool: Tool) {
        if (tool.name === 'b') return Promise.reject(new Error('taken'));
        if (tool.name === 'c') throw new Error('refused');
        seen.push(tool.name);
        return { unregister: () => gone.push(tool.name) };
      },
    };
    const done = new AbortController();
    const named = (name: string) => ({ ...tools({ search: async () => [], fetch, origin: 'https://docs.hanzo.ai' })[0], name });
    register(ctx, [named('a'), named('b'), named('c'), named('d')], done.signal);
    expect(seen).toEqual(['a', 'd']);
    done.abort();
    expect(gone).toEqual(['a', 'd']);
    await new Promise((r) => setTimeout(r, 0));
  });
});
