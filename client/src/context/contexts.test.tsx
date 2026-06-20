import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import {
  DEFAULT_PROFILE,
  ProfileProvider,
  useProfile,
} from './ProfileContext'
import { ThemeProvider, useTheme } from './ThemeContext'

beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
})

describe('ProfileProvider', () => {
  it('loads default profile and persists updates', () => {
    const { result } = renderHook(() => useProfile(), {
      wrapper: ProfileProvider,
    })

    expect(result.current.profile).toEqual(DEFAULT_PROFILE)

    act(() => {
      result.current.updateProfile({ relationshipStatus: 'single' })
    })

    expect(result.current.profile.relationshipStatus).toBe('single')
    expect(JSON.parse(localStorage.getItem('tarotmind.profile.v1') ?? '{}')).toMatchObject({
      relationshipStatus: 'single',
    })
  })
})

describe('ThemeProvider', () => {
  it('toggles theme and persists it', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    })

    const initialTheme = result.current.theme

    act(() => {
      result.current.toggle()
    })

    expect(result.current.theme).toBe(initialTheme === 'light' ? 'dark' : 'light')
    expect(document.documentElement.getAttribute('data-theme')).toBe(result.current.theme)
    expect(localStorage.getItem('tarotmind.theme.v1')).toBe(result.current.theme)
  })
})
