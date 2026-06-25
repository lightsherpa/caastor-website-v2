/* Caastor v2 — auto-cycling tabbed service showcase (Rever-style).
   Four discipline panels crossfade; tabs auto-advance with a progress
   bar and can be clicked. Visuals are branded CSS mocks (no images). */
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion, useInView } from "motion/react";
import { Icon, Button } from "../ds/components.jsx";
import { Reveal } from "./shell.jsx";
import "./showcase-redesign.css";

const EASE = [0.22, 0.61, 0.36, 1];
const CYCLE_MS = 4400;
const ICONS = ["star", "grid", "message", "layers"]; // brand, web, social, graphic

/* Short bilingual stage-chrome labels per discipline (workspace vibe). */
const STAGE_LABELS = {
  en: ["Brand identity", "Web & product", "Social content", "Graphic design"],
  es: ["Identidad de marca", "Web y producto", "Contenido social", "Diseño gráfico"],
};

/* Concrete deliverables per discipline, keyed to the four service items
   (brand, web, social, graphic). Bilingual; selected by t.code. Derived
   from each item's title/body so the tab shows real value, not one line. */
const DELIVERABLES = {
  en: [
    ["Logo suite & visual identity", "Color, type & usage guidelines", "Brand kit ready for any tool"],
    ["Landing & marketing pages", "Product UI & design systems", "Conversion-ready prototypes"],
    ["Post sets for every channel", "Short-form video & reels", "Templates you can reuse"],
    ["Pitch decks & one-pagers", "Infographics & data visuals", "Print & event-ready assets"],
  ],
  es: [
    ["Suite de logo e identidad visual", "Guías de color, tipografía y uso", "Brand kit listo para cualquier herramienta"],
    ["Landings y páginas de marketing", "UI de producto y design systems", "Prototipos listos para convertir"],
    ["Sets de posts para cada canal", "Video corto y reels", "Plantillas que puedes reutilizar"],
    ["Decks de venta y one-pagers", "Infografías y visuales de datos", "Piezas listas para imprenta y eventos"],
  ],
};

/* ── Per-discipline mock visuals ─────────────────────────────── */
function BrandMock() {
  return (
    <div className="sc-mock sc-brand">
      <img src="/assets/mascot-yellow.png" alt="" style={{ width: 70 }} />
      <div className="sc-wordmark">Caastor</div>
      <div className="sc-swatches">
        {["var(--brand)", "var(--accent)", "#0B0B0F", "var(--brand-soft)"].map((c, i) => (
          <span key={i} style={{ background: c }} />
        ))}
      </div>
      <div className="sc-type">
        <span style={{ fontSize: 46, fontWeight: 800, letterSpacing: "-0.03em" }}>Aa</span>
        <span className="serif-accent" style={{ fontSize: 34 }}>Aa</span>
      </div>
    </div>
  );
}

