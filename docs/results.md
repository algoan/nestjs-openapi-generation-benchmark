# Results

The table is in the [README](../README.md#results-at-a-glance); the full report, per category and per tool,
is [`bench/results/REPORT.md`](../bench/results/REPORT.md) (and the charts in `bench/results/report.html`).

Run on an Apple M4, Node 24 (5 measured runs after one warm-up). Lower is better everywhere.

## What the numbers say

- **There is a clear trade-off between effort and correctness.** The published tools that reach (near) zero
  differences — tsoa, ts-oas, @nestjs/swagger, nestia, zod-openapi, zod-to-openapi, swagger-jsdoc — get there by
  describing the API a second time (decorators, JSDoc tags, hand-written endpoint types, Zod schemas or YAML:
  170 to 1505 lines). Every one of those lines can drift from the code.
- **nestoa needs the fewest changes by far** (30–33 lines, no source annotation besides 3 return types and
  a few `@throws` tags) and is **one to two orders of magnitude faster and lighter** than every Node-based
  tool that reads the TypeScript code: 16–226× faster and 9–15× lighter for 0.2.1, 41–580× faster and 52–88×
  lighter for main (the upper bounds are tspec's). It matches the expected document exactly: the query parameters read by
  `@PaginationParams()` and the error body are declared in its configuration, and class-validator
  constraints are read from the DTOs. swagger-jsdoc, which reads only comments, is 2× slower and 1.7× heavier
  than nestoa 0.2.1 (5× and 10× than main); zod-openapi and zod-to-openapi, which only transpile and run their
  definitions, are 4× slower and 3× heavier (11× and 19× than main).
- **Generation-only tools ship nothing to production.** nestoa, nest-openapi-gen, ts-oas, swagger-jsdoc,
  zod-openapi and zod-to-openapi are dev dependencies (nestoa main is a standalone binary): 0 MB in the service's
  production install. The tools whose decorators run with the app add to it: +22 MB for @nestjs/swagger (and for
  tspec, which reads its `@ApiResponse`), +29 MB for typoa, +31 MB for nestjs-zod, +44 MB for tsoa, +71 MB for
  nestia (tsoa and nestia pull `typescript` into the production dependencies).
- **The published nestoa 0.2.1 has caught up with its main branch** (main@00c0442 is the v0.2.1 release):
  security, `@nestjs/mapped-types` helpers, `text/csv`, `HttpStatus.*` members, custom decorators' query
  parameters and class-validator constraints, missing from 0.1.7 (149 core differences), are all supported.
  It generates the same document as main; its 3 extra lines are the dependency and the `.npmrc` of
  GitHub Packages. It is only slower and heavier because `node_modules/.bin/nestoa` is a Node launcher
  that spawns the native binary: Node accounts for about 30 ms and 38 MB, the binary alone measures like
  main (10–20 ms, 8 MB).
- **@nestjs/swagger** is the most correct with moderate effort, thanks to its CLI plugin, but needs a build
  (`nest build`) and boots the app, which makes it, with nestia, the slowest pipeline after tspec.
- **nestjs-zod** is @nestjs/swagger with Zod request DTOs: it keeps the whole setup of the @nestjs/swagger
  variant and rewrites the 11 class-validator DTOs as Zod schemas (`createZodDto`, `ZodValidationPipe`), for
  519 more lines (689). Zod gets the integer types, `maxItems` and nested schemas of the request bodies right,
  but keeping the app's validation costs correctness: Zod cannot accept `null` (which `@IsOptional()` lets
  through) without documenting every optional field as nullable, and a nullable boolean comes out as an array
  (51 core differences, 45 of them `nullable`). Zod has no ISBN, country or phone validator, counts variation
  selectors in string lengths, rejects unsafe integers and cannot document `z.date()`: class-validator's functions
  and `Number.isInteger` stay in `.refine()` calls. Same build-and-boot pipeline, same speed.
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
  Zod schema and every route re-declared with `registry.registerPath` (610 lines). Same zero differences, same
  speed and memory, same drift: nothing ties the Zod schemas to the DTOs they mirror.
- **tspec** reads the NestJS controllers itself (`--nestjs`), but only the standard decorators and the own
  properties of classes: inheritance, mapped types, `Cat | Dog`, `ObjectId`s, `@HttpCode`, the parameters of
  `@PaginationParams()`, security and the pagination envelope are out of reach, and an `@ApiResponse` type is
  only resolved when a handler signature already uses it (the error body comes out empty). With 153 lines
  (`@ApiResponse` status codes, JSDoc constraint tags) it still has 1023 core differences, and it is the
  slowest tool: 11 s and 705 MB, as it builds two TypeScript programs.
- **nest-openapi-gen** (unmaintained since 2024) crashes on this codebase without patching and lowers
  Mongo `ObjectId`s into objects; not a realistic option.
- **nestia** latest (12–14) requires TypeScript 7; 11.3.4 was used, with ts-patch.

## AsyncAPI: what the numbers say

- **nestoa reads the events from the code**: the `@EventPattern` handlers (literal, enum member, array of
  topics, `@Payload('key')` parameters) and the `ClientProxy.emit` calls of the services, with their payload
  inferred from the declared types, and the handlers' JSDoc as summaries. One configuration key and one type
  argument (`emit<void, Book>`, as Mongoose's `HydratedDocument` is not unwrapped) give 0 differences in 6 lines,
  in 17 ms and 8 MB. It is not released yet (pull request #76).
- **nestjs-asyncapi and its fork @nmime/nestjs-asyncapi** reach 0 core differences, but every topic, action and
  payload class is written a second time in a decorator beside `@EventPattern` or on the emitting service method
  (74–75 lines), the event interfaces become classes for `@nestjs/swagger`'s plugin, and the handlers' JSDoc is
  copied into `summary` options. Nothing checks that a decorator matches the handler or the `emit` call it
  annotates. They boot the app after a `nest build` (2.3–2.8 s, 517 MB), pin `@nestjs/swagger` to 11.4.2 (their
  deep imports break with its later `exports` map), and ship `@asyncapi/generator` with the service: +450–490 MB
  of production dependencies. nestjs-asyncapi also needed `ajv` 8.20 instead of the app's 8.17.
- **asyncapi-decorators** (unmaintained since 2022, AsyncAPI 2.0) needs an `@ApiProperty` on every payload property,
  models included, and cannot mark a property as required: its 33 differences are all `required`.
- **zod-sockets** documents Socket.IO, not Pub/Sub topics: every event is an operation on the namespace channel `/`,
  each payload is a tuple of arguments, and summaries are generated. Nothing matches the expected document,
  whatever the mapping (a namespace per topic gives `/<topic>` addresses and the same score).
- `underfisk/nestjs-asyncapi` could not be benchmarked (see [tools](tools.md#skipped-tools)), and the DIY pattern of
  an AsyncAPI document hand-written around `@nestjs/swagger` schemas is what nestjs-asyncapi packages.

## Reading the numbers

Correctness is a **ceiling**: each variant was iterated against the comparator until the tool could not express
more without unreasonable effort, so "differences" measure what a tool *can* express, and "lines changed"
measure what it costs to get there.
