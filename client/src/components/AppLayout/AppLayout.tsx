import { NavLink, Outlet } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import Nav from '../Nav/Nav'
import './appLayout.css'

export function AppLayout() {
  const { theme, toggle } = useTheme()

  return (
    <div className="shell">
      <header className="shell__header">
        <NavLink to="/" className="shell__brand" end>
          <span className="shell__brand-text">TarotMind</span>
        </NavLink>
        <Nav />
        <button
          type="button"
          className="shell__theme-toggle"
          onClick={toggle}
          aria-label={theme === 'light' ? 'Activer le mode sombre' : 'Activer le mode clair'}
          title={theme === 'light' ? 'Mode sombre' : 'Mode clair'}
        >
          {theme === 'light' ? '\u263E' : '\u2600'}
        </button>
      </header>
      <div className="shell__body">
        <Outlet />
      </div>
    </div>
  )
}
