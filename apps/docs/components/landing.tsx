'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { Text, XStack, YStack } from '@hanzo/gui';
import {
  Activity,
  ArrowRight,
  Code2,
  Database,
  FileJson2,
  Globe,
  LayoutGrid,
  Package,
  Server,
  Shield,
  ShoppingCart,
  Sparkle,
  Terminal,
  Workflow,
} from '@hanzogui/lucide-icons-2';
import { Grid } from '@hanzo/ui/grid';
import { Action } from '@/components/action';
import { Agent } from '@/components/agent';
import { HeroField } from '@/components/hero-field';
import { muted } from '@/lib/ink';

/**
 * The front page, drawn on the theme like every other route: the headline and
 * the two ways in (install the CLI, or hand it to an agent), the three doors,
 * the quick start, the nine domains, the tools, the models, the CLI and Zen.
 *
 * The quick start's code is highlighted on the server and handed in, so the
 * page ships tokens rather than a highlighter.
 */

const domains = [
  { name: 'Identity & trust', desc: 'Who someone is, what they may touch, and where secrets stay safe. IAM, AuthZ, KMS, MPC, Zero-Trust.', Icon: Shield, href: '/docs/openapi/iam', tag: 'Identity' },
  { name: 'Intelligence', desc: 'The mind of the cloud — every model, agent, and tool you can call. Models, Agents, MCP, Embeddings, Prompts, GPUs, Functions.', Icon: Sparkle, href: '/docs/openapi/ai', tag: 'Intelligence' },
  { name: 'Data', desc: 'Somewhere to put your data and read it back fast. SQL, Vector, KV, Search, Object, Base, DocDB.', Icon: Database, href: '/docs/openapi/provisioning', tag: 'Data' },
  { name: 'Streams', desc: 'Move messages and run work in the background, reliably. PubSub, Tasks, Pipelines, Crawl.', Icon: Workflow, href: '/docs/openapi/pubsub', tag: 'Streams' },
  { name: 'Observability', desc: 'See exactly what your system is doing, live. Metrics, Logs, Traces, Sessions, Evals, Analytics.', Icon: Activity, href: '/docs/openapi/o11y', tag: 'Observe' },
  { name: 'Commerce', desc: 'Turn usage into money — meter it, price it, bill it, reward it. Commerce, Billing, Marketplace, Referrals.', Icon: ShoppingCart, href: '/docs/openapi/commerce', tag: 'Commerce' },
  { name: 'Platform', desc: 'Ship your code and run it anywhere. Gateway, Machines, Edge, Registry.', Icon: Server, href: '/docs/openapi/gateway', tag: 'Platform' },
  { name: 'Applications', desc: 'The finished products people use every day. Chat, Studio, Dev, Integrations, Apps.', Icon: LayoutGrid, href: '/docs/openapi/git', tag: 'Apps' },
  { name: 'Chain', desc: "The networks the cloud speaks to — enumerate them, call one, read a holder's balances. Web3, Explorer.", Icon: Globe, href: '/docs/openapi/web3', tag: 'Chain' },
];

const tools = [
  { name: 'The Network', desc: 'Run the whole cloud yourself', href: '/docs/network', Icon: Globe },
  { name: 'SDKs', desc: 'Python, TypeScript, Go, Rust, C++, Swift, Kotlin', href: '/docs/sdks', Icon: Code2 },
  { name: 'API Reference', desc: 'Every /v1 endpoint, live', href: '/docs/openapi', Icon: FileJson2 },
  { name: 'Architecture', desc: 'One binary, one contract', href: '/docs/architecture', Icon: Package },
];

const doors = [
  { eyebrow: 'No code', title: 'Build with App', body: 'Describe it in English and watch it build. Chat, agents and MCP tools in the browser.', href: 'https://hanzo.app' },
  { eyebrow: 'In your terminal', title: 'Build with Dev', body: 'Our coding agent, in your repo. Or bring Claude Code and Codex — they work here too.', href: '/docs/cli' },
  { eyebrow: 'Lower level', title: 'Build with API', body: 'Over 400 models behind one REST endpoint, with SDKs for every language we ship.', href: '/docs/openapi' },
];

const providers = [
  { name: 'Zen', spec: 'Open weights' },
  { name: 'OpenAI', spec: 'GPT' },
  { name: 'Anthropic', spec: 'Claude' },
  { name: 'Qwen', spec: 'Open' },
  { name: 'Llama', spec: 'Open' },
  { name: 'DeepSeek', spec: 'Open' },
  { name: 'Mistral', spec: 'Open' },
  { name: 'Gemma', spec: 'Open' },
];

