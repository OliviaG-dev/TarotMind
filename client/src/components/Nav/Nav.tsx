import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FeatureIconCardsStar,
  FeatureIconQuestionBubble,
  NavIconBook,
  NavIconChart,
  NavIconClock,
  NavIconHome,
  NavIconSun,
} from "./NavIcons";
import "./Nav.css";

const NAV_ITEMS = [
  { to: "/", label: "Accueil", end: true, Icon: NavIconHome },
  { to: "/carte-du-jour", label: "Carte du jour", Icon: NavIconSun },
  { to: "/tirage", label: "Tirage", Icon: FeatureIconCardsStar },
  { to: "/question", label: "Question", Icon: FeatureIconQuestionBubble },
  { to: "/historique", label: "Historique", Icon: NavIconClock },
  { to: "/encyclopedie", label: "Encyclopédie", Icon: NavIconBook },
  { to: "/statistiques", label: "Stats", Icon: NavIconChart },
] as const;

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <nav className="nav" aria-label="Navigation principale">
      <button
        type="button"
        className="nav__toggle"
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-controls="main-nav-links"
        aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
      >
        <span className="nav__toggle-icon" aria-hidden="true" />
        Menu
      </button>

      <div
        id="main-nav-links"
        className={`nav__links${isOpen ? " nav__links--open" : ""}`}
      >
        {NAV_ITEMS.map(({ to, label, Icon, ...rest }) => (
          <NavLink
            key={to}
            to={to}
            className="nav__link"
            onClick={() => setIsOpen(false)}
            {...rest}
          >
            <Icon className="nav__link-icon" />
            <span className="nav__link-text">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
