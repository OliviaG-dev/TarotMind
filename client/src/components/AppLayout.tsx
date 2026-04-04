import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './appLayout.css'

export function AppLayout() {
  const { user, loading, logout } = useAuth()

  return (
    <div className="shell">
      <header className="shell__header">
        <NavLink to="/" className="shell__brand" end>
          TarotMind
        </NavLink>
        <nav className="shell__nav" aria-label="Navigation principale">
          <NavLink to="/" className="shell__link" end>
            Accueil
          </NavLink>
          <NavLink to="/tirage" className="shell__link">
            Tirage
          </NavLink>
          <NavLink to="/profil" className="shell__link">
            Profil
          </NavLink>
          <NavLink to="/historique" className="shell__link">
            Historique
          </NavLink>
          <NavLink to="/connexion" className="shell__link">
            Connexion
          </NavLink>
        </nav>
        <div className="shell__account" aria-live="polite">
          {loading ? (
            <span className="shell__account-muted">…</span>
          ) : user ? (
            <>
              <span className="shell__account-name" title={user.email ?? ''}>
                {user.name ?? user.email ?? 'Compte'}
              </span>
              <button type="button" className="shell__logout" onClick={logout}>
                Déconnexion
              </button>
            </>
          ) : (
            <span className="shell__account-muted">Non connecté·e</span>
          )}
        </div>
      </header>
      <div className="shell__body">
        <Outlet />
      </div>
    </div>
  )
}
