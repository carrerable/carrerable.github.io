// Comprueba que cada cifra de src/data/numbers.json tenga su fila en ../docs/metricas-verificadas.md.
// Solo local: en CI ese archivo no existe y el script se omite.
import { readFileSync, existsSync } from 'node:fs';
const MD = '../docs/metricas-verificadas.md';
if (!existsSync(MD)) { console.log('SKIP: no está ../docs/metricas-verificadas.md'); process.exit(0); }
const lineas = readFileSync(MD, 'utf8').split(/\r?\n/);
const grupos = JSON.parse(readFileSync('src/data/numbers.json', 'utf8'));
let fallos = 0;
for (const g of grupos) for (const it of g.items) {
  if (!lineas.some((l) => l.startsWith(`| ${it.ref} |`))) { console.log('sin fila: ' + it.ref); fallos++; }
}
console.log(fallos === 0 ? 'OK: todas las cifras tienen fila' : `FALLA: ${fallos} cifras sin fila`);
process.exit(fallos ? 1 : 0);
