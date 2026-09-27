'use client';

import { useEffect, useState } from 'react';
import { YStack } from '@hanzo/gui';
import { useThemeSetting } from '@hanzogui/next-theme';
import { Dots } from '@hanzo/ui/dots';

/**
 * The hero's halftone, as a client island — `Dots` takes its shape as a
 * function, and a function cannot cross the server/client boundary.
 *
 * The envelope is brightest at top centre and gone by the edges, so the field
 * stays dim where the type sits; one slow ring travels outward from behind the
 * headline, modulating the envelope between 0.6 and 1.0 and never switching a
 * dot off. Module scope, so the painting effect does not re-raster every render.
 */
const envelope = (x: number, y: number) => {
  const r = Math.hypot((x - 0.5) / 0.45, y / 0.5);
  return Math.max(0, 1 - r) ** 1.5;
};

const HERO = (x: number, y: number, t: number) =>
  envelope(x, y) * (0.8 + 0.2 * Math.cos(Math.hypot((x - 0.5) / 0.45, y / 0.5) * 6.5 - t * 0.5));

/** Reduced motion gets the still field, on the first paint too. */
function useStill() {
  const [still, setStill] = useState(true);
  useEffect(() => {
    const q = window.matchMedia('(prefers-reduced-motion: reduce)');
    const read = () => setStill(q.matches);
    read();
    q.addEventListener('change', read);
    return () => q.removeEventListener('change', read);
  }, []);
  return still;
}

/** Decorative: hidden from assistive tech, and it takes no pointer. The dots are
 *  the page's ink at low alpha, so the field reads on either ground. */
export function HeroField() {
  const still = useStill();
  const { resolvedTheme } = useThemeSetting();
  const ink = resolvedTheme === 'light' ? 'rgb(0 0 0 / 0.14)' : 'rgb(255 255 255 / 0.18)';
  return (
    <YStack aria-hidden pointerEvents="none" position="absolute" t={0} r={0} b={0} l={0} overflow="hidden">
      <Dots field={HERO} animate={!still} cell={7} color={ink} fade={{ top: 0.06, bottom: 0.45, left: 0.1, right: 0.1 }} />
    </YStack>
  );
}
