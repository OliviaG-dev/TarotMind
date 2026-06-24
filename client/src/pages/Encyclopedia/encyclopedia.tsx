import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ArrowRightIcon,
  DecoSoftCloud,
  DecoSoftSparkle,
  NavIconBook,
} from "../../components/Nav/NavIcons";
import {
  MAJOR_ARCANA,
  MINOR_ARCANA,
  isMajorArcanum,
} from "../../data/tarotDeck";
import type { TarotCard } from "../../types/tarot";
import { cardMatchesEncyclopediaSearch } from "../../utils/encyclopediaSearch";
import "../Home/home.css";
import "./encyclopedia.css";

type Filter = "all" | "major" | "coupes" | "batons" | "epees" | "deniers";
type PanelTheme = "purple" | "pink" | "green" | "gold" | "gray";

type CardMeta = {
  theme: PanelTheme;
  category: string;
  emblem: string;
};

type DisplaySection = {
  id: string;
  title: string;
  theme: PanelTheme;
  cards: TarotCard[];
};

const FILTERS: { id: Filter; label: string; theme: PanelTheme }[] = [
  { id: "all", label: "Toutes", theme: "purple" },
  { id: "major", label: "Arcanes majeurs", theme: "purple" },
  { id: "coupes", label: "Coupes", theme: "pink" },
  { id: "batons", label: "Bâtons", theme: "green" },
  { id: "epees", label: "Épées", theme: "gray" },
  { id: "deniers", label: "Deniers", theme: "gold" },
];

const SUIT_SECTIONS: { id: Filter; title: string; theme: PanelTheme }[] = [
  { id: "coupes", title: "Coupes", theme: "pink" },
  { id: "batons", title: "Bâtons", theme: "green" },
  { id: "epees", title: "Épées", theme: "gray" },
  { id: "deniers", title: "Deniers", theme: "gold" },
];

const ALL_CARDS: TarotCard[] = [...MAJOR_ARCANA, ...MINOR_ARCANA];

const MAJOR_MEANINGS: Record<string, { upright: string; reversed: string }> = {
  "0": {
    upright: "Nouveau départ, liberté, aventure spontanée.",
    reversed: "Imprudence, prise de risque excessive, instabilité.",
  },
  "1": {
    upright: "Potentiel créateur, habileté, initiative.",
    reversed: "Manipulation, talents gaspillés, manque de confiance.",
  },
  "2": {
    upright: "Intuition profonde, mystère, patience.",
    reversed: "Secrets mal gardés, superficialité, blocage intérieur.",
  },
  "3": {
    upright: "Fertilité, abondance, création.",
    reversed: "Dépendance affective, étouffement, blocage créatif.",
  },
  "4": {
    upright: "Stabilité, autorité, structure.",
    reversed: "Rigidité, domination, perte de contrôle.",
  },
  "5": {
    upright: "Sagesse, tradition, guidance spirituelle.",
    reversed: "Dogmatisme, conformisme excessif, mauvais conseil.",
  },
  "6": {
    upright: "Choix amoureux, harmonie, union.",
    reversed: "Hésitation, déséquilibre, conflit intérieur.",
  },
  "7": {
    upright: "Volonté, victoire, détermination.",
    reversed: "Manque de direction, échec, agressivité.",
  },
  "8": {
    upright: "Équilibre, vérité, responsabilité.",
    reversed: "Injustice, malhonnêteté, partialité.",
  },
  "9": {
    upright: "Introspection, sagesse, solitude féconde.",
    reversed: "Isolement, repli sur soi, paranoïa.",
  },
  "10": {
    upright: "Changement de cycle, chance, mouvement.",
    reversed: "Malchance, résistance au changement, stagnation.",
  },
  "11": {
    upright: "Courage intérieur, douceur, maîtrise de soi.",
    reversed: "Doute de soi, faiblesse, manque de contrôle.",
  },
  "12": {
    upright: "Sacrifice volontaire, lâcher-prise, nouvelle perspective.",
    reversed: "Sacrifice inutile, martyre, stagnation.",
  },
  "13": {
    upright: "Transformation, fin de cycle, renouveau.",
    reversed: "Résistance au changement, peur, stagnation.",
  },
  "14": {
    upright: "Équilibre, patience, harmonie.",
    reversed: "Excès, déséquilibre, impatience.",
  },
  "15": {
    upright: "Attachement, ombre, prise de conscience.",
    reversed: "Libération, détachement, guérison.",
  },
  "16": {
    upright: "Bouleversement, révélation, renouveau brutal.",
    reversed: "Catastrophe évitée, changement progressif, peur.",
  },
  "17": {
    upright: "Espoir, inspiration, sérénité.",
    reversed: "Désespoir, perte de foi, déconnexion.",
  },
  "18": {
    upright: "Émotions profondes, intuition, rêve.",
    reversed: "Confusion, illusion, peur de l'inconnu.",
  },
  "19": {
    upright: "Joie, vitalité, succès.",
    reversed: "Tristesse temporaire, ego, excès d'optimisme.",
  },
  "20": {
    upright: "Réveil, appel intérieur, renaissance.",
    reversed: "Refus d'évoluer, culpabilité, doute.",
  },
  "21": {
    upright: "Accomplissement, intégration, plénitude.",
    reversed: "Inachèvement, manque de clôture, blocage final.",
  },
};

