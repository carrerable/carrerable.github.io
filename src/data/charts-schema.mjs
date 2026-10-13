// Esquema de charts.json: cada gráfica lleva su fuente y fecha. Los componentes dibujan SVG en el build.
import { z } from 'astro/zod';
const L = z.object({ en: z.string().min(1), es: z.string().min(1) });
const Series = z.object({ label: L, value: z.number(), hot: z.boolean().default(false), of: z.number().optional() });
const Panel = z.object({ label: L, unit: z.string().default(''), decimals: z.number().int().default(0), series: z.array(Series).min(1), ref: z.object({ value: z.number(), label: L }).optional() });
const Base = { id: z.string().regex(/^[a-z0-9-]+$/), title: L, desc: L, source: L, date: z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/) };
const Gantt = z.object({ ...Base, kind: z.literal('gantt'), data: z.object({ from: z.literal('cv.json') }) });
const Bars = z.object({ ...Base, kind: z.literal('bars-compare'), data: z.object({ panels: z.array(Panel).min(1) }) });
const Rounds = z.object({ ...Base, kind: z.literal('rounds'), data: z.object({ rounds: z.array(z.object({ label: L, items: z.array(Series) })).min(1) }) });
const Funnel = z.object({ ...Base, kind: z.literal('funnel'), data: z.object({ stages: z.array(Series).min(2) }) });
const Matrix = z.object({
  ...Base, kind: z.literal('matrix'),
  data: z.object({
    columns: z.array(z.object({ id: z.string(), label: z.string() })),
    rows: z.array(z.object({ slug: z.string(), label: L, cells: z.record(z.string(), z.string()) })),
  }),
});
export const Chart = z.discriminatedUnion('kind', [Gantt, Bars, Rounds, Funnel, Matrix]);
export const Charts = z.array(Chart);
const ID = ['career-gantt', 'reyber-benchmark', 'qa-rounds', 'migration-reconcile', 'collections-funnel', 'jarvis-latency', 'video-tokens', 'stack-matrix'];
export function validarCharts(raw) {
  const d = Charts.parse(raw);
  for (const id of ID) if (!d.some((c) => c.id === id)) throw new Error(`falta la gráfica ${id}`);
  return d;
}
