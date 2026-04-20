import { describe, it, expect, beforeEach } from 'vitest'

const store: Record<string, string> = {}

Object.defineProperty(globalThis, 'localStorage', {
  value: {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { for (const k of Object.keys(store)) delete store[k] },
  },
  writable: true,
})

beforeEach(() => {
  localStorage.clear()
})

describe('getDailyCard', async () => {
  const { getDailyCard, getDailyMessage } = await import('./dailyCard')

  it('returns a card with nameFr and keywords', () => {
    const daily = getDailyCard()
    expect(daily.card).toBeDefined()
    expect(daily.card.nameFr).toBeTruthy()
    expect(daily.card.keywords.length).toBeGreaterThan(0)
    expect(typeof daily.reversed).toBe('boolean')
    expect(daily.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('returns the same card on repeated calls (same day)', () => {
    const a = getDailyCard()
    const b = getDailyCard()
    expect(a.card.id).toBe(b.card.id)
    expect(a.reversed).toBe(b.reversed)
  })

  it('getDailyMessage returns a non-empty string', () => {
    const daily = getDailyCard()
    const msg = getDailyMessage(daily.card.id, daily.reversed)
    expect(typeof msg).toBe('string')
    expect(msg.length).toBeGreaterThan(10)
  })
})
