'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useState, type ReactNode } from 'react';
import { Text, XStack, YStack } from '@hanzo/gui';
import { ArrowLeft, ChevronRight } from '@hanzogui/lucide-icons-2';
import type * as PageTree from '@hanzo/docs-core/page-tree';
import { same, useTree } from '@/lib/tree';
import { loud, muted } from '@/lib/ink';

/**
 * The page tree, as the rail draws it.
 *
 * A separator in meta.json (`---Build with---`) heads the pages after it, so a
 * run of pages under one separator is drawn as one section that folds. A page
 * inside a top-level folder narrows the rail to that folder, with a way back to
 * the top — the tree lists ~1,600 pages, and the folder you are in is the part
 * of it you need.
 *
 * Every row is 32px and every level indents 12px under a hairline, so depth
 * reads from the left edge rather than from type size.
 */
export function Tree() {
  const { tree, path } = useTree();
  const pathname = usePathname();

  // `path` rather than the address: an operation page is not in the tree, and its
  // path is its product page's, so the rail narrows to the reference it is in.
  const scope = useMemo(() => {
    const folder = tree.children.find(
      (node): node is PageTree.Folder => node.type === 'folder' && path.includes(node),
    );
    if (!folder) return undefined;
    const home = tree.children.find((node): node is PageTree.Item => node.type === 'page');
    return { folder, home };
  }, [tree, path]);

  if (!scope) return <List nodes={tree.children} />;

  const { folder, home } = scope;
  const here = folder.index !== undefined && same(folder.index.url, pathname);

  return (
    <YStack gap={2}>
      {home && (
        <Row href={home.url} active={false}>
          <ArrowLeft size={14} color="$color10" />
          <Label active={false}>{tree.name}</Label>
        </Row>
      )}
      {folder.index ? (
        <Row href={folder.index.url} active={here} mt={8}>
          <Text flex={1} minW={0} fontSize="$3" lineHeight={20} fontWeight="600" color="$color12" text="left">
            {folder.name}
          </Text>
        </Row>
      ) : (
        <Text px={10} pt={12} pb={4} fontSize="$3" lineHeight={20} fontWeight="600" color="$color12">
          {folder.name}
        </Text>
      )}
      <List nodes={folder.children} />
    </YStack>
  );
}

/** Nodes in order, with each separator folding the pages that follow it. */
function List({ nodes }: { nodes: PageTree.Node[] }) {
  const out: ReactNode[] = [];
  for (let i = 0; i < nodes.length; ) {
    const node = nodes[i];
    if (node.type !== 'separator') {
      out.push(<Node key={node.$id ?? i} node={node} />);
      i++;
      continue;
    }
    let end = i + 1;
    while (end < nodes.length && nodes[end].type !== 'separator') end++;
    const run = nodes.slice(i + 1, end);
    out.push(
      run.length > 0 ? (
        <Section key={node.$id ?? i} name={node.name} nodes={run} />
      ) : null,
    );
    i = end;
  }
  return <YStack gap={2}>{out}</YStack>;
}

function Node({ node }: { node: PageTree.Item | PageTree.Folder }) {
  const pathname = usePathname();
  if (node.type === 'page')
    return (
      <Row href={node.url} active={same(node.url, pathname)} external={node.external}>
        <Label active={same(node.url, pathname)}>{node.name}</Label>
      </Row>
    );
  return <Folder node={node} />;
}

function Section({ name, nodes }: { name: ReactNode; nodes: PageTree.Node[] }) {
  const { path } = useTree();
  const [open, setOpen] = useFold(nodes.some((node) => path.includes(node)));

  return (
    <YStack>
      <Toggle open={open} onPress={() => setOpen(!open)}>
        <Text flex={1} fontSize="$3" lineHeight={20} fontWeight="500" color="$color12" numberOfLines={1} text="left">
          {name}
        </Text>
      </Toggle>
      {open && (
        <Indent>
          <List nodes={nodes} />
        </Indent>
      )}
    </YStack>
  );
}

