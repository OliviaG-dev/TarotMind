import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getDailyCard, getDailyMessage, getMonthlyCard, getMonthlyMessage, getYearlyCard, getYearlyMessage } from '../../lib/dailyCard'
import type { TarotCard } from '../../types/tarot'
import './dailyCard.css'

function CardReveal({ card, label, message, period }: {
  card: TarotCard
  label: string
  message?: string
  period: string
}) {
  return (
    <div className="daily-card__reveal">
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
    </div>
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
          Basees sur la numerologie de la date, ces cartes t'accompagnent
          au quotidien, ce mois-ci et tout au long de l'annee.
        </p>
      </header>

      <div className="daily-card__grid">
        <CardReveal
          card={daily.card}
          label={formattedDate}
          message={message}
          period="Carte du jour"
        />
        <CardReveal
          card={monthly.card}
          label={monthly.label}
          message={monthlyMessage}
          period="Carte du mois"
        />
        <CardReveal
          card={yearly.card}
          label={yearly.label}
          message={yearlyMessage}
          period="Carte de l'annee"
        />
      </div>

      <div className="cta-nav">
        <Link to="/tirage" className="cta-nav__link">
          Faire un tirage &rarr;
        </Link>
      </div>
    </div>
  )
}
