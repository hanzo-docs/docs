import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { loadDocument, opHref, opSlug, type Operation } from './openapi-doc';
import { MAX_DEPTH, fields, typeName } from './openapi-schema';
import { SECTIONS, renderOperation } from './gen-openapi-pages';

// THE REFERENCE'S OWN CONTRACT.
//
// A page per operation is only a reference if it is uniform (every page the
// same sections in the same order), complete (every field enumerated, never
// sliced) and addressable (no two operations at one URL). Each of those is a
// property of code in this directory, so each is asserted here against THE
// document rather than against a fixture that can agree with a bug.

const DOCUMENT = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '../openapi-specs/hanzo.yaml',
);
const doc = loadDocument(DOCUMENT);

const op = (id: string): Operation => {
  const found = doc.byId.get(id);
  if (!found) throw new Error(`${id} is not in the document`);
  return found;
};

describe('the document resolves', () => {
  it('has products and operations', () => {
    expect(doc.products.length).toBeGreaterThan(100);
    expect(doc.operations.length).toBeGreaterThan(2000);
    expect(doc.unresolved).toHaveLength(0);
  });
});

// The slug drops the id's own prefix when that prefix IS the product it groups
// under, and keeps it otherwise. The `machines` pair is why: two different
// routes whose ids end in the same three words, both grouped under `machines`
// by path. Strip both prefixes and they collide on one page.
describe('operationId -> page address', () => {
  it.each([
    ['ai_createChatCompletion', 'ai', 'create-chat-completion'],
    ['bot_authMe', 'bot', 'auth-me'],
    ['cloud_unbindMachineAgent', 'machines', 'cloud-unbind-machine-agent'],
    ['visor_unbindMachineAgent', 'machines', 'visor-unbind-machine-agent'],
    ['cloud_get_v1_tools', 'tools', 'cloud-get-v1-tools'],
  ])('%s under %s -> %s', (id, product, slug) => {
    expect(opSlug({ id, product } as Operation)).toBe(slug);
  });

  it('gives every operation in a product a distinct address', () => {
    const collisions: string[] = [];
    for (const p of doc.products) {
      const seen = new Map<string, string>();
      for (const o of p.operations) {
        const slug = opSlug(o);
        const first = seen.get(slug);
        if (first) collisions.push(`${p.name}/${slug}: ${first} and ${o.id}`);
        else seen.set(slug, o.id);
      }
    }
    expect(collisions).toEqual([]);
  });

  it('never addresses an operation as its folder index', () => {
    expect(doc.operations.filter((o) => opSlug(o) === 'index')).toEqual([]);
  });

  it('puts the page under its product', () => {
    expect(opHref(op('ai_createChatCompletion'))).toBe('/docs/openapi/ai/create-chat-completion');
  });
});

describe('every declared response is read, not just the 2xx', () => {
  it('keeps the failures and orders them', () => {
    const chat = op('ai_createChatCompletion');
    expect(chat.success?.status).toBe('200');
    expect(chat.errors.map((r) => r.status)).toEqual(['401', '402', '429']);
    expect(chat.responses.map((r) => r.status)).toEqual(['200', '401', '402', '429']);
  });

  // Ordering asserted over the WHOLE document rather than one example: in this
  // revision every operation that declares `default` declares nothing else, so
  // a hand-picked case would prove nothing and would rot the day that changes.
  it('orders every operation numerically, with ranges and `default` after their hundred', () => {
    const rank = (s: string) =>
      /^\d{3}$/.test(s) ? Number(s) : /^\dXX$/i.test(s) ? Number(s[0]) * 100 : 1000;
    const unsorted = doc.operations.filter((o) =>
      o.responses.some((r, i) => i > 0 && rank(r.status) < rank(o.responses[i - 1].status)),
    );
    expect(unsorted.map((o) => o.id)).toEqual([]);
  });

  it('counts every declared status, success and failure alike', () => {
    const declared = doc.operations.reduce((n, o) => n + o.responses.length, 0);
    const split = doc.operations.reduce(
      (n, o) => n + o.errors.length + o.responses.filter((r) => /^2/i.test(r.status)).length,
      0,
    );
    expect(split).toBe(declared);
  });
});

