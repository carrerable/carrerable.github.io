import { test, expect } from '@playwright/test';

const BASE = (process.env.BASE_URL ?? 'https://carrerable.github.io').replace(/\/$/, '');
const PROD = 'https://carrerable.github.io';
const KEY_PAGES = ['/en/', '/es/', '/en/projects/', '/en/notes/', '/en/numbers/', '/en/status/', '/en/cv/', '/en/how-i-work/'];
const locs = (xml: string) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(PROD, BASE));

test('every page in the sitemap answers 200', async ({ request }) => {
  const index = await request.get(`${BASE}/sitemap-index.xml`);
  expect(index.status()).toBe(200);
  const pages: string[] = [];
  for (const map of locs(await index.text())) {
    const r = await request.get(map);
    expect(r.status()).toBe(200);
    pages.push(...locs(await r.text()));
  }
  expect(pages.length).toBeGreaterThanOrEqual(30);
  const rotas: string[] = [];
  for (const p of pages) {
    const r = await request.get(p);
    if (r.status() !== 200) rotas.push(`${r.status()} ${p}`);
  }
  expect(rotas, rotas.join('\n')).toEqual([]);
});

for (const path of KEY_PAGES) {
  test(`key page ${path} renders without script errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    const res = await page.goto(BASE + path);
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1').first()).toBeVisible();
    expect(errors).toEqual([]);
  });
}