const surfaces = [
  {
    Icon: Code2,
    title: 'SDKs in every language',
    body: 'Generated from one contract — the same /v1 surface, typed for your stack.',
    chips: ['Python', 'TypeScript', 'Go', 'Rust', 'C++', 'Dart'],
    href: '/docs/sdks',
    cta: 'SDK reference',
  },
  {
    Icon: Workflow,
    title: 'Every tool, one MCP surface',
    body: 'Native connectors + the open MCP registry — Slack, GitHub, Notion, Stripe, and more — exposed as MCP tools any agent can call.',
    chips: ['Slack', 'GitHub', 'Notion', 'Stripe', 'Google', 'Linear', '+700 more'],
    href: '/docs/mcp',
    cta: 'MCP tools',
  },
];

const commands = [
  { cmd: 'hanzo chat', desc: 'Chat with any model interactively' },
  { cmd: 'hanzo models list', desc: 'Browse every available model' },
  { cmd: 'hanzo keys create', desc: 'Create and manage API keys' },
  { cmd: 'hanzo deploy', desc: 'Deploy apps with git push' },
  { cmd: 'hanzo logs', desc: 'Stream logs from any service' },
  { cmd: 'hanzo storage', desc: 'Manage S3-compatible storage' },
  { cmd: 'hanzo secrets', desc: 'Manage secrets and env vars' },
  { cmd: 'hanzo bot', desc: 'Deploy and manage AI bots' },
  { cmd: 'hanzo flow', desc: 'Run workflow automations' },
];

const zen = [
  { name: 'zen6', spec: '27B dense, 1M context' },
  { name: 'zen6-coder', spec: 'Agentic code' },
  { name: 'zen6-flash', spec: 'Ternary vision' },
  { name: 'zen5', spec: 'Hosted' },
  { name: 'zen-embedding', spec: 'Retrieval' },
  { name: 'zen-guard', spec: 'Safety' },
];

const CARD = { rounded: 16, borderWidth: 1, borderColor: '$borderColor', bg: '$panel' } as const;

function go(href: string) {
  return /^https?:/.test(href) ? <a href={href} target="_blank" rel="noreferrer" /> : <Link href={href} prefetch={false} />;
}

function Section({ title, lead, children }: { title: string; lead: string; children: ReactNode }) {
  return (
    <YStack render="section" gap={8}>
      <Text render="h2" fontSize={30} lineHeight={36} fontWeight="700" letterSpacing={-0.6} color="$color12">
        {title}
      </Text>
      <Text fontSize={14} mb={20} whiteSpace="normal" {...muted}>
        {lead}
      </Text>
      {children}
    </YStack>
  );
}

function Tile({ name, spec, mono = false }: { name: string; spec: string; mono?: boolean }) {
  return (
    <YStack {...CARD} rounded={10} px={14} py={12} gap={3}>
      <Text fontSize={12} fontWeight="600" fontFamily={mono ? '$mono' : '$body'} color="$color12">
        {name}
      </Text>
      <Text fontSize={11} {...muted}>
        {spec}
      </Text>
    </YStack>
  );
}

