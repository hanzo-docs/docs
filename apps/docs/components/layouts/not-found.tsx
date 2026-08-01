'use client';

import Link from '@hanzo/docs/core/link';
import { useDocsSearch } from '@hanzo/docs/core/search/client';
import { useEffect, useMemo } from 'react';
import { cn } from '@/lib/cn';
import { buttonVariants } from '@hanzo/docs-base-ui/components/ui/button';

// The page that was asked for and does not exist, answered out of the same
// corpus the dialog searches: one file, one index, two readers. A 404 on a
// static site is where the most people arrive knowing what they want, so it
// answers with pages rather than an apology.

/**
 * The words a URL is made of: `/docs/openapi/kv-store` -> `openapi kv store`.
 *
 * Slugs are the terms the pages were generated from, so the path someone typed
 * or followed is already a query.
 */
export function pathQuery(pathname: string): string {
  return pathname
    .split(/[/\-_.]+/)
    .filter((part) => part && part !== 'docs' && part !== 'index')
    .join(' ');
}

export function NotFound({ pathname }: { pathname?: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-4 p-8 [grid-area:main]">
      <h1 className="text-4xl font-bold font-mono">Not Found</h1>
      <div className="w-full border border-fd-foreground/50 border-dashed p-4 max-w-[600px]">
        <Alternatives pathname={pathname} />
      </div>
    </div>
  );
}

function Alternatives({ pathname }: { pathname?: string }) {
  // The exported 404 is one file serving every missing URL, so the path is only
  // known in the browser. A rendered page passes its own.
  const path = pathname ?? (typeof window === 'undefined' ? '' : window.location.pathname);
  const { setSearch, query } = useDocsSearch({
    type: 'flexsearch-static',
    from: '/v1/search',
  });

  useEffect(() => {
    setSearch(pathQuery(path));
  }, [path, setSearch]);

  // One row per page: a page matching in four of its sections is still one
  // place to go.
  const suggestions = useMemo(() => {
    if (!Array.isArray(query.data)) return [];
    const seen = new Set<string>();
    const out: { id: string; href: string; title: string }[] = [];

    for (const hit of query.data) {
      const href = hit.url.split('#')[0];
      if (seen.has(href)) continue;
      seen.add(href);
      out.push({ id: hit.id, href, title: stripMarks(hit.content) });
      if (out.length === 5) break;
    }

    return out;
  }, [query.data]);

  if (query.isLoading) {
    return <p className="text-sm text-fd-muted-foreground">Finding alternatives…</p>;
  }

  if (suggestions.length === 0) {
    return (
      <div>
        <p className="text-sm text-fd-muted-foreground mb-2">No alternative found</p>
        <Link href="/" className={cn(buttonVariants({ variant: 'secondary' }))}>
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-sm text-fd-muted-foreground mb-2">Maybe you are looking for</h2>

      <div className="flex flex-col rounded-lg border bg-fd-card text-fd-card-foreground shadow-md overflow-hidden divide-y divide-fd-border">
        {suggestions.map((doc) => (
          <Link
            key={doc.id}
            href={doc.href}
            className="inline-flex items-center justify-between gap-4 text-sm px-3 py-2 hover:bg-fd-accent hover:text-fd-accent-foreground"
          >
            <p className="font-medium text-nowrap">{doc.title}</p>
            <code className="text-fd-muted-foreground truncate">{doc.href}</code>
          </Link>
        ))}
      </div>
    </div>
  );
}

/** Results carry `<mark>` around what matched; a link label wants the words. */
function stripMarks(content: string): string {
  return content.replace(/<\/?mark>/g, '');
}
