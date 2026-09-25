import { describe, expect, it } from 'vitest';
import { mdxSafe } from './convert-docs';

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