function getMeaning(
  card: TarotCard,
): { upright: string; reversed: string } | null {
  if (isMajorArcanum(card)) return MAJOR_MEANINGS[card.id] ?? null;
  return null;
}

function getCardMeta(card: TarotCard): CardMeta {
  if (isMajorArcanum(card)) {
    return {
      theme: "purple",
      category: "Arcane majeur",
      emblem: card.id,
    };
  }

  const suit = SUIT_SECTIONS.find((entry) => card.id.includes(entry.id));
  const rank = card.nameFr.split(" de ")[0] ?? card.nameFr;
  const emblem =
    rank.length <= 4
      ? rank
      : rank === "Valet"
        ? "V"
        : rank === "Cavalier"
          ? "Cv"
          : rank === "Dame"
            ? "D"
            : rank === "Roi"
              ? "R"
              : rank.slice(0, 3);

  return {
    theme: suit?.theme ?? "green",
    category: suit?.title ?? "Arcane mineur",
    emblem,
  };
}

function getDisplaySections(
  cards: TarotCard[],
  filter: Filter,
  search: string,
): DisplaySection[] {
  const trimmedSearch = search.trim();

  if (trimmedSearch || filter !== "all") {
    const filterMeta = FILTERS.find((entry) => entry.id === filter);
    return [
      {
        id: filter,
        title: trimmedSearch
          ? `Résultats pour « ${trimmedSearch} »`
          : (filterMeta?.label ?? "Cartes"),
        theme: filterMeta?.theme ?? "purple",
        cards,
      },
    ];
  }

  return [
    {
      id: "major",
      title: "Arcanes majeurs",
      theme: "purple",
      cards: cards.filter(isMajorArcanum),
    },
    ...SUIT_SECTIONS.map((suit) => ({
      id: suit.id,
      title: suit.title,
      theme: suit.theme,
      cards: cards.filter((card) => card.id.includes(suit.id)),
    })).filter((section) => section.cards.length > 0),
  ];
}

function EncyclopediaToolbarDeco() {
  return (
    <span
      className="home__feature-deco encyclopedia-page__deco"
      aria-hidden="true"
    >
      <DecoSoftCloud className="home__feature-deco-soft-cloud" />
      <DecoSoftSparkle className="home__feature-deco-soft-spark home__feature-deco-soft-spark--a" />
      <DecoSoftSparkle className="home__feature-deco-soft-spark home__feature-deco-soft-spark--b" />
      <DecoSoftSparkle className="home__feature-deco-soft-spark home__feature-deco-soft-spark--c" />
      <DecoSoftSparkle className="encyclopedia-page__toolbar-spark encyclopedia-page__toolbar-spark--a" />
      <DecoSoftSparkle className="encyclopedia-page__toolbar-spark encyclopedia-page__toolbar-spark--b" />
    </span>
  );
}

