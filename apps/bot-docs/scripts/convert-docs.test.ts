import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { mdxSafe, relink } from './convert-docs';

// Markdown the bot repo writes on purpose, which MDX reads as JSX and refuses:
// a page that does not parse is not rendered at all.
describe('markdown made MDX-safe', () => {
  it('turns an HTML comment into an MDX comment', () => {
    expect(mdxSafe('<!-- markdownlint-disable MD037 -->\n')).toBe(
      '{/* markdownlint-disable MD037 */}\n',
    );
    expect(mdxSafe('a\n<!-- start\nmiddle\nend -->\nb')).toBe('a\n{/* start\nmiddle\nend */}\nb');
  });

  it('unwraps an autolink', () => {
    expect(mdxSafe('at <https://www.perplexity.ai/settings/api>')).toBe(
      'at https://www.perplexity.ai/settings/api',
    );
  });

  it('escapes a < that cannot open a tag', () => {
    expect(mdxSafe('GPT-4 <-> Claude, a <= b')).toBe('GPT-4 &lt;-> Claude, a &lt;= b');
  });

  it('leaves code, tags and frontmatter as written', () => {
    const doc = [
      '---',
      'title: "a <= b"',
      '---',
      'Run `hanzo bot migrate openclaw <-- here` or <Note>this</Note>.',
      '```html',
      '<!-- kept --> <https://x.y> a <= b',
      '```',
    ].join('\n');
    expect(mdxSafe(doc)).toBe(doc);
  });

  it('writes the OpenClaw names it is given', () => {
    const guide =
      'Moving from OpenClaw: `hanzo bot migrate openclaw` reads `~/.openclaw/openclaw.json`.';
    expect(mdxSafe(guide)).toBe(guide);
  });
});

// The upstream docs invite a reader into the upstream community; ours invite
// them into Hanzo's. Only the invite moves: a name written on purpose stays.
describe('links to the community', () => {
  it("point an upstream Discord invite at Hanzo's server", () => {
    expect(relink('Ask in Discord: [https://discord.gg/clawd](https://discord.gg/clawd)')).toBe(
      'Ask in Discord: [https://discord.gg/XthHQQj](https://discord.gg/XthHQQj)',
    );
    expect(relink('[#showcase](https://discord.gg/clawd) or channels.discord.gg/bot')).toBe(
      '[#showcase](https://discord.gg/XthHQQj) or discord.gg/XthHQQj',
    );
    expect(relink('Ask in [Discord](https://discord.com/invite/clawd).')).toBe(
      'Ask in [Discord](https://discord.gg/XthHQQj).',
    );
    expect(relink('[Discord](https://discord.com/invite/bot) or https://discord.gg/bot')).toBe(
      '[Discord](https://discord.gg/XthHQQj) or https://discord.gg/XthHQQj',
    );
    expect(relink('https://discord.gg/botany and discord.gg/XthHQQj')).toBe(
      'https://discord.gg/botany and discord.gg/XthHQQj',
    );
  });

  it('leave no upstream invite on a published page', () => {
    const upstream: string[] = [];
    const walk = (d: string) => {
      for (const e of readdirSync(d, { withFileTypes: true })) {
        const f = join(d, e.name);
        if (e.isDirectory()) walk(f);
        else if (
          e.name.endsWith('.mdx') &&
          relink(readFileSync(f, 'utf8')) !== readFileSync(f, 'utf8')
        )
          upstream.push(f);
      }
    };
    walk(join(import.meta.dirname, '../content/docs'));
    expect(upstream).toEqual([]);
  });

  it('leave every other name as written', () => {
    const doc = 'Run `hanzo bot migrate openclaw`; the `clawdbot` shim reads ~/.openclaw.';
    expect(relink(doc)).toBe(doc);
  });
});
