import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Pre-parse MDX sanitizer for ported/upstream docs.
//
// remarkPassthroughUnknownJsx (source.config.ts) already neutralises foreign JSX
// in content/docs/projects/** and content/docs/services/**, but it runs AFTER the
// MDX parser. Angle-bracket autolinks — `<https://x>`, `<mailto:a@b>` — break the
// parser ITSELF (MDX reads `<h` as the start of a JSX tag, then chokes on `:` /
// `/`), so the whole page is dropped and renders only the error-boundary fallback.
//
// This rewrites those autolinks to bare text (GFM re-links bare URLs) everywhere,
// skipping fenced code blocks. It is idempotent and runs in pre-build after the
// project sync.
//
// The second construct is the same failure with a different cause: MDX ends an
// ESM block at a BLANK LINE, so `import X from 'y'` with the page's `# Title` on
// the very next line hands acorn `import X from 'y'\n# Title` and it dies with
// "Could not parse import/exports with acorn". One missing newline silently
// blanked ten of this site's most-linked pages — getting-started, iam, llm, sql,
// pubsub, o11y, gateway, commerce, chat, cli — each shipping a full <article>
// shell with no body. A page that renders empty passes every link checker, which
// is why nothing caught it. `terminateImportHeader` closes that header.
//
// The terminator runs ONLY over that header — the run of `import … from '…'`
// lines directly after the frontmatter — and stops at the first line that is
// anything else. Deeper in a page an unterminated ``` fence can leave Python's
// `import json` looking like flow content, and inserting a blank line there
// would split somebody's code sample. That bug is a header bug; so is its fix.
// Dropping a ported page's imports is not — see `sanitize` below.
//
// NOTE: we deliberately do NOT strip standalone JSX wrapper tags here. Doing so
// orphans the many inline `</Tab>` / `</Card>` / `</Step>` closes that ported docs
// use, which turns healthy pages into parse failures — a net regression.

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.resolve(SCRIPT_DIR, '..', 'content', 'docs');

const AUTOLINK = /<((?:https?|ftp|mailto):[^\s<>]+)>/g;

// HTML that a markdown renderer accepts and an MDX parser does not. Ported docs
// are somebody else's README, written for GitHub, so all three shapes below
// arrive by the hundred and each one drops its whole page:
//
//   <img src=x>        a void element left open. MDX is JSX: it waits for a
//                      closing tag, swallows the rest of the page, and reports
//                      the mismatch at whatever closes next ("expected
//                      corresponding closing tag for <img>").
//   <!-- … -->         an HTML comment. MDX reads `<` then `!` and stops.
//   width=95%          an unquoted attribute value, which JSX does not allow.
//
// Rewriting is the port: the page keeps its markup and its meaning, and the
// parser can read it. Upstream is not ours to fix, and a page that renders only
// the error boundary is not a port.
const NAME = /^[a-zA-Z_:][-a-zA-Z0-9_:.]*/;

/**
 * Quote every unquoted attribute value in one tag's attribute text.
 *
 * Walked rather than matched: a URL already inside quotes carries `=` of its
 * own, and a pattern that reads `name=value` anywhere rewrites the query string
 * of an image badge into a broken attribute. The scanner knows when it is
 * inside a value and leaves it alone.
 */
function quoteAttrs(attrs: string): string {
  let out = '';
  let i = 0;
  while (i < attrs.length) {
    const rest = attrs.slice(i);
    const ws = /^\s+/.exec(rest);
    if (ws) {
      out += ws[0];
      i += ws[0].length;
      continue;
    }
    const name = NAME.exec(attrs.slice(i));
    if (!name) {
      out += attrs[i];
      i += 1;
      continue;
    }
    out += name[0];
    i += name[0].length;
    if (attrs[i] !== '=') continue;
    out += '=';
    i += 1;
    const q = attrs[i];
    if (q === '"' || q === "'" || q === '{') {
      const close = q === '{' ? '}' : q;
      const end = attrs.indexOf(close, i + 1);
      const stop = end === -1 ? attrs.length : end + 1;
      out += attrs.slice(i, stop);
      i = stop;
      continue;
    }
    let end = i;
    while (end < attrs.length && !/\s/.test(attrs[end])) end += 1;
    out += `"${attrs.slice(i, end)}"`;
    i = end;
  }
  return out;
}

const VOID_TAGS = new Set([
  'img', 'br', 'hr', 'input', 'source', 'meta', 'col', 'embed', 'area', 'base',
  'link', 'track', 'wbr',
]);

/** Any HTML tag: lowercase names only, so a JSX component is never touched. */
const TAG = /<(\/?)([a-z][a-z0-9-]*)((?:\s[^<>]*?)?)(\/?)>/g;

/**
 * Rewrite one line's HTML so MDX can read it: voids self-closed, attribute
 * values quoted. Local, per tag, and never structural — a page's tags are
 * balanced by whoever wrote it, and a rewriter that starts dropping or adding
 * closes deletes the one line holding somebody's JSX together.
 */
