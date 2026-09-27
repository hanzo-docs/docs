'use client';

import Link from 'next/link';
import { Text, XStack } from '@hanzo/gui';
import { HanzoMark } from '@hanzogui/shell';
import { muted } from '@/lib/ink';

/**
 * The name at the top left: the mark, "Hanzo AI", and which surface this is.
 *
 * hanzo.ai, hanzo.app and this site share the wordmark, so without "Docs" the
 * header is ambiguous the moment a reader arrives from search. It is the
 * company's name rather than "Hanzo" because the page documents several
 * products.
 */
export function Brand() {
  return (
    <XStack
      render={<Link href="/" prefetch={false} aria-label="Hanzo AI Docs, home" />}
      items="center"
      gap={8}
      minW={0}
    >
      <XStack color="$color12" shrink={0}>
        <HanzoMark size={18} title="Hanzo" />
      </XStack>
      <Text fontSize="$4" lineHeight={20} fontWeight="600" color="$color12" numberOfLines={1}>
        Hanzo AI
      </Text>
      <Text
        fontSize={11}
        lineHeight={16}
        fontWeight="500"
        {...muted}
        px={6}
        rounded={6}
        borderWidth={1}
        borderColor="$borderColor"
      >
        Docs
      </Text>
    </XStack>
  );
}
