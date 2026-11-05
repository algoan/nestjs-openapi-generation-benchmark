# NestJS OpenAPI generation benchmark

Which tool should generate the OpenAPI document of a NestJS service, and the AsyncAPI document of its
Pub/Sub events? This repository compares the main candidates on one realistic codebase, on three grades:

1. **Ease of use**: how many lines of the codebase have to change to get a document out of the tool;
2. **Correctness**: how many differences there are between the generated document and the expected one;
3. **Speed and memory**: how long it takes and how much memory it needs to go from the sources to the document.

See [`docs/methodology.md`](docs/methodology.md) for how each grade is measured, and
[`docs/tools.md`](docs/tools.md) for the tools compared and the ones left out.

## Results at a glance

Run on an Apple M4, Node 24 (5 measured runs after one warm-up). Lower is better everywhere.

### OpenAPI

| Tool | Version | Lines changed | Core differences | All differences | Time (median) | Peak RSS |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| nestoa (unreleased main) | main@00c0442 | **30** | **0** | **0** | **19 ms** | **8 MB** |
| nestoa | 0.2.1 | 33 | **0** | **0** | 48 ms | 47 MB |
| nest-openapi-gen | 1.0.20 (patched) | 92 | 1246 | 2394 | 2.51 s | 424 MB |
| tspec | 0.2.11 | 153 | 1023 | 1717 | 10.84 s | 705 MB |
| @nestjs/swagger | 11.4.7 | 170 | **0** | 22 | 2.74 s | 509 MB |
| typoa | 1.0.0-alpha.70 | 283 | 8 | 304 | 898 ms | 443 MB |
| @nestia/sdk | 11.3.4 | 291 | 10 | 92 | 2.94 s | 674 MB |
| tsoa | 6.6.0 | 300 | **0** | **0** | 792 ms | 415 MB |
| ts-oas | 0.6.1 | 513 | 3 | 4 | 816 ms | 430 MB |
| zod-openapi | 6.0.2 | 574 | **0** | **0** | 205 ms | 155 MB |
| @asteasolutions/zod-to-openapi | 9.1.0 | 610 | **0** | **0** | 204 ms | 153 MB |
| nestjs-zod | 5.5.0 | 689 | 51 | 64 | 2.38 s | 538 MB |
| swagger-jsdoc | 6.3.0 | 1505 | **0** | **0** | 94 ms | 78 MB |

### AsyncAPI

The Pub/Sub events of the same app: 4 `@EventPattern` topics received, 3 topics published with `ClientProxy.emit`.

| Tool | Version | Lines changed | Core differences | All differences | Time (median) | Peak RSS |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| nestoa (unreleased AsyncAPI) | pr-76@f79b1a0 | **6** | **0** | **0** | **17 ms** | **8 MB** |
| @nmime/nestjs-asyncapi | 2.0.9 | 80 | **0** | 1 | 2.39 s | 517 MB |
| nestjs-asyncapi | 2.0.1 | 82 | **0** | 1 | 2.82 s | 517 MB |
| asyncapi-decorators | 1.1.3 | 103 | 33 | 33 | 408 ms | 226 MB |
| zod-sockets | 7.0.1 | 117 | 131 | 165 | 239 ms | 157 MB |

Details: [`docs/results.md`](docs/results.md) and [`bench/results/REPORT.md`](bench/results/REPORT.md).

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
- `nestoa (unreleased AsyncAPI)` is built the same way from the commit of nestoa's main branch that merged
  its AsyncAPI generation ([algoan/nestoa#76](https://github.com/algoan/nestoa/pull/76)). `expected/asyncapi.yaml` was written
  by the same authors; like the OpenAPI one, it is checked against the running app by a contract test, not
  against a tool's output.
- Timings vary between sessions (up to ~2× for the slowest Node tools); the ranking does not change.

## Documentation

- [Tools](docs/tools.md): the benchmarked tools, their approach, and the skipped ones
- [Results](docs/results.md): what the numbers say
- [Methodology](docs/methodology.md): the app, the expected document, and how each grade is measured
- [Development](docs/development.md): layout, quick start, keeping nestoa up to date, adding a tool
