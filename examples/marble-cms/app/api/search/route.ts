import { source } from '@/lib/source';
import { createFromSource } from '@hanzo/docs/search/server';

export const { GET } = createFromSource(source, {
  language: 'english',
});
