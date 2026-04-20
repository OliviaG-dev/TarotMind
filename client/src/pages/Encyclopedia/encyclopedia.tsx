import { useMemo, useState } from 'react'
import { MAJOR_ARCANA, MINOR_ARCANA, isMajorArcanum } from '../../data/tarotDeck'
import type { TarotCard } from '../../types/tarot'
import './encyclopedia.css'

type Filter = 'all' | 'major' | 'coupes' | 'batons' | 'epees' | 'deniers'

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Toutes' },
  { id: 'major', label: 'Arcanes majeurs' },
  { id: 'coupes', label: 'Coupes' },
  { id: 'batons', label: 'Batons' },
  { id: 'epees', label: 'Epees' },
  { id: 'deniers', label: 'Deniers' },
]

const ALL_CARDS: TarotCard[] = [...MAJOR_ARCANA, ...MINOR_ARCANA]

const MAJOR_MEANINGS: Record<string, { upright: string; reversed: string }> = {
  '0': { upright: 'Nouveau depart, liberte, aventure spontanee.', reversed: 'Imprudence, prise de risque excessive, instabilite.' },
  '1': { upright: 'Potentiel createur, habilete, initiative.', reversed: 'Manipulation, talents gaspilles, manque de confiance.' },
  '2': { upright: 'Intuition profonde, mystere, patience.', reversed: 'Secrets mal gardes, superficialite, blocage interieur.' },
  '3': { upright: 'Fertilite, abondance, creation.', reversed: 'Dependance affective, etouffement, blocage creatif.' },
  '4': { upright: 'Stabilite, autorite, structure.', reversed: 'Rigidite, domination, perte de controle.' },
  '5': { upright: 'Sagesse, tradition, guidance spirituelle.', reversed: 'Dogmatisme, conformisme excessif, mauvais conseil.' },
  '6': { upright: 'Choix amoureux, harmonie, union.', reversed: 'Hesitation, desequilibre, conflit interieur.' },
  '7': { upright: 'Volonte, victoire, determination.', reversed: 'Manque de direction, echec, aggressivite.' },
  '8': { upright: 'Equilibre, verite, responsabilite.', reversed: 'Injustice, malhonnetete, partialite.' },
  '9': { upright: 'Introspection, sagesse, solitude feconde.', reversed: 'Isolement, repli sur soi, paranoie.' },
  '10': { upright: 'Changement de cycle, chance, mouvement.', reversed: 'Malchance, resistance au changement, stagnation.' },
  '11': { upright: 'Courage interieur, douceur, maitrise de soi.', reversed: 'Doute de soi, faiblesse, manque de controle.' },
  '12': { upright: 'Sacrifice voluntaire, lacher-prise, nouvelle perspective.', reversed: 'Sacrifice inutile, martyre, stagnation.' },
  '13': { upright: 'Transformation, fin de cycle, renouveau.', reversed: 'Resistance au changement, peur, stagnation.' },
  '14': { upright: 'Equilibre, patience, harmonie.', reversed: 'Exces, desequilibre, impatience.' },
  '15': { upright: 'Attachement, ombre, prise de conscience.', reversed: 'Liberation, detachement, guerison.' },
  '16': { upright: 'Bouleversement, revelation, renouveau brutal.', reversed: 'Catastrophe evitee, changement progressif, peur.' },
  '17': { upright: 'Espoir, inspiration, serenite.', reversed: 'Desespoir, perte de foi, deconnexion.' },
  '18': { upright: 'Emotions profondes, intuition, reve.', reversed: 'Confusion, illusion, peur de l\'inconnu.' },
  '19': { upright: 'Joie, vitalite, succes.', reversed: 'Tristesse temporaire, ego, exces d\'optimisme.' },
  '20': { upright: 'Reveil, appel interieur, renaissance.', reversed: 'Refus d\'evoluer, culpabilite, doute.' },
  '21': { upright: 'Accomplissement, integration, plenitude.', reversed: 'Inachevement, manque de cloture, blocage final.' },
}

function getMeaning(card: TarotCard): { upright: string; reversed: string } | null {
  if (isMajorArcanum(card)) return MAJOR_MEANINGS[card.id] ?? null
  return null
}

export default function EncyclopediaPage() {
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let cards = ALL_CARDS
    if (filter === 'major') cards = MAJOR_ARCANA
    else if (filter !== 'all') cards = MINOR_ARCANA.filter((c) => c.id.includes(filter))

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      cards = cards.filter(
        (c) =>
          c.nameFr.toLowerCase().includes(q) ||
          c.keywords.some((k) => k.toLowerCase().includes(q)),
      )
    }
    return cards
  }, [filter, search])

  return (
    <div className="encyclopedia">
      <header className="encyclopedia__intro">
        <div className="page-heading encyclopedia__heading">
          <h1 className="encyclopedia__title">Encyclopedie du Tarot</h1>
        </div>
        <p className="encyclopedia__subtitle">
          Explore les 78 cartes du tarot, leurs mots-cles et leurs significations.
        </p>
      </header>

      <input
        className="encyclopedia__search"
        type="search"
        placeholder="Rechercher une carte ou un mot-cle..."
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
        <p className="encyclopedia__empty">Aucune carte trouvee.</p>
      ) : (
        <ul className="encyclopedia__grid">
          {filtered.map((card) => {
            const expanded = expandedId === card.id
            const meaning = getMeaning(card)
            return (
              <li
                key={card.id}
                className={`encyclopedia__card ${expanded ? 'encyclopedia__card--expanded' : ''}`}
                onClick={() => setExpandedId(expanded ? null : card.id)}
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
                      <strong>A l'endroit :</strong> {meaning.upright}
                    </p>
                    <p className="encyclopedia__card-meaning">
                      <strong>Renversee :</strong> {meaning.reversed}
                    </p>
                  </div>
                )}
                {expanded && !meaning && (
                  <div className="encyclopedia__card-detail">
                    <p className="encyclopedia__card-meaning">
                      La signification detaillee de cette carte s'interprete
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
