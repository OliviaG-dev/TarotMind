import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { InterpretationText } from '../../components/InterpretationText'
import { useHistory } from '../../context/HistoryContext'
import { useProfile } from '../../context/ProfileContext'
import { SPREADS, getSpread } from '../../data/spreads'
import { getCardById, getDeckCards } from '../../data/tarotDeck'
import { requestInterpretation } from '../../lib/interpretApi'
import { buildMockInterpretation } from '../../lib/mockInterpretation'
import type { DrawRecord, PlacedCard, SpreadDefinition, SpreadId, Tone } from '../../types/tarot'
import { SpreadSchema, type SlotState } from './SpreadSchema'
import './draw.css'

const TONES: { id: Tone; label: string; hint: string }[] = [
  { id: 'spiritual', label: 'Spirituel', hint: 'Symboles, sens, guidance douce' },
  { id: 'psychological', label: 'Psychologique', hint: 'Émotions, dynamiques' },
  { id: 'direct', label: 'Direct / conseil', hint: 'Clair, actionnable' },
]

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

export default function DrawPage() {
  const { profile } = useProfile()
  const { addDraw } = useHistory()
  const [spreadId, setSpreadId] = useState<SpreadId>('one')
  const [tone, setTone] = useState<Tone>('psychological')
  const [slots, setSlots] = useState<Record<string, SlotState>>(() => {
    const def = getSpread('one')
    return def ? emptySlots(def) : {}
  })
  const [result, setResult] = useState<DrawRecord | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [apiHint, setApiHint] = useState<string | null>(null)

  const spread = useMemo(() => getSpread(spreadId), [spreadId])

  const deckCards = useMemo(
    () => getDeckCards(profile.deckPreference),
    [profile.deckPreference],
  )

  useEffect(() => {
    const def = getSpread(spreadId)
    if (def) {
      setSlots(emptySlots(def))
      setResult(null)
      setApiHint(null)
    }
    // Seulement quand le type de jeu change : évite de doubler le reset au changement de spread (géré par les radios).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.deckPreference])

  const placedPreview = useMemo(() => {
    if (!spread) return null
    return slotsToPlaced(spread, slots)
  }, [spread, slots])

  function setSlot(key: string, next: SlotState) {
    setSlots((prev) => ({ ...prev, [key]: next }))
    setResult(null)
    setApiHint(null)
  }

  async function generateInterpretation() {
    if (!spread || !placedPreview) return
    setIsGenerating(true)
    setApiHint(null)
    let interpretation = ''
    try {
      const res = await requestInterpretation({
        tone,
        spreadLabel: spread.label,
        profile,
        cards: placedPreview,
      })
      interpretation = res.interpretation
      if (res.source === 'mock') {
        setApiHint(
          'Serveur en mode configuration (`AI_DISABLED`) : aucune requête OpenAI, texte stub.',
        )
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : ''
      interpretation = buildMockInterpretation({
        profile,
        spreadId,
        spreadLabel: spread.label,
        tone,
        cards: placedPreview,
      })
      setApiHint(
        message
          ? `Mode demo: ${message}. Texte local affiche.`
          : "Mode demo: impossible de joindre l'API IA, texte local affiche.",
      )
    } finally {
      setIsGenerating(false)
    }

    const record: DrawRecord = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      spreadId,
      spreadLabel: spread.label,
      tone,
      cards: placedPreview,
      interpretation,
    }
    setResult(record)
    addDraw(record)
  }

  return (
    <div className="draw">
      <header className="draw__intro">
        <div className="page-heading draw__heading">
          <img
            src="/img/tirage.png"
            alt=""
            className="page-heading__icon"
            width={56}
            height={56}
            decoding="async"
          />
          <h1 className="draw__title">Tirage</h1>
        </div>
        <p className="draw__subtitle">
          Fais ton tirage <strong>avec ton jeu physique</strong> (ou comme tu en as
          l’habitude). TarotMind affiche le <strong>schéma du tirage</strong> : tu
          indiques toi-même chaque arcane tiré. L’
          <strong>IA</strong> (ici un texte de démo) ne tire pas les cartes — elle sert
          uniquement à <strong>interpréter</strong> la combinaison, selon ton{' '}
          <Link to="/profil" className="draw__inline-link">
            profil
          </Link>{' '}
          et le ton choisi.
        </p>
      </header>

      <section className="draw__panel" aria-labelledby="spreads-heading">
        <h2 id="spreads-heading" className="draw__h2">
          Type de tirage
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
                    const def = getSpread(s.id)
                    if (def) {
                      setSlots(emptySlots(def))
                      setResult(null)
                      setApiHint(null)
                    }
                  }}
                />
                <img
                  className="draw__spread-icon"
                  src={s.icon}
                  alt=""
                  width={30}
                  height={30}
                  decoding="async"
                  aria-hidden
                />
                <span className="draw__spread-text">
                  <span className="draw__spread-label">{s.label}</span>
                  <span className="draw__spread-desc">{s.description}</span>
                </span>
              </label>
            </li>
          ))}
        </ul>
      </section>

      {spread && (
        <section className="draw__panel" aria-labelledby="schema-heading">
          <h2 id="schema-heading" className="draw__h2">
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
                  setApiHint(null)
                }}
              />
              <span className="draw__tone-label">{t.label}</span>
              <span className="draw__tone-hint">{t.hint}</span>
            </label>
          ))}
        </div>
      </section>

      <div className="draw__actions">
        <button
          type="button"
          className="draw__primary"
          disabled={!placedPreview || isGenerating}
          onClick={generateInterpretation}
        >
          {isGenerating ? 'Generation en cours...' : 'Generer l’interpretation'}
        </button>
        {spread && (
          <p className="draw__meta">
            {spread.positions.length} position
            {spread.positions.length > 1 ? 's' : ''} — remplis chaque arcane pour
            activer le bouton.
          </p>
        )}
      </div>

      {result && (
        <section className="draw__result" aria-live="polite">
          <h2 className="draw__h2">Récapitulatif</h2>
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
            {apiHint ??
              'Texte genere par l’IA serveur a partir des cartes saisies et du profil.'}
          </p>
        </section>
      )}

      <div className="cta-nav">
        <Link to="/historique" className="cta-nav__link">
          Continuer →
        </Link>
      </div>
    </div>
  )
}
