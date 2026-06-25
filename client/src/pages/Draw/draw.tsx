import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { InterpretationText } from "../../components/InterpretationText";
import {
  DecoSoftCloud,
  DecoSoftCrescentMoon,
  DecoSoftSparkle,
} from "../../components/Nav/NavIcons";
import { PageIntro } from "../../components/PageIntro/PageIntro";
import { useHistory } from "../../context/HistoryContext";
import { useProfile } from "../../context/ProfileContext";
import { SPREADS, getSpread } from "../../data/spreads";
import { getCardById, getDeckCards } from "../../data/tarotDeck";
import { requestInterpretation } from "../../lib/interpretApi";
import { buildMockInterpretation } from "../../lib/mockInterpretation";
import type {
  DrawRecord,
  PlacedCard,
  SpreadDefinition,
  SpreadId,
  Tone,
} from "../../types/tarot";
import { SpreadSchema, type SlotState } from "./SpreadSchema";
import "../Home/home.css";
import "./draw.css";

const TONES: { id: Tone; label: string; hint: string }[] = [
  {
    id: "spiritual",
    label: "Spirituel",
    hint: "Symboles, sens, guidance douce",
  },
  { id: "psychological", label: "Psychologique", hint: "Émotions, dynamiques" },
  { id: "direct", label: "Direct / conseil", hint: "Clair, actionnable" },
];

type PanelTheme = "purple" | "pink" | "green";

function DrawPanelDeco({
  theme,
  variant = "default",
}: {
  theme: PanelTheme;
  variant?: "default" | "spreads" | "schema" | "tone" | "result";
}) {
  return (
    <span className="home__feature-deco draw-page__deco" aria-hidden="true">
      {(theme === "purple" || theme === "green") &&
        variant !== "schema" &&
        variant !== "tone" && (
          <DecoSoftCloud className="home__feature-deco-soft-cloud" />
        )}
      {theme === "green" && variant === "tone" && (
        <>
          <DecoSoftCloud className="home__feature-deco-soft-cloud" />
          <DecoSoftCloud className="home__feature-deco-soft-cloud home__feature-deco-soft-cloud--right" />
          <DecoSoftSparkle className="home__feature-deco-spark home__feature-deco-spark--green-left-cloud" />
          <DecoSoftSparkle className="home__feature-deco-spark home__feature-deco-spark--green-left-cloud-sm" />
          <DecoSoftSparkle className="home__feature-deco-spark home__feature-deco-spark--green-cloud" />
          <DecoSoftSparkle className="draw-page__green-spark draw-page__green-spark--a" />
          <DecoSoftSparkle className="draw-page__green-spark draw-page__green-spark--b" />
        </>
      )}
      {theme === "purple" && variant === "default" && (
        <>
          <DecoSoftSparkle className="home__feature-deco-soft-spark home__feature-deco-soft-spark--a" />
          <DecoSoftSparkle className="home__feature-deco-soft-spark home__feature-deco-soft-spark--b" />
          <DecoSoftSparkle className="home__feature-deco-soft-spark home__feature-deco-soft-spark--c" />
        </>
      )}
      {theme === "purple" && variant === "schema" && (
        <>
          <DecoSoftSparkle className="draw-page__purple-spark draw-page__purple-spark--a" />
          <DecoSoftSparkle className="draw-page__purple-spark draw-page__purple-spark--b" />
          <DecoSoftSparkle className="draw-page__purple-spark draw-page__purple-spark--c" />
          <DecoSoftSparkle className="draw-page__purple-spark draw-page__purple-spark--d" />
          <DecoSoftSparkle className="draw-page__purple-spark draw-page__purple-spark--e" />
        </>
      )}
      {theme === "pink" && variant === "spreads" && (
        <>
          <DecoSoftCrescentMoon className="draw-page__pink-moon" />
          <DecoSoftSparkle className="draw-page__pink-spark draw-page__pink-spark--a" />
          <DecoSoftSparkle className="draw-page__pink-spark draw-page__pink-spark--b" />
          <DecoSoftSparkle className="draw-page__pink-spark draw-page__pink-spark--c" />
          <DecoSoftSparkle className="draw-page__pink-spark draw-page__pink-spark--d" />
        </>
      )}
    </span>
  );
}

