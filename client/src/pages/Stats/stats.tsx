import { useMemo, useState } from 'react'
import type { ComponentType } from 'react'
import { Link } from 'react-router-dom'
import {
  DecoSoftCloud,
  DecoSoftCrescentMoon,
  DecoSoftSparkle,
  FeatureIconCardsStar,
  FeatureIconQuestionBubble,
  FeatureIconSparkle,
  NavIconChart,
  NavIconClock,
} from '../../components/Nav/NavIcons'
import { SPREADS } from '../../data/spreads'
import { useHistory } from '../../context/HistoryContext'
import type { DrawRecord } from '../../types/tarot'
import '../Home/home.css'
import './stats.css'

type FeatureTheme = 'purple' | 'pink' | 'green'

type IconProps = { className?: string }

const TOP_CARDS_PAGE_SIZE = 5

const KPI_CONFIG: {
  id: 'total' | 'questions' | 'favorites' | 'weeksActive'
  label: string
  theme: FeatureTheme
  Icon: ComponentType<IconProps>
}[] = [
  { id: 'total', label: 'Tirages au total', theme: 'purple', Icon: FeatureIconCardsStar },
  { id: 'questions', label: 'Questions posées', theme: 'pink', Icon: FeatureIconQuestionBubble },
  { id: 'favorites', label: 'Favoris', theme: 'green', Icon: FeatureIconSparkle },
  { id: 'weeksActive', label: 'Semaines actives', theme: 'purple', Icon: NavIconClock },
]

function computeStats(draws: DrawRecord[]) {
  const total = draws.length
  const questions = draws.filter((d) => d.question).length
  const favorites = draws.filter((d) => d.favorite).length

  const cardCounts = new Map<string, number>()
  for (const d of draws) {
    for (const c of d.cards) {
      cardCounts.set(c.card.nameFr, (cardCounts.get(c.card.nameFr) ?? 0) + 1)
    }
  }
  const topCards = [...cardCounts.entries()].sort((a, b) => b[1] - a[1])

  const spreadCounts = new Map<string, number>()
  for (const d of draws) {
    spreadCounts.set(d.spreadLabel, (spreadCounts.get(d.spreadLabel) ?? 0) + 1)
  }
  const spreads = SPREADS.map((spread) => ({
    label: spread.label,
    count: spreadCounts.get(spread.label) ?? 0,
    icon: spread.icon,
  }))
  for (const [label, count] of spreadCounts) {
    if (!SPREADS.some((spread) => spread.label === label)) {
      spreads.push({ label, count })
    }
  }

  const weekMap = new Map<string, number>()
  for (const d of draws) {
    const date = new Date(d.createdAt)
    const weekStart = new Date(date)
    weekStart.setDate(date.getDate() - date.getDay())
    const key = weekStart.toISOString().slice(0, 10)
    weekMap.set(key, (weekMap.get(key) ?? 0) + 1)
  }
  const weeksActive = weekMap.size

  return { total, questions, favorites, topCards, spreads, weeksActive }
}

