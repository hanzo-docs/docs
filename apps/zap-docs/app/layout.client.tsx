'use client';

import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';

export function Body({ children }: { children: ReactNode }) {
  return (
    <body className="antialiased">
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </body>
  );
}

export function ZapIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M13 3L4 14h7l-2 7 9-11h-7l2-7z" />
    </svg>
  );
}
