/* ──────────────────────────────────────────────────────────────────
   Caastor v2 — HeroSection
   Self-contained dark hero. Preserves the original content + behavior
   (HeroHeadline, Eyebrow, SlotWord rotor, static LCP sub, two CTAs, the
   ScrollTilt product stage with browser frame + PlatformMock + floating
   chips + mascot peek, plus HeroCanvas shader and MagneticCursor) and
   ELEVATES it with a warm-dark, product-forward depth treatment:
   an ambient perspective grid, a breathing brand halo, drifting accent
   orbs, a pooled under-glow beneath the floating dashboard, a reflection
   sheen, a live availability pill and a trust strip.
   Reference (21st.dev, inspiration only — rebuilt in token CSS):
   "Hero with Mockup" (layered Glow behind the product surface) +
   "Hero Designali" (radial-masked perspective grid).
   ────────────────────────────────────────────────────────────────── */
import { Button, Icon } from "../ds/components.jsx";
import { Reveal, Eyebrow } from "./shell.jsx";
import { ScrollTilt, HeroHeadline, SlotWord, MagneticCursor } from "../motion/primitives.jsx";
import { motion, useReducedMotion } from "motion/react";
import { EASE, DUR, SPRING } from "../motion/tokens.js";
import { HeroCanvas } from "../motion/HeroCanvas.jsx";
import { PlatformMock } from "./PlatformMock.jsx";
import { bookingProps } from "../lib/booking.js";
import "./hero.css";

/* ── Product stage — the real platform screen in a browser frame with
   floating UI fragments layered forward in 3D, an under-glow pool, and a
   sweeping reflection sheen. Preserves the original chips + mascot. ── */
