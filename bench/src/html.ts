/**
 * Self-contained HTML view of the results: one horizontal bar chart per grade (small multiples, one hue),
 * with hover tooltips, direct value labels, and a table view.
 */
import type { BenchResult, VariantResult } from './report.ts';

interface Metric {
  title: string;
  subtitle: string;
  value: (r: VariantResult) => number | undefined;
  format: (v: number) => string;
}

const fmtMs = (v: number): string => (v >= 1000 ? `${(v / 1000).toFixed(2)} s` : `${Math.round(v)} ms`);

const METRICS: Metric[] = [
  { title: 'Ease of use', subtitle: 'Lines changed in the app', value: (r) => r.ease?.linesChanged, format: String },
  { title: 'Correctness — core', subtitle: 'Differences: operations, parameters, bodies, success responses', value: (r) => r.correctness?.core.differences, format: String },
  { title: 'Correctness — all', subtitle: 'Differences incl. errors, constraints, security, docs', value: (r) => r.correctness?.total.differences, format: String },
  { title: 'Speed', subtitle: 'Median wall time, sources → document', value: (r) => r.perf?.total.wallMs.median, format: fmtMs },
  { title: 'Memory', subtitle: 'Median peak RSS', value: (r) => r.perf?.total.maxRssMb.median, format: (v) => `${Math.round(v)} MB` },
];

const esc = (s: string): string => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const chart = (metric: Metric, results: VariantResult[]): string => {
  const rows = results
    .map((r) => ({ r, v: metric.value(r) }))
    .filter((x): x is { r: VariantResult; v: number } => x.v !== undefined)
    .sort((a, b) => a.v - b.v);
  if (rows.length === 0) {
    return '';
  }
  const max: number = Math.max(...rows.map((x) => x.v), 1);
  const labelW = 190;
  const plotW = 420;
  const rowH = 26;
  const height: number = rows.length * rowH + 8;
  const bars: string = rows
    .map(({ r, v }, i) => {
      const y: number = i * rowH + 4;
      const w: number = Math.max((v / max) * plotW, 2);
      const text = `${r.tool}: ${metric.format(v)}`;

      return `<g class="row" tabindex="0" aria-label="${esc(text)}" data-tip="${esc(text)}">
  <rect class="hit" x="0" y="${y - 2}" width="${labelW + plotW + 80}" height="${rowH}"/>
  <text class="label" x="${labelW - 10}" y="${y + 15}" text-anchor="end">${esc(r.tool)}</text>
  <rect class="bar" x="${labelW}" y="${y + 4}" width="${w.toFixed(1)}" height="14" rx="4"/>
  <text class="value" x="${labelW + w + 6}" y="${y + 15}">${esc(metric.format(v))}</text>
</g>`;
    })
    .join('\n');

  return `<figure class="card">
<figcaption><h2>${esc(metric.title)}</h2><p>${esc(metric.subtitle)} · lower is better</p></figcaption>
<svg viewBox="0 0 ${labelW + plotW + 90} ${height}" role="img" aria-label="${esc(metric.title)}">
<line class="axis" x1="${labelW}" x2="${labelW}" y1="0" y2="${height}"/>
${bars}
</svg>
</figure>`;
};

export const renderHtml = (bench: BenchResult): string => {
  const ok: VariantResult[] = bench.variants.filter((r) => r.error === undefined);
  const tableRows: string = ok
    .map(
      (r) =>
        `<tr><th scope="row">${esc(r.tool)}</th>${METRICS.map((m) => {
          const v = m.value(r);

          return `<td>${v === undefined ? '–' : esc(m.format(v))}</td>`;
        }).join('')}</tr>`,
    )
    .join('\n');

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>NestJS OpenAPI generators benchmark</title>
<style>
.viz-root { color-scheme: light; --surface-1: #fcfcfb; --surface-2: #f3f2ef; --text-primary: #0b0b0b; --text-secondary: #52514e; --grid: #d9d8d3; --series-1: #2a78d6; }
@media (prefers-color-scheme: dark) { :root:where(:not([data-theme="light"])) .viz-root { color-scheme: dark; --surface-1: #1a1a19; --surface-2: #242422; --text-primary: #f0efec; --text-secondary: #c3c2b7; --grid: #3a3a37; --series-1: #3987e5; } }
:root[data-theme="dark"] .viz-root { color-scheme: dark; --surface-1: #1a1a19; --surface-2: #242422; --text-primary: #f0efec; --text-secondary: #c3c2b7; --grid: #3a3a37; --series-1: #3987e5; }
body { margin: 0; }
.viz-root { background: var(--surface-1); color: var(--text-primary); font: 14px/1.4 system-ui, sans-serif; padding: 24px; box-sizing: border-box; }
h1 { font-size: 20px; margin: 0 0 4px; } .meta { color: var(--text-secondary); margin: 0 0 20px; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(460px, 1fr)); gap: 16px; }
.card { background: var(--surface-2); border-radius: 8px; padding: 16px; margin: 0; }
.card h2 { font-size: 15px; margin: 0; } .card p { color: var(--text-secondary); margin: 2px 0 8px; font-size: 12px; }
svg { width: 100%; height: auto; overflow: visible; }
.bar { fill: var(--series-1); } .axis { stroke: var(--grid); stroke-width: 1; }
.label { fill: var(--text-primary); font-size: 12px; } .value { fill: var(--text-secondary); font-size: 12px; }
.hit { fill: transparent; } .row:hover .hit, .row:focus .hit { fill: var(--grid); opacity: .35; } .row { outline: none; }
#tip { position: fixed; pointer-events: none; background: var(--text-primary); color: var(--surface-1); padding: 4px 8px; border-radius: 4px; font-size: 12px; display: none; }
table { border-collapse: collapse; margin-top: 24px; width: 100%; } th, td { padding: 6px 10px; border-bottom: 1px solid var(--grid); text-align: right; } th[scope=row], thead th:first-child { text-align: left; }
thead th { color: var(--text-secondary); font-weight: 600; }
</style></head>
<body><main class="viz-root">
<h1>NestJS OpenAPI generators benchmark</h1>
<p class="meta">${esc(bench.date.slice(0, 10))} · ${esc(bench.machine.cpus)} · Node ${esc(bench.machine.node)} · one bar per tool, sorted best first</p>
<div class="grid">
${METRICS.map((m) => chart(m, ok)).join('\n')}
</div>
<table><caption style="text-align:left;color:var(--text-secondary)">Table view</caption>
<thead><tr><th>Tool</th>${METRICS.map((m) => `<th>${esc(m.title)}</th>`).join('')}</tr></thead>
<tbody>${tableRows}</tbody></table>
<div id="tip" role="tooltip"></div>
</main>
<script>
const tip = document.getElementById('tip');
document.querySelectorAll('.row').forEach((row) => {
  const show = (x, y) => { tip.textContent = row.dataset.tip; tip.style.display = 'block'; tip.style.left = (x + 12) + 'px'; tip.style.top = (y + 12) + 'px'; };
  row.addEventListener('mousemove', (e) => show(e.clientX, e.clientY));
  row.addEventListener('mouseleave', () => { tip.style.display = 'none'; });
  row.addEventListener('focus', () => { const b = row.getBoundingClientRect(); show(b.left + 200, b.top); });
  row.addEventListener('blur', () => { tip.style.display = 'none'; });
});
</script>
</body></html>
`;
};
