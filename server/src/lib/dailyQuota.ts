import type { Request, Response, NextFunction } from 'express'
import { envFlag, envInt } from './envFlags.js'

type Entry = {
  dateKey: string
  count: number
}

const store = new Map<string, Entry>()

function todayUtcKey(d = new Date()): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`
}

function userKeyFromRequest(req: Request): string {
  const userIdHeader = req.header('x-user-id')?.trim()
  if (userIdHeader) return `uid:${userIdHeader}`
  return `ip:${req.ip ?? req.socket.remoteAddress ?? 'unknown'}`
}

export function createDailyAiQuotaMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    // Quota is only meaningful when real IA calls are active.
    if (envFlag('AI_DISABLED') || envFlag('GEMINI_DISABLED')) {
      next()
      return
    }

    const limit = Math.max(1, envInt('AI_DAILY_QUOTA_PER_USER', 40))
    const key = userKeyFromRequest(req)
    const today = todayUtcKey()
    let entry = store.get(key)
    if (!entry || entry.dateKey !== today) {
      entry = { dateKey: today, count: 0 }
      store.set(key, entry)
    }

    entry.count += 1
    const remaining = Math.max(0, limit - entry.count)
    const resetAt = new Date(`${today}T23:59:59.999Z`).getTime()

    res.setHeader('X-AI-Daily-Quota-Limit', String(limit))
    res.setHeader('X-AI-Daily-Quota-Remaining', String(remaining))
    res.setHeader('X-AI-Daily-Quota-Reset', String(Math.floor(resetAt / 1000)))

    if (entry.count > limit) {
      res.status(429).json({
        error: 'Quota journalier IA atteint. Reessaie demain.',
      })
      return
    }

    next()
  }
}

export function resetDailyQuotaForTests() {
  store.clear()
}
