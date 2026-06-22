import { useMemo } from 'react'
import {
  DecoSoftCloud,
  DecoSoftCrescentMoon,
  DecoSoftSparkle,
} from '../../components/Nav/NavIcons'
import { getDailyCard, getDailyMessage, getMonthlyCard, getMonthlyMessage, getYearlyCard, getYearlyMessage } from '../../lib/dailyCard'
import type { TarotCard } from '../../types/tarot'
import '../Home/home.css'
import './dailyCard.css'

const FEATURE_THEME = {
  day: 'purple',
  month: 'pink',
  year: 'green',
} as const

type FeatureTheme = (typeof FEATURE_THEME)[keyof typeof FEATURE_THEME]

function FeatureCardDeco({ theme }: { theme: FeatureTheme }) {
  return (
    <>
      <span className="home__feature-deco" aria-hidden="true">
        {(theme === 'purple' || theme === 'green') && (
          <DecoSoftCloud className="home__feature-deco-soft-cloud" />
        )}
        {theme === 'green' && (
          <>
            <DecoSoftCloud className="home__feature-deco-soft-cloud home__feature-deco-soft-cloud--right" />
            <DecoSoftSparkle className="home__feature-deco-spark home__feature-deco-spark--green-left-cloud" />
            <DecoSoftSparkle className="home__feature-deco-spark home__feature-deco-spark--green-left-cloud-sm" />
            <DecoSoftSparkle className="home__feature-deco-spark home__feature-deco-spark--green-cloud" />
          </>
        )}
        {theme === 'purple' && (
          <>
            <DecoSoftSparkle className="home__feature-deco-soft-spark home__feature-deco-soft-spark--a" />
            <DecoSoftSparkle className="home__feature-deco-soft-spark home__feature-deco-soft-spark--b" />
            <DecoSoftSparkle className="home__feature-deco-soft-spark home__feature-deco-soft-spark--c" />
          </>
        )}
        {theme === 'pink' && (
          <>
            <DecoSoftCrescentMoon className="home__feature-deco-moon" />
            <DecoSoftSparkle className="home__feature-deco-spark home__feature-deco-spark--pink-moon" />
            <DecoSoftSparkle className="home__feature-deco-spark home__feature-deco-spark--pink-a" />
            <DecoSoftSparkle className="home__feature-deco-spark home__feature-deco-spark--pink-b" />
          </>
        )}
      </span>
      <span className="daily-card__deco-extra" aria-hidden="true">
        {theme === 'pink' && (
          <DecoSoftCloud className="daily-card__deco-cloud daily-card__deco-cloud--tr" />
        )}
        <DecoSoftSparkle className="daily-card__deco-spark daily-card__deco-spark--a" />
        <DecoSoftSparkle className="daily-card__deco-spark daily-card__deco-spark--b" />
        <DecoSoftSparkle className="daily-card__deco-spark daily-card__deco-spark--c" />
        <DecoSoftSparkle className="daily-card__deco-spark daily-card__deco-spark--d" />
        <DecoSoftSparkle className="daily-card__deco-spark daily-card__deco-spark--left-mid" />
        <DecoSoftSparkle className="daily-card__deco-spark daily-card__deco-spark--left-mid-sm" />
        <DecoSoftSparkle className="daily-card__deco-spark daily-card__deco-spark--right-mid" />
        <DecoSoftSparkle className="daily-card__deco-spark daily-card__deco-spark--right-mid-sm" />
      </span>
    </>
  )
}

function CardReveal({ card, label, message, period, variant }: {
  card: TarotCard
  label: string
  message?: string
  period: string
  variant: keyof typeof FEATURE_THEME
}) {
  const theme = FEATURE_THEME[variant]

  return (
    <article className={`daily-card__reveal home__feature-card home__feature-card--${theme}`}>
      <FeatureCardDeco theme={theme} />
      <span className="daily-card__period">{period}</span>
      <div className="daily-card__card-face">
        <h2 className="daily-card__card-name">{card.nameFr}</h2>
        <ul className="daily-card__keywords">
          {card.keywords.map((kw) => (
            <li key={kw} className="daily-card__keyword">{kw}</li>
          ))}
        </ul>
      </div>
      {message && <p className="daily-card__message">{message}</p>}
      <p className="daily-card__date">{label}</p>
    </article>
  )
}

export default function DailyCardPage() {
  const daily = useMemo(() => getDailyCard(), [])
  const monthly = useMemo(() => getMonthlyCard(), [])
  const yearly = useMemo(() => getYearlyCard(), [])
  const message = useMemo(() => getDailyMessage(daily.card.id, false), [daily])
  const monthlyMessage = useMemo(() => getMonthlyMessage(monthly.card.id), [monthly])
  const yearlyMessage = useMemo(() => getYearlyMessage(yearly.card.id), [yearly])

  const formattedDate = new Date(daily.date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="daily-card">
      <header className="daily-card__intro">
        <div className="page-heading daily-card__heading">
          <h1 className="daily-card__title">Tes cartes</h1>
        </div>
        <p className="daily-card__subtitle">
          Basées sur la numérologie de la date, ces cartes t'accompagnent
          au quotidien, ce mois-ci et tout au long de l'année.
        </p>
      </header>

      <div className="daily-card__grid">
        <CardReveal
          card={daily.card}
          label={formattedDate}
          message={message}
          period="Carte du jour"
          variant="day"
        />
        <CardReveal
          card={monthly.card}
          label={monthly.label}
          message={monthlyMessage}
          period="Carte du mois"
          variant="month"
        />
        <CardReveal
          card={yearly.card}
          label={yearly.label}
          message={yearlyMessage}
          period="Carte de l'année"
          variant="year"
        />
      </div>
    </div>
  )
}
