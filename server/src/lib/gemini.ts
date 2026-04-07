const GEMINI_BASE =
  'https://generativelanguage.googleapis.com/v1beta/models'
const DEFAULT_MODEL = process.env.GEMINI_MODEL?.trim() || 'gemini-2.0-flash'
const MIN_INTERPRETATION_LENGTH = 450

function requireGeminiApiKey(): string {
  const key = process.env.GEMINI_API_KEY?.trim()
  if (!key) {
    throw new Error('GEMINI_API_KEY manquante dans server/.env')
  }
  return key
}

export async function generateInterpretation(opts: {
  systemInstruction: string
  userPrompt: string
}): Promise<string> {
  const key = requireGeminiApiKey()
  const first = await requestGemini({
    apiKey: key,
    model: DEFAULT_MODEL,
    systemInstruction: opts.systemInstruction,
    userPrompt: opts.userPrompt,
  })

  if (first.length >= MIN_INTERPRETATION_LENGTH) {
    return first
  }

  const expanded = await requestGemini({
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

async function requestGemini(opts: {
  apiKey: string
  model: string
  systemInstruction: string
  userPrompt: string
}): Promise<string> {
  const url = `${GEMINI_BASE}/${opts.model}:generateContent?key=${encodeURIComponent(opts.apiKey)}`

  // Retries courts pour les pics de charge Gemini (503).
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: opts.systemInstruction }],
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: opts.userPrompt }],
          },
        ],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 900,
        },
      }),
    })

    if (response.ok) {
      const data = (await response.json()) as {
        candidates?: Array<{
          content?: {
            parts?: Array<{ text?: string }>
          }
        }>
      }
      const text = data.candidates?.[0]?.content?.parts
        ?.map((p) => p.text ?? '')
        .join('')
        .trim()
      if (!text) throw new Error('Gemini a renvoye une reponse vide')
      return text
    }

    const body = await response.text()
    const isUnavailable = response.status === 503 || response.status === 429
    if (!isUnavailable || attempt === 3) {
      throw new Error(`Gemini error ${response.status}: ${body}`)
    }
    await sleep(attempt * 600)
  }

  throw new Error('Gemini indisponible')
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
