'use client';

import { Text, XStack } from '@hanzo/gui';
import { loud, muted } from '@/lib/ink';

/** One-of-several filter, as a row of pills; the chosen one is outlined. */
export function Chips<T extends string | undefined>({
  items,
  value,
  onChange,
}: {
  items: readonly { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <XStack gap={6} flexWrap="wrap">
      {items.map((item) => {
        const on = item.value === value;
        return (
          <Text
            key={item.label}
            render="button"
            type="button"
            onPress={() => onChange(item.value)}
            aria-pressed={on}
            fontSize={12}
            lineHeight={18}
            px={10}
            py={3}
            rounded={999}
            borderWidth={1}
            borderColor={on ? '$color12' : '$borderColor'}
            bg="transparent"
            cursor="pointer"
            {...(on ? loud : muted)}
          >
            {item.label}
          </Text>
        );
      })}
    </XStack>
  );
}
