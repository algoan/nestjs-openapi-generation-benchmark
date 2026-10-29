# Development

## Layout

```
app/                    the baseline NestJS app, without any OpenAPI tooling
  test/                 contract test: the app really behaves as expected/openapi.yaml says
expected/openapi.yaml   the reference document, written by hand
variants/<tool>/        a copy of app/ with the changes one tool needs (+ bench.json)
bench/                  the harness: ease, correctness, perf, oasdiff, report
  VARIANT_GUIDE.md      rules followed by every variant (read it to add a tool)
  results/              REPORT.md, results.json, and per tool the generated document and its differences
```

## Quick start

Requirements: Node.js ≥ 22.18 (24 used here), optionally [`oasdiff`](https://github.com/oasdiff/oasdiff)
(`brew install oasdiff`) and `mongod` (for the contract test; downloaded by mongodb-memory-server otherwise).
The nestoa variant installs `@algoan/nestoa` from GitHub Packages: export `GITHUB_PACKAGES_TOKEN`
(a token with `read:packages`) before installing it. The `nestoa-main` variant runs nestoa built from
its main branch: `npm run setup` builds it with `bench/scripts/build-nestoa-main.sh` when a Rust
toolchain (`cargo`) is available; without it, that variant is reported as failed.

```sh
npm run setup              # install the harness, the app and every variant
npm run test:contract      # check expected/openapi.yaml against the running app
npm run bench              # all three grades, every tool → bench/results/REPORT.md
npm run bench:correctness  # ease + correctness only (no timing)
node bench/src/cli.ts run --only nestoa,tsoa --runs 10
node bench/src/cli.ts compare path/to/openapi.json   # compare any document with the expected one
node bench/src/cli.ts check new.yaml --baseline old.yaml  # fail when new.yaml has more differences than old.yaml
```

## Keeping nestoa up to date

nestoa is checked against this benchmark on every pull request: its CI builds the pull request and its
base branch, generates the document of `variants/nestoa-main` with both, and runs `check`, which fails when
any category gets more differences.

When a commit is merged on nestoa's main branch, or a version is released, nestoa dispatches the
[refresh workflow](../.github/workflows/refresh-nestoa.yml) here. It re-runs the ease and correctness of
`nestoa-main` (pinned to the latest main commit) or `nestoa` (bumped to the latest version) and opens a pull
request with the new results. Speed and memory are kept from the last local run, measured on one machine
for every tool; the notes, the README table and `docs/results.md` are updated by hand in that pull request.

## Adding a tool

Follow [`bench/VARIANT_GUIDE.md`](../bench/VARIANT_GUIDE.md), then `node bench/src/cli.ts run --only <name>`.
