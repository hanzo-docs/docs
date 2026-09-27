'use client';

import Link from 'next/link';
import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  use,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from 'react';
import { Text, YStack } from '@hanzo/gui';
import { muted } from '@/lib/ink';

/**
 * Markdown's elements, drawn by gui.
 *
 * A page body is compiled MDX: bare `p`, `h2`, `ul`, `table`, `code`, handed to
 * the components map by tag. Each tag is a gui element here, styled by its own
 * props, so no stylesheet reaches down into the article by selector and a
 * nested block (a list in a callout, a table in a tab) keeps its own spacing.
 *
 * Blocks are spaced by the `Body` column's gap, never by their own margins; a
 * heading adds room above itself because a section starts there.
 */

/** Where a `#` link lands: clear of the 56px bar and the 44px outline row. */
const LANDING = 112;

export function Body({ children }: { children: ReactNode }) {
  return (
    <YStack gap={18} minW={0}>
      {children}
    </YStack>
  );
}

/**
 * Markdown wraps its source lines by hand; a paragraph's newlines are spaces.
 * gui's text keeps whitespace (`pre-wrap`) because a native Text does, so every
 * block of running text says `normal` and its inline children inherit it.
 */
const TEXT = { fontSize: 16, lineHeight: 28, color: '$color12', whiteSpace: 'normal' } as const;

/**
 * Inside a part that already has its own top (a step, a panel), a heading does
 * not add the section room above itself.
 */
export const Lead = createContext(false);

/**
 * A part's children as blocks: a bare string (`<Callout>Text</Callout>`) is set
 * as text, everything else is already a block.
 */
export function flow(children: ReactNode, size: 'body' | 'small' = 'body') {
  return Children.map(children, (child) =>
    typeof child === 'string' || typeof child === 'number' ? (
      <Text {...(size === 'body' ? TEXT : SMALL)}>{child}</Text>
    ) : (
      child
    ),
  );
}

const SMALL = { fontSize: 14, lineHeight: 22, color: '$color12', whiteSpace: 'normal' } as const;

/** Running text inside a part (a callout, a card) sets one step smaller. */
export const Small = createContext(false);

export function P(props: ComponentProps<'p'>) {
  return <Text render="p" {...(use(Small) ? SMALL : TEXT)} {...(props as object)} />;
}

const HEADING = {
  h1: { fontSize: 30, lineHeight: 38, mt: 24 },
  h2: { fontSize: 24, lineHeight: 32, mt: 24 },
  h3: { fontSize: 19, lineHeight: 28, mt: 14 },
  h4: { fontSize: 16, lineHeight: 24, mt: 8 },
  h5: { fontSize: 15, lineHeight: 22, mt: 4 },
  h6: { fontSize: 14, lineHeight: 20, mt: 4 },
} as const;

function heading(tag: keyof typeof HEADING) {
  return function Heading({ id, children }: ComponentProps<'h2'>) {
    const lead = use(Lead);
    return (
      <Text
        render={tag}
        id={id}
        {...HEADING[tag]}
        {...(lead ? { mt: 0 } : {})}
        whiteSpace="normal"
        fontWeight="600"
        letterSpacing={tag === 'h1' || tag === 'h2' ? -0.4 : 0}
        color="$color12"
        style={{ scrollMarginTop: LANDING }}
      >
        {id ? (
          <Text render="a" href={`#${id}`} color="inherit" hoverStyle={{ opacity: 0.8 }}>
            {children}
          </Text>
        ) : (
          children
        )}
      </Text>
    );
  };
}

export const H1 = heading('h1');
export const H2 = heading('h2');
export const H3 = heading('h3');
export const H4 = heading('h4');
export const H5 = heading('h5');
export const H6 = heading('h6');

/** A link inside running text: underlined, the page's own ink. */
export function A({ href = '', children, ...props }: ComponentProps<'a'>) {
  const away = /^[a-z]+:/i.test(href) && !href.startsWith('https://docs.hanzo.ai');
  const render = away ? (
    <a href={href} target="_blank" rel="noreferrer noopener" />
  ) : href.startsWith('#') ? (
    <a href={href} />
  ) : (
    <Link href={href} prefetch={false} />
  );
  return (
    <Text
      render={render}
      color="$color12"
      textDecorationLine="underline"
      textDecorationColor="$color8"
      hoverStyle={{ textDecorationColor: '$color12' }}
      {...(props as object)}
    >
      {children}
    </Text>
  );
}

export function Strong(props: ComponentProps<'strong'>) {
  return <Text render="strong" fontWeight="600" color="$color12" {...(props as object)} />;
}