function emptySlots(def: SpreadDefinition): Record<string, SlotState> {
  const o: Record<string, SlotState> = {};
  for (const p of def.positions) {
    o[p.key] = { cardId: null, reversed: false };
  }
  return o;
}

function slotsToPlaced(
  def: SpreadDefinition,
  slots: Record<string, SlotState>,
): PlacedCard[] | null {
  const out: PlacedCard[] = [];
  for (const p of def.positions) {
    const s = slots[p.key];
    if (!s?.cardId) return null;
    const card = getCardById(s.cardId);
    if (!card) return null;
    out.push({
      positionKey: p.key,
      positionLabel: p.label,
      card,
      reversed: s.reversed,
    });
  }
  return out;
}

export default function DrawPage() {
  const { profile } = useProfile();
  const { addDraw } = useHistory();
  const [spreadId, setSpreadId] = useState<SpreadId>("one");
  const [tone, setTone] = useState<Tone>("psychological");
  const [slots, setSlots] = useState<Record<string, SlotState>>(() => {
    const def = getSpread("one");
    return def ? emptySlots(def) : {};
  });
  const [result, setResult] = useState<DrawRecord | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiHint, setApiHint] = useState<string | null>(null);

  const spread = useMemo(() => getSpread(spreadId), [spreadId]);

  const deckCards = useMemo(
    () => getDeckCards(profile.deckPreference),
    [profile.deckPreference],
  );

  useEffect(() => {
    const def = getSpread(spreadId);
    if (def) {
      setSlots(emptySlots(def));
      setResult(null);
      setApiHint(null);
    }
    // Seulement quand le type de jeu change : évite de doubler le reset au changement de spread (géré par les radios).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.deckPreference]);

  const placedPreview = useMemo(() => {
    if (!spread) return null;
    return slotsToPlaced(spread, slots);
  }, [spread, slots]);

  function setSlot(key: string, next: SlotState) {
    setSlots((prev) => ({ ...prev, [key]: next }));
    setResult(null);
    setApiHint(null);
  }

  async function generateInterpretation() {
    if (!spread || !placedPreview) return;
    setIsGenerating(true);
    setApiHint(null);
    let interpretation: string;
    try {
      const res = await requestInterpretation({
        tone,
        spreadLabel: spread.label,
        profile,
        cards: placedPreview,
      });
      interpretation = res.interpretation;
      if (res.source === "mock") {
        setApiHint(
          "Serveur en mode configuration (`AI_DISABLED`) : aucune requête OpenAI, texte stub.",
        );
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      interpretation = buildMockInterpretation({
        profile,
        spreadId,
        spreadLabel: spread.label,
        tone,
        cards: placedPreview,
      });
      setApiHint(
        message
          ? `Mode démo : ${message}. Texte local affiché.`
          : "Mode démo : impossible de joindre l'API IA, texte local affiché.",
      );
    } finally {
      setIsGenerating(false);
    }

    const record: DrawRecord = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      spreadId,
      spreadLabel: spread.label,
      tone,
      cards: placedPreview,
      interpretation,
    };
    setResult(record);
    addDraw(record);
  }

  return (
    <div className="draw-page">
      <PageIntro title="Tirage">
        <p>
          Fais ton tirage <strong>avec ton jeu physique</strong> (ou comme tu en
          as l&apos;habitude). TarotMind affiche le{" "}
          <strong>schéma du tirage</strong> : tu indiques toi-même chaque arcane
          tiré. L&apos;
          <strong>IA</strong> ne tire pas les cartes, elle sert uniquement à{" "}
          <strong>interpréter</strong> la combinaison, selon ton{" "}
          <Link to="/profil" className="draw-page__inline-link">
            profil
          </Link>{" "}
          et le ton choisi.
        </p>
      </PageIntro>

      <div className="draw-page__flow">
        <section
          className="draw-page__panel home__feature-card home__feature-card--pink"
          aria-labelledby="spreads-heading"
        >
          <DrawPanelDeco theme="pink" variant="spreads" />
          <h2 id="spreads-heading" className="draw-page__h2">
            Type de tirage
          </h2>
          <p className="draw-page__spread-hint">
            Choisis le tirage qui correspond à ta situation.
          </p>
          <ul className="draw-page__spread-list">
            {SPREADS.map((s) => (
              <li key={s.id}>
                <label
                  className={`draw-page__spread-option${spreadId === s.id ? " draw-page__spread-option--on" : ""}`}
                >
                  <input
                    type="radio"
                    className="draw-page__spread-input"
                    name="spread"
                    value={s.id}
                    checked={spreadId === s.id}
                    onChange={() => {
                      setSpreadId(s.id);
                      const def = getSpread(s.id);
                      if (def) {
                        setSlots(emptySlots(def));
                        setResult(null);
                        setApiHint(null);
                      }
                    }}
                  />
                  <span
                    className="draw-page__spread-radio"
                    aria-hidden="true"
                  />
                  <span className="draw-page__spread-icon-wrap">
                    <img
                      className="draw-page__spread-icon"
                      src={s.icon}
                      alt=""
                      width={58}
                      height={58}
                      decoding="async"
                      aria-hidden
                    />
                  </span>
                  <span className="draw-page__spread-text">
                    <span className="draw-page__spread-label">{s.label}</span>
                    <span className="draw-page__spread-desc">
                      {s.description}
                    </span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </section>

        {spread && (
          <section
            className="draw-page__panel home__feature-card home__feature-card--purple"
            aria-labelledby="schema-heading"
          >
            <DrawPanelDeco theme="purple" variant="schema" />
            <h2 id="schema-heading" className="draw-page__h2">
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

        <section
          className="draw-page__panel home__feature-card home__feature-card--green"
          aria-labelledby="tone-heading"
        >
          <DrawPanelDeco theme="green" variant="tone" />
          <h2 id="tone-heading" className="draw-page__h2">
            Ton d&apos;interprétation (IA)
          </h2>
          <div className="draw-page__tones">
            {TONES.map((t) => (
              <label
                key={t.id}
                className={`draw-page__tone${tone === t.id ? " draw-page__tone--on" : ""}`}
              >
                <input
                  type="radio"
                  className="draw-page__tone-input"
                  name="tone"
                  value={t.id}
                  checked={tone === t.id}
                  onChange={() => {
                    setTone(t.id);
                    setResult(null);
                    setApiHint(null);
                  }}
                />
                <span className="draw-page__tone-radio" aria-hidden="true" />
                <span className="draw-page__tone-label">{t.label}</span>
                <span className="draw-page__tone-hint">{t.hint}</span>
              </label>
            ))}
          </div>
        </section>

        <div className="draw-page__actions">
          <button
            type="button"
            className="draw-page__submit"
            disabled={!placedPreview || isGenerating}
            onClick={generateInterpretation}
          >
            {isGenerating
              ? "Génération en cours..."
              : "Générer l\u2019interprétation"}
          </button>
          {spread && !placedPreview && (
            <p className="draw-page__meta">
              {spread.positions.length} position
              {spread.positions.length > 1 ? "s" : ""} — remplis chaque arcane
              pour activer le bouton.
            </p>
          )}
        </div>
      </div>

      {result && (
        <section
          className="draw-page__result home__feature-card home__feature-card--purple"
          aria-live="polite"
        >
          <DrawPanelDeco theme="purple" variant="default" />
          <h2 className="draw-page__h2">Récapitulatif</h2>
          <ul className="draw-page__cards">
            {result.cards.map((c) => (
              <li key={c.positionKey} className="draw-page__card">
                <span className="draw-page__card-pos">{c.positionLabel}</span>
                <span className="draw-page__card-name">
                  {c.card.nameFr}
                  {c.reversed ? " · renversée" : ""}
                </span>
              </li>
            ))}
          </ul>
          <h2 className="draw-page__h2 draw-page__h2--gap">Interprétation</h2>
          <div className="draw-page__interpretation">
            <InterpretationText text={result.interpretation} />
          </div>
        </section>
      )}

      {(apiHint || result) && (
        <p className="draw-page__hint">
          {apiHint ??
            "Texte généré par l\u2019IA serveur à partir des cartes saisies et du profil."}
        </p>
      )}
    </div>
  );
}
