/** true si la valeur vaut 1, true ou yes (insensible à la casse). */
export function envFlag(name: string): boolean {
  const v = process.env[name]?.trim().toLowerCase()
  return v === '1' || v === 'true' || v === 'yes'
}

export function envInt(name: string, fallback: number): number {
  const raw = process.env[name]?.trim()
  if (raw === undefined || raw === '') return fallback
  const n = Number.parseInt(raw, 10)
  if (!Number.isFinite(n) || n < 0) return fallback
  return n
}