export function Landing({ install, use }: { install: ReactNode; use: ReactNode }) {
  return (
    <YStack render="main" minW={0} pb={48}>
      {/* The hero, centred over its halftone. */}
      <YStack position="relative" items="center" px={24} pt={120} pb={80} $max-md={{ pt: 72, pb: 56 }}>
        <HeroField />
        <XStack
          render={<Link href="/docs/models" prefetch={false} />}
          position="relative"
          items="center"
          gap={8}
          mb={32}
          px={16}
          py={8}
          rounded={999}
          borderWidth={1}
          borderColor="$borderColor"
          bg="$panel"
          hoverStyle={{ borderColor: '$color8' }}
        >
          <YStack width={6} height={6} rounded={999} bg="$color12" />
          <Text fontSize={14} {...muted}>
            Zen generates · Enso routes · Kai decides
          </Text>
          <ArrowRight size={14} color="$color10" />
        </XStack>
        <Text
          render="h1"
          position="relative"
          text="center"
          fontSize={72}
          lineHeight={72}
          fontWeight="700"
          letterSpacing={-1.8}
          color="$color12"
          maxW={760}
          $max-lg={{ fontSize: 60, lineHeight: 60 }}
          $max-md={{ fontSize: 44, lineHeight: 46, letterSpacing: -1 }}
        >
          Build anything with Hanzo.
        </Text>
        <Text
          render="p"
          position="relative"
          mt={20}
          maxW={576}
          text="center"
          fontSize={19}
          lineHeight={30}
          whiteSpace="normal"
          {...muted}
          $max-md={{ fontSize: 17, lineHeight: 27 }}
        >
          Every model. Every tool. One key. Start in the browser, ship from your terminal, and when you want it on your own hardware, take the whole thing with you — it is the same software we run in production.
        </Text>

        {/* The main call: install the CLI. */}
        <YStack position="relative" mt={40} width="100%" maxW={512} gap={12} items="center">
          <XStack {...CARD} width="100%" p={4}>
            <XStack flex={1} gap={12} items="center" px={20} py={16} rounded={12} bg="$background">
              <Text fontFamily="$mono" fontSize={14} select="none" {...muted}>
                $
              </Text>
              <Text fontFamily="$mono" fontSize={14} color="$color12">
                curl hanzo.sh | sh
              </Text>
            </XStack>
          </XStack>
          <Text fontSize={12} text="center" whiteSpace="normal" {...muted}>
            Installs the <Text fontFamily="$mono">hanzo</Text> CLI. Then <Text fontFamily="$mono">hanzo auth login</Text> to get a
            key.
          </Text>
        </YStack>

        {/* The other way in: hand it to an agent. */}
        <YStack position="relative" mt={24} gap={8} items="center">
          <Agent />
          <Text fontSize={12} text="center" whiteSpace="normal" {...muted}>
            Or hand this to your agent — it installs the CLI, the MCP server and the{' '}
            <Text render="a" href="https://hanzoskills.com" target="_blank" rel="noreferrer" color="$color12" textDecorationLine="underline">
              skills
            </Text>
            , then points its own model calls at Hanzo.
          </Text>
        </YStack>

        {/* The three doors, in descending order of how much you type. */}
        <YStack position="relative" mt={48} width="100%" maxW={896}>
          <Grid columns={{ min: 260, max: 3 }} gap={16}>
            {doors.map((d) => (
              <YStack key={d.title} render={go(d.href)} {...CARD} p={24} gap={6} hoverStyle={{ bg: '$hover', borderColor: '$color8' }}>
                <Text fontSize={12} fontWeight="500" {...muted}>
                  {d.eyebrow}
                </Text>
                <XStack gap={6} items="center">
                  <Text fontSize={18} fontWeight="600" color="$color12">
                    {d.title}
                  </Text>
                  <ArrowRight size={16} color="$color10" />
                </XStack>
                <Text fontSize={14} lineHeight={22} whiteSpace="normal" {...muted}>
                  {d.body}
                </Text>
              </YStack>
            ))}
          </Grid>
        </YStack>
      </YStack>

      <YStack width="100%" maxW={1024} self="center" px={32} gap={96} $max-md={{ px: 20, gap: 72 }}>
        <Section title="Quick Start" lead="Install the CLI, log in, and reach every capability from your terminal.">
          <YStack gap={20}>
            {install}
            <Text fontSize={14} whiteSpace="normal" {...muted}>
              Sign in once, then reach every capability from the terminal — or from any SDK, over HTTP, or through MCP.
            </Text>
            {use}
          </YStack>
        </Section>

        <Section title="One binary. The whole platform." lead="Every capability has one name and one route. Browse by domain — click any card to go deep.">
          <Grid columns={{ min: 220, max: 3 }} gap={12}>
            {domains.map(({ name, desc, Icon, href, tag }) => (
              <YStack key={name} render={<Link href={href} prefetch={false} />} {...CARD} p={24} gap={8} minH={140} hoverStyle={{ bg: '$hover', borderColor: '$color8' }}>
                <XStack justify="space-between" items="center" mb={4}>
                  <XStack p={8} rounded={12} bg="$hover">
                    <Icon size={18} color="$color11" />
                  </XStack>
                  <Text fontSize={11} fontWeight="500" {...muted}>
                    {tag}
                  </Text>
                </XStack>
                <Text fontSize={14} fontWeight="600" color="$color12">
                  {name}
                </Text>
                <Text flex={1} fontSize={12} lineHeight={19} whiteSpace="normal" {...muted}>
                  {desc}
                </Text>
                <XStack gap={4} items="center">
                  <Text fontSize={11} fontWeight="500" {...muted}>
                    View docs
                  </Text>
                  <ArrowRight size={12} color="$color10" />
                </XStack>
              </YStack>
            ))}
          </Grid>
        </Section>

        <Section title="Developer Tools" lead="SDKs, APIs, and protocols for every stack.">
          <Grid columns={{ min: 230, max: 4 }} gap={16}>
            {tools.map(({ name, desc, href, Icon }) => (
              <YStack key={name} render={<Link href={href} prefetch={false} />} {...CARD} p={24} gap={4} hoverStyle={{ bg: '$hover', borderColor: '$color8' }}>
                <XStack mb={10}>
                  <Icon size={18} color="$color11" />
                </XStack>
                <Text fontSize={14} fontWeight="600" color="$color12">
                  {name}
                </Text>
                <Text fontSize={12} whiteSpace="normal" {...muted}>
                  {desc}
                </Text>
              </YStack>
            ))}
          </Grid>
        </Section>

        <Section title="Every model, one API" lead="Over 400 models across every major provider — call any of them with one credential, one request shape.">
          <Grid columns={{ min: 120, max: 8 }} gap={12}>
            {providers.map((p) => (
              <Tile key={p.name} name={p.name} spec={p.spec} />
            ))}
          </Grid>
        </Section>

        <Grid columns={{ min: 470, max: 2 }} gap={16}>
          {surfaces.map(({ Icon, title, body, chips, href, cta }) => (
            <YStack key={title} {...CARD} p={32} gap={10} items="flex-start" $max-md={{ p: 24 }}>
              <XStack gap={12} items="center">
                <Icon size={18} color="$color11" />
                <Text fontSize={20} fontWeight="700" letterSpacing={-0.4} color="$color12">
                  {title}
                </Text>
              </XStack>
              <Text fontSize={13} mb={8} whiteSpace="normal" {...muted}>
                {body}
              </Text>
              <XStack flexWrap="wrap" gap={8}>
                {chips.map((c) => (
                  <Text key={c} fontSize={12} px={12} py={6} rounded={999} borderWidth={1} borderColor="$borderColor" bg="$background" {...muted}>
                    {c}
                  </Text>
                ))}
              </XStack>
              <XStack render={<Link href={href} prefetch={false} />} mt={12} gap={4} items="center">
                <Text fontSize={12} fontWeight="500" color="$color12">
                  {cta}
                </Text>
                <ArrowRight size={12} color="$color12" />
              </XStack>
            </YStack>
          ))}
        </Grid>

        {/* What the CLI can do. */}
        <YStack {...CARD} p={40} gap={24} $max-md={{ p: 24 }}>
          <XStack gap={12} items="center">
            <XStack p={10} rounded={12} bg="$hover">
              <Terminal size={18} color="$color11" />
            </XStack>
            <YStack gap={2} flex={1} minW={0}>
              <Text fontSize={24} fontWeight="700" letterSpacing={-0.5} color="$color12">
                The <Text fontFamily="$mono">hanzo</Text> CLI
              </Text>
              <Text fontSize={12} whiteSpace="normal" {...muted}>
                A ~15 MB Rust client for any live cloud — prod, laptop, or self-host
              </Text>
            </YStack>
          </XStack>
          <Grid columns={{ min: 200, max: 3 }} gap={12}>
            {commands.map((c) => (
              <Tile key={c.cmd} name={c.cmd} spec={c.desc} mono />
            ))}
          </Grid>
        </YStack>

        {/* Zen. */}
        <YStack {...CARD} p={40} gap={24} $max-md={{ p: 24 }}>
          <XStack gap={12} items="center">
            <Sparkle size={18} color="$color11" />
            <Text fontSize={24} fontWeight="700" letterSpacing={-0.5} color="$color12">
              Zen
            </Text>
            <Text fontFamily="$mono" fontSize={12} px={8} py={2} rounded={999} bg="$hover" {...muted}>
              open weights
            </Text>
          </XStack>
          <Text fontSize={14} lineHeight={22} maxW={672} whiteSpace="normal" {...muted}>
            The generative family: reasoning, code, vision, speech, embeddings and safety. Weights on Hugging Face; the same ids hosted on api.hanzo.ai, routed by Enso.
          </Text>
          <Grid columns={{ min: 130, max: 6 }} gap={12}>
            {zen.map((m) => (
              <Tile key={m.name} name={m.name} spec={m.spec} mono />
            ))}
          </Grid>
          <XStack flexWrap="wrap" gap={12} items="center">
            <Action tone="line" render={<Link href="/docs/models/zen" prefetch={false} />} rounded={999}>
              Zen models →
            </Action>
            <Text render="a" href="https://huggingface.co/zenlm" target="_blank" rel="noreferrer noopener" fontSize={12} {...muted} hoverStyle={{ color: '$color12' }}>
              HuggingFace →
            </Text>
          </XStack>
        </YStack>

        {/* The close. */}
        <YStack render="section" items="center" gap={12} py={48}>
          <Text render="h2" fontSize={36} lineHeight={42} fontWeight="700" letterSpacing={-0.8} color="$color12" text="center">
            Start building
          </Text>
          <Text fontSize={14} text="center" {...muted}>
            Free tier with generous limits. No credit card required.
          </Text>
          <Text fontFamily="$mono" fontSize={14} mb={20} {...muted}>
            curl hanzo.sh | sh
          </Text>
          <XStack flexWrap="wrap" gap={12} justify="center">
            <Action tone="loud" render="a" href="https://hanzo.id/signup?redirect_uri=https://console.hanzo.ai" height={44} px={28} rounded={999}>
              Sign up free
            </Action>
            <Action tone="line" render={<Link href="/docs" prefetch={false} />} height={44} px={28} rounded={999}>
              Browse documentation
            </Action>
          </XStack>
        </YStack>
      </YStack>
    </YStack>
  );
}
