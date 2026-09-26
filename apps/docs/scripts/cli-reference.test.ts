import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { beforeAll, describe, expect, it } from 'vitest';
import { BRANDS, DOCUMENT, loadDocument, METHODS, unimplemented, unname } from './openapi-doc';
import { genCliPages, heading, nounOf } from './gen-cli-pages';
import { loadCliTable } from './sync-cli-commands';
import { cut, doubled, early, named } from './english';
import { firstSentence } from './mdx';

// THE CLI REFERENCE, held to what a reader sees on every page of it.
//
// The Playwright suite looks at a few pages in a browser; these rules read every
// row of every page the generator writes from the vendored document and command
// table, so a defect on the 90th page fails here too.
//
//   whole       a row is its operation's whole first sentence, never cut with "…"
//   unnamed     a row does not open with the name of a Go function
//   real        an operation its own prose says cannot work is not a command
//   titled      a section is headed by a word, written as a reader says it

let pages: Map<string, string>;
let rows: Array<{ page: string; command: string; what: string }>;

beforeAll(async () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'cli-ref-'));
  await genCliPages(out);
  pages = new Map();
  for (const e of fs.readdirSync(out, { withFileTypes: true })) {
    if (e.isDirectory())
      pages.set(e.name, fs.readFileSync(path.join(out, e.name, 'index.mdx'), 'utf8'));
  }
  rows = [...pages].flatMap(([page, src]) =>
    [...src.matchAll(/^\| `(hanzo [^`]+)` \| (.*) \|$/gm)].map((m) => ({
      page,
      command: m[1],
      what: m[2],
    })),
  );
}, 120_000);

/** The words a command is named with: `hanzo kv delete <key>` -> hanzo, kv, delete, key. */
const own = (command: string) =>
  command
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

describe('the CLI reference, row by row', () => {
  it('has a page per command group and a row per command', () => {
    expect(pages.size).toBeGreaterThan(100);
    expect(rows.length).toBeGreaterThan(2000);
  });

  it('whole — no row stops before its sentence ends', () => {
    expect(rows.filter((r) => cut(r.what)).map((r) => `${r.command}: ${cut(r.what)}`)).toEqual([]);
  });

  it('unnamed — no row opens with the name of a Go function', () => {
    expect(
      rows
        .filter((r) => named(r.what, own(r.command)))
        .map((r) => `${r.command}: ${named(r.what, own(r.command))}: ${r.what.slice(0, 60)}`),
    ).toEqual([]);
    // One handler's comment at two addresses reads the same at both.
    expect(doubled(rows.map((r) => r.what))).toEqual([]);
  });

  it('real — no command calls an operation that answers 501 to every call', () => {
    const raw = parseYaml(fs.readFileSync(DOCUMENT, 'utf8'));
    const table = loadCliTable();
    const stubs: string[] = [];
    for (const [p, item] of Object.entries<any>(raw.paths)) {
      for (const m of METHODS) {
        if (!unimplemented(String(item?.[m]?.description ?? ''))) continue;
        const cmd = table.get(`${m.toUpperCase()} ${p}`);
        if (cmd) stubs.push(['hanzo', cmd.product, ...cmd.nodes, cmd.verb].join(' '));
      }
    }
    const listed = rows.filter((r) =>
      stubs.some((s) => r.command === s || r.command.startsWith(`${s} `)),
    );
    expect(listed.map((r) => r.command)).toEqual([]);
    expect(rows.filter((r) => /\b501\b/.test(r.what)).map((r) => r.command)).toEqual([]);
    // The one the document still carries: publishing a calendar post answers 501
    // on every channel, and its first sentence says "Publishes a post NOW".
    expect(rows.map((r) => r.command)).not.toContain('hanzo marketing calendar publish <id>');
  });

  it('titled — every section is headed by a word, never a bare token', () => {
    const bad: string[] = [];
    for (const [page, src] of pages) {
      for (const m of src.matchAll(/^### (.+)$/gm)) {
        const h = m[1];
        if (h.startsWith('`')) continue;
        if (h.length < 2 || !/^[A-Z0-9]|^[a-z][A-Z]/.test(h)) bad.push(`${page}: ${h}`);
      }
    }
    expect(bad).toEqual([]);
    expect(pages.get('esign')).not.toMatch(/^### O$/m);
    expect(pages.get('provider')).toMatch(/^### GitHub$/m);
    expect(pages.get('iam')).toMatch(/^### OAuth$/m);
  });
});

