import { Router } from 'express'
import {
  buildInterpretPromptPayload,
  type PromptCardInput,
  type PromptTone,
} from '../lib/interpretPrompts.js'
import { generateInterpretation } from '../lib/gemini.js'

export const interpretRouter = Router()

type InterpretBody = {
  tone?: PromptTone
  spreadLabel?: string
  question?: string
  profile?: {
    relationshipStatus?: string
    gender?: string
    workSituation?: string
    goals?: string[]
    deckPreference?: string
  }
  cards?: PromptCardInput[]
}

function isTone(value: unknown): value is PromptTone {
  return value === 'direct' || value === 'psychological' || value === 'spiritual'
}

function sanitizeCards(cards: unknown): PromptCardInput[] | null {
  if (!Array.isArray(cards) || cards.length === 0) return null
  const out: PromptCardInput[] = []
  for (const c of cards) {
    if (!c || typeof c !== 'object') return null
    const cc = c as Record<string, unknown>
    if (
      typeof cc.positionLabel !== 'string' ||
      typeof cc.cardName !== 'string' ||
      typeof cc.reversed !== 'boolean' ||
      !Array.isArray(cc.keywords)
    ) {
      return null
    }
    const keywords = cc.keywords.filter((k): k is string => typeof k === 'string')
    out.push({
      positionLabel: cc.positionLabel,
      cardName: cc.cardName,
      reversed: cc.reversed,
      keywords,
    })
  }
  return out
}

interpretRouter.post('/interpret', async (req, res) => {
  try {
    const body = (req.body ?? {}) as InterpretBody
    const tone = body.tone
    const spreadLabel = body.spreadLabel?.trim()
    const question = body.question?.trim() || 'Interprete ce tirage.'
    const cards = sanitizeCards(body.cards)

    if (!isTone(tone)) {
      res.status(400).json({ error: 'tone invalide' })
      return
    }
    if (!spreadLabel) {
      res.status(400).json({ error: 'spreadLabel requis' })
      return
    }
    if (!cards) {
      res.status(400).json({ error: 'cards invalides' })
      return
    }

    const prompt = buildInterpretPromptPayload({
      tone,
      spreadLabel,
      question,
      profile: body.profile,
      cards,
    })

    const interpretation = await generateInterpretation(prompt)
    res.json({ interpretation })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur serveur'
    if (message.includes('GEMINI_API_KEY')) {
      res.status(500).json({ error: 'Configuration serveur incomplète' })
      return
    }
    if (
      message.includes('429') ||
      message.includes('RESOURCE_EXHAUSTED') ||
      message.includes('quota')
    ) {
      res.status(429).json({ error: 'Quota Gemini depasse ou indisponible' })
      return
    }
    res.status(502).json({ error: 'Echec generation IA' })
  }
})
