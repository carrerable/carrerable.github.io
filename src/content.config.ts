import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
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
    metrics: z.array(z.object({ label: z.string(), value: z.string(), source: z.string() })).max(4),
    demoUrl: z.string().url().optional(),
    repoUrl: z.string().url().optional(),
  }),
});
export const collections = { projects };
