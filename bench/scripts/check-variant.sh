#!/bin/sh
# Check that a variant still works, e.g. after a dependency bump:
#   1. install it with `npm ci`;
#   2. regenerate its document and compare it with the one in bench/results: fails when the generation fails
#      or when any category gets more differences with the expected document;
#   3. run the contract test of the app in it (the variant must not change the behaviour of the app).
# Run by the check workflow on every pull request. Locally, it rewrites the results of the variant.
#   SUMMARY: markdown file the comparison is appended to (default: none)
set -eu
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
VARIANT="$1"
DIR="$ROOT/variants/$VARIANT"
RESULTS="$ROOT/bench/results/$VARIANT"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
cd "$ROOT"
if [ -e "$DIR/test" ]; then
  echo "::error::variants/$VARIANT/test already exists: the contract test of the app is copied there"
  exit 1
fi

node bench/src/cli.ts install --only "$VARIANT"

# The document `run` generates, and the one of bench/results it compares with: bench/results/<variant>/<spec>.<ext>,
# or the document of another format when the variant has just changed its output
output="$DIR/$(node -p 'require(process.argv[1]).output' "$DIR/bench.json")"
spec="$(node -p 'require(process.argv[1]).spec ?? "openapi"' "$DIR/bench.json")"
committed="$RESULTS/$spec.${output##*.}"
[ -f "$committed" ] || committed="$(find "$RESULTS" -maxdepth 1 -name "$spec.*" | head -n 1)"
if [ -z "$committed" ]; then
  echo "::error::$VARIANT has no document in bench/results/$VARIANT to compare with"
  exit 1
fi
baseline="$TMP/baseline.${committed##*.}"
cp "$committed" "$baseline"

node bench/src/cli.ts run --only "$VARIANT" --skip-perf
# `run` records a failed variant instead of exiting
# shellcheck disable=SC2016 # JavaScript template literals, not shell
node -e '
  const { variants } = require("./bench/results/results.json");
  const error = variants.find((v) => v.name === process.argv[1])?.error;
  if (error !== undefined) {
    console.error(`::error::${process.argv[1]}: ${error.split("\n").find((l) => l.trim() !== "")}\n${error}`);
    process.exit(1);
  }
' "$VARIANT"
node bench/src/cli.ts check "$output" --baseline "$baseline" ${SUMMARY:+--summary "$SUMMARY"}

trap 'rm -rf "$TMP" "$DIR/test"' EXIT
cp -r app/test "$DIR/test"
npm --prefix "$DIR" run test:e2e
