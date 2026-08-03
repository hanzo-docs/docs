#!/bin/bash
# Fetch THE document: hanzoai/cloud `openapi.yaml`, at the ref `.spec-lock` names.
#
# NOT hanzoai/openapi's `hanzo.yaml`. cloud emits its document by projecting its
# own routers, and gates the emission by regenerating from source and failing on
# any diff, so it cannot describe a route the binary does not serve. The master
# is hand-merged from authored per-service specs and it is a SECOND AUTHORITY ON
# WHAT EXISTS — measured against cloud@v1.801.383 it carried 185 operations
# cloud does not serve, and 164 of those could not be told apart from an
# invented path by any probe (a door under /v1/bot, /v1/dns, /v1/vector or
# /v1/search answers the real path and a nonsense sibling with the same code).
# Every one of them rendered a reference page teaching an endpoint.
#
# ONE PIN, at the repo root, in the fleet's one spelling: `.spec-lock` names the
# repo, the path, the ref and the sha256 — the same four lines hanzoai/ci writes
# into every client repo, so "which document is this a projection of" has one
# answer and one format everywhere. A spec change is a reviewable four-line bump
# rather than a 3 MB diff arriving by surprise.
#
# hanzoai/cloud is PRIVATE, so raw.githubusercontent.com answers 404 rather than
# 403 and an anonymous miss cannot be told from a deleted file. Three sources,
# tried in order, all yielding the same bytes:
#
#   1. the contents API at the pinned ref, with a token
#   2. a sibling hanzoai/cloud checkout, for offline work
#   3. the committed snapshot already in openapi-specs/
#
# Falling through to (3) is normal and safe: the snapshot IS the pinned ref, and
# its digest is checked against the lock, so a builder with no credentials still
# renders the full reference and still cannot render a DIFFERENT one. What is
# never allowed is an empty result — the generator raises if the document is
# missing.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$SCRIPT_DIR/.."
REPO_ROOT="$(cd "$APP_DIR/../.." && pwd)"
SPECS_DIR="$APP_DIR/openapi-specs"
LOCK="$REPO_ROOT/.spec-lock"
DOCUMENT="$SPECS_DIR/cloud.yaml"
# flows.yaml names the six canonical journeys as operationIds, in call order.
# sdks.yaml is the SDK matrix — the package names the docs print must be the
# ones the generator actually publishes under. NEITHER IS THE API DOCUMENT, so
# both still come from hanzoai/openapi, and neither can smuggle an endpoint in:
# an operationId in flows.yaml the pinned document does not carry fails
# gen-flow-pages, which is the gate that makes reading them from main safe.
mkdir -p "$SPECS_DIR"

if [ ! -f "$LOCK" ]; then
  echo "[openapi] no $LOCK — nothing to pin to; keeping the committed snapshot"
  exit 0
fi
lock() { sed -n "s/^$1=//p" "$LOCK"; }
REPO="$(lock repo)";      REPO="${REPO:-hanzoai/cloud}"
IN_REPO="$(lock path)";   IN_REPO="${IN_REPO:-openapi.yaml}"
REF="$(lock ref)"
WANT="$(lock sha256)"
: "${REF:?[openapi] $LOCK has no ref=}"

TOKEN="${GITHUB_TOKEN:-${GH_TOKEN:-${SPEC_TOKEN:-}}}"
if [ -z "$TOKEN" ] && command -v gh >/dev/null 2>&1; then
  TOKEN="$(gh auth token 2>/dev/null || true)"
fi

tmp="$(mktemp)"
trap 'rm -f "$tmp"' EXIT

# A pinned ref whose bytes moved means someone moved a tag, and no amount of
# rendering makes that safe. The same refusal hanzoai/ci and every SDK call site
# make, so a docs build and a client build cannot disagree about what they read.
verify() {
  [ -n "$WANT" ] || return 0
  got="$(sha256sum "$1" | cut -d' ' -f1)"
  [ "$got" = "$WANT" ] && return 0
  echo "[openapi] ERROR: $2 hashes to $got, but .spec-lock says $WANT" >&2
  return 1
}

if [ -n "${TOKEN:-}" ] && curl -fsSL -H "Authorization: Bearer $TOKEN" \
     -H 'Accept: application/vnd.github.raw' \
     "https://api.github.com/repos/$REPO/contents/$IN_REPO?ref=$REF" -o "$tmp" 2>/dev/null; then
  verify "$tmp" "$REPO@$REF:$IN_REPO"
  install -m 0644 "$tmp" "$DOCUMENT"
  echo "[openapi] fetched $REPO@$REF:$IN_REPO ($(wc -c < "$DOCUMENT") bytes)"
else
  SIBLING="$APP_DIR/../../../cloud/$IN_REPO"
  if [ -f "$SIBLING" ] && verify "$SIBLING" "$SIBLING"; then
    install -m 0644 "$SIBLING" "$DOCUMENT"
    echo "[openapi] using the sibling hanzoai/cloud checkout ($(wc -c < "$DOCUMENT") bytes) — ref is $REF"
  elif [ -f "$DOCUMENT" ]; then
    verify "$DOCUMENT" "$DOCUMENT"
    echo "[openapi] no token and no sibling checkout; building from the committed snapshot @ $REF"
  else
    echo "[openapi] ERROR: $REPO@$REF:$IN_REPO is unavailable from every source" >&2
    exit 1
  fi
fi

# Best-effort by design: flows.yaml and sdks.yaml are upstream DATA about
# journeys and packages, not claims about the API, and the committed copies are
# current. A miss here is silence, not a failure.
for extra in flows.yaml sdks.yaml; do
  [ -n "${TOKEN:-}" ] || continue
  if curl -fsSL -H "Authorization: Bearer $TOKEN" \
       -H 'Accept: application/vnd.github.raw' \
       "https://api.github.com/repos/hanzoai/openapi/contents/$extra?ref=main" -o "$tmp" 2>/dev/null; then
    install -m 0644 "$tmp" "$SPECS_DIR/$extra"
    echo "[openapi] fetched hanzoai/openapi@main:$extra"
  fi
done
