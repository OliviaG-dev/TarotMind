import { Link } from 'react-router-dom'
import './home.css'

const FEATURES = [
  {
    to: '/tirage',
    title: 'Tirage & schéma',
    text: 'Tu tires avec ton jeu physique ; l’app affiche le schéma (1 carte, 3 temps, croix, thèmes…) pour que tu saisisses chaque arcane. L’IA interprète ensuite selon ton profil et le ton choisi.',
    emoji: '🔮',
  },
  {
    to: '/profil',
    title: 'Profil enrichi',
    text: 'Statut amoureux, genre, situation pro, objectifs amour / argent / bien-être pour des conseils et un suivi plus personnalisés.',
    emoji: '👤',
  },
  {
    to: '/historique',
    title: 'Historique & évolution',
    text: 'Timeline des tirages, comparaison entre deux tirages, aperçu d’analyse (motifs, thèmes) — prêt à être branché sur une vraie IA.',
    emoji: '📅',
  },
]

export default function Home() {
  return (
    <div className="home">
      <main className="home__main">
        <p className="home__tagline">
          L’intelligence artificielle au service de ton intuition
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
          Une application de nouvelle génération qui combine la sagesse
          ancestrale du tarot avec la puissance de l’intelligence artificielle —
          pour une expérience profondément personnelle.
        </p>

        <section className="home__features" aria-labelledby="features-heading">
          <h2 id="features-heading" className="home__features-title">
            Fonctionnalités
          </h2>
          <ul className="home__feature-list">
            {FEATURES.map((f) => (
              <li key={f.to}>
                <Link to={f.to} className="home__feature-card">
                  <span className="home__feature-emoji" aria-hidden>
                    {f.emoji}
                  </span>
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
          <h2 id="pitch-heading">Ce que propose TarotMind</h2>
          <p>
            Des tirages de cartes intelligents, capables de s’adapter au profil
            unique de chaque utilisateur : situation amoureuse, parcours
            professionnel, état émotionnel.
          </p>
          <p>
            Grâce à une IA avancée, chaque interprétation va au-delà des
            significations classiques : analyses précises, conseils concrets et
            une guidance qui évolue dans le temps.
          </p>
          <p>
            Pour prendre une décision, comprendre une situation ou te
            reconnecter à ton intuition — un guide moderne à la croisée de la
            spiritualité et de la technologie.
          </p>
        </section>

        <section className="home__section" aria-labelledby="deck-heading">
          <h2 id="deck-heading">En une phrase</h2>
          <blockquote className="home__quote">
            TarotMind transforme le tarot traditionnel en une expérience
            intelligente et personnalisée grâce à l’IA — une guidance sur
            mesure, évolutive et accessible à tout moment.
          </blockquote>
        </section>

        <p className="home__cta">
          <Link to="/tirage" className="home__cta-link">
            Commencer un tirage
          </Link>
        </p>
      </main>

      <footer className="home__footer">
        <span>TarotMind — prototype</span>
      </footer>
    </div>
  )
}
