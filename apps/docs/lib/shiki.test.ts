import { codeToHtml } from 'shiki';
import { describe, expect, it } from 'vitest';
import { shikiConfig } from './shiki';

// The code theme every block on the site is drawn in, held to what a reader
// sees: @hanzo/ui's monochrome code theme, a neutral ground per scheme that a
// page may retint through --codeGround, and tokens in more than one ink of the
// neutral ramp.
describe('code theme', () => {
  it("paints the ground and the tokens in @hanzo/ui's code ramp", async () => {
    const html = await codeToHtml(
      'curl -X POST https://api.hanzo.ai/v1/chat/completions \\\n  -H "Authorization: Bearer $HANZO_API_KEY" # mint one first',
      { lang: 'bash', ...shikiConfig },
    );
    expect(html).toContain(
      'background-color:light-dark(var(--codeGround, var(--neutral-100)), var(--codeGround, var(--neutral-900)))',
    );
    const dark = new Set([...html.matchAll(/--shiki-dark:(var\(--code\w+, var\(--neutral-\d+\)\))/g)].map((m) => m[1]));
    expect(dark.size).toBeGreaterThan(2);
  });
});
