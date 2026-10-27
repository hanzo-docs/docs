import { expect, test } from '@playwright/test';

// The WebMCP tools every page registers (lib/webmcp), as an in-browser agent
// sees them: a recording model context stands in for the browser's own, then
// each tool is called the way an agent would call it.

declare global {
  interface Window {
    __tools: { name: string; annotations?: { readOnlyHint?: boolean }; execute: (input: object) => Promise<{ content: { text: string }[]; isError?: boolean }> }[];
  }
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.__tools = [];
    Object.defineProperty(document, 'modelContext', {
      value: {
        // As the spec has it: a name registers once, and the signal unregisters it.
        registerTool(tool: Window['__tools'][number], options?: { signal?: AbortSignal }) {
          if (window.__tools.some((t) => t.name === tool.name)) return Promise.reject(new DOMException('taken', 'InvalidStateError'));
          window.__tools.push(tool);
          options?.signal?.addEventListener('abort', () => {
            window.__tools = window.__tools.filter((t) => t !== tool);
          });
          return Promise.resolve();
        },
      },
    });
  });
});

for (const path of ['/', '/docs/quickstart']) {
  test(`${path} registers search_docs and get_page, read-only`, async ({ page }) => {
    await page.goto(path);
    await expect.poll(() => page.evaluate(() => window.__tools.map((t) => t.name)), { timeout: 60_000 }).toEqual(['search_docs', 'get_page']);
    expect(await page.evaluate(() => window.__tools.every((t) => t.annotations?.readOnlyHint === true))).toBe(true);
  });
}

test('get_page answers a page as Markdown, search_docs finds it', async ({ page }) => {
  test.setTimeout(600_000);
  await page.goto('/');
  await expect.poll(() => page.evaluate(() => window.__tools.length), { timeout: 60_000 }).toBe(2);

  const twin = await page.evaluate(async () => (await window.__tools[1].execute({ path: '/docs/quickstart' })).content[0].text);
  expect(twin.startsWith('# Quickstart\n\nURL: https://docs.hanzo.ai/docs/quickstart')).toBe(true);

  const refused = await page.evaluate(async () => (await window.__tools[1].execute({ path: 'https://example.com/x' })).isError);
  expect(refused).toBe(true);

  const hits = await page.evaluate(async () => (await window.__tools[0].execute({ query: 'quickstart', limit: 5 })).content[0].text);
  const rows = JSON.parse(hits) as { url: string; markdown: string }[];
  expect(rows.length).toBeGreaterThan(0);
  expect(rows.some((r) => r.url.startsWith('https://docs.hanzo.ai/docs/quickstart'))).toBe(true);
  expect(rows.every((r) => r.markdown.endsWith('.md'))).toBe(true);
});
