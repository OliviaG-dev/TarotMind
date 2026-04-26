import { apiBase } from './apiBase'
import { getClientIdentity } from './clientIdentity'
import type { PlacedCard, UserProfile } from '../types/tarot'

type QuestionResponse = {
  interpretation: string
  source?: 'openai' | 'mock'
}

type ApiErrorResponse = {
  error?: string
}

export async function requestQuestion(opts: {
  question: string
  profile: UserProfile
  spreadLabel?: string
  cards?: PlacedCard[]
}): Promise<{ interpretation: string; source?: 'openai' | 'mock' }> {
  const response = await fetch(`${apiBase()}/question`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': getClientIdentity(),
    },
    body: JSON.stringify({
      question: opts.question,
      profile: opts.profile,
      spreadLabel: opts.spreadLabel,
      cards: opts.cards?.map((c) => ({
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
      // ignore
    }
    throw new Error(apiError || `question API ${response.status}`)
  }

  const body = (await response.json()) as QuestionResponse
  if (!body?.interpretation || typeof body.interpretation !== 'string') {
    throw new Error('question API invalid payload')
  }
  return {
    interpretation: body.interpretation,
    source: body.source,
  }
}
