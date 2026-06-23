import { Link } from "react-router-dom";
import type {
  DeckPreference,
  Gender,
  GoalId,
  RelationshipStatus,
  WorkSituation,
} from "../../types/tarot";
import {
  DecoSoftCloud,
  DecoSoftCrescentMoon,
  DecoSoftSparkle,
  NavIconProfile,
} from "../../components/Nav/NavIcons";
import { useProfile } from "../../context/ProfileContext";
import "../Home/home.css";
import "./profile.css";

const RELATIONSHIP: { value: RelationshipStatus; label: string }[] = [
  { value: "single", label: "Célibataire" },
  { value: "couple", label: "En couple" },
  { value: "complicated", label: "Situation complexe" },
  { value: "separation", label: "En séparation" },
  { value: "prefer_not", label: "Je préfère ne pas préciser" },
];

const GENDER: { value: Gender; label: string }[] = [
  { value: "female", label: "Femme" },
  { value: "male", label: "Homme" },
  { value: "non_binary", label: "Non binaire" },
  { value: "other", label: "Autre" },
  { value: "prefer_not", label: "Je préfère ne pas préciser" },
];

const WORK: { value: WorkSituation; label: string }[] = [
  { value: "student", label: "Étudiant·e" },
  { value: "employed", label: "Salarié·e" },
  { value: "freelance", label: "Indépendant·e" },
  { value: "seeking", label: "En recherche d'emploi" },
  { value: "retired", label: "Retraité·e" },
  { value: "other", label: "Autre / en transition" },
];

const GOALS: { id: GoalId; label: string; icon: string }[] = [
  { id: "love", label: "Amour", icon: "/icons/amour.png" },
  { id: "money", label: "Argent", icon: "/icons/argent.png" },
  { id: "wellbeing", label: "Bien-être", icon: "/icons/bien-etre.png" },
];

const DECK: { value: DeckPreference; label: string; hint: string }[] = [
  {
    value: "majors_only",
    label: "Arcanes majeurs seulement",
    hint: "Les 22 lames du chemin initiatique (Mat → Monde).",
  },
  {
    value: "majors_and_minors",
    label: "Majeurs + mineurs",
    hint: "Jeu complet : grands archétypes et cartes du quotidien.",
  },
  {
    value: "minors_only",
    label: "Arcanes mineurs seulement",
    hint: "Coupes, Bâtons, Épées, Deniers : situations concrètes.",
  },
];

type PanelTheme = "purple" | "pink" | "green";

function ProfilePanelDeco({
  theme,
  variant = "default",
}: {
  theme: PanelTheme;
  variant?: "default" | "deck" | "goals" | "compact";
}) {
  return (
    <span className="home__feature-deco profile-page__deco" aria-hidden="true">
      {theme === "purple" && variant === "default" && (
        <>
          <DecoSoftCloud className="home__feature-deco-soft-cloud" />
          <DecoSoftSparkle className="home__feature-deco-soft-spark home__feature-deco-soft-spark--a" />
          <DecoSoftSparkle className="home__feature-deco-soft-spark home__feature-deco-soft-spark--b" />
          <DecoSoftSparkle className="home__feature-deco-soft-spark home__feature-deco-soft-spark--c" />
        </>
      )}
      {theme === "purple" && variant === "deck" && (
        <>
          <DecoSoftSparkle className="profile-page__purple-spark profile-page__purple-spark--a" />
          <DecoSoftSparkle className="profile-page__purple-spark profile-page__purple-spark--b" />
          <DecoSoftSparkle className="profile-page__purple-spark profile-page__purple-spark--c" />
        </>
      )}
      {theme === "pink" && (
        <>
          <DecoSoftCrescentMoon className="profile-page__pink-moon" />
          <DecoSoftSparkle className="profile-page__pink-spark profile-page__pink-spark--a" />
          <DecoSoftSparkle className="profile-page__pink-spark profile-page__pink-spark--b" />
        </>
      )}
      {theme === "green" && variant === "goals" && (
        <>
          <DecoSoftCloud className="home__feature-deco-soft-cloud" />
          <DecoSoftCloud className="home__feature-deco-soft-cloud home__feature-deco-soft-cloud--right" />
          <DecoSoftSparkle className="home__feature-deco-spark home__feature-deco-spark--green-left-cloud" />
          <DecoSoftSparkle className="home__feature-deco-spark home__feature-deco-spark--green-cloud" />
          <DecoSoftSparkle className="profile-page__green-spark profile-page__green-spark--a" />
        </>
      )}
      {theme === "green" && variant === "compact" && (
        <>
          <DecoSoftCloud className="home__feature-deco-soft-cloud" />
          <DecoSoftSparkle className="profile-page__green-spark profile-page__green-spark--b" />
        </>
      )}
    </span>
  );
}

