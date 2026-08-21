# @fumadocs/content

## 0.1.0

### Minor Changes

- a85e19f: Two brand-neutral / zero-config fixes:
  - **Default `outDir` is now `.docs`** (was `docs`), matching the `collections/*` → `./.docs/*` tsconfig alias used by every template and example. A fresh fork now resolves `import { docs } from 'collections/server'` out of the box with no `createMDX({ outDir })` override.
  - **BREAKING: the doc-collection method `toFumadocsSource()` is renamed `toDocsSource()`** to keep the public API brand-neutral. Update `lib/source.ts`: `source: docs.toDocsSource()`.

## 0.0.3

### Patch Changes

- 2d8f596: fix `npm pack` skipping nested `node_modules`
- Updated dependencies [2d8f596]
  - fumadocs-core@16.7.14

## 0.0.2

### Patch Changes

- 690ddb9: bundle more deps
- Updated dependencies [690ddb9]
  - fumadocs-core@16.7.13

## 0.0.1

### Patch Changes

- f065406: Support fuma-content integration
- Updated dependencies [c2678c0]
- Updated dependencies [417f07a]
- Updated dependencies [bb07706]
- Updated dependencies [f065406]
  - fumadocs-core@16.6.17
