import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { PublicUser } from '@tarotmind/shared'
import { getMe, postAuthGoogle } from '../lib/authApi'

const TOKEN_KEY = 'tarotmind.jwt'

type AuthContextValue = {
  token: string | null
  user: PublicUser | null
  loading: boolean
  loginWithGoogleIdToken: (idToken: string) => Promise<void>
  logout: () => void
  refreshMe: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY),
  )
  const [user, setUser] = useState<PublicUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshMe = useCallback(async () => {
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }
    try {
      const { user: u } = await getMe(token)
      setUser(u)
    } catch {
      localStorage.removeItem(TOKEN_KEY)
      setToken(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    void refreshMe()
  }, [refreshMe])

  const loginWithGoogleIdToken = useCallback(async (idToken: string) => {
    const { token: t, user: u } = await postAuthGoogle(idToken)
    localStorage.setItem(TOKEN_KEY, t)
    setToken(t)
    setUser(u)
    setLoading(false)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      loginWithGoogleIdToken,
      logout,
      refreshMe,
    }),
    [token, user, loading, loginWithGoogleIdToken, logout, refreshMe],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth doit être utilisé dans AuthProvider')
  return ctx
}
