import { codeTheme } from '@hanzo/ui/core';

/**
 * The code theme. It is not chosen here: `codeTheme` from @hanzo/ui names it
 * for every Hanzo surface (Dracula dark, GitHub light), so a block on this site
 * reads the same as one on hanzo.ai, platform.hanzo.ai and ui.hanzo.ai.
 *
 * Shape shiki/rehype-code want: `{ themes, defaultColor }`. One object, so no
 * caller spells the pair.
 *
 * `light-dark()` writes each token, and the block's ground, as
 * `light-dark(<light>, <dark>)`, so the page's `color-scheme` — set by the theme
 * class on <html> — chooses the palette in the browser. No stylesheet has to
 * know which theme is on, which is what lets the code block be a gui part with
 * no rules of its own.
 */
export const shikiConfig = {
  themes: codeTheme,
  defaultColor: 'light-dark()',
} as const;
