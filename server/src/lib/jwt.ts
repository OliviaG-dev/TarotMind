import jwt from 'jsonwebtoken'

function secret(): string {
  const s = process.env.JWT_SECRET
  if (!s || s.length < 16) {
    throw new Error(
      'JWT_SECRET manquant ou trop court (min. 16 caractères). Voir server/.env.example',
    )
  }
  return s
}

export function signSessionToken(userId: string): string {
  return jwt.sign({ sub: userId }, secret(), { expiresIn: '7d' })
}

export function verifySessionToken(token: string): { sub: string } {
  const payload = jwt.verify(token, secret())
  if (
    typeof payload !== 'object' ||
    payload === null ||
    typeof (payload as { sub?: unknown }).sub !== 'string'
  ) {
    throw new Error('Invalid payload')
  }
  return { sub: (payload as { sub: string }).sub }
}
