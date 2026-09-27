'use client';

import { useRouter } from 'next/navigation';
import { Fragment, useEffect, useMemo, useRef, useState, type ComponentProps, type ReactNode } from 'react';
import { Input, Text, XStack, YStack } from '@hanzo/gui';
import { ArrowRight, Check, ChevronRight, Hash, Search as Glass, Sparkle } from '@hanzogui/lucide-icons-2';
import { Dialog, DialogContent, DialogTitle } from '@hanzo/ui';
import { useDocsSearch } from '@hanzo/docs-core/search/client';
import type { SortedResult } from '@hanzo/docs-core/search';
import { createMarkdownRenderer } from '@hanzo/docs-core/content/md';
import type * as PageTree from '@hanzo/docs-core/page-tree';
import rehypeRaw from 'rehype-raw';
import { loud, muted } from '@/lib/ink';
import { Chips } from '@/components/chips';
import { useTree } from '@/lib/tree';
import { AGENT_SETUP_PROMPT } from '@/lib/agent-setup-prompt';

/**
 * The search dialog. Full text over every page (the static index at
 * /api/search), a jump straight to a page whose title starts with what was
 * typed, and — when the words land nowhere — the question handed to the
 * reader's own agent, set up for Hanzo. Arrows move, Enter opens, Esc closes.
 */

const TAGS = [
  { label: 'All', value: undefined },
  { label: 'Services', value: 'services' },
  { label: 'SDKs', value: 'sdks' },
  { label: 'API', value: 'openapi' },
  { label: 'Products', value: 'products' },
] as const;

type Item =
  | (SortedResult & { kind: 'result' })
  | { kind: 'action'; id: string; node: ReactNode; run: () => void };

// Result text arrives as Markdown with the matched words in <mark>.
const md = createMarkdownRenderer({ remarkRehypeOptions: { allowDangerousHtml: true }, rehypePlugins: [rehypeRaw] });

const MD = {
  p: ({ children }: ComponentProps<'p'>) => <Text whiteSpace="normal">{children}</Text>,
  a: ({ children }: ComponentProps<'a'>) => <Text>{children}</Text>,
  mark: ({ children }: ComponentProps<'mark'>) => (
    <Text color="$color12" fontWeight="600" textDecorationLine="underline">
      {children}
    </Text>
  ),
  strong: ({ children }: ComponentProps<'strong'>) => <Text fontWeight="600">{children}</Text>,
  code: ({ children }: ComponentProps<'code'>) => (
    <Text fontFamily="$mono" fontSize="0.9em" px={3} rounded={4} bg="$hover">
      {children}
    </Text>
  ),
  pre: ({ children }: ComponentProps<'pre'>) => (
    <Text render="pre" fontFamily="$mono" fontSize={12} whiteSpace="pre" overflow="hidden" maxH={60}>
      {children}
    </Text>
  ),
};

function pages(nodes: PageTree.Node[], out = new Map<string, PageTree.Item>()) {
  for (const node of nodes) {
    if (node.type === 'page' && typeof node.name === 'string') out.set(node.name.toLowerCase(), node);
    if (node.type === 'folder') {
      if (node.index) pages([node.index], out);
      pages(node.children, out);
    }
  }
  return out;
}

