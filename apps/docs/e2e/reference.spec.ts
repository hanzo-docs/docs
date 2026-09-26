import { expect, test, type Page } from '@playwright/test';

// What the owner saw on /docs/cli/bot, as checks a browser can fail:
//
//   - the sidebar's "Get an API key" printed near-white on its white fill;
//   - "On this page" sat a third of the way down the rail, its entries two
//     thirds down, the header alone at the top;
//   - table cells stopped mid-clause with "…";
//   - a command whose only answer is 501 was listed as a command;
//   - section headings were raw CLI tokens ("members", "runs"), and the line
//     under the title printed `hanzo bot` with its backticks;
//   - code comments were #555 on near-black (2.65:1) in the dark theme.
//
// Each is checked on the generated pages, which are built the same way, so a
// regression in the generator or the chrome shows up on all of them at once.

const REFERENCE = [
  '/docs/cli/bot/',
  '/docs/cli/sync/',
  '/docs/cli/campaign/',
  '/docs/openapi/bot/',
];

async function open(page: Page, path: string, theme: 'dark' | 'light') {
  await page.addInitScript((t) => {
    try {
      localStorage.setItem('theme', t);
    } catch {}
  }, theme);
  const res = await page.goto(path, { waitUntil: 'load' });
  expect(res?.status(), `${path} answers`).toBeLessThan(400);
  await page.evaluate(() => document.fonts.ready);
}

/** Every element matching `selector` whose text is under WCAG AA (4.5:1)
 *  against the first opaque ground behind it. Colours are resolved by the
 *  browser (a canvas reads back any CSS colour syntax as sRGB), so oklch, lab
 *  and hsl tokens compare the same, and a translucent text colour is blended
 *  onto its ground first, which is what the eye sees. */
