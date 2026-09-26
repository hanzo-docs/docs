// MDX SAFETY, in one place.
//
// Every generator writes MDX from prose that was written as Go doc comments or
// JSON Schema descriptions — markdown at best, and full of `{`, `<T>` and `|`,
// each of which is syntax to MDX or to a GFM table. Escaping it is the same
// problem for every generator, so it is solved once here rather than re-solved
// slightly differently in each.

/** Inline code inside a table cell: collapse newlines, escape the cell pipe. */
export const code = (s: unknown): string =>
  String(s ?? '')
    .replace(/[\r\n]+/g, ' ')
    .trim()
    .replace(/\|/g, '\\|');

/** Table or heading text: neutralise the cell pipe, JSX and MDX expressions. */
export const text = (s: unknown): string =>
  String(s ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\|/g, '\\|')
    .replace(/[<>]/g, (c) => (c === '<' ? '&lt;' : '&gt;'))
    .replace(/[{}]/g, (c) => (c === '{' ? '&#123;' : '&#125;'));

/**
 * Running prose. Escapes MDX expressions and JSX in the narrative while leaving
 * fenced blocks and inline code spans verbatim — MDX parses neither.
 */
export function prose(s: string): string {
  if (!s) return '';
  return String(s)
    .split(/(```[\s\S]*?```|`[^`\n]*`)/g)
    .map((part, i) =>
      i % 2 === 1
        ? part
        : part
            .replace(/[{}]/g, (c) => (c === '{' ? '&#123;' : '&#125;'))
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;'),
    )
    .join('')
    .trim();
}

/** A frontmatter scalar that survives any punctuation in the source prose. */
export const yamlString = (s: string): string =>
  JSON.stringify(String(s ?? '').replace(/\s+/g, ' ').trim());

/**
 * A Go package doc opens with the package's own name — `gofmt` and every linter
 * require it — so the synopsis every product page is cut from arrives as
 * "Package ads is your paid ad campaigns". That sentence is correct Go and wrong
 * product prose twice over: it names an identifier no caller can see, and where
 * the package is not named after the capability it names the WRONG one
 * (`hanzo audit` read "Package auditlog is …", `hanzo authz` read "Package serve
 * is …").
 *
 * The convention is stripped where it is READ rather than fixed where it is
 * written, because it is not wrong where it is written. Same shape as zip
 * dropping a handler's own name from a lifted doc comment.
 *
 * Only an exact leading match goes: "Package <ident> is " or "Package <ident> ",
 * and what follows is re-capitalised. Prose that merely opens with the word
 * "Package" — a sentence about packaging — keeps it.
 */
export const unpackage = (s: string): string => {
  const m = String(s ?? '').match(/^Package\s+([A-Za-z_][A-Za-z0-9_]*)\s+(is\s+)?/);
  if (!m) return String(s ?? '');
  const rest = String(s).slice(m[0].length);
  return rest ? rest[0].toUpperCase() + rest.slice(1) : '';
};

/**
 * The first sentence, for a description, a table cell or a card blurb.
 *
 * WHOLE, always. It used to be cut to a budget — at the last sentence boundary
 * inside it, else mid-clause with an ellipsis — and a budget of 120 characters
 * against summaries that run to 400 put "…" on a quarter of the reference: the
 * CLI page for `bot` read "Returns the caller org's bots as space members — each
 * with the member account uuid and the Person reference the roster…". A cell that
 * stops mid-clause is not shorter, it is unfinished, and the reader cannot get
 * the rest from where they are. The summary is already written to be one
 * sentence (cloud's zipdoc cuts it at the first full stop), so it is printed as
 * written; a long one wraps.
 *
 * Only the first PARAGRAPH is read, so prose that opens with a list or a block
 * and has no full stop in its first paragraph gives that paragraph, not the page.
 *
 * A full stop ends the sentence only where a reader would stop. Not after an
 * abbreviation — "subscribe to (e.g. `commerce.order.>`)" was printed as
 * "subscribe to (e.g." and "the U.S. state of formation" as "the U.S." — and
 * not inside brackets or a code span, where the sentence has not ended even if a
 * sentence inside it has. "etc." ends one only when a capital follows it.
 */
export const firstSentence = (s: string): string => {
  const para = String(s ?? '').trim().split(/\n\s*\n/)[0] ?? '';
  const t = para.replace(/\s+/g, ' ').trim();
  let depth = 0;
  let code = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (c === '`') code = !code;
    if (code) continue;
    if (c === '(' || c === '[') depth++;
    else if ((c === ')' || c === ']') && depth > 0) depth--;
    if (depth > 0 || (c !== '.' && c !== '!' && c !== '?')) continue;
    let end = i + 1;
    while (end < t.length && /["'”’]/.test(t[end])) end++;
    if (end < t.length && t[end] !== ' ') continue;
    if (c === '.' && abbreviation(t.slice(0, i), t.slice(end + 1))) continue;
    return t.slice(0, end);
  }
  return t;
};

/** Whether the full stop after `before` closes an abbreviation, not a sentence. */
const abbreviation = (before: string, after: string): boolean => {
  const word = /(?:^|[\s(["'])([A-Za-z][A-Za-z.]*)$/.exec(before)?.[1] ?? '';
  if (/^(?:e\.g|i\.e|a\.k\.a|vs|cf|viz|approx|incl|esp)$/i.test(word)) return true;
  if (/^[A-Z](?:\.[A-Z])*$/.test(word)) return true;
  return /^etc$/i.test(word) && !/^[A-Z]/.test(after);
};

export const fence = (lang: string, body: string): string[] => ['```' + lang, body, '```'];
