import { SPREADS } from '../data/spreads'
import type { DrawRecord, SpreadId, Tone } from '../types/tarot'

export type StatsPeriod = 'all' | '30d' | '7d'

export const STATS_PERIOD_OPTIONS: { value: StatsPeriod; label: string }[] = [
  { value: 'all', label: 'Tout' },
  { value: '30d', label: '30 jours' },
  { value: '7d', label: '7 jours' },
]

export const TONE_STATS_LABELS: Record<Tone, string> = {
  spiritual: 'Spirituel',
  psychological: 'Psychologique',
  direct: 'Direct / conseil',
}

const MS_PER_DAY = 24 * 60 * 60 * 1000

export type TopCardStat = {
  cardId: string
  nameFr: string
  count: number
}

export type SpreadStat = {
  label: string
  count: number
  icon?: string
  spreadId?: SpreadId
}

export type ToneStat = {
  tone: Tone
  label: string
  count: number
}

export type ActivityBucket = {
  key: string
  label: string
  count: number
}

export type StatsResult = {
  total: number
  questions: number
  favorites: number
  weeksActive: number
  topCards: TopCardStat[]
  spreads: SpreadStat[]
  tones: ToneStat[]
  activity: ActivityBucket[]
}

export function filterDrawsByPeriod(
  draws: DrawRecord[],
  period: StatsPeriod,
): DrawRecord[] {
  if (period === 'all') return draws
  const days = period === '7d' ? 7 : 30
  const cutoff = Date.now() - days * MS_PER_DAY
  return draws.filter((d) => new Date(d.createdAt).getTime() >= cutoff)
}

function startOfDay(date: Date): Date {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  return next
}

function startOfWeek(date: Date): Date {
  const next = startOfDay(date)
  next.setDate(next.getDate() - next.getDay())
  return next
}

function formatDayLabel(date: Date): string {
  return date
    .toLocaleDateString('fr-FR', { weekday: 'short' })
    .replace(/\.$/, '')
}

function formatWeekLabel(date: Date): string {
  return date
    .toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
    .replace(/\.$/, '')
}

export function buildActivityTimeline(
  draws: DrawRecord[],
  period: StatsPeriod,
): ActivityBucket[] {
  const now = new Date()

  if (period === '7d') {
    const buckets: ActivityBucket[] = []
    for (let offset = 6; offset >= 0; offset -= 1) {
      const day = startOfDay(now)
      day.setDate(day.getDate() - offset)
      buckets.push({
        key: day.toISOString().slice(0, 10),
        label: formatDayLabel(day),
        count: 0,
      })
    }
    const byKey = new Map(buckets.map((bucket) => [bucket.key, bucket]))
    for (const draw of draws) {
      const key = startOfDay(new Date(draw.createdAt)).toISOString().slice(0, 10)
      const bucket = byKey.get(key)
      if (bucket) bucket.count += 1
    }
    return buckets
  }

  const weekCount = period === '30d' ? 5 : 12
  const buckets: ActivityBucket[] = []
  for (let offset = weekCount - 1; offset >= 0; offset -= 1) {
    const weekStart = startOfWeek(now)
    weekStart.setDate(weekStart.getDate() - offset * 7)
    buckets.push({
      key: weekStart.toISOString().slice(0, 10),
      label: formatWeekLabel(weekStart),
      count: 0,
    })
  }
  const byKey = new Map(buckets.map((bucket) => [bucket.key, bucket]))
  for (const draw of draws) {
    const key = startOfWeek(new Date(draw.createdAt)).toISOString().slice(0, 10)
    const bucket = byKey.get(key)
    if (bucket) bucket.count += 1
  }
  return buckets
}

export function computeStats(
  draws: DrawRecord[],
  period: StatsPeriod,
): StatsResult {
  const total = draws.length
  const questions = draws.filter((d) => d.question).length
  const favorites = draws.filter((d) => d.favorite).length

  const cardCounts = new Map<string, TopCardStat>()
  for (const draw of draws) {
    for (const placed of draw.cards) {
      const existing = cardCounts.get(placed.card.id)
      if (existing) {
        existing.count += 1
      } else {
        cardCounts.set(placed.card.id, {
          cardId: placed.card.id,
          nameFr: placed.card.nameFr,
          count: 1,
        })
      }
    }
  }
  const topCards = [...cardCounts.values()].sort((a, b) => b.count - a.count)

  const spreadCounts = new Map<string, number>()
  for (const draw of draws) {
    spreadCounts.set(draw.spreadLabel, (spreadCounts.get(draw.spreadLabel) ?? 0) + 1)
  }

  const spreads: SpreadStat[] = SPREADS.map((spread) => ({
    label: spread.label,
    count: spreadCounts.get(spread.label) ?? 0,
    icon: spread.icon,
    spreadId: spread.id,
  }))

  for (const [label, count] of spreadCounts) {
    if (!SPREADS.some((spread) => spread.label === label)) {
      spreads.push({ label, count })
    }
  }

  const toneCounts = new Map<Tone, number>()
  for (const draw of draws) {
    toneCounts.set(draw.tone, (toneCounts.get(draw.tone) ?? 0) + 1)
  }
  const tones: ToneStat[] = (Object.keys(TONE_STATS_LABELS) as Tone[]).map(
    (tone) => ({
      tone,
      label: TONE_STATS_LABELS[tone],
      count: toneCounts.get(tone) ?? 0,
    }),
  )

  const weekMap = new Map<string, number>()
  for (const draw of draws) {
    const key = startOfWeek(new Date(draw.createdAt)).toISOString().slice(0, 10)
    weekMap.set(key, (weekMap.get(key) ?? 0) + 1)
  }

  return {
    total,
    questions,
    favorites,
    weeksActive: weekMap.size,
    topCards,
    spreads,
    tones,
    activity: buildActivityTimeline(draws, period),
  }
}
