/**
 * Convert Hanzo Bot's docs (hanzoai/bot, docs/*.md) into this app's .mdx.
 *
 * - Copies every .md file in the categories below, preserving directory structure
 * - Converts frontmatter (summary → description, drops read_when)
 * - Creates meta.json for each directory
 * - Renames index.md → index.mdx
 *
 *   bun scripts/convert-docs.ts [path/to/bot/docs]
 *
 * The text is copied as written. It used to be run through a rebrand map
 * (OpenClaw → Hanzo Bot, openclaw → hanzo-bot, …) from when the fork's docs
 * still said OpenClaw. They no longer do: the bot repo is the source of truth and
 * is branded at the source, so every name the map still matched was one written
 * on purpose — the migration guide's `hanzo bot migrate openclaw` and
 * `~/.openclaw`, the `clawdbot` compatibility shim in install/updating — and the
 * map turned each into a command, a path or a fact that does not exist.
 *
 * Links are the exception, because a link is an address and not a claim: an
 * invite to the upstream community server sends a Hanzo Bot reader somewhere
 * that is not ours. `relink` points each at Hanzo's server and touches nothing
 * else.
 */

import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import { join, relative, dirname, resolve } from 'path';
import { existsSync } from 'fs';
import { homedir } from 'os';

const SRC = resolve(process.argv[2] ?? join(homedir(), 'work/hanzobot/bot/docs'));
const DEST = resolve(import.meta.dirname, '../content/docs');

// Directories to include (top-level categories)
const CATEGORIES = [
  'install', 'start', 'concepts', 'cli', 'channels', 'providers',
  'tools', 'gateway', 'automation', 'platforms', 'nodes', 'web',
  'plugins', 'help', 'reference',
];

// Files to skip
const SKIP_FILES = new Set([
  '_config.yml', 'docs.json', 'CNAME', '.gitignore',
  'Gemfile', 'Gemfile.lock', '_layouts', '_includes',
]);

/** The community invites the upstream docs still carry, and Hanzo's server. */
const INVITES: [RegExp, string][] = [
  [/\bdiscord\.gg\/(?:clawd|hanzo)\b/g, 'discord.gg/XthHQQj'],
  [/\bchannels\.discord\.gg\/bot\b/g, 'discord.gg/XthHQQj'],
];

/** A doc with every upstream community invite pointed at Hanzo's server. */
export function relink(doc: string): string {
  return INVITES.reduce((d, [from, to]) => d.replace(from, to), doc);
}

// Category display names and ordering
const CATEGORY_META: Record<string, { title: string; pages?: string[] }> = {
  install: {
    title: 'Installation',
    pages: ['index', 'installer', 'node', 'docker', 'nix', 'ansible', 'bun', 'updating', 'migrate-from-openclaw', 'development-channels', 'uninstall'],
  },
  start: {
    title: 'Getting Started',
    pages: ['getting-started', 'wizard', 'setup', 'bot', 'pairing', 'showcase', 'onboarding', 'hubs', 'lore'],
  },
  concepts: {
    title: 'Core Concepts',
  },
  cli: {
    title: 'CLI Reference',
  },
  channels: {
    title: 'Channels',
    pages: ['index', 'whatsapp', 'telegram', 'grammy', 'discord', 'slack', 'signal', 'bluebubbles', 'imessage', 'matrix', 'mattermost', 'googlechat', 'msteams', 'nostr', 'tlon', 'nextcloud-talk', 'zalo', 'zalouser', 'location', 'troubleshooting'],
  },
  providers: {
    title: 'LLM Providers',
    pages: ['index', 'openai', 'anthropic', 'ollama', 'qwen', 'openrouter', 'moonshot', 'minimax', 'venice', 'synthetic', 'vercel-ai-gateway', 'opencode', 'zai', 'glm', 'github-copilot', 'deepgram'],
  },
  tools: {
    title: 'Skills & Tools',
  },
  gateway: {
    title: 'Gateway',
  },
  automation: {
    title: 'Automation',
  },
  platforms: {
    title: 'Platforms',
  },
  nodes: {
    title: 'Nodes & Media',
  },
  web: {
    title: 'Web Interfaces',
  },
  plugins: {
    title: 'Plugins',
  },
  help: {
    title: 'Help',
  },
  reference: {
    title: 'Reference',
  },
};

