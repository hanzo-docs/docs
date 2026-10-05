'use client';

import { createContext, use, useRef, useState, type ComponentProps, type ReactNode } from 'react';
import { Text, XStack, YStack } from '@hanzo/gui';
import { Check, Clipboard } from '@hanzogui/lucide-icons-2';
import { Tool } from '@/components/action';
import { muted } from '@/lib/ink';
import { Block } from '@/components/mdx/prose';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/mdx/tabs';

/**
 * A code block: a surface, an optional title bar, and a copy control.
 *
 * rehype-code hands the `pre` its tokens already coloured — each span carries
 * `color: light-dark(light, dark)` (lib/shiki.ts, `defaultColor`) — and the
 * `pre` itself carries the theme's ground and ink the same way. The code area
 * paints that ground, so a block is Dracula in the dark and GitHub's light in
 * the light, and the theme class on <html> picks between them through
 * `color-scheme`; no rule here has to know which theme is on.
 */

/** Blocks inside a code-tab group sit flush in its frame instead of framing themselves. */
const Grouped = createContext(false);

export function Figure({
  title,
  icon,
  ground,
  children,
}: {
  title?: ReactNode;
  icon?: ReactNode | string;
  /** The theme's background for the code area, as the highlighter wrote it. */
  ground?: string;
  children: ReactNode;
}) {
  const grouped = use(Grouped);
  const area = useRef<HTMLElement>(null);

  const copy = <Copy area={area} />;
  return (
    <YStack
      render="figure"
      dir="ltr"
      position="relative"
      overflow="hidden"
      bg="$panel"
      {...(grouped ? {} : { rounded: '$5', borderWidth: 1, borderColor: '$borderColor' })}
    >
      {title ? (
        <XStack height={38} pl={14} pr={4} gap={8} items="center" borderBottomWidth={1} borderColor="$borderColor">
          {typeof icon === 'string' ? (
            <XStack width={14} height={14} dangerouslySetInnerHTML={{ __html: icon }} />
          ) : (
            icon
          )}
          <Text render="figcaption" flex={1} minW={0} fontSize="$2" {...muted} numberOfLines={1}>
            {title}
          </Text>
          {copy}
        </XStack>
      ) : (
        <XStack position="absolute" t={6} r={6} z={2}>
          {copy}
        </XStack>
      )}
      <YStack
        ref={area as never}
        role="region"
        tabIndex={0}
        overflow="auto"
        maxH={600}
        py={14}
        style={ground ? { backgroundColor: ground } : undefined}
      >
        {children}
      </YStack>
    </YStack>
  );
}

/** The `pre` itself. `ink` is the theme's foreground, for text no token colours. */
export function Pre({ ink, children }: { ink?: string; children?: ReactNode }) {
  return (
    <Block value>
      <Text
        render="pre"
        fontFamily="$mono"
        fontSize={13}
        lineHeight={21}
        px={16}
        minW="100%"
        whiteSpace="pre"
        color="$color12"
        style={{ width: 'max-content', ...(ink ? { color: ink } : {}) }}
      >
        {children}
      </Text>
    </Block>
  );
}

function Copy({ area }: { area: React.RefObject<HTMLElement | null> }) {
  const [done, setDone] = useState(false);
  return (
    <Tool
      label={done ? 'Copied' : 'Copy code'}
      width={28}
      height={28}
      onPress={() => {
        const text = area.current?.querySelector('pre')?.textContent ?? '';
        void navigator.clipboard.writeText(text).then(() => {
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        });
      }}
    >
      {done ? <Check size={14} color="$color11" /> : <Clipboard size={14} color="$color10" />}
    </Tool>
  );
}

/** The MDX `pre`: rehype-code's element, framed. Of its own props only the
 *  theme's ground and ink are kept; the shiki classes are dropped. */
export function Code({ title, icon, style, children }: ComponentProps<'pre'> & { icon?: string }) {
  return (
    <Figure title={title} icon={icon} ground={style?.backgroundColor}>
      <Pre ink={style?.color}>{children}</Pre>
    </Figure>
  );
}

/** A highlighted `pre` with no frame, for a part that draws its own: the
 *  theme's ground and ink, and the code scrolling under them. */
export function Listing({ style, children }: ComponentProps<'pre'>) {
  return (
    <YStack overflow="auto" py={14} style={{ backgroundColor: style?.backgroundColor }}>
      <Pre ink={style?.color}>{children}</Pre>
    </YStack>
  );
}

/**
 * Consecutive fences with `tab="…"`, and ```npm blocks, arrive as a group of
 * code tabs (remark-code-tab, remark-npm). One frame, the tabs across its top,
 * each block flush inside.
 */
export function CodeBlockTabs({
  defaultValue,
  groupId,
  persist,
  children,
}: {
  defaultValue?: string;
  groupId?: string;
  persist?: boolean;
  children: ReactNode;
}) {
  return (
    <Grouped value>
      <Tabs code defaultValue={defaultValue} groupId={groupId} persist={persist}>
        {children}
      </Tabs>
    </Grouped>
  );
}

export const CodeBlockTabsList = TabsList;
export const CodeBlockTabsTrigger = TabsTrigger;
export const CodeBlockTab = TabsContent;
