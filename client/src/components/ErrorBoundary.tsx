import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  message: string
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message || 'Une erreur inattendue est survenue.' }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          padding: '40px 20px',
          textAlign: 'center',
          fontFamily: 'var(--sans, system-ui, sans-serif)',
        }}>
          <h1 style={{
            fontSize: '1.8rem',
            marginBottom: '16px',
            color: 'var(--text-h, #2a2332)',
          }}>
            Oups, quelque chose s'est mal passe
          </h1>
          <p style={{
            maxWidth: '48ch',
            lineHeight: 1.6,
            color: 'var(--text, #584f60)',
            marginBottom: '24px',
          }}>
            {this.state.message}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 28px',
              borderRadius: '999px',
              border: 'none',
              background: 'var(--accent-strong, #8f58ab)',
              color: '#fff',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            Recharger la page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
