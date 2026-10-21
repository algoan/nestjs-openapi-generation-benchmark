/**
 * Speed and memory: wall time, CPU time and peak RSS of the commands producing the document.
 *
 * Each command runs under `/usr/bin/time` (`-l` on macOS, `-v` on Linux). The reported RSS is the
 * peak resident set size of the largest process of the command's process tree.
 */
import { spawnSync } from 'node:child_process';
import { platform } from 'node:os';
import type { Step, Variant } from './variants.ts';

export interface Sample {
  wallMs: number;
  cpuMs: number;
  maxRssMb: number;
}

export interface Stats {
  median: number;
  mean: number;
  min: number;
  max: number;
  stddev: number;
}

export interface StepResult {
  name: string;
  command: string;
  wallMs: Stats;
  cpuMs: Stats;
  maxRssMb: Stats;
}

export interface PerfResult {
  runs: number;
  steps: StepResult[];
  /** Whole pipeline (sum of the steps' wall/CPU time, max of their RSS) */
  total: { wallMs: Stats; cpuMs: Stats; maxRssMb: Stats };
}

const IS_MAC: boolean = platform() === 'darwin';

export const stats = (values: number[]): Stats => {
  const sorted: number[] = [...values].sort((a: number, b: number): number => a - b);
  const mean: number = values.reduce((a: number, b: number): number => a + b, 0) / values.length;
  const middle: number = Math.floor(sorted.length / 2);

  return {
    median: sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle],
    mean,
    min: sorted[0],
    max: sorted[sorted.length - 1],
    stddev: Math.sqrt(values.reduce((acc: number, v: number): number => acc + (v - mean) ** 2, 0) / values.length),
  };
};

export const runShell = (command: string, cwd: string): { status: number; stdout: string; stderr: string } => {
  const res = spawnSync('sh', ['-c', command], { cwd, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

  return { status: res.status ?? 1, stdout: res.stdout, stderr: res.stderr };
};

const measure = (step: Step, cwd: string): Sample => {
  const args: string[] = IS_MAC ? ['-l', 'sh', '-c', step.command] : ['-v', 'sh', '-c', step.command];
  const start: bigint = process.hrtime.bigint();
  const res = spawnSync('/usr/bin/time', args, { cwd, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const wallMs: number = Number(process.hrtime.bigint() - start) / 1e6;
  if (res.status !== 0) {
    throw new Error(`"${step.command}" failed in ${cwd} (exit ${res.status}):\n${res.stdout}\n${res.stderr}`);
  }
  const out: string = res.stderr;

  if (IS_MAC) {
    // "        1.23 real         0.98 user         0.20 sys" + "  123456789  maximum resident set size"
    const user: number = Number(/([\d.]+)\s+user/.exec(out)?.[1] ?? 0);
    const sys: number = Number(/([\d.]+)\s+sys/.exec(out)?.[1] ?? 0);
    const rss: number = Number(/(\d+)\s+maximum resident set size/.exec(out)?.[1] ?? 0);

    return { wallMs, cpuMs: (user + sys) * 1000, maxRssMb: rss / 1024 / 1024 };
  }
  const user: number = Number(/User time \(seconds\): ([\d.]+)/.exec(out)?.[1] ?? 0);
  const sys: number = Number(/System time \(seconds\): ([\d.]+)/.exec(out)?.[1] ?? 0);
  const rssKb: number = Number(/Maximum resident set size \(kbytes\): (\d+)/.exec(out)?.[1] ?? 0);

  return { wallMs, cpuMs: (user + sys) * 1000, maxRssMb: rssKb / 1024 };
};

export const measurePerf = (variant: Variant, runs: number, warmup: number, log: (msg: string) => void): PerfResult => {
  const samples: Sample[][] = variant.config.steps.map((): Sample[] => []);

  for (let run: number = -warmup; run < runs; run++) {
    if (variant.config.clean !== undefined) {
      const res = runShell(variant.config.clean, variant.dir);
      if (res.status !== 0) {
        throw new Error(`clean command failed for ${variant.name}: ${res.stderr}`);
      }
    }
    variant.config.steps.forEach((step: Step, i: number): void => {
      const sample: Sample = measure(step, variant.dir);
      if (run >= 0) {
        samples[i].push(sample);
      }
    });
    log(run < 0 ? 'warmup' : `run ${run + 1}/${runs}`);
  }

  const totals: Sample[] = samples[0].map(
    (_: Sample, run: number): Sample => ({
      wallMs: samples.reduce((acc: number, s: Sample[]): number => acc + s[run].wallMs, 0),
      cpuMs: samples.reduce((acc: number, s: Sample[]): number => acc + s[run].cpuMs, 0),
      maxRssMb: Math.max(...samples.map((s: Sample[]): number => s[run].maxRssMb)),
    }),
  );
  const toStats = (list: Sample[]) => ({
    wallMs: stats(list.map((s: Sample): number => s.wallMs)),
    cpuMs: stats(list.map((s: Sample): number => s.cpuMs)),
    maxRssMb: stats(list.map((s: Sample): number => s.maxRssMb)),
  });

  return {
    runs,
    steps: variant.config.steps.map((step: Step, i: number): StepResult => ({ ...step, ...toStats(samples[i]) })),
    total: toStats(totals),
  };
};