export default function ProfilePage() {
  const { profile, updateProfile } = useProfile();

  function toggleGoal(id: GoalId) {
    const has = profile.goals.includes(id);
    updateProfile({
      goals: has
        ? profile.goals.filter((g) => g !== id)
        : [...profile.goals, id],
    });
  }

  return (
    <div className="profile-page">
      <header className="profile-page__intro">
        <div className="page-heading profile-page__heading">
          <span className="profile-page__heading-icon home__feature-icon-wrap">
            <NavIconProfile className="home__feature-icon" />
          </span>
          <h1 className="profile-page__title">Mon profil</h1>
        </div>
        <p className="profile-page__subtitle">
          Ces informations servent à personnaliser les interprétations (ex. : «
          En tant que personne en séparation… »). Tout est stocké localement
          dans ton navigateur.
        </p>
      </header>

      <form className="profile-page__form" onSubmit={(e) => e.preventDefault()}>
        <section
          className="profile-page__panel profile-page__panel--compact home__feature-card home__feature-card--pink"
        >
          <ProfilePanelDeco theme="pink" variant="compact" />
          <h2 id="profile-relationship-heading" className="profile-page__h2">
            Statut amoureux
          </h2>
          <select
            className="profile-page__select"
            value={profile.relationshipStatus}
            onChange={(e) =>
              updateProfile({
                relationshipStatus: e.target.value as RelationshipStatus,
              })
            }
            aria-labelledby="profile-relationship-heading"
          >
            {RELATIONSHIP.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </section>

        <section
          className="profile-page__panel profile-page__panel--compact home__feature-card home__feature-card--purple"
        >
          <ProfilePanelDeco theme="purple" variant="default" />
          <h2 id="profile-gender-heading" className="profile-page__h2">
            Sexe / genre
          </h2>
          <select
            className="profile-page__select"
            value={profile.gender}
            onChange={(e) =>
              updateProfile({ gender: e.target.value as Gender })
            }
            aria-labelledby="profile-gender-heading"
          >
            {GENDER.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </section>

        <section
          className="profile-page__panel profile-page__panel--compact home__feature-card home__feature-card--green"
        >
          <ProfilePanelDeco theme="green" variant="compact" />
          <h2 id="profile-work-heading" className="profile-page__h2">
            Situation professionnelle
          </h2>
          <select
            className="profile-page__select"
            value={profile.workSituation}
            onChange={(e) =>
              updateProfile({
                workSituation: e.target.value as WorkSituation,
              })
            }
            aria-labelledby="profile-work-heading"
          >
            {WORK.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </section>

        <section
          className="profile-page__panel profile-page__panel--wide home__feature-card home__feature-card--purple"
          aria-labelledby="profile-deck-heading"
        >
          <ProfilePanelDeco theme="purple" variant="deck" />
          <h2 id="profile-deck-heading" className="profile-page__h2">
            Type de jeu (tarot)
          </h2>
          <p className="profile-page__hint">
            Choisis un seul type de jeu. Les listes de cartes sur la page
            Tirage suivent ce réglage.
          </p>
          <div className="profile-page__deck">
            {DECK.map((d) => (
              <label
                key={d.value}
                className={`profile-page__deck-option${profile.deckPreference === d.value ? " profile-page__deck-option--on" : ""}`}
              >
                <input
                  type="radio"
                  className="profile-page__deck-input"
                  name="deck"
                  value={d.value}
                  checked={profile.deckPreference === d.value}
                  onChange={() => updateProfile({ deckPreference: d.value })}
                />
                <span className="profile-page__deck-radio" aria-hidden="true" />
                <span className="profile-page__deck-text">
                  <span className="profile-page__deck-label">{d.label}</span>
                  <span className="profile-page__deck-hint">{d.hint}</span>
                </span>
              </label>
            ))}
          </div>
        </section>

        <section
          className="profile-page__panel profile-page__panel--wide home__feature-card home__feature-card--green"
          aria-labelledby="profile-goals-heading"
        >
          <ProfilePanelDeco theme="green" variant="goals" />
          <h2 id="profile-goals-heading" className="profile-page__h2">
            Objectifs actuels
          </h2>
          <p className="profile-page__hint">
            Coche un ou plusieurs objectifs. L&apos;IA pourra prioriser ces
            thèmes.
          </p>
          <div className="profile-page__goals">
            {GOALS.map((g) => (
              <label
                key={g.id}
                className={`profile-page__goal${profile.goals.includes(g.id) ? " profile-page__goal--on" : ""}`}
              >
                <input
                  type="checkbox"
                  className="profile-page__goal-input"
                  checked={profile.goals.includes(g.id)}
                  onChange={() => toggleGoal(g.id)}
                />
                <span className="profile-page__goal-checkbox" aria-hidden="true" />
                <span className="profile-page__goal-icon-wrap">
                  <img
                    src={g.icon}
                    alt=""
                    width={22}
                    height={22}
                    decoding="async"
                    aria-hidden
                  />
                </span>
                <span className="profile-page__goal-label">{g.label}</span>
              </label>
            ))}
          </div>
        </section>
      </form>

      <div className="profile-page__actions">
        <Link to="/tirage" className="profile-page__cta">
          Continuer →
        </Link>
      </div>
    </div>
  );
}
