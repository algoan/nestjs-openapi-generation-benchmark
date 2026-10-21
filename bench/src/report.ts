import { CATEGORIES } from './correctness/compare.ts';
import type { Category, Comparison, Difference } from './correctness/compare.ts';
import type { EaseResult } from './ease.ts';
import type { OasdiffResult } from './oasdiff.ts';
import type { PerfResult } from './perf.ts';
import type { VariantConfig } from './variants.ts';

export interface VariantResult {
  name: string;
  tool: string;
  versions: Record<string, string | undefined>;
  approach: VariantConfig['approach'];
  notes: string[];
  error?: string;
  ease?: EaseResult;
  correctness?: Omit<Comparison, 'differences'>;
  oasdiff?: OasdiffResult;
  perf?: PerfResult;
}

export interface BenchResult {
  date: string;
  machine: { platform: string; arch: string; cpus: string; node: string };
  variants: VariantResult[];
}

const pct = (part: number, whole: number): string => (whole === 0 ? '–' : `${((100 * part) / whole).toFixed(1)}%`);
const ms = (value: number): string => (value >= 1000 ? `${(value / 1000).toFixed(2)} s` : `${Math.round(value)} ms`);
const mb = (value: number): string => `${Math.round(value)} MB`;
const dash = (value: unknown): string => (value === undefined || value === null ? '–' : String(value));

const table = (header: string[], rows: string[][]): string =>
  [
    `| ${header.join(' | ')} |`,
    `| ${header.map((h: string, i: number): string => (i === 0 ? '---' : '---:')).join(' | ')} |`,
    ...rows.map((row: string[]): string => `| ${row.join(' | ')} |`),
  ].join('\n');

const rankBy = (results: VariantResult[], value: (r: VariantResult) => number | undefined): Map<string, number> => {
  const sorted: VariantResult[] = results
    .filter((r: VariantResult): boolean => value(r) !== undefined)
    .sort((a: VariantResult, b: VariantResult): number => (value(a) as number) - (value(b) as number));

  return new Map(sorted.map((r: VariantResult, i: number): [string, number] => [r.name, i + 1]));
};

const medal = (rank: number | undefined): string => (rank === undefined ? '' : ` (#${rank})`);

const version = (r: VariantResult): string =>
  Object.values(r.versions)
    .filter((v?: string): boolean => v !== undefined)
    .slice(0, 1)
    .join('') || '?';