describe('a Go name is not prose', () => {
  it('drops a name English does not spell, with "is"', () => {
    expect(
      unname(
        'CompleteDeployment is the CI completion hook that flips a deployment.',
        'post_project_x',
      ),
    ).toBe('The CI completion hook that flips a deployment.');
    expect(unname('ListGPUTiers returns the rentable GPU configurations.', 'get_pricing_gpu')).toBe(
      'Returns the rentable GPU configurations.',
    );
    expect(
      unname('SetCenter opens, publishes or withdraws the centre.', 'put_dataroom_trust'),
    ).toBe('Opens, publishes or withdraws the centre.');
  });

  it("drops the operation's own word when a doc comment's verb follows it", () => {
    expect(unname('Delete removes one key.', 'delete_kv_by_bucket_by_key')).toBe(
      'Removes one key.',
    );
    expect(
      unname('Health reports which signer this deployment mints with.', 'get_licensing_healthz'),
    ).toBe('Reports which signer this deployment mints with.');
    expect(unname("Datasets lists this org's datasets.", 'riskDatasets')).toBe(
      "Lists this org's datasets.",
    );
  });

  it('drops the "is" a stripped name left, and spells what it named as words', () => {
    expect(unname('Is the datasets your org has.', 'get_eval_datasets')).toBe(
      'The datasets your org has.',
    );
    expect(unname('Is whether the subsystem is mounted.', 'get_experiment_health')).toBe(
      'Whether the subsystem is mounted.',
    );
    expect(unname('Is askGet with the question in the request BODY.', 'post_code_ask')).toBe(
      'Ask get with the question in the request BODY.',
    );
    expect(
      unname('Is dashboardListV2 personalized for the calling user.', 'ListDashboardsForUserV2'),
    ).toBe('Dashboard list V2 personalized for the calling user.');
    expect(
      unname('DetachPortalMethod is DetachMethod at the address a checkout uses.', 'delete_x'),
    ).toBe('DetachMethod at the address a checkout uses.');
    expect(named('DetachMethod at the address a checkout uses.', [])).not.toBe('');
    expect(unname('PushTarget is iOS devices a push reaches.', 'get_push')).toBe(
      'iOS devices a push reaches.',
    );
  });

  it('strips one comment at every address that carries it', () => {
    const jwks = loadDocument(DOCUMENT).byId.get('get_licensing_jwks');
    expect(jwks?.summary.startsWith('Publishes the Ed25519 PUBLIC verification key')).toBe(true);
  });

  it('keeps English', () => {
    expect(unname('Is it on?', 'get_x')).toBe('Is it on?');
    expect(unname('GitHub returns the person here.', 'get_provider_github_user_callback')).toBe(
      'GitHub returns the person here.',
    );
    expect(unname('Record turns in a conversation', 'post_agent_chat_conversations')).toBe(
      'Record turns in a conversation',
    );
    expect(unname('A sales channel is a named selling surface.', 'put_commerce_saleschannel')).toBe(
      'A sales channel is a named selling surface.',
    );
    expect(unname('Discord interactions endpoint', 'post_provider_discord_interactions')).toBe(
      'Discord interactions endpoint',
    );
    expect(unname('PUT semantics: the body replaces the record.', 'put_framework_by_doctype')).toBe(
      'PUT semantics: the body replaces the record.',
    );
    expect(unname("Returns the caller org's bots.", 'get_bot_members')).toBe(
      "Returns the caller org's bots.",
    );
    expect(unname('Is ClickHouse data for the org.', 'get_x')).toBe('ClickHouse data for the org.');
    expect(unname('Is YouTube linked.', 'get_x')).toBe('YouTube linked.');
    expect(unname('Is JavaScript code the page runs.', 'get_x')).toBe(
      'JavaScript code the page runs.',
    );
  });
});

