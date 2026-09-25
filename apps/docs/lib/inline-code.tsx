import type { ReactNode } from 'react';

/**
 * A description is one line of prose, and the reference writes a command or a
 * field in it the way it does everywhere, in backticks: "The `hanzo bot`
 * commands." Printed as text — under the page title, on the previous/next
 * cards, in a link's hover card — the backticks showed. Each span is code here;
 * an unpaired backtick leaves the line as text.
 */
export function inlineCode(s: string | undefined): ReactNode {
  const parts = (s ?? '').split('`');
  if (parts.length < 3 || parts.length % 2 === 0) return s;
  return parts.map((part, i) =>
    i % 2 ? (
      <code key={i} className="font-mono text-[0.9em]">
        {part}
      </code>
    ) : (
      part
    ),
  );
}
