# Publishing docs.hanzo.ai

One lane. A push to `main` builds the static export and publishes it to the
Sites plane, and the bytes it uploads are what the site serves a second later.
There is no image to tag and no pin to move.

    push main
      -> git.hanzo.ai/hanzoai/docs          a pull mirror of github.com/hanzo-docs/docs
      -> .hanzo/workflows/deploy.yml        the forge reads this directory natively
      -> pnpm build --filter=docs           NEXT_EXPORT=1 -> apps/docs/out
      -> hanzoai/ci .github/actions/site    POST /v1/projects/docs/deployments
      -> s3://hanzo-sites/hanzo/docs        the prefix the docs.hanzo.ai route serves

The route is an `IngressRoute` + `Middleware` pair in hanzoai/universe
(`charts/app/values/hanzo/static-sites.yaml`): `Host(docs.hanzo.ai)` ->
`docs-static` -> `root: s3://hanzo-sites/hanzo/docs`. No pod, no replicas, no
image. A site is files and a route.

Every workflow lives in `.hanzo/workflows/` and runs on git.hanzo.ai, which reads
that directory first. GitHub reads only `.github/workflows/`, so none of them can
queue there (Actions is also disabled on hanzo-docs/docs).

## Fire it

A push to `main` touching `apps/docs/**`, `packages/**`, `pnpm-lock.yaml`,
`scripts/check-export.sh` or the workflow itself. The forge pulls this repo every
10 minutes; `POST /v1/repos/hanzoai/docs/mirror-sync` pulls it now. To rebuild an
unchanged tree, dispatch it:

```sh
curl -X POST -H "Authorization: token $FORGE_TOKEN" \
  https://git.hanzo.ai/v1/repos/hanzoai/docs/actions/workflows/deploy.yml/dispatches \
  -d '{"ref":"refs/heads/main"}'
```

One publish runs at a time (`concurrency: deploy-docs`, no cancel): a newer push
waits for the running one, and the newest waiting commit is the one that
publishes. Two at once would each delete the other's files on completion, because
completing a deployment reconciles the prefix against the manifest it sends.

## What the job proves before it publishes

- **The ingest key resolves.** `deploy/PUBLISHABLE_KEY` (env `prod`) comes from
  KMS — the org's Actions secrets carry only `KMS_CLIENT_ID`/`KMS_CLIENT_SECRET`
  — and is POSTed to `/v1/event` before the build. A key that is present but
  names a deleted project answers 403, and a site built on it loses every
  pageview while looking perfect.
- **The export is a site.** `scripts/check-export.sh` refuses an export without
  `index.html`, `docs/index.html`, 50+ pages, a rendered nav, and every path in
  `apps/docs/export.require` — the sections that vanish without breaking anything
  else (`docs/studio/` is a submodule, `docs/openapi/` and `docs/mcp-tools/` are
  generated).
- **The key is in the bytes.** A build-time env that never reached the bundle is
  invisible everywhere except the warehouse, so the export is grepped for it.
- **Every link resolves.** `build:post` walks the export, follows every anchor
  through the serving ladder (`/docs` -> `docs.html` -> `docs/index.html`) and
  prints what points nowhere. It reports and does not refuse: the site is already
  built, and one rotted link is not a reason to stop shipping 2,900 pages.

## Verify

```sh
curl -sI https://docs.hanzo.ai/ | grep -i last-modified   # the publish time
curl -s -o /dev/null -w '%{http_code}\n' https://docs.hanzo.ai/docs/quickstart
curl -s -o /dev/null -w '%{http_code}\n' https://docs.hanzo.ai/no-such-page  # 404
```

The publish itself reads back what it wrote (`bin/site` fetches the live URL and
compares the bytes), so a deployment that completes has already proved the
object store serves it.

## The image lane is cold

`ghcr.io/hanzoai/docs`, the root `Dockerfile`, `hanzo.yml`'s `images:` block and
the `docs` app in hanzoai/universe are the previous way: an image wrapping the
same export, served by hanzoai/static in a pod. The pod still runs and **nothing
routes to it** — the `docs.hanzo.ai` router names the Sites middleware. Do not
build or pin it to publish; retiring it is a universe change.

## Sibling sites in this repo

`apps/cloud` publishes Sites project `hanzo-cloud` through the same action
(`.hanzo/workflows/deploy-cloud.yml`). The remaining `deploy-*-docs.yml`
workflows still `wrangler pages deploy` their app; each is the only deploy of its
host, so they stay until that host has a Sites project of its own. The path for
each is the one above: give the app `output: 'export'`, publish a slug, then move
its DNS.
