'use client';

import Link from 'next/link';
import { XStack } from '@hanzo/gui';
import { HanzoWordmark } from '@hanzogui/shell';

/**
 * Wordmark only at the top left (`Hanzo Docs`).
 * The H mark lives exclusively in the bottom-right corner (`components/corner.tsx`).
 */
export function Brand() {
  return (
    <XStack
      render={<Link href="/" prefetch={false} aria-label="Hanzo Docs, home" />}
      items="center"
      color="$color12"
      minW={0}
    >
      <HanzoWordmark label="Hanzo Docs" size={22} brandMenu />
    </XStack>
  );
}
