#!/bin/bash
# Fetch THE document: hanzoai/openapi `hanzo.yaml`.
#
# One file, pinned to one commit. openapi-specs/hanzo.pin names the revision the
# reference is built from, so a docs build is reproducible and a spec change is
# a reviewable one-line bump rather than a 2 MB diff arriving by surprise.
#
# hanzoai/openapi is a PRIVATE repo, so the raw fetch needs a token
# (GITHUB_TOKEN / GH_TOKEN, or `gh auth token` locally). Three sources, tried in
# order, all yielding the same bytes:
#
#   1. the pinned raw URL, when a token is available
#   2. a sibling checkout at ../../../openapi, for offline work
#   3. the committed snapshot already in openapi-specs/
#
# Falling through to (3) is normal and safe: the snapshot IS the pinned
# revision, committed so a builder with no credentials still renders the full
# reference. What is never allowed is an empty result — the generator raises if
# the document is missing.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$SCRIPT_DIR/.."
SPECS_DIR="$APP_DIR/openapi-specs"
PIN_FILE="$SPECS_DIR/hanzo.pin"
DOCUMENT="$SPECS_DIR/hanzo.yaml"
# flows.yaml names the six canonical journeys as operationIds, in call order.
# Upstream owns it: the SDKs ship the same six as `examples/<flow>/`, and the
# docs' four-surface pages are one more projection of the same list.
FLOWS="$SPECS_DIR/flows.yaml"
# sdks.yaml is the SDK matrix — the package names the docs print must be the
# ones the generator actually publishes under.
SDKS="$SPECS_DIR/sdks.yaml"

mkdir -p "$SPECS_DIR"

# Fetch one file from the pinned revision. $1 = repo-relative path, $2 = dest.
fetch_pinned() {
  [ -n "${TOKEN:-}" ] || return 1
  curl -fsSL -H "Authorization: Bearer $TOKEN" \
    "https://raw.githubusercontent.com/hanzoai/openapi/$PIN/$1" -o "$2" 2>/dev/null
}

if [ ! -f "$PIN_FILE" ]; then
  echo "[openapi] no $PIN_FILE — nothing to pin to; keeping the committed snapshot"
  exit 0
fi
PIN="$(tr -d '[:space:]' < "$PIN_FILE")"

# THE PIN MUST NOT TRAIL, and nothing else asks.
#
# Every source below yields the pinned revision, so a stale pin is invisible
# here by construction: the fetch succeeds, the snapshot matches, the build is
# green, and docs.hanzo.ai describes a release that shipped weeks ago. The pin
# went 27 commits and one whole architecture behind that way — hanzoai/openapi
# replaced a hand-merged union with a derivation from cloud's own emission, and
# the reference kept rendering ~170 operations no binary answers for.
#
# hanzoai/openapi lives on git.hanzo.ai. The pinned fetch below still names
# raw.githubusercontent.com, which 404s for every caller since the repo left
# GitHub, so that path is dead and this check is deliberately NOT pointed at it.
#
# NO VERDICT when the remote cannot be reached — not a failure. The forge is
# private and a builder without a key is the normal case, and a gate that fails
# on someone else's outage (or on an ordinary contributor's laptop) is a gate
# somebody switches off. It only speaks when it actually knows.
UPSTREAM=ssh://git@git.hanzo.ai/hanzoai/openapi.git
# `|| true` is load-bearing: this file runs under `set -euo pipefail`, so an
# unreachable forge makes the pipeline non-zero and the ASSIGNMENT itself kills
# the script — exit 128, before the empty-answer branch below can say anything.
# Measured: the no-verdict path failed the build outright, which is the one
# outcome the design forbids.
head="$(GIT_TERMINAL_PROMPT=0 \
        GIT_SSH_COMMAND='ssh -o BatchMode=yes -o ConnectTimeout=10 -o StrictHostKeyChecking=accept-new' \
        git ls-remote "$UPSTREAM" main 2>/dev/null | cut -f1 || true)"
if [ -z "$head" ]; then
  echo "[openapi] $UPSTREAM did not answer — no verdict on whether ${PIN:0:9} is current"
elif [ "$head" != "$PIN" ]; then
  echo "[openapi] ERROR: hanzo.pin is ${PIN:0:9}; hanzoai/openapi main is ${head:0:9}." >&2
  echo "[openapi]        Every API page would describe an older release than the one deployed." >&2
  echo "[openapi]        Fix: printf '%s\\n' $head > $PIN_FILE" >&2
  echo "[openapi]        then refresh the snapshot beside it so the two cannot disagree." >&2
  exit 1
fi

TOKEN="${GITHUB_TOKEN:-${GH_TOKEN:-}}"
if [ -z "$TOKEN" ] && command -v gh >/dev/null 2>&1; then
  TOKEN="$(gh auth token 2>/dev/null || true)"
fi

tmp="$(mktemp)"
trap 'rm -f "$tmp"' EXIT

if fetch_pinned hanzo.yaml "$tmp"; then
  install -m 0644 "$tmp" "$DOCUMENT"
  got=hanzo.yaml
  for extra in flows.yaml sdks.yaml; do
    if fetch_pinned "$extra" "$tmp"; then
      install -m 0644 "$tmp" "$SPECS_DIR/$extra"
      got="$got + $extra"
    fi
  done
  echo "[openapi] fetched $got @ ${PIN:0:9} ($(wc -c < "$DOCUMENT") bytes)"
  exit 0
fi

SIBLING_DIR="$APP_DIR/../../../openapi"
if [ -f "$SIBLING_DIR/hanzo.yaml" ]; then
  install -m 0644 "$SIBLING_DIR/hanzo.yaml" "$DOCUMENT"
  [ -f "$SIBLING_DIR/flows.yaml" ] && install -m 0644 "$SIBLING_DIR/flows.yaml" "$FLOWS"
  [ -f "$SIBLING_DIR/sdks.yaml" ] && install -m 0644 "$SIBLING_DIR/sdks.yaml" "$SDKS"
  echo "[openapi] using the sibling checkout ($(wc -c < "$DOCUMENT") bytes) — pin is ${PIN:0:9}"
  exit 0
fi

if [ -f "$DOCUMENT" ]; then
  echo "[openapi] no token and no sibling checkout; building from the committed snapshot @ ${PIN:0:9}"
  exit 0
fi

echo "[openapi] ERROR: hanzo.yaml is unavailable from every source" >&2
exit 1
