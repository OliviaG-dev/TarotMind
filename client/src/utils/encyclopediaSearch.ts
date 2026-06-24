import type { TarotCard } from '../types/tarot'

function normalizeSearchText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
}

function tokenize(value: string): string[] {
  return normalizeSearchText(value)
    .split(/[\s'’-]+/)
    .filter(Boolean)
}

export function cardMatchesEncyclopediaSearch(card: TarotCard, query: string): boolean {
  const tokens = tokenize(query.trim())
  if (tokens.length === 0) return true

  const nameWords = tokenize(card.nameFr)
  const keywordWords = card.keywords.flatMap((keyword) => tokenize(keyword))

  return tokens.every(
    (token) =>
      nameWords.some((word) => word === token || word.startsWith(token)) ||
      keywordWords.some((word) => word === token || word.startsWith(token)),
  )
}
