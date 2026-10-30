/**
 * node bench/src/cli.ts install [--only a,b]             install every variant
 * node bench/src/cli.ts run [--only a,b] [--runs 5] [--warmup 1] [--skip-perf]
 * node bench/src/cli.ts compare <generated-file>          compare one OpenAPI or AsyncAPI document with the expected one
 * node bench/src/cli.ts check <candidate> [--baseline <file>] [--summary <file.md>]
 *                                                       fail when the candidate has more differences than the baseline
 */
import { appendFileSync, copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { arch, cpus, platform } from 'node:os';
import { extname, join } from 'node:path';
import { parseArgs } from 'node:util';
import { parse } from 'yaml';
import { checkRegression } from './check.ts';
import { isAsyncApi } from './correctness/asyncapi.ts';
import type { Comparison } from './correctness/compare.ts';
import { measureEase } from './ease.ts';
import { runOasdiff } from './oasdiff.ts';
import { measurePerf, runShell } from './perf.ts';
import { renderHtml } from './html.ts';
import { renderDifferences, renderReport } from './report.ts';
import type { BenchResult, VariantResult } from './report.ts';
import { SPECS, specOf } from './specs.ts';
import type { SpecDefinition } from './specs.ts';
import { installedVersion, loadVariants, RESULTS_DIR } from './variants.ts';
import type { Spec, Variant } from './variants.ts';

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    only: { type: 'string' },
    runs: { type: 'string', default: '5' },
    warmup: { type: 'string', default: '1' },
    'skip-perf': { type: 'boolean', default: false },
    baseline: { type: 'string' },
    summary: { type: 'string' },
  },
});

const log = (msg: string): void => {
  process.stderr.write(`${msg}\n`);
};

const readDocument = (file: string): unknown => {
  const text: string = readFileSync(file, 'utf8');

  return extname(file) === '.json' ? JSON.parse(text) : parse(text);
};

const only: string[] | undefined = values.only?.split(',').map((s: string): string => s.trim());

const generateOnce = (variant: Variant): void => {
  for (const command of [variant.config.clean, ...variant.config.steps.map((s) => s.command)]) {
    if (command === undefined) {
      continue;
    }
    const res = runShell(command, variant.dir);
    if (res.status !== 0) {
      throw new Error(`"${command}" failed (exit ${res.status}):\n${res.stdout.slice(-3000)}\n${res.stderr.slice(-3000)}`);
    }
  }
};

/** `previous`: the last result of the variant, whose speed and memory are kept with --skip-perf */
const benchVariant = (variant: Variant, previous?: VariantResult): VariantResult => {
  const spec: Spec = specOf(variant.config);
  const definition: SpecDefinition = SPECS[spec];
  const result: VariantResult = {
    name: variant.name,
    ...(spec === 'openapi' ? {} : { spec }),
    tool: variant.config.tool,
    version: variant.config.version,
    versions: Object.fromEntries(variant.config.packages.map((p: string) => [p, installedVersion(variant.dir, p)])),
    approach: variant.config.approach,
    notes: variant.config.notes ?? [],
  };
  const outDir: string = join(RESULTS_DIR, variant.name);
  mkdirSync(outDir, { recursive: true });

  try {
    if (values['skip-perf']) {
      log('  generating');
      // Kept even if the generation fails, so that the next run can still carry them over
      result.perf = previous?.perf;
      generateOnce(variant);
    } else {
      log('  measuring speed and memory');
      result.perf = measurePerf(variant, Number(values.runs), Number(values.warmup), (m: string) => log(`    ${m}`));
    }

    const outputFile: string = join(variant.dir, variant.config.output);
    if (!existsSync(outputFile)) {
      throw new Error(`${variant.config.output} was not generated`);
    }
    copyFileSync(outputFile, join(outDir, `${spec}${extname(outputFile)}`));

    log('  comparing with the expected document');
    const comparison: Comparison = definition.compare(readDocument(definition.expectedFile), readDocument(outputFile));
    const { differences, ...summary } = comparison;
    result.correctness = summary;
    if (spec === 'openapi') {
      // oasdiff does not apply `servers` to the paths: pass the prefix the comparator applied
      const generated = readDocument(outputFile) as { servers?: { url?: string }[] };
      const serverPrefix: string | undefined = generated.servers?.[0]?.url?.replace(/^[a-z]+:\/\/[^/]+/i, '').replace(/\/$/, '') || undefined;
      result.oasdiff = runOasdiff(definition.expectedFile, outputFile, comparison.addedPrefix ?? serverPrefix);
    }
    writeFileSync(join(outDir, 'differences.md'), renderDifferences(result, differences));
    writeFileSync(join(outDir, 'differences.json'), `${JSON.stringify(differences, null, 2)}\n`);
  } catch (err) {
    result.error = (err as Error).message;
    log(`  FAILED: ${result.error.split('\n')[0]}`);
  }

  log('  measuring the changes to the app');
  result.ease = measureEase(variant);

  return result;
};

