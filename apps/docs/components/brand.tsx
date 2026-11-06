'use client';

import Link from 'next/link';
import { XStack } from '@hanzo/gui';
import { HanzoWordmark } from '@hanzogui/shell';

/**
 * The wordmark at the top left (`Hanzo Docs`).
 * The H mark sits at the bottom-right corner (`components/corner.tsx`), matching hanzo.ai.
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
