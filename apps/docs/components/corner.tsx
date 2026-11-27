'use client';

import { usePathname, useRouter } from 'next/navigation';
import { XStack } from '@hanzo/gui';
import { DropdownMenu } from '@hanzo/ui';
import { useTheme } from '@hanzogui/next-theme';
import { HanzoMark } from '@hanzogui/shell';
import { useSearch } from '@/components/search';
import { useShell } from '@/components/shell';
import { twinPath } from '@/lib/twin';

/**
 * Floating bare @hanzo/logo H-ribbon mark in the bottom-right corner of the viewport
 * (no outer circle border/ring), matching hanzo.ai:
 * Ask Hanzo AI (⌘K), Hanzo Agent (⌘I), Discord #docs, contributor guide, Markdown copy, and theme toggle.
 */
export function Corner() {
  const pathname = usePathname();
  const router = useRouter();
  const search = useSearch();
  const { setAgentOpen } = useShell();
  const { resolvedTheme, setTheme } = useTheme();
  const md = twinPath(pathname);

  const go = (url: string) => window.open(url, '_blank', 'noopener,noreferrer');
  const copyMd = async () => {
    try {
      const text = await fetch(md).then((r) => r.text());
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard unavailable.
    }
  };

  return (
    <XStack position="fixed" b={16} r={16} z={40}>
      <DropdownMenu
        placement="top-end"
        minWidth={240}
        trigger={
          <XStack
            render="button"
            type="button"
            aria-label="Ask Hanzo AI and preferences"
            title="Ask Hanzo AI and preferences"
            p={4}
            items="center"
            justify="center"
            cursor="pointer"
            bg="transparent"
            borderWidth={0}
            color="$color12"
            opacity={0.78}
            hoverStyle={{ opacity: 1 }}
          >
            <HanzoMark size={22} animate brandMenu />
          </XStack>
        }
        items={[
          { type: 'label', label: 'Hanzo AI' },
          { key: 'search-ai', label: 'Ask Hanzo AI (⌘K)', onSelect: () => search.setOpen(true) },
          { key: 'agent', label: 'Open Hanzo Agent (⌘I)', onSelect: () => setAgentOpen(true) },
          { type: 'separator' },
          { type: 'label', label: 'Help & Community' },
          { key: 'discord', label: 'Ask in #docs on Discord', onSelect: () => go('https://discord.gg/XthHQQj') },
          { key: 'contribute', label: 'Contribute to docs', onSelect: () => router.push('/docs/contributing') },
          { key: 'issue', label: 'Report a docs issue', onSelect: () => go('https://github.com/hanzo-docs/docs/issues/new') },
          { key: 'copy-md', label: 'Copy page as Markdown (AI)', onSelect: () => void copyMd() },
          { key: 'status', label: 'System Status', onSelect: () => go('https://status.hanzo.ai') },
          { type: 'separator' },
          { type: 'label', label: 'Preferences' },
          {
            key: 'theme',
            label: resolvedTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
            onSelect: () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'),
          },
          { key: 'hanzo', label: 'Hanzo AI (hanzo.ai)', onSelect: () => go('https://hanzo.ai') },
        ]}
      />
    </XStack>
  );
}
