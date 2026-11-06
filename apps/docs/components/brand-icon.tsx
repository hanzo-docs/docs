'use client';

import { XStack } from '@hanzo/gui';
import { getProviderIcon } from '@/components/provider-icons';

/**
 * Colorful SVG brand mark for a model family, model provider, coding agent, or connector.
 */
export function BrandIcon({
  name,
  size = 16,
  mono = false,
}: {
  name: string;
  size?: number;
  mono?: boolean;
}) {
  const { svg, color } = getProviderIcon(name);
  if (!svg) return null;
  const ink = mono || color === 'currentColor' ? '$color12' : (color as never);
  return (
    <XStack
      render="span"
      aria-hidden
      width={size}
      height={size}
      shrink={0}
      items="center"
      justify="center"
      color={ink}
      dangerouslySetInnerHTML={{ __html: svg.replace('<svg', '<svg width="100%" height="100%"') }}
    />
  );
}
