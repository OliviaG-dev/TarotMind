import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { InterpretationText } from '../../components/InterpretationText'
import { useHistory } from '../../context/HistoryContext'
import { useProfile } from '../../context/ProfileContext'
import { SPREADS, getSpread } from '../../data/spreads'
import { drawCards, placeCards } from '../../data/tarotDeck'
import { buildMockInterpretation } from '../../lib/mockInterpretation'
import type { DrawRecord, SpreadId, Tone } from '../../types/tarot'
import './draw.css'

const TONES: { id: Tone; label: string; hint: string }[] = [
  { id: 'spiritual', label: 'Spirituel', hint: 'Symboles, sens, guidance douce' },
  { id: 'psychological', label: 'Psychologique', hint: 'Émotions, dynamiques' },
  { id: 'direct', label: 'Direct / conseil', hint: 'Clair, actionnable' },
]

export default function DrawPage() {
  const { profile } = useProfile()
  const { addDraw } = useHistory()
  const [spreadId, setSpreadId] = useState<SpreadId>('one')
  const [tone, setTone] = useState<Tone>('psychological')
  const [result, setResult] = useState<DrawRecord | null>(null)

  const spread = useMemo(() => getSpread(spreadId), [spreadId])

  function runDraw() {
    const def = getSpread(spreadId)
    if (!def) return
    const n = def.positions.length
    const drawn = drawCards(n)
    const placed = placeCards(def.positions, drawn)
    const interpretation = buildMockInterpretation({
      profile,
      spreadId,
      spreadLabel: def.label,
      tone,
      cards: placed,
    })
    const record: DrawRecord = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      spreadId,
      spreadLabel: def.label,
      tone,
      cards: placed,
      interpretation,
    }
    setResult(record)
    addDraw(record)
  }

  return (
    <div className="draw">
      <header className="draw__intro">
        <h1 className="draw__title">Tirage intelligent</h1>
        <p className="draw__subtitle">
          Choisis un type de tirage et un ton d’interprétation. Le texte s’adapte
          à ton{' '}
          <Link to="/profil" className="draw__inline-link">
            profil
          </Link>{' '}
          (prototype local, sans appel serveur).
        </p>
      </header>

      <section className="draw__panel" aria-labelledby="spreads-heading">
        <h2 id="spreads-heading" className="draw__h2">
          Types de tirages
        </h2>
        <ul className="draw__spread-list">
          {SPREADS.map((s) => (
            <li key={s.id}>
              <label
                className={`draw__spread-option ${spreadId === s.id ? 'draw__spread-option--on' : ''}`}
              >
                <input
                  type="radio"
                  name="spread"
                  value={s.id}
                  checked={spreadId === s.id}
                  onChange={() => {
                    setSpreadId(s.id)
                    setResult(null)
                  }}
                />
                <span className="draw__spread-emoji" aria-hidden>
                  {s.emoji}
                </span>
                <span className="draw__spread-text">
                  <span className="draw__spread-label">{s.label}</span>
                  <span className="draw__spread-desc">{s.description}</span>
                </span>
              </label>
            </li>
          ))}
        </ul>
      </section>

      <section className="draw__panel" aria-labelledby="tone-heading">
        <h2 id="tone-heading" className="draw__h2">
          Ton d’interprétation (IA)
        </h2>
        <div className="draw__tones">
          {TONES.map((t) => (
            <label
              key={t.id}
              className={`draw__tone ${tone === t.id ? 'draw__tone--on' : ''}`}
            >
              <input
                type="radio"
                name="tone"
                value={t.id}
                checked={tone === t.id}
                onChange={() => {
                  setTone(t.id)
                  setResult(null)
                }}
              />
              <span className="draw__tone-label">{t.label}</span>
              <span className="draw__tone-hint">{t.hint}</span>
            </label>
          ))}
        </div>
      </section>

      <div className="draw__actions">
        <button type="button" className="draw__primary" onClick={runDraw}>
          Tirer les cartes
        </button>
        {spread && (
          <p className="draw__meta">
            {spread.positions.length} carte{spread.positions.length > 1 ? 's' : ''}{' '}
            · positions : {spread.positions.map((p) => p.label).join(' → ')}
          </p>
        )}
      </div>

      {result && (
        <section className="draw__result" aria-live="polite">
          <h2 className="draw__h2">Cartes</h2>
          <ul className="draw__cards">
            {result.cards.map((c) => (
              <li key={c.positionKey} className="draw__card">
                <span className="draw__card-pos">{c.positionLabel}</span>
                <span className="draw__card-name">
                  {c.card.nameFr}
                  {c.reversed ? ' · renversée' : ''}
                </span>
              </li>
            ))}
          </ul>
          <h2 className="draw__h2 draw__h2--gap">Interprétation</h2>
          <div className="draw__interpretation">
            <InterpretationText text={result.interpretation} />
          </div>
          <p className="draw__footnote">
            En production, ce texte serait produit par l’IA à partir du tirage,
            du profil et de l’historique.
          </p>
        </section>
      )}
    </div>
  )
}
