import type { DrawRecord } from '../types/tarot'

const CHANGE_NAMES = new Set([
  'La Roue de Fortune',
  'Le Pendu',
  'L’Arcane sans nom',
  'La Maison Dieu',
])

const EMOTION_NAMES = new Set(['La Lune', 'Tempérance', 'Le Soleil', "L'Étoile"])

function countCardOccurrences(draws: DrawRecord[]): Map<string, number> {
  const m = new Map<string, number>()
  for (const d of draws) {
    for (const c of d.cards) {
      const n = c.card.nameFr
      m.set(n, (m.get(n) ?? 0) + 1)
    }
  }
  return m
}

export function buildHistoryInsights(draws: DrawRecord[]): string[] {
  if (draws.length === 0) {
    return [
      'Fais ton premier tirage pour que l’IA puisse repérer des motifs dans tes cartes au fil du temps.',
    ]
  }

  const out: string[] = []
  const counts = countCardOccurrences(draws)
  let changeHits = 0
  let emotionHits = 0
  for (const d of draws) {
    for (const c of d.cards) {
      if (CHANGE_NAMES.has(c.card.nameFr)) changeHits += 1
      if (EMOTION_NAMES.has(c.card.nameFr)) emotionHits += 1
    }
  }

  if (changeHits >= 3) {
    out.push(
      'Tu tires souvent des cartes liées au **changement** et aux cycles — thème de transition et de renouveau.',
    )
  }

  if (emotionHits >= 3) {
    out.push(
      'Plusieurs tirages évoquent **émotions, équilibre et clarté** : un fil de quête intérieure se dessine.',
    )
  }

  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1])
  const top = sorted[0]
  if (top && top[1] >= 2) {
    out.push(
      `La carte **${top[0]}** revient souvent (${top[1]} fois) : l’IA pourra creuser ce motif avec ton profil.`,
    )
  }

  const last = draws[0]
  if (last) {
    const names = last.cards.map((c) => c.card.nameFr).join(', ')
    out.push(
      `Dernier tirage (${last.spreadLabel}) : **${names}**. Thème actuel possible : **évolution personnelle** (aperçu prototype).`,
    )
  }

  if (out.length === 0) {
    out.push(
      'Continue à tirer : avec plus de données, l’IA identifiera des tendances (amour, carrière, décision) sur ta timeline.',
    )
  }

  return out
}
