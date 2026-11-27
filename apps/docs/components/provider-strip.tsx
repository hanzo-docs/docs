'use client';

import Link from 'next/link';
import { Text, XStack, YStack } from '@hanzo/gui';
import { Grid } from '@hanzo/ui/grid';
import { BrandIcon } from '@/components/brand-icon';
import { muted } from '@/lib/ink';

const PROVIDERS = [
  { key: 'enso', name: 'Enso', note: 'Adaptive router', href: '/docs/models/enso' },
  { key: 'kai', name: 'Kai', note: 'Typed decisions', href: '/docs/models/kai' },
  { key: 'zen', name: 'Zen', note: 'Open weights', href: '/docs/models/zen' },
  { key: 'hanzo', name: 'Hanzo', note: 'OSS Cloud & AI', href: '/docs/architecture' },
  { key: 'openai', name: 'OpenAI', note: 'GPT & o-series', href: '/docs/models' },
  { key: 'anthropic', name: 'Anthropic', note: 'Claude', href: '/docs/models' },
  { key: 'google', name: 'Google Gemini', note: 'Gemini', href: '/docs/models' },
  { key: 'x-ai', name: 'xAI / Grok', note: 'Grok', href: '/docs/models' },
  { key: 'meta-llama', name: 'Meta Llama', note: 'Llama Open', href: '/docs/models' },
  { key: 'qwen', name: 'Qwen', note: 'Qwen3 & Coder', href: '/docs/models' },
  { key: 'deepseek', name: 'DeepSeek', note: 'R1 & V3', href: '/docs/models' },
  { key: 'mistral', name: 'Mistral', note: 'Mistral & Codestral', href: '/docs/models' },
  { key: 'moonshotai', name: 'Moonshot / Kimi', note: 'Kimi K2', href: '/docs/models' },
  { key: 'z-ai', name: 'Zhipu / GLM', note: 'GLM Open', href: '/docs/models' },
  { key: 'minimax', name: 'MiniMax', note: 'Text & Speech', href: '/docs/models' },
  { key: 'nvidia', name: 'NVIDIA & Cohere', note: 'Nemotron & Command', href: '/docs/models' },
] as const;

const AGENTS_AND_BOTS = [
  { key: 'hanzo-dev', name: 'Hanzo Dev', note: 'Terminal coding agent', href: '/docs/dev' },
  { key: 'hanzo-bot', name: 'Hanzo Bot', note: 'Autonomous team bots', href: '/docs/apps/comms' },
  { key: 'hanzo-ide', name: 'Hanzo IDE', note: 'Agentic desktop IDE', href: '/docs/apps/ides' },
  { key: 'claudecode', name: 'Claude Code', note: 'Gateway + MCP', href: '/docs/guides/coding/claude-code' },
  { key: 'codex', name: 'OpenAI Codex', note: 'Gateway + MCP', href: '/docs/guides/coding/codex' },
  { key: 'cursor', name: 'Cursor', note: 'AI code editor', href: '/docs/guides/coding/cursor' },
  { key: 'gemini-cli', name: 'Gemini CLI', note: 'Terminal agent', href: '/docs/guides/coding' },
  { key: 'antigravity', name: 'Antigravity', note: 'Agentic IDE', href: '/docs/guides/coding/antigravity' },
  { key: 'windsurf', name: 'Windsurf', note: 'Cascade + MCP', href: '/docs/guides/coding/windsurf' },
  { key: 'vscode', name: 'VS Code', note: 'Extension + MCP', href: '/docs/guides/coding/vscode' },
  { key: 'zed', name: 'Zed', note: 'Native ACP + MCP', href: '/docs/dev/integrations/zed' },
  { key: 'openclaw', name: 'OpenClaw', note: 'Autonomous agent', href: '/docs/guides/coding/openclaw' },
  { key: 'langgraph', name: 'LangGraph', note: 'Stateful workflows', href: '/docs/guides/integrations/langgraph' },
  { key: 'vercel-ai-sdk', name: 'Vercel AI SDK', note: 'Streaming TypeScript', href: '/docs/guides/integrations/vercel-ai-sdk' },
  { key: 'discord', name: 'Discord & Slack', note: 'Workspace bots', href: '/docs/skills' },
  { key: 'telegram', name: 'Telegram Bots', note: '24/7 chat agents', href: '/docs/skills' },
] as const;

/**
 * Full-color model families, frontier/open-weight providers, and integrated
 * coding agents, IDEs & bots — 16 per grid (4x4), zero empty cells.
 */
export function ProviderStrip() {
  return (
    <YStack gap={14}>
      <YStack rounded="$5" borderWidth={1} borderColor="$borderColor" bg="$borderColor" overflow="hidden">
        <XStack px={16} py={10} bg="$panel" justify="space-between" items="center" flexWrap="wrap" gap={8}>
          <Text fontSize="$2" fontWeight="600" color="$color12">
            500+ Models &amp; Families — One API Key
          </Text>
          <Text fontSize="$1" {...muted}>
            Enso routes · Kai decides · Zen open weights · Frontier &amp; open providers
          </Text>
        </XStack>
        <Grid columns={{ min: 155, max: 4 }} gap={1}>
          {PROVIDERS.map(({ key, name, note, href }) => (
            <XStack
              key={key}
              render={<Link href={href} prefetch={false} />}
              gap={12}
              p={14}
              bg="$background"
              items="center"
              hoverStyle={{ bg: '$hover' }}
            >
              <XStack width={28} height={28} rounded={7} bg="$panel" borderWidth={1} borderColor="$borderColor" items="center" justify="center" shrink={0}>
                <BrandIcon name={key} size={18} />
              </XStack>
              <YStack minW={0} flex={1}>
                <Text fontSize="$2" fontWeight="600" color="$color12" numberOfLines={1}>
                  {name}
                </Text>
                <Text fontSize="$1" numberOfLines={1} {...muted}>
                  {note}
                </Text>
              </YStack>
            </XStack>
          ))}
        </Grid>
      </YStack>

      <YStack rounded="$5" borderWidth={1} borderColor="$borderColor" bg="$borderColor" overflow="hidden">
        <XStack px={16} py={10} bg="$panel" justify="space-between" items="center" flexWrap="wrap" gap={8}>
          <Text fontSize="$2" fontWeight="600" color="$color12">
            Integrated Agents, IDEs &amp; Bots
          </Text>
          <Text fontSize="$1" {...muted}>
            Click any agent, editor, framework, or bot for one-command gateway &amp; HIP-0300 MCP setup
          </Text>
        </XStack>
        <Grid columns={{ min: 155, max: 4 }} gap={1}>
          {AGENTS_AND_BOTS.map(({ key, name, note, href }) => (
            <XStack
              key={key}
              render={<Link href={href} prefetch={false} />}
              gap={12}
              p={14}
              bg="$background"
              items="center"
              hoverStyle={{ bg: '$hover' }}
            >
              <XStack width={28} height={28} rounded={7} bg="$panel" borderWidth={1} borderColor="$borderColor" items="center" justify="center" shrink={0}>
                <BrandIcon name={key} size={18} />
              </XStack>
              <YStack minW={0} flex={1}>
                <Text fontSize="$2" fontWeight="600" color="$color12" numberOfLines={1}>
                  {name}
                </Text>
                <Text fontSize="$1" numberOfLines={1} {...muted}>
                  {note}
                </Text>
              </YStack>
            </XStack>
          ))}
        </Grid>
      </YStack>
    </YStack>
  );
}
