/**
 * Regression check of one tool between two of its versions, for the CI of the tool: both documents are
 * compared with the expected one, and the check fails when the candidate has more differences than the
 * baseline in any category.
 */
import { CATEGORIES } from './correctness/compare.ts';
import type { Category, CategoryScore, Comparison, Difference } from './correctness/compare.ts';

export interface CheckResult {
  regressed: boolean;
  markdown: string;
}

/** Differences shown in each "new"/"fixed" list, the rest is counted */
const LIST_LIMIT: number = 50;

const describe = (d: Difference): string => {
  const detail: string =
    d.kind === 'mismatch' ? ` — expected \`${d.expected}\`, got \`${d.actual}\`` : d.kind === 'missing' ? ` — expected \`${d.expected}\`` : ` — got \`${d.actual}\``;

  return `- ${d.category}: **${d.kind}** \`${d.key}\`${detail}`;
};

const identity = (d: Difference): string => JSON.stringify([d.category, d.kind, d.key, d.expected, d.actual]);

/** Differences of `a` that `b` does not have */
const subtract = (a: Difference[], b: Difference[]): Difference[] => {
  const seen: Set<string> = new Set(b.map(identity));

  return a.filter((d: Difference): boolean => !seen.has(identity(d)));
};

const list = (title: string, differences: Difference[]): string[] => {
  if (differences.length === 0) {
    return [];
  }
  const shown: string[] = differences.slice(0, LIST_LIMIT).map(describe);
  const rest: number = differences.length - shown.length;

  return [
    `<details><summary>${title} (${differences.length})</summary>`,
    '',
    ...shown,
    ...(rest > 0 ? [`- … and ${rest} more`] : []),
    '',
    '</details>',
    '',
  ];
};

const delta = (before: number, after: number): string => {
  const d: number = after - before;

  return d === 0 ? '0' : d > 0 ? `**+${d}** ❌` : `${d} ✅`;
};

export const checkRegression = (candidate: Comparison, baseline?: Comparison): CheckResult => {
  const rows: [string, CategoryScore, CategoryScore | undefined][] = [
    ...CATEGORIES.map((c: Category): [string, CategoryScore, CategoryScore | undefined] => [c, candidate.categories[c], baseline?.categories[c]]),
    ['**core**', candidate.core, baseline?.core],
    ['**total**', candidate.total, baseline?.total],
  ];
  const regressed: boolean =
    baseline !== undefined && CATEGORIES.some((c: Category): boolean => candidate.categories[c].differences > baseline.categories[c].differences);

  const lines: string[] = [];
  if (baseline === undefined) {
    lines.push('| Category | Expected facts | Differences |', '| --- | ---: | ---: |');
    for (const [name, score] of rows) {
      lines.push(`| ${name} | ${score.expected} | ${score.differences} |`);
    }
  } else {
    lines.push('| Category | Expected facts | Baseline | Candidate | Δ |', '| --- | ---: | ---: | ---: | ---: |');
    for (const [name, score, base] of rows) {
      lines.push(`| ${name} | ${score.expected} | ${base?.differences} | ${score.differences} | ${delta(base?.differences ?? 0, score.differences)} |`);
    }
  }
  lines.push('');
  if (candidate.addedPrefix !== undefined) {
    lines.push(`The candidate lacks the \`${candidate.addedPrefix}\` global prefix (counted as one difference).`, '');
  }
  if (baseline !== undefined) {
    lines.push(...list('New differences', subtract(candidate.differences, baseline.differences)));
    lines.push(...list('Fixed differences', subtract(baseline.differences, candidate.differences)));
  }

  return { regressed, markdown: lines.join('\n') };
};
