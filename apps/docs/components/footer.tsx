'use client';

import { YStack } from '@hanzo/gui';
import { HanzoFooter, HanzoPreFooterCTA } from '@hanzogui/shell';

/**
 * The shared ecosystem footer, byte-identical across every Hanzo property, and
 * on the front page and the blog the pre-footer call to action above it.
 *
 * Both are drawn by @hanzogui/shell for a dark ground with a fixed white ink,
 * so they sit on the dark ground in both themes — on a light page the
 * pre-footer's heading measured 2.38:1 against the body. Docs is not itself a
 * flagship product, so no `currentProductId`.
 */
export function Footer({ cta = false }: { cta?: boolean }) {
  return (
    <YStack bg="#0a0a0a">
      {cta && <HanzoPreFooterCTA surface="hanzo.ai" />}
      <HanzoFooter />
    </YStack>
  );
}
