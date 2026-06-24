import { describe, expect, it } from 'vitest'
import { MINOR_ARCANA } from '../data/tarotDeck'
import { cardMatchesEncyclopediaSearch } from './encyclopediaSearch'

describe('cardMatchesEncyclopediaSearch', () => {
  const sevenOfDeniers = MINOR_ARCANA.find((card) => card.nameFr === '7 de Deniers')
  const kingOfDeniers = MINOR_ARCANA.find((card) => card.nameFr === 'Roi de Deniers')

  it('matches rank names without substring false positives', () => {
    expect(sevenOfDeniers).toBeDefined()
    expect(kingOfDeniers).toBeDefined()

    expect(cardMatchesEncyclopediaSearch(sevenOfDeniers!, 'roi')).toBe(false)
    expect(cardMatchesEncyclopediaSearch(kingOfDeniers!, 'roi')).toBe(true)
  })

  it('matches keyword prefixes and whole words', () => {
    expect(cardMatchesEncyclopediaSearch(sevenOfDeniers!, 'invest')).toBe(true)
    expect(cardMatchesEncyclopediaSearch(sevenOfDeniers!, 'croissance')).toBe(true)
    expect(cardMatchesEncyclopediaSearch(sevenOfDeniers!, 'crois')).toBe(true)
  })
})
