import { Router } from 'express'

export const authRouter = Router()

/**
 * Auth routes placeholder.
 * To activate, install pg + bcrypt + jsonwebtoken and wire up the DB.
 *
 * POST /auth/register  { email, password }
 * POST /auth/login     { email, password }
 * GET  /auth/me        (requires JWT in Authorization header)
 */

authRouter.post('/auth/register', (_req, res) => {
  res.status(501).json({
    error: 'Registration not yet available. Configure PostgreSQL to enable accounts.',
  })
})

authRouter.post('/auth/login', (_req, res) => {
  res.status(501).json({
    error: 'Login not yet available. Configure PostgreSQL to enable accounts.',
  })
})

authRouter.get('/auth/me', (_req, res) => {
  res.status(501).json({
    error: 'Auth not yet available.',
  })
})
