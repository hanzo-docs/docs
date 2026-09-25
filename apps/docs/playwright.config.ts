import { defineConfig, devices } from '@playwright/test';

// The rendered site, checked in a browser. Everything under scripts/ checks the
// generated MDX; these check what a reader actually sees once the theme, the
// cascade and the layout have had their say — which is where the sidebar's
// primary button went white-on-white and the table of contents came apart,
// with every generated file correct.
//
// DOCS_URL picks the site: a dev server, a served export (`npx serve out`), or
// https://docs.hanzo.ai itself, read-only.
export default defineConfig({
  testDir: 'e2e',
  timeout: 120_000,
  fullyParallel: true,
  workers: 2,
  reporter: 'list',
  use: {
    baseURL: process.env.DOCS_URL ?? 'http://localhost:3000',
    ...devices['Desktop Chrome'],
    viewport: { width: 1440, height: 900 },
  },
});
