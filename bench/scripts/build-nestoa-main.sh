#!/bin/sh
# Build the unreleased nestoa from its main branch, for the `nestoa-main` variant.
#   NESTOA_REPO: git URL or local path of the nestoa repository (default: GitHub)
#   NESTOA_REF:  commit, tag or branch to build (default: the commit benchmarked in variants/nestoa-main/bench.json)
#   NESTOA_BIN:  name of the binary written to .tools/bin (default: nestoa-main)
set -eu
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
REPO="${NESTOA_REPO:-https://github.com/algoan/nestoa.git}"
REF="${NESTOA_REF:-2c57103}"
BIN="${NESTOA_BIN:-nestoa-main}"
SRC="$ROOT/.tools/$BIN-src"

rm -rf "$SRC"
git clone --quiet "$REPO" "$SRC"
# A commit of an unmerged pull request is not cloned: fetch it by its full hash
git -C "$SRC" cat-file -e "$REF^{commit}" 2>/dev/null || git -C "$SRC" fetch --quiet origin "$REF"
git -C "$SRC" checkout --quiet "$REF"
cargo build --release --quiet --manifest-path "$SRC/Cargo.toml" --target-dir "$ROOT/.tools/nestoa-target"
mkdir -p "$ROOT/.tools/bin"
cp "$ROOT/.tools/nestoa-target/release/nestoa" "$ROOT/.tools/bin/$BIN"
git -C "$SRC" rev-parse HEAD > "$ROOT/.tools/bin/$BIN.commit"
echo "nestoa $(git -C "$SRC" rev-parse --short HEAD) built: .tools/bin/$BIN"
