import { codeToHtml } from 'shiki';
import { describe, expect, it } from 'vitest';
import { shikiConfig } from './shiki';

// The code theme every block on the site is drawn in, held to what a reader
// sees: Dracula's ground in the dark, GitHub Light's in the light, and tokens in
// more than one ink.
describe('code theme', () => {
  it('paints the ground and the tokens in Dracula and GitHub Light', async () => {
    const html = await codeToHtml(
      'curl -X POST https://api.hanzo.ai/v1/chat/completions \\\n  -H "Authorization: Bearer $HANZO_API_KEY" # mint one first',
      { lang: 'bash', ...shikiConfig },
    );
    expect(html).toContain('background-color:light-dark(#fff, #282A36)');
    const dark = new Set([...html.matchAll(/light-dark\(#[0-9A-F]+, (#[0-9A-F]+)\)/gi)].map((m) => m[1]));
    expect(dark.size).toBeGreaterThan(3);
  });
});
