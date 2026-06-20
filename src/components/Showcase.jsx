/* Caastor v2 — auto-cycling tabbed service showcase (Rever-style).
   Four discipline panels crossfade; tabs auto-advance with a progress
   bar and can be clicked. Visuals are branded CSS mocks (no images). */
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion, useInView } from "motion/react";
import { Icon, Button } from "../ds/components.jsx";
import { Reveal } from "./shell.jsx";

const EASE = [0.22, 0.61, 0.36, 1];
const ICONS = ["star", "grid", "message", "layers"]; // brand, web, social, graphic

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
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const stageRef = useRef(null);
  const inView = useInView(stageRef, { margin: "0px 0px -20% 0px" });

  // Only auto-advance while the section is on screen, so transitions never
  // churn off-screen and leave the stage mid-fade (blank).
  useEffect(() => {
    if (reduce || !inView || items.length < 2) return;
    const id = setInterval(() => setActive((a) => (a + 1) % items.length), 4400);
    return () => clearInterval(id);
  }, [items.length, reduce, inView]);

  if (!items.length) return null;
  const Mock = MOCKS[active] || MOCKS[0];

  return (
    <div className="showcase">
      <div className="showcase-tabs">
        {items.map((it, i) => {
          const on = i === active;
          return (
            <button key={i} className={"showcase-tab" + (on ? " on" : "")} onClick={() => setActive(i)}>
              <span className="showcase-num t-mono">0{i + 1}</span>
              <span className="showcase-tab-body">
                <span className="showcase-tab-title">
                  <Icon name={ICONS[i]} size={17} /> {it.title}
                </span>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.span
                      className="showcase-tab-desc"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.34, ease: EASE }}
                    >
                      <span style={{ display: "block", paddingTop: 6 }}>{it.body}</span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
              {on && !reduce && <span key={active} className="showcase-progress" />}
            </button>
          );
        })}
        <div style={{ marginTop: 8 }}>
          <Button variant="primary" size="md" iconEnd="arrowRight" onClick={() => navigate("services")}>
            {t.home.services.cta}
          </Button>
        </div>
      </div>

      <div className="showcase-stage" ref={stageRef}>
        {/* initial={false} → first mock paints immediately (never blank);
           crossfade layers overlap so content stays visible mid-transition. */}
        <AnimatePresence initial={false}>
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: EASE }}
            style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}
          >
            <Mock />
          </motion.div>
        </AnimatePresence>
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