function html(line: string): string {
  return line.replace(TAG, (whole, close: string, tag: string, attrs: string, selfClose: string) => {
    if (close) return whole;
    const name = tag.toLowerCase();
    const quoted = quoteAttrs(attrs).trim();
    const rendered = `<${tag}${quoted ? ' ' + quoted : ''}`;
    if (VOID_TAGS.has(name)) return `${rendered} />`;
    return `${rendered}${selfClose ? ' />' : '>'}`;
  });
}

/** One whole ESM import with a module specifier, bound or bare. */
const IMPORT = /^import\s+(?:.*\sfrom\s+)?['"][^'"]+['"];?\s*$/;

/** First line after the frontmatter and any blank lines — where the import header starts. */
function headerStart(lines: string[]): number {
  let i = lines[0] === '---' ? lines.indexOf('---', 1) + 1 : 0;
  while (lines[i]?.trim() === '') i++;
  return i;
}

/** Blank line after the last import of the header, if markdown starts right on it. */
function terminateImportHeader(lines: string[]): void {
  let i = headerStart(lines);
  let last = -1;
  for (; IMPORT.test(lines[i] ?? ''); i++) last = i;
  if (last >= 0 && (lines[last + 1] ?? '').trim() !== '') lines.splice(last + 1, 0, '');
}

// Every ESM import in a ported page is dead, and that is a rule rather than a
// list of bad specifiers, because the JSX side already decided it: for
// projects/**, remarkPassthroughUnknownJsx (source.config.ts) rewrites every
// unknown PascalCase component to a fragment AND clears its attributes, so no
// imported binding is ever referenced by the rendered tree. Nothing reads these
// lines.
//
// Dead would be harmless; unresolvable is not. A specifier Next cannot resolve
// fails the WHOLE build, not its page, and every doc platform ports its own
// flavour of them — `@theme/CodeBlock` (Docusaurus), `./index.tsx?demo` (dumi),
// `fumadocs-ui/components/tabs` (the upstream names of packages we fork and ship
// as `@hanzo/docs-*`), `./partials/_setup.mdx`, `../CHANGELOG.md`. Chasing them
// one pattern at a time just uncovers the next flavour — python-sdk and the icons
// demo, then Detox behind them. The invariant covers all of them at once.
//
// Where the line sits is not part of it. Dropping only the run after the
// frontmatter read this as a header bug, and it is not one: Docusaurus declares
// a partial where the partial is USED, so flow imports `@site/docs/_partial-*`
// from the middle of its prose, and 54 such lines failed the whole export while
// every header was already clean. A fenced `import` is somebody's code sample,
// which is the one distinction that matters — hence the single pass below,
// where the fence state is already known.
function sanitize(src: string, ported: boolean, stats: { dropped: number }): string {
  const kept: string[] = [];
  let inFence = false;
  let inComment = false;
  let fence = '';
  for (const line of src.split('\n')) {
    const trimmed = line.trimStart();
    if (inFence) {
      if (trimmed.startsWith(fence)) inFence = false;
      kept.push(line);
      continue;
    }
    if (trimmed.startsWith('```') || trimmed.startsWith('~~~')) {
      inFence = true;
      fence = trimmed.slice(0, 3);
      kept.push(line);
      continue;
    }
    if (ported && IMPORT.test(line)) {
      stats.dropped++;
      continue;
    }
    let out = line.replace(AUTOLINK, '$1');
    if (ported) {
      // A comment can span lines, so the state travels with the loop: the line
      // that opens one carries `{/*`, the line that closes it carries `*/}`.
      if (inComment) {
        const end = out.indexOf('-->');
        if (end === -1) {
          kept.push(out);
          continue;
        }
        inComment = false;
        out = out.slice(0, end) + '*/}' + out.slice(end + 3);
      }
      out = out.replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}');
      const start = out.indexOf('<!--');
      if (start !== -1) {
        inComment = true;
        out = out.slice(0, start) + '{/*' + out.slice(start + 4);
      }
      out = html(out);
    }
    kept.push(out);
  }
  terminateImportHeader(kept);
  return kept.join('\n');
}

const PORTED_DIR = path.join(CONTENT_DIR, 'projects');

export function sanitizeMdx(): void {
  if (!fs.existsSync(CONTENT_DIR)) return;
  let scanned = 0;
  let fixed = 0;
  const stats = { dropped: 0 };
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fp = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fp);
      } else if (entry.name.endsWith('.mdx')) {
        scanned++;
        const orig = fs.readFileSync(fp, 'utf8');
        const out = sanitize(orig, fp.startsWith(PORTED_DIR), stats);
        if (out !== orig) {
          fs.writeFileSync(fp, out);
          fixed++;
        }
      }
    }
  };
  walk(CONTENT_DIR);
  console.log(
    `[sanitize-mdx] scanned ${scanned} mdx, rewrote ${fixed} ` +
      `(autolinks, ESM blocks, ${stats.dropped} ported imports)`,
  );
}

if (import.meta.main) sanitizeMdx();
