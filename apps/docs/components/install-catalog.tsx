'use client';

// Everywhere Hanzo installs — the ONE place to find the snippet for the stack you
// already have, rather than reading a per-language SDK page and translating it.
//
// The counterpart to <ConnectorsCatalog/>, which answers "what can Hanzo connect
// TO"; this answers "what can I install Hanzo INTO". Same lazy-island pattern,
// rendered inline in the docs, never a link-out to a second site.
//
// Each entry carries the command or snippet that actually starts the work, so the
// catalog is usable without leaving the page: a framework that installs from npm
// shows the npm line, one that ships a tag shows the tag.
import { useMemo, useState } from 'react';
import { Text, XStack, YStack } from '@hanzo/gui';
import { Check, Copy } from '@hanzogui/lucide-icons-2';
import { Grid } from '@hanzo/ui/grid';
import { Chips } from '@/components/chips';
import { Field } from '@/components/field';
import { muted } from '@/lib/ink';

type Kind = 'web' | 'mobile' | 'server' | 'llm';

type Target = {
  id: string;
  label: string;
  kind: Kind;
  /** The line that starts the work — an install command, or the tag to paste. */
  install: string;
  /** Where the SDK's own page lives, when it has one. */
  docs?: string;
};

// Ordered by kind, then by how likely a reader is to be on it. The list is the
// same set the product's own install step offers, so a framework that works there
// is discoverable here and vice versa.
//
// Every line is a command a package registry answers for, or a line of the HTTP
// API (scripts/installs.test.ts). A name we do not hold is someone else's:
// `gem install hanzo` is a Heroku deploy tool and `flutter pub add hanzo` a
// git-hooks library, and both installed without complaint. A stack with nothing
// published has no row: Android and Elixir had lines that resolved nowhere, the
// WordPress, Shopify, Bubble, Segment, Zapier and n8n rows named listings that
// do not exist, and the HTML snippet loaded cdn.hanzo.ai/event.js, a 404.
const TARGETS: Target[] = [
  // Web
  { id: 'nextjs', label: 'Next.js', kind: 'web', install: 'npm i @hanzo/event', docs: '/docs/sdks/typescript' },
  { id: 'react', label: 'React', kind: 'web', install: 'npm i @hanzo/event', docs: '/docs/sdks/typescript' },
  { id: 'vue', label: 'Vue', kind: 'web', install: 'npm i @hanzo/event' },
  { id: 'svelte', label: 'Svelte', kind: 'web', install: 'npm i @hanzo/event' },
  { id: 'angular', label: 'Angular', kind: 'web', install: 'npm i @hanzo/event' },
  { id: 'astro', label: 'Astro', kind: 'web', install: 'npm i @hanzo/event' },
  { id: 'remix', label: 'Remix', kind: 'web', install: 'npm i @hanzo/event' },
  { id: 'nuxt', label: 'Nuxt', kind: 'web', install: 'npm i @hanzo/event' },
  { id: 'vite', label: 'Vite', kind: 'web', install: 'npm i @hanzo/event' },
  { id: 'tanstack', label: 'TanStack Start', kind: 'web', install: 'npm i @hanzo/event' },
  { id: 'docusaurus', label: 'Docusaurus', kind: 'web', install: 'npm i @hanzo/event' },

  // Mobile
  { id: 'ios', label: 'iOS', kind: 'mobile', install: '.package(url: "https://github.com/hanzo-swift/sdk", from: "8.0.0")', docs: '/docs/sdks/swift' },
  { id: 'react-native', label: 'React Native', kind: 'mobile', install: 'npm i @hanzo/event' },
  { id: 'flutter', label: 'Flutter', kind: 'mobile', install: 'flutter pub add hanzoai' },

  // Server
  { id: 'node', label: 'Node.js', kind: 'server', install: 'npm i @hanzo/event', docs: '/docs/sdks/typescript' },
  { id: 'python', label: 'Python', kind: 'server', install: 'pip install "hanzoai>=8"', docs: '/docs/sdks/python' },
  { id: 'go', label: 'Go', kind: 'server', install: 'go get github.com/hanzoai/go-sdk/v8', docs: '/docs/sdks/go' },
  { id: 'rust', label: 'Rust', kind: 'server', install: 'cargo add hanzo-client', docs: '/docs/sdks/rust' },
  { id: 'cpp', label: 'C++', kind: 'server', install: 'find_package(hanzo)', docs: '/docs/sdks/cpp' },
  { id: 'ruby', label: 'Ruby', kind: 'server', install: 'gem install hanzoai' },
  { id: 'rails', label: 'Ruby on Rails', kind: 'server', install: 'gem install hanzoai' },
  { id: 'php', label: 'PHP', kind: 'server', install: 'composer require hanzoai/hanzoai' },
  { id: 'laravel', label: 'Laravel', kind: 'server', install: 'composer require hanzoai/hanzoai' },
  { id: 'django', label: 'Django', kind: 'server', install: 'pip install "hanzoai>=8"', docs: '/docs/sdks/python' },
  { id: 'api', label: 'HTTP API', kind: 'server', install: 'POST https://api.hanzo.ai/v1/event', docs: '/docs/openapi' },

  // LLM
  { id: 'openai', label: 'OpenAI-compatible', kind: 'llm', install: 'base_url="https://api.hanzo.ai/v1"', docs: '/docs/openapi' },
  { id: 'anthropic', label: 'Anthropic-compatible', kind: 'llm', install: 'base_url="https://api.hanzo.ai/v1"', docs: '/docs/openapi' },
  { id: 'ai-sdk', label: 'Vercel AI SDK', kind: 'llm', install: 'npm i @hanzo/ai' },
  { id: 'langchain', label: 'LangChain', kind: 'llm', install: 'pip install "hanzoai>=8"' },
  { id: 'llamaindex', label: 'LlamaIndex', kind: 'llm', install: 'pip install "hanzoai>=8"' },
  { id: 'mcp', label: 'MCP', kind: 'llm', install: 'npx @hanzo/mcp', docs: '/docs/mcp' },
];

