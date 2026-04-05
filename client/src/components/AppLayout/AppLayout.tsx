import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Nav from '../Nav/Nav'
import './appLayout.css'

export function AppLayout() {
  const { user, loading, logout } = useAuth()

  return (
    <div className="shell">
      <header className="shell__header">
        <NavLink to="/" className="shell__brand" end>
          TarotMind
        </NavLink>
        <Nav />
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
