import { createFromSource } from '@hanzo/docs/search/server';
import { source } from '@/lib/source';

export const { GET } = createFromSource(source);