describe('a schema is enumerated, not summarised', () => {
  const raw = doc.raw;

  it('flattens nesting into the field name', () => {
    const rows = fields(raw, op('ai_createChatCompletion').body!.schema);
    const names = rows.map((f) => f.name);
    expect(names).toContain('messages');
    expect(names).toContain('messages[].role');
    expect(names).toContain('messages[].content');
  });

  it('carries type, requiredness, default and every enum value', () => {
    const rows = fields(raw, op('ai_createChatCompletion').body!.schema);
    const role = rows.find((f) => f.name === 'messages[].role')!;
    expect(role.type).toBe('string');
    expect(role.required).toBe(true);
    expect(role.enum).toEqual(['system', 'user', 'assistant', 'tool']);
    const stream = rows.find((f) => f.name === 'stream')!;
    expect(stream.default).toBe('false');
    expect(stream.required).toBe(false);
  });

  it('states nothing when the document states nothing, so the page can say so', () => {
    expect(fields(raw, undefined)).toEqual([]);
    expect(fields(raw, null)).toEqual([]);
  });

  it('returns one row for a body that is not an object', () => {
    const rows = fields(raw, { type: 'string', format: 'binary' }, '(body)');
    expect(rows).toHaveLength(1);
    expect(rows[0].name).toBe('(body)');
    expect(rows[0].type).toBe('string (binary)');
  });

  it('merges allOf and shows both sides of a oneOf', () => {
    const schema = {
      allOf: [
        { type: 'object', required: ['a'], properties: { a: { type: 'string' } } },
        { type: 'object', properties: { b: { type: 'integer' } } },
      ],
    };
    expect(fields(raw, schema).map((f) => f.name)).toEqual(['a', 'b']);
    const either = {
      type: 'object',
      properties: {
        target: { oneOf: [{ type: 'object', properties: { url: { type: 'string' } } }, { type: 'object', properties: { id: { type: 'string' } } }] },
      },
    };
    expect(fields(raw, either).map((f) => f.name)).toEqual(['target', 'target.url', 'target.id']);
  });

  it('terminates on a self-referencing schema', () => {
    const node: any = { type: 'object', properties: { name: { type: 'string' } } };
    node.properties.child = node;
    const rows = fields(raw, node);
    expect(rows.map((f) => f.name)).toEqual(['name', 'child']);
  });

  it('names free-form keys rather than dropping them', () => {
    const rows = fields(raw, {
      type: 'object',
      properties: { labels: { type: 'object', additionalProperties: { type: 'string' } } },
    });
    expect(rows.map((f) => f.name)).toEqual(['labels', 'labels.*']);
  });

  // The depth guard must never be what stops the enumeration: if the document
  // ever nests deeper than the cap, fields past it would go missing without the
  // page saying so, which is the one failure mode a reference cannot have.
  it('never reaches the depth guard on this document', () => {
    let deepest = 0;
    for (const o of doc.operations) {
      for (const schema of [o.body?.schema, ...o.responses.map((r) => r.schema)]) {
        if (!schema) continue;
        for (const f of fields(raw, schema)) {
          deepest = Math.max(deepest, f.name.split('.').length);
        }
      }
    }
    expect(deepest).toBeGreaterThan(1);
    expect(deepest).toBeLessThan(MAX_DEPTH);
  });

  it('keeps the $ref name a reader recognises', () => {
    const chat = op('ai_createChatCompletion');
    const rows = fields(raw, chat.body!.schema);
    expect(rows.find((f) => f.name === 'messages')!.type).toBe('ai_ChatMessage[]');
    expect(typeName(raw, { type: 'integer', format: 'int64' })).toBe('integer (int64)');
  });
});

describe('every operation page has the same shape', () => {
  const headings = (mdx: string) =>
    mdx
      .split('\n')
      .filter((l) => /^## [A-Z]+$/.test(l))
      .map((l) => l.slice(3));

  const canonical = SECTIONS.map((s) => s.heading);

  it('is the eight sections, in order', () => {
    expect(canonical).toEqual([
      'NAME',
      'SYNOPSIS',
      'DESCRIPTION',
      'REQUEST',
      'RESPONSE',
      'PARAMETERS',
      'ERRORS',
      'EXAMPLES',
    ]);
  });

  // Three operations chosen for what the document does NOT say about them: one
  // fully described, one with no request body, one with neither prose nor a
  // declared failure. All three must still render all eight sections.
  it.each([
    ['ai_createChatCompletion'],
    ['bot_authMe'],
    ['cloud_get_v1_by_wildcard1'],
  ])('%s renders all eight', (id) => {
    const o = op(id);
    const product = doc.products.find((p) => p.name === o.product)!;
    const mdx = renderOperation({
      op: o,
      product,
      doc,
      cliTable: new Map(),
      mcpTools: new Map(),
    });
    expect(headings(mdx)).toEqual(canonical);
    // A gap is stated, never silently skipped.
    expect(mdx).toContain('## REQUEST');
    expect(mdx.split('## REQUEST')[1].trim().length).toBeGreaterThan(20);
  });

  it('states the gap where the document has no prose', () => {
    const o = op('cloud_get_v1_by_wildcard1');
    expect(o.description).toBe('');
    const mdx = renderOperation({
      op: o,
      product: doc.products.find((p) => p.name === o.product)!,
      doc,
      cliTable: new Map(),
      mcpTools: new Map(),
    });
    expect(mdx).toContain('The document carries no description for this operation');
  });

  it('prints a URL a reader can paste, even with an untyped path parameter', () => {
    const o = op('cloud_get_v1_by_wildcard1');
    const mdx = renderOperation({
      op: o,
      product: doc.products.find((p) => p.name === o.product)!,
      doc,
      cliTable: new Map(),
      mcpTools: new Map(),
    });
    // The document's own `{wildcard1}` template, not `<wildcard1>`, which is not
    // a legal path segment and read to the endpoint gate as the bare `/v1/`.
    expect(mdx).toContain('https://api.hanzo.ai/v1/{wildcard1}');
    expect(mdx).not.toContain('https://api.hanzo.ai/v1/<wildcard1>');
  });
});
