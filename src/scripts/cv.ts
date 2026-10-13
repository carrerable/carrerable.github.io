// CV interactivo (vanilla): al enfocar un chip de habilidad se iluminan las entradas donde se usó.
const entries = Array.from(document.querySelectorAll<HTMLElement>('[data-entry]'));

function clear() {
  entries.forEach((e) => e.classList.remove('is-related', 'is-dim'));
  document.querySelectorAll('.chip-btn.is-active').forEach((c) => c.classList.remove('is-active'));
}
function light(chip: HTMLElement) {
  const ids = (chip.dataset.entries ?? '').split(' ').filter(Boolean);
  if (ids.length === 0) return;
  entries.forEach((e) => {
    const on = ids.includes(e.dataset.entry ?? '');
    e.classList.toggle('is-related', on);
    e.classList.toggle('is-dim', !on);
  });
  chip.classList.add('is-active');
}
document.querySelectorAll<HTMLElement>('.chip-btn').forEach((chip) => {
  chip.addEventListener('mouseenter', () => light(chip));
  chip.addEventListener('focus', () => light(chip));
  chip.addEventListener('mouseleave', clear);
  chip.addEventListener('blur', clear);
});
document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') clear(); });
