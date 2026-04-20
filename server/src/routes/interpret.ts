import { Router } from 'express'
import { envFlag } from '../lib/envFlags.js'
import {
  buildHistoryInsightsPromptPayload,
  buildInterpretPromptPayload,
  buildQuestionPromptPayload,
  type HistoryInsightsDrawInput,
  type PromptCardInput,
  type PromptTone,
} from '../lib/interpretPrompts.js'
import { generateInterpretation } from '../lib/openai.js'
import { buildConfigurationStub } from '../lib/mockInterpretationStub.js'

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

type HistoryInsightsBody = {
  profile?: {
    relationshipStatus?: string
    gender?: string
    workSituation?: string
    goals?: string[]
    deckPreference?: string
  }
  draws?: HistoryInsightsDrawInput[]
  topCards?: Array<{ name: string; count: number }>
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

    if (envFlag('AI_DISABLED') || envFlag('GEMINI_DISABLED')) {
      res.json({
        interpretation: buildConfigurationStub({
          spreadLabel,
          tone,
          cards,
        }),
        source: 'mock' as const,
      })
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
    res.json({ interpretation, source: 'openai' as const })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur serveur'
    if (message.includes('OPENAI_API_KEY')) {
      res.status(500).json({ error: 'Configuration serveur incomplète' })
      return
    }
    if (
      message.includes('429') ||
      message.includes('rate limit') ||
      message.includes('quota')
    ) {
      res.status(429).json({ error: 'Quota OpenAI depasse ou indisponible' })
      return
    }
    res.status(502).json({ error: 'Echec generation IA' })
  }
})

type QuestionBody = {
  question?: string
  spreadLabel?: string
  profile?: {
    relationshipStatus?: string
    gender?: string
    workSituation?: string
    goals?: string[]
    deckPreference?: string
  }
  cards?: PromptCardInput[]
}

interpretRouter.post('/question', async (req, res) => {
  try {
    const body = (req.body ?? {}) as QuestionBody
    const question = body.question?.trim()

    if (!question || question.length < 3) {
      res.status(400).json({ error: 'question requise (3 caracteres min)' })
      return
    }

    if (envFlag('AI_DISABLED') || envFlag('GEMINI_DISABLED')) {
      res.json({
        interpretation:
          `**Ta question :** ${question}\n\n` +
          '### Eclairage\n' +
          "L'IA est actuellement en mode demo. En production, tu recevras ici une reponse personnalisee basee sur ton profil et ta question.\n\n" +
          '### Conseil concret\n' +
          '- Prends un moment pour reformuler ta question avec precision.\n' +
          '- Note ce qui te vient spontanement a l\'esprit.\n\n' +
          '### Question d\'introspection\n' +
          'Qu\'est-ce qui se cache derriere cette question ?',
        source: 'mock' as const,
      })
      return
    }

    const cards = sanitizeCards(body.cards)
    const prompt = buildQuestionPromptPayload({
      question,
      profile: body.profile,
      spreadLabel: body.spreadLabel?.trim(),
      cards: cards ?? undefined,
    })

    const interpretation = await generateInterpretation(prompt)
    res.json({ interpretation, source: 'openai' as const })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur serveur'
    if (message.includes('OPENAI_API_KEY')) {
      res.status(500).json({ error: 'Configuration serveur incomplete' })
      return
    }
    if (
      message.includes('429') ||
      message.includes('rate limit') ||
      message.includes('quota')
    ) {
      res.status(429).json({ error: 'Quota IA depasse ou indisponible' })
      return
    }
    res.status(502).json({ error: 'Echec generation IA' })
  }
})

interpretRouter.post('/history-insights', async (req, res) => {
  try {
    const body = (req.body ?? {}) as HistoryInsightsBody
    const draws = Array.isArray(body.draws) ? body.draws.slice(0, 12) : []
    const topCards = Array.isArray(body.topCards) ? body.topCards.slice(0, 8) : []

    if (draws.length === 0) {
      res.status(400).json({ error: 'draws requis' })
      return
    }

    if (envFlag('AI_DISABLED') || envFlag('GEMINI_DISABLED')) {
      res.json({
        interpretation:
          '### Motif principal\nMode configuration actif.\n\n### Ce que ca raconte de ta periode\nLes donnees sont bien recues, mais l’IA est desactivee.\n\n### Point de vigilance\nPense a rebasculer `AI_DISABLED=0` pour obtenir une analyse reelle.\n\n### Action 7 jours\nActive OpenAI puis relance une analyse depuis Historique.\n\n### Question d’introspection\nQuel motif veux-tu explorer en priorite cette semaine ?',
        source: 'mock' as const,
      })
      return
    }

    const prompt = buildHistoryInsightsPromptPayload({
      profile: body.profile,
      draws,
      topCards,
    })
    const interpretation = await generateInterpretation(prompt)
    res.json({ interpretation, source: 'openai' as const })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur serveur'
    if (message.includes('OPENAI_API_KEY')) {
      res.status(500).json({ error: 'Configuration serveur incomplète' })
      return
    }
    if (
      message.includes('429') ||
      message.includes('rate limit') ||
      message.includes('quota')
    ) {
      res.status(429).json({ error: 'Quota OpenAI depasse ou indisponible' })
      return
    }
    res.status(502).json({ error: 'Echec generation IA' })
  }
})
