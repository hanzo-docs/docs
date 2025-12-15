#!/usr/bin/env bash
# Start development servers for all documentation sites
# Usage: ./scripts/dev-all-docs.sh [hanzo|lux|zoo]
# Note: Use tmux or separate terminals for multiple sites

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HANZO_DOCS="$SCRIPT_DIR/.."
LUX_DOCS="$HOME/work/lux/docs"
ZOO_DOCS="$HOME/work/zoo/docs"

# Default ports
HANZO_PORT=3000
LUX_PORT=3001
ZOO_PORT=3002

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

dev_site() {
    local site_name=$1
    local site_dir=$2
    local port=$3

    log_info "Starting $site_name docs on port $port..."

    if [ ! -d "$site_dir" ]; then
        log_error "$site_name docs directory not found: $site_dir"
        return 1
    fi

    cd "$site_dir"

    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        log_info "Installing dependencies for $site_name..."
        pnpm install
    fi

    # Start dev server
    PORT=$port pnpm dev
}

case "${1:-hanzo}" in
    hanzo)
        cd "$HANZO_DOCS"
        log_info "Starting Hanzo docs on port $HANZO_PORT..."
        pnpm install 2>/dev/null || true
        pnpm dev
        ;;
    lux)
        dev_site "Lux" "$LUX_DOCS" "$LUX_PORT"
        ;;
    zoo)
        dev_site "Zoo" "$ZOO_DOCS" "$ZOO_PORT"
        ;;
    *)
        echo "Usage: $0 [hanzo|lux|zoo]"
        echo ""
        echo "Ports:"
        echo "  hanzo: $HANZO_PORT"
        echo "  lux:   $LUX_PORT"
        echo "  zoo:   $ZOO_PORT"
        exit 1
        ;;
esac
