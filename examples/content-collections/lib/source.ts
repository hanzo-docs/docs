import { allDocs, allMetas } from 'content-collections';
import { loader } from '@hanzo/docs/core/source';
import { createMDXSource } from '@fumadocs/content-collections';

export const source = loader({
  baseUrl: '/docs',
  source: createMDXSource(allDocs, allMetas),
});
