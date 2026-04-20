import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { InterpretationText } from '../../components/InterpretationText'
import { useHistory } from '../../context/HistoryContext'
import { useProfile } from '../../context/ProfileContext'
import { SPREADS, getSpread } from '../../data/spreads'
import { getCardById, getDeckCards } from '../../data/tarotDeck'
import { requestQuestion } from '../../lib/questionApi'
import type { DrawRecord, PlacedCard, SpreadDefinition, SpreadId } from '../../types/tarot'
import { SpreadSchema, type SlotState } from '../Draw/SpreadSchema'
import './question.css'

function emptySlots(def: SpreadDefinition): Record<string, SlotState> {
  const o: Record<string, SlotState> = {}
  for (const p of def.positions) {
    o[p.key] = { cardId: null, reversed: false }
  }
  return o
}

function slotsToPlaced(
  def: SpreadDefinition,
  slots: Record<string, SlotState>,
): PlacedCard[] | null {
  const out: PlacedCard[] = []
  for (const p of def.positions) {
    const s = slots[p.key]
    if (!s?.cardId) return null
    const card = getCardById(s.cardId)
    if (!card) return null
    out.push({
      positionKey: p.key,
      positionLabel: p.label,
      card,
      reversed: s.reversed,
    })
  }
  return out
}

export default function QuestionPage() {
  const { profile } = useProfile()
  const { addDraw } = useHistory()
  const [question, setQuestion] = useState('')
  const [spreadId, setSpreadId] = useState<SpreadId>('one')
  const [slots, setSlots] = useState<Record<string, SlotState>>(() => {
    const def = getSpread('one')
    return def ? emptySlots(def) : {}
  })
  const [answer, setAnswer] = useState<string | null>(null)
  const [apiHint, setApiHint] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const spread = useMemo(() => getSpread(spreadId), [spreadId])

  const deckCards = useMemo(
    () => getDeckCards(profile.deckPreference),
    [profile.deckPreference],
  )

  useEffect(() => {
    const def = getSpread(spreadId)
    if (def) {
      setSlots(emptySlots(def))
      setAnswer(null)
      setApiHint(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.deckPreference])

  const placedCards = useMemo(() => {
    if (!spread) return null
    return slotsToPlaced(spread, slots)
  }, [spread, slots])

  function setSlot(key: string, next: SlotState) {
    setSlots((prev) => ({ ...prev, [key]: next }))
    setAnswer(null)
    setApiHint(null)
  }

  const canSubmit = question.trim().length > 2 && !!placedCards && !loading

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return

    setLoading(true)
    setAnswer(null)
    setApiHint(null)

    try {
      const res = await requestQuestion({
        question: question.trim(),
        profile,
        spreadLabel: spread!.label,
        cards: placedCards!,
      })
      setAnswer(res.interpretation)

      const record: DrawRecord = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        spreadId,
        spreadLabel: spread!.label,
        tone: 'direct',
        cards: placedCards!,
        interpretation: res.interpretation,
        question: question.trim(),
      }
      addDraw(record)

      if (res.source === 'mock') {
        setApiHint(
          "L'IA est en mode demo, la reponse est un texte d'illustration.",
        )
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : ''
      setAnswer(null)
      setApiHint(
        message
          ? `Impossible d'obtenir une reponse : ${message}.`
          : "Impossible de joindre l'IA pour le moment.",
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="question-page">
      <header className="question-page__intro">
        <div className="page-heading question-page__heading">
          <h1 className="question-page__title">Pose ta question</h1>
        </div>
        <p className="question-page__subtitle">
          Ecris ta question, choisis un tirage et place tes cartes.
          L'IA te repondra en s'appuyant sur ton profil et tes cartes.
        </p>
      </header>

      <form className="question-page__form" onSubmit={handleSubmit}>
        <fieldset className="question-page__field">
          <legend>Ta question</legend>
          <textarea
            className="question-page__textarea"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ex : Comment aborder un changement professionnel en ce moment ?"
            rows={4}
            aria-label="Ta question"
          />
        </fieldset>

        <section className="question-page__panel" aria-labelledby="q-spread-heading">
          <h2 id="q-spread-heading" className="question-page__h2">
            Type de tirage
          </h2>
          <ul className="question-page__spread-list">
            {SPREADS.map((s) => (
              <li key={s.id}>
                <label
                  className={`question-page__spread-option ${spreadId === s.id ? 'question-page__spread-option--on' : ''}`}
                >
                  <input
                    type="radio"
                    name="q-spread"
                    value={s.id}
                    checked={spreadId === s.id}
                    onChange={() => {
                      setSpreadId(s.id)
                      const def = getSpread(s.id)
                      if (def) {
                        setSlots(emptySlots(def))
                        setAnswer(null)
                        setApiHint(null)
                      }
                    }}
                  />
                  <img
                    className="question-page__spread-icon"
                    src={s.icon}
                    alt=""
                    width={30}
                    height={30}
                    decoding="async"
                    aria-hidden
                  />
                  <span className="question-page__spread-text">
                    <span className="question-page__spread-label">{s.label}</span>
                    <span className="question-page__spread-desc">{s.description}</span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </section>

        {spread && (
          <section className="question-page__panel" aria-labelledby="q-schema-heading">
            <h2 id="q-schema-heading" className="question-page__h2">
              Schema du tirage
            </h2>
            <SpreadSchema
              spreadId={spreadId}
              spread={spread}
              deckCards={deckCards}
              slots={slots}
              onSlotChange={setSlot}
            />
          </section>
        )}

        <div className="question-page__actions">
          <button
            type="submit"
            className="question-page__submit"
            disabled={!canSubmit}
          >
            {loading ? 'Reflexion en cours...' : 'Obtenir une reponse'}
          </button>
          {!placedCards && (
            <p className="question-page__meta">
              Place toutes les cartes du tirage pour obtenir ta reponse.
            </p>
          )}
        </div>
      </form>

      {answer && (
        <section className="question-page__result" aria-live="polite">
          <h2 className="question-page__h2">Reponse</h2>
          <div className="question-page__answer">
            <InterpretationText text={answer} />
          </div>
        </section>
      )}

      {apiHint && (
        <p className="question-page__hint">{apiHint}</p>
      )}

      <div className="cta-nav">
        <Link to="/historique" className="cta-nav__link">
          Continuer &rarr;
        </Link>
      </div>
    </div>
  )
}
