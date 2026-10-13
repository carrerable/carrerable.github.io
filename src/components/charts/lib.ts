// Utilidades para las gráficas SVG (se calculan en el build; sin JS de cliente).
export type Lang = 'en' | 'es';
export type L = { en: string; es: string };

export const fmt = (n: number, lang: Lang, decimals = 0) =>
  n.toLocaleString(lang === 'es' ? 'es-MX' : 'en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

// Barra horizontal: base cuadrada a la izquierda, extremo de datos redondeado 4 px.
export function barPath(x: number, y: number, w: number, h: number, r = 4): string {
  const rr = Math.max(0, Math.min(r, w, h / 2));
  if (w <= 0) return '';
  return `M${x} ${y}H${x + w - rr}Q${x + w} ${y} ${x + w} ${y + rr}V${y + h - rr}Q${x + w} ${y + h} ${x + w - rr} ${y + h}H${x}Z`;
}

// Ancho aproximado de un texto monoespaciado de 11 px.
export const textW = (s: string, size = 11) => Math.ceil(s.length * size * 0.62) + 16;

export const caption = (lang: Lang, source: string, date: string) => `${lang === 'es' ? 'Fuente' : 'Source'}: ${source} · ${date}`;
export const tableLabel = (lang: Lang) => (lang === 'es' ? 'Tabla de datos' : 'Data table');
