import { Router } from 'express'
import type { AuthGoogleBody } from '@tarotmind/shared'
import { findUserById, upsertUserFromGoogle } from '../db.js'
import { verifyGoogleIdToken } from '../lib/google.js'
import { signSessionToken } from '../lib/jwt.js'
import { requireAuth, type AuthedRequest } from '../middleware/requireAuth.js'

export const authRouter = Router()

authRouter.post('/auth/google', async (req, res) => {
  try {
    const body = req.body as AuthGoogleBody
    if (!body?.idToken || typeof body.idToken !== 'string') {
      res.status(400).json({ error: 'Champ idToken requis' })
      return
    }
    const g = await verifyGoogleIdToken(body.idToken)
    const user = upsertUserFromGoogle({
      googleSub: g.sub,
      email: g.email ?? null,
      name: g.name ?? null,
      picture: g.picture ?? null,
    })
    const token = signSessionToken(user.id)
    res.json({ token, user })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Erreur serveur'
    if (msg.includes('GOOGLE_CLIENT_ID')) {
      res.status(500).json({ error: 'Configuration serveur incomplète' })
      return
    }
    if (msg.includes('JWT_SECRET')) {
      res.status(500).json({ error: 'Configuration JWT_SECRET manquante' })
      return
    }
    res.status(401).json({ error: 'Authentification Google refusée' })
  }
})

authRouter.get('/me', requireAuth, (req, res) => {
  const userId = (req as AuthedRequest).userId
  if (!userId) {
    res.status(401).json({ error: 'Non authentifié' })
    return
  }
  const user = findUserById(userId)
  if (!user) {
    res.status(401).json({ error: 'Utilisateur introuvable' })
    return
  }
  res.json({ user })
})
