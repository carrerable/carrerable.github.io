// Valida las notas (src/content/notes/{en,es}/*.mdx): frontmatter con el esquema, slug = nombre de archivo,
// idioma = carpeta, secciones obligatorias por tipo, textos prohibidos, que el MDX compile y, sin argumentos, los pares EN/ES.
// Uso: node scripts/check-notes.mjs                -> todas las notas
//      node scripts/check-notes.mjs <archivo.mdx>… -> solo esos archivos (no exige pares)
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, basename, dirname } from 'node:path';
import { parse } from 'yaml';
import { compile } from '@mdx-js/mdx';
import { NoteSchema } from '../src/data/notes-schema.mjs';

const BASE = 'src/content/notes';
const REQ = {
  playbook: { en: ['## Definition of done', '## Code review', '## Branches and releases', '## Onboarding', '## Rituals'], es: ['## Definición de terminado', '## Revisión de código', '## Ramas y releases', '## Onboarding', '## Rituales'] },
  template: { en: ['## 1:1', '## Sprint planning', '## RFC', '## Risk matrix'], es: ['## 1:1', '## Planeación de sprint', '## RFC', '## Matriz de riesgo'] },
  'test-strategy': { en: ['## Scope', '## The test pyramid', '## What is automated and what is not', '## Risk matrix', '## Known gaps'], es: ['## Alcance', '## La pirámide de pruebas', '## Qué se automatiza y qué no', '## Matriz de riesgo', '## Huecos conocidos'] },
  runbook: { en: ['## When to use this runbook', '## Roles', '## Phase 1', '## Phase 2', '## Phase 3', '## Phase 4', '## Rollback'], es: ['## Cuándo usar este runbook', '## Roles', '## Fase 1', '## Fase 2', '## Fase 3', '## Fase 4', '## Rollback'] },
  adr: { en: ['## Status', '## Context', '## Options considered', '## Decision', '## Consequences', '## How it was verified'], es: ['## Estado', '## Contexto', '## Opciones consideradas', '## Decisión', '## Consecuencias', '## Cómo se verificó'] },
  postmortem: { en: ['## Summary', '## Impact', '## Timeline', '## Root cause', '## Contributing factors', '## What went well', '## What went poorly', '## Action items'], es: ['## Resumen', '## Impacto', '## Línea de tiempo', '## Causa raíz', '## Factores que contribuyeron', '## Qué salió bien', '## Qué salió mal', '## Acciones'] },
  article: { en: ['## Takeaways'], es: ['## Para llevar'] },
};
const PROHIBIDO = [/TODO/, /POR CONFIRMAR/, /\[CONFIRMAR\]/, /lorem ipsum/i, /<!--/];
let errores = 0;
const error = (m) => { console.log(m); errores++; };

async function revisar(ruta) {
  const txt = readFileSync(ruta, 'utf8');
  const m = txt.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) return error(`${ruta}: falta el frontmatter`);
  let data;
  try { data = parse(m[1]); } catch (e) { return error(`${ruta}: YAML inválido: ${e.message}`); }
  const r = NoteSchema.safeParse(data);
  if (!r.success) return error(`${ruta}: frontmatter inválido: ${r.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')}`);
  const d = r.data;
  const lang = basename(dirname(ruta));
  if (d.lang !== lang) error(`${ruta}: lang "${d.lang}" no coincide con la carpeta "${lang}"`);
  if (d.slug !== basename(ruta, '.mdx')) error(`${ruta}: slug "${d.slug}" no coincide con el nombre del archivo`);
  if (d.project && !existsSync(join('src/content/projects/en', `${d.project}.mdx`))) error(`${ruta}: project "${d.project}" no existe`);
  for (const h of REQ[d.type][d.lang]) if (!m[2].includes(h)) error(`${ruta}: falta "${h}"`);
  for (const p of PROHIBIDO) if (p.test(txt)) error(`${ruta}: contiene ${p}`);
  try { await compile(m[2]); } catch (e) { error(`${ruta}: el MDX no compila: ${e.message}`); }
}

const args = process.argv.slice(2);
let archivos = args;
if (args.length === 0) {
  const listas = {};
  for (const lang of ['en', 'es']) {
    const dir = join(BASE, lang);
    listas[lang] = existsSync(dir) ? readdirSync(dir).filter((n) => n.endsWith('.mdx')) : [];
  }
  for (const f of listas.en) if (!listas.es.includes(f)) error(`falta es/${f}`);
  for (const f of listas.es) if (!listas.en.includes(f)) error(`falta en/${f}`);
  archivos = ['en', 'es'].flatMap((lang) => listas[lang].map((f) => join(BASE, lang, f)));
}
for (const a of archivos) await revisar(a);
console.log(errores === 0 ? `OK: notas completas (${archivos.length} archivos)` : `FALLA: ${errores} errores`);
process.exit(errores ? 1 : 0);
