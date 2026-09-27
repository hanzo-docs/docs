'use client';

import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  use,
  useEffect,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import { Tabs as Gui, Text } from '@hanzo/gui';
import { loud, muted } from '@/lib/ink';

/**
 * Tabs, in the shape the content is written in: `<Tabs items={[…]}>` with a
 * `<Tab value>` per item (or none, and the order decides), and the compound
 * `TabsList` / `TabsTrigger` / `TabsContent` that remark-code-tab emits.
 *
 * Behaviour is gui's Tabs — roving focus and arrow keys across the triggers,
 * the tab/tabpanel roles and their labelling. Every panel is rendered and the
 * inactive ones are hidden, so the export holds each language's example and
 * search and a reader with no script still have them.
 *
 * A `groupId` ties every group of that id on the page together (and across
 * pages with `persist`): choosing pnpm once chooses it everywhere.
 */

interface Group {
  value: string;
  code: boolean;
  nested: boolean;
}

const Context = createContext<Group | null>(null);

const listeners = new Map<string, Set<(v: string) => void>>();

/** Items are shown as written and addressed by a slug. */
const slug = (v: string) => v.toLowerCase().replace(/\s/g, '-');

export function Tabs({
  items,
  defaultValue,
  groupId,
  persist = false,
  code = false,
  children,
}: {
  items?: string[];
  defaultValue?: string;
  groupId?: string;
  persist?: boolean;
  /** A group of code blocks: one frame, the blocks flush inside it. */
  code?: boolean;
  children: ReactNode;
}) {
  const nested = use(Context) !== null && !code;
  const values = useMemo(() => items?.map(slug), [items]);
  const [value, setValue] = useState(defaultValue ?? values?.[0] ?? '');

  // A stored choice is read after hydration, so the export and the first
  // client render agree on the default.
  useEffect(() => {
    if (!groupId) return;
    const stored = sessionStorage.getItem(groupId) ?? (persist ? localStorage.getItem(groupId) : null);
    if (stored && (!values || values.includes(stored))) setValue(stored);
    const set = listeners.get(groupId) ?? new Set();
    set.add(setValue);
    listeners.set(groupId, set);
    return () => void set.delete(setValue);
  }, [groupId, persist, values]);

  const choose = (v: string) => {
    if (values && !values.includes(v)) return;
    if (!groupId) return setValue(v);
    sessionStorage.setItem(groupId, v);
    if (persist) localStorage.setItem(groupId, v);
    for (const set of listeners.get(groupId) ?? []) set(v);
  };

  // A `Tab` with no value takes the item at its position.
  let at = 0;
  const panels = Children.map(children, (child) => {
    if (!isValidElement(child) || child.type !== Tab || !values) return child;
    const props = child.props as { value?: string };
    const index = at++;
    return props.value ? child : cloneElement(child as ReactElement<{ value?: string }>, { value: items![index] });
  });

  return (
    <Context value={useMemo(() => ({ value, code, nested }), [value, code, nested])}>
      <Gui
        value={value}
        onValueChange={choose}
        orientation="horizontal"
        activationMode="automatic"
        flexDirection="column"
        overflow="hidden"
        {...(nested ? {} : { rounded: '$5', borderWidth: 1, borderColor: '$borderColor', bg: '$panel' })}
      >
        {items && (
          <TabsList>
            {items.map((item) => (
              <TabsTrigger key={item} value={slug(item)}>
                {item}
              </TabsTrigger>
            ))}
          </TabsList>
        )}
        {panels}
      </Gui>
    </Context>
  );
}

export function TabsList({ children }: { children: ReactNode }) {
  const { nested } = use(Context)!;
  return (
    <Gui.List
      unstyled
      flexDirection="row"
      gap={nested ? 14 : 18}
      px={nested ? 0 : 14}
      overflowX="auto"
      data-overflow-ok=""
      justify={nested ? 'flex-end' : 'flex-start'}
      {...(nested ? {} : { borderBottomWidth: 1, borderColor: '$borderColor' })}
    >
      {children}
    </Gui.List>
  );
}

export function TabsTrigger({ value, children }: { value: string; children: ReactNode }) {
  const group = use(Context)!;
  const on = group.value === value;
  return (
    <Gui.Tab
      unstyled
      value={value}
      height={group.nested ? 30 : 38}
      px={0}
      bg="transparent"
      borderWidth={0}
      borderBottomWidth={2}
      borderColor={on ? '$color12' : 'transparent'}
      cursor="pointer"
      justify="center"
      focusVisibleStyle={{ outlineWidth: 2, outlineStyle: 'solid', outlineColor: '$outlineColor' }}
    >
      <Text
        fontSize={group.nested ? 12 : 13}
        lineHeight={18}
        fontWeight="500"
        whiteSpace="nowrap"
        {...(on ? loud : muted)}
      >
        {children}
      </Text>
    </Gui.Tab>
  );
}

export function TabsContent({ value, children }: { value: string; children: ReactNode }) {
  const group = use(Context)!;
  const on = group.value === value;
  return (
    <Gui.Content
      value={value}
      forceMount
      display={on ? 'flex' : 'none'}
      gap={14}
      {...(group.code ? {} : { p: group.nested ? 0 : 16, pt: group.nested ? 12 : 16, bg: group.nested ? 'transparent' : '$background' })}
    >
      {children}
    </Gui.Content>
  );
}

/** A panel of `<Tabs items>`; its `value` is the item as written. */
export function Tab({ value = '', children }: { value?: string; children: ReactNode }) {
  return <TabsContent value={slug(value)}>{children}</TabsContent>;
}

