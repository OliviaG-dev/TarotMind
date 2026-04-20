import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { DrawRecord } from '../types/tarot'

const STORAGE_KEY = 'tarotmind.history.v1'
const MAX_ITEMS = 80

function loadHistory(): DrawRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as DrawRecord[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveHistory(items: DrawRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

type HistoryContextValue = {
  draws: DrawRecord[]
  addDraw: (draw: DrawRecord) => void
  clearHistory: () => void
  toggleFavorite: (id: string) => void
  updateNote: (id: string, note: string) => void
}

const HistoryContext = createContext<HistoryContextValue | null>(null)

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [draws, setDraws] = useState<DrawRecord[]>(() => loadHistory())

  useEffect(() => {
    saveHistory(draws)
  }, [draws])

  const addDraw = useCallback((draw: DrawRecord) => {
    setDraws((prev) => [draw, ...prev].slice(0, MAX_ITEMS))
  }, [])

  const clearHistory = useCallback(() => {
    setDraws([])
  }, [])

  const toggleFavorite = useCallback((id: string) => {
    setDraws((prev) =>
      prev.map((d) => (d.id === id ? { ...d, favorite: !d.favorite } : d)),
    )
  }, [])

  const updateNote = useCallback((id: string, note: string) => {
    setDraws((prev) =>
      prev.map((d) => (d.id === id ? { ...d, note } : d)),
    )
  }, [])

  const value = useMemo(
    () => ({ draws, addDraw, clearHistory, toggleFavorite, updateNote }),
    [draws, addDraw, clearHistory, toggleFavorite, updateNote],
  )

  return (
    <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>
  )
}

export function useHistory(): HistoryContextValue {
  const ctx = useContext(HistoryContext)
  if (!ctx) throw new Error('useHistory must be used within HistoryProvider')
  return ctx
}
