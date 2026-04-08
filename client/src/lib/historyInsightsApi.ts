import { apiBase } from './apiBase'
import type { DrawRecord, UserProfile } from '../types/tarot'

type ApiErrorResponse = { error?: string }
type HistoryInsightsResponse = {
  interpretation: string
  source?: 'openai' | 'mock'
}
const CACHE_KEY = 'tarotmind.historyInsights.cache.v1'
const CACHE_TTL_MS = 1000 * 60 * 60 * 12

function topCards(draws: DrawRecord[]): Array<{ name: string; count: number }> {
  const m = new Map<string, number>()
  for (const d of draws) {
    for (const c of d.cards) {
      m.set(c.card.nameFr, (m.get(c.card.nameFr) ?? 0) + 1)
    }
  }
  return [...m.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({ name, count }))
}

function signatureOf(opts: { profile: UserProfile; draws: DrawRecord[] }): string {
  const payload = {
    profile: opts.profile,
    draws: opts.draws.slice(0, 12).map((d) => ({
      spreadLabel: d.spreadLabel,
      tone: d.tone,
      cards: d.cards.map((c) => ({
        pos: c.positionLabel,
        name: c.card.nameFr,
        rev: c.reversed,
      })),
    })),
  }
  const s = JSON.stringify(payload)
  let h = 2166136261
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i)
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24)
  }
  return `h${(h >>> 0).toString(16)}`
}

function readCached(signature: string): string | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Record<
      string,
      { text: string; createdAt: number }
    >
    const item = parsed[signature]
    if (!item) return null
    if (Date.now() - item.createdAt > CACHE_TTL_MS) return null
    return item.text
  } catch {
    return null
  }
}

function writeCached(signature: string, text: string) {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    const parsed = raw
      ? (JSON.parse(raw) as Record<string, { text: string; createdAt: number }>)
      : {}
    parsed[signature] = { text, createdAt: Date.now() }
    localStorage.setItem(CACHE_KEY, JSON.stringify(parsed))
  } catch {
    // ignore cache write failures
  }
}

export async function requestHistoryInsights(opts: {
  profile: UserProfile
  draws: DrawRecord[]
}): Promise<{ interpretation: string; source?: 'openai' | 'mock' | 'cache' }> {
  const signature = signatureOf(opts)
  const cached = readCached(signature)
  if (cached) {
    return { interpretation: cached, source: 'cache' }
  }

  const recentDraws = opts.draws.slice(0, 12).map((d) => ({
    createdAt: d.createdAt,
    spreadLabel: d.spreadLabel,
    tone: d.tone,
    cards: d.cards.map((c) => ({
      positionLabel: c.positionLabel,
      cardName: c.card.nameFr,
      reversed: c.reversed,
    })),
  }))

  const response = await fetch(`${apiBase()}/history-insights`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      profile: opts.profile,
      draws: recentDraws,
      topCards: topCards(opts.draws),
    }),
  })

  if (!response.ok) {
    let apiError = ''
    try {
      const body = (await response.json()) as ApiErrorResponse
      apiError = typeof body?.error === 'string' ? body.error : ''
    } catch {
      // ignore json parse failures
    }
    throw new Error(apiError || `history insights API ${response.status}`)
  }

  const body = (await response.json()) as HistoryInsightsResponse
  if (!body?.interpretation || typeof body.interpretation !== 'string') {
    throw new Error('history insights API invalid payload')
  }
  writeCached(signature, body.interpretation)
  return { interpretation: body.interpretation, source: body.source }
}
