import { useRef, useMemo, useState, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { InterpretationText } from "../../components/InterpretationText";
import { ConfirmModal } from "../../components/ConfirmModal/ConfirmModal";
import {
  DecoSoftCloud,
  DecoSoftCrescentMoon,
  DecoSoftSparkle,
} from "../../components/Nav/NavIcons";
import { PageIntro } from "../../components/PageIntro/PageIntro";
import { useHistory } from "../../context/HistoryContext";
import { useProfile } from "../../context/ProfileContext";
import { getSpread } from "../../data/spreads";
import { requestHistoryInsights } from "../../lib/historyInsightsApi";
import { buildHistoryInsights } from "../../lib/historyInsights";
import type { DrawRecord, SpreadId, Tone } from "../../types/tarot";
import "../Home/home.css";
import "./history.css";

type PanelTheme = "purple" | "pink" | "green";

function HistoryPanelDeco({
  theme,
  variant = "default",
}: {
  theme: PanelTheme;
  variant?: "default" | "compare" | "timeline";
}) {
  return (
    <span className="home__feature-deco history-page__deco" aria-hidden="true">
      {(theme === "purple" || theme === "green") && variant !== "timeline" && (
        <DecoSoftCloud className="home__feature-deco-soft-cloud" />
      )}
      {theme === "green" && variant === "timeline" && (
        <>
          <DecoSoftCloud className="home__feature-deco-soft-cloud home__feature-deco-soft-cloud--right" />
          <DecoSoftSparkle className="home__feature-deco-spark home__feature-deco-spark--green-left-cloud" />
          <DecoSoftSparkle className="home__feature-deco-spark home__feature-deco-spark--green-left-cloud-sm" />
          <DecoSoftSparkle className="home__feature-deco-spark home__feature-deco-spark--green-cloud" />
          <DecoSoftSparkle className="history-page__green-spark history-page__green-spark--a" />
          <DecoSoftSparkle className="history-page__green-spark history-page__green-spark--b" />
        </>
      )}
      {theme === "purple" && variant === "default" && (
        <>
          <DecoSoftSparkle className="home__feature-deco-soft-spark home__feature-deco-soft-spark--a" />
          <DecoSoftSparkle className="home__feature-deco-soft-spark home__feature-deco-soft-spark--b" />
          <DecoSoftSparkle className="home__feature-deco-soft-spark home__feature-deco-soft-spark--c" />
        </>
      )}
      {theme === "pink" && variant === "compare" && (
        <>
          <DecoSoftCrescentMoon className="history-page__pink-moon" />
          <DecoSoftSparkle className="history-page__pink-spark history-page__pink-spark--a" />
          <DecoSoftSparkle className="history-page__pink-spark history-page__pink-spark--b" />
          <DecoSoftSparkle className="history-page__pink-spark history-page__pink-spark--c" />
        </>
      )}
    </span>
  );
}

function toneLabel(t: Tone) {
  if (t === "spiritual") return "spirituel";
  if (t === "psychological") return "psychologique";
  return "direct / conseil";
}

function formatWhen(iso: string) {
  try {
    return new Date(iso).toLocaleString("fr-FR", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

function cardsSummary(d: DrawRecord) {
  return d.cards.map((c) => c.card.nameFr).join(" · ");
}

function HistoryCtaButton({
  children,
  disabled,
  onClick,
  className = "",
}: {
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={`home__cta-btn history-page__cta-btn${className ? ` ${className}` : ""}`}
      disabled={disabled}
      onClick={onClick}
    >
      <span className="home__cta-label">{children}</span>
    </button>
  );
}

function NoteForm({
  drawId,
  currentNote,
  onSave,
}: {
  drawId: string;
  currentNote: string;
  onSave: (id: string, note: string) => void;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    const val = ref.current?.value ?? "";
    onSave(drawId, val.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div className="history-page__note-form">
      <textarea
        ref={ref}
        className="history-page__note-textarea"
        defaultValue={currentNote}
        placeholder="Écris tes ressentis, réflexions..."
        rows={3}
      />
      <HistoryCtaButton onClick={handleSave}>
        {saved ? "Enregistré !" : "Enregistrer"}
      </HistoryCtaButton>
    </div>
  );
}

function formatWhenShort(iso: string) {
  try {
    return new Date(iso).toLocaleString("fr-FR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function DrawDetailPanel({
  draw,
  onSaveNote,
  onDelete,
}: {
  draw: DrawRecord;
  onSaveNote: (id: string, note: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="history-page__detail">
      <header className="history-page__detail-head">
        <div className="history-page__detail-head-main">
          {draw.question && (
            <p className="history-page__detail-question">
              &laquo;&nbsp;{draw.question}&nbsp;&raquo;
            </p>
          )}
          <div className="history-page__detail-meta">
            <span className="history-page__detail-badge">
              {draw.spreadLabel}
            </span>
            {!draw.question && (
              <span className="history-page__detail-tone">
                {toneLabel(draw.tone)}
              </span>
            )}
          </div>
          <p className="history-page__detail-cards-line">
            {cardsSummary(draw)}
          </p>
        </div>
        <div className="history-page__detail-actions">
          <button
            type="button"
            className="history-page__delete-btn"
            onClick={() => onDelete(draw.id)}
          >
            Supprimer
          </button>
        </div>
      </header>

      <div className="history-page__detail-body">
        <section
          className="history-page__detail-section"
          aria-labelledby={`detail-cards-${draw.id}`}
        >
          <h4 id={`detail-cards-${draw.id}`} className="history-page__detail-h">
            Cartes
          </h4>
          <ul className="history-page__detail-cards">
            {draw.cards.map((c) => (
              <li key={c.positionKey}>
                <span className="history-page__pos">{c.positionLabel}</span>
                <span className="history-page__name">
                  {c.card.nameFr}
                  {c.reversed ? " (renversée)" : ""}
                </span>
                <span className="history-page__kw">
                  {c.card.keywords.join(", ")}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section
          className="history-page__detail-section"
          aria-labelledby={`detail-note-${draw.id}`}
        >
          <h4 id={`detail-note-${draw.id}`} className="history-page__detail-h">
            Note personnelle
          </h4>
          <NoteForm
            drawId={draw.id}
            currentNote={draw.note ?? ""}
            onSave={onSaveNote}
          />
        </section>

        <section
          className="history-page__detail-section history-page__detail-section--interp"
          aria-labelledby={`detail-interp-${draw.id}`}
        >
          <h4
            id={`detail-interp-${draw.id}`}
            className="history-page__detail-h"
          >
            Interprétation
          </h4>
          <div className="history-page__detail-interp">
            <InterpretationText text={draw.interpretation} />
          </div>
        </section>
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const { profile } = useProfile();
  const { draws, clearHistory, removeDraw, toggleFavorite, updateNote } =
    useHistory();
  const [searchParams, setSearchParams] = useSearchParams();
  const spreadFilter = searchParams.get("spread") as SpreadId | null;
  const spreadFilterDef = spreadFilter ? getSpread(spreadFilter) : undefined;
  const timelineDraws = useMemo(() => {
    if (!spreadFilterDef) return draws;
    return draws.filter((draw) => draw.spreadId === spreadFilterDef.id);
  }, [draws, spreadFilterDef]);
  const [compareA, setCompareA] = useState<string>("");
  const [compareB, setCompareB] = useState<string>("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [historyAiText, setHistoryAiText] = useState<string | null>(null);
  const [historyAiHint, setHistoryAiHint] = useState<string | null>(null);
  const [loadingHistoryAi, setLoadingHistoryAi] = useState(false);
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);

  const handleRemoveDraw = (id: string) => {
    if (!window.confirm("Supprimer ce tirage de l\u2019historique ?")) return;
    removeDraw(id);
    setExpandedId((current) => (current === id ? null : current));
    if (compareA === id) setCompareA("");
    if (compareB === id) setCompareB("");
  };

  const handleClearAll = () => {
    clearHistory();
    setCompareA("");
    setCompareB("");
    setExpandedId(null);
    setClearConfirmOpen(false);
  };

  const insights = useMemo(() => buildHistoryInsights(draws), [draws]);

  const drawA = draws.find((d) => d.id === compareA);
  const drawB = draws.find((d) => d.id === compareB);

  async function generateHistoryAiInsights() {
    if (draws.length === 0 || loadingHistoryAi) return;
    setLoadingHistoryAi(true);
    setHistoryAiHint(null);
    try {
      const res = await requestHistoryInsights({ profile, draws });
      setHistoryAiText(res.interpretation);
      if (res.source === "mock") {
        setHistoryAiHint(
          "Mode configuration: l'IA est désactivée côté serveur (`AI_DISABLED`).",
        );
      } else if (res.source === "cache") {
        setHistoryAiHint(
          "Analyse chargée depuis le cache local (aucun appel IA).",
        );
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : "";
      setHistoryAiText(null);
      setHistoryAiHint(
        msg
          ? `Impossible de générer l'analyse IA: ${msg}.`
          : "Impossible de générer l'analyse IA pour le moment.",
      );
    } finally {
      setLoadingHistoryAi(false);
    }
  }

  return (
    <div className="history-page">
      <PageIntro title="Historique & évolution">
          <p>
            Timeline de tes tirages, comparaison rapide et aperçu d&apos;analyse
            sur ton historique local.
          </p>
        </PageIntro>

      <div className="history-page__flow">
        <section
          className="history-page__panel home__feature-card home__feature-card--purple"
          aria-labelledby="insights-h"
        >
          <HistoryPanelDeco theme="purple" variant="default" />
          <div className="history-page__insights-head">
            <h2 id="insights-h" className="history-page__h2">
              Analyse (aperçu IA)
            </h2>
            <HistoryCtaButton
              onClick={generateHistoryAiInsights}
              disabled={draws.length === 0 || loadingHistoryAi}
            >
              {loadingHistoryAi
                ? "Analyse en cours..."
                : "Analyser mon historique"}
            </HistoryCtaButton>
          </div>
          <ul className="history-page__insights">
            {insights.map((line, i) => (
              <li key={i}>
                <InterpretationText text={line} />
              </li>
            ))}
          </ul>
          {historyAiHint && (
            <p className="history-page__hint">{historyAiHint}</p>
          )}
          {historyAiText && (
            <div className="history-page__ai-result">
              <InterpretationText text={historyAiText} />
            </div>
          )}
        </section>

        <section
          className="history-page__panel home__feature-card home__feature-card--pink"
          aria-labelledby="compare-h"
        >
          <HistoryPanelDeco theme="pink" variant="compare" />
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
                    className="history-page__select"
                    value={compareA}
                    onChange={(e) => setCompareA(e.target.value)}
                  >
                    <option value="">Choisir…</option>
                    {draws.map((d) => (
                      <option key={d.id} value={d.id}>
                        {formatWhen(d.createdAt)} · {d.question ? "Q" : "T"} ·{" "}
                        {d.spreadLabel}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="history-page__select-label">
                  Tirage B
                  <select
                    className="history-page__select"
                    value={compareB}
                    onChange={(e) => setCompareB(e.target.value)}
                  >
                    <option value="">Choisir…</option>
                    {draws.map((d) => (
                      <option key={`b-${d.id}`} value={d.id}>
                        {formatWhen(d.createdAt)} · {d.question ? "Q" : "T"} ·{" "}
                        {d.spreadLabel}
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
                          <span className="history-page__pos">
                            {c.positionLabel}
                          </span>
                          <span className="history-page__name">
                            {c.card.nameFr}
                            {c.reversed ? " ↺" : ""}
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
                          <span className="history-page__pos">
                            {c.positionLabel}
                          </span>
                          <span className="history-page__name">
                            {c.card.nameFr}
                            {c.reversed ? " ↺" : ""}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              {drawA && drawB && drawA.id === drawB.id && (
                <p className="history-page__hint">
                  Choisis deux tirages différents.
                </p>
              )}
            </>
          )}
        </section>

        <section
          className="history-page__panel home__feature-card home__feature-card--green"
          aria-labelledby="timeline-h"
        >
          <HistoryPanelDeco theme="green" variant="timeline" />
          <div className="history-page__timeline-head">
            <div className="history-page__timeline-head-start">
              <h2 id="timeline-h" className="history-page__h2">
                Timeline
              </h2>
              {timelineDraws.length > 0 && (
                <span className="history-page__timeline-badge">
                  {timelineDraws.length} tirage
                  {timelineDraws.length > 1 ? "s" : ""}
                </span>
              )}
            </div>
            {draws.length > 0 && (
              <button
                type="button"
                className="history-page__clear"
                onClick={() => setClearConfirmOpen(true)}
              >
                Tout effacer
              </button>
            )}
          </div>
          {draws.length === 0 ? (
            <p className="history-page__empty">Aucun tirage enregistré.</p>
          ) : timelineDraws.length === 0 ? (
            <p className="history-page__empty">
              Aucun tirage de type « {spreadFilterDef?.label ?? "sélectionné"}{" "}
              ».
            </p>
          ) : (
            <>
              {spreadFilterDef && (
                <p className="history-page__filter-banner">
                  Filtre actif : {spreadFilterDef.label}
                  {" · "}
                  <button
                    type="button"
                    className="history-page__filter-clear"
                    onClick={() => setSearchParams({})}
                  >
                    Afficher tout
                  </button>
                </p>
              )}
              <div className="history-page__timeline-scroll">
                <ol className="history-page__timeline">
                  {timelineDraws.map((d) => {
                    const isOpen = expandedId === d.id;
                    return (
                      <li key={d.id} className="history-page__event">
                        <div
                          className={`history-page__event-row${isOpen ? " history-page__event-row--open" : ""}`}
                        >
                          <button
                            type="button"
                            className="history-page__event-row-main"
                            onClick={() => setExpandedId(isOpen ? null : d.id)}
                            aria-expanded={isOpen}
                          >
                            <time
                              dateTime={d.createdAt}
                              className="history-page__event-date"
                            >
                              {formatWhenShort(d.createdAt)}
                            </time>
                            <span
                              className={`history-page__event-kind history-page__event-kind--${d.question ? "question" : "draw"}`}
                            >
                              {d.question ? "Q" : "T"}
                            </span>
                            <span className="history-page__event-label">
                              {d.spreadLabel}
                            </span>
                          </button>
                          <button
                            type="button"
                            className={`history-page__event-fav${d.favorite ? " history-page__event-fav--on" : ""}`}
                            onClick={() => toggleFavorite(d.id)}
                            aria-label={
                              d.favorite
                                ? "Retirer des favoris"
                                : "Ajouter aux favoris"
                            }
                            aria-pressed={d.favorite}
                          >
                            <span aria-hidden="true">
                              {d.favorite ? "★" : "☆"}
                            </span>
                          </button>
                          <button
                            type="button"
                            className="history-page__event-row-toggle"
                            onClick={() => setExpandedId(isOpen ? null : d.id)}
                            aria-expanded={isOpen}
                            aria-label={
                              isOpen ? "Replier le tirage" : "Déplier le tirage"
                            }
                          >
                            <span
                              className="history-page__event-chevron"
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                        {isOpen && (
                          <DrawDetailPanel
                            draw={d}
                            onSaveNote={updateNote}
                            onDelete={handleRemoveDraw}
                          />
                        )}
                      </li>
                    );
                  })}
                </ol>
              </div>
            </>
          )}
        </section>
      </div>

      <ConfirmModal
        open={clearConfirmOpen}
        title="Effacer l'historique ?"
        message="Tous les tirages enregistrés sur cet appareil seront supprimés définitivement."
        confirmLabel="Tout effacer"
        cancelLabel="Annuler"
        variant="danger"
        onConfirm={handleClearAll}
        onCancel={() => setClearConfirmOpen(false)}
      />
    </div>
  );
}
