import { describe, expect, it } from 'vitest';
import { guideLines, guidePages, spelling } from './gen-cli-pages';

// A page names the command a reader types. Most capabilities are spelled by
// their own name; one the CLI files under another command is spelled there.
describe('the spelling of a capability', () => {
  it('is the capability itself when the CLI mounts it at its own name', () => {
    expect(spelling('hanzo guide steps done <id>', 'guide')).toEqual(['guide']);
    expect(spelling('hanzo network list', 'network')).toEqual(['network']);
  });

  it('runs through the parent when the CLI files it under another command', () => {
    expect(spelling('hanzo auth link devices get <machine>', 'link')).toEqual(['auth', 'link']);
  });

  it('is the product when no word names the capability', () => {
    expect(spelling('hanzo network services get', 'zt')).toEqual(['network']);
  });

  it('reads a command broken across lines as one line', () => {
    expect(spelling('hanzo auth link create \\\n  --account a', 'link')).toEqual(['auth', 'link']);
  });
});

// The Bot page is where hanzo.ai sends people; one coming from OpenClaw finds
// the move there and beside it in the sidebar.
describe('a capability with guides', () => {
  it('links the OpenClaw move from the Bot page and its sidebar entry', () => {
    const href = 'https://docs.hanzo.bot/docs/install/migrate-from-openclaw';
    expect(guideLines('bot').join('\n')).toContain(`[Migrate from OpenClaw →](${href})`);
    expect(guidePages('bot')).toEqual([`[Migrate from OpenClaw](${href})`]);
  });

  it('adds nothing to a capability without one', () => {
    expect(guideLines('network')).toEqual([]);
    expect(guidePages('network')).toEqual([]);
  });
});
