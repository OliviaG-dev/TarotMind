import { useEffect, useMemo, useState } from 'react'
import { InterpretationText } from '../../components/InterpretationText'
import {
  DecoSoftCloud,
  DecoSoftCrescentMoon,
  DecoSoftSparkle,
} from '../../components/Nav/NavIcons'
import { PageIntro } from '../../components/PageIntro/PageIntro'
import { useHistory } from '../../context/HistoryContext'
import { useProfile } from '../../context/ProfileContext'
import { SPREADS, getSpread } from '../../data/spreads'
import { getCardById, getDeckCards } from '../../data/tarotDeck'
import { requestQuestion } from '../../lib/questionApi'
import type { DrawRecord, PlacedCard, SpreadDefinition, SpreadId } from '../../types/tarot'
import { SpreadSchema, type SlotState } from '../Draw/SpreadSchema'
import '../Home/home.css'
import './question.css'

const QUESTION_SPREADS = SPREADS.filter(
  (spread) =>
    spread.id !== 'love' &&
    spread.id !== 'career' &&
    spread.id !== 'decision' &&
    spread.id !== 'compatibility',
)

const PRESET_QUESTIONS = [
  'Quel message veux-tu me transmettre aujourd\'hui ?',
  'Quel message veux-tu me transmettre cette semaine ?',
  'Quel message veux-tu me transmettre ce mois-ci ?',
  'Que dois-je savoir sur ma situation actuelle ?',
  'Comment avancer dans ma vie amoureuse en ce moment ?',
  'Quelle direction prendre dans ma carrière professionnelle ?',
  'Comment retrouver plus de sérénité et d\'équilibre ?',
  'Quel est le principal obstacle que je dois dépasser ?',
  'Dois-je saisir cette opportunité qui se présente à moi ?',
  'Comment améliorer ma relation avec moi-même ?',
] as const

type PanelTheme = 'purple' | 'pink' | 'green'

