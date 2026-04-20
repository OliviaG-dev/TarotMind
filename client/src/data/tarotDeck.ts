import type { DeckPreference, DrawnCard, PlacedCard, TarotCard } from '../types/tarot'

const byId = new Map<string, TarotCard>()

const MINOR_SUITS = [
  { id: 'coupes', name: 'Coupes' },
  { id: 'batons', name: 'Bâtons' },
  { id: 'epees', name: 'Épées' },
  { id: 'deniers', name: 'Deniers' },
] as const

const MINOR_KEYWORDS: Record<string, string[][]> = {
  coupes: [
    ['amour naissant', 'intuition', 'offrande'],
    ['union', 'harmonie', 'attirance'],
    ['celebration', 'amitie', 'partage'],
    ['repli', 'lassitude', 'reflexion'],
    ['deuil', 'perte', 'nostalgie'],
    ['enfance', 'souvenir', 'tendresse'],
    ['illusion', 'reve', 'choix flou'],
    ['depart', 'abandon', 'quete'],
    ['satisfaction', 'voeu exauce', 'plenitude'],
    ['bonheur familial', 'accomplissement', 'gratitude'],
    ['sensibilite', 'message', 'creativite'],
    ['romantisme', 'seduction', 'charme'],
    ['compassion', 'sagesse du coeur', 'empathie'],
    ['maturite emotionnelle', 'generosite', 'equilibre'],
  ],
  batons: [
    ['elan', 'inspiration', 'potentiel'],
    ['planification', 'ambition', 'decision'],
    ['expansion', 'vision', 'commerce'],
    ['fete', 'fondation', 'etape'],
    ['competition', 'conflit', 'defi'],
    ['victoire', 'reconnaissance', 'fierte'],
    ['perseverance', 'defense', 'courage'],
    ['vitesse', 'mouvement', 'progression'],
    ['resilience', 'vigilance', 'endurance'],
    ['charge', 'responsabilite', 'surmenage'],
    ['aventure', 'enthousiasme', 'decouverte'],
    ['passion', 'energie', 'leadership'],
    ['charisme', 'confiance', 'determination'],
    ['autorite', 'vision strategique', 'entreprenariat'],
  ],
  epees: [
    ['verite', 'clarte', 'percee'],
    ['indecision', 'blocage', 'compromise'],
    ['chagrin', 'rupture', 'separation'],
    ['repos', 'recuperation', 'pause'],
    ['defaite', 'humiliation', 'lecon'],
    ['transition', 'passage', 'soulagement'],
    ['ruse', 'strategie', 'fuite'],
    ['prison mentale', 'impuissance', 'anxiete'],
    ['insomnie', 'culpabilite', 'inquietude'],
    ['fin brutale', 'epuisement', 'limite'],
    ['perspicacite', 'curiosite', 'esprit vif'],
    ['communication', 'franchise', 'rapidite'],
    ['discernement', 'autorite intellectuelle', 'objectivite'],
    ['justice', 'logique', 'decision tranchee'],
  ],
  deniers: [
    ['opportunite', 'prosperite', 'debut materiel'],
    ['equilibre', 'gestion', 'adaptation'],
    ['maitrise', 'savoir-faire', 'collaboration'],
    ['securite', 'possession', 'controle'],
    ['precarite', 'isolement', 'epreuve'],
    ['generosite', 'partage', 'charite'],
    ['patience', 'investissement', 'croissance'],
    ['apprentissage', 'perfectionnement', 'rigueur'],
    ['independance', 'abondance', 'luxe'],
    ['heritage', 'famille', 'patrimoine'],
    ['etude', 'concentration', 'pragmatisme'],
    ['fiabilite', 'travail', 'methodique'],
    ['confort', 'abondance', 'nature'],
    ['reussite materielle', 'influence', 'stabilite'],
  ],
}

const MINOR_RANKS = [
  'As', '2', '3', '4', '5', '6', '7', '8', '9', '10',
  'Valet', 'Cavalier', 'Dame', 'Roi',
] as const

function buildMinorArcana(): TarotCard[] {
  const out: TarotCard[] = []
  for (const suit of MINOR_SUITS) {
    MINOR_RANKS.forEach((rank, i) => {
      const kw = MINOR_KEYWORDS[suit.id]?.[i]
      out.push({
        id: `minor-${suit.id}-${i}`,
        nameFr: `${rank} de ${suit.name}`,
        keywords: kw ?? ['mineur', suit.name.toLowerCase(), 'quotidien'],
      })
    })
  }
  return out
}

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

export const MINOR_ARCANA: TarotCard[] = buildMinorArcana()

const MAJOR_ID_SET = new Set(MAJOR_ARCANA.map((c) => c.id))

for (const c of MAJOR_ARCANA) {
  byId.set(c.id, c)
}
for (const c of MINOR_ARCANA) {
  byId.set(c.id, c)
}

export function isMajorArcanum(card: TarotCard): boolean {
  return MAJOR_ID_SET.has(card.id)
}

export function getDeckCards(preference: DeckPreference): TarotCard[] {
  switch (preference) {
    case 'majors_only':
      return MAJOR_ARCANA
    case 'minors_only':
      return MINOR_ARCANA
    case 'majors_and_minors':
      return [...MAJOR_ARCANA, ...MINOR_ARCANA]
  }
}

export function getCardById(id: string): TarotCard | undefined {
  return byId.get(id)
}

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
