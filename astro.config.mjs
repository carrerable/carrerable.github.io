import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Enlaces externos y PDF del contenido (MDX) se abren en pestaña nueva: el portafolio nunca se cierra.
function enlacesNuevaPestana() {
  const visitar = (nodo) => {
    if (nodo.type === 'element' && nodo.tagName === 'a') {
      const href = String(nodo.properties?.href ?? '');
      if (/^https?:\/\//.test(href) || /\.pdf$/i.test(href)) {
        nodo.properties.target = '_blank';
        nodo.properties.rel = ['noopener'];
      }
    }
    (nodo.children ?? []).forEach(visitar);
  };
  return (arbol) => visitar(arbol);
}

export default defineConfig({
  markdown: { rehypePlugins: [enlacesNuevaPestana] },
  site: 'https://carrerable.github.io',
  output: 'static',
  trailingSlash: 'always',
  i18n: { locales: ['en', 'es'], defaultLocale: 'en', routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false } },
  integrations: [mdx(), sitemap({ filter: (page) => !page.includes('/design-system/'), i18n: { defaultLocale: 'en', locales: { en: 'en-US', es: 'es-MX' } } })],
});
