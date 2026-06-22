import { useMemo, useState } from "react";
import type { ComponentType, CSSProperties } from "react";
import { Link } from "react-router-dom";
import {
  DecoSoftCloud,
  DecoSoftCrescentMoon,
  DecoSoftSparkle,
  FeatureIconCardsStar,
  FeatureIconQuestionBubble,
  FeatureIconSparkle,
  NavIconChart,
  NavIconClock,
} from "../../components/Nav/NavIcons";
import { useHistory } from "../../context/HistoryContext";
import {
  STATS_PERIOD_OPTIONS,
  computeStats,
  filterDrawsByPeriod,
  type StatsPeriod,
} from "../../lib/stats";
import type { DrawRecord } from "../../types/tarot";
import "../Home/home.css";
import "./stats.css";

type FeatureTheme = "purple" | "pink" | "green";

type IconProps = { className?: string };

const TOP_CARDS_PAGE_SIZE = 5;

const KPI_CONFIG: {
  id: "total" | "questions" | "favorites" | "weeksActive";
  label: string;
  theme: FeatureTheme;
  Icon: ComponentType<IconProps>;
}[] = [
  {
    id: "total",
    label: "Tirages au total",
    theme: "purple",
    Icon: FeatureIconCardsStar,
  },
  {
    id: "questions",
    label: "Questions posées",
    theme: "pink",
    Icon: FeatureIconQuestionBubble,
  },
  {
    id: "favorites",
    label: "Favoris",
    theme: "green",
    Icon: FeatureIconSparkle,
  },
  {
    id: "weeksActive",
    label: "Semaines actives",
    theme: "purple",
    Icon: NavIconClock,
  },
];

function StatsCardDeco({
  theme,
  variant = "default",
}: {
  theme: FeatureTheme;
  variant?:
    | "default"
    | "cards-section"
    | "spreads-section"
    | "tones-section"
    | "activity-section";
}) {
  return (
    <span className="home__feature-deco stats-page__deco" aria-hidden="true">
      {(theme === "purple" || theme === "green") &&
        variant !== "cards-section" &&
        variant !== "activity-section" &&
        variant !== "tones-section" && (
          <DecoSoftCloud className="home__feature-deco-soft-cloud" />
        )}
      {theme === "green" &&
        variant !== "activity-section" &&
        variant !== "tones-section" && (
          <>
            <DecoSoftCloud className="home__feature-deco-soft-cloud home__feature-deco-soft-cloud--right" />
            <DecoSoftSparkle className="home__feature-deco-spark home__feature-deco-spark--green-cloud" />
          </>
        )}
      {theme === "purple" && variant === "default" && (
        <>
          <DecoSoftSparkle className="home__feature-deco-soft-spark home__feature-deco-soft-spark--a" />
          <DecoSoftSparkle className="home__feature-deco-soft-spark home__feature-deco-soft-spark--b" />
          <DecoSoftSparkle className="home__feature-deco-soft-spark home__feature-deco-soft-spark--c" />
        </>
      )}
      {theme === "purple" && variant === "cards-section" && (
        <>
          <DecoSoftSparkle className="stats-page__section-spark stats-page__section-spark--a" />
          <DecoSoftSparkle className="stats-page__section-spark stats-page__section-spark--b" />
          <DecoSoftSparkle className="stats-page__section-spark stats-page__section-spark--c" />
          <DecoSoftSparkle className="stats-page__section-spark stats-page__section-spark--d" />
          <DecoSoftSparkle className="stats-page__section-spark stats-page__section-spark--e" />
          <DecoSoftSparkle className="stats-page__section-spark stats-page__section-spark--f" />
          <DecoSoftSparkle className="stats-page__section-spark stats-page__section-spark--g" />
        </>
      )}
      {theme === "pink" && variant === "spreads-section" && (
        <>
          <DecoSoftCrescentMoon className="stats-page__section-pink-moon" />
          <DecoSoftSparkle className="stats-page__section-pink-spark stats-page__section-pink-spark--a" />
          <DecoSoftSparkle className="stats-page__section-pink-spark stats-page__section-pink-spark--b" />
          <DecoSoftSparkle className="stats-page__section-pink-spark stats-page__section-pink-spark--c" />
          <DecoSoftSparkle className="stats-page__section-pink-spark stats-page__section-pink-spark--d" />
          <DecoSoftSparkle className="stats-page__section-pink-spark stats-page__section-pink-spark--e" />
          <DecoSoftSparkle className="stats-page__section-pink-spark stats-page__section-pink-spark--f" />
        </>
      )}
      {theme === "green" && variant === "tones-section" && (
        <>
          <DecoSoftSparkle className="stats-page__section-tone-spark stats-page__section-tone-spark--a" />
          <DecoSoftSparkle className="stats-page__section-tone-spark stats-page__section-tone-spark--b" />
          <DecoSoftSparkle className="stats-page__section-tone-spark stats-page__section-tone-spark--c" />
          <DecoSoftSparkle className="stats-page__section-tone-spark stats-page__section-tone-spark--d" />
          <DecoSoftSparkle className="stats-page__section-tone-spark stats-page__section-tone-spark--e" />
          <DecoSoftSparkle className="stats-page__section-tone-spark stats-page__section-tone-spark--f" />
          <DecoSoftSparkle className="stats-page__section-tone-spark stats-page__section-tone-spark--l-a" />
          <DecoSoftSparkle className="stats-page__section-tone-spark stats-page__section-tone-spark--l-b" />
          <DecoSoftSparkle className="stats-page__section-tone-spark stats-page__section-tone-spark--l-c" />
          <DecoSoftSparkle className="stats-page__section-tone-spark stats-page__section-tone-spark--l-d" />
          <DecoSoftSparkle className="stats-page__section-tone-spark stats-page__section-tone-spark--l-e" />
        </>
      )}
      {theme === "green" && variant === "activity-section" && (
        <>
          <DecoSoftSparkle className="stats-page__section-green-spark stats-page__section-green-spark--a" />
          <DecoSoftSparkle className="stats-page__section-green-spark stats-page__section-green-spark--b" />
          <DecoSoftSparkle className="stats-page__section-green-spark stats-page__section-green-spark--c" />
        </>
      )}
      {theme === "pink" && variant === "default" && (
        <>
          <DecoSoftCrescentMoon className="home__feature-deco-moon" />
          <DecoSoftSparkle className="home__feature-deco-spark home__feature-deco-spark--pink-moon" />
          <DecoSoftSparkle className="home__feature-deco-spark home__feature-deco-spark--pink-a" />
        </>
      )}
    </span>
  );
}

