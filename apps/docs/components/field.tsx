'use client';

import { Input, XStack } from '@hanzo/gui';
import { Search } from '@hanzogui/lucide-icons-2';

/** A filter field: a glass and a one-line input, for the catalogs. */
export function Field({
  value,
  onChange,
  placeholder,
  width,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  width?: number;
}) {
  return (
    <XStack
      items="center"
      gap={8}
      px={10}
      height={36}
      rounded="$3"
      borderWidth={1}
      borderColor="$borderColor"
      bg="$background"
      width={width ?? '100%'}
      $max-sm={{ width: '100%' }}
    >
      <Search size={14} color="$color10" />
      <Input
        unstyled
        flex={1}
        minW={0}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="$color10"
        fontSize={14}
        color="$color12"
        bg="transparent"
        borderWidth={0}
        aria-label={placeholder}
      />
    </XStack>
  );
}
