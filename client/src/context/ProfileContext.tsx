import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { DeckPreference, UserProfile } from '../types/tarot'

const STORAGE_KEY = 'tarotmind.profile.v1'

export const DEFAULT_PROFILE: UserProfile = {
  relationshipStatus: 'prefer_not',
  gender: 'prefer_not',
  workSituation: 'other',
  goals: [],
  deckPreference: 'majors_only',
}

function loadProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_PROFILE
    const parsed = JSON.parse(raw) as UserProfile
    if (!parsed || typeof parsed !== 'object') return DEFAULT_PROFILE
    const deckOk = (v: unknown): v is DeckPreference =>
      v === 'majors_only' ||
      v === 'majors_and_minors' ||
      v === 'minors_only'

    return {
      relationshipStatus:
        parsed.relationshipStatus ?? DEFAULT_PROFILE.relationshipStatus,
      gender: parsed.gender ?? DEFAULT_PROFILE.gender,
      workSituation: parsed.workSituation ?? DEFAULT_PROFILE.workSituation,
      goals: Array.isArray(parsed.goals) ? parsed.goals : [],
      deckPreference: deckOk(parsed.deckPreference)
        ? parsed.deckPreference
        : DEFAULT_PROFILE.deckPreference,
    }
  } catch {
    return DEFAULT_PROFILE
  }
}

function saveProfile(p: UserProfile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p))
}

type ProfileContextValue = {
  profile: UserProfile
  setProfile: (next: UserProfile) => void
  updateProfile: (partial: Partial<UserProfile>) => void
}

const ProfileContext = createContext<ProfileContextValue | null>(null)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile>(() => loadProfile())

  useEffect(() => {
    saveProfile(profile)
  }, [profile])

  const setProfile = useCallback((next: UserProfile) => {
    setProfileState(next)
  }, [])

  const updateProfile = useCallback((partial: Partial<UserProfile>) => {
    setProfileState((prev) => ({ ...prev, ...partial }))
  }, [])

  const value = useMemo(
    () => ({ profile, setProfile, updateProfile }),
    [profile, setProfile, updateProfile],
  )

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  )
}

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider')
  return ctx
}
