import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { beforeAll, describe, expect, it } from 'vitest';
import { DOCUMENT, METHODS, unimplemented, unname } from './openapi-doc';
import { genCliPages, heading, nounOf } from './gen-cli-pages';
import { loadCliTable } from './sync-cli-commands';

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

/** A Go doc comment's opening: a function's name, then the verb its comment
 *  says it with. `List activities` is an imperative and passes; `Delete removes
 *  one key` and `ListGPUTiers returns …` do not. */
const GO_OPENING =
  /^(?:[A-Z][a-z0-9]+[A-Z][A-Za-z0-9]* (?:is|are|[a-z]+s)|(?:Delete|Download|Get|Health|Issue|List|Publish|Revoke|Status|Stop|Verify) (?:is|returns|removes|reports|mints|resolves|terminates|distributes|turns|checks))\b/;

describe('the CLI reference, row by row', () => {
  it('has a page per command group and a row per command', () => {
    expect(pages.size).toBeGreaterThan(100);
    expect(rows.length).toBeGreaterThan(2000);
  });

  it('whole — no row stops with "…"', () => {
    expect(rows.filter((r) => r.what.trimEnd().endsWith('…')).map((r) => r.command)).toEqual([]);
  });

  it('unnamed — no row opens with the name of a Go function', () => {
    expect(
      rows
        .filter((r) => GO_OPENING.test(r.what))
        .map((r) => `${r.command}: ${r.what.slice(0, 60)}`),
    ).toEqual([]);
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

  it('keeps English', () => {
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
