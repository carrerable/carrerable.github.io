import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';

const paths = [...readFileSync('dist/sitemap-0.xml', 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname)
  // "/" solo redirige a /en/ (meta refresh): la navegación corta el análisis y /en/ ya se revisa aparte.
  .filter((p) => p !== '/');

for (const path of paths) {
  test(`axe ${path}`, async ({ page }) => {
    await page.goto(path);
    // El reproductor de YouTube es de terceros: su marcado interno no se puede corregir desde aquí.
    const r = await new AxeBuilder({ page }).exclude('iframe[src*="youtube"]').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    const graves = r.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    const detalle = JSON.stringify(graves.map((v) => ({ id: v.id, help: v.help, targets: v.nodes.map((n) => n.target) })), null, 1);
    expect(graves.map((v) => `${v.id}: ${v.nodes.length} nodes`), detalle).toEqual([]);
  });
}
