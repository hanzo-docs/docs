'use client';

import Link from 'next/link';
import { XStack } from '@hanzo/gui';
import { HanzoMark, HanzoWordmark } from '@hanzogui/shell';

/**
 * Official @hanzo/logo 67x67 H-ribbon mark + wordmark at the top left (`Hanzo Docs`).
 */
export function Brand() {
  return (
    <XStack
      render={<Link href="/" prefetch={false} aria-label="Hanzo Docs, home" />}
      items="center"
      gap={9}
      color="$color12"
      minW={0}
    >
      <HanzoMark size={19} brandMenu />
      <HanzoWordmark label="Hanzo Docs" size={21} brandMenu />
    </XStack>
  );
}
