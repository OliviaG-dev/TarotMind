import { getCardById, isMajorArcanum } from '../../data/tarotDeck'
import { SPREAD_LAYOUT } from '../../data/spreadLayouts'
import type { SpreadDefinition, SpreadId, TarotCard } from '../../types/tarot'
import './SpreadSchema.css'

export type SlotState = { cardId: string | null; reversed: boolean }

type Props = {
  spreadId: SpreadId
  spread: SpreadDefinition
  deckCards: TarotCard[]
  slots: Record<string, SlotState>
  onSlotChange: (positionKey: string, next: SlotState) => void
}

function CardOptions({ cards }: { cards: TarotCard[] }) {
  const majors = cards.filter((c) => isMajorArcanum(c))
  const minors = cards.filter((c) => !isMajorArcanum(c))
  const both = majors.length > 0 && minors.length > 0

  if (both) {
    return (
      <>
        <optgroup label="Arcanes majeurs">
          {majors.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nameFr}
            </option>
          ))}
        </optgroup>
        <optgroup label="Arcanes mineurs">
          {minors.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nameFr}
            </option>
          ))}
        </optgroup>
      </>
    )
  }

  return cards.map((c) => (
    <option key={c.id} value={c.id}>
      {c.nameFr}
    </option>
  ))
}

function SchemaSlot({
  positionKey,
  positionLabel,
  deckCards,
  state,
  onChange,
}: {
  positionKey: string
  positionLabel: string
  deckCards: TarotCard[]
  state: SlotState
  onChange: (next: SlotState) => void
}) {
  const card = state.cardId ? getCardById(state.cardId) : undefined

  return (
    <div className="spread-schema__slot">
      <span className="spread-schema__pos">{positionLabel}</span>
      <div
        className={`spread-schema__face ${state.reversed ? 'spread-schema__face--rev' : ''}`}
        aria-hidden
      >
        {card ? (
          <span className="spread-schema__name">{card.nameFr}</span>
        ) : (
          <span className="spread-schema__placeholder">?</span>
        )}
      </div>
      <label className="spread-schema__sr" htmlFor={`card-${positionKey}`}>
        Carte pour {positionLabel}
      </label>
      <select
        id={`card-${positionKey}`}
        className="spread-schema__select"
        value={state.cardId ?? ''}
        onChange={(e) =>
          onChange({
            ...state,
            cardId: e.target.value === '' ? null : e.target.value,
          })
        }
      >
        <option value="">— Choisir la carte —</option>
        <CardOptions cards={deckCards} />
      </select>
      <label className="spread-schema__rev">
        <input
          type="checkbox"
          checked={state.reversed}
          onChange={(e) => onChange({ ...state, reversed: e.target.checked })}
        />
        Renversée
      </label>
    </div>
  )
}

export function SpreadSchema({
  spreadId,
  spread,
  deckCards,
  slots,
  onSlotChange,
}: Props) {
  const kind = SPREAD_LAYOUT[spreadId]
  const positions = spread.positions

  const renderSlot = (key: string, areaClass: string) => {
    const pos = positions.find((p) => p.key === key)
    if (!pos) return null
    const st = slots[key] ?? { cardId: null, reversed: false }
    return (
      <div key={key} className={areaClass}>
        <SchemaSlot
          positionKey={pos.key}
          positionLabel={pos.label}
          deckCards={deckCards}
          state={st}
          onChange={(next) => onSlotChange(pos.key, next)}
        />
      </div>
    )
  }

  if (kind === 'single') {
    const p = positions[0]!
    return (
      <div className="spread-schema spread-schema--single">
        <p className="spread-schema__hint">
          Tire ta carte physiquement, puis indique laquelle tu as obtenue ici.
        </p>
        <div className="spread-schema__single-wrap">
          {renderSlot(p.key, 'spread-schema__cell')}
        </div>
      </div>
    )
  }

  if (kind === 'row3') {
    const [a, b, c] = positions
    return (
      <div className="spread-schema spread-schema--row3">
        <p className="spread-schema__hint">
          Pose les trois cartes de gauche à droite comme sur ton tapis, puis
          renseigne chaque case.
        </p>
        <div className="spread-schema__row3">
          {renderSlot(a!.key, 'spread-schema__cell')}
          {renderSlot(b!.key, 'spread-schema__cell')}
          {renderSlot(c!.key, 'spread-schema__cell')}
        </div>
      </div>
    )
  }

  if (kind === 'triangle3') {
    const [top, left, right] = positions
    return (
      <div className="spread-schema spread-schema--triangle">
        <p className="spread-schema__hint">
          Schéma en triangle : remplis les trois points comme sur ta table.
        </p>
        <div className="spread-schema__triangle">
          <div className="spread-schema__tri-top">
            {renderSlot(top!.key, 'spread-schema__cell')}
          </div>
          <div className="spread-schema__tri-bottom">
            {renderSlot(left!.key, 'spread-schema__cell')}
            {renderSlot(right!.key, 'spread-schema__cell')}
          </div>
        </div>
      </div>
    )
  }

  /* cross5 — ordre des positions dans spreads : center, cross, base, crown, outcome */
  const [center, cross, base, crown, outcome] = positions
  return (
    <div className="spread-schema spread-schema--cross">
      <p className="spread-schema__hint">
        Tirage en croix : reproduis la disposition (centre, obstacle qui croise,
        fondations, sommet, synthèse).
      </p>
      <div className="spread-schema__cross">
        <div className="spread-schema__cross-crown">
          {renderSlot(crown!.key, 'spread-schema__cell')}
        </div>
        <div className="spread-schema__cross-mid">
          {renderSlot(base!.key, 'spread-schema__cell')}
          {renderSlot(center!.key, 'spread-schema__cell spread-schema__cell--center')}
          {renderSlot(cross!.key, 'spread-schema__cell')}
        </div>
        <div className="spread-schema__cross-out">
          {renderSlot(outcome!.key, 'spread-schema__cell')}
        </div>
      </div>
    </div>
  )
}
