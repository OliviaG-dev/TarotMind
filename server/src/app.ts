import express from 'express'
import cors from 'cors'
import { createRateLimiter } from './lib/rateLimit.js'
import { authRouter } from './routes/auth.js'
import { interpretRouter } from './routes/interpret.js'

export function createApp() {
  const app = express()
  app.use(
    cors({
      origin: true,
      credentials: true,
    }),
  )
  app.use(express.json({ limit: '64kb' }))

  const apiLimiter = createRateLimiter({
    windowMs: 60_000,
    maxRequests: 30,
  })
  app.use('/interpret', apiLimiter)
  app.use('/question', apiLimiter)
  app.use('/history-insights', apiLimiter)

  app.get('/health', (_req, res) => {
    res.json({ ok: true })
  })

  app.use(authRouter)
  app.use(interpretRouter)

  app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' })
  })

  return app
}
