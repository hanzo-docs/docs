'use client';

import { createContext, use, useMemo, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import type * as PageTree from '@hanzo/docs-core/page-tree';
import { searchNearestPath, searchPath } from '@hanzo/docs-core/breadcrumb';

/**
 * The page tree the chrome draws, and where the reader is in it.
 *
 * `path` runs from the top of the tree to the page being read. A generated
 * operation page is not in the tree, so it borrows the path of the nearest page
 * above it (its product page) — the rail then opens where that page opens.
 */
interface Tree {
  tree: PageTree.Root;
  path: PageTree.Node[];
}

const Context = createContext<Tree | null>(null);

export function TreeProvider({ tree, children }: { tree: PageTree.Root; children: ReactNode }) {
  const pathname = usePathname();
  const path = useMemo(
    () => searchPath(tree.children, pathname) ?? searchNearestPath(tree.children, pathname) ?? [],
    [tree, pathname],
  );

  return <Context value={useMemo(() => ({ tree, path }), [tree, path])}>{children}</Context>;
}

export function useTree(): Tree {
  const tree = use(Context);
  if (!tree) throw new Error('useTree needs <TreeProvider> above it');
  return tree;
}

/** `/docs/a/` and `/docs/a` are one page. */
export function same(href: string, pathname: string): boolean {
  const trim = (s: string) => (s.length > 1 && s.endsWith('/') ? s.slice(0, -1) : s);
  return trim(href) === trim(pathname);
}
