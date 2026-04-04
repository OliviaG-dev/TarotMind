import type { DrawnCard, PlacedCard, TarotCard } from '../types/tarot'

export const MAJOR_ARCANA: TarotCard[] = [
  { id: '0', nameFr: 'Le Mat', keywords: ['nouveau départ', 'liberté', 'innocence'] },
  { id: '1', nameFr: 'Le Bateleur', keywords: ['potentiel', 'ressources', 'début'] },
  { id: '2', nameFr: 'La Papesse', keywords: ['intuition', 'secret', 'patience'] },
  { id: '3', nameFr: "L'Impératrice", keywords: ['abondance', 'soin', 'création'] },
  { id: '4', nameFr: "L'Empereur", keywords: ['structure', 'autorité', 'stabilité'] },
  { id: '5', nameFr: 'Le Pape', keywords: ['transmission', 'valeurs', 'conseil'] },
  { id: '6', nameFr: "L'Amoureux", keywords: ['choix', 'alignement', 'union'] },
  { id: '7', nameFr: 'Le Chariot', keywords: ['volonté', 'direction', 'victoire'] },
  { id: '8', nameFr: 'La Justice', keywords: ['équilibre', 'vérité', 'responsabilité'] },
  { id: '9', nameFr: "L'Hermite", keywords: ['recul', 'sagesse', 'clarification'] },
  {
    id: '10',
    nameFr: 'La Roue de Fortune',
    keywords: ['changement', 'cycles', 'opportunité'],
  },
  { id: '11', nameFr: 'La Force', keywords: ['courage', 'douceur', 'maîtrise'] },
  { id: '12', nameFr: 'Le Pendu', keywords: ['pause', 'lâcher-prise', 'perspective'] },
  { id: '13', nameFr: 'L’Arcane sans nom', keywords: ['transition', 'fin de cycle'] },
  { id: '14', nameFr: 'Tempérance', keywords: ['harmonie', 'patience', 'guérison'] },
  { id: '15', nameFr: 'Le Diable', keywords: ['attachement', 'ombre', 'libération'] },
  { id: '16', nameFr: 'La Maison Dieu', keywords: ['bouleversement', 'vérité', 'renouveau'] },
  { id: '17', nameFr: "L'Étoile", keywords: ['espoir', 'inspiration', 'guidance'] },
  { id: '18', nameFr: 'La Lune', keywords: ['émotions', 'intuition', 'flou'] },
  { id: '19', nameFr: 'Le Soleil', keywords: ['joie', 'clarté', 'vitalité'] },
  { id: '20', nameFr: 'Le Jugement', keywords: ['réveil', 'appel', 'renaissance'] },
  { id: '21', nameFr: 'Le Monde', keywords: ['accomplissement', 'intégration', 'ouverture'] },
]

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export function drawCards(count: number): DrawnCard[] {
  const picked = shuffle(MAJOR_ARCANA).slice(0, count)
  return picked.map((card) => ({
    card,
    reversed: Math.random() < 0.22,
  }))
}

export function placeCards(
  positions: { key: string; label: string }[],
  drawn: DrawnCard[],
): PlacedCard[] {
  return positions.map((pos, i) => ({
    positionKey: pos.key,
    positionLabel: pos.label,
    card: drawn[i]!.card,
    reversed: drawn[i]!.reversed,
  }))
}