function StatsCardDeco({
  theme,
  variant = 'default',
}: {
  theme: FeatureTheme
  variant?: 'default' | 'cards-section' | 'spreads-section'
}) {
  return (
    <span className="home__feature-deco stats-page__deco" aria-hidden="true">
      {(theme === 'purple' || theme === 'green') && variant !== 'cards-section' && (
        <DecoSoftCloud className="home__feature-deco-soft-cloud" />
      )}
      {theme === 'green' && (
        <>
          <DecoSoftCloud className="home__feature-deco-soft-cloud home__feature-deco-soft-cloud--right" />
          <DecoSoftSparkle className="home__feature-deco-spark home__feature-deco-spark--green-cloud" />
        </>
      )}
      {theme === 'purple' && variant === 'default' && (
        <>
          <DecoSoftSparkle className="home__feature-deco-soft-spark home__feature-deco-soft-spark--a" />
          <DecoSoftSparkle className="home__feature-deco-soft-spark home__feature-deco-soft-spark--b" />
          <DecoSoftSparkle className="home__feature-deco-soft-spark home__feature-deco-soft-spark--c" />
        </>
      )}
      {theme === 'purple' && variant === 'cards-section' && (
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
      {theme === 'pink' && variant === 'spreads-section' && (
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
      {theme === 'pink' && variant === 'default' && (
        <>
          <DecoSoftCrescentMoon className="home__feature-deco-moon" />
          <DecoSoftSparkle className="home__feature-deco-spark home__feature-deco-spark--pink-moon" />
          <DecoSoftSparkle className="home__feature-deco-spark home__feature-deco-spark--pink-a" />
        </>
      )}
    </span>
  )
}

function StatsIntro() {
  return (
    <header className="stats-page__intro">
      <div className="page-heading stats-page__heading">
        <span className="stats-page__heading-icon home__feature-icon-wrap">
          <NavIconChart className="home__feature-icon" />
        </span>
        <h1 className="stats-page__title">Statistiques</h1>
      </div>
      <p className="stats-page__subtitle">
        Un aperçu doux et clair de ton parcours avec le tarot.
      </p>
    </header>
  )
}

export default function StatsPage() {
  const { draws } = useHistory()
  const stats = useMemo(() => computeStats(draws), [draws])
  const topCardsLength = stats.topCards.length
  const [pageState, setPageState] = useState({ anchor: topCardsLength, page: 0 })

  const maxCardCount = stats.topCards.length > 0 ? stats.topCards[0]![1] : 1
  const totalCardPages = Math.max(
    1,
    Math.ceil(stats.topCards.length / TOP_CARDS_PAGE_SIZE),
  )
  const cardsPage =
    pageState.anchor === topCardsLength
      ? Math.min(Math.max(0, pageState.page), totalCardPages - 1)
      : 0
  const setCardsPage = (nextPage: number | ((page: number) => number)) => {
    setPageState((current) => {
      const basePage =
        current.anchor === topCardsLength ? current.page : 0
      const resolvedPage =
        typeof nextPage === 'function' ? nextPage(basePage) : nextPage
      return {
        anchor: topCardsLength,
        page: Math.min(Math.max(0, resolvedPage), totalCardPages - 1),
      }
    })
  }
  const visibleTopCards = stats.topCards.slice(
    cardsPage * TOP_CARDS_PAGE_SIZE,
    cardsPage * TOP_CARDS_PAGE_SIZE + TOP_CARDS_PAGE_SIZE,
  )

  if (draws.length === 0) {
    return (
      <div className="stats-page">
        <StatsIntro />
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
    )
  }

  return (
    <div className="stats-page">
      <StatsIntro />

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
              <span className="stats-page__kpi-label home__feature-text">{label}</span>
            </span>
          </article>
        ))}
      </div>

      <section
        className="stats-page__section home__feature-card home__feature-card--purple"
        aria-labelledby="stats-cards-h"
      >
        <StatsCardDeco theme="purple" variant="cards-section" />
        <h2 id="stats-cards-h" className="stats-page__h2">
          Cartes les plus fréquentes
        </h2>
        <ul className="stats-page__bar-list">
          {visibleTopCards.map(([name, count]) => (
            <li key={name} className="stats-page__bar-item">
              <span className="stats-page__bar-label">{name}</span>
              <div className="stats-page__bar-track">
                <div
                  className="stats-page__bar-fill"
                  style={{ width: `${(count / maxCardCount) * 100}%` }}
                />
              </div>
              <span className="stats-page__bar-count">{count}</span>
            </li>
          ))}
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
          {stats.spreads.map((spread) => (
            <li
              key={spread.label}
              className={`stats-page__spread-item${spread.count === 0 ? ' stats-page__spread-item--empty' : ''}`}
            >
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
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
