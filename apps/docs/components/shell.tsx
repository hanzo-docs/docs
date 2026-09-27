'use client';

import { createContext, use, useEffect, useMemo, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { XStack, YStack } from '@hanzo/gui';
import { Bar } from '@/components/bar';
import { Rail } from '@/components/rail';

/**
 * The frame every docs page sits in: the rail on the left, and a column holding
 * the bar and the page.
 *
 * Two pieces of state live here because the rail and the bar both read them.
 * `collapsed` hides the desktop rail; the bar then carries the control that
 * brings it back. `open` is the phone drawer. Both start closed on the server
 * and the client alike, and every width decision is a media query, so the
 * markup a phone hydrates is the markup the export wrote.
 */
interface Shell {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
}

const Context = createContext<Shell | null>(null);

export function useShell(): Shell {
  const shell = use(Context);
  if (!shell) throw new Error('useShell needs <Shell> above it');
  return shell;
}

/** Width of the desktop rail, and height of the bar. The page and the TOC read both. */
export const RAIL = 264;
export const BAR = 56;

export function Shell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // A link followed from the drawer lands on its page with the drawer shut.
  useEffect(() => setOpen(false), [pathname]);

  const value = useMemo(() => ({ collapsed, setCollapsed, open, setOpen }), [collapsed, open]);

  return (
    <Context value={value}>
      <XStack minH="100dvh" items="flex-start" bg="$background">
        <Rail />
        <YStack flex={1} minW={0} self="stretch">
          <Bar />
          {children}
        </YStack>
      </XStack>
    </Context>
  );
}
