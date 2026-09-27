'use client';

import { useState, type ReactNode } from 'react';
import { Text, XStack, YStack } from '@hanzo/gui';
import { ChevronDown } from '@hanzogui/lucide-icons-2';
import { useActiveAnchor, type TOCItemType } from '@hanzo/docs-core/toc';
import { BAR } from '@/components/shell';
import { loud, muted } from '@/lib/ink';

/**
 * "On this page", twice over: a column beside the article from 1280px up, and a
 * row under the bar below that, which opens to the same list. Both highlight the
 * one heading the reader is at, which docs-core's anchor observer decides.
 *
 * The column starts level with the page title and its label sits directly on
 * the list — a label with a gap under it reads as belonging to nothing.
 */
export const OUTLINE = 240;

export function Outline({ toc }: { toc: TOCItemType[] }) {
  const at = useActiveAnchor();
  return (
    <YStack
      render="nav"
      aria-label="On this page"
      position="sticky"
      t={BAR}
      width={OUTLINE}
      shrink={0}
      maxH={`calc(100dvh - ${BAR}px)`}
      pt={40}
      pb={24}
      pr={24}
      gap={10}
      $max-xl={{ display: 'none' }}
    >
      <Text fontSize="$2" lineHeight={18} fontWeight="500" color="$color12">
        On this page
      </Text>
      <YStack minH={0} overflowY="auto" borderLeftWidth={1} borderColor="$borderColor">
        <Items toc={toc} at={at} />
      </YStack>
    </YStack>
  );
}

export function Fold({ toc }: { toc: TOCItemType[] }) {
  const at = useActiveAnchor();
  const [open, setOpen] = useState(false);
  const current = toc.find((item) => item.url === `#${at}`);

  return (
    <YStack
      position="sticky"
      t={BAR}
      z={20}
      bg="$background"
      borderBottomWidth={1}
      borderColor="$borderColor"
      $xl={{ display: 'none' }}
    >
      <XStack
        render="button"
        type="button"
        aria-expanded={open}
        onPress={() => setOpen(!open)}
        height={44}
        px={48}
        gap={8}
        items="center"
        bg="transparent"
        borderWidth={0}
        cursor="pointer"
        $max-lg={{ px: 32 }}
        $max-md={{ px: 20 }}
      >
        <Text fontSize="$2" lineHeight={18} fontWeight="500" color="$color12" shrink={0}>
          On this page
        </Text>
        <Text flex={1} minW={0} fontSize="$2" lineHeight={18} {...muted} numberOfLines={1} text="left">
          {!open && current ? current.title : null}
        </Text>
        <YStack rotate={open ? '180deg' : '0deg'}>
          <ChevronDown size={14} color="$color10" />
        </YStack>
      </XStack>
      {open && (
        <YStack
          maxH="50vh"
          overflowY="auto"
          mx={48}
          mb={12}
          borderLeftWidth={1}
          borderColor="$borderColor"
          $max-lg={{ mx: 32 }}
          $max-md={{ mx: 20 }}
          onPress={() => setOpen(false)}
        >
          <Items toc={toc} at={at} />
        </YStack>
      )}
    </YStack>
  );
}

function Items({ toc, at }: { toc: TOCItemType[]; at: string | undefined }) {
  return (
    <>
      {toc.map((item) => (
        <Item key={item.url} item={item} on={item.url === `#${at}`} />
      ))}
    </>
  );
}

function Item({ item, on }: { item: TOCItemType; on: boolean }) {
  return (
    <Text
      render="a"
      href={item.url}
      ml={-1}
      py={5}
      pl={12 + Math.max(0, item.depth - 2) * 12}
      pr={4}
      fontSize="$2"
      lineHeight={18}
      borderLeftWidth={1}
      borderColor={on ? '$color12' : 'transparent'}
      {...(on ? loud : muted)}
      hoverStyle={{ color: '$color12' }}
    >
      {item.title as ReactNode}
    </Text>
  );
}
