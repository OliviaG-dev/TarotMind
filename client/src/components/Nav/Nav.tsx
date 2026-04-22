import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import './Nav.css'

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  const toggleMenu = () => {
    setIsOpen((prev) => !prev)
  }

  return (
    <nav className="nav" aria-label="Navigation principale">
      <button
        type="button"
        className="nav__toggle"
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-controls="main-nav-links"
        aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
      >
        <span className="nav__toggle-icon" aria-hidden="true" />
        Menu
      </button>

      <div id="main-nav-links" className={`nav__links${isOpen ? ' nav__links--open' : ''}`}>
        <NavLink to="/" className="nav__link" end>
          Accueil
        </NavLink>
        <NavLink to="/carte-du-jour" className="nav__link">
          Carte du jour
        </NavLink>
        <NavLink to="/profil" className="nav__link">
          Profil
        </NavLink>
        <NavLink to="/tirage" className="nav__link">
          Tirage
        </NavLink>
        <NavLink to="/question" className="nav__link">
          Question
        </NavLink>
        <NavLink to="/historique" className="nav__link">
          Historique
        </NavLink>
        <NavLink to="/encyclopedie" className="nav__link">
          Encyclopedie
        </NavLink>
        <NavLink to="/statistiques" className="nav__link">
          Stats
        </NavLink>
      </div>
    </nav>
  )
}
