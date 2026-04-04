/** Données utilisateur renvoyées par l’API (pas de secrets). */
export type PublicUser = {
  id: string
  googleSub: string
  email: string | null
  name: string | null
  picture: string | null
}

export type AuthGoogleBody = {
  idToken: string
}

export type AuthGoogleResponse = {
  token: string
  user: PublicUser
}

export type MeResponse = {
  user: PublicUser
}

export type ApiErrorBody = {
  error: string
}
