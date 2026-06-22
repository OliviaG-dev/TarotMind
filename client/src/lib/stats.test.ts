import { describe, expect, it } from 'vitest'
import {
  buildActivityTimeline,
  computeStats,
  filterDrawsByPeriod,
} from './stats'
import type { DrawRecord } from '../types/tarot'

function makeDraw(overrides: Partial<DrawRecord> & Pick<DrawRecord, 'createdAt'>): DrawRecord {
  return {
    id: overrides.id ?? 'draw-1',
    spreadId: overrides.spreadId ?? 'one',
    spreadLabel: overrides.spreadLabel ?? '1 carte',
    tone: overrides.tone ?? 'psychological',
    cards: overrides.cards ?? [
      {
        positionKey: 'focus',
        positionLabel: 'Message',
        card: { id: '0', nameFr: 'Le Mat', keywords: ['liberté'] },
        reversed: false,
      },
    ],
    interpretation: overrides.interpretation ?? 'test',
    ...overrides,
  }
}

describe('filterDrawsByPeriod', () => {
  it('returns all draws for period all', () => {
    const draws = [makeDraw({ createdAt: '2020-01-01T12:00:00.000Z' })]
    expect(filterDrawsByPeriod(draws, 'all')).toHaveLength(1)
  })

  it('filters draws older than 7 days', () => {
    const old = makeDraw({
      id: 'old',
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    })
    const recent = makeDraw({
      id: 'recent',
      createdAt: new Date().toISOString(),
    })
    const filtered = filterDrawsByPeriod([old, recent], '7d')
    expect(filtered.map((d) => d.id)).toEqual(['recent'])
  })
})

describe('computeStats', () => {
  it('aggregates tones and top cards', () => {
    const draws: DrawRecord[] = [
      makeDraw({
        id: 'a',
        createdAt: new Date().toISOString(),
        tone: 'spiritual',
        question: 'Que faire ?',
        favorite: true,
      }),
      makeDraw({
        id: 'b',
        createdAt: new Date().toISOString(),
        tone: 'direct',
      }),
    ]

    const stats = computeStats(draws, 'all')
    expect(stats.total).toBe(2)
    expect(stats.questions).toBe(1)
    expect(stats.favorites).toBe(1)
    expect(stats.topCards[0]?.nameFr).toBe('Le Mat')
    expect(stats.tones.find((t) => t.tone === 'spiritual')?.count).toBe(1)
    expect(stats.tones.find((t) => t.tone === 'direct')?.count).toBe(1)
  })
})

describe('buildActivityTimeline', () => {
  it('returns 7 daily buckets for 7d period', () => {
    const buckets = buildActivityTimeline([], '7d')
    expect(buckets).toHaveLength(7)
  })

  it('returns 12 weekly buckets for all period', () => {
    const buckets = buildActivityTimeline([], 'all')
    expect(buckets).toHaveLength(12)
  })
})
