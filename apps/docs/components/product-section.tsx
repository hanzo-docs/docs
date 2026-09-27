'use client';

import Link from 'next/link';
import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';
import { Text, XStack, YStack } from '@hanzo/gui';
import { Figure, Pre } from '@/components/mdx/code';
import { Small, flow } from '@/components/mdx/prose';
import { muted } from '@/lib/ink';

/** One product inside a domain: the name a reader would search for, and its page. */
export interface ProductLink {
  name: string;
  href: string;
}

/**
 * One domain on the docs home: what it is on the left (its name, one sentence,
 * the next step), how to touch it on the right (the shortest true call, every
 * product in it). Stacked on a phone. Hairlines between sections are the
 * layout, so no section guesses its own margin.
 */
export function ProductSection({
  title,
  href,
  children,
  snippet,
  action,
  links,
  first = false,
}: {
  /** Set by ProductSections on the first one, which starts flush with no rule. */
  first?: boolean;
  title: string;
  href: string;
  children: ReactNode;
  /** The shortest true call into this domain — one runnable line, or nothing. */
  snippet?: string;
  action?: { label: string; href: string };
  links?: ProductLink[];
}) {
  return (
    <XStack
      render="section"
      gap={40}
      pt={first ? 0 : 32}
      pb={32}
      borderTopWidth={first ? 0 : 1}
      borderColor="$borderColor"
      $max-md={{ flexDirection: 'column', gap: 18 }}
    >
      <YStack width={300} shrink={0} gap={8} $max-md={{ width: '100%' }}>
        <Text render={<Link href={href} prefetch={false} />} fontSize={18} lineHeight={26} fontWeight="600" color="$color12" hoverStyle={{ textDecorationLine: 'underline' }}>
          {title}
        </Text>
        {/* A div: MDX hands multi-line children over wrapped in a <p>. */}
        <YStack gap={8}>
          <Small value>{flow(children, 'small')}</Small>
        </YStack>
        {action ? (
          <Text render={<Link href={action.href} prefetch={false} />} fontSize="$3" fontWeight="500" color="$color12" hoverStyle={{ textDecorationLine: 'underline' }}>
            {action.label} →
          </Text>
        ) : null}
      </YStack>

      <YStack flex={1} minW={0} gap={16}>
        {snippet ? (
          <Figure>
            <Pre>
              <code>{snippet}</code>
            </Pre>
          </Figure>
        ) : null}
        {links?.length ? (
          <XStack render="ul" flexWrap="wrap" items="center" rowGap={8} style={{ listStyleType: 'none' }}>
            {links.map((l, i) => (
              <XStack key={l.href} render="li" items="center">
                {i > 0 ? (
                  <Text aria-hidden mx={8} color="$color8">
                    ·
                  </Text>
                ) : null}
                <Text render={<Link href={l.href} prefetch={false} />} fontSize="$3" {...muted} hoverStyle={{ color: '$color12' }}>
                  {l.name}
                </Text>
              </XStack>
            ))}
          </XStack>
        ) : null}
      </YStack>
    </XStack>
  );
}

/** The sections, one after another; the first starts flush under its heading. */
export function ProductSections({ children }: { children: ReactNode }) {
  let at = 0;
  return (
    <YStack>
      {Children.map(children, (child) =>
        isValidElement(child) ? cloneElement(child as ReactElement<{ first?: boolean }>, { first: at++ === 0 }) : child,
      )}
    </YStack>
  );
}
