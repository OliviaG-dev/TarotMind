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
  'Tu es TarotMind, assistant d’interpretation de tirages de tarot en francais.',
  'Style: bienveillant, clair, concret, non-jugement.',
  'Tu personnalises selon le profil utilisateur (objectifs, contexte relationnel/pro, ton choisi).',
  '',
  'Structure de sortie obligatoire:',
  '1) Lecture globale (3-5 lignes)',
  '2) Carte par carte (position + signification + lien au contexte)',
  '3) Synthese actionnable (3 actions max)',
  '4) Question d’introspection (1 seule)',
  '',
  'Contraintes:',
  '- Ne jamais presenter la lecture comme une verite absolue.',
  '- Pas de predictions medicales, legales ou financieres categoriques.',
  '- Toujours formuler comme piste de reflexion, avec nuances.',
  '- Francais naturel, sans jargon esoterique excessif.',
  '- Longueur cible: 220 a 420 mots.',
].join('\n')

export const TAROTMIND_HISTORY_SYSTEM_PROMPT = [
  'Tu es TarotMind, analyste de motifs de tirages de tarot en francais.',
  'Tu identifies des tendances, sans predire l’avenir de facon certaine.',
  '',
  'Sortie obligatoire en 5 sections exactement:',
  '### Motif principal',
  '### Ce que ca raconte de ta periode',
  '### Point de vigilance',
  '### Action 7 jours',
  '### Question d’introspection',
  '',
  'Contraintes:',
  '- Ton bienveillant, clair, concret.',
  '- Pas de certitudes absolues.',
  '- Une seule action prioritaire dans "Action 7 jours".',
  '- Longueur cible: 180 a 260 mots.',
].join('\n')

const TONE_EXTRA_INSTRUCTIONS: Record<PromptTone, string> = {
  direct: [
    'Orientation: coaching concret.',
    'Ajoute explicitement:',
    '- 1 priorite principale pour les 7 prochains jours',
    '- 2 erreurs a eviter',
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
    '- pratique d’ancrage simple (respiration, ecriture ou marche consciente)',
    'Evite toute formulation fataliste.',
  ].join('\n'),
}

function formatProfile(profile?: PromptProfileInput): string {
  const goals = profile?.goals?.length ? profile.goals.join(', ') : 'non precise'
  return [
    `- Statut amoureux: ${profile?.relationshipStatus ?? 'non precise'}`,
    `- Genre: ${profile?.gender ?? 'non precise'}`,
    `- Situation pro: ${profile?.workSituation ?? 'non precise'}`,
    `- Objectifs: ${goals}`,
    `- Type de jeu: ${profile?.deckPreference ?? 'non precise'}`,
  ].join('\n')
}

function formatCards(cards: PromptCardInput[]): string {
  return cards
    .map((c) => {
      const orientation = c.reversed ? 'Inversee' : 'Droite'
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
    'Fais une interpretation personnalisee selon la structure demandee dans le system prompt.',
    '',
    `Instruction complementaire (${input.tone}):`,
    TONE_EXTRA_INSTRUCTIONS[input.tone],
  ].join('\n')
}

export function buildMobileSummaryPrompt(fullInterpretation: string): string {
  return [
    'Resumer le texte suivant en francais pour une interface mobile.',
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

export function buildHistoryInsightsPromptPayload(input: {
  profile?: PromptProfileInput
  draws: HistoryInsightsDrawInput[]
  topCards: Array<{ name: string; count: number }>
}): { systemInstruction: string; userPrompt: string } {
  const drawsBlock = input.draws
    .map((d) => {
      const cards = d.cards
        .map((c) => `${c.positionLabel}: ${c.cardName}${c.reversed ? ' (inversee)' : ''}`)
        .join(' | ')
      return `- ${d.createdAt} — ${d.spreadLabel} (${d.tone}) — ${cards}`
    })
    .join('\n')

  const topCardsBlock =
    input.topCards.length > 0
      ? input.topCards.map((c) => `- ${c.name} (${c.count})`).join('\n')
      : '- Aucun motif fort detecte'

  const userPrompt = [
    'Contexte profil:',
    formatProfile(input.profile),
    '',
    'Historique recent:',
    drawsBlock || '- Aucun tirage',
    '',
    'Cartes les plus frequentes:',
    topCardsBlock,
    '',
    'Consigne:',
    'Propose une analyse concise, utile et actionnable en respectant strictement les 5 sections imposees.',
  ].join('\n')

  return {
    systemInstruction: TAROTMIND_HISTORY_SYSTEM_PROMPT,
    userPrompt,
  }
}
