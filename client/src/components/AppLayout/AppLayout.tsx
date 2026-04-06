import { NavLink, Outlet } from 'react-router-dom'
import Nav from '../Nav/Nav'
import './appLayout.css'

export function AppLayout() {
  return (
    <div className="shell">
      <header className="shell__header">
        <NavLink to="/" className="shell__brand" end>
          <span className="shell__brand-text">TarotMind</span>
        </NavLink>
        <Nav />
      </header>
      <div className="shell__body">
        <Outlet />
      </div>
    </div>
  )
}