const KINDS: { value: Kind | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'web', label: 'Web' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'server', label: 'Server' },
  { value: 'llm', label: 'LLM' },
];

function Row({ t }: { t: Target }) {
  const [copied, setCopied] = useState(false);
  return (
    <YStack gap={8} p={14} rounded="$4" borderWidth={1} borderColor="$borderColor" bg="$panel">
      <XStack justify="space-between" items="center" gap={8}>
        <Text fontSize={14} fontWeight="500" color="$color12">
          {t.label}
        </Text>
        {t.docs ? (
          <Text render="a" href={t.docs} fontSize={12} {...muted} hoverStyle={{ textDecorationLine: 'underline' }}>
            docs
          </Text>
        ) : null}
      </XStack>
      <XStack
        render="button"
        type="button"
        aria-label={`Copy install for ${t.label}`}
        onPress={() => {
          void navigator.clipboard.writeText(t.install);
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        }}
        justify="space-between"
        items="center"
        gap={8}
        px={8}
        py={6}
        rounded="$2"
        borderWidth={1}
        borderColor="$borderColor"
        bg="$background"
        cursor="pointer"
      >
        <Text fontFamily="$mono" fontSize={12} numberOfLines={1} color="$color12">
          {t.install}
        </Text>
        {copied ? <Check size={13} color="$color11" /> : <Copy size={13} color="$color9" />}
      </XStack>
    </YStack>
  );
}

export function InstallCatalog() {
  const [q, setQ] = useState('');
  const [kind, setKind] = useState<Kind | 'all'>('all');

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return TARGETS.filter(
      (t) =>
        (kind === 'all' || t.kind === kind) &&
        (needle === '' || t.label.toLowerCase().includes(needle) || t.id.includes(needle)),
    );
  }, [q, kind]);

  return (
    <YStack gap={16}>
      <XStack gap={10} flexWrap="wrap" items="center">
        <YStack flex={1} minW={200}>
          <Field value={q} onChange={setQ} placeholder="Search frameworks and platforms" />
        </YStack>
        <Chips items={KINDS} value={kind} onChange={setKind} />
      </XStack>

      <Grid columns={{ min: 240 }} gap={12}>
        {shown.map((t) => (
          <Row key={t.id} t={t} />
        ))}
      </Grid>

      <Text fontSize={14} whiteSpace="normal" {...muted}>
        {shown.length === 0 ? `Nothing matches “${q}”. Every stack can use the ` : `${shown.length} of ${TARGETS.length}. Anything not listed reaches the same endpoints over the `}
        <Text render="a" href="/docs/openapi" color="$color12" textDecorationLine="underline">
          HTTP API
        </Text>
        .
      </Text>
    </YStack>
  );
}
