import { NavLink, Outlet } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { AppBackground } from '../AppBackground/AppBackground'
import Nav from '../Nav/Nav'
import { NavIconProfile } from '../Nav/NavIcons'
import './appLayout.css'

function BrandLogo() {
  return (
    <img
      className="shell__brand-icon"
      src="/img/brand-logo.png"
      alt=""
      width={60}
      height={60}
      decoding="async"
    />
  )
}

function ThemeMoonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 3.2a6.2 6.2 0 0 0 9.3 9.3 9.3 9.3 0 1 1-9.3-9.3Z"
        fill="currentColor"
      />
    </svg>
  )
}

function ThemeSunIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="5" fill="currentColor" />
      <path
        d="M12 2.5v2.6M12 19v2.5M2.5 12h2.6M19 12h2.5M5.2 5.2l1.9 1.9M17 17l1.9 1.9M5.2 18.8l1.9-1.9M17 7l1.9-1.9"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function AppLayout() {
  const { theme, toggle } = useTheme()

  return (
    <div className="shell">
      <AppBackground />
      <header className="shell__header">
        <div className="shell__nav-pill">
          <NavLink to="/" className="shell__brand" end>
            <BrandLogo />
            <span className="shell__brand-text">TarotMind</span>
          </NavLink>
          <Nav />
          <div className="shell__header-actions">
            <NavLink
              to="/profil"
              className="shell__profile-link"
              aria-label="Profil"
              title="Profil"
            >
              <NavIconProfile className="shell__profile-icon" />
            </NavLink>
            <button
              type="button"
              className={`shell__theme-toggle${theme === 'dark' ? ' shell__theme-toggle--dark' : ''}`}
              onClick={toggle}
              aria-label={theme === 'light' ? 'Activer le mode sombre' : 'Activer le mode clair'}
              title={theme === 'light' ? 'Mode sombre' : 'Mode clair'}
            >
              <span className="shell__theme-band" aria-hidden="true" />
              <span className="shell__theme-side shell__theme-side--moon" aria-hidden="true">
                <ThemeMoonIcon />
              </span>
              <span className="shell__theme-side shell__theme-side--sun" aria-hidden="true">
                <ThemeSunIcon />
              </span>
              <span className="shell__theme-knob" aria-hidden="true">
                {theme === 'light' ? <ThemeSunIcon /> : <ThemeMoonIcon />}
              </span>
            </button>
          </div>
        </div>
      </header>
      <div className="shell__body">
        <Outlet />
      </div>
    </div>
  )
}
