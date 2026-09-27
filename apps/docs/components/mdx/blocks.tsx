'use client';

import Link from 'next/link';
import { Children, useState, type ReactNode } from 'react';
import { Text, XStack, YStack } from '@hanzo/gui';
import {
  Boxes,
  Code,
  Key,
  LayoutGrid,
  Package,
  Rocket,
  Sparkle,
  Sparkles,
  Terminal,
  ChevronRight,
  CircleCheck,
  CircleX,
  File as FileGlyph,
  Folder as FolderGlyph,
  FolderOpen,
  Info,
  Lightbulb,
  TriangleAlert,
} from '@hanzogui/lucide-icons-2';
import { muted } from '@/lib/ink';
import { Grid } from '@hanzo/ui/grid';
import { Lead, Small, flow } from '@/components/mdx/prose';

/**
 * The block components content names: Callout, Cards/Card, Steps/Step,
 * Accordions/Accordion, Files/Folder/File. Each is a gui surface on the same
 * edge and radius as a code block, so a page reads as one set of parts.
 */

type Kind = 'info' | 'warn' | 'warning' | 'error' | 'success' | 'idea' | 'tip';

const KIND = {
  info: { Glyph: Info, color: '$blue10' },
  tip: { Glyph: Info, color: '$blue10' },
  warn: { Glyph: TriangleAlert, color: '$yellow10' },
  warning: { Glyph: TriangleAlert, color: '$yellow10' },
  error: { Glyph: CircleX, color: '$red10' },
  success: { Glyph: CircleCheck, color: '$green10' },
  idea: { Glyph: Lightbulb, color: '$yellow10' },
} as const;

export function Callout({ type = 'info', title, icon, children }: { type?: Kind; title?: ReactNode; icon?: ReactNode; children?: ReactNode }) {
  const { Glyph, color } = KIND[type] ?? KIND.info;
  return (
    <XStack gap={12} p={14} rounded="$5" borderWidth={1} borderColor="$borderColor" bg="$panel">
      {/* Level with the first line of text, whichever line that is. */}
      <XStack height={title ? 24 : 22} items="center" shrink={0}>
        {icon ?? <Glyph size={16} color={color} />}
      </XStack>
      <YStack flex={1} minW={0} gap={8}>
        {title ? (
          <Text fontSize={15} lineHeight={24} fontWeight="600" color="$color12" whiteSpace="normal">
            {title}
          </Text>
        ) : null}
        <Small value>{flow(children, 'small')}</Small>
      </YStack>
    </XStack>
  );
}

export function Cards({ children }: { children: ReactNode }) {
  return (
    <Grid columns={{ min: 260 }} gap={12}>
      {children}
    </Grid>
  );
}

/**
 * A card's icon, named in the content (`<Card icon="Rocket">`). Content
 * cannot hand a drawn icon across to a client part, so it names one of these.
 */
const GLYPH = { Boxes, Code, Key, LayoutGrid, Package, Rocket, Sparkle, Sparkles, Terminal } as const;

export function Card({
  title,
  description,
  href,
  icon,
  children,
}: {
  title: ReactNode;
  description?: ReactNode;
  href?: string;
  icon?: ReactNode | keyof typeof GLYPH;
  external?: boolean;
  children?: ReactNode;
}) {
  const away = href !== undefined && /^[a-z]+:/i.test(href);
  const render = !href ? undefined : away ? <a href={href} target="_blank" rel="noreferrer noopener" /> : <Link href={href} prefetch={false} />;
  return (
    <YStack
      render={render}
      gap={6}
      p={16}
      rounded="$5"
      borderWidth={1}
      borderColor="$borderColor"
      bg="$panel"
      {...(href ? { hoverStyle: { bg: '$hover', borderColor: '$color7' } } : {})}
    >
      {icon ? (
        <XStack width={30} height={30} mb={4} rounded="$3" borderWidth={1} borderColor="$borderColor" items="center" justify="center">
          {typeof icon === 'string' ? (() => {
            const Glyph = GLYPH[icon as keyof typeof GLYPH];
            return Glyph ? <Glyph size={15} color="$color11" /> : null;
          })() : icon}
        </XStack>
      ) : null}
      <Text fontSize={15} lineHeight={22} fontWeight="600" color="$color12" whiteSpace="normal">
        {title}
      </Text>
      {description ? (
        <Text fontSize={14} lineHeight={21} whiteSpace="normal" {...muted}>
          {description}
        </Text>
      ) : null}
      {children ? (
        <YStack gap={8}>
          <Small value>{flow(children, 'small')}</Small>
        </YStack>
      ) : null}
    </YStack>
  );
}

