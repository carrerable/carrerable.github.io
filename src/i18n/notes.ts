import type { Lang } from './ui';

// Etiquetas de los tipos de nota: plural para los grupos de /notes/ y corta para el marco de cada nota.
const GROUP = {
  en: { playbook: 'Playbook', template: 'Templates', 'test-strategy': 'Test strategy', runbook: 'Runbooks', adr: 'Architecture decision records', postmortem: 'Postmortems', article: 'Articles' },
  es: { playbook: 'Playbook', template: 'Plantillas', 'test-strategy': 'Estrategia de pruebas', runbook: 'Runbooks', adr: 'Registros de decisiones de arquitectura', postmortem: 'Postmortems', article: 'Artículos' },
} as const;
const SHORT = {
  en: { playbook: 'PLAYBOOK', template: 'TEMPLATES', 'test-strategy': 'TEST STRATEGY', runbook: 'RUNBOOK', adr: 'ADR', postmortem: 'POSTMORTEM', article: 'ARTICLE' },
  es: { playbook: 'PLAYBOOK', template: 'PLANTILLAS', 'test-strategy': 'ESTRATEGIA DE PRUEBAS', runbook: 'RUNBOOK', adr: 'ADR', postmortem: 'POSTMORTEM', article: 'ARTÍCULO' },
} as const;
export function noteTypeLabel(lang: Lang, type: string): string {
  return (GROUP[lang] as Record<string, string>)[type] ?? type;
}
export function noteTypeShort(lang: Lang, type: string): string {
  return (SHORT[lang] as Record<string, string>)[type] ?? type.toUpperCase();
}
