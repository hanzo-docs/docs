'use client';

import type { ReactNode } from 'react';
import { Spinner, Text, YStack } from '@hanzo/gui';
import { muted } from '@/lib/ink';

/**
 * A whole-screen word from the sign-in routes: a spinner while IAM answers, or
 * what went wrong and the one thing to do about it.
 */
export function Status({ title, note, action }: { title?: string; note: string; action?: ReactNode }) {
  return (
    <YStack minH="100dvh" items="center" justify="center" gap={10} px={20} bg="$background">
      {title ? (
        <Text fontSize={18} fontWeight="600" color="$color12">
          {title}
        </Text>
      ) : (
        <Spinner size="small" color="$color12" />
      )}
      <Text fontSize="$3" text="center" {...muted}>
        {note}
      </Text>
      {action}
    </YStack>
  );
}
