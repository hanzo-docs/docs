'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Text } from '@hanzo/gui';
import { Check, ChevronDown, Sparkle } from '@hanzogui/lucide-icons-2';
import { DropdownMenu } from '@hanzo/ui';
import { Action } from '@/components/action';
import { AGENT_SETUP_PROMPT } from '@/lib/agent-setup-prompt';
import { muted } from '@/lib/ink';

const SKILLS = 'https://hanzoskills.com';

/** /docs/a/b -> /llms.mdx/docs/a/b/content.md, the route app/llms.mdx serves. */
function markdown(pathname: string) {
  const clean = pathname.replace(/\/+$/, '');
  return `/llms.mdx${clean || '/docs'}/content.md`;
}

function prompt(url: string) {
  return `${AGENT_SETUP_PROMPT}

---

Then read ${url} — that is the page I am on — and help me use it. Skills for every
Hanzo capability are published at ${SKILLS}.`;
}

/**
 * "Give this page to an agent", beside the page title: ours opened directly, or
 * the page handed to any agent as a prompt or as Markdown. Everything is derived
 * from the pathname, so it needs nothing from the page.
 */
export function Agent() {
  const pathname = usePathname();
  const [done, setDone] = useState(false);
  const md = markdown(pathname);
  // Every page can be handed to an agent; only a doc page has a Markdown twin.
  const twin = pathname.startsWith('/docs');
  const here = () => window.location.href;

  const copy = async (text: string | Promise<string>) => {
    await navigator.clipboard.writeText(await text);
    setDone(true);
    setTimeout(() => setDone(false), 1600);
  };
  const go = (url: string) => window.open(url, '_blank', 'noopener,noreferrer');

  return (
    <DropdownMenu
      placement="bottom-end"
      minWidth={232}
      trigger={
        <Action tone="line" render="button" type="button" aria-label="Use this page with an agent">
          {done ? <Check size={14} color="$color11" /> : <Sparkle size={14} color="$color11" />}
          <Text fontSize="$2" lineHeight={18} fontWeight="500" {...muted} $max-sm={{ display: 'none' }}>
            {done ? 'Copied' : 'Use agent'}
          </Text>
          <ChevronDown size={12} color="$color10" />
        </Action>
      }
      items={[
        { type: 'label', label: 'Use with Hanzo' },
        { key: 'app', label: 'Open in Hanzo App', onSelect: () => go('https://hanzo.app') },
        // `hanzo code` runs whichever coding backend the reader chose, in their
        // own terminal, so the command is copied rather than opened.
        { key: 'cli', label: 'Open in Hanzo CLI', description: 'Copies the command', onSelect: () => copy(`hanzo code ${JSON.stringify(prompt(here()))}`) },
        { type: 'separator' },
        { type: 'label', label: 'Use with any agent' },
        { key: 'prompt', label: 'Copy prompt', onSelect: () => copy(prompt(here())) },
        ...(twin
          ? [
              { key: 'copy', label: 'Copy page as Markdown', onSelect: () => copy(fetch(md).then((r) => r.text())) },
              { key: 'view', label: 'View as Markdown', onSelect: () => window.location.assign(md) },
            ]
          : []),
        { type: 'separator' },
        { key: 'chatgpt', label: 'Open in ChatGPT', onSelect: () => go(`https://chatgpt.com/?${new URLSearchParams({ hints: 'search', q: prompt(here()) })}`) },
        { key: 'claude', label: 'Open in Claude', onSelect: () => go(`https://claude.ai/new?${new URLSearchParams({ q: prompt(here()) })}`) },
        { type: 'separator' },
        { key: 'skills', label: 'Hanzo Skills', onSelect: () => go(SKILLS) },
      ]}
    />
  );
}
