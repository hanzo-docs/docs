'use client';

import { Text, XStack, YStack } from '@hanzo/gui';
import { Grid } from '@hanzo/ui/grid';
import { PROVIDER_ICONS } from '@/components/provider-icons';
import { muted } from '@/lib/ink';

const PROVIDERS = [
  { key: 'hanzo', name: 'Zen', note: 'Open weights' },
  { key: 'openai', name: 'OpenAI', note: 'GPT' },
  { key: 'anthropic', name: 'Anthropic', note: 'Claude' },
  { key: 'google', name: 'Google', note: 'Gemini' },
  { key: 'qwen', name: 'Qwen', note: 'Open' },
  { key: 'meta', name: 'Llama', note: 'Open' },
  { key: 'deepseek', name: 'DeepSeek', note: 'Open' },
  { key: 'mistral', name: 'Mistral', note: 'Open' },
] as const;

/** The model families one key reaches, as their marks: four across, two on a phone. */
export function ProviderStrip() {
  return (
    <YStack rounded="$5" borderWidth={1} borderColor="$borderColor" bg="$borderColor" overflow="hidden">
      <Grid columns={{ min: 150, max: 4 }} gap={1}>
      {PROVIDERS.map(({ key, name, note }) => {
        const svg = PROVIDER_ICONS[key];
        if (!svg) return null;
        return (
          <YStack key={key} gap={8} p={16} bg="$background" hoverStyle={{ bg: '$hover' }}>
            <XStack
              aria-hidden
              width={24}
              height={24}
              color="$color12"
              dangerouslySetInnerHTML={{ __html: svg.replace('<svg', '<svg width="100%" height="100%"') }}
            />
            <YStack>
              <Text fontSize="$3" fontWeight="500" color="$color12">
                {name}
              </Text>
              <Text fontSize="$1" {...muted}>
                {note}
              </Text>
            </YStack>
          </YStack>
        );
      })}
      </Grid>
    </YStack>
  );
}
