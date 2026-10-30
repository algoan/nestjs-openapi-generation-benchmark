# Development

## Layout

```
app/                    the baseline NestJS app, without any OpenAPI tooling
  test/                 contract tests: the app really behaves as expected/openapi.yaml and expected/asyncapi.yaml say
expected/openapi.yaml   the reference OpenAPI document, written by hand
expected/asyncapi.yaml  the reference AsyncAPI document of the Pub/Sub events, written by hand
variants/<tool>/        a copy of app/ with the changes one tool needs (+ bench.json, `"spec": "asyncapi"` for AsyncAPI tools)
bench/                  the harness: ease, correctness, perf, oasdiff, report
  VARIANT_GUIDE.md      rules followed by every variant (read it to add a tool)
  results/              REPORT.md, results.json, and per tool the generated document and its differences
```

## Quick start

Requirements: Node.js ≥ 22.18 (24 used here), optionally [`oasdiff`](https://github.com/oasdiff/oasdiff)
(`brew install oasdiff`) and `mongod` (for the contract test; downloaded by mongodb-memory-server otherwise).
The nestoa variant installs `@algoan/nestoa` from GitHub Packages: export `GITHUB_PACKAGES_TOKEN`
(a token with `read:packages`) before installing it. The refresh workflow (below) moves it to the
`nestoa` package of npmjs.com, which needs no token, on the first release published there.
The `nestoa-main` variant runs nestoa built from its main branch: `npm run setup` builds it with
`bench/scripts/build-nestoa-main.sh` when a Rust toolchain (`cargo`) is available; without it, that
variant is reported as failed. The `nestoa-asyncapi` variant runs nestoa built the same way from its
unmerged AsyncAPI pull request ([algoan/nestoa#76](https://github.com/algoan/nestoa/pull/76)),
`npm run setup:nestoa-asyncapi`.

```sh
npm run setup              # install the harness, the app and every variant
npm run test:contract      # check expected/openapi.yaml and expected/asyncapi.yaml against the running app
npm run bench              # all three grades, every tool → bench/results/REPORT.md
npm run bench:correctness  # ease + correctness only (no timing)
node bench/src/cli.ts run --only nestoa,tsoa --runs 10
node bench/src/cli.ts compare path/to/openapi.json   # compare any OpenAPI or AsyncAPI document with the expected one
node bench/src/cli.ts check new.yaml --baseline old.yaml  # fail when new.yaml has more differences than old.yaml
```

## Keeping nestoa up to date

nestoa is checked against this benchmark on every pull request: its CI builds the pull request and its
base branch, generates the document of `variants/nestoa-main` with both, and runs `check`, which fails when
any category gets more differences.

Every hour, the [refresh workflow](../.github/workflows/refresh-nestoa.yml) polls nestoa: when the latest
commit of its main branch, or the latest version of `nestoa` on npmjs.com, is not the one benchmarked, it
re-runs the ease and correctness of `nestoa-main` (pinned to that commit) or `nestoa` (bumped to that
version) and opens a pull request with the new results. A variant whose refresh pull request is already open
for the same commit or version is skipped. Run it from the Actions tab to refresh one variant at a given
commit or version. It needs no secret, on either side: nestoa's repository and packages are public.
Speed and memory are kept from the last local run, measured on one machine for every tool; the notes, the
README table and `docs/results.md` are updated by hand in that pull request.

## Adding a tool

Follow [`bench/VARIANT_GUIDE.md`](../bench/VARIANT_GUIDE.md), then `node bench/src/cli.ts run --only <name>`.
