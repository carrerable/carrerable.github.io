import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { NoteSchema } from './data/notes-schema.mjs';
const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects', generateId: ({ entry }) => entry.replace(/\.mdx$/, '') }),
  schema: z.object({
    title: z.string(),
    slug: z.string().regex(/^[a-z0-9-]+$/),
    lang: z.enum(['en', 'es']),
    kind: z.enum(['project', 'work']),
    order: z.number().int(),
    summary: z.string().max(220),
    role: z.string(),
    period: z.string(),
    status: z.enum(['production', 'building', 'paused', 'documented', 'learning', 'delivered']),
    stack: z.array(z.string()).min(1),
    aiTools: z.array(z.string()),
    // `gain`: qué gana quien contrata, en una frase. `pitch`: qué resuelve el caso, en una frase, para el panel lateral.
    metrics: z.array(z.object({ label: z.string(), value: z.string(), source: z.string(), gain: z.string().optional() })).max(4),
    pitch: z.string().max(200).optional(),
    demoUrl: z.string().url().optional(),
    repoUrl: z.string().url().optional(),
  }),
});
// Notas de ingeniería (playbook, plantillas, estrategia de pruebas, runbook, ADR, postmortem y artículos). Esquema en data/notes-schema.mjs.
const notes = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/notes', generateId: ({ entry }) => entry.replace(/\.mdx$/, '') }),
  schema: NoteSchema,
});
export const collections = { projects, notes };
