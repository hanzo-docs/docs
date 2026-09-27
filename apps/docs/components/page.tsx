'use client';

import Link from 'next/link';
import { Fragment, type ReactNode } from 'react';
import { Text, XStack, YStack } from '@hanzo/gui';
import { AnchorProvider, type TOCItemType } from '@hanzo/docs-core/toc';
import { Agent } from '@/components/agent';
import { Fold, OUTLINE, Outline } from '@/components/toc';
import { muted } from '@/lib/ink';

/** The widest the article gets, padding included; the outline sits beside it. */
const ARTICLE = 880;

export interface Crumb {
  name: ReactNode;
  url?: string;
}

export interface Turn {
  name: ReactNode;
  url: string;
}

/**
 * A docs page: where it sits, its title and description, the body, and the way
 * on. The title is the frontmatter's and it is printed once, here — a body that
 * opens with its own `# heading` has it dropped at compile time
 * (`lib/remark-title.ts`), so no page says its name twice.
 */
export function Page({
  title,
  description,
  crumbs,
  toc,
  previous,
  next,
  updated,
  children,
}: {
  title: ReactNode;
  description?: ReactNode;
  crumbs: Crumb[];
  toc: TOCItemType[];
  previous?: Turn;
  next?: Turn;
  /** Already formatted on the server, so both renders print the same string. */
  updated?: string;
  children: ReactNode;
}) {
  const outlined = toc.length > 0;

  return (
    <AnchorProvider toc={toc} single>
      <XStack width="100%" maxW={ARTICLE + (outlined ? OUTLINE : 0)} self="center" items="flex-start">
        <YStack flex={1} minW={0}>
          {outlined && <Fold toc={toc} />}
          <YStack
            render="article"
            px={48}
            pt={40}
            pb={80}
            $max-lg={{ px: 32 }}
            $max-md={{ px: 20, pt: 24, pb: 56 }}
          >
            <YStack gap={10} pb={28} mb={32} borderBottomWidth={1} borderColor="$borderColor">
              {crumbs.length > 0 && <Crumbs crumbs={crumbs} />}
              <XStack items="flex-start" gap={16}>
                <Text
                  render="h1"
                  flex={1}
                  minW={0}
                  fontSize={32}
                  lineHeight={40}
                  fontWeight="600"
                  letterSpacing={-0.6}
                  color="$color12"
                  $max-md={{ fontSize: 28, lineHeight: 34 }}
                >
                  {title}
                </Text>
                <XStack pt={4} shrink={0}>
                  <Agent />
                </XStack>
              </XStack>
              {description ? (
                <Text render="p" fontSize={17} lineHeight={27} {...muted}>
                  {description}
                </Text>
              ) : null}
            </YStack>

            {children}

            {(previous || next) && (
              <XStack gap={12} mt={56} $max-sm={{ flexDirection: 'column' }}>
                {previous ? <Step turn={previous} way="Previous" /> : <YStack flex={1} />}
                {next ? <Step turn={next} way="Next" /> : <YStack flex={1} />}
              </XStack>
            )}
            {updated && (
              <Text mt={24} fontSize="$2" {...muted}>
                Last updated {updated}
              </Text>
            )}
          </YStack>
        </YStack>
        {outlined && <Outline toc={toc} />}
      </XStack>
    </AnchorProvider>
  );
}

function Crumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <XStack render="nav" aria-label="Breadcrumb" flexWrap="wrap" items="center" gap={6}>
      {crumbs.map((crumb, i) => (
        <Fragment key={i}>
          {i > 0 && (
            <Text fontSize="$2" {...muted} aria-hidden>
              /
            </Text>
          )}
          {crumb.url ? (
            <Text
              render={<Link href={crumb.url} prefetch={false} />}
              fontSize="$2"
              {...muted}
              hoverStyle={{ color: '$color12' }}
            >
              {crumb.name}
            </Text>
          ) : (
            <Text fontSize="$2" {...muted}>
              {crumb.name}
            </Text>
          )}
        </Fragment>
      ))}
    </XStack>
  );
}

function Step({ turn, way }: { turn: Turn; way: 'Previous' | 'Next' }) {
  const end = way === 'Next';
  return (
    <YStack
      render={<Link href={turn.url} prefetch={false} />}
      flex={1}
      minW={0}
      gap={4}
      px={16}
      py={14}
      rounded="$5"
      borderWidth={1}
      borderColor="$borderColor"
      items={end ? 'flex-end' : 'flex-start'}
      hoverStyle={{ bg: '$hover' }}
    >
      <Text fontSize="$1" lineHeight={16} {...muted}>
        {way}
      </Text>
      <Text fontSize="$3" lineHeight={20} fontWeight="500" color="$color12" text={end ? 'right' : 'left'}>
        {turn.name}
      </Text>
    </YStack>
  );
}
