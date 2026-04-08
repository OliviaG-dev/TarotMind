import { apiBase } from './apiBase'
import type { PlacedCard, Tone, UserProfile } from '../types/tarot'

type InterpretResponse = {
  interpretation: string
  source?: 'openai' | 'mock'
}

type ApiErrorResponse = {
  error?: string
}

export async function requestInterpretation(opts: {
  tone: Tone
  spreadLabel: string
  question?: string
  profile: UserProfile
  cards: PlacedCard[]
}): Promise<{ interpretation: string; source?: 'openai' | 'mock' }> {
  const response = await fetch(`${apiBase()}/interpret`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tone: opts.tone,
      spreadLabel: opts.spreadLabel,
      question: opts.question ?? '',
      profile: opts.profile,
      cards: opts.cards.map((c) => ({
        positionLabel: c.positionLabel,
        cardName: c.card.nameFr,
        reversed: c.reversed,
        keywords: c.card.keywords,
      })),
    }),
  })

  if (!response.ok) {
    let apiError = ''
    try {
      const body = (await response.json()) as ApiErrorResponse
      apiError = typeof body?.error === 'string' ? body.error : ''
    } catch {
      // ignore JSON parse failure
    }
    throw new Error(apiError || `interpret API ${response.status}`)
  }

  const body = (await response.json()) as InterpretResponse
  if (!body?.interpretation || typeof body.interpretation !== 'string') {
    throw new Error('interpret API invalid payload')
  }
  return {
    interpretation: body.interpretation,
    source: body.source,
  }
}
