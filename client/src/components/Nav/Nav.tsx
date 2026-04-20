import { NavLink } from 'react-router-dom'
import './Nav.css'

export default function Nav() {
  return (
    <nav className="nav" aria-label="Navigation principale">
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
    </nav>
  )
}
