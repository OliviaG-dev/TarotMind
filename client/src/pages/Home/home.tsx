import { Link } from 'react-router-dom'
import './home.css'

const FEATURES = [
  {
    to: '/carte-du-jour',
    title: 'Carte du jour',
    text: 'Chaque matin, une carte et un message d\'inspiration pour bien commencer ta journee.',
    icon: '/icons/1carte.png',
  },
  {
    to: '/tirage',
    title: 'Tire tes cartes',
    text: "Choisis un tirage, place tes cartes et laisse l'IA interpreter selon ton profil.",
    icon: '/icons/tirage-shema.png',
  },
  {
    to: '/question',
    title: 'Pose ta question',
    text: "Une question precise ? Tire tes cartes et obtiens une reponse personnalisee.",
    icon: '/icons/tirage-shema.png',
  },
  {
    to: '/profil',
    title: 'Ton espace perso',
    text: 'Configure ton profil pour des lectures plus justes et pertinentes.',
    icon: '/icons/profil-enrichi.png',
  },
  {
    to: '/historique',
    title: 'Ton parcours',
    text: 'Retrouve tes tirages, ajoute des notes, compare et observe ton evolution.',
    icon: '/icons/historique.png',
  },
  {
    to: '/encyclopedie',
    title: 'Encyclopedie',
    text: 'Explore les 78 cartes, leurs mots-cles et leurs significations.',
    icon: '/icons/tirage-shema.png',
  },
]

export default function Home() {
  return (
    <div className="home">
      <main className="home__main">
        <p className="home__tagline">
          Ton intuition, amplifiée
        </p>
        <div className="page-heading home__heading">
          <img
            src="/img/accueil.png"
            alt=""
            className="page-heading__icon"
            width={56}
            height={56}
            decoding="async"
          />
          <h1 className="home__title">TarotMind</h1>
        </div>
        <p className="home__lead">
          Le tarot, c'est avant tout une conversation avec toi-même.
          TarotMind t'accompagne dans cette exploration, avec douceur,
          intelligence et une touche de magie.
        </p>

        <section className="home__features" aria-labelledby="features-heading">
          <h2 id="features-heading" className="home__features-title">
            Comment ça marche
          </h2>
          <ul className="home__feature-list">
            {FEATURES.map((f) => (
              <li key={f.to}>
                <Link to={f.to} className="home__feature-card">
                  <img
                    className="home__feature-icon"
                    src={f.icon}
                    alt=""
                    width={34}
                    height={34}
                    decoding="async"
                    aria-hidden
                  />
                  <span className="home__feature-body">
                    <span className="home__feature-name">{f.title}</span>
                    <span className="home__feature-text">{f.text}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="home__section" aria-labelledby="pitch-heading">
          <h2 id="pitch-heading">Pourquoi TarotMind ?</h2>
          <p>
            Chaque tirage est unique, comme toi. L'interprétation tient
            compte de ta situation amoureuse, de ton parcours pro et de
            ce qui te préoccupe en ce moment.
          </p>
          <p>
            Pas de réponses toutes faites : des pistes de réflexion claires,
            des conseils concrets et une guidance qui grandit avec toi.
          </p>
          <p>
            Que tu cherches à y voir plus clair, à prendre une décision
            ou simplement à te reconnecter à toi-même, TarotMind est là.
          </p>
        </section>

        <section className="home__section" aria-labelledby="deck-heading">
          <h2 id="deck-heading">En un mot</h2>
          <blockquote className="home__quote">
            Un compagnon de route qui mêle sagesse du tarot et intelligence
            artificielle, pour t'offrir une lecture qui te ressemble,
            à tout moment.
          </blockquote>
        </section>

        <div className="cta-nav">
          <Link to="/profil" className="cta-nav__link">
            Commencer →
          </Link>
        </div>

      </main>

    </div>
  )
}
