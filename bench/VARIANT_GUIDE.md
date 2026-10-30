# Adding a tool to the benchmark

Each tool gets a **variant**: a copy of the baseline app (`app/`) with the changes the tool needs, in
`variants/<name>/`. The benchmark measures that copy against `app/` (ease of use), its generated document
against `expected/openapi.yaml` (correctness), and the commands producing it (speed and memory).

A tool generating AsyncAPI gets a variant the same way, with `"spec": "asyncapi"` in its `bench.json`: its
document describes the app's Pub/Sub events and is compared with `expected/asyncapi.yaml`.

## 1. Create the variant

```sh
rsync -a --exclude node_modules --exclude dist --exclude test app/ variants/<name>/
cd variants/<name> && npm install && npm install --save-exact <tool packages>
```

Pin exact versions (`--save-exact`). Use the latest release of the tool that works with this stack
(NestJS 11, TypeScript 5.9, Node 24). Say in `notes` if you had to use an older one, and why.

## 2. Make the tool describe the real API

Annotate the copy the way a team adopting the tool would, following the tool's own documentation, so
that the document describes what the server really does (see the header of `expected/openapi.yaml`).

Every changed line counts against the tool in the ease-of-use grade, so the trade-off is real: favour the
tool's standard mechanisms (CLI/compiler plugins, JSDoc support, config files) over line-by-line
annotations, and stop at what is reasonable for a real project. Priority order:

1. **core**: operations and paths (including the `v1` global prefix), parameters, request bodies,
   success responses (status code and schema, including the pagination envelope);
2. security (bearer auth, public routes) and error responses (`{ code, message, status }`);
3. validation constraints and descriptions, when the tool supports them out of the box.

For AsyncAPI, the API is the app's Pub/Sub events: the `@EventPattern` handlers of `src/events` are
`receive` operations on the topic they name, and the `ClientProxy.emit(topic, payload)` calls of the
services are `send` operations. Priority order:

1. **core**: one operation per action and topic (the channel address is the topic name), the JSON
   payload of its message (ObjectIds and Dates are strings, a Mongoose document is its `toJSON()`);
2. validation constraints and descriptions (the handlers' JSDoc as operation summaries), when the tool
   supports them out of the box.

### Rules

- **Do not change the behaviour of the app.** Routes, validation and responses must stay the same:
  the contract test of the app must still pass in the variant:
  ```sh
  cp -r ../../app/test ./test && npm run test:e2e; rm -rf ./test
  ```
- **Never read or copy `expected/openapi.yaml` or `expected/asyncapi.yaml`** (nor their content) in the
  variant, and never write the document by hand. A post-processing script is allowed only if it is generic (it would be written the
  same way for any project, e.g. adding a `servers` entry); it lives in the variant, so it counts.
- If the tool needs its own controller decorators or definition files, add them **beside** the NestJS
  ones; do not rewrite the app with another framework.
- Do not modify `app/`, `expected/`, `bench/` or another variant. Do not run git commands that change
  the repository (commit, stash, checkout, reset).
- Call the tool's binary directly (`node_modules/.bin/<tool>` or `node <script>`), not through `npm run`
  or `npx`, so the timings measure the tool and not npm.

## 3. Describe the pipeline in `bench.json`

```json
{
  "tool": "@nestjs/swagger",
  "packages": ["@nestjs/swagger"],
  "approach": "runtime",
  "output": "openapi.json",
  "clean": "rm -rf dist openapi.json",
  "steps": [
    { "name": "build", "command": "node node_modules/@nestjs/cli/bin/nest.js build" },
    { "name": "generate", "command": "node dist/generate-openapi.js" }
  ],
  "generated": [],
  "notes": ["What could not be expressed, workarounds, surprises…"]
}
```

| Field | Meaning |
| --- | --- |
| `tool` | Display name |
| `spec` | `openapi` (default) or `asyncapi`: the specification of `output` |
| `packages` | npm packages of the tool (their installed versions are reported) |
| `approach` | `runtime` (boots the app / reads reflection metadata), `static` (parses the sources), `compiler` (TypeScript transform) |
| `output` | Generated document (JSON or YAML), relative to the variant |
| `clean` | Run before each measured run: remove every build artefact and generated file, so each run starts from the sources |
| `steps` | Every command needed to go from the sources to `output` (include the compilation when the tool needs compiled code) |
| `generated` | Other generated files or directories (excluded from the ease-of-use diff) |
| `notes` | Limitations met, workarounds, what the tool could not express — shown in the report |

## 4. Iterate

```sh
node bench/src/cli.ts run --only <name> --skip-perf
```

then read `bench/results/<name>/differences.md` (grouped differences) and the summary in
`bench/results/REPORT.md`. `node bench/src/cli.ts compare <file>` compares any document (OpenAPI or
AsyncAPI, from its `asyncapi` key) and prints its differences.
Do not measure the performance while other variants are being built (it is run for all tools at the end).
