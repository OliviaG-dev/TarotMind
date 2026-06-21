export type PromptTone = 'direct' | 'psychological' | 'spiritual'

export type PromptCardInput = {
  positionLabel: string
  cardName: string
  reversed: boolean
  keywords: string[]
}

export type PromptProfileInput = {
  relationshipStatus?: string
  gender?: string
  workSituation?: string
  goals?: string[]
  deckPreference?: string
}

export type BuildInterpretPromptInput = {
  tone: PromptTone
  spreadLabel: string
  question: string
  profile?: PromptProfileInput
  cards: PromptCardInput[]
}

export type HistoryInsightsDrawInput = {
  createdAt: string
  spreadLabel: string
  tone: PromptTone
  cards: Array<{
    positionLabel: string
    cardName: string
    reversed: boolean
  }>
}

export const TAROTMIND_SYSTEM_PROMPT = [
  'Tu es TarotMind, assistant d’interprétation de tirages de tarot en français.',
  'Style: bienveillant, clair, concret, non-jugement.',
  'Tu personnalises selon le profil utilisateur (objectifs, contexte relationnel/pro, ton choisi).',
  '',
  'Structure de sortie obligatoire:',
  '1) Lecture globale (3-5 lignes)',
  '2) Carte par carte (position + signification + lien au contexte)',
  '3) Synthèse actionnable (3 actions max)',
  '4) Question d’introspection (1 seule)',
  '',
  'Contraintes:',
  '- Ne jamais présenter la lecture comme une vérité absolue.',
  '- Pas de prédictions médicales, légales ou financières catégoriques.',
  '- Toujours formuler comme piste de réflexion, avec nuances.',
  '- Français naturel, sans jargon ésotérique excessif.',
  '- Longueur cible: 220 à 420 mots.',
].join('\n')

export const TAROTMIND_HISTORY_SYSTEM_PROMPT = [
  'Tu es TarotMind, analyste de motifs de tirages de tarot en français.',
  'Tu identifies des tendances, sans prédire l’avenir de façon certaine.',
  '',
  'Sortie obligatoire en 5 sections exactement:',
  '### Motif principal',
  '### Ce que ça raconte de ta période',
  '### Point de vigilance',
  '### Action 7 jours',
  '### Question d’introspection',
  '',
  'Contraintes:',
  '- Ton bienveillant, clair, concret.',
  '- Pas de certitudes absolues.',
  '- Une seule action prioritaire dans "Action 7 jours".',
  '- Longueur cible: 180 à 260 mots.',
].join('\n')

const TONE_EXTRA_INSTRUCTIONS: Record<PromptTone, string> = {
  direct: [
    'Orientation: coaching concret.',
    'Ajoute explicitement:',
    '- 1 priorité principale pour les 7 prochains jours',
    '- 2 erreurs à éviter',
    '- 1 micro-rituel quotidien (< 10 minutes)',
  ].join('\n'),
  psychological: [
    'Orientation: lecture psychologique.',
    'Mets l’accent sur:',
    '- dynamiques emotionnelles',
    '- schemas repetitifs possibles',
    '- besoin non exprime',
    'Termine par une question de journal introspectif.',
  ].join('\n'),
  spiritual: [
    'Orientation: symbolique/spirituelle accessible.',
    'Mets l’accent sur:',
    '- archetype dominant du tirage',
    '- message central de transformation',
    '- pratique d’ancrage simple (respiration, écriture ou marche consciente)',
    'Évite toute formulation fataliste.',
  ].join('\n'),
}

function formatProfile(profile?: PromptProfileInput): string {
  const goals = profile?.goals?.length ? profile.goals.join(', ') : 'non précisé'
  return [
    `- Statut amoureux: ${profile?.relationshipStatus ?? 'non précisé'}`,
    `- Genre: ${profile?.gender ?? 'non précisé'}`,
    `- Situation pro: ${profile?.workSituation ?? 'non précisé'}`,
    `- Objectifs: ${goals}`,
    `- Type de jeu: ${profile?.deckPreference ?? 'non précisé'}`,
  ].join('\n')
}

function formatCards(cards: PromptCardInput[]): string {
  return cards
    .map((c) => {
      const orientation = c.reversed ? 'Inversée' : 'Droite'
      const keywords = c.keywords.length ? c.keywords.join(', ') : 'aucun'
      return `${c.positionLabel} — ${c.cardName} — ${orientation} — Mots-cles: ${keywords}`
    })
    .join('\n')
}

