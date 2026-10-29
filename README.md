# NestJS OpenAPI generation benchmark

Which tool should generate the OpenAPI document of a NestJS service? This repository compares
the main candidates on one realistic codebase, on three grades:

1. **Ease of use**: how many lines of the codebase have to change to get a document out of the tool;
2. **Correctness**: how many differences there are between the generated document and the expected one;
3. **Speed and memory**: how long it takes and how much memory it needs to go from the sources to the document.

| Tool | Approach |
| --- | --- |
| [`@nestjs/swagger`](https://docs.nestjs.com/openapi/introduction) | runtime: reflection metadata + CLI plugin, the app is booted |
| [`nest-openapi-gen`](https://github.com/yantrab/nest-openapi-gen) | static: ts-morph over the controllers |
| [`@nestia/sdk`](https://nestia.io/docs/swagger/) | static: TypeScript compiler API |
| [`tsoa`](https://tsoa-community.github.io/docs/) | static: its own decorators + TypeScript compiler API |
| [`typoa`](https://github.com/Eywek/typoa) | static: its own decorators + ts-morph |
| [`ts-oas`](https://github.com/ts-oas/ts-oas) | static: endpoint descriptions written as TypeScript types |
| [`swagger-jsdoc`](https://github.com/Surnet/swagger-jsdoc) | static: the document written by hand as YAML in `@openapi` JSDoc blocks |
| [`zod-openapi`](https://github.com/samchungy/zod-openapi) | static: operations and Zod schemas declared in TypeScript, run as a script |
| [`@asteasolutions/zod-to-openapi`](https://github.com/asteasolutions/zod-to-openapi) | static: routes and Zod schemas declared in a registry, run by a script |
| [`nestoa`](https://github.com/algoan/nestoa) | static: Rust parser of the TypeScript sources |

**Results: [`bench/results/REPORT.md`](bench/results/REPORT.md)** (and the charts in `bench/results/report.html`).

## Skipped tools

Every TypeScript tool we looked at that could plausibly produce the OpenAPI document of a NestJS service
is either benchmarked above or listed here with the reason it was not. Tools that are not for TypeScript
(e.g. utoipa for Rust) and tools that only consume an existing OpenAPI document (oasdiff, Spectral, Redoc,
openapi-generator…) are left out on purpose. Versions and dates are the latest npm releases, checked in
October 2026.

| Tool | What it is | Status | Reason |
| --- | --- | --- | --- |
| [`ts-to-openapi`](https://github.com/grantila/ts-to-openapi) 1.3.0 (Feb. 2021) | converts TypeScript types into OpenAPI schema components | skipped | Schemas only: it has no way to describe paths, operations or parameters, so they would be written directly in the output document, which the [guide](bench/VARIANT_GUIDE.md) forbids. Its README says it is not heavily maintained and will be replaced by typeconv; no release since 1.3.0. |
| [`typeconv`](https://github.com/grantila/typeconv) 2.3.1 (June 2023) | converts types between TypeScript, JSON Schema, OpenAPI, GraphQL and SureType | skipped | Same problem: schemas only, with no way to describe operations. No commit or release since 2.3.1. |
| [`next-swagger-doc`](https://github.com/jellydn/next-swagger-doc) 0.5.0 (Aug. 2026) | swagger-jsdoc wrapper for Next.js API routes | skipped | Adds nothing over swagger-jsdoc, which is benchmarked, for a NestJS app: same `@openapi` JSDoc parsing, scoped to a Next.js `apiFolder`. |
| [`nest-sdk-generator`](https://github.com/lonestone/nest-sdk-generator) (Lonestone) 1.1.3 (Nov. 2022) | generates a typed client SDK from NestJS controllers | skipped | Generates a client SDK, not an OpenAPI document (its README: it "doesn't generate a documentation by itself"). Last commit November 2022. |
| [`@matchbook-lab/nest-sdk-generator`](https://github.com/MatchbookLab/nest-sdk-generator) 0.2.1 (Oct. 2019) | generates an Angular client service from NestJS controllers | skipped | Generates a client, not an OpenAPI document. Last commit March 2020. |
| [`@compodoc/compodoc`](https://github.com/compodoc/compodoc) 2.0.0 (June 2026) | HTML documentation of Angular, NestJS and Stencil code | skipped | Documents the code structure (modules, classes, routes) as HTML; it has no OpenAPI output. |
| [`nestjs-asyncapi`](https://github.com/flamewow/nestjs-asyncapi) 2.0.1 (May 2026) | AsyncAPI 3.0 document from `@AsyncApi*` decorators, DTOs read through `@nestjs/swagger` | skipped | Generates AsyncAPI for event-driven services, not OpenAPI: out of scope for the HTTP document. It could describe the app's `@EventPattern` controller in a separate AsyncAPI document. |
| [`openapi3-ts`](https://github.com/metadevpro/openapi3-ts) 4.6.2 (Oct. 2026) | typed model and builder of OpenAPI 3.0/3.1/3.2 documents | skipped | Nothing is generated or read from the code: the whole document is written by hand as typed objects. That is swagger-jsdoc's approach, which is benchmarked, without even reading the descriptions from beside the handlers. |
| [`ts-rest`](https://github.com/ts-rest/ts-rest) 3.52.1 (March 2025) | contract-first typed REST client and server, with `@ts-rest/nest` and `@ts-rest/open-api` | skipped | No longer maintained: its README says so and the repository was archived in October 2026. |
| [`@typespec/compiler`](https://github.com/microsoft/typespec) 1.17.0 (Oct. 2026) | API description language compiled to OpenAPI | skipped | The API is described by hand in `.tsp` files, separate from the code: design-first, the same as writing the document by hand. |
| [LoopBack 4](https://github.com/loopbackio/loopback-next) (`@loopback/rest` 16.0.0, Oct. 2026), [tRPC](https://github.com/trpc/trpc) (`@trpc/server` 11.22.1 + [`trpc-to-openapi`](https://github.com/mcampa/trpc-to-openapi) 3.3.3, Oct. 2026), [`@hono/zod-openapi`](https://github.com/honojs/middleware/tree/main/packages/zod-openapi) 1.6.3 (Sept. 2026), [`express-zod-api`](https://github.com/RobinTail/express-zod-api) 29.8.2 (Sept. 2026) | web frameworks that generate (or, with a plugin, can generate) an OpenAPI document | skipped | Only for apps written with their own framework: using them means rewriting the app, which the guide forbids. |

## Results at a glance

Run on an Apple M4, Node 24 (5 measured runs after one warm-up). Lower is better everywhere.

| Tool | Version | Lines changed | Core differences | All differences | Time (median) | Peak RSS |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| nestoa (unreleased main) | main@00c0442 | **30** | **0** | **0** | **19 ms** | **8 MB** |
| nestoa | 0.2.1 | 33 | **0** | **0** | 48 ms | 47 MB |
| nest-openapi-gen | 1.0.20 (patched) | 92 | 1246 | 2394 | 2.51 s | 424 MB |
| @nestjs/swagger | 11.4.7 | 170 | **0** | 22 | 2.74 s | 509 MB |
| typoa | 1.0.0-alpha.70 | 283 | 8 | 304 | 898 ms | 443 MB |
| @nestia/sdk | 11.3.4 | 291 | 10 | 92 | 2.94 s | 674 MB |
| tsoa | 6.6.0 | 300 | **0** | **0** | 792 ms | 415 MB |
| ts-oas | 0.6.1 | 513 | 3 | 4 | 816 ms | 430 MB |
| zod-openapi | 6.0.2 | 574 | **0** | **0** | 205 ms | 155 MB |
| @asteasolutions/zod-to-openapi | 9.1.0 | 610 | **0** | **0** | 204 ms | 153 MB |
| swagger-jsdoc | 6.3.0 | 1505 | **0** | **0** | 94 ms | 78 MB |

What the numbers say:

- **There is a clear trade-off between effort and correctness.** The published tools that reach (near) zero
  differences — tsoa, ts-oas, @nestjs/swagger, nestia, zod-openapi, zod-to-openapi, swagger-jsdoc — get there by
  describing the API a second time (decorators, JSDoc tags, hand-written endpoint types, Zod schemas or YAML:
  170 to 1505 lines). Every one of those lines can drift from the code.
- **nestoa needs the fewest changes by far** (30–33 lines, no source annotation besides 3 return types and
  a few `@throws` tags) and is **one to two orders of magnitude faster and lighter** than every Node-based
  tool that reads the TypeScript code: 16–61× faster and 9–14× lighter for 0.2.1, 41–155× faster and 52–84×
  lighter for main. It matches the expected document exactly: the query parameters read by
  `@PaginationParams()` and the error body are declared in its configuration, and class-validator
  constraints are read from the DTOs. swagger-jsdoc, which reads only comments, is 2× slower and 1.7× heavier
  than nestoa 0.2.1 (5× and 10× than main); zod-openapi and zod-to-openapi, which only transpile and run their
  definitions, are 4× slower and 3× heavier (11× and 19× than main).
- **Generation-only tools ship nothing to production.** nestoa, nest-openapi-gen, ts-oas, swagger-jsdoc,
  zod-openapi and zod-to-openapi are dev dependencies (nestoa main is a standalone binary): 0 MB in the service's
  production install. The tools whose decorators run with the app add to it: +22 MB for @nestjs/swagger, +29 MB for typoa, +44 MB for tsoa,
  +71 MB for nestia (tsoa and nestia pull `typescript` into the production dependencies).
- **The published nestoa 0.2.1 has caught up with its main branch** (main@00c0442 is the v0.2.1 release):
  security, `@nestjs/mapped-types` helpers, `text/csv`, `HttpStatus.*` members, custom decorators' query
  parameters and class-validator constraints, missing from 0.1.7 (149 core differences), are all supported.
  It generates the same document as main; its 3 extra lines are the dependency and the `.npmrc` of
  GitHub Packages. It is only slower and heavier because `node_modules/.bin/nestoa` is a Node launcher
  that spawns the native binary: Node accounts for about 30 ms and 38 MB, the binary alone measures like
  main (10–20 ms, 8 MB).
- **@nestjs/swagger** is the most correct with moderate effort, thanks to its CLI plugin, but needs a build
  (`nest build`) and boots the app, which makes it the slowest pipeline together with nestia.
- **swagger-jsdoc** reads only the `@openapi` comments of the sources, neither the decorators nor the types:
  the whole document is written by hand as YAML, the 29
  operations and every DTO and model in JSDoc comments, the shared security, parameters and error responses in
  a definition file. It gets exactly what it is given, for 2.6 to 9 times the lines of the
  other tools describing the API a second time, and nothing catches the YAML drifting from the code. It is fast
  because it only scans comments.
- **zod-openapi** reads nothing from NestJS either: every DTO, model and interface is re-declared as a Zod schema
  and every operation as a TypeScript object beside the controllers (574 lines). Zod maps the app's patterns
  without workarounds (`.omit()`/`.partial()`/`.extend()` for the mapped types and inheritance, the TypeScript
  enums, the `x-request-id` header) and the compiler checks the definitions, but not against the controllers,
  and the class-validator DTOs still validate the requests: each DTO exists twice.
- **@asteasolutions/zod-to-openapi** works the same way, through a registry: every DTO and model is mirrored as a
  Zod schema and every route re-declared with `registry.registerPath` (610 lines). Same exact document, same
  speed and memory, same drift: nothing ties the Zod schemas to the DTOs they mirror.
- **nest-openapi-gen** (unmaintained since 2024) crashes on this codebase without patching and lowers
  Mongo `ObjectId`s into objects; not a realistic option.
- **nestia** latest (12–14) requires TypeScript 7; 11.3.4 was used, with ts-patch.

Correctness is a **ceiling**: each variant was iterated against the comparator until the tool could not express
more without unreasonable effort, so "differences" measure what a tool *can* express, and "lines changed"
measure what it costs to get there.

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

## The app

A generic pet-shelter API (shelters, cats, dogs, adoptions, and a public catalogue of books) written
like the Algoan backend services (`backend`, `analysis-manager`, `connect-backend`, `console-backend`),
with the private `@algoan/*` libraries replaced by small local equivalents in `app/src/core`:

| Pattern | Where |
| --- | --- |
| Mongoose `@Schema`/`@Prop` models used as response types, `HydratedDocument`, sub-documents, inheritance (`Cat extends Animal`) | `*/models/*.model.ts` |
| class-validator DTOs with nested `@ValidateNested` + `@Type`, enums, constraints | `*/dto/*.dto.ts` |
| `@nestjs/mapped-types` (`PartialType`, `OmitType`) | `UpdateShelterDto`, `UpdateCatDto`, `ReplaceBookDto` |
| Nested resources and `ParseObjectIdPipe` | `shelters/:shelterId/cats/:catId` … |
| Global `AuthGuard` + `RoleGuard` (Keycloak-like), `@Roles()` on handlers or controllers, `@Unprotected()` | `core/auth` |
| Custom param decorators: `@User()` (caller identity), `@PaginationParams()` (reads `page`, `limit`, `filter`, `sort`) | `core/decorators`, `core/pagination` |
| `PaginationBodyInterceptor` turning `DataToPaginate<T>` into `{ resources, pagination }` | `core/pagination` |
| Global `HttpExceptionFilter` producing `{ code, message, status }` | `core/filters` |
| `@Log()` side-effect interceptor, `@HttpCode`, `@Header('Content-Type', 'text/csv')`, `@Headers()`, `DefaultValuePipe`/`ParseBoolPipe`/`ParseIntPipe`/`ParseEnumPipe`, `@Query()` DTOs | controllers |
| Handlers without a return type (inferred from the service), interface and union (`Cat \| Dog`) return types | controllers |
| `setGlobalPrefix('v1')` outside of `main.ts` | `src/setup.ts` |
| JSDoc on handlers, DTO and model properties, `@internal` fields stripped by a `toJSON` transform | everywhere |
| A Pub/Sub `@EventPattern` controller (must not appear in the document) | `events/` |

29 HTTP operations, 75 source files. `cd app && npm start` runs it (needs MongoDB on `MONGODB_URI`).

## Methodology

### The expected document

[`expected/openapi.yaml`](expected/openapi.yaml) (OpenAPI 3.1) describes what the server really does on the
wire: the `v1` prefix, the pagination envelope added by the interceptor, the error body of the filter,
the `201`/`204`/`200` status codes, the `@internal` fields stripped from responses, ObjectIds and Dates
serialized as strings. Validation constraints are listed only when a class-validator decorator has a direct
JSON-schema equivalent (`IsInt`, `Min`, `Max`, `MinLength`, `MaxLength`, `Length`, `ArrayMinSize`,
`ArrayMaxSize`, `IsEmail`); descriptions only come from JSDoc present in the code.

It is not an opinion: [`app/test/contract.e2e-spec.ts`](app/test/contract.e2e-spec.ts) boots the app on an
in-memory MongoDB and checks that

- the documented operations are exactly the routes the app serves;
- every response (status, content type, body) matches the document, **with no undocumented property**;
- every documented request constraint is enforced: one invalid request is generated per constraint
  (missing required field, wrong type, out-of-range value, too long string, invalid enum, bad email…) and
  must get a `400`;
- every documented status code (`400`, `401`, `403`, `404`, `409`, success) is observed at least once.

### Ease of use

Each tool gets a variant, `variants/<tool>`: a copy of `app/` annotated the way a team adopting the tool
would, following the tool's documentation, to describe the real API as well as the tool can
(see [`bench/VARIANT_GUIDE.md`](bench/VARIANT_GUIDE.md)). The app's behaviour must not change: the contract
test passes in every variant. The grade is the diff between the variant and `app/`: files touched, lines
added and removed (sources and configuration, lock files and generated files excluded), dependencies added,
the `node_modules` growth, and the growth of the production dependency tree (`npm ls --omit=dev`): what
ships with the service, where a tool used only at build time weighs nothing.

### Correctness

Both documents are normalized — `$ref`s inlined, `allOf` merged, `oneOf` read as `anyOf`, 3.0 `nullable`
read as 3.1 `type: [..., 'null']`, `servers` paths prepended, object query parameters exploded — then
flattened into atomic **facts**: "`GET /v1/books/{isbn}` exists", "its success status is `200`",
"`$.title` of its `application/json` body is a `string`", "`$.title` is required", "`$.pageCount` has
`minimum: 1`"… A **difference** is an expected fact missing or with another value in the generated
document, or a generated fact the expected document does not have. Component names, `operationId`s,
tags, examples, response descriptions and numeric formats (`int32`, `int64`, `float`, `double`) are ignored. A missing global prefix counts as a single
difference, and so does a wrong success status code.

Facts are grouped in categories, so a tool is not judged on what it was never meant to do:

| Category | Facts |
| --- | --- |
| `operations` | the operation exists (method + path) |
| `parameters` | path, query and header parameters: presence, `required`, type, enum, format |
| `requestBody` | presence, `required`, media type, schema (types, properties, `required`, enums, `date-time`) |
| `responses` | success status code, media type, schema |
| `errors` | `4xx` responses and their schema |
| `constraints` | `minimum`/`maximum`, `minLength`/`maxLength`, `minItems`/`maxItems`, `default`, `integer` vs `number`, `email` format |
| `security` | whether the operation requires the bearer token |
| `docs` | summaries and descriptions from the JSDoc (recall only: the expected text must appear) |

**Core** = operations + parameters + request bodies + success responses: what a generated client relies on.
The [oasdiff](https://github.com/oasdiff/oasdiff) changelog from the expected document to the generated
one is reported as a second opinion (breaking changes = what would break a client written against the
expected document).

### Speed and memory

Each variant's `bench.json` lists the commands going from the sources to the document — including the
compilation when the tool needs compiled code (`@nestjs/swagger`) — and a `clean` command run before each
run. Each command runs under `/usr/bin/time` (wall time, CPU time, peak RSS of the largest process of the
tree), 5 times by default after a warm-up run. Tools are called directly, not through `npm run`/`npx`.

## Fairness

- nestoa is developed by Algoan, which also wrote this benchmark. It follows the same guide as the other
  tools, is installed from its published package, and its variant is measured the same way.
- The app reproduces Algoan's patterns on purpose: that is the codebase the tools are evaluated for. A
  codebase written for a given tool (e.g. with `@nestjs/swagger` decorators or nestia's typed routes from
  the start) would favour that tool.
- What a tool cannot express is recorded in its `bench.json` notes and shown in the report.
- A tool may only be patched to fix bugs that stop it from running (nest-openapi-gen), never to add features;
  the patch is counted in the lines changed.
- `nestoa (unreleased main)` is built from source by `bench/scripts/build-nestoa-main.sh` and is not an
  installable release: it is listed to show where the tool is going, not as a peer of the published tools.
- Timings vary between sessions (up to ~2× for the slowest Node tools); the ranking does not change.

## Keeping nestoa up to date

nestoa is checked against this benchmark on every pull request: its CI builds the pull request and its
base branch, generates the document of `variants/nestoa-main` with both, and runs `check`, which fails when
any category gets more differences.

When a commit is merged on nestoa's main branch, or a version is released, nestoa dispatches the
[refresh workflow](.github/workflows/refresh-nestoa.yml) here. It re-runs the ease and correctness of
`nestoa-main` (pinned to the latest main commit) or `nestoa` (bumped to the latest version) and opens a pull
request with the new results. Speed and memory are kept from the last local run, measured on one machine
for every tool; the notes and the README table are updated by hand in that pull request.

## Adding a tool

Follow [`bench/VARIANT_GUIDE.md`](bench/VARIANT_GUIDE.md), then `node bench/src/cli.ts run --only <name>`.
