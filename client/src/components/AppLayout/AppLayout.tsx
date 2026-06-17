import { NavLink, Outlet } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { AppBackground } from '../AppBackground/AppBackground'
import Nav from '../Nav/Nav'
import './appLayout.css'

function CrystalLogo() {
  return (
    <svg className="shell__brand-icon" viewBox="0 0 36 36" aria-hidden="true">
      <ellipse cx="18" cy="30" rx="10" ry="3" fill="url(#brandBase)" />
      <path d="M12 28h12l-1.5 4H13.5L12 28Z" fill="#7c3aed" />
      <circle cx="18" cy="16" r="11" fill="url(#brandOrb)" />
      <circle cx="18" cy="16" r="7.5" fill="rgba(255,255,255,0.22)" />
      <circle cx="14.5" cy="12.5" r="2.8" fill="rgba(255,255,255,0.55)" />
      <path
        d="M10 18l2 1.2M24 14l-1.8 1.4M16 8l.6 2"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <defs>
        <radialGradient id="brandOrb" cx="38%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#e9d5ff" />
          <stop offset="55%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#7c3aed" />
        </radialGradient>
        <linearGradient id="brandBase" x1="8" y1="30" x2="28" y2="30">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
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
            <CrystalLogo />
            <span className="shell__brand-text">TarotMind</span>
          </NavLink>
          <Nav />
          <button
            type="button"
            className={`shell__theme-toggle${theme === 'dark' ? ' shell__theme-toggle--dark' : ''}`}
            onClick={toggle}
            aria-label={theme === 'light' ? 'Activer le mode sombre' : 'Activer le mode clair'}
            title={theme === 'light' ? 'Mode sombre' : 'Mode clair'}
          >
            <span className="shell__theme-icon shell__theme-icon--moon" aria-hidden="true">
              &#9789;
            </span>
            <span className="shell__theme-icon shell__theme-icon--sun" aria-hidden="true">
              &#9728;
            </span>
            <span className="shell__theme-knob" aria-hidden="true" />
          </button>
        </div>
      </header>
      <div className="shell__body">
        <Outlet />
      </div>
    </div>
  )
}
