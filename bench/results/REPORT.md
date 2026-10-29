# NestJS OpenAPI generators benchmark

Generated on 2026-10-29T13:40:15.630Z — 10 × Apple M4, darwin/arm64, Node v24.21.0.

Lower is better everywhere; `(#n)` is the rank among the tools. See the README for the methodology.

## Summary

| Tool | Version | Approach | Lines changed | Core differences | All differences | Time (median) | Peak RSS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| **nest-openapi-gen** | 1.0.20 | static | 92 (#3) | 1246 (#13) | 2394 (#13) | 2.51 s (#10) | 424 MB (#7) |
| **@nestia/sdk** | 11.3.4 | compiler | 291 (#7) | 10 (#10) | 92 (#10) | 2.94 s (#12) | 674 MB (#12) |
| **@nestjs/swagger** | 11.4.7 | runtime | 170 (#5) | 0 (#1) | 22 (#8) | 2.74 s (#11) | 509 MB (#10) |
| **nestjs-zod** | 5.5.0 | runtime | 689 (#12) | 51 (#11) | 64 (#9) | 2.38 s (#9) | 538 MB (#11) |
| **nestoa** | 0.2.1 | static | 33 (#2) | 0 (#2) | 0 (#1) | 48 ms (#2) | 47 MB (#2) |
| **nestoa (unreleased main)** | main@00c0442 | static | 30 (#1) | 0 (#3) | 0 (#2) | 19 ms (#1) | 8 MB (#1) |
| **swagger-jsdoc** | 6.3.0 | static | 1505 (#13) | 0 (#4) | 0 (#3) | 94 ms (#3) | 78 MB (#3) |
| **ts-oas** | 0.6.1 | static | 513 (#9) | 3 (#8) | 4 (#7) | 816 ms (#7) | 430 MB (#8) |
| **tsoa** | 6.6.0 | static | 300 (#8) | 0 (#5) | 0 (#4) | 792 ms (#6) | 415 MB (#6) |
| **tspec** | 0.2.11 | static | 153 (#4) | 1023 (#12) | 1717 (#12) | 10.84 s (#13) | 705 MB (#13) |
| **typoa** | 1.0.0-alpha.70 | static | 283 (#6) | 8 (#9) | 304 (#11) | 898 ms (#8) | 443 MB (#9) |
| **zod-openapi** | 6.0.2 | static | 574 (#10) | 0 (#6) | 0 (#5) | 205 ms (#5) | 155 MB (#5) |
| **@asteasolutions/zod-to-openapi** | 9.1.0 | static | 610 (#11) | 0 (#7) | 0 (#6) | 204 ms (#4) | 153 MB (#4) |

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
| nestjs-zod | 40 | 6 | 38 / 75 | 672 | 17 | +379 −310 | `@nestjs/swagger`, `nestjs-zod`, `zod` | +26 MB | +31 MB |
| nestoa | 8 | 2 | 5 / 75 | 14 | 19 | +30 −3 | `@algoan/nestoa` | +8 MB | 0 MB |
| nestoa (unreleased main) | 6 | 1 | 5 / 75 | 14 | 16 | +27 −3 | – | – | – |
| swagger-jsdoc | 43 | 1 | 41 / 75 | 1429 | 76 | +1505 −0 | `swagger-jsdoc` | +4 MB | 0 MB |
| ts-oas | 18 | 7 | 16 / 75 | 489 | 24 | +513 −0 | `ts-oas` | +1 MB | 0 MB |
| tsoa | 24 | 2 | 22 / 75 | 284 | 16 | +259 −41 | `tsoa` | +9 MB | +44 MB |
| tspec | 18 | 1 | 16 / 75 | 142 | 11 | +148 −5 | `@nestjs/swagger`, `tspec` | +61 MB | +22 MB |
| typoa | 9 | 1 | 7 / 75 | 241 | 42 | +214 −69 | `typoa` | +22 MB | +29 MB |
| zod-openapi | 8 | 7 | 7 / 75 | 570 | 4 | +573 −1 | `zod`, `zod-openapi` | – | – |
| @asteasolutions/zod-to-openapi | 8 | 7 | 7 / 75 | 606 | 4 | +609 −1 | `@asteasolutions/zod-to-openapi`, `zod` | +9 MB | 0 MB |

- **node_modules Δ**: growth of the whole install (dev dependencies included), what a developer or the CI downloads.
- **Production Δ**: growth of the production dependency tree (`npm ls --omit=dev`), what ships with the service. A tool used only to generate the document is a dev dependency and weighs nothing; runtime decorators and helpers bring their dependencies along (a dev dependency of the app, such as `typescript`, counts once it becomes a production one).

## 2. Correctness

Differences (missing + mismatching + extra facts) per category, against `expected/openapi.yaml`:

| Tool | operations | parameters | requestBody | responses | errors | constraints | security | docs | core | total | expected facts matched |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| nest-openapi-gen | 0 | 407 | 16 | 823 | 828 | 89 | 25 | 206 | **1246** | **2394** | 46.7% |
| @nestia/sdk | 1 | 1 | 0 | 8 | 0 | 80 | 1 | 1 | **10** | **92** | 97.0% |
| @nestjs/swagger | 0 | 0 | 0 | 0 | 0 | 14 | 0 | 8 | **0** | **22** | 99.3% |
| nestjs-zod | 0 | 0 | 51 | 0 | 0 | 5 | 0 | 8 | **51** | **64** | 99.5% |
| nestoa | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **0** | **0** | 100.0% |
| nestoa (unreleased main) | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **0** | **0** | 100.0% |
| swagger-jsdoc | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **0** | **0** | 100.0% |
| ts-oas | 0 | 3 | 0 | 0 | 0 | 0 | 0 | 1 | **3** | **4** | 99.9% |
| tsoa | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **0** | **0** | 100.0% |
| tspec | 0 | 112 | 100 | 811 | 552 | 48 | 25 | 69 | **1023** | **1717** | 48.6% |
| typoa | 0 | 0 | 0 | 8 | 0 | 90 | 0 | 206 | **8** | **304** | 89.9% |
| zod-openapi | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **0** | **0** | 100.0% |
| @asteasolutions/zod-to-openapi | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **0** | **0** | 100.0% |

Recall (share of the expected facts found) per category:

| Tool | operations | parameters | requestBody | responses | errors | constraints | security | docs |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| nest-openapi-gen | 100.0% | 84.8% | 94.1% | 70.8% | 0.0% | 11.0% | 13.8% | 0.0% |
| @nestia/sdk | 96.6% | 99.5% | 100.0% | 99.7% | 100.0% | 20.0% | 96.6% | 99.5% |
| @nestjs/swagger | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% | 86.0% | 100.0% | 96.1% |
| nestjs-zod | 100.0% | 100.0% | 98.9% | 100.0% | 100.0% | 95.0% | 100.0% | 96.1% |
| nestoa | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% |
| nestoa (unreleased main) | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% |
| swagger-jsdoc | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% |
| ts-oas | 100.0% | 98.5% | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% | 99.5% |
| tsoa | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% |
| tspec | 100.0% | 44.9% | 63.6% | 52.3% | 33.3% | 52.0% | 13.8% | 66.5% |
| typoa | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% | 10.0% | 100.0% | 0.0% |
| zod-openapi | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% |
| @asteasolutions/zod-to-openapi | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% | 100.0% |

[oasdiff](https://github.com/oasdiff/oasdiff) changelog from the expected document to the generated one. It is a second opinion, not used for the ranking: it compares representations, so it also counts renamed security schemes, added `operationId`s, `format: double`, or enums written as `oneOf` of constants.

| Tool | Breaking (ERR) | Warnings | Info | Total |
| --- | ---: | ---: | ---: | ---: |
| nest-openapi-gen | 146 | 0 | 388 | 534 |
| @nestia/sdk | 233 | 0 | 269 | 502 |
| @nestjs/swagger | 31 | 0 | 106 | 137 |
| nestjs-zod | 40 | 4 | 147 | 191 |
| nestoa | 0 | 0 | 58 | 58 |
| nestoa (unreleased main) | 0 | 0 | 58 | 58 |
| swagger-jsdoc | 26 | 5 | 30 | 61 |
| ts-oas | 55 | 1 | 59 | 115 |
| tsoa | 49 | 0 | 197 | 246 |
| tspec | 379 | 44 | 224 | 647 |
| typoa | 57 | 6 | 122 | 185 |
| zod-openapi | 27 | 0 | 65 | 92 |
| @asteasolutions/zod-to-openapi | 25 | 0 | 37 | 62 |

## 3. Speed and memory

| Tool | Step | Wall (median) | Wall (min–max) | CPU (median) | Peak RSS (median) |
| --- | ---: | ---: | ---: | ---: | ---: |
| nest-openapi-gen | `generate` | 2.51 s | 2.46 s – 2.66 s | 3.51 s | 424 MB |
| @nestia/sdk | `generate` | 2.94 s | 2.83 s – 3.64 s | 4.56 s | 674 MB |
| @nestjs/swagger | `build` | 2.26 s | 2.13 s – 2.31 s | 3.17 s | 509 MB |
| @nestjs/swagger | `generate` | 484 ms | 430 ms – 552 ms | 480 ms | 139 MB |
| @nestjs/swagger | **total** | **2.74 s** |  | 3.65 s | 509 MB |
| nestjs-zod | `build` | 1.93 s | 1.89 s – 2.01 s | 2.59 s | 538 MB |
| nestjs-zod | `generate` | 470 ms | 448 ms – 544 ms | 410 ms | 146 MB |
| nestjs-zod | **total** | **2.38 s** |  | 3.00 s | 538 MB |
| nestoa | `generate` | 48 ms | 45 ms – 50 ms | 30 ms | 47 MB |
| nestoa (unreleased main) | `generate` | 19 ms | 18 ms – 21 ms | 0 ms | 8 MB |
| swagger-jsdoc | `generate` | 94 ms | 93 ms – 95 ms | 100 ms | 78 MB |
| ts-oas | `generate` | 816 ms | 797 ms – 859 ms | 1.65 s | 430 MB |
| tsoa | `generate` | 792 ms | 788 ms – 824 ms | 1.50 s | 415 MB |
| tspec | `generate` | 10.84 s | 10.76 s – 11.32 s | 13.24 s | 705 MB |
| typoa | `generate` | 898 ms | 859 ms – 984 ms | 1.60 s | 443 MB |
| zod-openapi | `generate` | 205 ms | 185 ms – 302 ms | 240 ms | 155 MB |
| @asteasolutions/zod-to-openapi | `generate` | 204 ms | 203 ms – 208 ms | 250 ms | 153 MB |

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

### nestjs-zod (`variants/nestjs-zod`)

- nestjs-zod 5.5.0 with zod 4.6.7, on top of @nestjs/swagger 11.4.7 (it generates the document through SwaggerModule): the setup of the @nestjs/swagger variant is reused (CLI plugin, preview boot, ApiPaginatedResponse, Roles + ApiBearerAuth, error responses, explicit @ApiOkResponse), and the document goes through cleanupOpenApiDoc().
- The 11 class-validator DTOs are rewritten as zod schemas wrapped in createZodDto, and ValidationPipe is replaced by ZodValidationPipe in setupApp(): this rewrite is most of the lines changed. Inheritance and mapped types become .extend() / .omit() / .partial(), JSDoc becomes .describe(); zod gets integer types, maxItems and nested schemas right where the class-validator shim did not.
- Responses keep the Mongoose model classes, reflected by the CLI plugin: @ZodResponse + ZodSerializerInterceptor would need a second zod schema per model (ObjectId and Date codecs) and would change the response pipeline. The class-validator decorators of the 4 sub-document models are left in place: nothing validates with them anymore, the plugin still reads them for the response schemas.
- zod has no ISBN, ISO 3166 country, phone number or Mongo id validator: class-validator's standalone isISBN / isISO31661Alpha2 / isPhoneNumber / isMongoId are kept in .refine() to validate exactly as before (refinements are not documented). Emails use isEmail + .meta({ format: 'email' }) too: z.email() validates with a different regex and documents it as a pattern.
- Zod's .min() / .max() and class-validator's length decorators both count code points, but class-validator leaves out variation selectors (U+FE0F…): a codePointString() helper validates with class-validator's length() and documents minLength / maxLength with .meta(). @IsEnum(Species, { each: true }) without @IsArray() also accepted a single value: topics wraps a string into an array in a z.preprocess(). z.int() rejects integers outside the safe range (@IsInt() does not) and documents the safe-integer bounds as minimum / maximum: integers are z.number().refine(Number.isInteger).meta({ type: 'integer' }).
- z.date() / z.coerce.date() cannot be converted to JSON Schema (generation crashes); z.iso.datetime() is stricter than @IsDate() and documents a regex pattern. Dates are a shared z.preprocess() turning millisecond timestamps and booleans into ISO strings, as new Date() does in @Type(() => Date), then z.string().meta({ format: 'date-time' }).pipe(z.coerce.date()), accepting what @Type(() => Date) + @IsDate() accepted; it needs .nonoptional(), or z.preprocess is documented as an optional property.
- Optional fields accept null as @IsOptional() does: .nullish() instead of .optional(), and a partialNullish() helper instead of .partial() for the PartialType DTOs. zod cannot accept null without documenting it, so every optional body field is documented as nullable (the 45 extra `nullable` facts; the expected document leaves null out). 400 bodies carry 'Validation failed' instead of class-validator's first message (same { code, message, status } shape).
- Not fixed: zod writes a nullable boolean as type: ['boolean', 'null'], which nestjs-zod passes to @nestjs/swagger as is and which comes out as an array of booleans (goodWithKids, available); the response-side gaps of @nestjs/swagger remain (Author.birthYear not an integer, JSDoc @param descriptions of path/query params not read, ParseIntPipe query param not an integer).

Differences: [`bench/results/nestjs-zod/differences.md`](nestjs-zod/differences.md)

### nestoa (`variants/nestoa`)

- Published @algoan/nestoa 0.2.1 (latest on GitHub Packages), configured from its documentation. It is the commit benchmarked by the nestoa-main variant, which this variant now matches: same configuration, annotations and document.
- Configuration only, plus JSDoc: nestoa.config.json sets decoratorAliases for @User (user) and @PaginationParams (the page/limit/filter/sort query params it reads, limit named by its perPageName option), and errorResponses.schema to the app's HttpError; the v1 global prefix is detected by itself, although setGlobalPrefix is called in src/setup.ts with an imported constant.
- Handler return types are not inferred: a handler without one is documented with an empty 200, with a warning under --strict. 3 return types were added.
- Errors thrown in services (404/409 of books) and the 400 of the pagination decorator need @throws JSDoc tags (8 lines): only the handler's own body is scanned, and a decorator alias cannot declare the errors it throws. The 401/403/400/404 coming from guards, @Roles, @Body validation and ParseObjectIdPipe are found automatically.
- Compared with nestoa-main, the only extra lines are the dependency and the .npmrc pointing @algoan at GitHub Packages.
- Measured through node_modules/.bin/nestoa, the entry point users run: it is a Node launcher (bin/nestoa.js) that spawns the native binary, and the peak RSS reported is that of the Node process. Node accounts for about 30 ms and 38 MB of the gap with nestoa-main: run directly with /usr/bin/time -l on the Apple M4, the launcher takes 40–50 ms and 46.6 MB, the 0.2.1 native binary 10–20 ms and 7.9 MB, and nestoa-main 10 ms and 8.0 MB (0.1.7 had the same overhead).

Differences: [`bench/results/nestoa/differences.md`](nestoa/differences.md)

### nestoa (unreleased main) (`variants/nestoa-main`)

- Unreleased: built from the main branch of algoan/nestoa by bench/scripts/build-nestoa-main.sh; compare with the nestoa variant for the published release (main@00c0442 is the v0.2.1 release).
- Configuration only, plus JSDoc: nestoa.config.json sets decoratorAliases for @User (user) and @PaginationParams (the page/limit/filter/sort query params it reads, limit named by its perPageName option), and errorResponses.schema to the app's HttpError; the v1 global prefix is detected by itself, although setGlobalPrefix is called in src/setup.ts with an imported constant.
- Handler return types are not inferred: a handler without one is documented with an empty 200, with a warning under --strict. 3 return types were added.
- Errors thrown in services (404/409 of books) and the 400 of the pagination decorator need @throws JSDoc tags (8 lines): only the handler's own body is scanned, and a decorator alias cannot declare the errors it throws. The 401/403/400/404 coming from guards, @Roles, @Body validation and ParseObjectIdPipe are found automatically.

Differences: [`bench/results/nestoa-main/differences.md`](nestoa-main/differences.md)

### swagger-jsdoc (`variants/swagger-jsdoc`)

- swagger-jsdoc 6.3.0 (latest), called through its CLI on `src/**/*.ts`; no build step. Framework-agnostic: it reads neither the NestJS decorators nor the TypeScript types, it only merges the YAML written after `@openapi` JSDoc tags into `openapi.definition.yaml`.
- The whole document is written by hand, in YAML, beside the code it describes: every operation in the JSDoc of its handler (path relative to a `servers: [{ url: '/v1' }]` entry for the global prefix, parameters, request body, status codes), every DTO, model, interface and enum as a component in the JSDoc of its class. That is most of the 1500 lines.
- Shared pieces live in `openapi.definition.yaml`: the bearer security scheme required by default (`security: []` on the @Unprotected routes), the `shelterId` path parameter, the pagination query parameters of the custom @PaginationParams() decorator, and the `{ code, message, status }` error responses referenced by each operation.
- No equivalent of the mapped types: UpdateShelterDto and UpdateCatDto re-list every property (PartialType), CreateBookDto is ReplaceBookDto plus `isbn` through `allOf` (OmitType inverted); Cat and Dog extend Animal through `allOf`. The @Query() DTOs are documented as one exploded object query parameter.
- The existing JSDoc is not read: operation summaries and property descriptions are copied into the YAML, and class-validator constraints, integers and `email` formats are restated by hand.
- Nothing ties the YAML to the code: a renamed property, a new route or a changed status code is not detected. An invalid YAML fragment is skipped with a message on stderr (the CLI still exits 0: `failOnErrors` is only an option of the Node API) and dangling `$ref`s are not reported.
- YAML anchors, documented to share a fragment between blocks, lose content without any message (exit code 0): an anchor defined and used in the same JSDoc block drops the whole block, and an anchor defined in one block and aliased in another keeps the aliasing block but drops the defining one. Fragments can only be shared through `$ref`.

Differences: [`bench/results/swagger-jsdoc/differences.md`](swagger-jsdoc/differences.md)

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

### tspec (`variants/tspec`)

- tspec 0.2.11 (latest), `tspec generate --nestjs` on the controllers (`specPathGlobs` and the `/v1` server of the global prefix in `tspec.config.json`); no build step, but 15–20 s: it builds two TypeScript programs, one for its own parser and one for typescript-json-schema.
- The CLI writes nothing in NestJS mode when `--outputPath` is left to its default `openapi.json` (the default is turned into `undefined`, exit code 0): the output path is set in `tspec.config.json` instead.
- Success status codes come from the return type only (`void` → 204, anything else → 200): `@HttpCode` is ignored, `@ApiResponse({ status: 201, type })` from @nestjs/swagger (a runtime dependency) is added on the 5 creation routes. `status` must be a numeric literal (`HttpStatus.CREATED` is skipped) and `type` a value, so the `HttpError` and `AdoptionReceipt` interfaces became classes. Handlers without a return type are typed as mongoose `Document<…>`: 3 explicit return types added.
- Error responses are declared with one `@ApiResponse({ status, type: HttpError })` per status and operation (no shared or composed decorator is read), but a type only referenced from `@ApiResponse` is never resolved: the error body is an empty object. For the same reason the pagination envelope cannot be declared (a page class per resource stays empty): paginated routes are documented as the `DataToPaginate<T>` returned by the handler (`resources` + `totalResources`), not the `{ resources, pagination }` built by PaginationBodyInterceptor.
- Only the own properties of a class are read: inheritance (`Cat extends Animal`, `CreateCatDto extends CreateAnimalDto`) and mapped types with extra properties (`UpdateShelterDto`, `UpdateCatDto`) lose the inherited ones. A class without own members (`ReplaceBookDto`) falls back to typescript-json-schema, which resolves it fully. Union return types (`Cat | Dog`) become an empty object, the `'ok'` literal an object.
- Mongo `ObjectId` is expanded as the bson class in bodies, and path/query parameters typed with a class or an enum (`ObjectId` with ParseObjectIdPipe, enums with ParseEnumPipe) get an empty schema. `@Headers('x-request-id')` is emitted with the invalid `in: headers`. `DefaultValuePipe` is not read (`includeAdopted` is required, without default).
- Not expressible: the query parameters read by the custom @PaginationParams() decorator (only @Param/@Query/@Body/@Headers are read), security (no global or per-operation `security`, guards and @Unprotected are ignored), the `text/csv` response of GET /books/export (always `application/json`), and `@param` descriptions.
- class-validator decorators are not read: `@minimum`, `@maximum`, `@minLength`, `@maxLength` and `@format email` JSDoc tags restate them on the DTOs and models. There is no tag for `integer`, `minItems` or `maxItems`, and the tags on inherited properties are lost with them.

Differences: [`bench/results/tspec/differences.md`](tspec/differences.md)

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

### zod-openapi (`variants/zod-openapi`)

- zod-openapi 6.0.2 (latest) with zod 4.6.7, Node 24. The definitions are TypeScript run by ts-node in transpile-only mode (already a dev dependency of the app, it resolves the app's extensionless imports and enums): no build step.
- Framework-agnostic: it reads neither the NestJS controllers nor the class-validator DTOs. Every DTO, model and interface is re-declared as a Zod schema, and every operation (path with the hard-coded `v1` prefix, path/query/header parameters, request body, status codes, error responses, `security: []` on the @Unprotected routes) in a `*.openapi.ts` file per module beside the controllers; the error body, error responses, pagination query parameters and envelope are shared in `src/core/openapi.ts`. Nothing ties these declarations to the controllers or the DTOs.
- The Zod schemas only describe the API: the app keeps validating with class-validator, so each DTO exists twice. Validating with the Zod schemas instead would mean replacing the ValidationPipe and rewriting the DTOs, which the guide forbids.
- Zod covers the patterns of the app without workarounds: `.omit()`, `.partial()` and `.extend()` for PartialType/OmitType and model inheritance, `z.enum()` on the app's TypeScript enums, constraints (`.max()`, `.int()`, `z.email()`…), the optional `x-request-id` header. Descriptions are copied from the JSDoc into `.describe()`.
- Dates and ObjectIds are declared in their JSON form (`z.iso.datetime()`, `z.string()`): `z.date()` renders a plain string without `format`.
- A generic `override` in the generation script removes what Zod adds by itself: the safe-integer `minimum`/`maximum` of `.int()`, the regex `pattern` of `z.email()` and `z.iso.datetime()`, and `additionalProperties: false` on response objects.

Differences: [`bench/results/zod-openapi/differences.md`](zod-openapi/differences.md)

### @asteasolutions/zod-to-openapi (`variants/zod-to-openapi`)

- @asteasolutions/zod-to-openapi 9.1.0 (latest) with zod 4.6.7, both dev dependencies: the Zod schemas are only imported by the generation script, the app keeps validating with class-validator. The script (`src/generate-openapi.ts`) runs through ts-node (transpile-only), no build step: Node's own type stripping handles neither the app's TypeScript enums nor extensionless imports.
- Framework-agnostic: it reads nothing from the NestJS controllers, the DTO classes or their JSDoc. Every route is re-declared with `registry.registerPath` in a `*.openapi.ts` file per module (method, path relative to a `servers: [{ url: '/v1' }]` entry built from `GLOBAL_PREFIX`, params, query, headers, body, responses by status, summary), and every DTO, model and interface is mirrored as a Zod schema there, reusing the app's enums. Nothing keeps them in sync with the controllers or the classes.
- Zod covers what the class-validator decorators with a JSON-schema equivalent express (`.int()`, `.min()`, `.max()`, `.length()`, `z.email()`, array `.min()`/`.max()`), `.optional()`/`.default()`, `.nullable()`, literals and unions; descriptions are copied from the JSDoc with `.describe()`. The mapped types have direct equivalents (`.partial()`, `.omit()`, `.extend()`), and so has the inheritance (`Animal.extend`).
- Shared pieces live in `src/core/openapi.ts`: the registry and its bearer security scheme (required by default, `security: []` on the @Unprotected routes), the pagination query parameters of the custom @PaginationParams() decorator, the pagination envelope of the interceptor, and the `{ code, message, status }` error responses spread into each operation.
- Unlike the other tools describing the API a second time, nothing was out of reach: the optional `x-request-id` header, the `text/csv` export and the 204 responses are plain `registerPath` options. Mongo ObjectIds and Dates are declared as strings (`z.string()`, `z.iso.datetime()`) and the `@internal` `isDeleted` field is simply left out of the response schema.

Differences: [`bench/results/zod-to-openapi/differences.md`](zod-to-openapi/differences.md)

