// Comprueba los datos del CV interactivo y de las gráficas. Sale con 1 si algo falla.
import { readFileSync, readdirSync } from 'node:fs';
import { validar } from '../src/data/cv-schema.mjs';
import { validarCharts } from '../src/data/charts-schema.mjs';

const dir = new URL('../src/data/', import.meta.url);
let fallos = 0;
const falla = (m) => { console.error('FALLA: ' + m); fallos++; };
try { validar(JSON.parse(readFileSync(new URL('cv.json', dir), 'utf8'))); console.log('OK cv.json'); } catch (e) { falla('cv.json: ' + e.message); }
try { validarCharts(JSON.parse(readFileSync(new URL('charts.json', dir), 'utf8'))); console.log('OK charts.json'); } catch (e) { falla('charts.json: ' + e.message); }
for (const f of readdirSync(dir)) {
  const t = readFileSync(new URL(f, dir), 'utf8');
  for (const p of ['3706', 'ET, CT', 'available']) if (t.includes(p)) falla(`${f} contiene "${p}" (dato privado)`);
}
console.log(fallos === 0 ? 'OK: CV y gráficas' : `FALLA: ${fallos} problemas`);
process.exit(fallos === 0 ? 1 - 1 : 1);
