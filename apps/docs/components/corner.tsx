'use client';

import { usePathname, useRouter } from 'next/navigation';
import { XStack } from '@hanzo/gui';
import { DropdownMenu } from '@hanzo/ui';
import { useTheme } from '@hanzogui/next-theme';
import { HanzoMark } from '@hanzogui/shell';
import { twinPath } from '@/lib/twin';

/**
 * Floating H mark in the bottom-right corner of the viewport, matching hanzo.ai:
 * Help, Discord #docs, contributor guide, Markdown copy, and theme toggle.
 */
export function Corner() {
  const pathname = usePathname();
  const router = useRouter();
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
    <XStack position="fixed" b={14} r={14} z={40}>
      <DropdownMenu
        placement="top-end"
        minWidth={236}
        trigger={
          <XStack
            render="button"
            type="button"
            aria-label="Help and preferences"
            title="Help and preferences"
            width={36}
            height={36}
            rounded={999}
            items="center"
            justify="center"
            cursor="pointer"
            bg="$panel"
            borderWidth={1}
            borderColor="$borderColor"
            opacity={0.9}
            hoverStyle={{ opacity: 1, borderColor: '$color8', bg: '$hover' }}
          >
            <HanzoMark size={20} animate brandMenu />
          </XStack>
        }
        items={[
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
