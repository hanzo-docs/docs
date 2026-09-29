'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Text, XStack } from '@hanzo/gui';
import { ChevronsUpDown } from '@hanzogui/lucide-icons-2';
import { DropdownMenu } from '@hanzo/ui';
import { Action } from '@/components/action';
import { currentUser, iam, type DocsUser } from '@/lib/iam';
import { muted } from '@/lib/ink';

const CONSOLE = 'https://platform.hanzo.ai';

/**
 * Who is signed in, asked once per page load and shared by the rail, the bar and
 * the org chip — three questions would be three userinfo calls that can answer
 * differently. Signed-out is what renders until IAM answers, so a promise that
 * never settles leaves a working "Sign in" rather than a hole.
 */
let asked: Promise<DocsUser | null> | undefined;

function useUser(): [DocsUser | null, (u: DocsUser | null) => void] {
  const [user, setUser] = useState<DocsUser | null>(null);
  useEffect(() => {
    let live = true;
    (asked ??= currentUser()).then((u) => live && setUser(u));
    return () => {
      live = false;
    };
  }, []);
  return [user, setUser];
}

function signOut(done: () => void) {
  // The SDK owns the token store and clears every key it wrote.
  iam()
    .logout()
    .catch(() => iam().clearTokens())
    .finally(() => {
      done();
      window.location.reload();
    });
}

/**
 * The account, at the foot of the rail: sign in and get a key side by side, or
 * who you are with a menu. The rail is a column, so the long label fits here
 * and nowhere in the 56px bar.
 */
export function Account() {
  const [user, setUser] = useUser();

  if (!user)
    return (
      <XStack gap={8}>
        <Action tone="line" flex={1} render={<Link href="/login" prefetch={false} />}>
          Sign in
        </Action>
        <Action tone="loud" flex={2} render="a" href={CONSOLE}>
          Get an API key
        </Action>
      </XStack>
    );

  const label = user.name || user.email || 'Account';
  return (
    <DropdownMenu
      placement="top-start"
      trigger={
        <XStack
          render="button"
          type="button"
          height={40}
          px={8}
          gap={10}
          rounded="$3"
          items="center"
          bg="transparent"
          borderWidth={0}
          cursor="pointer"
          hoverStyle={{ bg: '$hover' }}
        >
          <Initial name={label} />
          <Text flex={1} minW={0} fontSize="$2" color="$color12" numberOfLines={1} text="left">
            {label}
          </Text>
          <ChevronsUpDown size={14} color="$color10" />
        </XStack>
      }
      items={[
        { key: 'console', label: 'Console', onSelect: () => window.location.assign(CONSOLE) },
        { key: 'settings', label: 'Account settings', onSelect: () => window.location.assign(`${CONSOLE}/settings`) },
        { type: 'separator' },
        { key: 'out', label: 'Sign out', onSelect: () => signOut(() => setUser(null)) },
      ]}
    />
  );
}

/**
 * The same control in the bar, for when the rail is not on screen: on a phone,
 * and on a desktop that collapsed it. Short labels, because the bar is one row.
 */
export function Short() {
  const [user] = useUser();

  if (user)
    return (
      <XStack render="a" href={CONSOLE} title={user.name || user.email || 'Account'} rounded={999}>
        <Initial name={user.name || user.email || 'A'} />
      </XStack>
    );

  return (
    <XStack gap={8} items="center">
      <Action tone="quiet" render={<Link href="/login" prefetch={false} />} $max-sm={{ display: 'none' }}>
        Sign in
      </Action>
      <Action tone="loud" render="a" href={CONSOLE}>
        API key
      </Action>
    </XStack>
  );
}

/**
 * The organization the reader acts in. It is what is wrong when a curl from
 * these pages answers 403, so it stays in view. Nothing for a signed-out reader.
 */
export function Org() {
  const [user] = useUser();
  if (!user?.owner) return null;
  return (
    <Text
      title={`Signed in to ${user.owner}`}
      fontSize="$1"
      lineHeight={16}
      {...muted}
      px={10}
      py={4}
      rounded={999}
      borderWidth={1}
      borderColor="$borderColor"
      numberOfLines={1}
      $max-md={{ display: 'none' }}
    >
      {user.owner}
    </Text>
  );
}

function Initial({ name }: { name: string }) {
  return (
    <XStack width={26} height={26} rounded={999} bg="$color12" items="center" justify="center" shrink={0}>
      <Text fontSize={11} fontWeight="600" color="$background">
        {name.slice(0, 1).toUpperCase()}
      </Text>
    </XStack>
  );
}