describe('the rules a line is read against', () => {
  it('name each way a Go name opens a line', () => {
    expect(named('ListGPUTiers returns the tiers.', [])).not.toBe('');
    expect(named('Is askGet with the question.', [])).not.toBe('');
    expect(named('Is the datasets your org has.', [])).not.toBe('');
    expect(named('Delete removes one key.', ['kv', 'delete'])).not.toBe('');
    expect(doubled(['Pubkey publishes the key.', 'Publishes the key.'])).toEqual([
      'Pubkey publishes the key.',
    ]);
    expect(doubled(['Foo ', 'Bar'])).toEqual([]);
  });

  it('pass English', () => {
    expect(named('List articles', ['articles', 'list'])).toBe('');
    expect(named("List this org's datasets", ['dataset', 'list'])).toBe('');
    expect(named('GitHub App webhook', [])).toBe('');
    expect(named("OpenRouter's spend is invisible.", ['openrouter'])).toBe('');
    expect(named('Is it on?', [])).toBe('');
    expect(named('A sales channel is a surface.', ['saleschannel'])).toBe('');
  });

  // One list of brands: the loader keeps a brand's casing and the rules pass it,
  // so a brand added where product names are written is English to both.
  it('pass every brand the loader keeps', () => {
    expect(BRANDS.size).toBeGreaterThan(5);
    for (const b of BRANDS) {
      expect(unname(`Is ${b} linked.`, 'get_x')).toBe(`${b} linked.`);
      expect(named(`${b} links the account.`, [])).toBe('');
    }
  });

  it('name each way a line stops early', () => {
    expect(cut('Events are patterns to subscribe to (e.g.')).not.toBe('');
    expect(cut('Jurisdiction is the U.S.')).not.toBe('');
    expect(cut('Returns the roster…')).not.toBe('');
    expect(cut('Runs `a. b')).not.toBe('');
    expect(cut('Returns the value—e.g.')).not.toBe('');
    expect(cut('Starts enrolling a factor and hands over what it takes:')).not.toBe('');
    expect(cut('Events are patterns (e.g. `order.*`).')).toBe('');
    expect(cut('Keys, tokens, etc.')).toBe('');
    expect(cut('Returns the P&L over (from, to]: the balance.')).toBe('');
  });

  // What a line cut at a quotation's own "?" or full stop looked like, against
  // the paragraph it was cut from: each reads as finished on its own.
  it('name a line that stops at a quotation its source goes on after', () => {
    const cuts: Array<[string, string]> = [
      [
        'Answers "what am I approving?"',
        'Answers "what am I approving?" for a pending device code.',
      ],
      [
        'Answers a question about the books — "what is my MRR?", "how long is my runway?"',
        'Answers a question about the books — "what is my\nMRR?", "how long is my runway?" — with figures from the ledger.',
      ],
      [
        'Answers "is this browser signed in, and if not where does it sign in?"',
        'Answers "is this browser signed in, and if not where does it sign in?" – the bootstrap question.\n\nMore.',
      ],
      [
        'Entries are names — dotfiles included, "."',
        'Entries are names — dotfiles included, "." and ".." excluded (`ls -1A`).',
      ],
    ];
    for (const [line, text] of cuts) {
      expect(cut(line)).toBe('');
      expect(early(line, text)).not.toBe('');
      expect(early(firstSentence(text), text)).toBe('');
    }
    expect(early('It said "stop."', 'It said "stop." Then it stopped.')).toBe('');
    expect(early('It said "stop."', 'It said "stop."\n\nthen more.')).toBe('');
    expect(early('Is it on?', 'Is it on? ask.')).toBe('');
    expect(
      early(
        'Created says whether this call made the row.',
        'Created says whether this call made the row. false means it had.',
      ),
    ).toBe('');
  });
});

describe('an operation that cannot work', () => {
  it('is one whose prose says every call answers 501', () => {
    expect(
      unimplemented(
        'Publishes a post NOW. No connector is wired today, so every channel answers an honest 501.',
      ),
    ).toBe(true);
    expect(
      unimplemented('Answers 501 to every call: launching a bot run is not implemented.'),
    ).toBe(true);
  });

  it('is not one whose 501 depends on the deployment', () => {
    expect(
      unimplemented(
        'An empty upload is a 400, and a deployment with no scanner model answers 501.',
      ),
    ).toBe(false);
    expect(
      unimplemented('Where the linked-account plane is not resident the answer is an honest 501.'),
    ).toBe(false);
  });
});

describe('a heading is written as a reader says it', () => {
  it('spells an initialism, a brand and a compound the way they are written', () => {
    expect(heading('kyc')).toBe('KYC');
    expect(heading('tls')).toBe('TLS');
    expect(heading('oauth')).toBe('OAuth');
    expect(heading('webauthn-credentials')).toBe('WebAuthn credentials');
    expect(heading('github')).toBe('GitHub');
    expect(heading('saleschannel')).toBe('Sales channel');
    expect(heading('signin-sessions')).toBe('Sign-in sessions');
  });
});

describe('the noun a section is named for', () => {
  it('is the first word before the verb', () => {
    expect(nounOf(['members', 'list'])).toBe('members');
    expect(nounOf(['rm'])).toBe('');
  });

  it('passes over a one-letter route segment', () => {
    expect(nounOf(['o', 'sign', 'get'])).toBe('sign');
    expect(nounOf(['o', 'sign', 'fields', 'add'])).toBe('sign');
  });
});
