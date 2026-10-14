import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const DEMOS_BASE = (process.env.DEMOS_BASE_URL ?? 'https://carrerable.github.io').replace(/\/$/, '');
const demos: string[] = JSON.parse(readFileSync('src/data/demos-publicadas.json', 'utf8'));

for (const repo of demos) {
  test(`demo ${repo} renders`, async ({ page }) => {
    const errors: string[] = [];
    const consola: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') consola.push(m.text()); });
    const res = await page.goto(`${DEMOS_BASE}/${repo}/`);
    expect(res?.status()).toBe(200);
    await expect(page.locator('#root > *').first()).toBeVisible();
    await expect(page.getByRole('note').first()).toBeVisible();
    if (consola.length) test.info().annotations.push({ type: 'console-error', description: consola.join(' | ') });
    expect(errors).toEqual([]);
  });
}
