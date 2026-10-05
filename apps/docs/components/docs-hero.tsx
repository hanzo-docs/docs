'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { Text, XStack, YStack } from '@hanzo/gui';
import { Action } from '@/components/action';
import { muted } from '@/lib/ink';

// The masthead. Three doors, one model, and nothing else above the fold.
//
// A developer arriving here is answering one question — "how do I start?" — and
// there are exactly three honest answers, in descending order of how much code
// they want to write: describe it to the app, tell Dev in a terminal, or call the
// API yourself. Everything else on this page is downstream of that choice, so the
// choice is the only thing offered up top.
//
// The doors are TABS, not just links. Picking one swaps the panel below to that
// path's real first step — the actual prompt, the actual command, the actual
// request. A reader can compare all three without leaving the page or committing,
// which is the whole point: the doors differ in how much you type, and showing
// that is more honest than three paragraphs claiming it.
//
// Monochrome, because Hanzo's tokens are (--color-brand is hsl(0,0%,96%) on
// hsl(0,0%,4%)). Nothing here introduces a hue the rest of the site does not use;
// the only emphasis available is weight, border and motion, so those carry it.

/** A door: what it is, where it leads, and its first step, already highlighted (components/hero.tsx). */
export interface Door {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  external: boolean;
  cta: string;
  lang: string;
  sample: ReactNode;
}

// No title of its own: the page header above it prints the page's title and
// description, and a hero that printed them again made /docs say its name twice.
export function DocsHero({ doors }: { doors: Door[] }) {
  const [active, setActive] = useState<string>(doors[0].id);
  const path = doors.find((d) => d.id === active) ?? doors[0];

  return (
    <YStack gap={16}>
      {/* The three doors. Each is a tab: hovering or focusing selects it, so the
          panel below follows the pointer and a reader compares paths by moving
          across them rather than by clicking three times. */}
      <XStack gap={12} $max-sm={{ flexDirection: 'column' }}>
        {doors.map((d) => {
          const on = d.id === active;
          return (
            <YStack
              key={d.id}
              render="button"
              type="button"
              onHoverIn={() => setActive(d.id)}
              onFocus={() => setActive(d.id)}
              onPress={() => setActive(d.id)}
              aria-pressed={on}
              flex={1}
              gap={6}
              p={18}
              rounded="$5"
              borderWidth={1}
              borderColor={on ? '$color8' : '$borderColor'}
              bg={on ? '$hover' : '$panel'}
              items="flex-start"
              cursor="pointer"
              hoverStyle={{ borderColor: '$color8' }}
            >
              <Text fontSize="$1" fontWeight="500" {...muted}>
                {d.eyebrow}
              </Text>
              <Text fontSize={15} fontWeight="600" color="$color12">
                {d.title} {on ? '→' : ''}
              </Text>
              <Text fontSize="$2" lineHeight={20} text="left" whiteSpace="normal" {...muted}>
                {d.body}
              </Text>
            </YStack>
          );
        })}
      </XStack>

      {/* The selected path's real first step. */}
      <YStack rounded="$5" borderWidth={1} borderColor="$borderColor" bg="$panel" overflow="hidden">
        <XStack justify="space-between" items="center" gap={12} px={16} py={10} borderBottomWidth={1} borderColor="$borderColor">
          <Text fontSize="$1" fontWeight="500" {...muted}>
            {path.lang}
          </Text>
          <Text
            render={path.external ? <a href={path.href} target="_blank" rel="noreferrer" /> : <Link href={path.href} prefetch={false} />}
            fontSize="$1"
            {...muted}
            hoverStyle={{ color: '$color12' }}
          >
            {path.cta} →
          </Text>
        </XStack>
        {path.sample}
      </YStack>

      {/* The models, because they are the reason to choose the platform at all. */}
      <XStack
        render={<Link href="/docs/models" prefetch={false} />}
        flexWrap="wrap"
        items="center"
        gap={12}
        px={18}
        py={14}
        rounded="$5"
        borderWidth={1}
        borderColor="$borderColor"
        bg="$panel"
        hoverStyle={{ bg: '$hover' }}
      >
        <Text fontSize={11} fontWeight="500" px={6} py={1} rounded={6} borderWidth={1} borderColor="$borderColor" {...muted}>
          Models
        </Text>
        <Text fontSize="$3" fontWeight="500" color="$color12">
          Enso routes, Kai decides, Zen reasons
        </Text>
        <Text fontSize="$3" {...muted}>
          One router, typed decisions, open weights. See the models →
        </Text>
      </XStack>

      <XStack>
        <Action tone="loud" render={<Link href="/docs/quickstart" prefetch={false} />} height={40} px={22} rounded={999}>
          Get started
        </Action>
      </XStack>
    </YStack>
  );
}
