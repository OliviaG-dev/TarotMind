import { Link } from 'react-router-dom'
import type {
  DeckPreference,
  Gender,
  GoalId,
  RelationshipStatus,
  WorkSituation,
} from '../../types/tarot'
import { useProfile } from '../../context/ProfileContext'
import './profile.css'

const RELATIONSHIP: { value: RelationshipStatus; label: string }[] = [
  { value: 'single', label: 'Célibataire' },
  { value: 'couple', label: 'En couple' },
  { value: 'complicated', label: 'Situation complexe' },
  { value: 'separation', label: 'En séparation' },
  { value: 'prefer_not', label: 'Je préfère ne pas préciser' },
]

const GENDER: { value: Gender; label: string }[] = [
  { value: 'female', label: 'Femme' },
  { value: 'male', label: 'Homme' },
  { value: 'non_binary', label: 'Non binaire' },
  { value: 'other', label: 'Autre' },
  { value: 'prefer_not', label: 'Je préfère ne pas préciser' },
]

const WORK: { value: WorkSituation; label: string }[] = [
  { value: 'student', label: 'Étudiant·e' },
  { value: 'employed', label: 'Salarié·e' },
  { value: 'freelance', label: 'Indépendant·e' },
  { value: 'seeking', label: 'En recherche d’emploi' },
  { value: 'retired', label: 'Retraité·e' },
  { value: 'other', label: 'Autre / en transition' },
]

const GOALS: { id: GoalId; label: string; icon: string }[] = [
  { id: 'love', label: 'Amour', icon: '/icons/amour.png' },
  { id: 'money', label: 'Argent', icon: '/icons/argent.png' },
  { id: 'wellbeing', label: 'Bien-être', icon: '/icons/bien-etre.png' },
]

const DECK: { value: DeckPreference; label: string; hint: string }[] = [
  {
    value: 'majors_only',
    label: 'Arcanes majeurs seulement',
    hint: 'Les 22 lames du chemin initiatique (Mat → Monde).',
  },
  {
    value: 'majors_and_minors',
    label: 'Majeurs + mineurs',
    hint: 'Jeu complet : grands archétypes et cartes du quotidien.',
  },
  {
    value: 'minors_only',
    label: 'Arcanes mineurs seulement',
    hint: 'Coupes, Bâtons, Épées, Deniers : situations concrètes.',
  },
]

export default function ProfilePage() {
  const { profile, updateProfile } = useProfile()

  function toggleGoal(id: GoalId) {
    const has = profile.goals.includes(id)
    updateProfile({
      goals: has
        ? profile.goals.filter((g) => g !== id)
        : [...profile.goals, id],
    })
  }

  return (
    <div className="profile-page">
      <header className="profile-page__intro">
        <div className="page-heading profile-page__heading">
          <img
            src="/img/profil.png"
            alt=""
            className="page-heading__icon"
            width={56}
            height={56}
            decoding="async"
          />
          <h1 className="profile-page__title">Profil utilisateur</h1>
        </div>
        <p className="profile-page__subtitle">
          Ces informations servent à personnaliser les interprétations (ex. :
          « En tant que personne en séparation… »). Tout est stocké localement
          dans ton navigateur.
        </p>
      </header>

      <form
        className="profile-page__form"
        onSubmit={(e) => e.preventDefault()}
      >
        <fieldset className="profile-page__field profile-page__field--compact">
          <legend>Statut amoureux</legend>
          <select
            value={profile.relationshipStatus}
            onChange={(e) =>
              updateProfile({
                relationshipStatus: e.target.value as RelationshipStatus,
              })
            }
            aria-label="Statut amoureux"
          >
            {RELATIONSHIP.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </fieldset>

        <fieldset className="profile-page__field profile-page__field--compact">
          <legend>Sexe / genre</legend>
          <select
            value={profile.gender}
            onChange={(e) =>
              updateProfile({ gender: e.target.value as Gender })
            }
            aria-label="Sexe ou genre"
          >
            {GENDER.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </fieldset>

        <fieldset className="profile-page__field profile-page__field--compact">
          <legend>Situation professionnelle</legend>
          <select
            value={profile.workSituation}
            onChange={(e) =>
              updateProfile({
                workSituation: e.target.value as WorkSituation,
              })
            }
            aria-label="Situation professionnelle"
          >
            {WORK.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </fieldset>

        <fieldset className="profile-page__field profile-page__field--deck">
          <legend>Type de jeu (tarot)</legend>
          <p className="profile-page__hint">
            Les listes de cartes sur la page Tirage suivent ce réglage.
          </p>
          <div className="profile-page__deck">
            {DECK.map((d) => (
              <label
                key={d.value}
                className={`profile-page__deck-option ${profile.deckPreference === d.value ? 'profile-page__deck-option--on' : ''}`}
              >
                <input
                  type="radio"
                  name="deck"
                  value={d.value}
                  checked={profile.deckPreference === d.value}
                  onChange={() =>
                    updateProfile({ deckPreference: d.value })
                  }
                />
                <span className="profile-page__deck-label">{d.label}</span>
                <span className="profile-page__deck-hint">{d.hint}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="profile-page__field profile-page__field--goals">
          <legend>Objectifs actuels</legend>
          <p className="profile-page__hint">
            Plusieurs choix possibles. L’IA pourra prioriser ces thèmes.
          </p>
          <div className="profile-page__goals">
            {GOALS.map((g) => (
              <label key={g.id} className="profile-page__goal">
                <input
                  type="checkbox"
                  checked={profile.goals.includes(g.id)}
                  onChange={() => toggleGoal(g.id)}
                />
                <img
                  src={g.icon}
                  alt=""
                  width={20}
                  height={20}
                  decoding="async"
                  aria-hidden
                />
                <span>{g.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </form>

      <div className="cta-nav">
        <Link to="/tirage" className="cta-nav__link">
          Continuer →
        </Link>
      </div>
    </div>
  )
}
