# Tools

## Benchmarked OpenAPI tools

| Tool | Approach |
| --- | --- |
| [`@nestjs/swagger`](https://docs.nestjs.com/openapi/introduction) | runtime: reflection metadata + CLI plugin, the app is booted |
| [`nestjs-zod`](https://github.com/BenLorantfy/nestjs-zod) | runtime: Zod DTOs, documented through `@nestjs/swagger`, the app is booted |
| [`nest-openapi-gen`](https://github.com/yantrab/nest-openapi-gen) | static: ts-morph over the controllers |
| [`@nestia/sdk`](https://nestia.io/docs/swagger/) | static: TypeScript compiler API |
| [`tsoa`](https://tsoa-community.github.io/docs/) | static: its own decorators + TypeScript compiler API |
| [`typoa`](https://github.com/Eywek/typoa) | static: its own decorators + ts-morph |
| [`ts-oas`](https://github.com/ts-oas/ts-oas) | static: endpoint descriptions written as TypeScript types |
| [`swagger-jsdoc`](https://github.com/Surnet/swagger-jsdoc) | static: the document written by hand as YAML in `@openapi` JSDoc blocks |
| [`zod-openapi`](https://github.com/samchungy/zod-openapi) | static: operations and Zod schemas declared in TypeScript, run as a script |
| [`@asteasolutions/zod-to-openapi`](https://github.com/asteasolutions/zod-to-openapi) | static: routes and Zod schemas declared in a registry, run by a script |
| [`tspec`](https://github.com/ts-spec/tspec) | static: TypeScript compiler API over the controllers (`--nestjs`) + typescript-json-schema |
| [`nestoa`](https://github.com/algoan/nestoa) | static: Rust parser of the TypeScript sources |

## Benchmarked AsyncAPI tools

They document the app's Pub/Sub events (see [methodology](methodology.md#the-expected-asyncapi-document)).

| Tool | Approach |
| --- | --- |
| [`nestjs-asyncapi`](https://github.com/flamewow/nestjs-asyncapi) (flamewow) | runtime: `@AsyncApiReceive`/`@AsyncApiSend` decorators, payload classes read through `@nestjs/swagger`, the app is booted |
| [`@nmime/nestjs-asyncapi`](https://github.com/nmime/nestjs-asyncapi) | runtime: fork of the above (`@AsyncApiSub`/`@AsyncApiPub`), the app is booted |
| [`asyncapi-decorators`](https://www.npmjs.com/package/asyncapi-decorators) | runtime: generic `@ApiChannel`/`@ApiMessage`/`@ApiProperty` decorators, AsyncAPI 2.0 |
| [`zod-sockets`](https://github.com/RobinTail/zod-sockets) | static: Socket.IO actions and emission declared with Zod beside the app, run as a script |
| [`nestoa`](https://github.com/algoan/nestoa) (unreleased, [#76](https://github.com/algoan/nestoa/pull/76)) | static: the same Rust analysis as for OpenAPI, over `@EventPattern` handlers and `ClientProxy.emit` calls |

Not benchmarked: an AsyncAPI document hand-written around the component schemas of the
`@nestjs/swagger` OpenAPI document (a common pattern). Its channels and operations would be written by hand,
which the [guide](../bench/VARIANT_GUIDE.md) forbids, and `nestjs-asyncapi` is that pattern packaged:
`@nestjs/swagger` schemas plus one decorator per operation.

## Skipped tools

Every TypeScript tool we looked at that could plausibly produce the OpenAPI or AsyncAPI document of a NestJS service
is either benchmarked above or listed here with the reason it was not. Tools that are not for TypeScript
(e.g. utoipa for Rust) and tools that only consume an existing OpenAPI document (oasdiff, Spectral, Redoc,
openapi-generator…) are left out on purpose. Versions and dates are the latest npm releases, checked in
October 2026.

| Tool | What it is | Status | Reason |
| --- | --- | --- | --- |
| [`ts-to-openapi`](https://github.com/grantila/ts-to-openapi) 1.3.0 (Feb. 2021) | converts TypeScript types into OpenAPI schema components | skipped | Schemas only: it has no way to describe paths, operations or parameters, so they would be written directly in the output document, which the [guide](../bench/VARIANT_GUIDE.md) forbids. Its README says it is not heavily maintained and will be replaced by typeconv; no release since 1.3.0. |
| [`typeconv`](https://github.com/grantila/typeconv) 2.3.1 (June 2023) | converts types between TypeScript, JSON Schema, OpenAPI, GraphQL and SureType | skipped | Same problem: schemas only, with no way to describe operations. No commit or release since 2.3.1. |
| [`next-swagger-doc`](https://github.com/jellydn/next-swagger-doc) 0.5.0 (Aug. 2026) | swagger-jsdoc wrapper for Next.js API routes | skipped | Adds nothing over swagger-jsdoc, which is benchmarked, for a NestJS app: same `@openapi` JSDoc parsing, scoped to a Next.js `apiFolder`. |
| [`nest-sdk-generator`](https://github.com/lonestone/nest-sdk-generator) (Lonestone) 1.1.3 (Nov. 2022) | generates a typed client SDK from NestJS controllers | skipped | Generates a client SDK, not an OpenAPI document (its README: it "doesn't generate a documentation by itself"). Last commit November 2022. |
| [`@matchbook-lab/nest-sdk-generator`](https://github.com/MatchbookLab/nest-sdk-generator) 0.2.1 (Oct. 2019) | generates an Angular client service from NestJS controllers | skipped | Generates a client, not an OpenAPI document. Last commit March 2020. |
| [`@compodoc/compodoc`](https://github.com/compodoc/compodoc) 2.0.0 (June 2026) | HTML documentation of Angular, NestJS and Stencil code | skipped | Documents the code structure (modules, classes, routes) as HTML; it has no OpenAPI output. |
| [`underfisk/nestjs-asyncapi`](https://github.com/underfisk/nestjs-asyncapi) (May 2022) | AsyncAPI module for NestJS, the project `nestjs-asyncapi` was forked from | skipped | Never published to npm, and its repository has no build output nor `prepare` script: installing it from GitHub gives a package that cannot be loaded without building it by hand. It requires NestJS 8 (`^8.4.4`) and `reflect-metadata` 0.1. |
| [`openapi3-ts`](https://github.com/metadevpro/openapi3-ts) 4.6.2 (Oct. 2026) | typed model and builder of OpenAPI 3.0/3.1/3.2 documents | skipped | Nothing is generated or read from the code: the whole document is written by hand as typed objects. That is swagger-jsdoc's approach, which is benchmarked, without even reading the descriptions from beside the handlers. |
| [`ts-rest`](https://github.com/ts-rest/ts-rest) 3.52.1 (March 2025) | contract-first typed REST client and server, with `@ts-rest/nest` and `@ts-rest/open-api` | skipped | No longer maintained: its README says so and the repository was archived in October 2026. |
| [`@typespec/compiler`](https://github.com/microsoft/typespec) 1.17.0 (Oct. 2026) | API description language compiled to OpenAPI | skipped | The API is described by hand in `.tsp` files, separate from the code: design-first, the same as writing the document by hand. |
| [LoopBack 4](https://github.com/loopbackio/loopback-next) (`@loopback/rest` 16.0.0, Oct. 2026), [tRPC](https://github.com/trpc/trpc) (`@trpc/server` 11.22.1 + [`trpc-to-openapi`](https://github.com/mcampa/trpc-to-openapi) 3.3.3, Oct. 2026), [`@hono/zod-openapi`](https://github.com/honojs/middleware/tree/main/packages/zod-openapi) 1.6.3 (Sept. 2026), [`express-zod-api`](https://github.com/RobinTail/express-zod-api) 29.8.2 (Sept. 2026) | web frameworks that generate (or, with a plugin, can generate) an OpenAPI document | skipped | Only for apps written with their own framework: using them means rewriting the app, which the guide forbids. |
