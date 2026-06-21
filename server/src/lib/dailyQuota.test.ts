import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { NextFunction, Request, Response } from 'express'
import { createDailyAiQuotaMiddleware, resetDailyQuotaForTests } from './dailyQuota.js'

function mockReqRes(opts: { ip?: string; userId?: string } = {}) {
  const req = {
    ip: opts.ip ?? '127.0.0.1',
    socket: { remoteAddress: opts.ip ?? '127.0.0.1' },
    header: (name: string) => {
      if (name.toLowerCase() === 'x-user-id') return opts.userId
      return undefined
    },
  } as Request

  let statusCode = 200
  let body: unknown
  const headers: Record<string, string> = {}

  const res = {
    setHeader: (key: string, value: string) => {
      headers[key] = value
    },
    status: (code: number) => {
      statusCode = code
      return res
    },
    json: (payload: unknown) => {
      body = payload
    },
  } as unknown as Response

  let nextCalled = false
  const next = (() => {
    nextCalled = true
  }) as NextFunction

  return {
    req,
    res,
    next,
    get statusCode() {
      return statusCode
    },
    get body() {
      return body
    },
    get nextCalled() {
      return nextCalled
    },
    headers,
  }
}

beforeEach(() => {
  resetDailyQuotaForTests()
  delete process.env.AI_DISABLED
  delete process.env.GEMINI_DISABLED
  delete process.env.AI_DAILY_QUOTA_PER_USER
})

afterEach(() => {
  vi.useRealTimers()
  delete process.env.AI_DISABLED
  delete process.env.GEMINI_DISABLED
  delete process.env.AI_DAILY_QUOTA_PER_USER
})

describe('createDailyAiQuotaMiddleware', () => {
  it('skips quota enforcement when AI is disabled', () => {
    process.env.AI_DISABLED = '1'
    const middleware = createDailyAiQuotaMiddleware()

    const call = mockReqRes({ userId: 'user-a' })
    middleware(call.req, call.res, call.next)
    expect(call.nextCalled).toBe(true)
    expect(call.headers['X-AI-Daily-Quota-Limit']).toBeUndefined()
  })

  it('limits requests per user id for the current UTC day', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-20T10:00:00.000Z'))
    process.env.AI_DAILY_QUOTA_PER_USER = '2'

    const middleware = createDailyAiQuotaMiddleware()

    const first = mockReqRes({ userId: 'quota-user' })
    middleware(first.req, first.res, first.next)
    expect(first.nextCalled).toBe(true)
    expect(first.headers['X-AI-Daily-Quota-Remaining']).toBe('1')

    const second = mockReqRes({ userId: 'quota-user' })
    middleware(second.req, second.res, second.next)
    expect(second.nextCalled).toBe(true)
    expect(second.headers['X-AI-Daily-Quota-Remaining']).toBe('0')

    const third = mockReqRes({ userId: 'quota-user' })
    middleware(third.req, third.res, third.next)
    expect(third.nextCalled).toBe(false)
    expect(third.statusCode).toBe(429)
    expect(third.body).toEqual({
      error: 'Quota journalier IA atteint. Réessaie demain.',
    })
  })

  it('resets quota on the next UTC day', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-20T23:59:00.000Z'))
    process.env.AI_DAILY_QUOTA_PER_USER = '1'

    const middleware = createDailyAiQuotaMiddleware()

    const dayOne = mockReqRes({ userId: 'daily-user' })
    middleware(dayOne.req, dayOne.res, dayOne.next)
    expect(dayOne.nextCalled).toBe(true)

    const dayOneBlocked = mockReqRes({ userId: 'daily-user' })
    middleware(dayOneBlocked.req, dayOneBlocked.res, dayOneBlocked.next)
    expect(dayOneBlocked.statusCode).toBe(429)

    vi.setSystemTime(new Date('2026-06-21T00:01:00.000Z'))

    const dayTwo = mockReqRes({ userId: 'daily-user' })
    middleware(dayTwo.req, dayTwo.res, dayTwo.next)
    expect(dayTwo.nextCalled).toBe(true)
  })

  it('falls back to IP when X-User-Id is missing', () => {
    process.env.AI_DAILY_QUOTA_PER_USER = '1'
    const middleware = createDailyAiQuotaMiddleware()

    const ipA = mockReqRes({ ip: '192.168.1.10' })
    middleware(ipA.req, ipA.res, ipA.next)
    expect(ipA.nextCalled).toBe(true)

    const ipABlocked = mockReqRes({ ip: '192.168.1.10' })
    middleware(ipABlocked.req, ipABlocked.res, ipABlocked.next)
    expect(ipABlocked.statusCode).toBe(429)

    const ipB = mockReqRes({ ip: '192.168.1.11' })
    middleware(ipB.req, ipB.res, ipB.next)
    expect(ipB.nextCalled).toBe(true)
  })
})
