import env from '@next/env';
import { updateSearchIndexes } from './update-hanzo-index';
import { emit as emitRedirects } from './emit-redirects';
import { check as checkLinks } from './check-links';

env.loadEnvConfig(process.cwd());

// Push the freshly-built page set into Hanzo Search.
//
// This used to `await import('./update-orama-index.ts')`, which has thrown
// MODULE_NOT_FOUND on every build since Orama was replaced by Hanzo Search and
// lib/orama was deleted. The throw landed in the catch below, so the build went
// green and the index quietly stopped being updated. One indexer, imported
// statically — a missing one is now a type error, not a runtime surprise.
async function main() {
  // Before indexing: a redirect page is part of the export, and indexing is
  // allowed to fail without taking the deploy down.
  emitRedirects();
  // After the redirects, because a stub IS a page a link may point at. Reports,
  // never refuses: this build has already produced the site, and a link that
  // rotted since the last one is a thing to fix, not a reason to stop shipping
  // the other 2,900 pages.
  checkLinks();
  await updateSearchIndexes();
}

// Indexing is downstream of the export: a search outage must not stop a deploy.
await main().catch((e) => {
  console.error('Failed to run post build script', e);
});
