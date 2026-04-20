import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useHistory } from '../../context/HistoryContext'
import type { DrawRecord } from '../../types/tarot'
import './stats.css'

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
  const topCards = [...cardCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

  const spreadCounts = new Map<string, number>()
  for (const d of draws) {
    spreadCounts.set(d.spreadLabel, (spreadCounts.get(d.spreadLabel) ?? 0) + 1)
  }
  const spreads = [...spreadCounts.entries()].sort((a, b) => b[1] - a[1])

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

export default function StatsPage() {
  const { draws } = useHistory()
  const stats = useMemo(() => computeStats(draws), [draws])

  const maxCardCount = stats.topCards.length > 0 ? stats.topCards[0]![1] : 1

  if (draws.length === 0) {
    return (
      <div className="stats-page">
        <header className="stats-page__intro">
          <div className="page-heading stats-page__heading">
            <h1 className="stats-page__title">Statistiques</h1>
          </div>
        </header>
        <p className="stats-page__empty">
          Aucun tirage enregistre. Fais ton premier tirage pour voir tes stats apparaitre ici.
        </p>
        <div className="cta-nav">
          <Link to="/tirage" className="cta-nav__link">Faire un tirage &rarr;</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="stats-page">
      <header className="stats-page__intro">
        <div className="page-heading stats-page__heading">
          <h1 className="stats-page__title">Statistiques</h1>
        </div>
        <p className="stats-page__subtitle">
          Un apercu de ton parcours avec le tarot.
        </p>
      </header>

      <div className="stats-page__grid">
        <div className="stats-page__kpi">
          <span className="stats-page__kpi-value">{stats.total}</span>
          <span className="stats-page__kpi-label">Tirages au total</span>
        </div>
        <div className="stats-page__kpi">
          <span className="stats-page__kpi-value">{stats.questions}</span>
          <span className="stats-page__kpi-label">Questions posees</span>
        </div>
        <div className="stats-page__kpi">
          <span className="stats-page__kpi-value">{stats.favorites}</span>
          <span className="stats-page__kpi-label">Favoris</span>
        </div>
        <div className="stats-page__kpi">
          <span className="stats-page__kpi-value">{stats.weeksActive}</span>
          <span className="stats-page__kpi-label">Semaines actives</span>
        </div>
      </div>

      <section className="stats-page__section">
        <h2 className="stats-page__h2">Cartes les plus frequentes</h2>
        <ul className="stats-page__bar-list">
          {stats.topCards.map(([name, count]) => (
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
      </section>

      <section className="stats-page__section">
        <h2 className="stats-page__h2">Repartition par type de tirage</h2>
        <ul className="stats-page__spread-grid">
          {stats.spreads.map(([name, count]) => (
            <li key={name} className="stats-page__spread-item">
              <span className="stats-page__spread-count">{count}</span>
              <span className="stats-page__spread-name">{name}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="cta-nav">
        <Link to="/historique" className="cta-nav__link">&larr; Historique</Link>
      </div>
    </div>
  )
}
