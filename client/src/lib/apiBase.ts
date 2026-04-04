/** Préfixe API : en dev, Vite proxy `/api` → Express. */
export function apiBase(): string {
  const b = import.meta.env.VITE_API_BASE
  if (b !== undefined && b !== '') return b.replace(/\/$/, '')
  return '/api'
}
