import { OAuth2Client } from 'google-auth-library'

let client: OAuth2Client | null = null

function getClient(): OAuth2Client {
  const id = process.env.GOOGLE_CLIENT_ID
  if (!id) {
    throw new Error(
      'GOOGLE_CLIENT_ID manquant. Crée un client OAuth « Web » dans Google Cloud Console.',
    )
  }
  if (!client) client = new OAuth2Client(id)
  return client
}

export type GoogleIdPayload = {
  sub: string
  email?: string
  name?: string
  picture?: string
}

export async function verifyGoogleIdToken(
  idToken: string,
): Promise<GoogleIdPayload> {
  const audience = process.env.GOOGLE_CLIENT_ID
  if (!audience) throw new Error('GOOGLE_CLIENT_ID manquant')
  const ticket = await getClient().verifyIdToken({
    idToken,
    audience,
  })
  const payload = ticket.getPayload()
  if (!payload?.sub) throw new Error('Jeton Google invalide')
  return {
    sub: payload.sub,
    email: payload.email,
    name: payload.name,
    picture: payload.picture,
  }
}