function QuestionPanelDeco({
  theme,
  variant = 'default',
}: {
  theme: PanelTheme
  variant?: 'default' | 'question' | 'spreads' | 'schema'
}) {
  return (
    <span className="home__feature-deco question-page__deco" aria-hidden="true">
      {(theme === 'purple' || theme === 'green') &&
        variant !== 'schema' &&
        variant !== 'question' && (
          <DecoSoftCloud className="home__feature-deco-soft-cloud" />
        )}
      {theme === 'green' && variant === 'question' && (
        <>
          <DecoSoftCloud className="home__feature-deco-soft-cloud" />
          <DecoSoftCloud className="home__feature-deco-soft-cloud home__feature-deco-soft-cloud--right" />
          <DecoSoftSparkle className="home__feature-deco-spark home__feature-deco-spark--green-left-cloud" />
          <DecoSoftSparkle className="home__feature-deco-spark home__feature-deco-spark--green-left-cloud-sm" />
          <DecoSoftSparkle className="home__feature-deco-spark home__feature-deco-spark--green-cloud" />
          <DecoSoftSparkle className="question-page__green-spark question-page__green-spark--a" />
          <DecoSoftSparkle className="question-page__green-spark question-page__green-spark--b" />
        </>
      )}
      {theme === 'purple' && variant === 'default' && (
        <>
          <DecoSoftSparkle className="home__feature-deco-soft-spark home__feature-deco-soft-spark--a" />
          <DecoSoftSparkle className="home__feature-deco-soft-spark home__feature-deco-soft-spark--b" />
          <DecoSoftSparkle className="home__feature-deco-soft-spark home__feature-deco-soft-spark--c" />
        </>
      )}
      {theme === 'purple' && variant === 'schema' && (
        <>
          <DecoSoftSparkle className="question-page__purple-spark question-page__purple-spark--a" />
          <DecoSoftSparkle className="question-page__purple-spark question-page__purple-spark--b" />
          <DecoSoftSparkle className="question-page__purple-spark question-page__purple-spark--c" />
          <DecoSoftSparkle className="question-page__purple-spark question-page__purple-spark--d" />
          <DecoSoftSparkle className="question-page__purple-spark question-page__purple-spark--e" />
        </>
      )}
      {theme === 'pink' && variant === 'spreads' && (
        <>
          <DecoSoftCrescentMoon className="question-page__pink-moon" />
          <DecoSoftSparkle className="question-page__pink-spark question-page__pink-spark--a" />
          <DecoSoftSparkle className="question-page__pink-spark question-page__pink-spark--b" />
          <DecoSoftSparkle className="question-page__pink-spark question-page__pink-spark--c" />
          <DecoSoftSparkle className="question-page__pink-spark question-page__pink-spark--d" />
        </>
      )}
    </span>
  )
}

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
  const [showPresets, setShowPresets] = useState(false)

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

  function selectPreset(text: string) {
    setQuestion(text)
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
          "L'IA est en mode démo, la réponse est un texte d'illustration.",
        )
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : ''
      setAnswer(null)
      setApiHint(
        message
          ? `Impossible d'obtenir une réponse : ${message}.`
          : "Impossible de joindre l'IA pour le moment.",
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="question-page">
      <PageIntro title="Pose ta question">
          <p>
            Écris ta question, choisis un tirage et place tes cartes. L&apos;IA te
            répondra en s&apos;appuyant sur ton profil et tes cartes.
          </p>
        </PageIntro>

      <form className="question-page__form" onSubmit={handleSubmit}>
        <section
          className="question-page__panel home__feature-card home__feature-card--green"
          aria-labelledby="q-question-heading"
        >
          <QuestionPanelDeco theme="green" variant="question" />
          <h2 id="q-question-heading" className="question-page__h2">
            Ta question
          </h2>
          <textarea
            className="question-page__textarea"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ex : Comment aborder un changement professionnel en ce moment ?"
            rows={4}
            aria-label="Ta question"
          />
          <div className="question-page__presets">
            <div className="question-page__presets-head">
              <p className="question-page__presets-label">Questions fréquentes</p>
              <button
                type="button"
                className="question-page__presets-toggle"
                aria-expanded={showPresets}
                aria-controls="question-presets-list"
                onClick={() => setShowPresets((visible) => !visible)}
              >
                {showPresets ? 'Masquer' : 'Afficher'}
              </button>
            </div>
            {showPresets && (
              <ul
                id="question-presets-list"
                className="question-page__presets-list"
              >
                {PRESET_QUESTIONS.map((preset) => (
                  <li key={preset}>
                    <button
                      type="button"
                      className={`question-page__preset${question === preset ? ' question-page__preset--on' : ''}`}
                      onClick={() => selectPreset(preset)}
                    >
                      {preset}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section
          className="question-page__panel home__feature-card home__feature-card--pink"
          aria-labelledby="q-spread-heading"
        >
          <QuestionPanelDeco theme="pink" variant="spreads" />
          <h2 id="q-spread-heading" className="question-page__h2">
            Type de tirage
          </h2>
          <p className="question-page__spread-hint">
            Choisis un seul type de tirage pour ta question.
          </p>
          <ul className="question-page__spread-list">
            {QUESTION_SPREADS.map((s) => (
              <li key={s.id}>
                <label
                  className={`question-page__spread-option${spreadId === s.id ? ' question-page__spread-option--on' : ''}`}
                >
                  <input
                    type="radio"
                    className="question-page__spread-input"
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
                  <span className="question-page__spread-radio" aria-hidden="true" />
                  <span className="question-page__spread-icon-wrap">
                    <img
                      className="question-page__spread-icon"
                      src={s.icon}
                      alt=""
                      width={28}
                      height={28}
                      decoding="async"
                      aria-hidden
                    />
                  </span>
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
          <section
            className="question-page__panel home__feature-card home__feature-card--purple"
            aria-labelledby="q-schema-heading"
          >
            <QuestionPanelDeco theme="purple" variant="schema" />
            <h2 id="q-schema-heading" className="question-page__h2">
              Schéma du tirage
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
            {loading ? 'Réflexion en cours...' : 'Obtenir une réponse'}
          </button>
          {!placedCards && (
            <p className="question-page__meta">
              Place toutes les cartes du tirage pour obtenir ta réponse.
            </p>
          )}
        </div>
      </form>

      {answer && (
        <section
          className="question-page__result home__feature-card home__feature-card--purple"
          aria-live="polite"
        >
          <QuestionPanelDeco theme="purple" variant="default" />
          <h2 className="question-page__h2">Réponse</h2>
          <div className="question-page__answer">
            <InterpretationText text={answer} />
          </div>
        </section>
      )}

      {apiHint && <p className="question-page__hint">{apiHint}</p>}
    </div>
  )
}
