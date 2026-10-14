// Esquema del frontmatter de las notas (src/content/notes/{en,es}/*.mdx).
// Lo usan src/content.config.ts (build) y scripts/check-notes.mjs (revisión rápida sin build).
import { z } from 'astro/zod';

// Orden en que se agrupan en /[lang]/notes/.
export const NOTE_TYPES = ['playbook', 'template', 'test-strategy', 'runbook', 'adr', 'postmortem', 'article'];

export const NoteSchema = z.object({
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  lang: z.enum(['en', 'es']),
  type: z.enum(['playbook', 'template', 'test-strategy', 'runbook', 'adr', 'postmortem', 'article']),
  order: z.number().int(),
  summary: z.string().min(1).max(220),
  date: z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/),
  project: z.string().regex(/^[a-z0-9-]+$/).optional(),
  tags: z.array(z.string().min(1)).max(6).default([]),
});
