'use client';

import { useMemo, useState } from 'react';
import { Input, Text, XStack, YStack } from '@hanzo/gui';
import { Check, Copy, ExternalLink } from '@hanzogui/lucide-icons-2';
import { loud, muted } from '@/lib/ink';

type ButtonAction = 'deploy' | 'deploy-wide' | 'ask' | 'build' | 'edit';
type SnippetFormat = 'markdown' | 'html' | 'url';

const ACTION_META: Record<
  ButtonAction,
  { label: string; alt: string; badge: string; action: 'deploy' | 'ask' | 'build' | 'edit' }
> = {
  deploy: {
    label: 'Deploy (32px)',
    alt: 'Deploy with Hanzo',
    badge: 'https://hanzo.app/badges/deploy-button.svg',
    action: 'deploy',
  },
  'deploy-wide': {
    label: 'Deploy with Hanzo (32px)',
    alt: 'Deploy with Hanzo',
    badge: 'https://hanzo.app/badges/deploy-with-hanzo-button.svg',
    action: 'deploy',
  },
  ask: {
    label: 'Ask (32px)',
    alt: 'Ask Hanzo AI',
    badge: 'https://hanzo.app/badges/ask-button.svg',
    action: 'ask',
  },
  build: {
    label: 'Build (32px)',
    alt: 'Build with Hanzo',
    badge: 'https://hanzo.app/badges/build-button.svg',
    action: 'build',
  },
  edit: {
    label: 'Edit (32px)',
    alt: 'Edit in Hanzo Dev',
    badge: 'https://hanzo.app/badges/edit-button.svg',
    action: 'edit',
  },
};

function buildUrl({
  repoUrl,
  projectName,
  rootDir,
  env,
  via,
  action,
}: {
  repoUrl: string;
  projectName: string;
  rootDir: string;
  env: string;
  via: string;
  action: 'deploy' | 'ask' | 'build' | 'edit';
}): string {
  const cleanRepo = repoUrl.trim() || 'https://github.com/hanzoai/hanzo';
  const params = new URLSearchParams();

  if (action === 'deploy') {
    params.set('repository-url', cleanRepo);
    if (projectName.trim()) params.set('project-name', projectName.trim());
    if (rootDir.trim()) params.set('root-directory', rootDir.trim());
    if (env.trim()) params.set('env', env.trim());
    if (via.trim()) params.set('via', via.trim());
    return `https://hanzo.app/deploy?${params.toString()}`;
  }

  params.set('repo', cleanRepo);
  params.set('action', action === 'build' ? 'edit' : action);
  if (action === 'build') {
    params.set('prompt', 'Build a new feature on top of this repository.');
  }
  if (via.trim()) params.set('via', via.trim());
  return `https://hanzo.app/dev/open?${params.toString()}`;
}

/**
 * Interactive Deploy Button & GitHub Badge generator embedded in
 * `/docs/deploy-button`. Renders live 32px Vercel-style Ask, Edit, and Deploy
 * buttons with Hanzo's canonical diagonal-crossbar logo and outputs copyable
 * Markdown, HTML, and URL snippets.
 */
