#!/usr/bin/env bash
# Builds apps/docs/out, the static export that hanzo.yml's `site:` publishes as
# Sites project docs-hanzo-ai, and refuses an export that is not a site.
#
# hanzoai/ci runs it as the site build on its publish job: a fresh linux-amd64
# runner with Node and corepack's pnpm, this repo checked out with its
# submodules, and nothing installed. RELEASE.md has the whole path.
set -euo pipefail
cd "$(dirname "$0")/.."

# build:pre and build:post run under bun. This exact version comes from the npm
# registry, which also serves the platform binary its install links.
bun_version=1.3.11
if [ "$(bun --version 2>/dev/null || true)" != "$bun_version" ]; then
  bun_dir="${RUNNER_TEMP:-${TMPDIR:-/tmp}}/bun-$bun_version"
  npm install --silent --no-save --no-audit --no-fund --prefix "$bun_dir" "bun@$bun_version"
  export PATH="$bun_dir/node_modules/.bin:$PATH"
fi
echo "node $(node --version), pnpm $(pnpm --version), bun $(bun --version)"

pnpm install --frozen-lockfile

# The ingest key is the hanzo org's publishable key from @hanzo/event's keyring,
# which the page resolves from its own host (packages/analytics). This resolves
# it the same way for docs.hanzo.ai. A key that names a deleted project answers
# 403 while the site looks perfect, so the endpoint is asked before the build:
# a lost answer (000/429/5xx) warns, a refusal stops the build.
key="$(cd packages/analytics && node --input-type=module \
  -e "import { keyFor } from '@hanzo/event'; process.stdout.write(keyFor('docs.hanzo.ai') ?? '')")"
case "$key" in
  pk-*) ;;
  *) echo "::error::@hanzo/event resolves no pk- key for docs.hanzo.ai"; exit 1 ;;
esac
answer="$(mktemp)"
code="$(curl -s -o "$answer" -w '%{http_code}' --max-time 20 \
  -X POST "https://api.hanzo.ai/v1/event?ingest_key=$key" \
  -H 'content-type: application/json' -d '{"batch":[]}')" || code=000
case "$code" in
  200) ;;
  000|429|5*) echo "::warning::ingest endpoint answered $code; key unverified" ;;
  *) echo "::error::the ingest key is refused ($code): $(cat "$answer")"; exit 1 ;;
esac

# The workspace packages first, on their own, so a failure there is not read as
# a failure of the site. `docs^...` is turbo's word for "what docs depends on,
# not docs".
pnpm turbo run build --filter='docs^...'

# The export, run directly rather than through turbo: turbo holds a task's output
# until the task ends, so a build that dies midway would report nothing.
#
# The heartbeat prints memory and disk every 15 seconds, so a run that reaches
# the runner's memory limit says so in its last line instead of stopping: the
# cgroup's figure where the runtime exposes one, otherwise the sandbox's own
# /proc/meminfo, then the five largest processes by resident memory.
#
# The compile peaks near 10 GB and each render worker holds about 1.2 GB. The
# counts are read from the runner the job got: one Turbopack task per two cores
# up to sixteen, and one render worker per 2 GiB above the compile's 10, up to
# all but four cores, never fewer than two of either. Measured on the 32-core
# node the job takes (.hanzo/workflows/cicd.yml, class xl): 16 tasks compile in
# 66 s and 20 workers render the 6,294 pages in 52 s, against 9.2 and 10.6
# minutes on a 6-core runner.
cores=$(nproc)
mem=$(cat /sys/fs/cgroup/memory.max 2>/dev/null || echo max)
case "$mem" in ''|*[!0-9]*) mem=$(awk '/^MemTotal:/{print $2 * 1024}' /proc/meminfo) ;; esac
gib=$(( mem / 1073741824 ))
tasks=$(( cores / 2 < 16 ? cores / 2 : 16 )); [ "$tasks" -lt 2 ] && tasks=2
workers=$(( (gib - 10) / 2 )); [ "$workers" -gt $(( cores - 4 )) ] && workers=$(( cores - 4 )); [ "$workers" -lt 2 ] && workers=2
[ "$gib" -ge 32 ] || tasks=2
echo "build: ${cores} cores, ${gib} GiB — ${tasks} Turbopack tasks, ${workers} render workers"
( while :; do
    printf '[usage] %s mem=%s disk=%s%s\n' "$(date -u +%H:%M:%S)" \
      "$(cat /sys/fs/cgroup/memory.current 2>/dev/null || awk '/^MemTotal:/{t=$2} /^MemAvailable:/{a=$2} END{print (t-a)"k"}' /proc/meminfo)" \
      "$(df -Pk . | awk 'NR==2{print $4"k free"}')" \
      "$(awk '/^Name:/{n=$2} /^VmRSS:/{print $2, n}' /proc/[0-9]*/status 2>/dev/null | sort -rn | head -5 | awk '{printf " %s=%dM", $2, $1/1024}')"
    sleep 15
  done ) &
heartbeat=$!
trap 'kill "$heartbeat" 2>/dev/null || true' EXIT
NEXT_EXPORT=1 HANZO_DOCS_SYNC=0 NEXT_TELEMETRY_DISABLED=1 NEXT_BUILD_CPUS=$workers \
NODE_OPTIONS=--max-old-space-size=8192 TURBO_TASKS_AVAILABLE_PARALLELISM=$tasks \
  pnpm --filter docs build
kill "$heartbeat" 2>/dev/null || true

sh scripts/check-export.sh apps/docs/out
grep -rqF "$key" apps/docs/out \
  || { echo "::error::the ingest key is not in the export"; exit 1; }
