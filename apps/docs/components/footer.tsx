'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Input, Text, XStack, YStack } from '@hanzo/gui';
import { ArrowUp } from '@hanzogui/lucide-icons-2';
import { Grid } from '@hanzo/ui/grid';
import { HanzoMark } from '@hanzogui/shell';
import { BrandIcon } from '@/components/brand-icon';
import { muted } from '@/lib/ink';

const DIRECTORY: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Products',
    links: [
      { label: 'Hanzo Chat', href: 'https://hanzo.chat' },
      { label: 'Hanzo App', href: 'https://hanzo.app' },
      { label: 'Hanzo Dev', href: 'https://hanzo.ai/dev' },
      { label: 'Hanzo Cloud', href: 'https://console.hanzo.ai' },
      { label: 'Hanzo Base', href: 'https://hanzo.ai/base' },
      { label: 'Download app', href: 'https://hanzo.ai/download' },
      { label: 'Pricing', href: 'https://hanzo.ai/pricing' },
    ],
  },
  {
    title: 'Models & AI',
    links: [
      { label: 'Enso Router', href: '/docs/models/enso' },
      { label: 'Kai Decisions', href: '/docs/models/kai' },
      { label: 'Zen Open Weights', href: '/docs/models/zen' },
      { label: 'Model Catalogue', href: '/docs/models' },
      { label: 'Managed Agents', href: '/docs/agents' },
      { label: 'MCP Tools', href: '/docs/mcp' },
      { label: 'Hanzo Skills', href: 'https://hanzoskills.com' },
    ],
  },
  {
    title: 'Developers',
    links: [
      { label: 'Documentation', href: '/docs' },
      { label: 'Quickstart', href: '/docs/quickstart' },
      { label: 'API Reference', href: '/docs/openapi' },
      { label: 'CLI Reference', href: '/docs/cli' },
      { label: 'SDKs', href: '/docs/sdks' },
      { label: 'Contributing', href: '/docs/contributing' },
      { label: 'HIPs (Standards)', href: 'https://hips.hanzo.ai' },
    ],
  },
  {
    title: 'Platform',
    links: [
      { label: 'Identity & IAM', href: '/docs/openapi/iam' },
      { label: 'Key Management (KMS)', href: '/docs/openapi/kms' },
      { label: 'Vector & SQL Data', href: '/docs/openapi/provisioning' },
      { label: 'Streams & PubSub', href: '/docs/openapi/pubsub' },
      { label: 'Observability', href: '/docs/openapi/o11y' },
      { label: 'Commerce & Billing', href: '/docs/openapi/commerce' },
      { label: 'Architecture', href: '/docs/architecture' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Guides & Tutorials', href: '/docs/guides' },
      { label: 'Blog', href: '/blog' },
      { label: 'Discord (#docs)', href: 'https://discord.gg/XthHQQj' },
      { label: 'GitHub', href: 'https://github.com/hanzoai' },
      { label: 'Research & Papers', href: 'https://hanzo.ai/research' },
      { label: 'System Status', href: 'https://status.hanzo.ai' },
      { label: 'Support', href: 'https://hanzo.ai/support' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Hanzo', href: 'https://hanzo.ai/leadership' },
      { label: 'Enterprise', href: 'https://hanzo.ai/enterprise' },
      { label: 'Security & Trust', href: 'https://hanzo.ai/security' },
      { label: 'Careers', href: 'https://hanzo.ai/careers' },
      { label: 'Privacy Policy', href: 'https://hanzo.ai/privacy' },
      { label: 'Terms of Service', href: 'https://hanzo.ai/terms' },
      { label: 'Contact', href: 'https://hanzo.ai/contact' },
    ],
  },
];

const SOCIALS = [
  { name: 'discord', label: 'Discord', href: 'https://discord.gg/XthHQQj' },
  { name: 'github', label: 'GitHub', href: 'https://github.com/hanzoai' },
  { name: 'x', label: 'X', href: 'https://x.com/hanzoai' },
] as const;

function FooterLink({ href, label }: { href: string; label: string }) {
  const external = /^https?:/.test(href);
  return (
    <Text
      render={external ? <a href={href} target="_blank" rel="noreferrer noopener" /> : <Link href={href} prefetch={false} />}
      fontSize={13}
      lineHeight={20}
      {...muted}
      hoverStyle={{ color: '$color12' }}
    >
      {label}
    </Text>
  );
}

export function Footer({ cta: _cta = false }: { cta?: boolean }) {
  const [prompt, setPrompt] = useState('');

  const submitPrompt = () => {
    const q = prompt.trim();
    const target = q ? `https://hanzo.chat/?q=${encodeURIComponent(q)}` : 'https://hanzo.chat';
    window.open(target, '_blank', 'noopener,noreferrer');
  };

  return (
    <YStack
      render="footer"
      borderTopWidth={1}
      borderColor="$borderColor"
      bg="$background"
      overflow="hidden"
      style={{ containerType: 'inline-size' }}
    >
      <YStack width="100%" maxW={1200} self="center" px={32} pt={64} pb={24} gap={56} $max-md={{ px: 20, pt: 48, gap: 40 }}>
        {/* Main row: left brand + prompt input, right 6-column directory */}
        <XStack gap={48} items="flex-start" flexWrap="wrap" $max-lg={{ flexDirection: 'column', gap: 40 }}>
          {/* Left column: Hanzo lockup + interactive prompt box */}
          <YStack width={280} shrink={0} gap={20} $max-lg={{ width: '100%', maxW: 360 }}>
            <XStack
              render={<a href="https://hanzo.ai" target="_blank" rel="noreferrer noopener" aria-label="Hanzo AI" />}
              gap={10}
              items="center"
              color="$color12"
            >
              <HanzoMark size={26} animate brandMenu />
              <Text fontSize={24} lineHeight={28} fontWeight="700" letterSpacing={-0.6} color="$color12">
                Hanzo
              </Text>
            </XStack>

            <XStack
              height={46}
              pl={14}
              pr={7}
              rounded={12}
              borderWidth={1}
              borderColor="$borderColor"
              bg="$panel"
              items="center"
              gap={8}
              focusWithinStyle={{ borderColor: '$color8' }}
            >
              <Input
                unstyled
                flex={1}
                minW={0}
                height={42}
                p={0}
                borderWidth={0}
                bg="transparent"
                fontSize={13}
                color="$color12"
                placeholderTextColor="$color9"
                placeholder="How can I help you today?"
                aria-label="Ask Hanzo AI"
                value={prompt}
                onChangeText={setPrompt}
                onSubmitEditing={submitPrompt}
              />
              <XStack
                render="button"
                type="button"
                aria-label="Ask Hanzo AI"
                onPress={submitPrompt}
                width={32}
                height={32}
                rounded={8}
                bg="$color12"
                items="center"
                justify="center"
                cursor="pointer"
                 shrink={0}
                hoverStyle={{ opacity: 0.88 }}
              >
                <ArrowUp size={15} color="$background" />
              </XStack>
            </XStack>

            <Text fontSize={12} lineHeight={19} whiteSpace="normal" {...muted}>
              The AI operating system for business. Every model, every tool, and Kai on one key.
            </Text>

            <XStack gap={10} items="center">
              {SOCIALS.map((s) => (
                <XStack
                  key={s.name}
                  render={<a href={s.href} target="_blank" rel="noreferrer noopener" aria-label={s.label} title={s.label} />}
                  width={32}
                  height={32}
                  rounded={8}
                  borderWidth={1}
                  borderColor="$borderColor"
                  bg="$panel"
                  items="center"
                  justify="center"
                  hoverStyle={{ bg: '$hover', borderColor: '$color8' }}
                >
                  <BrandIcon name={s.name} size={15} />
                </XStack>
              ))}
            </XStack>
          </YStack>

          {/* Right columns: 6-column directory */}
          <YStack flex={1} minW={280} width="100%">
            <Grid columns={{ min: 135, max: 6 }} gap={24}>
              {DIRECTORY.map((col) => (
                <YStack key={col.title} gap={10}>
                  <Text fontSize={12} lineHeight={18} fontWeight="600" color="$color12">
                    {col.title}
                  </Text>
                  <YStack gap={8}>
                    {col.links.map((link) => (
                      <FooterLink key={link.href + link.label} href={link.href} label={link.label} />
                    ))}
                  </YStack>
                </YStack>
              ))}
            </Grid>
          </YStack>
        </XStack>

        {/* Legal & status row */}
        <XStack
          pt={24}
          borderTopWidth={1}
          borderColor="$borderColor"
          justify="space-between"
          items="center"
          flexWrap="wrap"
          gap={16}
        >
          <Text fontSize={12} {...muted}>
            © 2014–2026 Hanzo AI Inc. · Techstars &apos;17 · 1 Ferry Building, San Francisco, CA 94105
          </Text>
          <XStack gap={20} items="center" flexWrap="wrap">
            <FooterLink href="https://status.hanzo.ai" label="All systems operational" />
            <FooterLink href="https://hanzo.ai/privacy" label="Privacy" />
            <FooterLink href="https://hanzo.ai/terms" label="Terms" />
            <FooterLink href="https://hanzo.ai/security" label="Security" />
          </XStack>
        </XStack>
      </YStack>

      {/* Full-width lowercase 'hanzo' background wordmark */}
      <XStack
        aria-hidden
        width="100%"
        justify="center"
        items="flex-end"
        overflow="hidden"
        select="none"
        pointerEvents="none"
        pt={4}
        mb={-18}
      >
        <Text
          fontWeight="800"
          color="$color12"
          opacity={0.055}
          style={{
            fontSize: 'clamp(96px, 21cqi, 280px)',
            lineHeight: 0.78,
            letterSpacing: '-0.06em',
          }}
        >
          hanzo
        </Text>
      </XStack>
    </YStack>
  );
}
