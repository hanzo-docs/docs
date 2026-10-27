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
  Route,
  Scale,
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
import {
  agentNote,
  type Catalogue,
  catalogueCard,
  cli,
  close,
  counted,
  domains,
  doors,
  families,
  hero,
  platform,
  providerSection,
  providers,
  quickstart,
  surfaces,
  tooling,
  tools,
  zen,
} from '@/lib/landing';

/**
 * The front page, drawn on the theme like every other route: the headline, the
 * three model families and the catalogue, the two ways in (install the CLI, or
 * hand it to an agent), the three doors, the quick start, the nine domains, the
 * tools, the models, the CLI and Zen.
 *
 * The quick start's code is highlighted on the server and handed in, so the
 * page ships tokens rather than a highlighter.
 */

const ICONS = { Activity, Code2, Database, FileJson2, Globe, LayoutGrid, Package, Server, Shield, ShoppingCart, Sparkle, Workflow };

/** Text with `backticks`, the backticked runs set in the mono face. */
function mono(text: string): ReactNode {
  return text.split('`').map((part, i) => (i % 2 ? <Mono key={i}>{part}</Mono> : part));
}

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

function Mono({ children }: { children: ReactNode }) {
  return (
    <Text fontFamily="$mono" fontSize={12} color="$color12" whiteSpace="nowrap">
      {children}
    </Text>
  );
}

/**
 * Three peers in one row, or one column — never two and an orphan. A track's
 * floor is a third of the row once the row holds three cards of 220px and
 * their gaps (692px), and the whole row below that: `(692px - 100%) * 999` is
 * negative above the threshold and huge below it, so the width alone picks
 * three columns or one.
 */
const TRIO = 'repeat(auto-fit, minmax(min(100%, max(calc((100% - 32px) / 3), calc((692px - 100%) * 999))), 1fr))';

/** Enso, Kai and Zen, then the whole catalogue as one wide door beneath them. */
function Families({ catalogue }: { catalogue: Catalogue }) {
  const icon = { Enso: Route, Kai: Scale, Zen: Sparkle } as const;
  const all = catalogueCard(catalogue);
  return (
    <YStack render="section" aria-label="Hanzo models" width="100%" gap={16}>
      <Grid columns={TRIO} gap={16}>
        {families(catalogue).map(({ name, verb, body, docs, site }) => {
          const Icon = icon[name as keyof typeof icon];
          return (
          <YStack key={name} render="article" {...CARD} p={24} gap={10} minW={0}>
            <XStack gap={10} items="center">
              <XStack p={8} rounded={12} bg="$hover">
                <Icon size={18} color="$color11" />
              </XStack>
              <Text render="h2" fontSize={20} lineHeight={26} fontWeight="700" letterSpacing={-0.4} color="$color12">
                {name} {verb}.
              </Text>
            </XStack>
            <Text flex={1} fontSize={14} lineHeight={22} whiteSpace="normal" {...muted}>
              {mono(body)}
            </Text>
            <XStack gap={16} items="center" flexWrap="wrap">
              <XStack render={<Link href={docs} prefetch={false} />} gap={4} items="center">
                <Text fontSize={13} fontWeight="600" color="$color12">
                  Docs
                </Text>
                <ArrowRight size={13} color="$color12" />
              </XStack>
              <Text render="a" href={site} target="_blank" rel="noreferrer" fontSize={13} {...muted} hoverStyle={{ color: '$color12' }}>
                {site.replace('https://', '')} ↗
              </Text>
            </XStack>
          </YStack>
          );
        })}
      </Grid>

      <XStack
        render={<Link href={all.href} prefetch={false} />}
        {...CARD}
        bg="$hover"
        flexWrap="wrap"
        items="center"
        gap={24}
        px={32}
        py={28}
        hoverStyle={{ borderColor: '$color8' }}
        $max-md={{ px: 24, py: 24 }}
      >
        <Text fontSize={64} lineHeight={64} fontWeight="700" letterSpacing={-2} color="$color12">
          {all.count}
        </Text>
        <YStack flex={1} minW={240} gap={6}>
          <Text fontSize={20} lineHeight={26} fontWeight="700" letterSpacing={-0.4} color="$color12">
            {all.title}
          </Text>
          <Text fontSize={14} lineHeight={22} whiteSpace="normal" {...muted}>
            {all.body}
          </Text>
        </YStack>
        <XStack gap={6} items="center">
          <Text fontSize={14} fontWeight="600" color="$color12">
            {all.cta}
          </Text>
          <ArrowRight size={16} color="$color12" />
        </XStack>
      </XStack>
    </YStack>
  );
}