function HeroVisual({ lang, reduce }) {
  const L =
    lang === "es"
      ? {
          draft: "Borrador listo",
          ago: "hace 2 min",
          fast: "Entregado en 48h",
          live: "En curso",
          cta: "Reservar demo",
          shipped: "Entregados esta semana",
        }
      : {
          draft: "Draft ready",
          ago: "2 min ago",
          fast: "Shipped in 48 h",
          live: "On track",
          cta: "Book a demo",
          shipped: "Shipped this week",
        };

  /* ── Chip ENTRANCE (inner layer): arrive along a gentle ARC — the keyframed
     x/y bow the path outward instead of a straight pop-in — then settle with a
     soft-spring overshoot (follow-through), so it doesn't stop dead. ── */
  const chipEnter = (dx, dy, bow, delay) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, x: dx, y: dy, scale: 0.92 },
          animate: { opacity: 1, x: [dx, bow, 0], y: [dy, dy * 0.42, 0], scale: 1 },
          transition: {
            opacity: { duration: DUR.base, ease: EASE.out, delay },
            x: { duration: 0.66, ease: EASE.emphasized, delay },
            y: { duration: 0.66, ease: EASE.emphasized, delay },
            scale: { ...SPRING.soft, delay },
          },
        };

  /* ── Chip IDLE (outer layer): drift along a gentle curve (x and y out of
     phase trace an arc, not a straight bob). Kept on its own element so it
     composes with — instead of fighting — the entrance transform. ── */
  const chipIdle = (ax, ay, dur, delay) =>
    reduce
      ? {}
      : {
          animate: {
            x: [0, ax, ax * 0.3, -ax * 0.5, 0],
            y: [0, -ay, ay * 0.4, -ay * 0.7, 0],
          },
          transition: { duration: dur, ease: EASE.inOut, repeat: Infinity, delay },
        };

  return (
    <div
      style={{ position: "relative", transformStyle: "preserve-3d", cursor: "pointer" }}
      data-cursor={L.cta}
      {...bookingProps}
    >
      <div className="browser-frame" style={{ boxShadow: "var(--shadow-xl)" }}>
        <div className="browser-bar">
          <span className="browser-dots">
            <span style={{ background: "#FF5F57" }} />
            <span style={{ background: "#FEBC2E" }} />
            <span style={{ background: "#28C840" }} />
          </span>
          <div className="browser-url">app.caastor.co</div>
          <span style={{ width: 52 }} />
        </div>
        <PlatformMock lang={lang} />
        {/* Reflection sheen sweeping across the glass (reduced-motion safe) */}
        {!reduce && <div className="cst-hero-sheen" aria-hidden="true" />}
      </div>

      {/* floating draft-ready toast (front layer).
         Outer div keeps the 3D translateZ (untouched by motion); the idle and
         entrance transforms live on nested motion layers so they compose with
         the Z-depth instead of overwriting it. */}
      <div style={{ position: "absolute", left: -26, bottom: -26, transform: "translateZ(55px)" }}>
        <motion.div {...chipIdle(5, 8, 7, 1.2)}>
          <motion.div
            className="hero-float"
            style={{ display: "flex", alignItems: "center", gap: 12 }}
            {...chipEnter(-22, 26, -8, 0.35)}
          >
            <div style={{ width: 34, height: 34, borderRadius: 9, background: "var(--status-success-soft)", color: "var(--status-success)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name="check" size={18} />
            </div>
            <div style={{ whiteSpace: "nowrap" }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{L.draft}</div>
              <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{L.ago}</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* floating turnaround chip (front layer) */}
      <div style={{ position: "absolute", left: -34, top: 64, transform: "translateZ(78px)" }}>
        <motion.div {...chipIdle(-6, 7, 8.4, 0.4)}>
          <motion.div
            className="hero-float"
            style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 13px" }}
            {...chipEnter(-26, 18, -10, 0.5)}
          >
            <span style={{ width: 8, height: 8, borderRadius: 999, background: "var(--brand)", boxShadow: "0 0 0 4px rgba(var(--brand-glow),0.18)" }} />
            <span style={{ fontSize: 13, fontWeight: 700, whiteSpace: "nowrap" }}>{L.fast}</span>
          </motion.div>
        </motion.div>
      </div>

      {/* floating live-metric chip (right edge, front layer) */}
      <div style={{ position: "absolute", right: -30, bottom: 52, transform: "translateZ(66px)" }}>
        <motion.div {...chipIdle(6, 9, 7.8, 1.7)}>
          <motion.div
            className="hero-float cst-hero-metric"
            {...chipEnter(28, 22, 10, 0.62)}
          >
            <span className="cst-hero-metric-spark" aria-hidden="true">
              <i style={{ height: "55%" }} />
              <i style={{ height: "85%" }} />
              <i style={{ height: "40%" }} />
              <i style={{ height: "100%" }} />
            </span>
            <div style={{ whiteSpace: "nowrap" }}>
              <div style={{ fontSize: 15, fontWeight: 800, lineHeight: 1 }}>+18</div>
              <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 3 }}>{L.shipped}</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* mascot peek (front-most). Outer div holds the static 3D placement +
         rotate/translateZ; inner motion.img arrives with EXAGGERATION — a
         bouncy spring overshoot — then keeps a tiny idle wobble (secondary
         life). Both guarded by reduce. */}
      <div style={{ position: "absolute", right: -28, top: -34, transform: "rotate(8deg) translateZ(96px)" }}>
        <motion.img
          src="/assets/mascot-yellow.png"
          alt=""
          style={{ display: "block", width: 74, transformOrigin: "70% 100%", filter: "drop-shadow(0 10px 22px rgba(0,0,0,0.16))" }}
          {...(reduce
            ? {}
            : {
                initial: { opacity: 0, scale: 0.4, y: -14, rotate: -10 },
                animate: { opacity: 1, scale: 1, y: 0, rotate: [-10, 6, -3, 0] },
                transition: {
                  opacity: { duration: DUR.fast, delay: 0.5 },
                  scale: { ...SPRING.bouncy, delay: 0.5 },
                  y: { ...SPRING.bouncy, delay: 0.5 },
                  rotate: { duration: 0.9, ease: EASE.emphasized, delay: 0.5 },
                },
              })}
        />
      </div>
    </div>
  );
}

