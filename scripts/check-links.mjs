// Revisa que cada enlace interno (href="/...") de dist/**/*.html apunte a una página o archivo que exista en dist.
// Uso: node scripts/check-links.mjs   (después de npm run build)
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
const DIST = 'dist';
if (!existsSync(DIST)) { console.error('No existe dist/: corre npm run build primero'); process.exit(2); }
const html = [];
const recorrer = (d) => { for (const n of readdirSync(d)) { const p = join(d, n); if (statSync(p).isDirectory()) recorrer(p); else if (n.endsWith('.html')) html.push(p); } };
recorrer(DIST);
const rotos = new Set();
for (const f of html) {
  const txt = readFileSync(f, 'utf8');
  // Las páginas internas (noindex, como design-system) solo existen en un idioma: su selector de idioma no cuenta.
  if (txt.includes('name="robots" content="noindex')) continue;
  for (const m of txt.matchAll(/href="(\/[^"#?]*)/g)) {
    const ruta = decodeURI(m[1]);
    if (ruta.startsWith('//')) continue;
    const ok = ruta.endsWith('/') ? existsSync(join(DIST, ruta, 'index.html')) : (existsSync(join(DIST, ruta)) || existsSync(join(DIST, ruta, 'index.html')));
    if (!ok) rotos.add(`${ruta}  (en ${f})`);
  }
}
for (const r of rotos) console.log('roto: ' + r);
console.log(rotos.size === 0 ? `OK: enlaces internos (${html.length} páginas)` : `FALLA: ${rotos.size} enlaces rotos`);
process.exit(rotos.size ? 1 : 0);