export function buildInterpretUserPrompt(input: BuildInterpretPromptInput): string {
  return [
    'Contexte utilisateur:',
    formatProfile(input.profile),
    `- Ton demande: ${input.tone}`,
    '',
    'Tirage:',
    `- Nom: ${input.spreadLabel}`,
    `- Intention/question: ${input.question}`,
    '',
    'Cartes:',
    formatCards(input.cards),
    '',
    'Consigne:',
    'Fais une interprétation personnalisée selon la structure demandée dans le system prompt.',
    '',
    `Instruction complementaire (${input.tone}):`,
    TONE_EXTRA_INSTRUCTIONS[input.tone],
  ].join('\n')
}

export function buildMobileSummaryPrompt(fullInterpretation: string): string {
  return [
    'Résumer le texte suivant en français pour une interface mobile.',
    'Sortie attendue:',
    '- 5 bullets maximum',
    '- chaque bullet = 1 phrase courte',
    '- finir par une section "Action aujourd’hui"',
    '',
    'Texte source:',
    fullInterpretation,
  ].join('\n')
}

/**
 * Format pratique pour SDK LLM:
 * - systemInstruction: prompt system global
 * - userPrompt: prompt complet pour le tour courant
 */
export function buildInterpretPromptPayload(input: BuildInterpretPromptInput): {
  systemInstruction: string
  userPrompt: string
} {
  return {
    systemInstruction: TAROTMIND_SYSTEM_PROMPT,
    userPrompt: buildInterpretUserPrompt(input),
  }
}

export const TAROTMIND_QUESTION_SYSTEM_PROMPT = [
  'Tu es TarotMind, guide spirituel bienveillant spécialisé en tarot, en français.',
  'On te pose une question libre, sans tirage de cartes.',
  'Tu réponds en te basant sur le profil de la personne et ta sagesse du tarot.',
  '',
  'Structure de sortie:',
  '1) Éclairage (3-5 lignes de réflexion sur la question)',
  '2) Conseil concret (2-3 actions simples)',
  '3) Question d\'introspection (1 seule)',
  '',
  'Contraintes:',
  '- Bienveillant, clair, concret, sans jugement.',
  '- Jamais de vérité absolue ni de prédiction catégorique.',
  '- Français naturel, accessible.',
  '- Longueur cible: 120 à 250 mots.',
].join('\n')

export function buildQuestionPromptPayload(input: {
  question: string
  profile?: PromptProfileInput
  spreadLabel?: string
  cards?: PromptCardInput[]
}): { systemInstruction: string; userPrompt: string } {
  const parts = [
    'Contexte utilisateur:',
    formatProfile(input.profile),
    '',
    'Question posée:',
    input.question,
  ]

  if (input.spreadLabel && input.cards && input.cards.length > 0) {
    parts.push(
      '',
      'Tirage associe:',
      `- Type: ${input.spreadLabel}`,
      '',
      'Cartes tirées:',
      formatCards(input.cards),
    )
  }

  parts.push(
    '',
    'Consigne:',
    input.cards && input.cards.length > 0
      ? 'Réponds à cette question en te basant sur le profil ET les cartes tirées. Respecte la structure demandée.'
      : 'Réponds à cette question de manière personnalisée en respectant la structure demandée.',
  )

  return {
    systemInstruction: TAROTMIND_QUESTION_SYSTEM_PROMPT,
    userPrompt: parts.join('\n'),
  }
}

export function buildHistoryInsightsPromptPayload(input: {
  profile?: PromptProfileInput
  draws: HistoryInsightsDrawInput[]
  topCards: Array<{ name: string; count: number }>
}): { systemInstruction: string; userPrompt: string } {
  const drawsBlock = input.draws
    .map((d) => {
      const cards = d.cards
        .map((c) => `${c.positionLabel}: ${c.cardName}${c.reversed ? ' (inversée)' : ''}`)
        .join(' | ')
      return `- ${d.createdAt} — ${d.spreadLabel} (${d.tone}) — ${cards}`
    })
    .join('\n')

  const topCardsBlock =
    input.topCards.length > 0
      ? input.topCards.map((c) => `- ${c.name} (${c.count})`).join('\n')
      : '- Aucun motif fort détecté'

  const userPrompt = [
    'Contexte profil:',
    formatProfile(input.profile),
    '',
    'Historique recent:',
    drawsBlock || '- Aucun tirage',
    '',
    'Cartes les plus fréquentes:',
    topCardsBlock,
    '',
    'Consigne:',
    'Propose une analyse concise, utile et actionnable en respectant strictement les 5 sections imposées.',
  ].join('\n')

  return {
    systemInstruction: TAROTMIND_HISTORY_SYSTEM_PROMPT,
    userPrompt,
  }
}
