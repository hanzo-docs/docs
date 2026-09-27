'use client';

import dynamic from 'next/dynamic';
import { createContext, use, useEffect, useMemo, useState, type ReactNode } from 'react';

/**
 * Search: one dialog, opened from the rail's field or with ⌘K / Ctrl+K from
 * anywhere. The dialog and its index client load the first time it opens, so a
 * reader who never searches never downloads either.
 */
interface Search {
  open: boolean;
  setOpen: (v: boolean) => void;
}

const Context = createContext<Search>({ open: false, setOpen: () => undefined });

export function useSearch(): Search {
  return use(Context);
}

const Finder = dynamic(() => import('@/components/finder'), { ssr: false });

export function SearchProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [wanted, setWanted] = useState(false);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setWanted(true);
        setOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, []);

  const value = useMemo(
    () => ({
      open,
      setOpen: (v: boolean) => {
        if (v) setWanted(true);
        setOpen(v);
      },
    }),
    [open],
  );

  return (
    <Context value={value}>
      {children}
      {wanted && <Finder open={open} onOpenChange={setOpen} />}
    </Context>
  );
}