export const renderReport = (bench: BenchResult): string => {
  const ok: VariantResult[] = bench.variants.filter((r: VariantResult): boolean => r.error === undefined);
  const easeRank = rankBy(ok, (r) => r.ease?.linesChanged);
  const coreRank = rankBy(ok, (r) => r.correctness?.core.differences);
  const totalRank = rankBy(ok, (r) => r.correctness?.total.differences);
  const speedRank = rankBy(ok, (r) => r.perf?.total.wallMs.median);
  const memRank = rankBy(ok, (r) => r.perf?.total.maxRssMb.median);

  const lines: string[] = [];
  lines.push('# NestJS OpenAPI generators benchmark', '');
  lines.push(
    `Generated on ${bench.date} — ${bench.machine.cpus}, ${bench.machine.platform}/${bench.machine.arch}, Node ${bench.machine.node}.`,
    '',
    'Lower is better everywhere; `(#n)` is the rank among the tools. See the README for the methodology.',
    '',
  );

  lines.push('## Summary', '');
  lines.push(
    table(
      ['Tool', 'Version', 'Approach', 'Lines changed', 'Core differences', 'All differences', 'Time (median)', 'Peak RSS'],
      bench.variants.map((r: VariantResult): string[] =>
        r.error !== undefined
          ? [`**${r.tool}**`, version(r), r.approach, 'failed', '–', '–', '–', '–']
          : [
              `**${r.tool}**`,
              version(r),
              r.approach,
              `${dash(r.ease?.linesChanged)}${medal(easeRank.get(r.name))}`,
              `${dash(r.correctness?.core.differences)}${medal(coreRank.get(r.name))}`,
              `${dash(r.correctness?.total.differences)}${medal(totalRank.get(r.name))}`,
              r.perf ? `${ms(r.perf.total.wallMs.median)}${medal(speedRank.get(r.name))}` : '–',
              r.perf ? `${mb(r.perf.total.maxRssMb.median)}${medal(memRank.get(r.name))}` : '–',
            ],
      ),
    ),
    '',
  );
  lines.push(
    '- **Lines changed**: lines added + removed in the app (sources and configuration) to generate the document.',
    '- **Core differences**: operations, parameters, request bodies and success responses (what a generated client relies on).',
    '- **All differences**: core + error responses, validation constraints, security and documentation.',
    '- **Time / Peak RSS**: the whole pipeline from the sources to the document (build step included when the tool needs one).',
    '',
  );

  lines.push('## 1. Ease of use', '');
  lines.push(
    table(
      ['Tool', 'Files touched', 'Files added', 'Source files touched', 'Source lines', 'Config lines', 'Total lines', 'Deps added', 'node_modules Δ'],
      ok.map((r: VariantResult): string[] => {
        const e: EaseResult | undefined = r.ease;

        return e === undefined
          ? [r.tool, '–', '–', '–', '–', '–', '–', '–', '–']
          : [
              r.tool,
              String(e.filesTouched),
              String(e.filesAdded),
              `${e.sourceFilesTouched} / ${e.sourceFilesTotal}`,
              String(e.sourceLinesChanged),
              String(e.configLinesChanged),
              `+${e.linesAdded} −${e.linesRemoved}`,
              e.dependenciesAdded.length === 0 ? '–' : e.dependenciesAdded.map((d: string): string => `\`${d}\``).join(', '),
              e.installFootprintMb === undefined ? '–' : `${e.installFootprintMb >= 0 ? '+' : ''}${mb(e.installFootprintMb)}`,
            ];
      }),
    ),
    '',
  );

  lines.push('## 2. Correctness', '');
  lines.push('Differences (missing + mismatching + extra facts) per category, against `expected/openapi.yaml`:', '');
  lines.push(
    table(
      ['Tool', ...CATEGORIES, 'core', 'total', 'expected facts matched'],
      ok.map((r: VariantResult): string[] => {
        const c = r.correctness;

        return c === undefined
          ? [r.tool, ...CATEGORIES.map((): string => '–'), '–', '–', '–']
          : [
              r.tool,
              ...CATEGORIES.map((cat: Category): string => String(c.categories[cat].differences)),
              `**${c.core.differences}**`,
              `**${c.total.differences}**`,
              pct(c.total.matched, c.total.expected),
            ];
      }),
    ),
    '',
  );
  lines.push('Recall (share of the expected facts found) per category:', '');
  lines.push(
    table(
      ['Tool', ...CATEGORIES],
      ok.map((r: VariantResult): string[] => [
        r.tool,
        ...CATEGORIES.map((cat: Category): string =>
          r.correctness ? pct(r.correctness.categories[cat].matched, r.correctness.categories[cat].expected) : '–',
        ),
      ]),
    ),
    '',
  );
  if (ok.some((r: VariantResult): boolean => r.oasdiff?.available === true)) {
    lines.push('[oasdiff](https://github.com/oasdiff/oasdiff) changelog from the expected document to the generated one:', '');
    lines.push(
      table(
        ['Tool', 'Breaking (ERR)', 'Warnings', 'Info', 'Total'],
        ok.map((r: VariantResult): string[] =>
          r.oasdiff?.error !== undefined
            ? [r.tool, r.oasdiff.error, '', '', '']
            : [r.tool, dash(r.oasdiff?.errors), dash(r.oasdiff?.warnings), dash(r.oasdiff?.infos), dash(r.oasdiff?.total)],
        ),
      ),
      '',
    );
  }

  lines.push('## 3. Speed and memory', '');
  lines.push(
    table(
      ['Tool', 'Step', 'Wall (median)', 'Wall (min–max)', 'CPU (median)', 'Peak RSS (median)'],
      ok.flatMap((r: VariantResult): string[][] =>
        r.perf === undefined
          ? []
          : [
              ...r.perf.steps.map((s): string[] => [
                r.tool,
                `\`${s.name}\``,
                ms(s.wallMs.median),
                `${ms(s.wallMs.min)} – ${ms(s.wallMs.max)}`,
                ms(s.cpuMs.median),
                mb(s.maxRssMb.median),
              ]),
              ...(r.perf.steps.length > 1
                ? [[r.tool, '**total**', `**${ms(r.perf.total.wallMs.median)}**`, '', ms(r.perf.total.cpuMs.median), mb(r.perf.total.maxRssMb.median)]]
                : []),
            ],
      ),
    ),
    '',
  );
  if (ok.some((r: VariantResult): boolean => r.perf !== undefined)) {
    lines.push(`${ok.find((r) => r.perf)?.perf?.runs} measured runs per tool, after one warm-up run.`, '');
  }

  lines.push('## Notes per tool', '');
  for (const r of bench.variants) {
    lines.push(`### ${r.tool} (\`variants/${r.name}\`)`, '');
    if (r.error !== undefined) {
      lines.push('```', r.error.slice(0, 2000), '```', '');
    }
    for (const note of r.notes) {
      lines.push(`- ${note}`);
    }
    if (r.notes.length > 0) {
      lines.push('');
    }
    lines.push(`Differences: [\`bench/results/${r.name}/differences.md\`](${r.name}/differences.md)`, '');
  }

  return `${lines.join('\n')}\n`;
};

/** Group the differences by what they are about, without the operation part */
const pattern = (d: Difference): string =>
  d.key
    .replace(/^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS|TRACE) \S+ ?/, '')
    .replace(/^(success|\d{3}) \S+ \$/, '$1 $')
    .replace(/^body \S+ \$/, 'body $');

export const renderDifferences = (r: VariantResult, differences: Difference[]): string => {
  const lines: string[] = [`# ${r.tool}: differences with the expected document`, ''];
  if (r.correctness?.addedPrefix !== undefined) {
    lines.push(`The document lacks the \`${r.correctness.addedPrefix}\` global prefix: it was added before the comparison (counted as one difference).`, '');
  }
  for (const category of CATEGORIES) {
    const list: Difference[] = differences.filter((d: Difference): boolean => d.category === category);
    if (list.length === 0) {
      continue;
    }
    lines.push(`## ${category} (${list.length})`, '');
    const groups: Map<string, Difference[]> = new Map();
    for (const d of list) {
      const key: string = `${d.kind} ${pattern(d)}`;
      groups.set(key, [...(groups.get(key) ?? []), d]);
    }
    lines.push('Most frequent:', '');
    for (const [key, group] of [...groups.entries()].sort((a, b) => b[1].length - a[1].length).slice(0, 15)) {
      lines.push(`- ×${group.length} \`${key}\``);
    }
    lines.push('', '<details><summary>All</summary>', '');
    for (const d of list) {
      const detail: string =
        d.kind === 'mismatch' ? ` — expected \`${d.expected}\`, got \`${d.actual}\`` : d.kind === 'missing' ? ` — expected \`${d.expected}\`` : ` — got \`${d.actual}\``;
      lines.push(`- **${d.kind}** \`${d.key}\`${detail}`);
    }
    lines.push('', '</details>', '');
  }

  return `${lines.join('\n')}\n`;
};
