import { describe, it, expect } from 'vitest'
import { buildHistoryInsights } from './historyInsights'
import type { DrawRecord } from '../types/tarot'

describe('buildHistoryInsights', () => {
  it('returns a default message for no draws', () => {
    const result = buildHistoryInsights([])
    expect(result.length).toBeGreaterThan(0)
    expect(result[0]).toContain('premier tirage')
  })

  it('returns insight lines for draws', () => {
    const draws: DrawRecord[] = [
      {
        id: '1',
        createdAt: new Date().toISOString(),
        spreadId: 'one',
        spreadLabel: '1 carte',
        tone: 'direct',
        cards: [
          {
            positionKey: 'focus',
            positionLabel: 'Message',
            card: { id: '0', nameFr: 'Le Mat', keywords: ['nouveau départ'] },
            reversed: false,
          },
        ],
        interpretation: 'test',
      },
    ]
    const result = buildHistoryInsights(draws)
    expect(Array.isArray(result)).toBe(true)
  })
})
