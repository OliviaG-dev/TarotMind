import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ErrorBoundary } from './ErrorBoundary'

function ThrowingChild({ message }: { message: string }) {
  throw new Error(message)
}

describe('ErrorBoundary', () => {
  it('renders fallback UI when a child throws', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <ThrowingChild message="Erreur composant test" />
      </ErrorBoundary>,
    )

    expect(screen.getByText('Oups, quelque chose s\'est mal passe')).toBeInTheDocument()
    expect(screen.getByText('Erreur composant test')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Recharger la page' })).toBeInTheDocument()

    consoleError.mockRestore()
  })

  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <p>Contenu normal</p>
      </ErrorBoundary>,
    )

    expect(screen.getByText('Contenu normal')).toBeInTheDocument()
  })
})