export function Em(props: ComponentProps<'em'>) {
  return <Text render="em" fontStyle="italic" {...(props as object)} />;
}

/**
 * Code. Inside a `pre` it is the block's own element and takes nothing; in
 * running text it is a chip. `Block` is how a `pre` tells the difference.
 */
export const Block = createContext(false);

export function Code({ children, ...props }: ComponentProps<'code'>) {
  if (use(Block)) return <code {...props}>{children}</code>;
  return (
    <Text
      render="code"
      fontFamily="$mono"
      fontSize="0.875em"
      px={5}
      py={1}
      rounded={5}
      borderWidth={1}
      borderColor="$borderColor"
      bg="$panel"
      color="$color12"
    >
      {children}
    </Text>
  );
}

const LIST = { pl: 22, gap: 6, style: { listStyleType: 'disc' } } as const;

export function Ul({ children }: ComponentProps<'ul'>) {
  return (
    <YStack render="ul" {...LIST}>
      {children}
    </YStack>
  );
}

/** Numbers come from the list itself, so a list that starts at 3 says 3. */
export function Ol({ children, start }: ComponentProps<'ol'>) {
  return (
    <YStack render="ol" {...LIST} start={start} style={{ listStyleType: 'decimal' }}>
      {children}
    </YStack>
  );
}

export function Li({ children }: ComponentProps<'li'>) {
  return (
    <Text render="li" display="list-item" {...TEXT} pl={2}>
      {loose(children)}
    </Text>
  );
}

/**
 * A loose list wraps each item's text in a `p`. Inside an item that paragraph
 * is the item's text, not a new block, so it loses the block gap it would
 * otherwise carry and the items stay one rhythm.
 */
function loose(children: ReactNode) {
  return Children.map(children, (child) =>
    isValidElement(child) && child.type === P
      ? cloneElement(child as ReactElement<{ display?: string }>, { display: 'block' })
      : child,
  );
}

export function Hr() {
  return <YStack render="hr" height={1} my={8} bg="$borderColor" borderWidth={0} />;
}

/**
 * Tables keep the browser's table layout — columns line up across rows, which
 * no flex arrangement does — and take everything else from gui. A wide table
 * scrolls inside its frame rather than widening the page.
 */
export function Table({ children }: ComponentProps<'table'>) {
  return (
    <YStack overflowX="auto" rounded="$5" borderWidth={1} borderColor="$borderColor" data-overflow-ok="">
      <YStack render="table" style={{ display: 'table', borderCollapse: 'collapse', width: '100%' }}>
        {children}
      </YStack>
    </YStack>
  );
}

export function Thead({ children }: ComponentProps<'thead'>) {
  return (
    <YStack render="thead" bg="$panel" style={{ display: 'table-header-group' }}>
      {children}
    </YStack>
  );
}

export function Tbody({ children }: ComponentProps<'tbody'>) {
  return (
    <YStack render="tbody" style={{ display: 'table-row-group' }}>
      {children}
    </YStack>
  );
}

export function Tr({ children }: ComponentProps<'tr'>) {
  return (
    <YStack render="tr" style={{ display: 'table-row' }}>
      {children}
    </YStack>
  );
}

const CELL = {
  whiteSpace: 'normal',
  px: 12,
  py: 9,
  fontSize: 14,
  lineHeight: 21,
  borderBottomWidth: 1,
  borderColor: '$borderColor',
  style: { display: 'table-cell', verticalAlign: 'top' },
} as const;

export function Th({ children, align }: ComponentProps<'th'>) {
  return (
    <Text render="th" {...CELL} fontWeight="600" color="$color12" text={align === 'right' ? 'right' : 'left'}>
      {children}
    </Text>
  );
}

export function Td({ children, align }: ComponentProps<'td'>) {
  return (
    <Text render="td" {...CELL} {...muted} text={align === 'right' ? 'right' : 'left'}>
      {children}
    </Text>
  );
}

/**
 * The export serves images as files and runs no optimiser, so an image is an
 * img. A local image arrives from remark-image as an import — `{ src, width,
 * height }` — and a remote one as a string.
 */
type Source = string | { src: string; width?: number; height?: number };

export function Img({ alt = '', src, width, height }: Omit<ComponentProps<'img'>, 'src'> & { src?: Source }) {
  const file = typeof src === 'object' ? src : undefined;
  return (
    <YStack
      // eslint-disable-next-line @next/next/no-img-element -- see above
      render={
        <img
          alt={alt}
          src={file ? file.src : src}
          width={width ?? file?.width}
          height={height ?? file?.height}
          loading="lazy"
        />
      }
      maxW="100%"
      height="auto"
      rounded="$5"
    />
  );
}
