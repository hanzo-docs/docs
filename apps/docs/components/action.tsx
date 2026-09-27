'use client';

import type { ComponentProps, ReactNode } from 'react';
import { Text, XStack } from '@hanzo/gui';
import { muted } from '@/lib/ink';

/**
 * The two controls the chrome is made of.
 *
 * `Action` is a labelled button or link. Its tone is one of three:
 *
 *   loud   the one filled control on a surface — the foreground as the fill and
 *          the ground as the label, so the pair inverts with the theme and the
 *          label can never sit on a fill of its own colour
 *   quiet  a label that lights a surface under the pointer
 *   line   the same, with a hairline edge
 *
 * `Tool` is an icon-only square. Both take `render` to become a link, and a
 * label, which a `Tool` has no other way to carry.
 */
type Tone = 'loud' | 'quiet' | 'line';

const FRAME = {
  loud: { bg: '$color12', borderColor: '$color12', hoverStyle: { opacity: 0.86 } },
  quiet: { bg: 'transparent', borderColor: 'transparent', hoverStyle: { bg: '$hover' } },
  line: { bg: 'transparent', borderColor: '$borderColor', hoverStyle: { bg: '$hover' } },
} as const;

const INK = { loud: { color: '$background' }, quiet: muted, line: muted } as const;

const RING = {
  outlineWidth: 2,
  outlineStyle: 'solid',
  outlineColor: '$outlineColor',
  outlineOffset: 2,
} as const;

export function Action({
  tone = 'quiet',
  children,
  ...props
}: Omit<ComponentProps<typeof XStack>, 'children'> & { tone?: Tone; children: ReactNode }) {
  return (
    <XStack
      height={32}
      px={12}
      gap={6}
      rounded="$3"
      borderWidth={1}
      items="center"
      justify="center"
      cursor="pointer"
      focusVisibleStyle={RING}
      {...FRAME[tone]}
      {...props}
    >
      {typeof children === 'string' ? (
        <Text fontSize="$2" lineHeight={18} fontWeight="500" {...INK[tone]} numberOfLines={1}>
          {children}
        </Text>
      ) : (
        children
      )}
    </XStack>
  );
}

export function Tool({
  label,
  children,
  ...props
}: Omit<ComponentProps<typeof XStack>, 'children'> & { label: string; children: ReactNode }) {
  return (
    <XStack
      render="button"
      aria-label={label}
      title={label}
      width={32}
      height={32}
      shrink={0}
      rounded="$3"
      items="center"
      justify="center"
      cursor="pointer"
      bg="transparent"
      borderWidth={0}
      hoverStyle={{ bg: '$hover' }}
      focusVisibleStyle={RING}
      {...props}
    >
      {children}
    </XStack>
  );
}