export function Landing({ install, use, catalogue }: { install: ReactNode; use: ReactNode; catalogue: Catalogue }) {
  const models = counted(catalogue.models);
  return (
    <YStack render="main" minW={0} pb={48}>
      {/* The hero, centred over its halftone. */}
      <YStack position="relative" items="center" px={24} pt={72} pb={80} $max-md={{ pt: 48, pb: 56 }}>
        <HeroField />
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
          {hero.title}
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
          {hero.lede}
        </Text>

        {/* The models first: they are the reason to choose the platform at all. */}
        <YStack position="relative" mt={40} width="100%" maxW={896}>
          <Families catalogue={catalogue} />
        </YStack>

        {/* The main call: install the CLI. */}
        <YStack position="relative" mt={48} width="100%" maxW={512} gap={12} items="center">
          <XStack {...CARD} width="100%" p={4}>
            <XStack flex={1} gap={12} items="center" px={20} py={16} rounded={12} bg="$background">
              <Text fontFamily="$mono" fontSize={14} select="none" {...muted}>
                $
              </Text>
              <Text fontFamily="$mono" fontSize={14} color="$color12">
                {hero.install}
              </Text>
            </XStack>
          </XStack>
          <Text fontSize={12} text="center" whiteSpace="normal" {...muted}>
            {hero.installNote.split('`').map((part, i) => (i % 2 ? <Text key={i} fontFamily="$mono">{part}</Text> : part))}
          </Text>
        </YStack>

        {/* The other way in: hand it to an agent. */}
        <YStack position="relative" mt={24} gap={8} items="center">
          <Agent />
          <Text fontSize={12} text="center" whiteSpace="normal" {...muted}>
            {agentNote.before}{' '}
            <Text render="a" href={agentNote.skills.href} target="_blank" rel="noreferrer" color="$color12" textDecorationLine="underline">
              {agentNote.skills.label}
            </Text>
            {agentNote.after}{' '}
            <Text render={<Link href={agentNote.start.href} prefetch={false} />} color="$color12" textDecorationLine="underline">
              {agentNote.start.label}
            </Text>
          </Text>
        </YStack>

        {/* The three doors, in descending order of how much you type. */}
        <YStack position="relative" mt={48} width="100%" maxW={896}>
          <Grid columns={{ min: 260, max: 3 }} gap={16}>
            {doors(models).map((d) => (
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
        <Section title={quickstart.title} lead={quickstart.lead}>
          <YStack gap={20}>
            {install}
            <Text fontSize={14} whiteSpace="normal" {...muted}>
              {quickstart.between}
            </Text>
            {use}
          </YStack>
        </Section>

        <Section title={platform.title} lead={platform.lead}>
          <Grid columns={{ min: 220, max: 3 }} gap={12}>
            {domains.map(({ name, desc, icon, href, tag }) => {
              const Icon = ICONS[icon];
              return (
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
              );
            })}
          </Grid>
        </Section>

        <Section title={tooling.title} lead={tooling.lead}>
          <Grid columns={{ min: 230, max: 4 }} gap={16}>
            {tools.map(({ name, desc, href, icon }) => {
              const Icon = ICONS[icon];
              return (
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
              );
            })}
          </Grid>
        </Section>

        <Section title={providerSection(models).title} lead={providerSection(models).lead}>
          <Grid columns={{ min: 120, max: 8 }} gap={12}>
            {providers.map((p) => (
              <Tile key={p.name} name={p.name} spec={p.spec} />
            ))}
          </Grid>
        </Section>

        <Grid columns={{ min: 470, max: 2 }} gap={16}>
          {surfaces.map(({ icon, title, body, chips, href, cta }) => {
            const Icon = ICONS[icon];
            return (
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
            );
          })}
        </Grid>

        {/* What the CLI can do. */}
        <YStack {...CARD} p={40} gap={24} $max-md={{ p: 24 }}>
          <XStack gap={12} items="center">
            <XStack p={10} rounded={12} bg="$hover">
              <Terminal size={18} color="$color11" />
            </XStack>
            <YStack gap={2} flex={1} minW={0}>
              <Text fontSize={24} fontWeight="700" letterSpacing={-0.5} color="$color12">
                {cli.title.split('`').map((part, i) => (i % 2 ? <Text key={i} fontFamily="$mono">{part}</Text> : part))}
              </Text>
              <Text fontSize={12} whiteSpace="normal" {...muted}>
                {cli.lead}
              </Text>
            </YStack>
          </XStack>
          <Grid columns={{ min: 200, max: 3 }} gap={12}>
            {cli.commands.map((c) => (
              <Tile key={c.cmd} name={c.cmd} spec={c.desc} mono />
            ))}
          </Grid>
        </YStack>

        {/* Zen. */}
        <YStack {...CARD} p={40} gap={24} $max-md={{ p: 24 }}>
          <XStack gap={12} items="center">
            <Sparkle size={18} color="$color11" />
            <Text fontSize={24} fontWeight="700" letterSpacing={-0.5} color="$color12">
              {zen.title}
            </Text>
            <Text fontFamily="$mono" fontSize={12} px={8} py={2} rounded={999} bg="$hover" {...muted}>
              {zen.badge}
            </Text>
          </XStack>
          <Text fontSize={14} lineHeight={22} maxW={672} whiteSpace="normal" {...muted}>
            {zen.body}
          </Text>
          <Grid columns={{ min: 130, max: 6 }} gap={12}>
            {zen.models.map((m) => (
              <Tile key={m.name} name={m.name} spec={m.spec} mono />
            ))}
          </Grid>
          <XStack flexWrap="wrap" gap={12} items="center">
            <Action tone="line" render={<Link href={zen.docs.href} prefetch={false} />} rounded={999}>
              {zen.docs.label}
            </Action>
            <Text render="a" href={zen.weights.href} target="_blank" rel="noreferrer noopener" fontSize={12} {...muted} hoverStyle={{ color: '$color12' }}>
              {zen.weights.label}
            </Text>
          </XStack>
        </YStack>

        {/* The close. */}
        <YStack render="section" items="center" gap={12} py={48}>
          <Text render="h2" fontSize={36} lineHeight={42} fontWeight="700" letterSpacing={-0.8} color="$color12" text="center">
            {close.title}
          </Text>
          <Text fontSize={14} text="center" {...muted}>
            {close.lead}
          </Text>
          <Text fontFamily="$mono" fontSize={14} mb={20} {...muted}>
            {close.install}
          </Text>
          <XStack flexWrap="wrap" gap={12} justify="center">
            <Action tone="loud" render="a" href={close.primary.href} height={44} px={28} rounded={999}>
              {close.primary.label}
            </Action>
            <Action tone="line" render={<Link href={close.secondary.href} prefetch={false} />} height={44} px={28} rounded={999}>
              {close.secondary.label}
            </Action>
          </XStack>
        </YStack>
      </YStack>
    </YStack>
  );
}
