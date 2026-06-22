import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MAJOR_ARCANA, MINOR_ARCANA, isMajorArcanum } from '../../data/tarotDeck'
import type { TarotCard } from '../../types/tarot'
import './encyclopedia.css'

type Filter = 'all' | 'major' | 'coupes' | 'batons' | 'epees' | 'deniers'

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Toutes' },
  { id: 'major', label: 'Arcanes majeurs' },
  { id: 'coupes', label: 'Coupes' },
  { id: 'batons', label: 'Bâtons' },
  { id: 'epees', label: 'Épées' },
  { id: 'deniers', label: 'Deniers' },
]

const ALL_CARDS: TarotCard[] = [...MAJOR_ARCANA, ...MINOR_ARCANA]

const MAJOR_MEANINGS: Record<string, { upright: string; reversed: string }> = {
  '0': { upright: 'Nouveau départ, liberté, aventure spontanée.', reversed: 'Imprudence, prise de risque excessive, instabilité.' },
  '1': { upright: 'Potentiel créateur, habileté, initiative.', reversed: 'Manipulation, talents gaspillés, manque de confiance.' },
  '2': { upright: 'Intuition profonde, mystère, patience.', reversed: 'Secrets mal gardés, superficialité, blocage intérieur.' },
  '3': { upright: 'Fertilité, abondance, création.', reversed: 'Dépendance affective, étouffement, blocage créatif.' },
  '4': { upright: 'Stabilité, autorité, structure.', reversed: 'Rigidité, domination, perte de contrôle.' },
  '5': { upright: 'Sagesse, tradition, guidance spirituelle.', reversed: 'Dogmatisme, conformisme excessif, mauvais conseil.' },
  '6': { upright: 'Choix amoureux, harmonie, union.', reversed: 'Hésitation, déséquilibre, conflit intérieur.' },
  '7': { upright: 'Volonté, victoire, détermination.', reversed: 'Manque de direction, échec, agressivité.' },
  '8': { upright: 'Équilibre, vérité, responsabilité.', reversed: 'Injustice, malhonnêteté, partialité.' },
  '9': { upright: 'Introspection, sagesse, solitude féconde.', reversed: 'Isolement, repli sur soi, paranoïa.' },
  '10': { upright: 'Changement de cycle, chance, mouvement.', reversed: 'Malchance, résistance au changement, stagnation.' },
  '11': { upright: 'Courage intérieur, douceur, maîtrise de soi.', reversed: 'Doute de soi, faiblesse, manque de contrôle.' },
  '12': { upright: 'Sacrifice volontaire, lâcher-prise, nouvelle perspective.', reversed: 'Sacrifice inutile, martyre, stagnation.' },
  '13': { upright: 'Transformation, fin de cycle, renouveau.', reversed: 'Résistance au changement, peur, stagnation.' },
  '14': { upright: 'Équilibre, patience, harmonie.', reversed: 'Excès, déséquilibre, impatience.' },
  '15': { upright: 'Attachement, ombre, prise de conscience.', reversed: 'Libération, détachement, guérison.' },
  '16': { upright: 'Bouleversement, révélation, renouveau brutal.', reversed: 'Catastrophe évitée, changement progressif, peur.' },
  '17': { upright: 'Espoir, inspiration, sérénité.', reversed: 'Désespoir, perte de foi, déconnexion.' },
  '18': { upright: 'Émotions profondes, intuition, rêve.', reversed: 'Confusion, illusion, peur de l\'inconnu.' },
  '19': { upright: 'Joie, vitalité, succès.', reversed: 'Tristesse temporaire, ego, excès d\'optimisme.' },
  '20': { upright: 'Réveil, appel intérieur, renaissance.', reversed: 'Refus d\'évoluer, culpabilité, doute.' },
  '21': { upright: 'Accomplissement, intégration, plénitude.', reversed: 'Inachèvement, manque de clôture, blocage final.' },
}

function getMeaning(card: TarotCard): { upright: string; reversed: string } | null {
  if (isMajorArcanum(card)) return MAJOR_MEANINGS[card.id] ?? null
  return null
}

export default function EncyclopediaPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const deepLinkCardId = useMemo(() => {
    const cardId = searchParams.get('carte')
    if (!cardId || !ALL_CARDS.some((card) => card.id === cardId)) return null
    return cardId
  }, [searchParams])

  const activeExpandedId = expandedId ?? deepLinkCardId

  useEffect(() => {
    if (!deepLinkCardId) return
    requestAnimationFrame(() => {
      document
        .getElementById(`encyclopedia-card-${deepLinkCardId}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }, [deepLinkCardId])

  const filtered = useMemo(() => {
    let cards = ALL_CARDS
    const effectiveFilter = deepLinkCardId ? 'all' : filter
    if (effectiveFilter === 'major') cards = MAJOR_ARCANA
    else if (effectiveFilter !== 'all') {
      cards = MINOR_ARCANA.filter((c) => c.id.includes(effectiveFilter))
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      cards = cards.filter(
        (c) =>
          c.nameFr.toLowerCase().includes(q) ||
          c.keywords.some((k) => k.toLowerCase().includes(q)),
      )
    }
    return cards
  }, [filter, search, deepLinkCardId])

  return (
    <div className="encyclopedia">
      <header className="encyclopedia__intro">
        <div className="page-heading encyclopedia__heading">
          <h1 className="encyclopedia__title">Encyclopédie du Tarot</h1>
        </div>
        <p className="encyclopedia__subtitle">
          Explore les 78 cartes du tarot, leurs mots-clés et leurs significations.
        </p>
      </header>

      <input
        className="encyclopedia__search"
        type="search"
        placeholder="Rechercher une carte ou un mot-clé..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="encyclopedia__tabs">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`encyclopedia__tab ${filter === f.id ? 'encyclopedia__tab--on' : ''}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="encyclopedia__empty">Aucune carte trouvée.</p>
      ) : (
        <ul className="encyclopedia__grid">
          {filtered.map((card) => {
            const expanded = activeExpandedId === card.id
            const meaning = getMeaning(card)
            return (
              <li
                key={card.id}
                id={`encyclopedia-card-${card.id}`}
                className={`encyclopedia__card ${expanded ? 'encyclopedia__card--expanded' : ''}`}
                onClick={() => {
                  const nextExpanded = expanded ? null : card.id
                  setExpandedId(nextExpanded)
                  if (deepLinkCardId) setSearchParams({})
                }}
              >
                <div className="encyclopedia__card-header">
                  <span className="encyclopedia__card-name">{card.nameFr}</span>
                  <span className="encyclopedia__card-badge">
                    {isMajorArcanum(card) ? 'Majeur' : 'Mineur'}
                  </span>
                </div>
                <ul className="encyclopedia__card-keywords">
                  {card.keywords.map((kw) => (
                    <li key={kw} className="encyclopedia__card-kw">{kw}</li>
                  ))}
                </ul>
                {expanded && meaning && (
                  <div className="encyclopedia__card-detail">
                    <p className="encyclopedia__card-meaning">
                      <strong>À l'endroit :</strong> {meaning.upright}
                    </p>
                    <p className="encyclopedia__card-meaning">
                      <strong>Renversée :</strong> {meaning.reversed}
                    </p>
                  </div>
                )}
                {expanded && !meaning && (
                  <div className="encyclopedia__card-detail">
                    <p className="encyclopedia__card-meaning">
                      La signification détaillée de cette carte s'interprète
                      selon sa suite et sa valeur dans le contexte du tirage.
                    </p>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
