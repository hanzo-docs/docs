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
      {
        test: {
          name: 'docs',
          root: './apps/docs',
          exclude: ['**/node_modules/**', '**/dist/**', 'content/docs/projects/**'],
        },
      },
    ],
  },
});
