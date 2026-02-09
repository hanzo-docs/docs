#!/bin/bash
# Inspired by Svelte Kit

get_abs_filename() {
  # $1 : relative filename
  echo "$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"
}

DIR=$(get_abs_filename $(dirname "$0"))
TMP=$(get_abs_filename "$DIR/../node_modules/.tmp")

mkdir -p $TMP
cd $TMP

# Set git info
git config --global user.email "dev@hanzo.ai"
git config --global user.name "Hanzo AI"

# clone the template repo
rm -rf docs-template
git clone --depth 1 --single-branch --branch main https://github.com/hanzoai/docs-template.git

# empty out the repo
cd docs-template
node $DIR/update-git-repo.js $TMP/docs-template

# commit the new files (if necessary)
if [ -z "$(git status --porcelain)" ]; then
  echo "No changes to commit or push."
else
  git add -A
  git commit -m "version $npm_package_version"
  git push https://github.com/hanzoai/docs-template.git main -f
fi
