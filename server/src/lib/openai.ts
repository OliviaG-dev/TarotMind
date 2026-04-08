import { envFlag, envInt } from './envFlags.js'

const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions'
const DEFAULT_MODEL = process.env.OPENAI_MODEL?.trim() || 'gpt-4o-mini'
const MIN_INTERPRETATION_LENGTH = 450

function requireOpenAiApiKey(): string {
  const key = process.env.OPENAI_API_KEY?.trim()
  if (!key) {
    throw new Error('OPENAI_API_KEY manquante dans server/.env')
  }
  return key
}

export async function generateInterpretation(opts: {
  systemInstruction: string
  userPrompt: string
}): Promise<string> {
  const key = requireOpenAiApiKey()
  const skipSecondPass = envFlag('AI_NO_EXPAND')

  const first = await requestOpenAi({
    apiKey: key,
    model: DEFAULT_MODEL,
    systemInstruction: opts.systemInstruction,
    userPrompt: opts.userPrompt,
  })

  if (first.length >= MIN_INTERPRETATION_LENGTH || skipSecondPass) {
    return first
  }

  const expanded = await requestOpenAi({
    apiKey: key,
    model: DEFAULT_MODEL,
    systemInstruction: opts.systemInstruction,
    userPrompt: [
      opts.userPrompt,
      '',
      'Ta premiere reponse etait trop courte.',
      'Refais une lecture complete de 220 a 420 mots en respectant strictement les 4 sections demandees.',
      '',
      'Brouillon precedent:',
      first,
    ].join('\n'),
  })
  return expanded
}

async function requestOpenAi(opts: {
  apiKey: string
  model: string
  systemInstruction: string
  userPrompt: string
}): Promise<string> {
  const maxAttempts = Math.max(1, Math.min(envInt('AI_MAX_RETRIES', 2), 10))

  // Retries courts seulement sur surcharge temporaire (>=500), pas sur 429 quota/rate-limit.
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const response = await fetch(OPENAI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${opts.apiKey}`,
      },
      body: JSON.stringify({
        model: opts.model,
        messages: [
          { role: 'system', content: opts.systemInstruction },
          { role: 'user', content: opts.userPrompt },
        ],
        temperature: 0.8,
        max_tokens: 900,
      }),
    })

    if (response.ok) {
      const data = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>
      }
      const text = data.choices?.[0]?.message?.content?.trim()
      if (!text) throw new Error('OpenAI a renvoye une reponse vide')
      return text
    }

    const body = await response.text()
    if (response.status === 429) {
      throw new Error(`OpenAI error ${response.status}: ${body}`)
    }
    const isTransient = response.status >= 500
    if (!isTransient || attempt === maxAttempts) {
      throw new Error(`OpenAI error ${response.status}: ${body}`)
    }
    await sleep(attempt * 600)
  }

  throw new Error('OpenAI indisponible')
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
