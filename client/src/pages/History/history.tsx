import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { InterpretationText } from '../../components/InterpretationText'
import { useHistory } from '../../context/HistoryContext'
import { useProfile } from '../../context/ProfileContext'
import { requestHistoryInsights } from '../../lib/historyInsightsApi'
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
  const { profile } = useProfile()
  const { draws, clearHistory } = useHistory()
  const [compareA, setCompareA] = useState<string>('')
  const [compareB, setCompareB] = useState<string>('')
  const [historyAiText, setHistoryAiText] = useState<string | null>(null)
  const [historyAiHint, setHistoryAiHint] = useState<string | null>(null)
  const [loadingHistoryAi, setLoadingHistoryAi] = useState(false)

  const insights = useMemo(() => buildHistoryInsights(draws), [draws])

  const drawA = draws.find((d) => d.id === compareA)
  const drawB = draws.find((d) => d.id === compareB)

  async function generateHistoryAiInsights() {
    if (draws.length === 0 || loadingHistoryAi) return
    setLoadingHistoryAi(true)
    setHistoryAiHint(null)
    try {
      const res = await requestHistoryInsights({ profile, draws })
      setHistoryAiText(res.interpretation)
      if (res.source === 'mock') {
        setHistoryAiHint(
          "Mode configuration: l'IA est désactivée côté serveur (`AI_DISABLED`).",
        )
      } else if (res.source === 'cache') {
        setHistoryAiHint("Analyse chargée depuis le cache local (aucun appel IA).")
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : ''
      setHistoryAiText(null)
      setHistoryAiHint(
        msg
          ? `Impossible de générer l'analyse IA: ${msg}.`
          : "Impossible de générer l'analyse IA pour le moment.",
      )
    } finally {
      setLoadingHistoryAi(false)
    }
  }

  return (
    <div className="history-page">
      <header className="history-page__intro">
        <div className="page-heading history-page__heading">
          <img
            src="/img/historique.png"
            alt=""
            className="page-heading__icon"
            width={56}
            height={56}
            decoding="async"
          />
          <h1 className="history-page__title">Historique & évolution</h1>
        </div>
        <p className="history-page__subtitle">
          Timeline de tes tirages, comparaison rapide et aperçu d’analyse (règles
          locales — à remplacer par l’IA sur tes vraies données).
        </p>
      </header>

      <section className="history-page__section" aria-labelledby="insights-h">
        <div className="history-page__insights-head">
          <h2 id="insights-h" className="history-page__h2">
            Analyse (aperçu IA)
          </h2>
          <button
            type="button"
            className="history-page__analyze"
            onClick={generateHistoryAiInsights}
            disabled={draws.length === 0 || loadingHistoryAi}
          >
            {loadingHistoryAi ? 'Analyse en cours...' : 'Analyser mon historique'}
          </button>
        </div>
        <ul className="history-page__insights">
          {insights.map((line, i) => (
            <li key={i}>
              <InterpretationText text={line} />
            </li>
          ))}
        </ul>
        {historyAiHint && <p className="history-page__note">{historyAiHint}</p>}
        {historyAiText && (
          <div className="history-page__ai-result">
            <InterpretationText text={historyAiText} />
          </div>
        )}
      </section>

      <section className="history-page__section" aria-labelledby="compare-h">
        <h2 id="compare-h" className="history-page__h2">
          Comparer deux tirages
        </h2>
        {draws.length < 2 ? (
          <p className="history-page__empty">
            Il faut au moins deux tirages pour activer la comparaison.
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
          <p className="history-page__empty">Aucun tirage enregistré.</p>
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

      <div className="cta-nav">
        <Link to="/" className="cta-nav__link">
          ← Accueil
        </Link>
      </div>
    </div>
  )
}