/**
 * Steps, as remark-steps marks them: a numbered rail down the left, each step's
 * heading level with its number. The numbers are the steps' own positions.
 */
export function Steps({ children }: { children: ReactNode }) {
  const steps = Children.toArray(children);
  return (
    <YStack gap={8}>
      {steps.map((step, i) => (
        <XStack key={i} gap={16}>
          <YStack items="center" shrink={0}>
            <XStack width={28} height={28} rounded={999} borderWidth={1} borderColor="$borderColor" bg="$background" items="center" justify="center">
              <Text fontSize={13} fontWeight="600" color="$color12">
                {i + 1}
              </Text>
            </XStack>
            {i < steps.length - 1 && <YStack flex={1} width={1} mt={6} bg="$borderColor" />}
          </YStack>
          <YStack flex={1} minW={0} gap={14} pb={16} mt={-2}>
            <Lead value>{step}</Lead>
          </YStack>
        </XStack>
      ))}
    </YStack>
  );
}

export function Step({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function Accordions({ children }: { children: ReactNode }) {
  return (
    <YStack rounded="$5" borderWidth={1} borderColor="$borderColor" bg="$panel" overflow="hidden">
      {children}
    </YStack>
  );
}

export function Accordion({ title, id, children }: { title: ReactNode; id?: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <YStack id={id} borderBottomWidth={1} borderColor="$borderColor" style={{ scrollMarginTop: 112 }}>
      <XStack
        render="button"
        type="button"
        aria-expanded={open}
        onPress={() => setOpen(!open)}
        gap={10}
        px={16}
        py={12}
        items="center"
        bg="transparent"
        borderWidth={0}
        cursor="pointer"
        hoverStyle={{ bg: '$hover' }}
      >
        <YStack rotate={open ? '90deg' : '0deg'}>
          <ChevronRight size={14} color="$color10" />
        </YStack>
        <Text flex={1} fontSize={15} lineHeight={22} fontWeight="500" color="$color12" text="left">
          {title}
        </Text>
      </XStack>
      {/* Hidden, not unmounted: the answer is in the export and in search. */}
      <YStack display={open ? 'flex' : 'none'} gap={12} px={16} pb={14} pl={40}>
        {flow(children, 'small')}
      </YStack>
    </YStack>
  );
}

export function Files({ children }: { children: ReactNode }) {
  return (
    <YStack p={8} rounded="$5" borderWidth={1} borderColor="$borderColor" bg="$panel">
      {children}
    </YStack>
  );
}

const ROW = { gap: 8, px: 8, py: 6, rounded: '$3', items: 'center', hoverStyle: { bg: '$hover' } } as const;

export function File({ name, icon }: { name: string; icon?: ReactNode }) {
  return (
    <XStack {...ROW}>
      {icon ?? <FileGlyph size={15} color="$color10" />}
      <Text fontSize={14} color="$color12">
        {name}
      </Text>
    </XStack>
  );
}

export function Folder({ name, defaultOpen = false, children }: { name: string; defaultOpen?: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <YStack>
      <XStack render="button" type="button" aria-expanded={open} onPress={() => setOpen(!open)} {...ROW} bg="transparent" borderWidth={0} cursor="pointer">
        {open ? <FolderOpen size={15} color="$color10" /> : <FolderGlyph size={15} color="$color10" />}
        <Text fontSize={14} color="$color12">
          {name}
        </Text>
      </XStack>
      {open && (
        <YStack ml={15} pl={8} borderLeftWidth={1} borderColor="$borderColor">
          {children}
        </YStack>
      )}
    </YStack>
  );
}
