import type { Request, Response, NextFunction } from 'express'

interface Entry {
  count: number
  resetAt: number
}

export function createRateLimiter(opts: {
  windowMs: number
  maxRequests: number
}) {
  const store = new Map<string, Entry>()

  setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of store) {
      if (entry.resetAt <= now) store.delete(key)
    }
  }, 60_000)

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip ?? req.socket.remoteAddress ?? 'unknown'
    const now = Date.now()
    let entry = store.get(ip)

    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + opts.windowMs }
      store.set(ip, entry)
    }

    entry.count += 1

    res.setHeader('X-RateLimit-Limit', String(opts.maxRequests))
    res.setHeader('X-RateLimit-Remaining', String(Math.max(0, opts.maxRequests - entry.count)))
    res.setHeader('X-RateLimit-Reset', String(Math.ceil(entry.resetAt / 1000)))

    if (entry.count > opts.maxRequests) {
      res.status(429).json({
        error: 'Trop de requetes. Reessaie dans quelques minutes.',
      })
      return
    }

    next()
  }
}
