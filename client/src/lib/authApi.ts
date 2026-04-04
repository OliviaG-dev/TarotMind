import type { AuthGoogleResponse, MeResponse } from '@tarotmind/shared'
import { apiBase } from './apiBase'

async function readError(res: Response): Promise<string> {
  try {
    const j = (await res.json()) as { error?: string }
    return j.error ?? res.statusText
  } catch {
    return res.statusText
  }
}

export async function postAuthGoogle(
  idToken: string,
): Promise<AuthGoogleResponse> {
  const res = await fetch(`${apiBase()}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  })
  if (!res.ok) throw new Error(await readError(res))
  return res.json() as Promise<AuthGoogleResponse>
}

export async function getMe(token: string): Promise<MeResponse> {
  const res = await fetch(`${apiBase()}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error(await readError(res))
  return res.json() as Promise<MeResponse>
}
