'use client';

import { createContext, use, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { XStack, YStack } from '@hanzo/gui';
import { AgentPanel } from '@/components/agent-panel';
import { Bar } from '@/components/bar';
import { Corner } from '@/components/corner';
import { Footer } from '@/components/footer';
import { Rail } from '@/components/rail';

/**
 * The frame every docs page sits in: the rail on the left, a column holding
 * the bar and the page, and the collapsible Hanzo Agent sidebar on the right.
 *
 * State shared across the shell:
 * - `collapsed`: hides the desktop left rail; the bar carries the restore button.
 * - `open`: the mobile navigation drawer.
 * - `agentOpen`: toggles the integrated Hanzo Agent right panel (`⌘I` / `Ctrl+I`
 *   or the top-bar `Ask AI` button).
 * - `askAgent(prompt)`: opens the Hanzo Agent panel and immediately asks `prompt`.
 */
interface Shell {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  agentOpen: boolean;
  setAgentOpen: (v: boolean) => void;
  pendingPrompt: string | null;
  askAgent: (prompt: string) => void;
  consumePendingPrompt: () => string | null;
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
  const [agentOpen, setAgentOpen] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);
  const pathname = usePathname();

  // A link followed from the mobile drawer lands on its page with the drawer shut.
  useEffect(() => setOpen(false), [pathname]);

  // Global `⌘I` / `Ctrl+I` toggles the integrated Hanzo Agent panel, and
  // `hanzo:ask-agent` lets Finder (`⌘K`, mounted above Shell) hand off a query.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'i') {
        e.preventDefault();
        setAgentOpen((v) => !v);
      }
    };
    const onAsk = (e: Event) => {
      const prompt = (e as CustomEvent<string>).detail;
      if (typeof prompt === 'string' && prompt.trim()) {
        setPendingPrompt(prompt.trim());
        setAgentOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('hanzo:ask-agent', onAsk);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('hanzo:ask-agent', onAsk);
    };
  }, []);

  const askAgent = useCallback((prompt: string) => {
    setPendingPrompt(prompt);
    setAgentOpen(true);
  }, []);

  const consumePendingPrompt = useCallback(() => {
    const current = pendingPrompt;
    setPendingPrompt(null);
    return current;
  }, [pendingPrompt]);

  const value = useMemo(
    () => ({
      collapsed,
      setCollapsed,
      open,
      setOpen,
      agentOpen,
      setAgentOpen,
      pendingPrompt,
      askAgent,
      consumePendingPrompt,
    }),
    [collapsed, open, agentOpen, pendingPrompt, askAgent, consumePendingPrompt],
  );

  return (
    <Context value={value}>
      <XStack minH="100dvh" items="flex-start" bg="$background">
        <Rail />
        <YStack flex={1} minW={0} self="stretch" minH="100dvh">
          <Bar />
          {/* Grows to fill a short page, never shrinks below its content. flex={1}
              is `1 1 0px` in @hanzo/gui and a view has no content minimum, so the
              page got only what the bar and the footer left of one screen, and
              the footer drew over it. */}
          <YStack grow={1} shrink={0} minW={0}>
            {children}
          </YStack>
          <Footer />
        </YStack>
        <AgentPanel />
        {!agentOpen && <Corner />}
      </XStack>
    </Context>
  );
}
