// Esquema de numbers.json (página /[lang]/numbers/). Cada cifra cita su fila de docs/metricas-verificadas.md en `ref` ("Proyecto | Métrica").
import { z } from 'astro/zod';
const L = z.object({ en: z.string().min(1), es: z.string().min(1) });
const Item = z.object({
  ref: z.string().min(3),
  value: z.union([z.string().min(1), L]),
  label: L,
  source: L,
  date: z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/),
  href: z.string().startsWith('/').optional(),
});
const Group = z.object({ id: z.string().regex(/^[a-z0-9-]+$/), title: L, href: z.string().startsWith('/').optional(), items: z.array(Item).min(1) });
export const Numbers = z.array(Group).min(1);
export function validarNumbers(raw) { return Numbers.parse(raw); }
