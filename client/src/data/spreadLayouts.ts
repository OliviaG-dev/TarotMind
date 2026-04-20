import type { SpreadId } from '../types/tarot'

/** Forme du tapis / schéma affiché pour chaque type de tirage. */
export type SpreadLayoutKind = 'single' | 'row3' | 'triangle3' | 'cross5'

export const SPREAD_LAYOUT: Record<SpreadId, SpreadLayoutKind> = {
  one: 'single',
  three_ppf: 'row3',
  cross: 'cross5',
  love: 'triangle3',
  career: 'triangle3',
  decision: 'triangle3',
  compatibility: 'cross5',
}
