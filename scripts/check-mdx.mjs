// Compila el cuerpo MDX (sin frontmatter) de cada archivo dado, para detectar errores de sintaxis sin correr el build.
// Uso: node scripts/check-mdx.mjs <archivo.mdx> [...]
import { readFileSync } from 'node:fs';
import { compile } from '@mdx-js/mdx';
const archivos = process.argv.slice(2);
if (archivos.length === 0) { console.error('Uso: node scripts/check-mdx.mjs <archivo.mdx> [...]'); process.exit(2); }
let errores = 0;
for (const a of archivos) {
  const cuerpo = readFileSync(a, 'utf8').replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
  try { await compile(cuerpo); } catch (e) { console.log(`${a}: ${e.message}`); errores++; }
}
console.log(errores === 0 ? `OK: ${archivos.length} archivos MDX compilan` : `FALLA: ${errores} archivos`);
process.exit(errores ? 1 : 0);
