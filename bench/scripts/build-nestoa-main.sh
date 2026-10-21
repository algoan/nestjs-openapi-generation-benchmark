#!/bin/sh
# Build the unreleased nestoa from its main branch, for the `nestoa-main` variant.
#   NESTOA_REPO: git URL or local path of the nestoa repository (default: GitHub)
#   NESTOA_REF:  commit, tag or branch to build (default: main)
set -eu
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
REPO="${NESTOA_REPO:-https://github.com/algoan/nestoa.git}"
REF="${NESTOA_REF:-main}"
SRC="$ROOT/.tools/nestoa-src"

rm -rf "$SRC"
git clone --quiet "$REPO" "$SRC"
git -C "$SRC" checkout --quiet "$REF"
cargo build --release --quiet --manifest-path "$SRC/Cargo.toml" --target-dir "$ROOT/.tools/nestoa-target"
mkdir -p "$ROOT/.tools/bin"
cp "$ROOT/.tools/nestoa-target/release/nestoa" "$ROOT/.tools/bin/nestoa-main"
git -C "$SRC" rev-parse HEAD > "$ROOT/.tools/bin/nestoa-main.commit"
echo "nestoa $(git -C "$SRC" rev-parse --short HEAD) built: .tools/bin/nestoa-main"
