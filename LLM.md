# Hanzo Docs Framework

Fork of [Hanzo Docs](https://github.com/hanzoai/docs) with all packages renamed to `@hanzo/docs-*` namespace.

## How this ships

**Runbook: [`RELEASE.md`](./RELEASE.md).** One lane:

    push  ->  github.com/hanzo-docs/docs         origin; GitHub Actions is OFF here
      ->  git.hanzo.ai/hanzoai/docs              a pull mirror; sync + dispatch (RELEASE.md)
          .github/workflows/deploy.yml           the forge reads this directory natively
      ->  pnpm build --filter=docs               NEXT_EXPORT=1 -> apps/docs/out
      ->  hanzoai/ci .github/actions/site        Sites project `docs`
      ->  s3://hanzo-sites/hanzo/docs            what docs.hanzo.ai serves

The host is a route, not a workload: `Host(docs.hanzo.ai)` -> Middleware
`docs-static` -> that S3 prefix, declared in hanzoai/universe
`charts/app/values/hanzo/static-sites.yaml`. Nothing is pinned and nothing rolls;
the publish IS the deploy.

The other workflows in `.github/workflows/` run on the same forge: `lint.yml` and
`test.yml` on pull requests, `release.yml` on push (the npm packages),
`sync-zen-pricing.yml` daily, `deploy-cloud.yml` for `apps/cloud` (Sites project
`hanzo-cloud`), and eight `deploy-*-docs.yml` that still `wrangler pages deploy`
their app. Each wrangler one is the ONLY deploy of its host, so it stays until
that host has a Sites project: give the app `output: 'export'`, publish a slug,
move the DNS, delete the workflow.

**The image lane is cold.** `ghcr.io/hanzoai/docs`, the root `Dockerfile`,
`hanzo.yml`'s `images:` and the `docs` app in universe served this host before
the Sites plane did. The pod still runs and no router names it. Building or
pinning it publishes nothing.

**The export gate is in `scripts/check-export.sh`**, which the deploy runs on
`apps/docs/out` and the Dockerfile runs in its build stage. This site fails by
exporting nothing — a valid layer, a valid image, a 404 — and `apps/<app>/
export.require` names the sections that must not silently vanish (`docs/studio/`
is a submodule; a checkout that does not recurse drops it while page count and
nav stay green).


## Canonical model — the one way to do docs

Full ADR: `apps/docs/content/docs/contributing/docs-architecture.mdx` (rendered
at docs.hanzo.ai/docs/contributing/docs-architecture). Summary:

- **docs.hanzo.ai is the hub.** ONE Fumadocs build (`apps/docs`) → ONE Sites
  project `docs`. The federated per-section deploy is **retired** (stale
  origins 530'd). Do not reintroduce per-section builds.
- **IA is two levels of separator, and one word each.** The ROOT sidebar
  (`content/docs/meta.json`) is nine sections a developer walks in order — Get
  started · Concepts · Capabilities · Reference · Build with · Surfaces ·
  Programs · Integrate · Open source. Inside Capabilities
  (`content/docs/openapi/meta.json`, generated) is the second level: the nine
  DOMAINS — Identity & Trust · Intelligence · Data · Streams · Observability ·
  Commerce · Platform · Applications · Chain — from `apps/docs/openapi-specs/
  capabilities.yaml`, which is tracked HERE and is the one editorial decision
  left in this repo. Both levels are icon-bearing separators
  (`---[Icon]Name---`, resolved by `lucideIconsPlugin`), NOT folder moves —
  files stay flat so URLs/openapi back-links don't break.
  **Counts are never written twice.** How many capabilities there are is a fact
  about cloud's document, printed by the generator on `/docs/openapi`; authored
  prose links to it rather than restating a number that goes stale the next time
  cloud ships. `check-capabilities` is what holds the taxonomy, the document and
  the pages to one set.
  **No stutter.** A folder's own `index.mdx` is already its landing page — the
  tree builder resolves it before it reads `pages`. Naming `index` in `pages`
  demotes the page to a child of the folder carrying the folder's own name, so
  the sidebar reads `Agents > Agents`; 191 folders named it and 188 of them
  carried the same title, so that is how many rows said it twice. Same rule one
  level down: a folder wrapping exactly ONE page is a folder that should not
  exist, which is why a single-tool MCP product is published as a page and not a
  directory. **API reference and
  SDKs are separated surfaces** (`/docs/openapi`, `/docs/sdks`) reached via the
  top nav (`lib/nav.ts`), deliberately NOT in the root
  sidebar descent. The landing (`app/(landing)/page.tsx` — its own route group,
  because it carries the docs chrome from `components/shell.tsx` while
  `(home)` keeps the marketing chrome for /blog) + docs home
  (`content/docs/index.mdx`) lead with the decentralized spine ("the AI cloud
  you can run yourself"); `content/docs/network.mdx` = self-host/hanzo.network,
  `content/docs/architecture/philosophy.mdx` = the engineering pedagogy. Landing
  breadth stats trace to real sources: the domains from `capabilities.yaml` and
  the capability count from cloud's document, 157 models
  (`ai/conf/models.yaml`), 706 connectors (`cloud/clients/automations/catalog/
  catalog.json`), 6 SDK langs (`openapi/CLAUDE.md`). Count from data, never invent.
- **One canonical home per doc.** Content enters the single build via exactly one
  of three orthogonal mechanisms, chosen by *kind*:
  1. **Authored** (first-party prose) → MDX under `content/docs/<section>/`.
     Small/core sections live in-repo; team-owned sections live in a
     `hanzo-docs/<team>` content repo mounted as a **git submodule** at
     `content/docs/<team>/`. Exemplar: `hanzo-docs/studio-docs` → `content/docs/studio/`.
  2. **Generated** (never hand-written, `.gitignore`d) → API reference from
     `hanzoai/cloud`'s `openapi.yaml` at the release `openapi-specs/.spec-lock`
     pins, via `scripts/sync-openapi.sh` + `scripts/gen-openapi-pages.ts`
     (source-derived: an endpoint's sentence is written next to its handler and
     travels here unaltered); SDK reference from the ZAP SDK generator into
     `content/docs/sdks/<lang>/`. Every reader of the document goes through
     `scripts/openapi-doc.ts`, which owns the path — no script names the file.
     A generated MDX **fragment** is the third shape here, for a fact an authored
     page needs mid-sentence: `scripts/gen-key-types.ts` writes
     `generated/key-types.mdx` and `content/docs/api-keys.mdx` pulls it in with
     `<include>`. It sits outside `content/` because source.config globs
     `**/*.mdx` there and would give a fragment its own URL — and the path is
     relative to the INCLUDING file, so from `content/docs/` it is
     `../../generated/`. One directory short renders the page body empty with
     the frontmatter and chrome intact, which looks like a working page.
  3. **Ported** (upstream OSS, mirrored with attribution, **tracked**) →
     `content/docs/projects/<upstream>/`. Port, don't re-author. Carry upstream
     LICENSE + NOTICE. GPL stays GPL. This is a committed snapshot, not build
     output: `scripts/sync-project-docs.ts` refreshes it on demand
     (`pnpm --filter docs sync:projects`) and you read the diff before it ships,
     the same contract `openapi-specs/` has. It used to be BOTH — gitignored and
     re-mirrored by every build, so a build rewrote 965 committed files, put 298
     repos' docs on disk that production never had, and died on 54 imports
     (`@site/...`) no alias resolves. The builder alone skipped the sync, which
     meant the command a person runs and the command that ships the site
     compiled different sites.
- **Repos:** `hanzo-docs/docs` = framework + hub (canonical; `hanzoai/docs`
  redirects here). `hanzo-docs/<team>` = authored content only, NO framework.
  `hanzoai/cloud` `openapi.yaml` = the API source of truth; `hanzoai/openapi`'s
  `hanzo.yaml` was a projection of it on its own clock and this repo no longer
  reads it. All docs live in the `hanzo-docs`
  org: the hub at `hanzo-docs/docs`, each team's content at `hanzo-docs/<team>`.
- **Standalone vs hub:** default is a hub section. Standalone deploy only if ALL
  of: ≈150+ pages or fast OSS-upstream churn, independent versioning, direct
  audience. Standalone runs its own copy of this framework; the hub links out,
  never copies.
- **Serving:** the Sites plane — `s3://hanzo-sites/hanzo/docs`, served by the
  ingress staticFiles middleware on `Host(docs.hanzo.ai)`. The sibling hosts
  below are still CF Pages `hanzo-docs` (token from KMS, never hard-coded). No
  nginx/caddy, and no pod for a static export.

**Known dedup debt (rollout, not done):** the `apps/*-docs` legacy apps
(base-docs, bootnode-docs, bot-docs, cloud, dev-docs, dns-docs, flow, gui-docs,
insights-docs, platform, pulsar-docs, spec, tasks-docs, team, visor, zen-docs,
zt-docs) predate the unified `content/docs/` model — migrate their content into
`content/docs/<section>/` (or a `hanzo-docs/<team>` submodule) then archive the
app.

## Two build guards, and why prose needs them

`scripts/pre-build.ts` ends with two checks that fail the build. Both exist for
the same reason: a generated page cannot be wrong about the API, an authored one
can, and a reader cannot tell which kind of page they are on.

- **`check-endpoints.ts`** — no page may name a `/v1/…` route on `api.hanzo.ai`
  that the document does not serve.
- **`check-keys.ts`** — no page may spell an API key a way cloud does not mint,
  and `api-keys.mdx` must teach every class the document carries. Both
  directions, so renaming, adding or removing a key class in cloud stops the
  build here instead of publishing a stale page.

The key classes come from `Document.keys` (`openapi-doc.ts`), read out of the
`/v1/keys` prose — cloud's own Go doc comments, lifted by zipdoc. `secretKey(doc)`
is the one accessor generators use for "the key a server presents"; three of them
had it as a literal, which is how three GENERATED pages came to teach `hk-`.

**What was wrong:** docs.hanzo.ai documented three key types — `hk-` "API Key",
`sk-` "Secret Key", `hz-` "Widget Key". Cloud mints two (`cloud.APIKeyPrefixes`:
`pk-`, `sk-`) and refuses anything else, so a reader's first call failed asking
for a key nobody can issue. `hk-`/`hz-` were on 149 files. Note the shape of the
mistake: `sk-` was *present* and *described wrongly* (as an org-level provider
credential; it resolves to the USER), so a find-and-replace would have left the
page confidently wrong. Cloud's `apps/platform/secretshape.go` still lists `hk-`
in its secret-DETECTION table — harmless, it only scans, but it is where the
invention came from.

## Kai section and Jev parity

`content/docs/kai/` is Kai's section: concepts, questions, patterns, a cookbook,
SDKs, agents, limits and Kai-native programs. `guides/migrate/jev.mdx` moves a
Jev integration over and maps every Jev asset to its Kai page.

- **`parity/jev.yaml`** (repo root) lists every public Jev asset — each
  docs.typesafe.ai page, TypeSafe's SDK surface and skill, the community apps
  and examples — with the Kai page that answers it or `none:` and why.
  `apps/docs/scripts/parity.test.ts` fails when a listed page stops existing; it
  runs in `pnpm test` and before the build in `.hanzo/workflows/deploy.yml`.
- **Every output block on a Kai page is a program's stdout.** The line before
  the fence is `{/* out: <lang>/<file> [args] */}`: `python/` files live in
  hanzoai/python-sdk `pkg/hanzo-kai/examples/`, `ts/` in hanzo-js/kai
  `examples/`; `sh/` (a curl) and `typesafe/` (TypeSafe's own SDK with
  `TYPESAFE_BASE_URL=https://api.hanzo.ai`) are printed whole on their page.
  Re-run the program to change the block; never edit a block by hand.
- **`$` in prose is `\$`.** remark-math reads a `$…$` pair as math.

## Branch Convention

- **`main`** — Production branch. A push here builds the export and publishes it
  to the Sites plane, so landing on `main` IS publishing (`RELEASE.md`). All
  Hanzo work lands here.
- **`dev`** — Tracks upstream `Hanzo Docs/dev`. Used for upstream sync merges only.
- **`upstream`** remote — points to `hanzoai/docs`

## Architecture

pnpm workspace monorepo with turbo. Two apps, 24 packages, 24 examples.

```
~/work/hanzo/docs/
├── apps/
│   ├── docs/           # Main docs site (hanzoai.github.io/docs)
│   └── zap-docs/       # Zap protocol docs
├── packages/
│   ├── core/           # @hanzo/docs-core - source loading, search, i18n
│   ├── mdx/            # @hanzo/docs-mdx - MDX processing, collections
│   ├── base-ui/        # @hanzo/docs-base-ui - headless UI (@base-ui/react)
│   ├── radix-ui/       # @hanzo/docs-ui - full UI with Radix primitives
│   ├── openapi/        # @hanzo/docs-openapi - OpenAPI docs generation
│   ├── typescript/     # @hanzo/docs-typescript - auto type tables
│   ├── twoslash/       # @hanzo/docs-twoslash - TypeScript code hints
│   ├── cli/            # @hanzo/docs-cli - scaffolding & customization
│   ├── story/          # @hanzo/docs-story - component stories
│   ├── tailwind/       # @hanzo/docs-tailwind - Tailwind CSS utils
│   ├── press/          # @hanzo/docs-press - minimal setup
│   ├── hanzo-docs/     # @hanzo/docs - unified wrapper re-exporting all
│   ├── content-collections/ # @hanzo/docs-content-collections
│   ├── mdx-remote/     # @hanzo/docs-mdx-remote - remote MDX
│   ├── obsidian/       # @hanzo/docs-obsidian - Obsidian vault adapter
│   ├── python/         # @hanzo/docs-python - Python docgen
│   ├── doc-gen/        # @hanzo/docs-docgen - doc generation
│   ├── create-app/     # @hanzo/docs-create-app - project scaffolding
│   ├── create-app-versions/ # version tracking for create-app
│   ├── shared/         # shared utilities
│   ├── stf/            # @hanzo/docs-stf (upstream dependency)
│   ├── mdx-runtime/    # @hanzo/mdx-runtime
│   ├── eslint-config-custom/ # shared ESLint config
│   └── tsconfig/       # shared TypeScript config
└── examples/           # 24 example apps (Next.js, Astro, React Router, etc.)
```

## Package Naming Convention

One brand: every workspace package publishes under `@hanzo/docs-*`. The
rename rule (applied when merging from the upstream fork) drops the upstream
prefix and re-scopes to `@hanzo/docs-`:

- `<basename>` (unscoped upstream) → `@hanzo/docs-<basename>`
- `@<scope>/<basename>` (scoped upstream) → `@hanzo/docs-<basename>`

Canonical workspace packages and their paths:

| Hanzo name | Path |
|------------|------|
| `@hanzo/docs-core` | packages/core |
| `@hanzo/docs-mdx` | packages/mdx |
| `@hanzo/docs-ui` | packages/radix-ui |
| `@hanzo/docs-base-ui` | packages/base-ui |
| `@hanzo/docs-openapi` | packages/openapi |
| `@hanzo/docs-preview` | packages/preview |
| `@hanzo/docs-typescript` | packages/typescript |
| `@hanzo/docs-twoslash` | packages/twoslash |
| `@hanzo/docs-cli` | packages/cli |
| `@hanzo/docs-story` | packages/story |
| `@hanzo/docs-tailwind` | packages/tailwind |
| `@hanzo/docs-language` | packages/language |
| `@hanzo/docs-local-md` | packages/local-md |
| `@hanzo/docs-sanity` | packages/sanity |
| `@hanzo/docs-vite` | packages/vite |
| `@hanzo/docs-basehub` | packages/basehub |
| `@hanzo/docs-mdx-remote` | packages/mdx-remote |
| `@hanzo/docs-stf` | packages/stf |
| `@hanzo/create-docs` | packages/create-app |
| `@hanzo/docs-create-versions` | packages/create-app-versions |

**Important**: `packages/radix-ui` publishes as `@hanzo/docs-ui` (Radix
variant). The `base-ui` variant (`@hanzo/docs-base-ui`) uses `@base-ui/react`
instead of Radix.

**External deps kept verbatim** (real upstream npm packages, NOT renamed):
`fuma-cli`, `fuma-content`, `@fumari/json-schema-ts`, and the third-party
search adapters (typesense / trieve) documented under `apps/docs`.

## Upstream Sync

Remote `upstream` points to the upstream fork. Local `dev` tracks `upstream/dev`.

To merge upstream changes:

```bash
git checkout dev && git pull upstream dev
git checkout -b merge-upstream-YYYY-MM-DD main
git merge dev
# Resolve conflicts, then re-apply the package rename (table above)
# Merge into main when ready
```

After merge, re-apply the rename with the canonical script
(`scripts/rebrand-packages.mjs` — masks the external KEEP-list, then maps
each upstream name to its `@hanzo/docs-*` form).

## Key Patterns

### Source Config (`source.config.ts`)
```typescript
import { defineConfig, defineDocs } from '@hanzo/docs-mdx/config';
```

### Source Loader (`lib/source.ts`)
```typescript
import { docs } from '@/.source';
import { loader } from '@hanzo/docs-core/source';

export const source = loader({
  baseUrl: '/docs',
  source: docs.toHanzoDocsSource(), // API name kept from upstream
});
```

### The chrome is @hanzo/gui (apps/docs)

Every docs page sits in `components/shell.tsx`: the rail (`rail.tsx` — brand,
search, `tree.tsx`, account and theme at the foot), and a column holding the bar
(`bar.tsx`) and the page (`page.tsx` — breadcrumb, title, description, the
"Use agent" menu `agent.tsx`, body, previous/next; `toc.tsx` beside it). All of
it is gui stacks and text on theme tokens; no class names.

- **Widths are media props, never JS.** `$max-md`, `$xl` compile to CSS media
  rules, so the markup a phone hydrates is the markup the export wrote. Rail
  264px, bar 56px, article 880px with the outline 240px beside it from 1280px;
  below 768px the rail is a Sheet opened from the bar.
- **First paint is styled with no script.** gui emits each component's atomic
  rules as `<style precedence>` during SSR, React hoists them, and `<html>` ships
  `t_dark`. Check it: render any page with JavaScript off.
- **One theme authority: `t_dark`/`t_light` on `<html>`.** gui's
  `NextThemeProvider` (`@hanzogui/next-theme`) writes it before paint and
  `<Hanzo theme>` follows it (`app/provider.tsx`). The only CSS that reads it is
  `color-scheme` in `app/global.css`, which is what picks the code palette.
- **Muted text is `lib/ink.ts`.** gui's grey ramp is not symmetric (light step 10
  is #333), so muted names step 10 dark / 9 light. Chrome text measures >= 7.5:1
  in both themes.
- **gui v5 is shorthand-only.** `bg p px items justify rounded minW maxH t z`
  exist; `w`/`h` do NOT (use `width`/`height`) — an unknown prop is dropped
  silently and the box takes its content's size.
- **One title per page.** The header prints the frontmatter `title`;
  `lib/remark-title.ts` drops a body's leading `# heading`.
- **Page bodies are gui too.** MDX hands each markdown tag to
  `components/mdx.tsx`; blocks are spaced by `Body`'s gap, never their own
  margins, so a list inside a callout keeps its own rhythm. Running text sets
  `whiteSpace: normal` (gui text keeps whitespace, markdown hard-wraps). Tables
  keep the browser's table layout through `style.display`. Code tokens carry
  `color: light-dark(…)` (`lib/shiki.ts`), so `color-scheme` picks the palette
  and no stylesheet knows the theme. Steps are the `Steps`/`Step` parts
  (`lib/remark-parts.ts` renames remark-steps' marked divs).
- **The tree narrows by path, not address.** `lib/tree.tsx` resolves an
  operation page (not in the tree) to its product page, so the rail opens the
  reference it belongs to.

## Build

```bash
pnpm install          # Install deps
pnpm build            # Build all packages + apps
pnpm dev              # Dev server

# Individual packages
pnpm build --filter @hanzo/docs-core
pnpm build --filter @hanzo/docs-ui
```

Build tool: `tsdown` (all packages except `hanzo-docs` wrapper which uses `tsup`).

## Compatibility

- Next.js 15-16+ with App Router
- React 19+
- `apps/docs` renders no Tailwind; the framework packages still ship it ("Moving onto @hanzo/gui")
- pnpm 10+

## Moving onto @hanzo/gui — the plan

House rule: `@hanzo/gui` is the only UI framework (it renders on web, iOS and
Android; Tailwind classes and Radix/Base UI are DOM-only). docs.hanzo.ai is being
moved onto it in four phases, each shipped to main when verified live.

**Inventory of what docs.hanzo.ai renders** (Tailwind's own scanner, counting only
tokens Tailwind would emit CSS for, in class contexts; `content/docs/projects/**`
excluded — it is upstream's):

| Area | Tailwind tokens / files | Radix files | Base UI files |
|---|---|---|---|
| `apps/docs` app+components+lib, before phase 1 | 2,189 / 52 | 2 | 0 |
| `apps/docs` after phase 1 | 1,906 / 37 | 2 | 0 |
| `apps/docs` after phase 3 | 0 / 0 | 0 | 0 |
| `packages/base-ui` (@hanzo/docs-base-ui) | 2,774 / 76 | 0 | 10 |
| `packages/radix-ui` (@hanzo/docs-ui, via openapi/twoslash/typescript) | 2,568 / 71 | 9 | 0 |
| `packages/openapi` | 794 / 23 | 3 | 0 |
| `packages/story` / `twoslash` | 212 / 4, 3 / 1 | 1, 1 | 0 |
| authored MDX (`content/docs`, mostly code samples) | 63 / 56 | 0 | 0 |

Plus the CSS: `app/global.css` imports `tailwindcss`, the base-ui, openapi,
story and twoslash presets, and `tailwindcss-animate`.

**What replaces what.** Layout, rail, bar, outline and page header: our own gui
stacks (done). Drawer: `@hanzo/ui` Sheet. Menus: `@hanzo/ui` DropdownMenu.
Folds: plain state + gui stacks. Icons: `@hanzogui/lucide-icons-2`. Theme:
`@hanzogui/next-theme`. Tree/TOC logic stays in `@hanzo/docs-core` (headless).

| Phase | Scope | Replaces | Status |
|---|---|---|---|
| 1 | Chrome on every page: rail, tree, bar, outline, page header, search trigger, account, theme | base-ui `DocsLayout`/`DocsPage`/sidebar/toc, next-themes, the corner dock | shipped (f11eb49dc2) |
| 2 | Page bodies: markdown's elements (`components/mdx/prose.tsx`), the parts content names — Callout, Cards, Tabs, Steps, Accordion, Files, code blocks and code tabs (`blocks.tsx`, `tabs.tsx`, `code.tsx`) — and `Example`; content imports none of them; ported and studio pages reach them through the `parts` aliases in next.config | Tailwind typography, base-ui MDX components, shiki.css, the HoverCard link preview (a `title` now) | shipped |
| 3 | App pages and app parts: landing (on the theme now, no forced dark), hero, product sections, provider strip, catalogs, search (`search.tsx` + `finder.tsx`, ⌘K), feedback (a real `docs.feedback` event, not a console stub), 404, blog (in the shell, on the page frame), sign-in screens | base-ui search dialog, `RootProvider`, HomeLayout, the registry build and the dead preview / AI-search / API-page modules | shipped |
| 4 | The build: `app/global.css` is plain CSS (faces, ground, `color-scheme`, the shell footer); no `@import 'tailwindcss'`, no presets, no `postcss.config.mjs`; `apps/docs` no longer depends on `tailwindcss`, `@tailwindcss/postcss`, `tailwindcss-animate`, `tailwind-merge`, `class-variance-authority`, any `@radix-ui/*`, `@hanzo/docs-base-ui`, `@hanzo/docs-ui`, `lucide-react`, or the build plugins that emitted their parts (twoslash, auto type table, ts2js) | — | shipped |

**No framework package was deleted, because none is dead.** `packages/base-ui`,
`radix-ui`, `tailwind`, `story`, `twoslash`, `typescript`, `openapi` and the
`packages/gui` stub each still have consumers in `apps/*`, `examples/*` or the
`@hanzo/docs` wrapper. They leave when those apps move onto the gui parts in
`apps/docs/components/` — lift those into a package first, so every docs app
renders one set.

**Known gap in @hanzo/ui (8.27.18):** its `.d.ts` augments `@hanzogui/web`
without depending on it, so in this workspace the augmentation lands on the
hoisted 8.1.1 copy while `@hanzo/gui` 8.3.5 uses 8.3.5 — every gui shorthand
fails typecheck here (runtime is correct; `ignoreBuildErrors` is on). The fix is
@hanzo/ui declaring `@hanzogui/web`/`core` as dependencies of the same train.

**Out of scope when counting:** `content/docs/projects/**` is a snapshot of
upstream repos. The Java/Spring IAM guide uses Bootstrap in a Thymeleaf template
and the IAM login-customization guide uses its own `<style>` blocks — not Tailwind.

**`@zenlm/ui` ships classes that style nothing** (`packages/zenlm-ui`: Tailwind
utilities, no CSS, no Tailwind dep); `apps/zen-docs` pins the published tarball.
Converting it to gui style props fixes it by construction.

### Baseline when touching this repo

`pnpm types:check` is **not green and never was**: 50 of 72 tasks fail at rest.
`npx vitest run` is 13 failed / 203 passed. Judge a change by the *delta* against
those sets, not by a clean run you will never get. And `docs#types:check` failing
tells you nothing about whether a page renders — MDX compile errors do not surface
in tsc. `zen5.mdx` typechecked clean while the loader skipped the entire page
(`<50ms` in a table parses as a JSX tag; fence such values in backticks). Run the
app and look at it.

`remark-math` is on, so two `$` in one paragraph or list item typeset the text
between them as math: `migrate/stripe.mdx`'s "floor $1 and ceiling $5,000"
renders as KaTeX on the live site. Write each amount as `\$0.021` where a
paragraph holds two; a table cell, a code span and frontmatter are each their
own context and need no escape.

## Landing Apps (Moved Out)

Landing page apps were moved to their ecosystem repos:
- Hanzo apps → `~/work/hanzo/apps/`
- Lux apps → `~/work/lux/apps/`
- Zoo apps → `~/work/zoo/apps/`

`apps/zap-docs` and `apps/liquid` are gone; their deploy workflows were deleted
because they built directories that do not exist. See `apps/` for what is here.
