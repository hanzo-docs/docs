'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Text, XStack } from '@hanzo/gui';
import { Menu, PanelLeft } from '@hanzogui/lucide-icons-2';
import { Org, Short } from '@/components/account';
import { Tool } from '@/components/action';
import { Brand } from '@/components/brand';
import { BAR, useShell } from '@/components/shell';
import { lit, nav } from '@/lib/nav';
import { loud, muted } from '@/lib/ink';

/**
 * The bar across the top of the page column.
 *
 * Desktop: the section links, and on the right the org you act in. While the
 * rail is folded away the bar carries the control that brings it back and the
 * account, since the rail's foot is not on screen.
 *
 * Phone: the menu that opens the rail as a drawer, the name, and the key. The
 * links live in the drawer there.
 */
export function Bar() {
  const { collapsed, setCollapsed, setOpen } = useShell();
  const pathname = usePathname();

  return (
    <XStack
      render="header"
      position="sticky"
      t={0}
      z={30}
      height={BAR}
      shrink={0}
      px={24}
      gap={12}
      items="center"
      borderBottomWidth={1}
      borderColor="$borderColor"
      bg="$background"
      $max-md={{ px: 12, gap: 8 }}
    >
      <XStack items="center" gap={6} minW={0} $md={{ display: 'none' }}>
        <Tool label="Open navigation" onPress={() => setOpen(true)}>
          <Menu size={18} color="$color11" />
        </Tool>
        <Brand />
      </XStack>

      {collapsed && (
        <XStack items="center" gap={10} mr={8} $max-md={{ display: 'none' }}>
          <Tool label="Show sidebar" onPress={() => setCollapsed(false)}>
            <PanelLeft size={16} color="$color10" />
          </Tool>
          <Brand />
        </XStack>
      )}

      <XStack render="nav" aria-label="Sections" flex={1} minW={0} gap={2} items="center" $max-md={{ display: 'none' }}>
        {nav.map((item) => {
          const on = lit(item, pathname);
          return (
            <Text
              key={item.url}
              render={<Link href={item.url} prefetch={false} />}
              aria-current={on ? 'page' : undefined}
              fontSize="$2"
              lineHeight={18}
              fontWeight={on ? '500' : '400'}
              px={10}
              py={6}
              rounded="$3"
              {...(on ? loud : muted)}
              hoverStyle={{ color: '$color12' }}
            >
              {item.text}
            </Text>
          );
        })}
      </XStack>

      <XStack flex={1} $md={{ display: 'none' }} />

      <XStack items="center" gap={10} shrink={0}>
        <Org />
        <XStack display={collapsed ? 'flex' : 'none'} $max-md={{ display: 'flex' }}>
          <Short />
        </XStack>
      </XStack>
    </XStack>
  );
}
