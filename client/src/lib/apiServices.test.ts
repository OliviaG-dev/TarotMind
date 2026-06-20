import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { DEFAULT_PROFILE } from '../context/ProfileContext'
import type { PlacedCard } from '../types/tarot'

vi.mock('./apiBase', () => ({
  apiBase: () => 'http://test.local/api',
}))

vi.mock('./clientIdentity', () => ({
  getClientIdentity: () => 'test-client-id',
}))

const sampleCard: PlacedCard = {
  positionKey: 'focus',
  positionLabel: 'Message du moment',
  reversed: false,
  card: {
    id: '0',
    nameFr: 'Le Mat',
    keywords: ['depart', 'elan'],
  },
}

describe('requestInterpretation', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns interpretation on success', async () => {
    const fetchMock = vi.mocked(fetch)
    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          interpretation: 'Lecture de test.',
          source: 'mock',
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    )

    const { requestInterpretation } = await import('./interpretApi')
    const result = await requestInterpretation({
      tone: 'psychological',
      spreadLabel: '1 carte',
      profile: DEFAULT_PROFILE,
      cards: [sampleCard],
    })

    expect(result.interpretation).toBe('Lecture de test.')
    expect(result.source).toBe('mock')
    expect(fetchMock).toHaveBeenCalledWith(
      'http://test.local/api/interpret',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'X-User-Id': 'test-client-id',
        }),
      }),
    )
  })

  it('throws API error message on failure', async () => {
    const fetchMock = vi.mocked(fetch)
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ error: 'tone invalide' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    const { requestInterpretation } = await import('./interpretApi')
    await expect(
      requestInterpretation({
        tone: 'psychological',
        spreadLabel: '1 carte',
        profile: DEFAULT_PROFILE,
        cards: [sampleCard],
      }),
    ).rejects.toThrow('tone invalide')
  })
})

describe('requestQuestion', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns interpretation on success', async () => {
    const fetchMock = vi.mocked(fetch)
    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          interpretation: 'Reponse question.',
          source: 'mock',
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    )

    const { requestQuestion } = await import('./questionApi')
    const result = await requestQuestion({
      question: 'Que faire cette semaine ?',
      profile: DEFAULT_PROFILE,
    })

    expect(result.interpretation).toBe('Reponse question.')
  })

  it('throws when payload is invalid', async () => {
    const fetchMock = vi.mocked(fetch)
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({}), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    const { requestQuestion } = await import('./questionApi')
    await expect(
      requestQuestion({
        question: 'Que faire cette semaine ?',
        profile: DEFAULT_PROFILE,
      }),
    ).rejects.toThrow('question API invalid payload')
  })
})

describe('requestHistoryInsights', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns cached interpretation without calling fetch', async () => {
    const fetchMock = vi.mocked(fetch)
    const { requestHistoryInsights } = await import('./historyInsightsApi')

    const draws = [
      {
        id: 'draw-1',
        createdAt: '2026-06-20T10:00:00.000Z',
        spreadId: 'one' as const,
        spreadLabel: '1 carte',
        tone: 'psychological' as const,
        cards: [sampleCard],
        interpretation: 'Lecture locale',
      },
    ]

    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          interpretation: 'Analyse historique.',
          source: 'mock',
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    )

    const first = await requestHistoryInsights({
      profile: DEFAULT_PROFILE,
      draws,
    })
    expect(first.source).toBe('mock')

    const second = await requestHistoryInsights({
      profile: DEFAULT_PROFILE,
      draws,
    })
    expect(second.source).toBe('cache')
    expect(second.interpretation).toBe('Analyse historique.')
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
