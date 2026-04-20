import { describe, it, expect } from 'vitest'
import { MAJOR_ARCANA, MINOR_ARCANA, getDeckCards, getCardById, isMajorArcanum } from './tarotDeck'

describe('tarotDeck', () => {
  it('has 22 major arcana', () => {
    expect(MAJOR_ARCANA).toHaveLength(22)
  })

  it('has 56 minor arcana', () => {
    expect(MINOR_ARCANA).toHaveLength(56)
  })

  it('every card has id, nameFr, and non-empty keywords', () => {
    const allCards = [...MAJOR_ARCANA, ...MINOR_ARCANA]
    for (const card of allCards) {
      expect(card.id).toBeTruthy()
      expect(card.nameFr).toBeTruthy()
      expect(card.keywords.length).toBeGreaterThan(0)
      for (const kw of card.keywords) {
        expect(kw).not.toBe('mineur')
      }
    }
  })

  it('minor arcana have specific (non-generic) keywords', () => {
    for (const card of MINOR_ARCANA) {
      expect(card.keywords).not.toEqual(
        expect.arrayContaining(['quotidien']),
      )
    }
  })

  it('getDeckCards returns correct subsets', () => {
    expect(getDeckCards('majors_only')).toHaveLength(22)
    expect(getDeckCards('minors_only')).toHaveLength(56)
    expect(getDeckCards('majors_and_minors')).toHaveLength(78)
  })

  it('getCardById finds cards', () => {
    expect(getCardById('0')?.nameFr).toBe('Le Mat')
    expect(getCardById('minor-coupes-0')?.nameFr).toBe('As de Coupes')
    expect(getCardById('nonexistent')).toBeUndefined()
  })

  it('isMajorArcanum correctly identifies', () => {
    expect(isMajorArcanum(MAJOR_ARCANA[0]!)).toBe(true)
    expect(isMajorArcanum(MINOR_ARCANA[0]!)).toBe(false)
  })
})
