import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
const BASE = 'src/content/projects';
const REQ = {
  en: ['## Context', '## My role', '## Research', '## Decisions', '## Validation & QA', '## Results', "## What I'd do differently", '**Decided:**', '**Verified:**', '**Delegated to AI:**'],
  es: ['## Contexto', '## Mi rol', '## Investigación', '## Decisiones', '## Validación y QA', '## Resultados', '## Qué haría distinto', '**Decidí:**', '**Verifiqué:**', '**Delegué a la IA:**'],
};
let errores = 0;
const archivos = {};
for (const lang of ['en', 'es']) {
  archivos[lang] = new Set(readdirSync(join(BASE, lang)).filter((n) => n.endsWith('.mdx')));
  for (const f of archivos[lang]) {
    const txt = readFileSync(join(BASE, lang, f), 'utf8');
    for (const h of REQ[lang]) if (!txt.includes(h)) { console.log(`${lang}/${f}: falta "${h}"`); errores++; }
    if (!/^\|.*\|.*\|.*\|\s*$/m.test(txt)) { console.log(`${lang}/${f}: falta la tabla de decisiones`); errores++; }
  }
}
for (const f of archivos.en) if (!archivos.es.has(f)) { console.log(`falta es/${f}`); errores++; }
for (const f of archivos.es) if (!archivos.en.has(f)) { console.log(`falta en/${f}`); errores++; }
console.log(errores === 0 ? 'OK: casos completos' : `FALLA: ${errores} errores`);
process.exit(errores ? 1 : 0);
