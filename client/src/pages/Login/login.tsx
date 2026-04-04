import { GoogleLogin } from '@react-oauth/google'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './login.css'

export default function LoginPage() {
  const { loginWithGoogleIdToken } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ''

  async function onCredential(credential: string) {
    setError(null)
    try {
      await loginWithGoogleIdToken(credential)
      navigate('/', { replace: true })
    } catch {
      setError('Connexion refusée. Vérifie l’API, le Client ID et le secret JWT.')
    }
  }

  return (
    <div className="login">
      <h1 className="login__title">Connexion</h1>
      <p className="login__lead">
        Connecte-toi avec Google pour lier ton compte au backend Express (profil
        stocké en base).
      </p>

      {!clientId ? (
        <div className="login__warn">
          <p>
            Ajoute <code>VITE_GOOGLE_CLIENT_ID</code> dans{' '}
            <code>client/.env</code> (voir <code>client/.env.example</code>),
            identique à <code>GOOGLE_CLIENT_ID</code> côté serveur.
          </p>
        </div>
      ) : (
        <>
          <div className="login__google">
            <GoogleLogin
              onSuccess={(res) => {
                if (res.credential) void onCredential(res.credential)
              }}
              onError={() => setError('La fenêtre Google s’est fermée ou a échoué.')}
              useOneTap={false}
            />
          </div>
          {error && <p className="login__error">{error}</p>}
        </>
      )}

      <p className="login__back">
        <Link to="/">← Retour</Link>
      </p>
    </div>
  )
}
