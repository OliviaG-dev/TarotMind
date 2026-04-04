import { GoogleOAuthProvider } from '@react-oauth/google'
import { BrowserRouter } from 'react-router-dom'
import { AppProviders } from './context/AppProviders'
import { AuthProvider } from './context/AuthContext'
import App from './App.tsx'

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ''

export function Root() {
  const tree = <App />
  return (
    <BrowserRouter>
      <AppProviders>
        <AuthProvider>
          {googleClientId ? (
            <GoogleOAuthProvider clientId={googleClientId}>
              {tree}
            </GoogleOAuthProvider>
          ) : (
            tree
          )}
        </AuthProvider>
      </AppProviders>
    </BrowserRouter>
  )
}
