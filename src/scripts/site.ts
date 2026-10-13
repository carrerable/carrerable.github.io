// JS mínimo del sitio (vanilla): tema, aparición al scroll y contadores.
// El contenido es legible sin JS; todo esto es mejora progresiva.

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Tema: sigue a prefers-color-scheme y se recuerda en localStorage (con try/catch).
function effectiveTheme(): 'light' | 'dark' {
  const t = document.documentElement.dataset.theme;
  if (t === 'light' || t === 'dark') return t;
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const next = effectiveTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch { /* sin almacenamiento: el cambio dura la visita */ }
  });
});

// Contadores: del 0 al valor final en 800 ms con easing suave.
function runCounter(el: HTMLElement) {
  const to = parseFloat(el.dataset.to ?? '');
  if (Number.isNaN(to)) return;
  const dec = parseInt(el.dataset.decimals ?? '0', 10);
  const lang = document.documentElement.lang || 'en';
  const fmt = (n: number) => n.toLocaleString(lang, { minimumFractionDigits: dec, maximumFractionDigits: dec });
  const t0 = performance.now();
  const dur = 800;
  const tick = (now: number) => {
    const p = Math.min(1, (now - t0) / dur);
    el.textContent = fmt(to * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = fmt(to);
  };
  el.textContent = fmt(0);
  requestAnimationFrame(tick);
}

// Aparición al hacer scroll.
const targets = document.querySelectorAll<HTMLElement>('.reveal, .words');
if (!('IntersectionObserver' in window)) {
  targets.forEach((t) => t.classList.add('in'));
} else {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const el = e.target as HTMLElement;
      el.classList.add('in');
      if (!reduced) el.querySelectorAll<HTMLElement>('.counter').forEach(runCounter);
      io.unobserve(el);
    }
  }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
  targets.forEach((t) => io.observe(t));
}
