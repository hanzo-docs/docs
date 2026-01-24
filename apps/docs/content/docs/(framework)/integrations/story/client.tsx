'use client';
import { Callout } from '@hanzo/docs-radix-ui/components/callout';
import { ComponentProps } from 'react';

export function CalloutStory(
  props: Pick<ComponentProps<typeof Callout>, 'title' | 'type' | 'children'>,
) {
  return (
    <div className="p-3 bg-fd-background border rounded-md">
      <Callout {...props} />
    </div>
  );
}
