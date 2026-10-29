# Methodology

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

## The expected document

[`expected/openapi.yaml`](../expected/openapi.yaml) (OpenAPI 3.1) describes what the server really does on the
wire: the `v1` prefix, the pagination envelope added by the interceptor, the error body of the filter,
the `201`/`204`/`200` status codes, the `@internal` fields stripped from responses, ObjectIds and Dates
serialized as strings. Validation constraints are listed only when a class-validator decorator has a direct
JSON-schema equivalent (`IsInt`, `Min`, `Max`, `MinLength`, `MaxLength`, `Length`, `ArrayMinSize`,
`ArrayMaxSize`, `IsEmail`); descriptions only come from JSDoc present in the code.

It is not an opinion: [`app/test/contract.e2e-spec.ts`](../app/test/contract.e2e-spec.ts) boots the app on an
in-memory MongoDB and checks that

- the documented operations are exactly the routes the app serves;
- every response (status, content type, body) matches the document, **with no undocumented property**;
- every documented request constraint is enforced: one invalid request is generated per constraint
  (missing required field, wrong type, out-of-range value, too long string, invalid enum, bad email…) and
  must get a `400`;
- every documented status code (`400`, `401`, `403`, `404`, `409`, success) is observed at least once.

## Ease of use

Each tool gets a variant, `variants/<tool>`: a copy of `app/` annotated the way a team adopting the tool
would, following the tool's documentation, to describe the real API as well as the tool can
(see [`bench/VARIANT_GUIDE.md`](../bench/VARIANT_GUIDE.md)). The app's behaviour must not change: the contract
test passes in every variant. The grade is the diff between the variant and `app/`: files touched, lines
added and removed (sources and configuration, lock files and generated files excluded), dependencies added,
the `node_modules` growth, and the growth of the production dependency tree (`npm ls --omit=dev`): what
ships with the service, where a tool used only at build time weighs nothing.

## Correctness

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

## Speed and memory

Each variant's `bench.json` lists the commands going from the sources to the document — including the
compilation when the tool needs compiled code (`@nestjs/swagger`) — and a `clean` command run before each
run. Each command runs under `/usr/bin/time` (wall time, CPU time, peak RSS of the largest process of the
tree), 5 times by default after a warm-up run. Tools are called directly, not through `npm run`/`npx`.
