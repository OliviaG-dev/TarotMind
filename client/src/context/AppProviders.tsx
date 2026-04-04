import type { ReactNode } from 'react'
import { HistoryProvider } from './HistoryContext'
import { ProfileProvider } from './ProfileContext'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ProfileProvider>
      <HistoryProvider>{children}</HistoryProvider>
    </ProfileProvider>
  )
}
