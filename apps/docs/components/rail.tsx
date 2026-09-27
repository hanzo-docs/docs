'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Text, XStack, YStack } from '@hanzo/gui';
import { Moon, PanelLeft, Search, Sun, X } from '@hanzogui/lucide-icons-2';
import { useThemeSetting } from '@hanzogui/next-theme';
import { Sheet, SheetContent, SheetTitle } from '@hanzo/ui';
import { useSearchContext } from '@hanzo/docs-base-ui/contexts/search';
import { Account } from '@/components/account';
import { Tool } from '@/components/action';
import { Brand } from '@/components/brand';
import { BAR, RAIL, useShell } from '@/components/shell';
import { Tree } from '@/components/tree';
import { lit, nav } from '@/lib/nav';
import { loud, muted } from '@/lib/ink';

/**
 * The rail: the name, search, the tree, and the account, top to bottom. The
 * tree scrolls between a pinned head and a pinned foot, so the account is
 * always in reach however long the section.
 *
 * On a desktop it is a sticky column the reader can fold away. Below 768px it is
 * the same panel in a drawer, opened from the bar, and it also carries the top
 * nav, which the bar has no room for there.
 */
export function Rail() {
  const { collapsed, setCollapsed, open, setOpen } = useShell();

  return (
    <>
      <YStack
        render="aside"
        aria-label="Documentation"
        position="sticky"
        t={0}
        height="100dvh"
        width={RAIL}
        shrink={0}
        borderRightWidth={1}
        borderColor="$borderColor"
        bg="$background"
        display={collapsed ? 'none' : 'flex'}
        $max-md={{ display: 'none' }}
      >
        <Panel close={<Tool label="Collapse sidebar" onPress={() => setCollapsed(true)}><PanelLeft size={16} color="$color10" /></Tool>} />
      </YStack>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          showCloseButton={false}
          p={0}
          gap={0}
          width="88%"
          maxW={340}
          rounded={0}
          borderWidth={0}
          borderRightWidth={1}
          borderColor="$borderColor"
        >
          <SheetTitle position="absolute" width={1} height={1} overflow="hidden" opacity={0}>
            Navigation
          </SheetTitle>
          <Panel drawer close={<Tool label="Close navigation" onPress={() => setOpen(false)}><X size={16} color="$color10" /></Tool>} />
        </SheetContent>
      </Sheet>
    </>
  );
}

function Panel({ drawer = false, close }: { drawer?: boolean; close: React.ReactNode }) {
  const scroller = useRef<HTMLElement>(null);
  const pathname = usePathname();

  // Bring the page being read into the tree's view, inside the rail only — the
  // document itself never moves for it.
  useEffect(() => {
    const box = scroller.current;
    const row = box?.querySelector<HTMLElement>('[data-active="true"]');
    if (!box || !row) return;
    const b = box.getBoundingClientRect();
    const r = row.getBoundingClientRect();
    if (r.top < b.top || r.bottom > b.bottom) box.scrollTop += r.top - b.top - b.height / 3;
  }, [pathname]);

  return (
    <YStack flex={1} minH={0} height="100%">
      <XStack height={BAR} px={16} pr={10} gap={8} items="center" justify="space-between" shrink={0}>
        <Brand />
        {close}
      </XStack>

      <YStack px={12} pb={8} gap={10} shrink={0}>
        <Find drawer={drawer} />
        {drawer && <Links />}
      </YStack>

      <YStack
        ref={scroller as never}
        flex={1}
        minH={0}
        overflowY="auto"
        px={12}
        py={8}
      >
        <Tree />
      </YStack>

      <YStack shrink={0} px={12} pt={12} pb={12} gap={10} borderTopWidth={1} borderColor="$borderColor">
        <Account />
        <XStack items="center" justify="space-between">
          <Text
            render={<Link href="/docs/support" prefetch={false} />}
            fontSize="$2"
            {...muted}
            px={4}
            hoverStyle={{ color: '$color12' }}
          >
            Help
          </Text>
          <Theme />
        </XStack>
      </YStack>
    </YStack>
  );
}

/**
 * The one way to search: the same dialog ⌘K opens, wearing the shape of a field.
 * A button, not an input — an input would swallow the first keystrokes before
 * the dialog mounted.
 */
function Find({ drawer }: { drawer: boolean }) {
  const { setOpenSearch } = useSearchContext();
  const { setOpen } = useShell();

  return (
    <XStack
      render="button"
      type="button"
      onPress={() => {
        if (drawer) setOpen(false);
        setOpenSearch(true);
      }}
      height={36}
      px={10}
      gap={8}
      rounded="$3"
      items="center"
      borderWidth={1}
      borderColor="$borderColor"
      bg="$panel"
      cursor="pointer"
      hoverStyle={{ bg: '$hover' }}
    >
      <Search size={15} color="$color10" />
      <Text flex={1} fontSize="$2" {...muted} text="left">
        Search or ask AI
      </Text>
      <Text
        fontSize={11}
        lineHeight={16}
        {...muted}
        px={5}
        rounded={4}
        borderWidth={1}
        borderColor="$borderColor"
        $max-md={{ display: 'none' }}
      >
        ⌘K
      </Text>
    </XStack>
  );
}

/** The top nav, for the drawer, where the bar has no room for it. */
function Links() {
  const pathname = usePathname();
  return (
    <XStack render="nav" aria-label="Sections" flexWrap="wrap" gap={6}>
      {nav.map((item) => {
        const on = lit(item, pathname);
        return (
          <Text
            key={item.url}
            render={<Link href={item.url} prefetch={false} />}
            aria-current={on ? 'page' : undefined}
            fontSize="$2"
            lineHeight={18}
            px={10}
            py={5}
            rounded={999}
            borderWidth={1}
            borderColor={on ? '$color12' : '$borderColor'}
            {...(on ? loud : muted)}
          >
            {item.text}
          </Text>
        );
      })}
    </XStack>
  );
}

/** Light or dark. The class on <html> is the one authority; this flips it. */
function Theme() {
  const { resolvedTheme, set } = useThemeSetting();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const dark = !ready || resolvedTheme !== 'light';

  return (
    <Tool label={dark ? 'Switch to light theme' : 'Switch to dark theme'} onPress={() => set(dark ? 'light' : 'dark')}>
      {dark ? <Sun size={16} color="$color10" /> : <Moon size={16} color="$color10" />}
    </Tool>
  );
}
