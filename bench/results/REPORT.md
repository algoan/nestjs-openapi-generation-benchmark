# NestJS OpenAPI generators benchmark

Generated on 2026-10-26T10:59:12.447Z — 10 × Apple M4, darwin/arm64, Node v24.21.0.

Lower is better everywhere; `(#n)` is the rank among the tools. See the README for the methodology.

## Summary

| Tool | Version | Approach | Lines changed | Core differences | All differences | Time (median) | Peak RSS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| **nest-openapi-gen** | 1.0.20 | static | 92 (#3) | 1246 (#8) | 2394 (#8) | 2.51 s (#6) | 424 MB (#4) |
| **@nestia/sdk** | 11.3.4 | compiler | 291 (#6) | 10 (#6) | 92 (#5) | 2.94 s (#8) | 674 MB (#8) |
| **@nestjs/swagger** | 11.4.7 | runtime | 170 (#4) | 0 (#1) | 22 (#4) | 2.74 s (#7) | 509 MB (#7) |
| **nestoa** | 0.1.7 | static | 27 (#1) | 149 (#7) | 377 (#7) | 50 ms (#2) | 46 MB (#2) |
| **nestoa (unreleased main)** | main@00c0442 | static | 30 (#2) | 0 (#2) | 0 (#1) | 20 ms (#1) | 8 MB (#1) |
| **ts-oas** | 0.6.1 | static | 513 (#8) | 3 (#4) | 4 (#3) | 816 ms (#4) | 430 MB (#5) |
| **tsoa** | 6.6.0 | static | 300 (#7) | 0 (#3) | 0 (#2) | 792 ms (#3) | 415 MB (#3) |
| **typoa** | 1.0.0-alpha.70 | static | 283 (#5) | 8 (#5) | 304 (#6) | 898 ms (#5) | 443 MB (#6) |

- **Lines changed**: lines added + removed in the app (sources and configuration) to generate the document.
- **Core differences**: operations, parameters, request bodies and success responses (what a generated client relies on).
- **All differences**: core + error responses, validation constraints, security and documentation.
- **Time / Peak RSS**: the whole pipeline from the sources to the document (build step included when the tool needs one).

## 1. Ease of use

| Tool | Files touched | Files added | Source files touched | Source lines | Config lines | Total lines | Deps added | node_modules Δ | Production Δ |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| nest-openapi-gen | 9 | 2 | 6 / 75 | 35 | 57 | +81 −11 | `nest-openapi-gen`, `patch-package` | +14 MB | 0 MB |
| @nestia/sdk | 15 | 3 | 11 / 75 | 258 | 33 | +221 −70 | `@nestia/core`, `@nestia/sdk`, `ts-patch`, `typia` | +61 MB | +71 MB |
| @nestjs/swagger | 26 | 2 | 24 / 75 | 157 | 13 | +154 −16 | `@nestjs/swagger` | +17 MB | +22 MB |
| nestoa | 8 | 2 | 5 / 75 | 18 | 9 | +22 −5 | `@algoan/nestoa` | +7 MB | 0 MB |
| nestoa (unreleased main) | 6 | 1 | 5 / 75 | 14 | 16 | +27 −3 | – | 0 MB | 0 MB |
| ts-oas | 18 | 7 | 16 / 75 | 489 | 24 | +513 −0 | `ts-oas` | +1 MB | 0 MB |
| tsoa | 24 | 2 | 22 / 75 | 284 | 16 | +259 −41 | `tsoa` | +9 MB | +44 MB |
| typoa | 9 | 1 | 7 / 75 | 241 | 42 | +214 −69 | `typoa` | +22 MB | +29 MB |

- **node_modules Δ**: growth of the whole install (dev dependencies included), what a developer or the CI downloads.
- **Production Δ**: growth of the production dependency tree (`npm ls --omit=dev`), what ships with the service. A tool used only to generate the document is a dev dependency and weighs nothing; runtime decorators and helpers bring their dependencies along (a dev dependency of the app, such as `typescript`, counts once it becomes a production one).

## 2. Correctness

Differences (missing + mismatching + extra facts) per category, against `expected/openapi.yaml`:

| Tool | operations | parameters | requestBody | responses | errors | constraints | security | docs | core | total | expected facts matched |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| nest-openapi-gen | 0 | 407 | 16 | 823 | 828 | 89 | 25 | 206 | **1246** | **2394** | 46.7% |
| @nestia/sdk | 1 | 1 | 0 | 8 | 0 | 80 | 1 | 1 | **10** | **92** | 97.0% |
| @nestjs/swagger | 0 | 0 | 0 | 0 | 0 | 14 | 0 | 8 | **0** | **22** | 99.3% |
| nestoa | 0 | 61 | 84 | 4 | 0 | 192 | 25 | 11 | **149** | **377** | 90.4% |
| nestoa (unreleased main) | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **0** | **0** | 100.0% |
| ts-oas | 0 | 3 | 0 | 0 | 0 | 0 | 0 | 1 | **3** | **4** | 99.9% |
| tsoa | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **0** | **0** | 100.0% |
| typoa | 0 | 0 | 0 | 8 | 0 | 90 | 0 | 206 | **8** | **304** | 89.9% |

Recall (share of the expected facts found) per category:

| Tool | operations | parameters | requestBody | responses | errors | constraints | security | docs |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| nest-openapi-gen | 100.0% | 84.8% | 94.1% | 70.8% | 0.0% | 11.0% | 13.8% | 0.0% |
| @nestia/sdk | 96.6% | 99.5% | 100.0% | 99.7% | 100.0% | 20.0% | 96.6% | 99.5% |
| @nestjs/swagger | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% | 86.0% | 100.0% | 96.1% |
| nestoa | 100.0% | 69.2% | 69.1% | 99.8% | 100.0% | 0.0% | 13.8% | 94.7% |
| nestoa (unreleased main) | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% |
| ts-oas | 100.0% | 98.5% | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% | 99.5% |
| tsoa | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% |
| typoa | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% | 10.0% | 100.0% | 0.0% |

[oasdiff](https://github.com/oasdiff/oasdiff) changelog from the expected document to the generated one. It is a second opinion, not used for the ranking: it compares representations, so it also counts renamed security schemes, added `operationId`s, `format: double`, or enums written as `oneOf` of constants.

| Tool | Breaking (ERR) | Warnings | Info | Total |
| --- | ---: | ---: | ---: | ---: |
| nest-openapi-gen | 146 | 0 | 388 | 534 |
| @nestia/sdk | 233 | 0 | 269 | 502 |
| @nestjs/swagger | 31 | 0 | 106 | 137 |
| nestoa | 34 | 48 | 181 | 263 |
| nestoa (unreleased main) | 0 | 0 | 58 | 58 |
| ts-oas | 55 | 1 | 59 | 115 |
| tsoa | 49 | 0 | 197 | 246 |
| typoa | 57 | 6 | 122 | 185 |

## 3. Speed and memory

| Tool | Step | Wall (median) | Wall (min–max) | CPU (median) | Peak RSS (median) |
| --- | ---: | ---: | ---: | ---: | ---: |
| nest-openapi-gen | `generate` | 2.51 s | 2.46 s – 2.66 s | 3.51 s | 424 MB |
| @nestia/sdk | `generate` | 2.94 s | 2.83 s – 3.64 s | 4.56 s | 674 MB |
| @nestjs/swagger | `build` | 2.26 s | 2.13 s – 2.31 s | 3.17 s | 509 MB |
| @nestjs/swagger | `generate` | 484 ms | 430 ms – 552 ms | 480 ms | 139 MB |
| @nestjs/swagger | **total** | **2.74 s** |  | 3.65 s | 509 MB |
| nestoa | `generate` | 50 ms | 50 ms – 56 ms | 30 ms | 46 MB |
| nestoa (unreleased main) | `generate` | 20 ms | 20 ms – 22 ms | 0 ms | 8 MB |
| ts-oas | `generate` | 816 ms | 797 ms – 859 ms | 1.65 s | 430 MB |
| tsoa | `generate` | 792 ms | 788 ms – 824 ms | 1.50 s | 415 MB |
| typoa | `generate` | 898 ms | 859 ms – 984 ms | 1.60 s | 443 MB |

5 measured runs per tool, after one warm-up run.

## Notes per tool

### nest-openapi-gen (`variants/nest-openapi-gen`)

- nest-openapi-gen 1.0.20 (latest, 2024) has no CLI: generate-openapi.js calls generate() with prefix '/v1' (the global prefix is repeated by hand). It reads the NestJS decorators and declared types with ts-morph 10 (bundled TypeScript 4.2); no build or boot.
- The published tool does not run on this codebase: a patch-package patch (patches/, counted) fixes only its bugs: a crash on properties without a value declaration (@nestjs/mapped-types DTOs), a crash on enum-member types (`species: Species.CAT`), and the typo 'Path' instead of 'Patch' in its verb list that silently drops every PATCH route.
- Every response is documented as 200 (no @HttpCode, no 201 for POST, a body even for 204), always as application/json (no text/csv), and request bodies are never marked required.
- mongodb ObjectId and Mongoose types are lowered structurally: every _id is an object with toHexString, equals, toJSON… (most of the extra facts).
- Generic types are not instantiated (DataToPaginate<T> resources become {}), and the PaginationBodyInterceptor envelope is invisible; JSDoc descriptions are computed but never emitted.
- Needs declared return types (3 handlers annotated). The pagination query params of the custom @PaginationParams() decorator are declared with a documentation-only `@Query() _paginationQuery: PaginationQuery` parameter on the 5 paginated handlers (an interface metatype is skipped by ValidationPipe, behaviour unchanged).
- No support at all for security, error responses, or class-validator constraints (only its own @Min/@Max/@Email decorators, not added since they would duplicate class-validator).

Differences: [`bench/results/nest-openapi-gen/differences.md`](nest-openapi-gen/differences.md)

### @nestia/sdk (`variants/nestia`)

- Version: @nestia/sdk 11.3.4 (typia 12, ts-patch 3), not the latest 12.x-14.x. Nestia 12+ runs on ttsc, which is built on typescript-go: it needs TypeScript 7 (`ttsc: platform-specific TypeScript binary not found (@typescript/typescript-darwin-arm64)`), and the app stays on TypeScript 5.9. ts-patch 4 needs TypeScript >= 6, so ts-patch 3.3.0 is used.
- Setup: the three transform plugins go in tsconfig.json. `nestia swagger` runs the code with ts-node, and TS_NODE_COMPILER=ts-patch/compiler applies the transforms without patching node_modules/typescript, so `nest build` is unchanged. nestia.config.ts boots the AppModule with `{ preview: true }`, so no providers and no MongoDB connection, and calls setupApp() to get the `v1` global prefix. nestia.config.ts is excluded from tsconfig.build.json.
- Nestia reads the TypeScript types of the handlers. Handlers without a return type infer mongoose HydratedDocument, which fails with 'nonsensible intersection', so 4 return types were added. Path parameters must be atomic types: `id: ObjectId` (after ParseObjectIdPipe) is rejected. ParseObjectIdPipe now only validates and returns the string, and the controllers call `new ObjectId(id)` for the services. This is the largest change (~50 lines) and keeps the 404 behaviour.
- Custom param decorators (@User, @PaginationParams) are ignored and interceptors are not analysed. An ApiPaginated() decorator built on @nestia/core's SwaggerCustomizer adds the page/limit/filter/sort query parameters and rewrites the DataToPaginate<T> response into a PaginatedData<T> envelope. The PaginationLinks schema comes from typia.json.schema<PaginationLinks>(), which is evaluated lazily in the closure, so it only runs under the nestia transform, never at runtime.
- Security: nestia has no global security. It reads `@security` JSDoc tags or the `swagger/apiSecurity` metadata of @nestjs/swagger's @ApiBearerAuth. The existing Roles decorator now sets that metadata, on the method or the class, and adds 401/403 HttpError responses through SwaggerCustomizer. @Unprotected routes therefore stay unsecured.
- Error responses: there is no global or filter-based mechanism. `@throws 404` JSDoc gives an empty schema and @TypedException<HttpError> needs one decorator per status, so a small ApiErrors(...statuses) SwaggerCustomizer helper is used, one line per route, for 400/404/409.
- GET /v1/books/export cannot be documented: @nestia/sdk only accepts application/json, x-www-form-urlencoded and text/plain responses, and the text/csv route aborts the whole generation. It is excluded with the `@ignore` JSDoc tag.
- Not fixed: void 204 DELETE responses get an empty `application/json` content. `@Query('includeAdopted', new DefaultValuePipe(false), ParseBoolPipe) includeAdopted: boolean` is documented as required because pipes are not analysed. class-validator constraints (maxLength, min/max, email, integer…) are not read. Nestia only understands typia tags (`string & tags.MaxLength<50>`), which would mean rewriting the DTO types.
- A single field header (@Headers('x-request-id')) is dropped. Only header objects are documented, so the handler now takes `@Headers() headers: { 'x-request-id'?: string }`.
- Operation JSDoc becomes `description`/`summary`. Path, query and body names and descriptions, union return types (Cat | Dog), ObjectId/Date serialised as string (via toJSON), mapped-types DTOs and the @EventPattern controller are handled out of the box.

Differences: [`bench/results/nestia/differences.md`](nestia/differences.md)

### @nestjs/swagger (`variants/nestjs-swagger`)

- Uses @nestjs/swagger 11.4.7, the latest 11.x: 12.x requires NestJS 12.
- Nest CLI plugin (classValidatorShim + introspectComments) with dtoFileNameSuffix extended to .model.ts / .interface.ts / .interfaces.ts, so Mongoose models and JSDoc are reflected without @ApiProperty; requires `nest build`.
- Generation boots the app with NestFactory.create(AppModule, { preview: true }) (no MongoDB connection, no HTTP server) and reuses setupApp() for the v1 prefix.
- The plugin only reads classes: the response interfaces (AdoptionReceipt, ShelterStats, PaginationLinks, HttpError) were turned into classes; HealthStatus lives in a controller file, so it needs manual @ApiProperty.
- mongodb ObjectId properties make the plugin emit require("bson/bson"), which crashes at runtime (package exports): each one needs @ApiProperty({ type: String }). ObjectId path params are reflected as a $ref to an empty ObjectId schema: the generation script overrides components.schemas.ObjectId with { type: string } (generic for any Mongo project).
- @nestjs/mapped-types helpers are not reflected: PartialType/OmitType imported from @nestjs/swagger instead.
- The pagination envelope (interceptor) and query params (custom param decorator) are invisible to reflection: reusable ApiPaginatedResponse(Model) composite decorator (ApiExtraModels + getSchemaPath + ApiQuery).
- Handlers without return type infer Promise<HydratedDocument<T>> (documented as a bare object), unions (Cat | Dog) are not supported, Pipe-based optional query/header params are reflected as required: explicit @ApiOkResponse / oneOf / @ApiQuery / @ApiHeader needed.
- Security and 401/403 come from composing the existing @Roles() decorator with ApiBearerAuth + error responses (applyDecorators); other error responses (400/404/409) need one decorator per route or controller, using HttpError as the shared schema.
- Not fixed: the class-validator shim ignores @IsInt (no integer type) and @ArrayMaxSize; JSDoc @param descriptions are not read for path/query params (only method summaries and property comments).

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

- Unreleased: built from the main branch of algoan/nestoa (15 commits after v0.2.0) by bench/scripts/build-nestoa-main.sh; compare with the nestoa variant for the published release.
- Configuration only, plus JSDoc: nestoa.config.json sets decoratorAliases for @User (user) and @PaginationParams (the page/limit/filter/sort query params it reads, limit named by its perPageName option), and errorResponses.schema to the app's HttpError; the v1 global prefix is detected by itself, although setGlobalPrefix is called in src/setup.ts with an imported constant.
- Handler return types are not inferred: a handler without one is documented with an empty 200, with a warning under --strict. 3 return types were added.
- Errors thrown in services (404/409 of books) and the 400 of the pagination decorator need @throws JSDoc tags (8 lines): only the handler's own body is scanned, and a decorator alias cannot declare the errors it throws. The 401/403/400/404 coming from guards, @Roles, @Body validation and ParseObjectIdPipe are found automatically.

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

- tsoa 6.6.0: latest stable release (npm `latest` is 7.0.0-alpha.0 and `next` is 6.0.0-rc.5, both prereleases). Works with TypeScript 5.9. Only `tsoa spec` is used (no generated express routes), OpenAPI 3.0 (no 3.1 support in 6.x).
- tsoa matches decorators by identifier name and is not NestJS-aware. Nest's `@Get`/`@Post`/`@Body`/`@Query('x')` happen to be recognised. Every controller needs `@Route` beside `@Controller`, and every parameter tsoa must not document (`@User()`, `@PaginationParams()`, whole-object `@Query()`) needs `@Inject()`. Undecorated parameters, `@Param` included, are treated as path params named after the variable.
- Query DTOs and pagination query params: tsoa forbids mixing `@Query` and `@Queries` in one method, so each paginated/search route gets one extra trailing tsoa-only `@Queries() _query?: XxxQuery` parameter (Nest injects undefined), backed by small `PaginationQuery` / `...Query extends ...` interfaces.
- Pagination envelope: the interceptor is invisible and the success schema always comes from the return type (`DataToPaginate<T>`). A `@Response` with the same status code is overwritten, so the documented body comes from an extra trailing `@Res() _paginated?: TsoaResponse<200, PaginatedData<T>>` parameter (responses from `@Res` parameters are applied after the success response).
- `@nestjs/mapped-types` classes (`extends PartialType(OmitType(...))`) crash the type resolver, so each mapped DTO gets a merged interface (`Partial<Omit<...>>`) marked `@tsoaModel`.
- Mongo `ObjectId` fails because mongoose augments the bson interface, giving two declarations tsoa cannot merge. Fixed with a third augmentation marked `@tsoaModel` in `src/types/object-id.ts`, added to `controllerPathGlobs` (`.d.ts` files are ignored). ObjectId is then documented as string via its `toJSON`.
- Handlers without a return type are inferred, but Mongoose `HydratedDocument` is unresolvable, so 3 handlers got an explicit `Promise<Model>`. POST creates need `@SuccessResponse(201)`, since tsoa defaults to 200 and does not read `@HttpCode`. The CSV route needs `@Produces('text/csv')`. Security uses `rootSecurity` and `@NoSecurity()` on `@Unprotected()` routes. Error bodies are listed by hand with `@Response<HttpError>(code)` on classes and methods. `@ignore` hides `isDeleted`.
- class-validator constraints are not read: they are duplicated as JSDoc tags (`@maxLength`, `@minimum`, `@isInt`, `@format email`, `@minItems`…). tsoa always emits `format: double` / `int32` on numbers (no option to turn it off); the comparator ignores numeric formats.
- `noImplicitAdditionalProperties: ignore`: the other modes emit `additionalProperties: false` on every model, which is wrong for responses.

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

