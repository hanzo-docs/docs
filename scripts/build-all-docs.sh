#!/usr/bin/env bash
# Build all documentation sites (Hanzo, Lux, Zoo)
# Usage: ./scripts/build-all-docs.sh [hanzo|lux|zoo|all]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HANZO_DOCS="$SCRIPT_DIR/.."
LUX_DOCS="$HOME/work/lux/docs"
ZOO_DOCS="$HOME/work/zoo/docs"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

build_site() {
    local site_name=$1
    local site_dir=$2

    log_info "Building $site_name docs..."

    if [ ! -d "$site_dir" ]; then
        log_error "$site_name docs directory not found: $site_dir"
        return 1
    fi

    cd "$site_dir"

    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        log_info "Installing dependencies for $site_name..."
        pnpm install
    fi

    # Build the site
    log_info "Running build for $site_name..."
    pnpm build

    log_info "$site_name docs built successfully!"
    return 0
}

build_hanzo() {
    cd "$HANZO_DOCS"
    # Hanzo docs uses turbo for workspace builds
    log_info "Building Hanzo docs (workspace)..."
    pnpm install
    pnpm build
    log_info "Hanzo docs built successfully!"
}

build_lux() {
    build_site "Lux" "$LUX_DOCS"
}

build_zoo() {
    build_site "Zoo" "$ZOO_DOCS"
}

case "${1:-all}" in
    hanzo)
        build_hanzo
        ;;
    lux)
        build_lux
        ;;
    zoo)
        build_zoo
        ;;
    all)
        log_info "Building all documentation sites..."
        echo ""

        log_info "=== Building Hanzo Docs ==="
        build_hanzo
        echo ""

        log_info "=== Building Lux Docs ==="
        build_lux
        echo ""

        log_info "=== Building Zoo Docs ==="
        build_zoo
        echo ""

        log_info "All documentation sites built successfully!"
        ;;
    *)
        echo "Usage: $0 [hanzo|lux|zoo|all]"
        exit 1
        ;;
esac
