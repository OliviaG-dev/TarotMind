import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import request from 'supertest'
import { createApp } from '../app.js'
import { resetAiUsageForTests } from '../lib/aiUsage.js'
import { resetDailyQuotaForTests } from '../lib/dailyQuota.js'

vi.mock('../lib/openai.js', () => ({
  generateInterpretationDetailed: vi.fn(async () => ({
    text: 'Interpretation test',
    inputTokens: 120,
    outputTokens: 180,
  })),
}))

const interpretPayload = {
  tone: 'psychological',
  spreadLabel: 'Une carte',
  question: 'Que dois-je comprendre ?',
  cards: [
    {
      positionLabel: 'Carte',
      cardName: 'Le Mat',
      reversed: false,
      keywords: ['depart', 'elan'],
    },
  ],
}

const questionPayload = {
  question: 'Que dois-je faire cette semaine ?',
}

const historyPayload = {
  draws: [
    {
      createdAt: new Date().toISOString(),
      spreadLabel: 'Une carte',
      tone: 'psychological',
      cards: [{ positionLabel: 'Carte', cardName: 'Le Mat', reversed: false }],
    },
  ],
}

beforeEach(() => {
  resetAiUsageForTests()
  resetDailyQuotaForTests()
})

afterEach(() => {
  delete process.env.AI_DISABLED
  delete process.env.GEMINI_DISABLED
  delete process.env.AI_DAILY_QUOTA_PER_USER
})

describe('interpret routes integration in mock mode', () => {
  it('responds on /interpret, /question and /history-insights', async () => {
    process.env.AI_DISABLED = '1'
    const app = createApp()

    const interpretRes = await request(app).post('/interpret').send(interpretPayload)
    expect(interpretRes.status).toBe(200)
    expect(interpretRes.body.source).toBe('mock')
    expect(typeof interpretRes.body.interpretation).toBe('string')

    const questionRes = await request(app).post('/question').send(questionPayload)
    expect(questionRes.status).toBe(200)
    expect(questionRes.body.source).toBe('mock')

    const historyRes = await request(app).post('/history-insights').send(historyPayload)
    expect(historyRes.status).toBe(200)
    expect(historyRes.body.source).toBe('mock')
  })

  it('exposes ai usage metrics including fallback rate', async () => {
    process.env.AI_DISABLED = '1'
    const app = createApp()

    await request(app).post('/interpret').send(interpretPayload)
    await request(app).post('/question').send(questionPayload)

    const usageRes = await request(app).get('/ai-usage')
    expect(usageRes.status).toBe(200)
    expect(usageRes.body.totals.requests).toBe(2)
    expect(usageRes.body.totals.mockRequests).toBe(2)
    expect(usageRes.body.totals.fallbackRate).toBe(1)
  })
})

describe('interpret payload validation', () => {
  beforeEach(() => {
    process.env.AI_DISABLED = '1'
  })

  it('rejects invalid tone, missing spreadLabel and invalid cards', async () => {
    const app = createApp()

    const invalidTone = await request(app)
      .post('/interpret')
      .send({ ...interpretPayload, tone: 'invalid' })
    expect(invalidTone.status).toBe(400)
    expect(invalidTone.body.error).toBe('tone invalide')

    const missingSpread = await request(app)
      .post('/interpret')
      .send({ ...interpretPayload, spreadLabel: '   ' })
    expect(missingSpread.status).toBe(400)
    expect(missingSpread.body.error).toBe('spreadLabel requis')

    const invalidCards = await request(app)
      .post('/interpret')
      .send({ ...interpretPayload, cards: [{ positionLabel: 'Carte' }] })
    expect(invalidCards.status).toBe(400)
    expect(invalidCards.body.error).toBe('cards invalides')
  })

  it('rejects short questions and empty history draws', async () => {
    const app = createApp()

    const shortQuestion = await request(app).post('/question').send({ question: 'ab' })
    expect(shortQuestion.status).toBe(400)
    expect(shortQuestion.body.error).toContain('3 caractères min')

    const missingDraws = await request(app).post('/history-insights').send({ draws: [] })
    expect(missingDraws.status).toBe(400)
    expect(missingDraws.body.error).toBe('draws requis')
  })
})

describe('daily AI quota integration', () => {
  it('limits requests per user per day when IA is enabled', async () => {
    process.env.AI_DAILY_QUOTA_PER_USER = '1'
    const app = createApp()

    const first = await request(app)
      .post('/question')
      .set('X-User-Id', 'test-user')
      .send(questionPayload)
    expect(first.status).toBe(200)

    const second = await request(app)
      .post('/question')
      .set('X-User-Id', 'test-user')
      .send(questionPayload)
    expect(second.status).toBe(429)
    expect(second.body.error).toContain('Quota journalier IA')
  })
})
