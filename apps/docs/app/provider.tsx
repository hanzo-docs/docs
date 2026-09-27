'use client';

import { NextThemeProvider, useRootTheme } from '@hanzogui/next-theme';
import { Hanzo } from '@hanzo/ui';
import type { ReactNode } from 'react';
import { SearchProvider } from '@/components/search';

// ONE authority for the theme: the `t_dark` / `t_light` class on <html>.
//
// gui's NextThemeProvider writes it — from a script that runs before the first
// paint, so a reader who chose light never sees the dark ground flash — and gui's
// tokens, @hanzo/ui's design tokens and this app's CSS all key on it. `<Hanzo>`
// takes the same name, so the components and the document cannot disagree:
// useRootTheme reads the class the script already wrote, and a toggle moves both.
export function Provider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useRootTheme({ fallback: 'dark' });

  return (
    <NextThemeProvider
      skipNextHead
      defaultTheme="dark"
      enableSystem={false}
      onChangeTheme={(name) => setTheme(name === 'light' ? 'light' : 'dark')}
    >
      <Hanzo theme={theme}>
        <SearchProvider>{children}</SearchProvider>
      </Hanzo>
    </NextThemeProvider>
  );
}
