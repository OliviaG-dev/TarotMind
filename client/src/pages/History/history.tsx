import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { InterpretationText } from '../../components/InterpretationText'
import { useHistory } from '../../context/HistoryContext'
import { buildHistoryInsights } from '../../lib/historyInsights'
import type { DrawRecord, Tone } from '../../types/tarot'
import './history.css'

function toneLabel(t: Tone) {
  if (t === 'spiritual') return 'spirituel'
  if (t === 'psychological') return 'psychologique'
  return 'direct / conseil'
}

function formatWhen(iso: string) {
  try {
    return new Date(iso).toLocaleString('fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  } catch {
    return iso
  }
}

function cardsSummary(d: DrawRecord) {
  return d.cards.map((c) => c.card.nameFr).join(' · ')
}

export default function HistoryPage() {
  const { draws, clearHistory } = useHistory()
  const [compareA, setCompareA] = useState<string>('')
  const [compareB, setCompareB] = useState<string>('')

  const insights = useMemo(() => buildHistoryInsights(draws), [draws])

  const drawA = draws.find((d) => d.id === compareA)
  const drawB = draws.find((d) => d.id === compareB)

  return (
    <div className="history-page">
      <header className="history-page__intro">
        <h1 className="history-page__title">Historique & évolution</h1>
        <p className="history-page__subtitle">
          Timeline de tes tirages, comparaison rapide et aperçu d’analyse (règles
          locales — à remplacer par l’IA sur tes vraies données).
        </p>
      </header>

      <section className="history-page__section" aria-labelledby="insights-h">
        <h2 id="insights-h" className="history-page__h2">
          Analyse (aperçu IA)
        </h2>
        <ul className="history-page__insights">
          {insights.map((line, i) => (
            <li key={i}>
              <InterpretationText text={line} />
            </li>
          ))}
        </ul>
      </section>

      <section className="history-page__section" aria-labelledby="compare-h">
        <h2 id="compare-h" className="history-page__h2">
          Comparer deux tirages
        </h2>
        {draws.length < 2 ? (
          <p className="history-page__empty">
            Il faut au moins deux tirages.{' '}
            <Link to="/tirage" className="history-page__link">
              Faire un tirage
            </Link>
          </p>
        ) : (
          <>
            <div className="history-page__compare-controls">
              <label className="history-page__select-label">
                Tirage A
                <select
                  value={compareA}
                  onChange={(e) => setCompareA(e.target.value)}
                >
                  <option value="">Choisir…</option>
                  {draws.map((d) => (
                    <option key={d.id} value={d.id}>
                      {formatWhen(d.createdAt)} — {d.spreadLabel}
                    </option>
                  ))}
                </select>
              </label>
              <label className="history-page__select-label">
                Tirage B
                <select
                  value={compareB}
                  onChange={(e) => setCompareB(e.target.value)}
                >
                  <option value="">Choisir…</option>
                  {draws.map((d) => (
                    <option key={`b-${d.id}`} value={d.id}>
                      {formatWhen(d.createdAt)} — {d.spreadLabel}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {drawA && drawB && drawA.id !== drawB.id && (
              <div className="history-page__compare-grid">
                <div className="history-page__compare-col">
                  <h3 className="history-page__h3">A</h3>
                  <p className="history-page__compare-meta">
                    {formatWhen(drawA.createdAt)} · {drawA.spreadLabel}
                  </p>
                  <ul className="history-page__compare-cards">
                    {drawA.cards.map((c) => (
                      <li key={c.positionKey}>
                        <span className="history-page__pos">{c.positionLabel}</span>
                        <span className="history-page__name">
                          {c.card.nameFr}
                          {c.reversed ? ' ↺' : ''}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="history-page__compare-col">
                  <h3 className="history-page__h3">B</h3>
                  <p className="history-page__compare-meta">
                    {formatWhen(drawB.createdAt)} · {drawB.spreadLabel}
                  </p>
                  <ul className="history-page__compare-cards">
                    {drawB.cards.map((c) => (
                      <li key={c.positionKey}>
                        <span className="history-page__pos">{c.positionLabel}</span>
                        <span className="history-page__name">
                          {c.card.nameFr}
                          {c.reversed ? ' ↺' : ''}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {drawA && drawB && drawA.id === drawB.id && (
              <p className="history-page__note">Choisis deux tirages différents.</p>
            )}
          </>
        )}
      </section>

      <section className="history-page__section" aria-labelledby="timeline-h">
        <div className="history-page__timeline-head">
          <h2 id="timeline-h" className="history-page__h2">
            Timeline
          </h2>
          {draws.length > 0 && (
            <button
              type="button"
              className="history-page__clear"
              onClick={() => {
                if (
                  window.confirm(
                    'Effacer tout l’historique sur cet appareil ?',
                  )
                ) {
                  clearHistory()
                  setCompareA('')
                  setCompareB('')
                }
              }}
            >
              Tout effacer
            </button>
          )}
        </div>
        {draws.length === 0 ? (
          <p className="history-page__empty">
            Aucun tirage enregistré.{' '}
            <Link to="/tirage" className="history-page__link">
              Commencer
            </Link>
          </p>
        ) : (
          <ol className="history-page__timeline">
            {draws.map((d) => (
              <li key={d.id} className="history-page__event">
                <time dateTime={d.createdAt}>{formatWhen(d.createdAt)}</time>
                <span className="history-page__event-spread">{d.spreadLabel}</span>
                <span className="history-page__event-cards">{cardsSummary(d)}</span>
                <span className="history-page__event-tone">
                  Ton : {toneLabel(d.tone)}
                </span>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  )
}