function StatsIntro({
  period,
  onPeriodChange,
  filteredCount,
  totalCount,
}: {
  period: StatsPeriod;
  onPeriodChange: (period: StatsPeriod) => void;
  filteredCount?: number;
  totalCount?: number;
}) {
  const periodHint =
    period !== "all" && filteredCount !== undefined && totalCount !== undefined
      ? `${filteredCount} tirage${filteredCount > 1 ? "s" : ""} sur ${totalCount} au total.`
      : null;

  return (
    <header className="stats-page__intro">
      <div className="page-heading stats-page__heading">
        <span className="stats-page__heading-icon home__feature-icon-wrap">
          <NavIconChart className="home__feature-icon" />
        </span>
        <h1 className="stats-page__title">Statistiques</h1>
      </div>
      <p className="stats-page__subtitle">
        Un aperçu doux et clair de ton parcours avec le tarot, basé sur ton
        historique local.
      </p>
      <div
        className="stats-page__period"
        role="group"
        aria-label="Période affichée"
      >
        {STATS_PERIOD_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`stats-page__period-btn${period === option.value ? " stats-page__period-btn--on" : ""}`}
            aria-pressed={period === option.value}
            onClick={() => onPeriodChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
      {periodHint && <p className="stats-page__period-hint">{periodHint}</p>}
    </header>
  );
}

function StatsContent({
  draws,
  period,
}: {
  draws: DrawRecord[];
  period: StatsPeriod;
}) {
  const stats = useMemo(() => computeStats(draws, period), [draws, period]);
  const topCardsLength = stats.topCards.length;
  const [pageState, setPageState] = useState({
    anchor: topCardsLength,
    page: 0,
  });

  const totalCardPages = Math.max(
    1,
    Math.ceil(stats.topCards.length / TOP_CARDS_PAGE_SIZE),
  );
  const cardsPage =
    pageState.anchor === topCardsLength
      ? Math.min(Math.max(0, pageState.page), totalCardPages - 1)
      : 0;
  const setCardsPage = (nextPage: number | ((page: number) => number)) => {
    setPageState((current) => {
      const basePage = current.anchor === topCardsLength ? current.page : 0;
      const resolvedPage =
        typeof nextPage === "function" ? nextPage(basePage) : nextPage;
      return {
        anchor: topCardsLength,
        page: Math.min(Math.max(0, resolvedPage), totalCardPages - 1),
      };
    });
  };
  const visibleTopCards = stats.topCards.slice(
    cardsPage * TOP_CARDS_PAGE_SIZE,
    cardsPage * TOP_CARDS_PAGE_SIZE + TOP_CARDS_PAGE_SIZE,
  );

  const activityMax = Math.max(
    1,
    ...stats.activity.map((bucket) => bucket.count),
  );
  const activityTitle =
    period === "7d" ? "Activité des 7 derniers jours" : "Activité par semaine";

  return (
    <>
      <div className="stats-page__grid">
        {KPI_CONFIG.map(({ id, label, theme, Icon }, index) => (
          <article
            key={id}
            className={`stats-page__kpi home__feature-card home__feature-card--${theme}`}
            style={{ animationDelay: `${index * 0.06}s` }}
          >
            <StatsCardDeco theme={theme} />
            <span className="home__feature-icon-wrap">
              <Icon className="home__feature-icon" />
            </span>
            <span className="stats-page__kpi-body home__feature-body">
              <span className="stats-page__kpi-value">{stats[id]}</span>
              <span className="stats-page__kpi-label home__feature-text">
                {label}
              </span>
            </span>
          </article>
        ))}
      </div>

      <section
        className="stats-page__section home__feature-card home__feature-card--green"
        aria-labelledby="stats-tones-h"
      >
        <StatsCardDeco theme="green" variant="tones-section" />
        <h2 id="stats-tones-h" className="stats-page__h2">
          Répartition par ton
        </h2>
        <ul className="stats-page__tone-grid">
          {stats.tones.map((toneStat) => (
            <li
              key={toneStat.tone}
              className={`stats-page__tone-item${toneStat.count === 0 ? " stats-page__tone-item--empty" : ""}`}
            >
              <span className="stats-page__tone-count">{toneStat.count}</span>
              <span className="stats-page__tone-name">{toneStat.label}</span>
            </li>
          ))}
        </ul>
      </section>

      <section
        className="stats-page__section home__feature-card home__feature-card--purple"
        aria-labelledby="stats-cards-h"
      >
        <StatsCardDeco theme="purple" variant="cards-section" />
        <h2 id="stats-cards-h" className="stats-page__h2">
          Cartes les plus fréquentes
        </h2>
        <ul className="stats-page__top-list">
          {visibleTopCards.map((cardStat, index) => {
            const rank = cardsPage * TOP_CARDS_PAGE_SIZE + index + 1;

            return (
              <li
                key={cardStat.cardId}
                className={`stats-page__top-item${rank === 1 ? " stats-page__top-item--lead" : ""}`}
                style={{ "--top-index": index } as CSSProperties}
              >
                <span className="stats-page__top-rank" aria-hidden="true">
                  {String(rank).padStart(2, "0")}
                </span>
                <Link
                  to={`/encyclopedie?carte=${encodeURIComponent(cardStat.cardId)}`}
                  className="stats-page__top-name stats-page__top-link"
                >
                  {cardStat.nameFr}
                </Link>
                <span
                  className="stats-page__top-count"
                  aria-label={`${cardStat.count} apparition${cardStat.count > 1 ? "s" : ""}`}
                >
                  <span className="stats-page__top-count-value">
                    {cardStat.count}
                  </span>
                  <span className="stats-page__top-count-times">×</span>
                </span>
              </li>
            );
          })}
        </ul>
        {stats.topCards.length > TOP_CARDS_PAGE_SIZE && (
          <nav
            className="stats-page__cards-pagination"
            aria-label="Pagination des cartes fréquentes"
          >
            <button
              type="button"
              className="stats-page__cards-page-btn"
              disabled={cardsPage === 0}
              onClick={() => setCardsPage((page) => page - 1)}
            >
              Précédent
            </button>
            <span className="stats-page__cards-page-info">
              Page {cardsPage + 1} / {totalCardPages}
            </span>
            <button
              type="button"
              className="stats-page__cards-page-btn"
              disabled={cardsPage >= totalCardPages - 1}
              onClick={() => setCardsPage((page) => page + 1)}
            >
              Suivant
            </button>
          </nav>
        )}
      </section>

      <section
        className="stats-page__section home__feature-card home__feature-card--pink"
        aria-labelledby="stats-spreads-h"
      >
        <StatsCardDeco theme="pink" variant="spreads-section" />
        <h2 id="stats-spreads-h" className="stats-page__h2">
          Répartition par type de tirage
        </h2>
        <ul className="stats-page__spread-grid">
          {stats.spreads.map((spread) => {
            const content = (
              <>
                {spread.icon && (
                  <span className="stats-page__spread-icon-wrap">
                    <img
                      src={spread.icon}
                      alt=""
                      className="stats-page__spread-icon"
                      width={28}
                      height={28}
                      decoding="async"
                      aria-hidden
                    />
                  </span>
                )}
                <span className="stats-page__spread-count">{spread.count}</span>
                <span className="stats-page__spread-name">{spread.label}</span>
              </>
            );

            return (
              <li
                key={spread.label}
                className={`stats-page__spread-item${spread.count === 0 ? " stats-page__spread-item--empty" : ""}`}
              >
                {spread.spreadId && spread.count > 0 ? (
                  <Link
                    to={`/historique?spread=${encodeURIComponent(spread.spreadId)}`}
                    className="stats-page__spread-link"
                  >
                    {content}
                  </Link>
                ) : (
                  content
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section
        className="stats-page__section home__feature-card home__feature-card--green"
        aria-labelledby="stats-activity-h"
      >
        <StatsCardDeco theme="green" variant="activity-section" />
        <h2 id="stats-activity-h" className="stats-page__h2">
          {activityTitle}
        </h2>
        <ul className="stats-page__activity">
          {stats.activity.map((bucket) => {
            const heightPct = Math.round((bucket.count / activityMax) * 100);

            return (
              <li key={bucket.key} className="stats-page__activity-item">
                <div
                  className="stats-page__activity-bar-wrap"
                  aria-hidden="true"
                >
                  <div
                    className="stats-page__activity-bar"
                    style={{
                      height: `${Math.max(heightPct, bucket.count > 0 ? 8 : 0)}%`,
                    }}
                  />
                </div>
                <span className="stats-page__activity-count">
                  {bucket.count}
                </span>
                <span className="stats-page__activity-label">
                  {bucket.label}
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}

export default function StatsPage() {
  const { draws } = useHistory();
  const [period, setPeriod] = useState<StatsPeriod>("all");
  const filteredDraws = useMemo(
    () => filterDrawsByPeriod(draws, period),
    [draws, period],
  );

  const periodLabel =
    STATS_PERIOD_OPTIONS.find((option) => option.value === period)?.label ?? "";

  if (draws.length === 0) {
    return (
      <div className="stats-page">
        <StatsIntro period={period} onPeriodChange={setPeriod} />
        <article className="stats-page__empty-panel home__feature-card home__feature-card--purple">
          <StatsCardDeco theme="purple" />
          <span className="home__feature-icon-wrap">
            <NavIconChart className="home__feature-icon" />
          </span>
          <p className="stats-page__empty">
            Aucun tirage enregistré. Fais ton premier tirage pour voir tes stats
            apparaître ici.
          </p>
          <div className="stats-page__empty-cta cta-nav">
            <Link to="/tirage" className="cta-nav__link">
              Faire un tirage &rarr;
            </Link>
          </div>
        </article>
      </div>
    );
  }

  if (filteredDraws.length === 0) {
    return (
      <div className="stats-page">
        <StatsIntro
          period={period}
          onPeriodChange={setPeriod}
          filteredCount={0}
          totalCount={draws.length}
        />
        <article className="stats-page__empty-panel home__feature-card home__feature-card--purple">
          <StatsCardDeco theme="purple" />
          <p className="stats-page__empty">
            Aucun tirage sur la période « {periodLabel} ». Essaie une autre
            période ou fais un nouveau tirage.
          </p>
          <div className="stats-page__empty-cta cta-nav">
            <Link to="/tirage" className="cta-nav__link">
              Faire un tirage &rarr;
            </Link>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="stats-page">
      <StatsIntro
        period={period}
        onPeriodChange={setPeriod}
        filteredCount={filteredDraws.length}
        totalCount={draws.length}
      />
      <StatsContent draws={filteredDraws} period={period} />
    </div>
  );
}
