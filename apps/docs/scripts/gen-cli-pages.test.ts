import { describe, expect, it } from 'vitest';
import { guideLines, guidePages, heading, spelling, words } from './gen-cli-pages';
import type { CliCommand } from './sync-cli-commands';
import { firstSentence } from './mdx';

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

// What a command acts on is read from the CLI's coordinates, not from the
// arguments a reader fills in: `hanzo campaign rm <id>` acts on the campaign
// itself, and an example value in a placeholder's place is not a word either.
describe('the words of a command', () => {
  const cmd = (
    product: string,
    nodes: string[],
    verb: string,
    params: string[] = [],
  ): CliCommand => ({
    key: '',
    product,
    nodes,
    verb,
    params,
    required: [],
  });
  it('are the nodes and the verb after the capability', () => {
    expect(words(cmd('campaign', [], 'rm', ['id']), 'campaign')).toEqual(['rm']);
    expect(words(cmd('bot', ['runs'], 'stop', ['runId']), 'bot')).toEqual(['runs', 'stop']);
  });
  it('start after the capability where the CLI files it under another command', () => {
    expect(words(cmd('auth', ['link'], 'create'), 'link')).toEqual(['create']);
  });
  it('start after the product when no word names the capability', () => {
    expect(words(cmd('iam', ['keys'], 'list'), 'account')).toEqual(['keys', 'list']);
  });
});

// A section heading is a title a reader scans for, and the line the table of
// contents repeats; the CLI token stays in every row beneath it.
describe('a noun as a heading', () => {
  it('reads as a title', () => {
    expect(heading('members')).toBe('Members');
    expect(heading('service-accounts')).toBe('Service accounts');
    expect(heading('span_percentile')).toBe('Span percentile');
    expect(heading('api-keys')).toBe('API keys');
    expect(heading('kms')).toBe('KMS');
    expect(heading('nextPrevErrorIDs')).toBe('Next prev error IDs');
    expect(heading('.well-known')).toBe('`.well-known`');
  });
});

// A cell that stops mid-clause is unfinished, not shorter.
describe('the first sentence', () => {
  it('is whole, however long', () => {
    const long =
      "List returns the caller org's live bot runs, read from the bot runtime and projected " +
      "into the console contract with each run's live session URL derived here. The org is ALWAYS the principal's.";
    const got = firstSentence(long);
    expect(got.endsWith('derived here.')).toBe(true);
    expect(got).not.toContain('…');
  });

  it('comes from the first paragraph only', () => {
    expect(
      firstSentence('Starts enrolling a factor:\n\n  app  a secret\n\nNothing is on yet.'),
    ).toBe('Starts enrolling a factor.');
    expect(firstSentence('Values are listed below:')).toBe('Values are listed below:');
  });

  it('runs past an abbreviation, a bracket and a code span', () => {
    expect(
      firstSentence(
        'Events are NATS subject patterns to subscribe to (e.g. "commerce.order.>").\nAn empty list means EVERY event.',
      ),
    ).toBe('Events are NATS subject patterns to subscribe to (e.g. "commerce.order.>").');
    expect(
      firstSentence(
        'Name is the ADDRESS — "module.name", e.g. "kb.page". A name with a space is encoded.',
      ),
    ).toBe('Name is the ADDRESS — "module.name", e.g. "kb.page".');
    expect(firstSentence('Jurisdiction is the U.S. state of formation.')).toBe(
      'Jurisdiction is the U.S. state of formation.',
    );
    expect(firstSentence("TIN is W-9 Part I, or a W-8's U.S. TIN. Never logged.")).toBe(
      "TIN is W-9 Part I, or a W-8's U.S. TIN.",
    );
    expect(firstSentence('The page, i.e. one screen. Next.')).toBe('The page, i.e. one screen.');
    expect(firstSentence('Filters rows (one per id. Ids repeat) in order. Next.')).toBe(
      'Filters rows (one per id. Ids repeat) in order.',
    );
    expect(firstSentence('Runs `a. b` first. Then c.')).toBe('Runs `a. b` first.');
  });

  it('ends where a reader stops', () => {
    expect(firstSentence('Keys, tokens, etc. The rest is kept.')).toBe('Keys, tokens, etc.');
    expect(firstSentence('Keys, tokens, etc. and more. Next.')).toBe(
      'Keys, tokens, etc. and more.',
    );
    expect(firstSentence('It said "stop." Then it stopped.')).toBe('It said "stop."');
    expect(firstSentence('Serves hanzo.ai. Then more.')).toBe('Serves hanzo.ai.');
    expect(firstSentence('Is it on? Ask.')).toBe('Is it on?');
    expect(firstSentence('Returns the value—e.g. a count. Next.')).toBe(
      'Returns the value—e.g. a count.',
    );
  });

  // A quotation's own "?" or full stop is not the sentence's: it ends there
  // only when the next sentence starts there. The four texts it once cut, as
  // the document carries them (POST /v1/books/ask, GET /v1/deploy/session/
  // userinfo, POST /v1/iam/oauth/device/info, sandbox.Blob `entries`).
  it('runs past a quotation the sentence goes on after', () => {
    expect(
      firstSentence(
        'Answers a plain-language question about the caller\'s own books — "what is my\nMRR?", "how long is my runway?" — with figures taken from their ledger, never a guessed\nnumber. A deterministic keyword router picks the intent and reads the real metrics.',
      ),
    ).toBe(
      'Answers a plain-language question about the caller\'s own books — "what is my MRR?", "how long is my runway?" — with figures taken from their ledger, never a guessed number.',
    );
    expect(
      firstSentence(
        'Answers "is this browser signed in, and if not where does it\nsign in?" — the dashboard SPA\'s bootstrap question, and the only route on this\nplane that answers for an anonymous caller.\n\nThe anonymous answer carries loggedIn:false and a URL and NOTHING else.',
      ),
    ).toBe(
      'Answers "is this browser signed in, and if not where does it sign in?" — the dashboard SPA\'s bootstrap question, and the only route on this plane that answers for an anonymous caller.',
    );
    expect(
      firstSentence(
        'Answers "what am I approving?" for a pending device code.\n\nThe approval page exists to tell a human WHICH application they are authorizing.',
      ),
    ).toBe('Answers "what am I approving?" for a pending device code.');
    expect(
      firstSentence(
        'Entries is a directory\'s contents as bare NAMES, not paths — one level, no\nrecursion, dotfiles included, "." and ".." excluded (`ls -1A`). Empty for a\nfile, and for an empty directory.',
      ),
    ).toBe(
      'Entries is a directory\'s contents as bare NAMES, not paths — one level, no recursion, dotfiles included, "." and ".." excluded (`ls -1A`).',
    );
    expect(firstSentence('It said "stop." Then it stopped.')).toBe('It said "stop."');
    expect(firstSentence('It said "stop." "Go" came next.')).toBe('It said "stop."');
    expect(firstSentence('Answers "is it on?" 2 ways.')).toBe('Answers "is it on?"');
    expect(firstSentence('Answers "is it on?"')).toBe('Answers "is it on?"');
    expect(firstSentence('Is it on? Ask.')).toBe('Is it on?');
  });
});