const main = (): void => {
  const [command, arg] = positionals;
  const definitionOf = (doc: unknown): SpecDefinition => SPECS[isAsyncApi(doc) ? 'asyncapi' : 'openapi'];
  const compareWithExpected = (doc: unknown): Comparison => {
    const definition: SpecDefinition = definitionOf(doc);

    return definition.compare(readDocument(definition.expectedFile), doc);
  };

  if (command === 'compare') {
    const comparison: Comparison = compareWithExpected(readDocument(arg));
    for (const d of comparison.differences) {
      console.log(`${d.category}: ${d.kind} ${d.key}${d.expected === undefined ? '' : ` expected=${d.expected}`}${d.actual === undefined ? '' : ` actual=${d.actual}`}`);
    }
    console.table(comparison.categories);
    console.log(`core: ${comparison.core.differences} differences, total: ${comparison.total.differences}`);

    return;
  }

  if (command === 'check') {
    const candidate: unknown = readDocument(arg);
    const baseline: Comparison | undefined = values.baseline === undefined ? undefined : compareWithExpected(readDocument(values.baseline));
    const { regressed, markdown } = checkRegression(compareWithExpected(candidate), baseline);
    const verdict: string = regressed
      ? 'More differences with the expected document than the baseline.'
      : baseline === undefined
        ? 'No baseline: differences with the expected document.'
        : 'No regression against the baseline.';
    const report: string = `## NestJS ${definitionOf(candidate).title} generation benchmark\n\n${verdict}\n\n${markdown}\n`;
    console.log(report);
    if (values.summary !== undefined) {
      appendFileSync(values.summary, report);
    }
    process.exitCode = regressed ? 1 : 0;

    return;
  }

  const variants: Variant[] = loadVariants(only);
  if (variants.length === 0) {
    throw new Error('No variant found in variants/');
  }

  if (command === 'install') {
    for (const variant of variants) {
      log(`Installing ${variant.name}`);
      const res = runShell(existsSync(join(variant.dir, 'package-lock.json')) ? 'npm ci --no-audit --no-fund' : 'npm install --no-audit --no-fund', variant.dir);
      if (res.status !== 0) {
        log(res.stderr);
        throw new Error(`npm install failed for ${variant.name}`);
      }
    }

    return;
  }

  if (command !== 'run') {
    throw new Error(`Unknown command "${command}" (install, run or compare)`);
  }

  const resultsFile: string = join(RESULTS_DIR, 'results.json');
  const last: BenchResult | undefined = existsSync(resultsFile) ? (JSON.parse(readFileSync(resultsFile, 'utf8')) as BenchResult) : undefined;
  const previous: VariantResult[] = last?.variants ?? [];
  const bench: BenchResult = {
    date: new Date().toISOString(),
    // Without perf, the speed and memory kept from the last run were measured on its machine
    machine:
      values['skip-perf'] && last !== undefined
        ? last.machine
        : { platform: platform(), arch: arch(), cpus: `${cpus().length} × ${cpus()[0]?.model}`, node: process.version },
    variants: [],
  };
  // Keep the results of the variants that are not re-run
  if (only !== undefined) {
    bench.variants = previous.filter((r: VariantResult): boolean => !only.includes(r.name));
  }

  for (const variant of variants) {
    log(`${variant.name} (${variant.config.tool})`);
    bench.variants.push(benchVariant(variant, previous.find((r: VariantResult): boolean => r.name === variant.name)));
  }
  bench.variants.sort((a: VariantResult, b: VariantResult): number => a.name.localeCompare(b.name));

  mkdirSync(RESULTS_DIR, { recursive: true });
  writeFileSync(resultsFile, `${JSON.stringify(bench, null, 2)}\n`);
  writeFileSync(join(RESULTS_DIR, 'REPORT.md'), renderReport(bench));
  writeFileSync(join(RESULTS_DIR, 'report.html'), renderHtml(bench));
  log(`Report written to ${join(RESULTS_DIR, 'REPORT.md')}`);
};

main();
