type EndpointName = '/interpret' | '/question' | '/history-insights'
type SourceName = 'openai' | 'mock'

type EndpointStats = {
  total: number
  openai: number
  mock: number
}

type UsageTotals = {
  requests: number
  openaiRequests: number
  mockRequests: number
  inputTokens: number
  outputTokens: number
  estimatedCostUsd: number
}

const endpointStats: Record<EndpointName, EndpointStats> = {
  '/interpret': { total: 0, openai: 0, mock: 0 },
  '/question': { total: 0, openai: 0, mock: 0 },
  '/history-insights': { total: 0, openai: 0, mock: 0 },
}

const totals: UsageTotals = {
  requests: 0,
  openaiRequests: 0,
  mockRequests: 0,
  inputTokens: 0,
  outputTokens: 0,
  estimatedCostUsd: 0,
}

function envFloat(name: string, fallback: number): number {
  const raw = process.env[name]?.trim()
  if (!raw) return fallback
  const num = Number.parseFloat(raw)
  return Number.isFinite(num) && num >= 0 ? num : fallback
}

function estimateCostUsd(opts: { inputTokens: number; outputTokens: number }): number {
  const inputPer1k = envFloat('AI_COST_INPUT_PER_1K_USD', 0.00015)
  const outputPer1k = envFloat('AI_COST_OUTPUT_PER_1K_USD', 0.0006)
  return (opts.inputTokens / 1000) * inputPer1k + (opts.outputTokens / 1000) * outputPer1k
}

export function trackAiRequest(opts: {
  endpoint: EndpointName
  source: SourceName
  inputTokens?: number
  outputTokens?: number
}) {
  const entry = endpointStats[opts.endpoint]
  entry.total += 1
  entry[opts.source] += 1

  totals.requests += 1
  if (opts.source === 'openai') {
    totals.openaiRequests += 1
  } else {
    totals.mockRequests += 1
  }

  const inputTokens = Math.max(0, opts.inputTokens ?? 0)
  const outputTokens = Math.max(0, opts.outputTokens ?? 0)
  totals.inputTokens += inputTokens
  totals.outputTokens += outputTokens
  totals.estimatedCostUsd += estimateCostUsd({ inputTokens, outputTokens })
}

export function getAiUsageSnapshot() {
  const fallbackRate = totals.requests > 0 ? totals.mockRequests / totals.requests : 0
  return {
    totals: {
      ...totals,
      fallbackRate,
      estimatedCostUsd: Number(totals.estimatedCostUsd.toFixed(6)),
    },
    endpoints: endpointStats,
  }
}

export function resetAiUsageForTests() {
  for (const key of Object.keys(endpointStats) as EndpointName[]) {
    endpointStats[key] = { total: 0, openai: 0, mock: 0 }
  }
  totals.requests = 0
  totals.openaiRequests = 0
  totals.mockRequests = 0
  totals.inputTokens = 0
  totals.outputTokens = 0
  totals.estimatedCostUsd = 0
}