export function DeployButtonGenerator() {
  const [repoUrl, setRepoUrl] = useState('https://github.com/hanzoai/next-ai-starter');
  const [projectName, setProjectName] = useState('');
  const [rootDir, setRootDir] = useState('');
  const [env, setEnv] = useState('HANZO_API_KEY');
  const [via, setVia] = useState('');
  const [kind, setKind] = useState<ButtonAction>('deploy');
  const [format, setFormat] = useState<SnippetFormat>('markdown');
  const [copied, setCopied] = useState(false);

  const meta = ACTION_META[kind];

  const targetUrl = useMemo(
    () =>
      buildUrl({
        repoUrl,
        projectName,
        rootDir,
        env,
        via,
        action: meta.action,
      }),
    [repoUrl, projectName, rootDir, env, via, meta.action],
  );

  const snippet = useMemo(() => {
    if (format === 'url') return targetUrl;
    if (format === 'html') {
      return `<a href="${targetUrl}"><img src="${meta.badge}" alt="${meta.alt}" height="32" /></a>`;
    }
    return `[![${meta.alt}](${meta.badge})](${targetUrl})`;
  }, [format, targetUrl, meta]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard unavailable.
    }
  };

  return (
    <YStack
      my={24}
      p={20}
      gap={16}
      rounded="$4"
      borderWidth={1}
      borderColor="$borderColor"
      bg="$panel"
    >
      {/* Mode selector */}
      <XStack gap={8} flexWrap="wrap">
        {(Object.keys(ACTION_META) as ButtonAction[]).map((key) => {
          const active = key === kind;
          return (
            <XStack
              key={key}
              render="button"
              type="button"
              onPress={() => setKind(key)}
              px={12}
              py={6}
              rounded="$3"
              borderWidth={1}
              borderColor={active ? '$color12' : '$borderColor'}
              bg={active ? '$color12' : 'transparent'}
              cursor="pointer"
              hoverStyle={{ opacity: 0.9 }}
            >
              <Text
                fontSize="$2"
                fontWeight="500"
                color={active ? '$background' : '$color11'}
              >
                {ACTION_META[key].label}
              </Text>
            </XStack>
          );
        })}
      </XStack>

      {/* Live Preview */}
      <YStack
        p={20}
        gap={10}
        rounded="$3"
        borderWidth={1}
        borderColor="$borderColor"
        bg="$background"
        items="center"
      >
        <a href={targetUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={meta.badge} alt={meta.alt} height={32} style={{ height: 32, display: 'block' }} />
        </a>
        <XStack gap={12} items="center" flexWrap="wrap" justify="center">
          <Text fontSize={12} {...muted}>
            Live preview — click to test the full Hanzo flow
          </Text>
          <XStack
            render={<a href={targetUrl} target="_blank" rel="noopener noreferrer" />}
            items="center"
            gap={4}
          >
            <Text fontSize={12} {...loud} fontWeight="500">
              Open live
            </Text>
            <ExternalLink size={12} color="$color12" />
          </XStack>
        </XStack>
      </YStack>

      {/* Form inputs */}
      <YStack gap={12}>
        <Field label="Git Repository URL" value={repoUrl} onChange={setRepoUrl} placeholder="https://github.com/owner/repo" />
        {meta.action === 'deploy' && (
          <XStack gap={12} $max-sm={{ flexDirection: 'column' }}>
            <YStack flex={1}>
              <Field label="Project Name (optional)" value={projectName} onChange={setProjectName} placeholder="my-hanzo-app" />
            </YStack>
            <YStack flex={1}>
              <Field label="Root Directory (optional)" value={rootDir} onChange={setRootDir} placeholder="apps/web" />
            </YStack>
          </XStack>
        )}
        <XStack gap={12} $max-sm={{ flexDirection: 'column' }}>
          {meta.action === 'deploy' && (
            <YStack flex={1}>
              <Field label="Required Env Vars (comma-separated)" value={env} onChange={setEnv} placeholder="HANZO_API_KEY,DATABASE_URL" />
            </YStack>
          )}
          <YStack flex={1}>
            <Field label="OSS Referrer Handle (via — earns 20%)" value={via} onChange={setVia} placeholder="your-github-handle" />
          </YStack>
        </XStack>
      </YStack>

      {/* Output tabs */}
      <YStack gap={8}>
        <XStack items="center" justify="space-between" gap={8}>
          <XStack gap={4}>
            {(['markdown', 'html', 'url'] as SnippetFormat[]).map((tab) => {
              const active = tab === format;
              return (
                <XStack
                  key={tab}
                  render="button"
                  type="button"
                  onPress={() => setFormat(tab)}
                  px={10}
                  py={5}
                  rounded="$2"
                  borderWidth={1}
                  borderColor={active ? '$color8' : 'transparent'}
                  bg={active ? '$hover' : 'transparent'}
                  cursor="pointer"
                >
                  <Text
                    fontSize={12}
                    fontWeight={active ? '600' : '400'}
                    color={active ? '$color12' : '$color10'}
                    textTransform="uppercase"
                  >
                    {tab}
                  </Text>
                </XStack>
              );
            })}
          </XStack>
          <XStack
            render="button"
            type="button"
            onPress={() => void copy()}
            px={10}
            py={5}
            gap={6}
            rounded="$2"
            borderWidth={1}
            borderColor="$borderColor"
            bg="$background"
            items="center"
            cursor="pointer"
            hoverStyle={{ bg: '$hover' }}
          >
            {copied ? <Check size={13} color="$color12" /> : <Copy size={13} color="$color10" />}
            <Text fontSize={12} fontWeight="500" {...(copied ? loud : muted)}>
              {copied ? 'Copied' : 'Copy'}
            </Text>
          </XStack>
        </XStack>

        <YStack
          p={12}
          rounded="$3"
          borderWidth={1}
          borderColor="$borderColor"
          bg="$background"
          overflow="hidden"
        >
          <Text
            render="code"
            fontFamily="$mono"
            fontSize={12}
            lineHeight={18}
            color="$color12"
            style={{ wordBreak: 'break-all' }}
          >
            {snippet}
          </Text>
        </YStack>
      </YStack>
    </YStack>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <YStack gap={4}>
      <Text fontSize={12} fontWeight="500" {...muted}>
        {label}
      </Text>
      <Input
        unstyled
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="$color9"
        height={36}
        px={10}
        rounded="$3"
        borderWidth={1}
        borderColor="$borderColor"
        bg="$background"
        color="$color12"
        fontSize={13}
        fontFamily="$mono"
      />
    </YStack>
  );
}