export function HeroSection({ t, lang, navigate }) {
  const h = t.home;
  const reduce = useReducedMotion();

  const status = lang === "es" ? "Plazas abiertas · respuesta en 24h" : "Spots open · reply within 24 hours";
  const trust =
    lang === "es"
      ? ["Sin contratos", "Pausa o cancela cuando quieras", "Revisiones ilimitadas"]
      : ["No contracts", "Pause or cancel anytime", "Unlimited revisions"];

  return (
    <section className="hero hero--dark">
      <div className="hero-fallback" aria-hidden="true" />
      <HeroCanvas />
      {/* Ambient depth layers — between the shader (z0) and content (z1) */}
      <div className="cst-hero-ambient" aria-hidden="true">
        <div className="cst-hero-grid" />
        <div className="cst-hero-halo" />
        <div className="cst-hero-orb is-a" />
        <div className="cst-hero-orb is-b" />
      </div>
      <MagneticCursor />

      <div className="container" style={{ position: "relative", zIndex: 1, padding: "84px 28px 52px" }}>
        <div className="hero-stack">
          <Reveal>
            <div style={{ marginBottom: 16, display: "flex", justifyContent: "center" }}>
              <span className="cst-hero-status">
                <span className="cst-hero-status-dot" />
                {status}
              </span>
            </div>
          </Reveal>
          <Reveal delay={40}>
            <div style={{ marginBottom: 18, display: "flex", justifyContent: "center" }}>
              <Eyebrow>{h.hero.eyebrow}</Eyebrow>
            </div>
          </Reveal>
          <HeroHeadline
            a={h.hero.h1a}
            serif={h.hero.h1serif}
            b={h.hero.h1b}
            className="t-display-lg balance hero-h1 cst-hero-h1"
            style={{ marginBottom: 14, textAlign: "center" }}
          />
          <Reveal delay={90}>
            <div className="hero-rotor">
              <span className="hero-rotor-pre">{lang === "es" ? "Diseño para" : "Creative for"}</span>
              <SlotWord
                className="hero-rotor-word"
                words={lang === "es"
                  ? ["webs", "marcas", "redes", "decks", "ads", "campañas"]
                  : ["websites", "brands", "social", "decks", "ads", "campaigns"]}
              />
            </div>
          </Reveal>
          {/* Static (no fade) so it is the LCP element and paints with first
             paint. Intentional on-dark white kept. */}
          <p className="pretty" style={{ fontSize: 18, lineHeight: "28px", color: "rgba(255,255,255,0.72)", maxWidth: 560, margin: "16px auto 26px", textAlign: "center" }}>
            {h.hero.sub}
          </p>
          <Reveal delay={180}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
              <Button variant="primary" size="lg" iconEnd="arrowRight" className="btn-cta" {...bookingProps}>
                {h.hero.ctaPrimary}
              </Button>
              <Button variant="outline" size="lg" style={{ color: "#fff", borderColor: "rgba(255,255,255,0.28)" }} onClick={() => navigate("pricing")}>
                {h.hero.ctaSecondary}
              </Button>
            </div>
          </Reveal>
          <Reveal delay={240}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div className="cst-hero-trust">
                {trust.map((item, i) => (
                  <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
                    {i > 0 && <span className="cst-hero-trust-sep" style={{ marginRight: 16 }} aria-hidden="true" />}
                    <span className="cst-hero-trust-item">
                      <Icon name="check" size={14} />
                      {item}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* marginTop override pulls the stage up so it crests the fold */}
        <div className="hero-stage" style={{ marginTop: 32 }}>
          <div className="cst-hero-stage-wrap">
            <div className="cst-hero-stage-glow" aria-hidden="true" />
            <div className="cst-hero-stage-inner">
              <ScrollTilt>
                <HeroVisual lang={lang} reduce={reduce} />
              </ScrollTilt>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
