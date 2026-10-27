'use client';

import { useEffect } from 'react';
import { modelContext, register, tools } from '@/lib/webmcp';

/**
 * Registers the docs' WebMCP tools (lib/webmcp) on every page, where the
 * browser offers a model context. The search index loads on the first search,
 * not with the page.
 */
export function WebMCP() {
  useEffect(() => {
    const ctx = modelContext();
    if (!ctx) return;
    const done = new AbortController();
    const search = async (query: string) => {
      const { flexsearchStaticClient } = await import('@hanzo/docs-core/search/client/flexsearch-static');
      return flexsearchStaticClient({ from: '/v1/search' }).search(query);
    };
    register(ctx, tools({ search, fetch: window.fetch.bind(window), origin: window.location.origin }), done.signal);
    return () => done.abort();
  }, []);
  return null;
}
