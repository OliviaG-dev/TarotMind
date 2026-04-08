import type { PromptCardInput } from './interpretPrompts.js'

/** Réponse locale : aucun appel réseau, pour travailler prompts / API sans consommer de quota. */
export function buildConfigurationStub(opts: {
  spreadLabel: string
  tone: string
  cards: PromptCardInput[]
}): string {
  const lines = opts.cards.map(
    (c) =>
      `- **${c.positionLabel}** : ${c.cardName} (${c.reversed ? 'inversée' : 'droit'}) — mots-clés : ${c.keywords.length ? c.keywords.join(', ') : '—'}`,
  )
  return [
    '*Mode configuration — `GEMINI_DISABLED=1` : aucun appel Gemini, quota préservé.*',
    '',
    `**Tirage** : ${opts.spreadLabel}`,
    `**Ton** : ${opts.tone}`,
    '',
    '**Cartes reçues (validation OK)**',
    '',
    ...lines,
    '',
    'Quand la config est prête, enlève `GEMINI_DISABLED` ou mets `GEMINI_DISABLED=0` puis redémarre le serveur.',
  ].join('\n')
}
