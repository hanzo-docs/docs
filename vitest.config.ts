import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      'packages/*',
      // `apps/docs` and not `apps/*`: apps/platform/e2e holds Playwright specs,
      // which are not vitest's to run.
      //
      // Spelled as a config rather than a path because of the exclude: the docs
      // app carries content/docs/projects, a MIRROR of other repos' docs, and
      // some of those repos ship their tutorial code — tests included, which
      // expect that repo's fixtures and working directory. Running them here
      // reported a red suite for two eslint tutorials that were never ours and
      // that nothing in this repo can fix. We publish those pages; we do not own
      // their test runs.
      //
      // `e2e/` is Playwright's (`pnpm --filter docs test:e2e`): those specs
      // drive a browser against a running site, which vitest has no way to give
      // them.
      {
        test: {
          name: 'docs',
          root: './apps/docs',
          exclude: ['**/node_modules/**', '**/dist/**', 'content/docs/projects/**', 'e2e/**'],
          // Several tests parse the whole API document. A sandboxed CI runner
          // takes longer than vitest's 5s default for that; a minute still
          // catches a test that hangs.
          testTimeout: 60_000,
        },
      },
      // The bot docs' converter, and nothing under content/: those pages are
      // the bot repo's, converted, not code.
      {
        test: {
          name: 'bot-docs',
          root: './apps/bot-docs',
          include: ['scripts/**/*.test.ts'],
        },
      },
    ],
  },
});
