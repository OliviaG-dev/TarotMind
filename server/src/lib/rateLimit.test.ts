import { describe, expect, it, vi, afterEach } from 'vitest'
import type { NextFunction, Request, Response } from 'express'
import { createRateLimiter } from './rateLimit.js'

function mockReqRes(ip = '127.0.0.1') {
  const req = {
    ip,
    socket: { remoteAddress: ip },
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

afterEach(() => {
  vi.useRealTimers()
})

describe('createRateLimiter', () => {
  it('allows requests up to maxRequests and blocks the next one', () => {
    const limiter = createRateLimiter({ windowMs: 60_000, maxRequests: 2 })

    const first = mockReqRes()
    limiter(first.req, first.res, first.next)
    expect(first.nextCalled).toBe(true)
    expect(first.headers['X-RateLimit-Remaining']).toBe('1')

    const second = mockReqRes()
    limiter(second.req, second.res, second.next)
    expect(second.nextCalled).toBe(true)
    expect(second.headers['X-RateLimit-Remaining']).toBe('0')

    const third = mockReqRes()
    limiter(third.req, third.res, third.next)
    expect(third.nextCalled).toBe(false)
    expect(third.statusCode).toBe(429)
    expect(third.body).toEqual({
      error: 'Trop de requetes. Reessaie dans quelques minutes.',
    })
  })

  it('tracks limits independently per IP', () => {
    const limiter = createRateLimiter({ windowMs: 60_000, maxRequests: 1 })

    const ipAFirst = mockReqRes('10.0.0.1')
    limiter(ipAFirst.req, ipAFirst.res, ipAFirst.next)
    expect(ipAFirst.nextCalled).toBe(true)

    const ipASecond = mockReqRes('10.0.0.1')
    limiter(ipASecond.req, ipASecond.res, ipASecond.next)
    expect(ipASecond.statusCode).toBe(429)

    const ipBFirst = mockReqRes('10.0.0.2')
    limiter(ipBFirst.req, ipBFirst.res, ipBFirst.next)
    expect(ipBFirst.nextCalled).toBe(true)
  })

  it('resets the window after windowMs elapses', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-20T12:00:00.000Z'))

    const limiter = createRateLimiter({ windowMs: 60_000, maxRequests: 1 })

    const blocked = mockReqRes()
    limiter(blocked.req, blocked.res, blocked.next)
    expect(blocked.nextCalled).toBe(true)

    const rejected = mockReqRes()
    limiter(rejected.req, rejected.res, rejected.next)
    expect(rejected.statusCode).toBe(429)

    vi.advanceTimersByTime(60_001)

    const afterReset = mockReqRes()
    limiter(afterReset.req, afterReset.res, afterReset.next)
    expect(afterReset.nextCalled).toBe(true)
  })
})
