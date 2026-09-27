'use client';

import Link from 'next/link';
import { Text, YStack } from '@hanzo/gui';
import { muted } from '@/lib/ink';

/**
 * The 404 body. The export writes it once, as 404.html, and the edge serves it
 * for any address the site does not hold, so the likely destinations are a
 * fixed list rather than a guess about the address that missed.
 */
export function Missing({ suggestions }: { suggestions: { href: string; title: string }[] }) {
  return (
    <YStack items="center" gap={14} px={20} py={72}>
      <Text render="h1" fontSize={32} lineHeight={40} fontWeight="600" color="$color12" letterSpacing={-0.6}>
        Page not found
      </Text>
      <Text fontSize="$3" text="center" whiteSpace="normal" {...muted}>
        Nothing is published at this address. Search the docs from the rail, or start here.
      </Text>
      <YStack
        width="100%"
        maxW={520}
        mt={10}
        rounded="$5"
        borderWidth={1}
        borderColor="$borderColor"
        bg="$panel"
        overflow="hidden"
      >
        {suggestions.map((s, i) => (
          <YStack
            key={s.href}
            render={<Link href={s.href} prefetch={false} />}
            flexDirection="row"
            justify="space-between"
            items="center"
            gap={16}
            px={14}
            py={11}
            borderTopWidth={i ? 1 : 0}
            borderColor="$borderColor"
            hoverStyle={{ bg: '$hover' }}
          >
            <Text fontSize="$3" fontWeight="500" color="$color12">
              {s.title}
            </Text>
            <Text fontFamily="$mono" fontSize={12} numberOfLines={1} {...muted}>
              {s.href}
            </Text>
          </YStack>
        ))}
      </YStack>
    </YStack>
  );
}
