import type { SpreadDefinition, SpreadId } from '../types/tarot'

export const SPREADS: SpreadDefinition[] = [
  {
    id: 'one',
    label: '1 carte',
    description: 'Réponse rapide à une question précise.',
    icon: '/icons/1carte.png',
    positions: [{ key: 'focus', label: 'Message du moment' }],
  },
  {
    id: 'three_ppf',
    label: '3 cartes — passé / présent / futur',
    description: 'Ligne du temps : racines, situation actuelle, tendance.',
    icon: '/icons/passe-present-futur.png',
    positions: [
      { key: 'past', label: 'Passé' },
      { key: 'present', label: 'Présent' },
      { key: 'future', label: 'Futur' },
    ],
  },
  {
    id: 'cross',
    label: 'Tirage en croix',
    description: 'Vue d’ensemble : blocages, contexte et conseil.',
    icon: '/icons/tirage-croix.png',
    positions: [
      { key: 'center', label: 'Situation centrale' },
      { key: 'cross', label: 'Obstacle ou défi' },
      { key: 'base', label: 'Fondations / racines' },
      { key: 'crown', label: 'Objectif possible' },
      { key: 'outcome', label: 'Synthèse / conseil' },
    ],
  },
  {
    id: 'love',
    label: 'Amour',
    description: 'Cœur, dynamique relationnelle, piste à cultiver.',
    icon: '/icons/tirage-amour.png',
    positions: [
      { key: 'heart', label: 'État du cœur' },
      { key: 'bond', label: 'Dynamique' },
      { key: 'advice_love', label: 'Conseil' },
    ],
  },
  {
    id: 'career',
    label: 'Carrière',
    description: 'Contexte pro, tension utile, opportunité.',
    icon: '/icons/tirage-carriere.png',
    positions: [
      { key: 'context', label: 'Contexte professionnel' },
      { key: 'tension', label: 'Défi ou tension' },
      { key: 'opening', label: 'Opportunité' },
    ],
  },
  {
    id: 'decision',
    label: 'Décision',
    description: 'Éclairer un choix : question, piste A, piste B.',
    icon: '/icons/tirage-decision.png',
    positions: [
      { key: 'question', label: 'Ta question / enjeu' },
      { key: 'path_a', label: 'Piste 1' },
      { key: 'path_b', label: 'Piste 2' },
    ],
  },
  {
    id: 'compatibility',
    label: 'Compatibilite',
    description: 'Explore la dynamique entre deux personnes : toi, l\'autre, et ce qui vous relie.',
    icon: '/icons/tirage-amour.png',
    positions: [
      { key: 'person_a', label: 'Toi' },
      { key: 'person_b', label: 'L\'autre' },
      { key: 'bond', label: 'Ce qui vous relie' },
      { key: 'challenge', label: 'Le defi' },
      { key: 'advice_compat', label: 'Conseil' },
    ],
  },
]

export function getSpread(id: SpreadId): SpreadDefinition | undefined {
  return SPREADS.find((s) => s.id === id)
}
