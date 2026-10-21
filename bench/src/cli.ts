/**
 * node bench/src/cli.ts install [--only a,b]             install every variant
 * node bench/src/cli.ts run [--only a,b] [--runs 5] [--warmup 1] [--skip-perf]
 * node bench/src/cli.ts compare <generated-openapi-file>  compare one document with the expected one
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { arch, cpus, platform } from 'node:os';
import { extname, join } from 'node:path';
import { parseArgs } from 'node:util';
import { parse } from 'yaml';
import { compareDocuments } from './correctness/compare.ts';
import type { Comparison } from './correctness/compare.ts';
import { measureEase } from './ease.ts';
import { runOasdiff } from './oasdiff.ts';
import { measurePerf, runShell } from './perf.ts';
import { renderDifferences, renderReport } from './report.ts';
import type { BenchResult, VariantResult } from './report.ts';
import { EXPECTED_FILE, installedVersion, loadVariants, RESULTS_DIR } from './variants.ts';
import type { Variant } from './variants.ts';

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    only: { type: 'string' },
    runs: { type: 'string', default: '5' },
    warmup: { type: 'string', default: '1' },
    'skip-perf': { type: 'boolean', default: false },
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

const benchVariant = (variant: Variant, expected: unknown): VariantResult => {
  const result: VariantResult = {
    name: variant.name,
    tool: variant.config.tool,
    versions: Object.fromEntries(variant.config.packages.map((p: string) => [p, installedVersion(variant.dir, p)])),
    approach: variant.config.approach,
    notes: variant.config.notes ?? [],
  };
  const outDir: string = join(RESULTS_DIR, variant.name);
  mkdirSync(outDir, { recursive: true });

  try {
    if (values['skip-perf']) {
      log('  generating');
      generateOnce(variant);
    } else {
      log('  measuring speed and memory');
      result.perf = measurePerf(variant, Number(values.runs), Number(values.warmup), (m: string) => log(`    ${m}`));
    }

    const outputFile: string = join(variant.dir, variant.config.output);
    if (!existsSync(outputFile)) {
      throw new Error(`${variant.config.output} was not generated`);
    }
    copyFileSync(outputFile, join(outDir, `openapi${extname(outputFile)}`));

    log('  comparing with the expected document');
    const comparison: Comparison = compareDocuments(expected, readDocument(outputFile));
    const { differences, ...summary } = comparison;
    result.correctness = summary;
    result.oasdiff = runOasdiff(EXPECTED_FILE, outputFile, comparison.addedPrefix);
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
  const expected: unknown = readDocument(EXPECTED_FILE);

  if (command === 'compare') {
    const comparison: Comparison = compareDocuments(expected, readDocument(arg));
    console.table(comparison.categories);
    console.log(`core: ${comparison.core.differences} differences, total: ${comparison.total.differences}`);

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

  const bench: BenchResult = {
    date: new Date().toISOString(),
    machine: { platform: platform(), arch: arch(), cpus: `${cpus().length} × ${cpus()[0]?.model}`, node: process.version },
    variants: [],
  };
  // Keep the results of the variants that are not re-run
  const resultsFile: string = join(RESULTS_DIR, 'results.json');
  if (only !== undefined && existsSync(resultsFile)) {
    const previous: BenchResult = JSON.parse(readFileSync(resultsFile, 'utf8'));
    bench.variants = previous.variants.filter((r: VariantResult): boolean => !only.includes(r.name));
  }

  for (const variant of variants) {
    log(`${variant.name} (${variant.config.tool})`);
    bench.variants.push(benchVariant(variant, expected));
  }
  bench.variants.sort((a: VariantResult, b: VariantResult): number => a.name.localeCompare(b.name));

  mkdirSync(RESULTS_DIR, { recursive: true });
  writeFileSync(resultsFile, `${JSON.stringify(bench, null, 2)}\n`);
  writeFileSync(join(RESULTS_DIR, 'REPORT.md'), renderReport(bench));
  log(`Report written to ${join(RESULTS_DIR, 'REPORT.md')}`);
};

main();
