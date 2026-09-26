// WHAT A READER-FACING LINE MUST NOT BE, stated once for the reference tests.
//
// The CLI rows, the API page descriptions and cells, and the MCP legend lines
// are all cut from Go doc comments, so they fail the same ways: they stop
// mid-sentence — visibly, or at a quotation's own full stop while the source
// goes on — or they open with the name of a function. Each test reads its
// own pages and asks this module what is wrong with a line; the rules are
// patterns, not lists of the names seen so far, so the next handler's name fails
// too.

import { BRANDS } from './openapi-doc';

/** Abbreviations whose full stop a sentence runs past. */
const ABBREVIATED =
  /(?:^|[\s(["'“‘—–])(?:e\.g|i\.e|a\.k\.a|vs|cf|viz|approx|incl|esp|[A-Z](?:\.[A-Z])+)\.$/i;

/** Text outside code spans, where a bracket or a full stop is the prose's own. */
const prose = (s: string) => s.replace(/`[^`]*`/g, '``');

/**
 * Why `line` stops before its sentence ends, or '' when it does not. A line
 * the page never finished reads as finished, so each way of stopping is named.
 */
export function cut(line: string): string {
  const t = line.trim();
  if (t.endsWith('…')) return 'ends with "…"';
  if (t.endsWith(':')) return 'ends at the colon that leads into what it left out';
  if (ABBREVIATED.test(t)) return 'ends at an abbreviation';
  if ((t.match(/`/g) ?? []).length % 2) return 'ends inside a code span';
  const p = prose(t);
  // Either bracket closes either: `(from, to]` is an interval, not a cut.
  if ((p.match(/[([]/g) ?? []).length > (p.match(/[)\]]/g) ?? []).length)
    return 'ends inside a bracket';
  return '';
}

/**
 * Why `line`, printed as the first sentence of `text`, stops before that
 * sentence does, or '' when it does not. `cut` reads the line alone and cannot
 * see this, so this rule reads the line against its source:
 *
 *   mid-sentence   the line ends on no stop while its paragraph goes on — a
 *                  summary cut at the end of a comment's first line, "Recall
 *                  … for context injection; with q it" of "… it ranks
 *                  semantically, …"
 *   at a quotation a quotation's own "?" or full stop reads as a sentence's end —
 *                  `Answers "what am I approving?"` — while the paragraph goes
 *                  on in lower case ("for a pending device code.") or after a
 *                  dash
 */
export function early(line: string, text: string): string {
  const t = line.trim();
  const para = (text.trim().split(/\n\s*\n/)[0] ?? '').replace(/\s+/g, ' ').trim();
  if (!t || para.length <= t.length || !para.startsWith(t)) return '';
  if (!/[.?!]["'”’]*$/.test(t)) return 'stops mid-sentence where its paragraph goes on';
  return /[.?!]["'”’]+$/.test(t) && /^\s*(?:[a-z]|[—–-])/.test(para.slice(t.length))
    ? 'stops at a quotation its sentence goes on after'
    : '';
}

/**
 * Why `line` opens with a Go name, or '' when it opens in English. `own` is
 * the words the line's own command, page or operation is named with.
 *
 *   an identifier     a first word English does not spell (`ListGPUTiers`)
 *   a leftover        "Is …", what "<Name> is …" leaves once the name is gone
 *   its own name      `Delete removes …` on the page for delete: a word of
 *                     the operation's name, then a verb that is not
 */
export function named(line: string, own: string[]): string {
  const [first = '', second = ''] = line.trim().split(/\s+/);
  const word = first.replace(/(?:['’]s)?[^A-Za-z0-9]*$/, '');
  if (/^Is$/.test(word) && /^[a-z]/.test(second) && !/^[^.!]*\?/.test(line))
    return 'opens with "Is"';
  if (/[a-z0-9][A-Z]/.test(word) && !BRANDS.has(word)) return `opens with the identifier ${word}`;
  const verb =
    /^(?:is|are|[a-z]+s)$/.test(second) &&
    !/^(?:this|its|his|thus|plus|as|us)$/.test(second) &&
    !own.includes(second);
  if (/^[A-Z][a-z0-9]+$/.test(word) && verb && own.some((w) => w.startsWith(word.toLowerCase())))
    return `opens with its own name, ${word}`;
  return '';
}

/**
 * Lines that are another line with a word put in front: `Pubkey publishes the
 * key` next to `Publishes the key`. One comment stripped at one address and
 * printed whole at another.
 */
export function doubled(lines: Iterable<string>): string[] {
  const all = new Set(lines);
  const out: string[] = [];
  for (const l of all) {
    const rest = l.replace(/^\S+ /, '');
    if (rest && rest !== l && all.has(rest[0].toUpperCase() + rest.slice(1))) out.push(l);
  }
  return out;
}
