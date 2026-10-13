import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
export default defineConfig({
  site: 'https://carrerable.github.io',
  output: 'static',
  trailingSlash: 'always',
  i18n: { locales: ['en', 'es'], defaultLocale: 'en', routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false } },
  integrations: [mdx(), sitemap({ filter: (page) => !page.includes('/design-system/'), i18n: { defaultLocale: 'en', locales: { en: 'en-US', es: 'es-MX' } } })],
});
