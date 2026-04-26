const STORAGE_KEY = 'tarotmind.clientIdentity.v1'

function createId(): string {
  try {
    return crypto.randomUUID()
  } catch {
    const rnd = Math.random().toString(36).slice(2, 10)
    return `anon-${Date.now().toString(36)}-${rnd}`
  }
}

export function getClientIdentity(): string {
  try {
    const existing = localStorage.getItem(STORAGE_KEY)
    if (existing) return existing
    const created = createId()
    localStorage.setItem(STORAGE_KEY, created)
    return created
  } catch {
    return 'anonymous'
  }
}
