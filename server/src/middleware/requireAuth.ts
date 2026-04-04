import type { RequestHandler } from 'express'
import { verifySessionToken } from '../lib/jwt.js'

export type AuthedRequest = Parameters<RequestHandler>[0] & {
  userId?: string
}

export const requireAuth: RequestHandler = (req, res, next) => {
  const raw = req.headers.authorization
  if (!raw?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authorization Bearer requis' })
    return
  }
  const token = raw.slice(7).trim()
  if (!token) {
    res.status(401).json({ error: 'Jeton manquant' })
    return
  }
  try {
    const { sub } = verifySessionToken(token)
    ;(req as AuthedRequest).userId = sub
    next()
  } catch {
    res.status(401).json({ error: 'Jeton invalide ou expiré' })
  }
}