async function lowContrast(page: Page, selector: string) {
  return page.locator(selector).evaluateAll((els) => {
    const ctx = document.createElement('canvas').getContext('2d')!;
    const rgba = (c: string) => {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = c;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
      return { r, g, b, a: a / 255 };
    };
    const lum = ({ r, g, b }: { r: number; g: number; b: number }) => {
      const f = (v: number) => {
        const s = v / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    return els
      .filter((el) => el.textContent?.trim())
      .map((el) => {
        let ground = { r: 255, g: 255, b: 255, a: 1 };
        for (let n: Element | null = el; n; n = n.parentElement) {
          // The first OPAQUE ground: a translucent hover wash is not what the
          // text sits on at rest.
          const bg = rgba(getComputedStyle(n).backgroundColor);
          if (bg.a > 0.99) {
            ground = bg;
            break;
          }
        }
        const c = rgba(getComputedStyle(el).color);
        const mix = (k: 'r' | 'g' | 'b') => c[k] * c.a + ground[k] * (1 - c.a);
        const fg = { r: mix('r'), g: mix('g'), b: mix('b') };
        const [hi, lo] = [lum(fg), lum(ground)].sort((x, y) => y - x);
        const ratio = (hi + 0.05) / (lo + 0.05);
        return {
          text: el.textContent!.trim().slice(0, 60),
          color: getComputedStyle(el).color,
          ratio: +ratio.toFixed(2),
        };
      })
      .filter((r) => r.ratio < 4.5);
  });
}

for (const theme of ['dark', 'light'] as const) {
  test(`the sidebar's primary button is readable (${theme})`, async ({ page }) => {
    await open(page, '/docs/cli/bot/', theme);
    const cta = 'aside a:text-is("Get an API key"), #nd-sidebar a:text-is("Get an API key")';
    await expect(page.locator(cta).first()).toBeVisible();
    expect(await lowContrast(page, cta)).toEqual([]);
  });

  // Every token in a code block, comments included: the dark theme wrote
  // comments at 58% alpha, #555 on the page's near-black, 2.65:1.
  test(`code in a command block is readable (${theme})`, async ({ page }) => {
    await open(page, '/docs/quickstart/', theme);
    expect(await page.locator('.prose pre code span').count()).toBeGreaterThan(0);
    expect(await lowContrast(page, '.prose pre code span')).toEqual([]);
  });

  // The reference's examples are highlighted as the page renders (components/
  // example.tsx), not by the compile; they carry the same themes and colours.
  test(`a reference example is highlighted and readable (${theme})`, async ({ page }) => {
    await open(page, '/docs/openapi/bot/get-bot-runs/', theme);
    const tokens = page.locator('.prose figure.shiki pre code span[style]');
    expect(await tokens.count()).toBeGreaterThan(0);
    expect(await lowContrast(page, '.prose figure.shiki pre code span')).toEqual([]);
  });

  test(`the table of contents heads the right rail (${theme})`, async ({ page }) => {
    await open(page, '/docs/cli/bot/', theme);
    const title = page.locator('#toc-title');
    await expect(title).toBeVisible();
    const box = await title.boundingBox();
    const h1 = await page.locator('h1').first().boundingBox();
    const first = await page.locator('#nd-toc a[href^="#"]').first().boundingBox();
    expect(box && h1 && first, 'title, heading and first entry all render').toBeTruthy();
    // It starts level with the article, not somewhere down the rail ...
    expect(box!.y, '"On this page" starts no lower than the page title').toBeLessThanOrEqual(
      h1!.y + 8,
    );
    // ... and its entries follow it, not a screen further down.
    expect(first!.y - (box!.y + box!.height), 'first entry sits under "On this page"').toBeLessThan(
      32,
    );
  });
}

// The landing is dark by class whatever the reader chose, so its headings and
// the pre-footer have to read on that ground in both themes.
for (const theme of ['dark', 'light'] as const) {
  test(`the landing's headings are readable (${theme})`, async ({ page }) => {
    await open(page, '/', theme);
    expect(await page.locator('main h2').count()).toBeGreaterThan(0);
    expect(
      await lowContrast(page, 'main h2, section[data-hanzo-shell] h2, section[data-hanzo-shell] a'),
    ).toEqual([]);
  });
}

// The blog is light for a light reader: its cards' dates printed #f5f5f5 on
// #fcfcfc, and the pre-footer's glass sat on the white body at 2.38:1.
for (const theme of ['dark', 'light'] as const) {
  test(`the blog is readable (${theme})`, async ({ page }) => {
    await open(page, '/blog/', theme);
    expect(await page.locator('main a p').count()).toBeGreaterThan(0);
    expect(
      await lowContrast(page, 'main a p, section[data-hanzo-shell] h2, section[data-hanzo-shell] a'),
    ).toEqual([]);
  });
}

// Every page carried the page tree's fallback — the 2,400 operation pages no
// meta lists — so an operation page weighed 1.7 MB of HTML, most of it a list of
// other pages. It ships without it and still says where it is.
test('an operation page carries no fallback tree and names its product', async ({ page }) => {
  const res = await page.goto('/docs/openapi/bot/get-bot-runs/', { waitUntil: 'load' });
  const html = await res!.text();
  expect(html).not.toContain('fallback:openapi');
  expect(html.length, 'HTML bytes').toBeLessThan(1_000_000);
  await expect(page.locator('article a[href="/docs/openapi/bot/"]', { hasText: /^Bot$/ })).toBeVisible();
});

test('prose is spaced: a paragraph has a margin', async ({ page }) => {
  await open(page, '/docs/quickstart/', 'dark');
  const margin = await page
    .locator('.prose p')
    .first()
    .evaluate(
      (p) =>
        parseFloat(getComputedStyle(p).marginBottom) + parseFloat(getComputedStyle(p).marginTop),
    );
  expect(margin, 'paragraph margins').toBeGreaterThan(0);
});

for (const path of REFERENCE) {
  test(`${path} reads as finished sentences and real commands`, async ({ page }) => {
    await open(page, path, 'dark');
    const cells = await page.locator('.prose td').allInnerTexts();
    expect(cells.length, 'the page has a table').toBeGreaterThan(0);
    // Prose that stops. A code span ending in "…" (`hanzo bot …`, the commands
    // under a capability) is notation, not a sentence cut short.
    const prose = await page
      .locator('.prose td')
      .evaluateAll((tds) =>
        tds
          .filter((td) =>
            [...td.childNodes].some((n) => n.nodeType === Node.TEXT_NODE && n.textContent!.trim()),
          )
          .map((td) => (td as HTMLElement).innerText.trim()),
      );
    const cut = prose.filter((c) => c.endsWith('…'));
    expect(cut, 'cells that stop mid-sentence').toEqual([]);
    const refusals = cells.filter((c) => /\b501\b|not implemented/i.test(c));
    expect(refusals, 'rows for an operation that only answers 501').toEqual([]);
    // A cell opening with a Go identifier and its verb: the handler's own name
    // ("List returns …", "Stop terminates …") or a CamelCase symbol
    // ("ListGPUTiers returns …", "CompleteDeployment is …").
    const symbol = cells.filter((c) =>
      /^([A-Z][a-z]+[A-Z]\w*|List|Get|Stop|Run|Create|Delete|Put|Post) (is|are|[a-z]+s)\b/.test(
        c.trim(),
      ),
    );
    expect(symbol, 'cells that open with a Go identifier').toEqual([]);
  });
}

test('CLI section headings are titles, not tokens', async ({ page }) => {
  await open(page, '/docs/cli/bot/', 'dark');
  const headings = await page.locator('.prose h3').allInnerTexts();
  expect(headings.length).toBeGreaterThan(0);
  for (const h of headings) expect(h.trim()[0], `heading "${h}"`).toMatch(/[A-Z`.]/);
  expect(await page.locator('.prose td code', { hasText: 'hanzo bot runs create' }).count()).toBe(
    0,
  );
  // The line under the title, and the previous/next cards, name a command as
  // code, not as backticks.
  const subtitle = page.locator('h1 + p').first();
  await expect(subtitle).not.toContainText('`');
  await expect(subtitle.locator('code')).toHaveText('hanzo bot');
  const cards = await page.locator('a p.truncate').allInnerTexts();
  expect(cards.length, 'previous/next cards').toBeGreaterThan(0);
  expect(
    cards.filter((c) => c.includes('`')),
    'cards printing backticks',
  ).toEqual([]);
});

// A redirect is a page the export writes from public/_redirects (see
// scripts/emit-redirects.ts); `next dev` serves no such page, so this one is
// read against a served export or the live site, not a dev server.
test('/docs/graph reaches the Graph page', async ({ page }) => {
  await page.goto('/docs/graph', { waitUntil: 'load' });
  await page.waitForURL(/\/docs\/openapi\/graph\/?$/, { timeout: 15_000 });
  await expect(page.locator('h1').first()).toHaveText('Graph');
});