function Folder({ node }: { node: PageTree.Folder }) {
  const pathname = usePathname();
  const { path } = useTree();
  const active = node.index !== undefined && same(node.index.url, pathname);
  const fixed = node.collapsible === false;
  const [open, setOpen] = useFold(fixed || path.includes(node) || node.defaultOpen === true);

  const body = (
    <Indent>
      <List nodes={node.children} />
    </Indent>
  );

  if (!node.index)
    return (
      <YStack>
        <Toggle open={open} onPress={() => setOpen(!open)} disabled={fixed}>
          <Label active={false}>{node.name}</Label>
        </Toggle>
        {(open || fixed) && body}
      </YStack>
    );

  return (
    <YStack>
      <XStack items="center">
        <Row
          href={node.index.url}
          active={active}
          flex={1}
          onPress={() => setOpen(active ? !open : true)}
        >
          <Label active={active}>{node.name}</Label>
        </Row>
        {!fixed && (
          <Chevron open={open} onPress={() => setOpen(!open)} label={open ? 'Collapse' : 'Expand'} />
        )}
      </XStack>
      {(open || fixed) && body}
    </YStack>
  );
}

/** Open state that follows the reader: a fold that comes to hold the page opens. */
function useFold(want: boolean): [boolean, (v: boolean) => void] {
  const [open, setOpen] = useState(want);
  const [was, setWas] = useState(want);
  if (want !== was) {
    setWas(want);
    if (want) setOpen(true);
  }
  return [open, setOpen];
}

function Row({
  href,
  active,
  external,
  children,
  ...props
}: {
  href: string;
  active: boolean;
  external?: boolean;
  children: ReactNode;
  flex?: number;
  mt?: number;
  onPress?: () => void;
}) {
  return (
    <XStack
      render={
        external ? (
          <a href={href} target="_blank" rel="noreferrer noopener" />
        ) : (
          <Link href={href} prefetch={false} />
        )
      }
      data-active={active ? 'true' : undefined}
      aria-current={active ? 'page' : undefined}
      minH={32}
      py={6}
      px={10}
      gap={8}
      rounded="$3"
      items="center"
      minW={0}
      bg={active ? '$hover' : 'transparent'}
      hoverStyle={{ bg: '$hover' }}
      {...props}
    >
      {children}
    </XStack>
  );
}

function Label({ active, children }: { active: boolean; children: ReactNode }) {
  return (
    <Text
      flex={1}
      minW={0}
      fontSize="$3"
      lineHeight={20}
      fontWeight={active ? '500' : '400'}
      {...(active ? loud : muted)}
      text="left"
    >
      {children}
    </Text>
  );
}

function Toggle({
  open,
  onPress,
  disabled,
  children,
}: {
  open: boolean;
  onPress: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <XStack
      render="button"
      type="button"
      aria-expanded={open}
      disabled={disabled}
      onPress={disabled ? undefined : onPress}
      minH={32}
      py={6}
      px={10}
      gap={8}
      rounded="$3"
      items="center"
      bg="transparent"
      borderWidth={0}
      cursor={disabled ? 'default' : 'pointer'}
      hoverStyle={disabled ? undefined : { bg: '$hover' }}
    >
      {children}
      {!disabled && <Turn open={open} />}
    </XStack>
  );
}

function Chevron({ open, onPress, label }: { open: boolean; onPress: () => void; label: string }) {
  return (
    <XStack
      render="button"
      type="button"
      aria-label={label}
      aria-expanded={open}
      onPress={onPress}
      width={28}
      height={28}
      ml={2}
      shrink={0}
      rounded="$3"
      items="center"
      justify="center"
      bg="transparent"
      borderWidth={0}
      cursor="pointer"
      hoverStyle={{ bg: '$hover' }}
    >
      <Turn open={open} />
    </XStack>
  );
}

function Turn({ open }: { open: boolean }) {
  return (
    <YStack shrink={0} rotate={open ? '90deg' : '0deg'}>
      <ChevronRight size={14} color="$color10" />
    </YStack>
  );
}

function Indent({ children }: { children: ReactNode }) {
  return (
    <YStack ml={16} pl={6} mt={2} borderLeftWidth={1} borderColor="$borderColor">
      {children}
    </YStack>
  );
}
