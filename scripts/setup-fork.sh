#!/bin/bash
# Setup script for creating branded docs forks
# Usage: ./scripts/setup-fork.sh <brand> <target_path>
# Example: ./scripts/setup-fork.sh lux ~/work/lux/docs

set -e

BRAND="${1:-lux}"
TARGET_PATH="${2:-}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_DIR="$(dirname "$SCRIPT_DIR")"

if [ -z "$TARGET_PATH" ]; then
  echo "Usage: $0 <brand> <target_path>"
  echo "  brand: hanzo, lux, or zoo"
  echo "  target_path: path to create the docs fork"
  exit 1
fi

echo "🚀 Setting up $BRAND docs at $TARGET_PATH"

# Create target directory if it doesn't exist
mkdir -p "$TARGET_PATH"

# Copy essential files
echo "📦 Copying project files..."

# Copy package files
cp "$SOURCE_DIR/package.json" "$TARGET_PATH/"
cp "$SOURCE_DIR/pnpm-workspace.yaml" "$TARGET_PATH/"
cp "$SOURCE_DIR/pnpm-lock.yaml" "$TARGET_PATH/" 2>/dev/null || true
cp "$SOURCE_DIR/turbo.json" "$TARGET_PATH/"
cp "$SOURCE_DIR/tsconfig.json" "$TARGET_PATH/"
cp "$SOURCE_DIR/vitest.config.ts" "$TARGET_PATH/"
cp "$SOURCE_DIR/prettier.config.mjs" "$TARGET_PATH/"
cp "$SOURCE_DIR/.prettierignore" "$TARGET_PATH/"
cp "$SOURCE_DIR/.gitignore" "$TARGET_PATH/"

# Copy packages directory
echo "📦 Copying packages..."
cp -r "$SOURCE_DIR/packages" "$TARGET_PATH/"

# Copy apps directory
echo "📱 Copying apps..."
cp -r "$SOURCE_DIR/apps" "$TARGET_PATH/"

# Copy .changeset
cp -r "$SOURCE_DIR/.changeset" "$TARGET_PATH/"

# Create brand-specific .env.local
echo "⚙️ Creating environment configuration..."
cat > "$TARGET_PATH/.env.local" << EOF
# Brand configuration for $BRAND docs
NEXT_PUBLIC_BRAND=$BRAND
EOF

# Copy to apps/docs as well
cat > "$TARGET_PATH/apps/docs/.env.local" << EOF
# Brand configuration for $BRAND docs
NEXT_PUBLIC_BRAND=$BRAND
EOF

# Update package.json name
echo "📝 Updating package.json..."
if command -v jq &> /dev/null; then
  # Use jq if available
  jq --arg brand "$BRAND" '.name = $brand + "-docs"' "$TARGET_PATH/package.json" > "$TARGET_PATH/package.json.tmp"
  mv "$TARGET_PATH/package.json.tmp" "$TARGET_PATH/package.json"
else
  # Fallback to sed
  sed -i '' "s/\"name\": \"root\"/\"name\": \"$BRAND-docs\"/" "$TARGET_PATH/package.json" 2>/dev/null || \
  sed -i "s/\"name\": \"root\"/\"name\": \"$BRAND-docs\"/" "$TARGET_PATH/package.json"
fi

echo "✅ $BRAND docs setup complete at $TARGET_PATH"
echo ""
echo "Next steps:"
echo "  1. cd $TARGET_PATH"
echo "  2. pnpm install"
echo "  3. pnpm dev"
echo ""
echo "The docs will use the $BRAND brand configuration automatically."
