// Esquema de la fuente única del CV (la lee el sitio y los scripts de Node).
// Desvíos respecto al plan (paso 15a), por decisión del coordinador: no hay variantes B/C, así que
// se quitan `variants`; titular y resumen son únicos; se agregan `short` (etiqueta del Gantt),
// `cases` (varios casos por entrada) y `aiProjects` (la línea "Proyectos de IA" del CV).
import { z } from 'astro/zod';
const L = z.object({ en: z.string().min(1), es: z.string().min(1) });
export const Metric = z.object({ id: z.string(), value: z.number(), prefix: z.string().default(''), suffix: z.string().default(''), decimals: z.number().int().default(0), label: L, source: L });
export const Bullet = z.object({ id: z.string(), text: L, skills: z.array(z.string()).default([]), metrics: z.array(z.string()).default([]) });
export const Entry = z.object({
  id: z.string(), kind: z.enum(['job', 'project', 'earlier']), lane: z.enum(['main', 'parallel']),
  org: L, title: L, short: L, start: z.string().regex(/^\d{4}(-\d{2})?$/), end: z.string().regex(/^\d{4}(-\d{2})?$/).nullable(),
  approx: z.boolean(), note: L.optional(), caseSlug: z.string().optional(), cases: z.array(z.string()).default([]), demoUrl: z.string().url().optional(),
  bullets: z.array(Bullet),
});
export const Skill = z.object({ id: z.string(), group: z.string(), label: L, entries: z.array(z.string()), cases: z.array(z.string()).default([]) });
export const CV = z.object({
  meta: z.object({
    name: z.string(), headline: L, summary: L, location: L, email: z.string().email(),
    updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    links: z.array(z.object({ label: z.string(), url: z.string().url() })),
  }),
  groups: z.array(z.object({ id: z.string(), label: L })),
  metrics: z.array(Metric), skills: z.array(Skill), entries: z.array(Entry),
  aiProjects: z.array(z.object({ id: z.string(), text: L, caseSlug: z.string() })),
  education: z.array(z.object({ text: L })), languages: L, awards: z.array(z.object({ text: L, cv: z.boolean() })),
});
export function validar(cv) {
  const d = CV.parse(cv);
  const ids = new Set(d.entries.map((e) => e.id));
  const sk = new Set(d.skills.map((s) => s.id));
  const mt = new Set(d.metrics.map((m) => m.id));
  const gr = new Set(d.groups.map((g) => g.id));
  for (const s of d.skills) {
    if (!gr.has(s.group)) throw new Error(`skill ${s.id} -> grupo inexistente ${s.group}`);
    for (const e of s.entries) if (!ids.has(e)) throw new Error(`skill ${s.id} -> entry inexistente ${e}`);
  }
  for (const e of d.entries) for (const b of e.bullets) {
    for (const s of b.skills) if (!sk.has(s)) throw new Error(`bullet ${b.id} -> skill inexistente ${s}`);
    for (const m of b.metrics) if (!mt.has(m)) throw new Error(`bullet ${b.id} -> metric inexistente ${m}`);
  }
  return d;
}