function EncyclopediaCard({
  card,
  expanded,
  onToggle,
}: {
  card: TarotCard;
  expanded: boolean;
  onToggle: () => void;
}) {
  const isMajor = isMajorArcanum(card);
  const meaning = getMeaning(card);
  const meta = getCardMeta(card);
  const theme = meta.theme;

  const cardClassName = `encyclopedia-page__card home__feature-card home__feature-card--${theme}${isMajor && expanded ? " encyclopedia-page__card--expanded" : ""}${!isMajor ? " encyclopedia-page__card--static" : ""}`;

  const cardBody = (
    <>
      <span
        className={`encyclopedia-page__card-category encyclopedia-page__card-category--${theme}`}
      >
        {meta.category}
      </span>

      <div className="encyclopedia-page__card-head">
        <div className="encyclopedia-page__card-top">
          <span
            className={`encyclopedia-page__card-emblem encyclopedia-page__card-emblem--${theme}`}
            aria-hidden="true"
          >
            <span className="encyclopedia-page__card-emblem-text">
              {meta.emblem}
            </span>
          </span>

          <div className="encyclopedia-page__card-heading">
            <span className="encyclopedia-page__card-name">{card.nameFr}</span>
          </div>

          {isMajor && (
            <span
              className={`encyclopedia-page__card-chevron encyclopedia-page__card-chevron--${theme}`}
              aria-hidden="true"
            >
              <ArrowRightIcon />
            </span>
          )}
        </div>
      </div>

      <div
        className={`encyclopedia-page__card-keywords-wrap encyclopedia-page__card-keywords-wrap--${theme}`}
      >
        <span className="encyclopedia-page__card-keywords-label">
          Mots-clés
        </span>
        <ul className="encyclopedia-page__card-keywords">
          {card.keywords.map((kw, index) => (
            <li
              key={kw}
              className={`encyclopedia-page__card-kw encyclopedia-page__card-kw--${theme}${isMajor && !expanded && index >= 3 ? " encyclopedia-page__card-kw--clip" : ""}`}
            >
              <span className="encyclopedia-page__card-kw-text">{kw}</span>
            </li>
          ))}
          {isMajor && !expanded && card.keywords.length > 3 && (
            <li
              className={`encyclopedia-page__card-kw encyclopedia-page__card-kw--more encyclopedia-page__card-kw--${theme}`}
            >
              <span className="encyclopedia-page__card-kw-text">
                +{card.keywords.length - 3}
              </span>
            </li>
          )}
        </ul>
      </div>

      {isMajor && (
        <p
          className={`encyclopedia-page__card-hint${expanded ? " encyclopedia-page__card-hint--hidden" : ""}`}
        >
          Appuyer pour les significations
        </p>
      )}

      {isMajor && expanded && meaning && (
        <div className="encyclopedia-page__card-detail">
          <div
            className={`encyclopedia-page__meaning-block encyclopedia-page__meaning-block--${theme} encyclopedia-page__meaning-block--upright`}
          >
            <span className="encyclopedia-page__meaning-label">
              À l&apos;endroit
            </span>
            <p className="encyclopedia-page__meaning-text">{meaning.upright}</p>
          </div>
          <div
            className={`encyclopedia-page__meaning-block encyclopedia-page__meaning-block--${theme} encyclopedia-page__meaning-block--reversed`}
          >
            <span className="encyclopedia-page__meaning-label encyclopedia-page__meaning-label--reversed">
              Renversée
            </span>
            <p className="encyclopedia-page__meaning-text">
              {meaning.reversed}
            </p>
          </div>
        </div>
      )}
    </>
  );

  return (
    <li
      id={`encyclopedia-card-${card.id}`}
      className="encyclopedia-page__grid-item"
    >
      {isMajor ? (
        <button
          type="button"
          className={cardClassName}
          aria-expanded={expanded}
          onClick={onToggle}
        >
          {cardBody}
        </button>
      ) : (
        <div className={cardClassName}>{cardBody}</div>
      )}
    </li>
  );
}

