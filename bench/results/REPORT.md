# NestJS OpenAPI generators benchmark

Generated on 2026-10-21T18:24:14.776Z — 10 × Apple M4, darwin/arm64, Node v24.21.0.

Lower is better everywhere; `(#n)` is the rank among the tools. See the README for the methodology.

## Summary

| Tool | Version | Approach | Lines changed | Core differences | All differences | Time (median) | Peak RSS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| **nest-openapi-gen** | 1.0.20 | static | 198 (#5) | 119 (#6) | 1072 (#7) | – | – |
| **@nestia/sdk** | 11.3.4 | compiler | 144 (#3) | 183 (#8) | 1139 (#8) | – | – |
| **@nestjs/swagger** | 11.4.7 | runtime | 170 (#4) | 0 (#1) | 22 (#2) | – | – |
| **nestoa** | 0.1.7 | static | 27 (#2) | 149 (#7) | 377 (#6) | – | – |
| **nestoa (unreleased main)** | main@46b4f83 | static | 20 (#1) | 60 (#5) | 250 (#4) | – | – |
| **ts-oas** | 0.6.1 | static | 515 (#8) | 3 (#3) | 4 (#1) | – | – |
| **tsoa** | 6.6.0 | static | 267 (#6) | 0 (#2) | 242 (#3) | – | – |
| **typoa** | 1.0.0-alpha.70 | static | 283 (#7) | 8 (#4) | 304 (#5) | – | – |

- **Lines changed**: lines added + removed in the app (sources and configuration) to generate the document.
- **Core differences**: operations, parameters, request bodies and success responses (what a generated client relies on).
- **All differences**: core + error responses, validation constraints, security and documentation.
- **Time / Peak RSS**: the whole pipeline from the sources to the document (build step included when the tool needs one).

## 1. Ease of use

| Tool | Files touched | Files added | Source files touched | Source lines | Config lines | Total lines | Deps added | node_modules Δ |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| nest-openapi-gen | 9 | 2 | 6 / 75 | 35 | 163 | +187 −11 | `nest-openapi-gen`, `patch-package` | -1 MB |
| @nestia/sdk | 10 | 1 | 7 / 75 | 116 | 28 | +86 −58 | `@nestia/core`, `@nestia/sdk`, `ts-patch` | +47 MB |
| @nestjs/swagger | 26 | 2 | 24 / 75 | 157 | 13 | +154 −16 | `@nestjs/swagger` | +2 MB |
| nestoa | 8 | 2 | 5 / 75 | 18 | 9 | +22 −5 | `@algoan/nestoa` | -8 MB |
| nestoa (unreleased main) | 6 | 1 | 5 / 75 | 14 | 6 | +17 −3 | – | – |
| ts-oas | 18 | 7 | 16 / 75 | 489 | 26 | +514 −1 | `ts-oas` | -14 MB |
| tsoa | 15 | 2 | 13 / 75 | 251 | 16 | +226 −41 | `tsoa` | -6 MB |
| typoa | 9 | 1 | 7 / 75 | 241 | 42 | +214 −69 | `typoa` | +7 MB |

## 2. Correctness

Differences (missing + mismatching + extra facts) per category, against `expected/openapi.yaml`:

| Tool | operations | parameters | requestBody | responses | errors | constraints | security | docs | core | total | expected facts matched |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| nest-openapi-gen | 0 | 1 | 0 | 118 | 828 | 89 | 25 | 11 | **119** | **1072** | 64.1% |
| @nestia/sdk | 1 | 64 | 0 | 118 | 828 | 100 | 26 | 2 | **183** | **1139** | 61.7% |
| @nestjs/swagger | 0 | 0 | 0 | 0 | 0 | 14 | 0 | 8 | **0** | **22** | 99.3% |
| nestoa | 0 | 61 | 84 | 4 | 0 | 192 | 25 | 11 | **149** | **377** | 90.4% |
| nestoa (unreleased main) | 0 | 60 | 0 | 0 | 0 | 190 | 0 | 0 | **60** | **250** | 94.6% |
| ts-oas | 0 | 3 | 0 | 0 | 0 | 0 | 0 | 1 | **3** | **4** | 99.9% |
| tsoa | 0 | 0 | 0 | 0 | 0 | 242 | 0 | 0 | **0** | **242** | 97.3% |
| typoa | 0 | 0 | 0 | 8 | 0 | 90 | 0 | 206 | **8** | **304** | 89.9% |

Recall (share of the expected facts found) per category:

| Tool | operations | parameters | requestBody | responses | errors | constraints | security | docs |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| nest-openapi-gen | 100.0% | 99.5% | 100.0% | 92.2% | 0.0% | 11.0% | 13.8% | 94.7% |
| @nestia/sdk | 96.6% | 67.7% | 100.0% | 91.8% | 0.0% | 0.0% | 10.3% | 99.0% |
| @nestjs/swagger | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% | 86.0% | 100.0% | 96.1% |
| nestoa | 100.0% | 69.2% | 69.1% | 99.8% | 100.0% | 0.0% | 13.8% | 94.7% |
| nestoa (unreleased main) | 100.0% | 69.7% | 100.0% | 100.0% | 100.0% | 2.0% | 100.0% | 100.0% |
| ts-oas | 100.0% | 98.5% | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% | 99.5% |
| tsoa | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% | 22.0% | 100.0% | 100.0% |
| typoa | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% | 10.0% | 100.0% | 0.0% |

[oasdiff](https://github.com/oasdiff/oasdiff) changelog from the expected document to the generated one:

| Tool | Breaking (ERR) | Warnings | Info | Total |
| --- | ---: | ---: | ---: | ---: |
| nest-openapi-gen | 36 | 0 | 221 | 257 |
| @nestia/sdk | 183 | 21 | 368 | 572 |
| @nestjs/swagger | 31 | 0 | 106 | 137 |
| nestoa | 34 | 48 | 181 | 263 |
| nestoa (unreleased main) | 28 | 20 | 202 | 250 |
| ts-oas | 55 | 1 | 59 | 115 |
| tsoa | 29 | 0 | 32 | 61 |
| typoa | 29 | 0 | 32 | 61 |

## 3. Speed and memory

| Tool | Step | Wall (median) | Wall (min–max) | CPU (median) | Peak RSS (median) |
| --- | ---: | ---: | ---: | ---: | ---: |

## Notes per tool

### nest-openapi-gen (`variants/nest-openapi-gen`)

- nest-openapi-gen 1.0.20 (latest, 2024) has no CLI: generate-openapi.js calls its generate() function with prefix '/v1' (the global prefix must be repeated by hand) and tsconfig.build.json. It parses the sources with ts-morph 10.1 (bundled TypeScript 4.2.4), no build or boot needed. Works on TS 5.9 sources.
- Out of the box it crashes on this codebase, so the tool is patched with patch-package (patches/nest-openapi-gen+1.0.20.patch, applied on npm install, ~40 changed lines in the tool): (1) crash on enum-member literal types (`species: Species.CAT`); (2) crash on @nestjs/mapped-types DTOs (PartialType/OmitType properties have no value declaration), now read from their declarations with the symbol's optional flag; (3) typo 'Path' instead of 'Patch' in the HTTP decorators list: PATCH routes were silently dropped.
- Further small patches for features the tool lacks: status codes (always 200 upstream; now @HttpCode, 201 for POST, no content for void), Content-Type from @Header (text/csv), requestBody.required, operation and property descriptions from JSDoc (upstream computes the method description but never emits it), string/number literal types (`status: 'ok'`), generic interfaces instantiated with their type arguments (DataToPaginate<T>.resources was `{}`), and serialisation through a primitive toJSON() (mongodb ObjectId was expanded into its class members, ~1000 facts; Date already handled).
- Source changes: explicit return types on 3 handlers that relied on inference (the inferred HydratedDocument type is unusable statically), and a documentation-only `@Query() _paginationQuery: PaginationQuery` interface parameter on the 5 paginated handlers, since the custom @PaginationParams() decorator is invisible to the tool (README recommends interfaces for @Query). An interface metatype is skipped by ValidationPipe, so behaviour is unchanged.
- Not expressible: the pagination envelope (the tool documents the declared DataToPaginate<T>, not the { resources, pagination } body built by PaginationBodyInterceptor); fields removed by a Mongoose toJSON transform (Shelter.isDeleted appears); optional query params with DefaultValuePipe (includeAdopted marked required); integer/defaults.
- No support at all for security schemes, @Roles/@Unprotected, error responses or exception filters: no 401/403/404/... and no bearer auth in the document. class-validator constraints are ignored: the tool only reads its own @Min/@Max/@Email/@Pattern decorators, which would have to be duplicated on every property (not done). @param JSDoc tags are not used for parameter descriptions. Tags are derived from controller class names; the EventPattern controller is correctly ignored (no HTTP decorator).

Differences: [`bench/results/nest-openapi-gen/differences.md`](nest-openapi-gen/differences.md)

### @nestia/sdk (`variants/nestia`)

Differences: [`bench/results/nestia/differences.md`](nestia/differences.md)

### @nestjs/swagger (`variants/nestjs-swagger`)

Differences: [`bench/results/nestjs-swagger/differences.md`](nestjs-swagger/differences.md)

### nestoa (`variants/nestoa`)

- Published @algoan/nestoa 0.1.7 (latest on GitHub Packages), configured from its README (v0.1.7). The docs/ folder of the nestoa repository describes the unreleased main branch (security option, mapped-types helpers, @Header media types, DefaultValuePipe, HttpStatus members, --strict…), none of which 0.1.7 supports.
- Global prefix not detected: setGlobalPrefix is called in src/setup.ts (not main.ts) with a constant imported from constants.ts, so basePath: /v1 is set in nestoa.config.json.
- No return-type inference: the 3 handlers without an annotation (shelters/cats/adoptions findOne) produced a 200 without body; return types were added.
- @HttpCode(HttpStatus.OK) is ignored (POST stays 201); replaced with @HttpCode(200) on approve/reject.
- DefaultValuePipe does not make the query parameter optional: includeAdopted is documented as required (making the parameter optional in TypeScript breaks the type check of the service call, so it was left as is).
- Classes extending @nestjs/mapped-types helpers (PartialType, OmitType) lose every inherited property: the PATCH shelters, PATCH cats and PUT books bodies only contain their own fields (84 core differences). Not fixable without rewriting the DTOs.
- @PaginationParams() can only be aliased to 'ignore' (or to a body/query/param/header kind): the page/limit/filter/sort query parameters it reads cannot be declared, so they are missing on the 5 paginated routes. The PaginationBodyInterceptor generics are lowered correctly (resources/pagination envelope).
- @Header('Content-Type', 'text/csv') is ignored: the CSV export is documented as application/json.
- No security output at all in 0.1.7 (no securitySchemes, no per-operation security), although the global AuthGuard and @Unprotected() are understood for the 401 responses.
- class-validator constraints (IsInt, MaxLength, Min, IsEmail…) are not read; numbers are never integer. The Error component types status as integer instead of number.
- Errors thrown in services were declared with @throws JSDoc tags (400 for filter/sort parsing on paginated routes, 404/409 on books); 401/403/404 from guards, Roles and ParseObjectIdPipe, and 409 thrown in handlers, were detected without configuration.
- The 0.1.7 CLI only has -c, -o and --print-config (no --strict, no --openapi-version).

Differences: [`bench/results/nestoa/differences.md`](nestoa/differences.md)

### nestoa (unreleased main) (`variants/nestoa-main`)

- Unreleased: built from the main branch of algoan/nestoa (219 commits after v0.1.7) by bench/scripts/build-nestoa-main.sh; compare with the nestoa variant for the published release.
- Configuration only, plus JSDoc: nestoa.config.json sets basePath (the prefix is set in src/setup.ts from an imported constant, while detectGlobalPrefix only reads main.ts) and decoratorAliases for @User (user) and @PaginationParams (ignore).
- Handler return types are not inferred: a handler without one is documented with an empty 200, without any warning even with --strict. 3 return types were added.
- Errors thrown in services (404/409 of books) and the 400 of the pagination decorator need @throws JSDoc tags (8 lines); the 401/403/400/404 coming from guards, @Roles, @Body validation and ParseObjectIdPipe are found automatically.
- A custom param decorator can only be mapped to a known kind or ignored: the page/limit/filter/sort query params read by @PaginationParams() cannot be declared (60 core facts).
- class-validator constraints are not read (no integer, minimum/maximum, min/maxLength, min/maxItems, email); the built-in Error component types status as integer while the app's HttpError declares number.

Differences: [`bench/results/nestoa-main/differences.md`](nestoa-main/differences.md)

### ts-oas (`variants/ts-oas`)

- ts-oas 0.6.1 (latest) with the app's TypeScript 5.9.3, Node 24; generation runs on the sources, no build step.
- Framework-agnostic: it reads nothing from the NestJS controllers. Every endpoint is re-declared by hand as a TypeScript type (`*.api.ts` beside the controllers: path with the hard-coded `v1` prefix, method, params, query, body, responses by status, security), reusing the app's DTO/model/interface types. Nothing keeps these declarations in sync with the controllers (routes, status codes, guards, pipes, interceptors).
- Pagination (PaginationParams + PaginationBodyInterceptor), error responses (`HttpError` per status), bearer security (global `security` + `security: []` on @Unprotected routes) and handler JSDoc are all re-stated manually in the API types; shared helper types live in `src/core/openapi.ts`.
- Intersection types (`A & { b: string }`) are not flattened for `params`/`query` (parameters silently disappear): named interfaces with `extends` must be used instead.
- class-validator decorators are ignored: integers, formats and constraints are duplicated as JSDoc tags (`@type integer`, `@format email`, `@maxLength`…) on the DTOs/models; `@type` short-circuits the schema to the tag content.
- `@internal` is not honoured: `@ignore` added on `Shelter.isDeleted`.
- Mongo `ObjectId` is expanded as the bson class: a generic `schemaProcessor` in the generation script maps it to `{ type: string }`.
- `requestBody.required` has no built-in annotation: enabled with `customKeywords: ['required']` + `customKeywordPrefix: ''` and `@body.required true` on each operation.
- Request headers are not supported (README TODO): the optional `x-request-id` header of POST /adoptions cannot be documented.
- Generic schemas get names like `PaginatedData<Shelter>` in components; operationIds are the type names.

Differences: [`bench/results/ts-oas/differences.md`](ts-oas/differences.md)

### tsoa (`variants/tsoa`)

Differences: [`bench/results/tsoa/differences.md`](tsoa/differences.md)

### typoa (`variants/typoa`)

- typoa is not NestJS-aware and is used only for its spec generation (generate() from a small script); its mandatory express router is written to a temporary directory and discarded.
- typoa matches decorators by name only (ts-morph getName), so the NestJS @Get/@Post/@Patch/@Put/@Delete, @Body and @Query() decorators are read as its own; import aliases are not recognised, so typoa decorators are used through a namespace import (`@typoa.Query`, `@typoa.Path`...) next to the NestJS ones.
- Every handler parameter must carry a typoa parameter decorator: @typoa.Path beside @Param, @typoa.Query beside @Query('x', pipe) (typoa crashes on non-literal pipe arguments), @typoa.Header beside @Headers, and @typoa.Request() (the only 'ignore me' decorator) on @User() and @PaginationParams() parameters.
- A generic post-processing step converts the express `:param` paths to `{param}`, adds a `servers: [{ url: '/v1' }]` entry for the global prefix, and removes the `additionalProperties: false` typoa puts on every object (the ValidationPipe strips unknown properties, it does not reject them).
- The pagination query params (page, limit, filter, sort), invisible behind the custom @PaginationParams() decorator, are declared as extra unused @typoa.Query handler parameters; the envelope built by PaginationBodyInterceptor is declared with @typoa.Response<PaginatedData<T>>(200).
- POST routes return 201 in NestJS but typoa defaults to 200: @typoa.Response<T>(201) on every create; bearer security via @typoa.Security (per method on the partly public books controller); error bodies via @typoa.Response<HttpError>(code) at controller and method level; explicit return types added where the handler returned an inferred mongoose document.
- Remaining core difference: Shelter.isDeleted (hidden by a mongoose toJSON transform, marked @internal) is still documented: typoa has no JSDoc tag to hide a property.
- Not done: class-validator constraints are ignored (typoa only reads JSDoc tags like @minLength/@maximum, duplicating them was not considered reasonable), and plain JSDoc comments are ignored (only @summary/@description tags are read), so operation summaries and property/param descriptions are missing.
- Operation ids are the capitalised method names (`Create`, `FindAll`...), hence duplicated across controllers unless @OperationId is added everywhere.

Differences: [`bench/results/typoa/differences.md`](typoa/differences.md)

