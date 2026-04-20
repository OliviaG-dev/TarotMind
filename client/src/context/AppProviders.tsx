import type { ReactNode } from 'react'
import { HistoryProvider } from './HistoryContext'
import { ProfileProvider } from './ProfileContext'
import { ThemeProvider } from './ThemeContext'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ProfileProvider>
        <HistoryProvider>{children}</HistoryProvider>
      </ProfileProvider>
    </ThemeProvider>
  )
}