function convertFrontmatter(content: string): string {
  // Extract existing frontmatter
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!fmMatch) {
    return content;
  }

  const fm = fmMatch[1];
  let body = fmMatch[2];

  // Parse frontmatter fields
  const lines = fm.split('\n');
  let title = '';
  let description = '';
  let isIndex = false;

  for (const line of lines) {
    const summaryMatch = line.match(/^summary:\s*"(.+)"$/);
    if (summaryMatch) {
      description = summaryMatch[1];
    }
    const titleMatch = line.match(/^title:\s*"?(.+?)"?\s*$/);
    if (titleMatch) {
      title = titleMatch[1];
    }
  }

  // Extract title from first heading if not in frontmatter
  if (!title) {
    const headingMatch = body.match(/^#\s+(.+)$/m);
    if (headingMatch) {
      title = headingMatch[1];
      // Remove the heading from body since Hanzo Docs uses frontmatter title
      body = body.replace(/^#\s+.+\n+/, '');
    }
  }

  if (!title) {
    title = 'Untitled';
  }

  if (!description) {
    description = title;
  }

  // Build new frontmatter
  const newFm = [
    '---',
    `title: "${title.replace(/"/g, '\\"')}"`,
    `description: "${description.replace(/"/g, '\\"')}"`,
  ];

  if (isIndex) {
    newFm.push('index: true');
  }

  newFm.push('---');

  return newFm.join('\n') + '\n\n' + body.trim() + '\n';
}

/**
 * Markdown that MDX cannot parse, made into markdown it can.
 *
 * The bot's docs are CommonMark; this site compiles MDX, where `<` always opens
 * JSX. Three constructs the source uses on purpose stop the parser, and a page
 * that does not parse is not rendered at all:
 *
 * - an HTML comment (`<!-- markdownlint-disable MD037 -->`) becomes an MDX
 *   comment, `{/* … *\/}`;
 * - an autolink (`<https://www.perplexity.ai/settings/api>`) becomes the bare
 *   URL, which GFM links on its own;
 * - a `<` that cannot open a tag (`GPT-4 <-> Claude`, `a <= b`) becomes `&lt;`.
 *
 * Fenced blocks and inline code are left exactly as written.
 */
export function mdxSafe(doc: string): string {
  const front = doc.match(/^---\n[\s\S]*?\n---\n/)?.[0] ?? '';
  const out: string[] = [];
  let fence = '';
  let comment = false;
  for (const line of doc.slice(front.length).split('\n')) {
    const f = line.match(/^\s*(```+|~~~+)/);
    if (fence) {
      if (f && f[1][0] === fence[0] && f[1].length >= fence.length) fence = '';
      out.push(line);
      continue;
    }
    if (f) {
      fence = f[1];
      out.push(line);
      continue;
    }
    const parts = line.split('`');
    for (let i = 0; i < parts.length; i += 2) {
      let t = parts[i];
      if (comment) {
        const end = t.indexOf('-->');
        if (end < 0) {
          parts[i] = t.replace(/\*\//g, '* /');
          continue;
        }
        t = t.slice(0, end).replace(/\*\//g, '* /') + '*/}' + t.slice(end + 3);
        comment = false;
      }
      t = t.replace(/<!--([\s\S]*?)-->/g, (_m, c: string) => `{/*${c.replace(/\*\//g, '* /')}*/}`);
      const open = t.indexOf('<!--');
      if (open >= 0) {
        t = t.slice(0, open) + '{/*' + t.slice(open + 4).replace(/\*\//g, '* /');
        comment = true;
      }
      t = t.replace(/<((?:https?|ftp|mailto):[^\s<>]+)>/g, '$1');
      t = t.replace(/<(?![A-Za-z/!{])/g, '&lt;');
      parts[i] = t;
    }
    out.push(parts.join('`'));
  }
  return front + out.join('\n');
}

async function* walkDir(dir: string): AsyncGenerator<string> {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_FILES.has(entry.name) && !entry.name.startsWith('_') && !entry.name.startsWith('.')) {
        yield* walkDir(fullPath);
      }
    } else if (entry.name.endsWith('.md') && !SKIP_FILES.has(entry.name)) {
      yield fullPath;
    }
  }
}

async function convertFile(srcPath: string) {
  const relPath = relative(SRC, srcPath);
  const parts = relPath.split('/');

  // Only process files in our target categories or root-level
  const category = parts[0];
  if (parts.length > 1 && !CATEGORIES.includes(category)) {
    return;
  }

  // Skip root-level files that aren't in categories
  if (parts.length === 1 && parts[0] !== 'index.md') {
    // Root files that should go into specific categories
    const rootFileMap: Record<string, string> = {
      'tui.md': 'web/tui.mdx',
      'tts.md': 'nodes/tts.mdx',
      'environment.md': 'reference/environment.mdx',
      'scripts.md': 'reference/scripts.mdx',
      'testing.md': 'reference/testing.mdx',
      'debug.md': 'help/debug.mdx',
    };
    const mapped = rootFileMap[parts[0]];
    if (!mapped) return;

    const destPath = join(DEST, mapped);
    await mkdir(dirname(destPath), { recursive: true });
    let content = await readFile(srcPath, 'utf-8');
    content = mdxSafe(convertFrontmatter(relink(content)));
    await writeFile(destPath, content, 'utf-8');
    console.log(`  ${relPath} → ${mapped}`);
    return;
  }

  // Build dest path (.md → .mdx)
  let destRel = relPath.replace(/\.md$/, '.mdx');
  const destPath = join(DEST, destRel);

  await mkdir(dirname(destPath), { recursive: true });

  let content = await readFile(srcPath, 'utf-8');
  content = mdxSafe(convertFrontmatter(relink(content)));

  await writeFile(destPath, content, 'utf-8');
  console.log(`  ${relPath} → ${destRel}`);
}

async function createMetaFiles() {
  // Create meta.json for each category directory
  for (const [category, meta] of Object.entries(CATEGORY_META)) {
    const catDir = join(DEST, category);
    if (!existsSync(catDir)) continue;

    const metaContent: any = {};

    if (meta.title) {
      metaContent.title = meta.title;
    }

    if (meta.pages) {
      metaContent.pages = meta.pages;
      // A page a fixed list does not name is converted and then never shown:
      // the sidebar lists what meta.json lists. Say so, so a new page is added
      // to the list on purpose rather than lost from the nav by default.
      for (const f of await readdir(catDir)) {
        const page = f.replace(/\.mdx$/, '');
        if (f.endsWith('.mdx') && !meta.pages.includes(page)) {
          console.warn(`  [nav] ${category}/${f} is not in ${category}'s pages; it has no sidebar entry`);
        }
      }
    } else {
      // Auto-discover pages from directory
      try {
        const entries = await readdir(catDir);
        const pages = entries
          .filter(f => f.endsWith('.mdx') && f !== 'index.mdx')
          .map(f => f.replace('.mdx', ''))
          .sort();

        if (pages.length > 0) {
          // Put index first if it exists
          const hasIndex = entries.includes('index.mdx');
          if (hasIndex) {
            metaContent.pages = ['index', ...pages];
          } else {
            metaContent.pages = pages;
          }
        }
      } catch {
        // Directory might not exist yet
      }
    }

    await writeFile(
      join(catDir, 'meta.json'),
      JSON.stringify(metaContent, null, 2) + '\n',
      'utf-8'
    );
    console.log(`  Created ${category}/meta.json`);
  }

  // Handle subdirectories (platforms/mac, reference/templates)
  const subdirs = ['platforms/mac', 'reference/templates'];
  for (const subdir of subdirs) {
    const subdirPath = join(DEST, subdir);
    if (!existsSync(subdirPath)) continue;

    const entries = await readdir(subdirPath);
    const pages = entries
      .filter(f => f.endsWith('.mdx'))
      .map(f => f.replace('.mdx', ''))
      .sort();

    if (pages.length > 0) {
      await writeFile(
        join(subdirPath, 'meta.json'),
        JSON.stringify({ pages }, null, 2) + '\n',
        'utf-8'
      );
      console.log(`  Created ${subdir}/meta.json`);
    }
  }
}

async function main() {
  console.log('Converting Hanzo Bot docs → MDX\n');
  console.log(`Source: ${SRC}`);
  console.log(`Dest:   ${DEST}\n`);

  let count = 0;

  // Convert all markdown files
  for await (const srcPath of walkDir(SRC)) {
    await convertFile(srcPath);
    count++;
  }

  console.log(`\nConverted ${count} files`);

  // Create meta.json files
  console.log('\nCreating meta.json files...');
  await createMetaFiles();

  console.log('\nDone!');
}

if (import.meta.main) main().catch(console.error);