function WebMock() {
  return (
    <div className="sc-mock">
      <div className="browser-frame" style={{ width: "100%", boxShadow: "var(--shadow-lg)" }}>
        <div className="browser-bar">
          <span className="browser-dots">
            <span style={{ background: "#FF5F57" }} />
            <span style={{ background: "#FEBC2E" }} />
            <span style={{ background: "#28C840" }} />
          </span>
          <div className="browser-url" style={{ maxWidth: 180 }}>yourbrand.com</div>
          <span style={{ width: 40 }} />
        </div>
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ width: 72, height: 12, borderRadius: 6, background: "var(--text-primary)" }} />
            <div style={{ display: "flex", gap: 8 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ width: 30, height: 8, borderRadius: 5, background: "var(--bg-muted)" }} />
              ))}
            </div>
          </div>
          <div style={{ height: 16, width: "70%", borderRadius: 7, background: "var(--text-primary)", marginTop: 10 }} />
          <div style={{ height: 16, width: "52%", borderRadius: 7, background: "var(--brand)" }} />
          <div style={{ height: 9, width: "84%", borderRadius: 5, background: "var(--bg-muted)" }} />
          <div style={{ height: 9, width: "76%", borderRadius: 5, background: "var(--bg-muted)" }} />
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <div style={{ width: 96, height: 34, borderRadius: 9, background: "var(--brand)" }} />
            <div style={{ width: 96, height: 34, borderRadius: 9, border: "1px solid var(--border-strong)" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialMock() {
  return (
    <div className="sc-mock sc-social">
      <div className="sc-phone">
        <div className="sc-phone-top">
          <span style={{ width: 26, height: 26, borderRadius: 999, background: "linear-gradient(135deg,var(--brand),var(--accent))" }} />
          <div style={{ width: 70, height: 8, borderRadius: 5, background: "var(--bg-muted)" }} />
          <Icon name="more" size={16} color="var(--text-tertiary)" style={{ marginLeft: "auto" }} />
        </div>
        <div className="sc-post" style={{ background: "linear-gradient(135deg, var(--brand-soft), var(--accent-soft))" }}>
          <img src="/assets/mascot-violet.png" alt="" style={{ width: 64, opacity: 0.95 }} />
        </div>
        <div className="sc-phone-actions">
          <Icon name="sparkles" size={18} color="var(--brand-strong)" />
          <Icon name="message" size={18} color="var(--text-tertiary)" />
          <Icon name="upload" size={18} color="var(--text-tertiary)" />
        </div>
        <div style={{ padding: "0 12px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ height: 8, width: "60%", borderRadius: 5, background: "var(--text-secondary)" }} />
          <div style={{ height: 7, width: "85%", borderRadius: 5, background: "var(--bg-muted)" }} />
        </div>
      </div>
    </div>
  );
}

function GraphicMock() {
  return (
    <div className="sc-mock">
      <div className="sc-poster">
        <div className="sc-poster-top">
          <span className="t-mono" style={{ fontSize: 11, color: "var(--text-on-brand)", opacity: 0.7 }}>Q3 · REPORT</span>
          <span style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.05, color: "var(--text-on-brand)" }}>
            Growth,
            <br />
            <span className="serif-accent" style={{ fontWeight: 400 }}>visualized.</span>
          </span>
        </div>
        <div className="sc-bars">
          {[40, 66, 52, 88, 72].map((h, i) => (
            <span key={i} style={{ height: `${h}%`, background: i === 3 ? "var(--text-on-brand)" : "rgba(11,11,15,0.35)" }} />
          ))}
        </div>
      </div>
    </div>
  );
}

const MOCKS = [BrandMock, WebMock, SocialMock, GraphicMock];

export function Showcase({ t, navigate }) {
  const items = (t.services?.items || []).slice(0, 4);
  const es = t.code === "ES";
  const bullets = DELIVERABLES[es ? "es" : "en"];
  const stageLabels = STAGE_LABELS[es ? "es" : "en"];
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const stageRef = useRef(null);
  const inView = useInView(stageRef, { margin: "0px 0px -20% 0px" });
  // Bump a key each (re)start so the ring/progress animation restarts cleanly,
  // including when the user clicks a tab manually.
  const [cycleKey, setCycleKey] = useState(0);
  const running = !reduce && inView && items.length > 1;

  // Only auto-advance while the section is on screen, so transitions never
  // churn off-screen and leave the stage mid-fade (blank).
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setActive((a) => (a + 1) % items.length);
      setCycleKey((k) => k + 1);
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, [items.length, running]);

  if (!items.length) return null;
  const Mock = MOCKS[active] || MOCKS[0];

  const jump = (i) => {
    setActive(i);
    setCycleKey((k) => k + 1); // restart the timer/ring on manual selection
  };

  return (
    <div className="scx">
      {/* ── Tab rail ── */}
      <div className="scx-rail">
        <div className="scx-railhead">
          <span className="scx-railhead-count t-mono">
            <b>0{active + 1}</b> / 0{items.length}
          </span>
          <span className="scx-railhead-line" />
        </div>

        {items.map((it, i) => {
          const on = i === active;
          return (
            <button
              key={i}
              type="button"
              className={"scx-tab" + (on ? " on" : "")}
              aria-pressed={on}
              onClick={() => jump(i)}
            >
              <span className="scx-chip" aria-hidden="true">
                <Icon name={ICONS[i]} size={17} />
              </span>

              <span className="scx-body">
                <span className="scx-title">
                  {it.title}
                  <span className="scx-num t-mono">0{i + 1}</span>
                </span>

                <AnimatePresence initial={false}>
                  {on && (
                    <motion.span
                      className="scx-desc"
                      initial={reduce ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={{ duration: reduce ? 0 : 0.34, ease: EASE }}
                    >
                      <span className="scx-desc-body">{it.body}</span>
                      <span className="scx-bullets">
                        {(bullets[i] || []).map((d, di) => (
                          <span key={di} className="scx-bullet">
                            <span className="scx-bullet-tick" aria-hidden="true">
                              <Icon name="check" size={12} color="var(--brand-strong)" />
                            </span>
                            <span>{d}</span>
                          </span>
                        ))}
                      </span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>

              {/* Auto-advance indicator: animated ring when cycling, dot otherwise */}
              {on &&
                (running ? (
                  <svg
                    key={cycleKey}
                    className="scx-ring"
                    viewBox="0 0 22 22"
                    aria-hidden="true"
                  >
                    <circle className="scx-ring-track" cx="11" cy="11" r="9" />
                    <circle
                      className="scx-ring-fill"
                      cx="11"
                      cy="11"
                      r="9"
                      style={{ "--scx-dur": `${CYCLE_MS}ms` }}
                    />
                  </svg>
                ) : (
                  <span className="scx-ring-dot" aria-hidden="true" />
                ))}
            </button>
          );
        })}

        <div className="scx-cta">
          <Button variant="primary" size="md" iconEnd="arrowRight" onClick={() => navigate("services")}>
            {t.home.services.cta}
          </Button>
        </div>
      </div>

      {/* ── Stage ── */}
      <div className="scx-stage" ref={stageRef}>
        <span className="scx-stage-glow" aria-hidden="true" />
        <span className="scx-stage-grid" aria-hidden="true" />

        <div className="scx-stage-bar">
          <span className="scx-stage-label">
            <Icon name={ICONS[active]} size={15} color="var(--brand-strong)" />
            <AnimatePresence initial={false} mode="wait">
              <motion.span
                key={active}
                initial={reduce ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
                transition={{ duration: reduce ? 0 : 0.24, ease: EASE }}
              >
                {stageLabels[active] || items[active]?.title}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="scx-stage-tag t-mono">{es ? "Vista previa" : "Preview"}</span>
        </div>

        {/* initial={false} → first mock paints immediately (never blank);
           crossfade layers overlap so content stays visible mid-transition. */}
        <div className="scx-viewport">
          <AnimatePresence initial={false}>
            <motion.div
              key={active}
              className="scx-layer"
              initial={{ opacity: 0, scale: 0.97, y: reduce ? 0 : 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1 }}
              transition={{ duration: reduce ? 0 : 0.42, ease: EASE }}
            >
              <Mock />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="scx-dots">
          {items.map((it, i) => (
            <button
              key={i}
              type="button"
              className={"scx-dot" + (i === active ? " on" : "")}
              aria-label={it.title}
              aria-pressed={i === active}
              onClick={() => jump(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* Reusable section wrapper so Home stays tidy. */
export function ShowcaseSection({ t, navigate }) {
  return (
    <section className="section surface-app hairline-top">
      <div className="container">
        <Reveal>
          <div style={{ textAlign: "center", maxWidth: 680, margin: "0 auto" }}>
            <h2 className="t-display-sm balance">{t.home.services.header}</h2>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <div style={{ marginTop: 48 }}>
            <Showcase t={t} navigate={navigate} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