export default function EncyclopediaPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const deepLinkCardId = useMemo(() => {
    const cardId = searchParams.get("carte");
    if (!cardId || !ALL_CARDS.some((card) => card.id === cardId)) return null;
    return cardId;
  }, [searchParams]);

  const activeExpandedId = expandedId ?? deepLinkCardId;

  useEffect(() => {
    if (!deepLinkCardId) return;
    requestAnimationFrame(() => {
      document
        .getElementById(`encyclopedia-card-${deepLinkCardId}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }, [deepLinkCardId]);

  const filtered = useMemo(() => {
    let cards = ALL_CARDS;
    const effectiveFilter = deepLinkCardId ? "all" : filter;
    if (effectiveFilter === "major") cards = MAJOR_ARCANA;
    else if (effectiveFilter !== "all") {
      cards = MINOR_ARCANA.filter((c) => c.id.includes(effectiveFilter));
    }

    if (search.trim()) {
      cards = cards.filter((c) => cardMatchesEncyclopediaSearch(c, search));
    }
    return cards;
  }, [filter, search, deepLinkCardId]);

  const sections = useMemo(
    () => getDisplaySections(filtered, deepLinkCardId ? "all" : filter, search),
    [filtered, filter, search, deepLinkCardId],
  );

  const activeFilter = FILTERS.find((entry) => entry.id === filter);

  return (
    <div className="encyclopedia-page">
      <header className="encyclopedia-page__intro">
        <div className="page-heading encyclopedia-page__heading">
          <span className="encyclopedia-page__heading-icon home__feature-icon-wrap">
            <NavIconBook className="home__feature-icon" />
          </span>
          <h1 className="encyclopedia-page__title">Encyclopédie du Tarot</h1>
        </div>
        <p className="encyclopedia-page__subtitle">
          Explore les 78 cartes du tarot, leurs mots-clés et leurs
          significations.
        </p>
      </header>

      <section
        className="encyclopedia-page__toolbar home__feature-card home__feature-card--purple"
        aria-label="Recherche et filtres"
      >
        <EncyclopediaToolbarDeco />
        <div className="encyclopedia-page__toolbar-head">
          <h2 className="encyclopedia-page__toolbar-title">
            Trouver une carte
          </h2>
          <span className="encyclopedia-page__toolbar-count">
            {filtered.length} / {ALL_CARDS.length}
          </span>
        </div>
        <label className="encyclopedia-page__search-wrap">
          <span className="encyclopedia-page__search-label">Recherche</span>
          <input
            className="encyclopedia-page__search"
            type="search"
            placeholder="Nom de carte ou mot-clé..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <div
          className="encyclopedia-page__tabs"
          role="tablist"
          aria-label="Filtrer par type"
        >
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={filter === f.id}
              className={`encyclopedia-page__tab encyclopedia-page__tab--${f.theme} ${filter === f.id ? "encyclopedia-page__tab--on" : ""}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      {filtered.length === 0 ? (
        <p className="encyclopedia-page__empty">Aucune carte trouvée.</p>
      ) : (
        <div className="encyclopedia-page__catalog">
          {(search.trim() || filter !== "all") && (
            <p className="encyclopedia-page__results-bar">
              <span
                className={`encyclopedia-page__results-pill encyclopedia-page__results-pill--${activeFilter?.theme ?? "purple"}`}
              >
                {filtered.length} carte{filtered.length > 1 ? "s" : ""}
              </span>
              {search.trim() && (
                <span className="encyclopedia-page__results-query">
                  correspondant à « {search.trim()} »
                </span>
              )}
            </p>
          )}

          {sections.map((section) => (
            <section
              key={section.id}
              className="encyclopedia-page__section"
              aria-labelledby={`encyclopedia-section-${section.id}`}
            >
              <div
                className={`encyclopedia-page__section-head encyclopedia-page__section-head--${section.theme}`}
              >
                <h2
                  id={`encyclopedia-section-${section.id}`}
                  className="encyclopedia-page__section-title"
                >
                  {section.title}
                </h2>
                <span
                  className={`encyclopedia-page__section-count encyclopedia-page__section-count--${section.theme}`}
                >
                  {section.cards.length}
                </span>
              </div>

              <ul className="encyclopedia-page__grid">
                {section.cards.map((card) => (
                  <EncyclopediaCard
                    key={card.id}
                    card={card}
                    expanded={activeExpandedId === card.id}
                    onToggle={() => {
                      const expanded = activeExpandedId === card.id;
                      setExpandedId(expanded ? null : card.id);
                      if (deepLinkCardId) setSearchParams({});
                    }}
                  />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
