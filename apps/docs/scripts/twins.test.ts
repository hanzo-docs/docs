import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { destination, place } from './twins';

const write = (root: string, rel: string, body: string) => {
  fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
  fs.writeFileSync(path.join(root, rel), body);
};

describe('destination', () => {
  it.each([
    ['content.md', 'index.md'],
    ['docs/content.md', 'docs.md'],
    ['docs/a/b/content.md', 'docs/a/b.md'],
    ['blog/welcome/content.md', 'blog/welcome.md'],
  ])('%s -> %s', (from, to) => expect(destination(from)).toBe(to));
});

describe('place', () => {
  it('puts each twin at <page>.md and names the HTML pages left without one', () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), 'twins-'));
    write(out, 'llms.mdx/content.md', '# Home\n');
    write(out, 'llms.mdx/docs/content.md', '# Docs\n');
    write(out, 'llms.mdx/docs/agents/content.md', '# Agents\n');
    write(out, 'index.html', '<html></html>');
    write(out, 'docs/index.html', '<html></html>');
    write(out, 'docs/agents/index.html', '<html></html>');
    write(out, 'docs/orphan/index.html', '<html></html>');
    write(out, '404.html', '<html></html>');
    write(out, 'login/index.html', '<meta name="generator" content="emit-redirects">');

    const { copied, missing } = place(out);
    expect(copied).toBe(3);
    expect(fs.readFileSync(path.join(out, 'index.md'), 'utf8')).toBe('# Home\n');
    expect(fs.readFileSync(path.join(out, 'docs.md'), 'utf8')).toBe('# Docs\n');
    expect(fs.readFileSync(path.join(out, 'docs/agents.md'), 'utf8')).toBe('# Agents\n');
    expect(missing).toEqual(['/docs/orphan/index.html']);
    fs.rmSync(out, { recursive: true });
  });
});
