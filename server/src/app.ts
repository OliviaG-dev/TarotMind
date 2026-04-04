import express from 'express'
import cors from 'cors'
import { authRouter } from './routes/auth.js'

export function createApp() {
  const app = express()
  app.use(
    cors({
      origin: true,
      credentials: true,
    }),
  )
  app.use(express.json({ limit: '64kb' }))

  app.get('/health', (_req, res) => {
    res.json({ ok: true })
  })

  app.use(authRouter)

  app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' })
  })

  return app
}
