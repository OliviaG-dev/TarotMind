import type { PlacedCard, SpreadId, Tone, UserProfile } from '../types/tarot'
import { profileOpeningLine } from './profileLabels'

const TONE_INTRO: Record<Tone, string> = {
  spiritual:
    'Sur le plan symbolique et spirituel, ce tirage invite à écouter ce qui résonne au-delà des apparences.',
  psychological:
    'Du point de vue psychologique, les cartes mettent en lumière des dynamiques intérieures et relationnelles.',
  direct:
    'De façon directe : voici une lecture actionnable, sans détour, pour t’aider à trancher ou avancer.',
}

function cardLine(p: PlacedCard): string {
  const orient = p.reversed ? ' (à l’envers — intensité ou blocage possible)' : ''
  const kw =
    p.card.keywords.length > 0
      ? p.card.keywords.join(', ')
      : 'lecture à préciser selon la couleur'
  return `**${p.positionLabel}** — ${p.card.nameFr}${orient} : mots-clés ${kw}.`
}

const CHANGE_IDS = new Set(['10', '12', '13', '16'])

export function buildMockInterpretation(opts: {
  profile: UserProfile
  spreadId: SpreadId
  spreadLabel: string
  tone: Tone
  cards: PlacedCard[]
}): string {
  const open = profileOpeningLine(opts.profile)
  const intro = TONE_INTRO[opts.tone]
  const lines = opts.cards.map(cardLine).join('\n\n')
  const mainNames = opts.cards.map((c) => c.card.nameFr).join(', ')
  const changeHint = opts.cards.some((c) => CHANGE_IDS.has(c.card.id))
    ? '\n\nOn sent ici un fil du **changement** ou de la **transformation** : l’IA pourra, avec un vrai modèle, relier ça à ton historique de tirages.'
    : ''

  let closing = ''
  if (opts.tone === 'direct') {
    closing =
      '\n\n**Conseil** : note une action concrète pour cette semaine (un appel, une limite posée, un rendez-vous avec toi-même).'
  } else if (opts.tone === 'psychological') {
    closing =
      '\n\n**Piste** : quelle émotion ce tirage fait-il monter ? Donne-lui un nom — c’est déjà un pas vers la clarté.'
  } else {
    closing =
      '\n\n**Invitation** : un rituel simple (journal, marche, tirage suivant dans 7 jours) peut ancrer ce message.'
  }

  return [
    `*${open}*`,
    '',
    `**Tirage : ${opts.spreadLabel}**`,
    intro,
    '',
    lines,
    '',
    `*(Prototype — texte généré localement pour illustrer l’IA. Cartes tirées : ${mainNames}.)*`,
    changeHint,
    closing,
  ].join('\n')
}
