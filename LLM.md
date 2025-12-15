# LLM.md - Hanzo Docs Multi-Brand Documentation System

This document provides detailed technical guidance for AI assistants working with the Hanzo documentation ecosystem.

## Overview

The Hanzo Docs system is a multi-brand documentation framework based on [Fumadocs](https://fumadocs.dev). It supports three organizations:

| Brand | Organization | Repository | Domain |
|-------|-------------|------------|--------|
| Hanzo | Hanzo AI Inc (Techstars '17) | `~/work/hanzo/docs` | docs.hanzo.ai |
| Lux | Lux Network | `~/work/lux/docs` | docs.lux.network |
| Zoo | Zoo Labs Foundation (501c3) | `~/work/zoo/docs` | docs.zoo.ngo |

## Architecture

### Main Monorepo (Hanzo Docs)

The main documentation framework at `~/work/hanzo/docs` is a pnpm workspace monorepo:

```
~/work/hanzo/docs/
├── apps/
│   └── docs/              # Main docs application
├── packages/
│   ├── brand/             # Brand configuration (colors, themes)
│   ├── core/              # fumadocs-core (source loading, search)
│   ├── ui/                # fumadocs-ui (components, layouts)
│   ├── mdx/               # fumadocs-mdx (MDX processing)
│   ├── openapi/           # fumadocs-openapi (API docs)
│   └── ...                # Other packages
├── examples/              # Example implementations
└── scripts/
    ├── build-all-docs.sh  # Build all three docs sites
    └── dev-all-docs.sh    # Start dev for all three
```

### Standalone Sites (Lux & Zoo)

Each standalone site uses the Fumadocs packages but has its own Next.js application:

```
~/work/lux/docs/           # Lux Network documentation
~/work/zoo/docs/           # Zoo Labs documentation
```

## Critical Configuration Patterns

### 1. Source Configuration (`source.config.ts`)

**CRITICAL**: Must include `async: true` to enable `page.data.load()` method.

```typescript
import { defineConfig, defineDocs, frontmatterSchema, metaSchema } from 'fumadocs-mdx/config';
import { z } from 'zod';

export const docs = defineDocs({
  docs: {
    schema: frontmatterSchema.extend({
      preview: z.string().optional(),
      index: z.boolean().default(false),
    }),
    async: true,  // REQUIRED for page.data.load()
  },
  meta: {
    schema: metaSchema.extend({
      description: z.string().optional(),
    }),
  },
});

export default defineConfig({
  mdxOptions: { remarkPlugins: [], rehypePlugins: [] },
});
```

### 2. Source Loader (`lib/source.ts`)

**CRITICAL**: Must use `docs.toFumadocsSource()` for async loading.

```typescript
import { docs } from '@/.source';
import { loader } from 'fumadocs-core/source';

export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),  // Converts async docs to proper source
});
```

### 3. Page Component (`app/docs/[[...slug]]/page.tsx`)

**CRITICAL**: Use async `page.data.load()` pattern, NOT `page.data.body`.

```tsx
import { source } from '@/lib/source';
import { DocsPage, DocsBody } from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import defaultMdxComponents from 'fumadocs-ui/mdx';

export default async function Page(props: { params: Promise<{ slug?: string[] }>; }) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  // CORRECT: Use load() for async MDX
  const { body: Mdx, toc } = await page.data.load();

  return (
    <DocsPage toc={toc}>
      <h1 className="text-2xl font-bold mb-4">{page.data.title}</h1>
      {page.data.description && (
        <p className="text-fd-muted-foreground mb-6">{page.data.description}</p>
      )}
      <DocsBody>
        <Mdx components={defaultMdxComponents} />
      </DocsBody>
    </DocsPage>
  );
}
```

### 4. Root Layout (`app/layout.tsx`)

**CRITICAL**: Use `RootProvider` from `fumadocs-ui/provider/next`, NOT from `/base`.

```tsx
import './global.css';
import type { ReactNode } from 'react';
import { RootProvider } from 'fumadocs-ui/provider/next';  // CORRECT import

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="brand-xyz" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
```

### 5. MDX Components (`mdx-components.tsx`)

**CRITICAL**: Use `Record<string, any>` type to avoid import issues.

```typescript
import defaultMdxComponents from 'fumadocs-ui/mdx';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useMDXComponents(components: Record<string, any>): Record<string, any> {
  return { ...defaultMdxComponents, ...components };
}
```

## Build Process

### Generated Files

Running `pnpm dev` generates the `.source` directory:

```
.source/
└── index.ts   # Auto-generated from source.config.ts
```

**IMPORTANT**: The `.source` directory must be generated before building. Run `pnpm dev` first if you see "Cannot resolve '@/.source'" errors.

### Building All Sites

```bash
# From ~/work/hanzo/docs
./scripts/build-all-docs.sh
```

Or individually:

```bash
# Hanzo (main monorepo)
cd ~/work/hanzo/docs && pnpm build

# Lux
cd ~/work/lux/docs && pnpm build

# Zoo
cd ~/work/zoo/docs && pnpm build
```

### Development

```bash
# All sites in parallel
./scripts/dev-all-docs.sh

# Or individually
cd ~/work/hanzo/docs && pnpm dev      # Port 3000
cd ~/work/lux/docs && pnpm dev        # Port 3001
cd ~/work/zoo/docs && pnpm dev        # Port 3002
```

## Brand Configuration

### CSS Classes

Each brand uses a CSS class on the `<html>` element:
- `brand-hanzo` - Orange/blue theme
- `brand-lux` - Blue/gold theme
- `brand-zoo` - Emerald/amber theme

### Icons

Each brand has its own icon component in the docs layout:
- `HanzoIcon` - AI/neural network style
- `LuxIcon` - Blockchain/crystal style
- `ZooIcon` - Organic/circular style

## Common Issues and Fixes

### Issue: "Cannot resolve '@/.source'"
**Cause**: The `.source` directory hasn't been generated.
**Fix**: Run `pnpm dev` first to generate source files.

### Issue: "Property 'body' does not exist on type 'PageData'"
**Cause**: Using old sync pattern instead of async.
**Fix**: Use `const { body: Mdx, toc } = await page.data.load()` pattern.

### Issue: "Property 'load' does not exist on type 'PageData'"
**Cause**: Missing `async: true` in source.config.ts or not using `toFumadocsSource()`.
**Fix**: Add `async: true` to docs config and use `docs.toFumadocsSource()` in source loader.

### Issue: "FrameworkProvider errors"
**Cause**: Using wrong provider import.
**Fix**: Use `RootProvider` from `fumadocs-ui/provider/next` only.

### Issue: "Cannot find module 'mdx/types'"
**Cause**: Type import path changed.
**Fix**: Use `Record<string, any>` type instead.

### Issue: "Cannot read properties of null (reading 'monthlyPriceInDollars')"
**Cause**: Sponsor tier can be null.
**Fix**: Add null checks: `sponsor.tier?.monthlyPriceInDollars ?? 0`

## Directory Structure for Standalone Sites

Each standalone site (Lux, Zoo) follows this structure:

```
docs/
├── app/
│   ├── layout.tsx          # Root layout with RootProvider
│   ├── global.css          # Global styles + brand CSS
│   ├── docs/
│   │   ├── layout.tsx      # Docs layout with brand nav
│   │   └── [[...slug]]/
│   │       └── page.tsx    # Dynamic page component
│   └── page.tsx            # Home page (optional redirect)
├── content/
│   └── docs/
│       ├── index.mdx       # Root doc page
│       └── meta.json       # Navigation structure
├── lib/
│   ├── source.ts           # Source loader config
│   └── layout.shared.tsx   # Shared layout options
├── source.config.ts        # MDX source configuration
├── next.config.ts          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies
├── postcss.config.mjs      # PostCSS for Tailwind
└── mdx-components.tsx      # MDX component mapping
```

## Dependencies

### Core Packages

```json
{
  "dependencies": {
    "fumadocs-core": "^16.4.0",
    "fumadocs-mdx": "^12.5.2",
    "fumadocs-ui": "^16.4.0",
    "next": "^15.3.2",
    "react": "^19.1.0",
    "react-dom": "^19.1.0"
  },
  "devDependencies": {
    "@types/react": "^19.1.4",
    "typescript": "^5.7.2",
    "tailwindcss": "^4.1.0",
    "@tailwindcss/postcss": "^4.1.7"
  }
}
```

## Integration Notes

### Fumadocs Version Compatibility

This system uses Fumadocs v16+ which requires:
- Next.js 15+ with App Router
- React 19+
- Tailwind CSS 4+
- Async MDX loading pattern

### TypeScript Path Aliases

Each site uses `@/` prefix for imports:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"],
      "@/.source": ["./.source/index.ts"]
    }
  }
}
```

## Related Documentation

- [Fumadocs Documentation](https://fumadocs.dev)
- [Hanzo AI Infrastructure](https://hanzo.ai)
- [Lux Network](https://lux.network)
- [Zoo Labs Foundation](https://zoo.ngo)

---

*Last updated: 2025-12-14*
