export type Tone = 'spiritual' | 'psychological' | 'direct'

export type SpreadId =
  | 'one'
  | 'three_ppf'
  | 'cross'
  | 'love'
  | 'career'
  | 'decision'

export type RelationshipStatus =
  | 'single'
  | 'couple'
  | 'complicated'
  | 'separation'
  | 'prefer_not'

export type Gender = 'female' | 'male' | 'non_binary' | 'other' | 'prefer_not'

export type WorkSituation =
  | 'student'
  | 'employed'
  | 'freelance'
  | 'seeking'
  | 'retired'
  | 'other'

export type GoalId = 'love' | 'money' | 'wellbeing'

/** Jeu utilisé pour les tirages (listes déroulantes + interprétations). */
export type DeckPreference =
  | 'majors_only'
  | 'majors_and_minors'
  | 'minors_only'

export interface UserProfile {
  relationshipStatus: RelationshipStatus
  gender: Gender
  workSituation: WorkSituation
  goals: GoalId[]
  deckPreference: DeckPreference
}

export interface TarotCard {
  id: string
  nameFr: string
  keywords: string[]
}

export interface DrawnCard {
  card: TarotCard
  reversed: boolean
}

export interface PlacedCard extends DrawnCard {
  positionKey: string
  positionLabel: string
}

export interface DrawRecord {
  id: string
  createdAt: string
  spreadId: SpreadId
  spreadLabel: string
  tone: Tone
  cards: PlacedCard[]
  interpretation: string
}

export interface SpreadDefinition {
  id: SpreadId
  label: string
  description: string
  emoji: string
  positions: { key: string; label: string }[]
}