export default function Finder({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const router = useRouter();
  const { tree } = useTree();
  const [tag, setTag] = useState<string | undefined>();
  const [asked, setAsked] = useState(false);
  const { search, setSearch, query } = useDocsSearch({ type: 'flexsearch-static', from: '/api/search', tag });
  const titles = useMemo(() => pages(tree.children), [tree]);

  const items = useMemo<Item[] | null>(() => {
    const q = search.trim();
    const out: Item[] = [];
    if (q) {
      const lower = q.toLowerCase();
      for (const [name, page] of titles) {
        if (!name.startsWith(lower)) continue;
        out.push({
          kind: 'action',
          id: 'jump',
          node: (
            <XStack gap={8} items="center">
              <ArrowRight size={14} color="$color10" />
              <Text fontSize="$3" {...muted}>
                Jump to <Text {...loud} fontWeight="500">{page.name}</Text>
              </Text>
            </XStack>
          ),
          run: () => router.push(page.url),
        });
        break;
      }
    }
    if (Array.isArray(query.data)) for (const r of query.data) out.push({ ...r, kind: 'result' });
    // A question is the fallback when the terms did not land, so it is last.
    if (q.length >= 3)
      out.push({
        kind: 'action',
        id: 'ask',
        node: (
          <XStack gap={8} items="center">
            {asked ? <Check size={14} color="$color10" /> : <Sparkle size={14} color="$color10" />}
            <Text fontSize="$3" {...muted}>
              {asked ? 'Copied — paste it into your agent' : <>Ask an agent <Text {...loud} fontWeight="500">“{q}”</Text></>}
            </Text>
          </XStack>
        ),
        run: () =>
          void navigator.clipboard
            .writeText(
              `${AGENT_SETUP_PROMPT}\n\n---\n\nThen answer this using the Hanzo documentation at https://docs.hanzo.ai, and use the Hanzo skills at https://hanzoskills.com for any capability it touches:\n\n${q}`,
            )
            .then(() => setAsked(true)),
      });
    return q ? out : null;
  }, [search, query.data, titles, router, asked]);

  const [active, setActive] = useState(0);
  useEffect(() => setActive(0), [items]);

  const choose = (item: Item) => {
    if (item.kind === 'action') {
      item.run();
      if (item.id === 'ask') return;
    } else router.push(item.url);
    onOpenChange(false);
  };

  // Keys are read from the document while the dialog is open, so they work
  // whether focus is in the field or on a row.
  const list = useRef(items);
  list.current = items;
  const at = useRef(active);
  at.current = active;
  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => {
      const rows = list.current;
      if (!rows?.length || e.isComposing) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        setActive((i) => (i + (e.key === 'ArrowDown' ? 1 : rows.length - 1)) % rows.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const row = rows[at.current];
        if (row) choose(row);
      }
    };
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  });

  const box = useRef<HTMLElement>(null);
  useEffect(() => {
    box.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} p={0} gap={0} width="92%" maxW={640} overflow="hidden" bg="$background">
        <DialogTitle position="absolute" width={1} height={1} overflow="hidden" opacity={0}>
          Search the docs
        </DialogTitle>
        <XStack px={14} height={52} gap={10} items="center" borderBottomWidth={1} borderColor="$borderColor">
          <Glass size={18} color="$color10" opacity={query.isLoading ? 0.5 : 1} />
          <Input
            unstyled
            autoFocus
            flex={1}
            minW={0}
            value={search}
            onChangeText={setSearch}
            placeholder="Search or ask"
            placeholderTextColor="$color10"
            fontSize={17}
            color="$color12"
            bg="transparent"
            borderWidth={0}
            outlineWidth={0}
            aria-label="Search the docs"
          />
          <Text
            render="button"
            onPress={() => onOpenChange(false)}
            fontFamily="$mono"
            fontSize={11}
            px={6}
            py={2}
            rounded={6}
            borderWidth={1}
            borderColor="$borderColor"
            bg="transparent"
            cursor="pointer"
            {...muted}
          >
            ESC
          </Text>
        </XStack>

        {items && (
          <YStack ref={box as never} maxH={440} overflowY="auto" p={6} gap={2} borderBottomWidth={1} borderColor="$borderColor">
            {items.length === 0 ? (
              <Text py={40} text="center" fontSize="$3" {...muted}>
                Nothing matches.
              </Text>
            ) : (
              items.map((item, i) => (
                <Row key={item.id} item={item} active={i === active} onHover={() => setActive(i)} onPress={() => choose(item)} />
              ))
            )}
          </YStack>
        )}

        <XStack px={12} py={10} gap={10} items="center" bg="$panel">
          <Text fontSize={12} {...muted}>
            Filter
          </Text>
          <Chips items={TAGS} value={tag} onChange={setTag} />
        </XStack>
      </DialogContent>
    </Dialog>
  );
}

function Row({ item, active, onHover, onPress }: { item: Item; active: boolean; onHover: () => void; onPress: () => void }) {
  const inset = item.kind === 'result' && item.type !== 'page';
  return (
    <YStack
      render="button"
      type="button"
      data-active={active ? 'true' : undefined}
      aria-selected={active}
      onPress={onPress}
      onHoverIn={onHover}
      position="relative"
      gap={4}
      px={10}
      py={8}
      pl={inset ? (item.kind === 'result' && item.type === 'heading' ? 34 : 22) : 10}
      rounded="$3"
      bg={active ? '$hover' : 'transparent'}
      borderWidth={0}
      cursor="pointer"
      items="flex-start"
    >
      {item.kind === 'action' ? (
        item.node
      ) : (
        <>
          {item.breadcrumbs && item.breadcrumbs.length > 0 && (
            <XStack items="center" gap={2} flexWrap="wrap">
              {item.breadcrumbs.map((crumb, i) => (
                <Fragment key={i}>
                  {i > 0 && <ChevronRight size={12} color="$color9" />}
                  <Text fontSize={12} {...muted}>
                    {crumb}
                  </Text>
                </Fragment>
              ))}
            </XStack>
          )}
          {inset && <YStack position="absolute" l={12} t={0} b={0} width={1} bg="$borderColor" />}
          {item.type === 'heading' && (
            <YStack position="absolute" l={18} t={10}>
              <Hash size={13} color="$color10" />
            </YStack>
          )}
          <Text
            fontSize="$3"
            lineHeight={20}
            text="left"
            whiteSpace="normal"
            fontWeight={item.type === 'text' ? '400' : '500'}
            {...(item.type === 'text' ? muted : loud)}
          >
            <md.Markdown components={MD}>{item.content}</md.Markdown>
          </Text>
        </>
      )}
    </YStack>
  );
}
