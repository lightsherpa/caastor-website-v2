/* Caastor v2 — Services page */
import { motion, useReducedMotion } from "motion/react";
import { Button, Card } from "../ds/components.jsx";
import { Reveal, Eyebrow } from "../components/shell.jsx";
import { FinalCTA } from "../components/FinalCTA.jsx";
import "./services-extra.css";

/* ──────────────────────────────────────────────────────────────────
   S-1 — one small animated, branded visual per discipline.
   Keyed by index (0 Brand · 1 Web/UI · 2 Social · 3 Graphic) with the
   service icon as a fallback key. Pure inline SVG/CSS + framer `motion`,
   every animation guarded by useReducedMotion(). Theme vars only.
   ────────────────────────────────────────────────────────────────── */

const EASE = [0.22, 0.61, 0.36, 1];
const loop = (extra = {}) => ({ repeat: Infinity, ease: "easeInOut", ...extra });

/* 0 · Brand & identity — a mark assembling from rotating brand tokens. */
function BrandVisual({ reduce }) {
  const ringT = loop({ duration: 14, ease: "linear" });
  return (
    <svg viewBox="0 0 120 88" className="svc-svg" role="img" aria-hidden>
      <motion.g
        style={{ transformOrigin: "60px 44px" }}
        animate={reduce ? undefined : { rotate: 360 }}
        transition={reduce ? undefined : ringT}
      >
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const a = (i / 6) * Math.PI * 2;
          return (
            <circle
              key={i}
              cx={60 + Math.cos(a) * 30}
              cy={44 + Math.sin(a) * 22}
              r={i % 2 ? 3.4 : 2.2}
              fill={i % 2 ? "var(--brand)" : "var(--accent)"}
              opacity={i % 2 ? 0.9 : 0.6}
            />
          );
        })}
      </motion.g>
      <motion.path
        d="M60 28 L74 52 L46 52 Z"
        fill="none"
        stroke="var(--brand-strong)"
        strokeWidth="2.4"
        strokeLinejoin="round"
        animate={reduce ? undefined : { rotate: [0, 8, 0], scale: [1, 1.06, 1] }}
        transition={reduce ? undefined : loop({ duration: 6 })}
        style={{ transformOrigin: "60px 44px" }}
      />
      <motion.circle
        cx="60"
        cy="44"
        r="5"
        fill="var(--brand)"
        animate={reduce ? undefined : { scale: [1, 1.25, 1] }}
        transition={reduce ? undefined : loop({ duration: 3 })}
        style={{ transformOrigin: "60px 44px" }}
      />
    </svg>
  );
}

/* 1 · Web & UI/UX — a browser frame whose blocks lay themselves out. */
function WebVisual({ reduce }) {
  const bars = [
    { w: 54, c: "var(--brand)", d: 0 },
    { w: 34, c: "var(--bg-muted)", d: 0.25 },
    { w: 44, c: "var(--bg-muted)", d: 0.5 },
  ];
  return (
    <svg viewBox="0 0 120 88" className="svc-svg" role="img" aria-hidden>
      <rect x="14" y="14" width="92" height="60" rx="8" fill="var(--bg-app)" stroke="var(--border-default)" strokeWidth="1.6" />
      <line x1="14" y1="28" x2="106" y2="28" stroke="var(--border-default)" strokeWidth="1.4" />
      {[24, 30, 36].map((cx, i) => (
        <circle key={cx} cx={cx} cy="21" r="2" fill={i === 0 ? "var(--accent)" : "var(--text-quaternary)"} />
      ))}
      {bars.map((b, i) => (
        <motion.rect
          key={i}
          x="24"
          y={38 + i * 12}
          height="6"
          rx="3"
          fill={b.c}
          initial={reduce ? false : { width: 0, opacity: 0 }}
          animate={reduce ? { width: b.w } : { width: [0, b.w, b.w, 0], opacity: [0, 1, 1, 0] }}
          transition={reduce ? undefined : loop({ duration: 4.5, times: [0, 0.3, 0.8, 1], delay: b.d })}
        />
      ))}
      <motion.g
        animate={reduce ? undefined : { x: [0, 26, 26, 0], y: [0, 14, 14, 0] }}
        transition={reduce ? undefined : loop({ duration: 4.5, times: [0, 0.45, 0.75, 1] })}
      >
        <path d="M70 36 l0 13 l3.5 -3.5 l2.6 5 l2.4 -1.1 l-2.6 -5 l4.9 -0.2 Z" fill="var(--text-primary)" />
      </motion.g>
    </svg>
  );
}

/* 2 · Social & content — a feed card with a beating like + rising reach. */
function SocialVisual({ reduce }) {
  return (
    <svg viewBox="0 0 120 88" className="svc-svg" role="img" aria-hidden>
      <rect x="22" y="16" width="76" height="56" rx="9" fill="var(--bg-app)" stroke="var(--border-default)" strokeWidth="1.6" />
      <circle cx="34" cy="28" r="5" fill="var(--accent)" opacity="0.8" />
      <rect x="43" y="25" width="26" height="3.5" rx="1.75" fill="var(--text-quaternary)" />
      <rect x="43" y="31" width="16" height="3" rx="1.5" fill="var(--bg-muted)" />
      <rect x="30" y="40" width="60" height="16" rx="5" fill="var(--brand-soft)" />
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={i}
          cx="34"
          cy="64"
          r="3"
          fill="var(--brand)"
          animate={reduce ? undefined : { y: [0, -3, 0], opacity: [0.5, 1, 0.5] }}
          transition={reduce ? undefined : loop({ duration: 1.6, delay: i * 0.2 })}
          style={{ transform: `translateX(${i * 9}px)` }}
        />
      ))}
      <motion.path
        d="M82 60 c0 -3 4 -4 5 -1 c1 -3 5 -2 5 1 c0 3 -5 6 -5 6 s-5 -3 -5 -6 Z"
        fill="var(--accent)"
        animate={reduce ? undefined : { scale: [1, 1.3, 1] }}
        transition={reduce ? undefined : loop({ duration: 1.4 })}
        style={{ transformOrigin: "87px 63px" }}
      />
    </svg>
  );
}

/* 3 · Graphic & layout — grid columns + a chart bar that grows. */
function GraphicVisual({ reduce }) {
  const cols = [
    { x: 24, h: 22, c: "var(--bg-muted)", d: 0 },
    { x: 40, h: 34, c: "var(--brand)", d: 0.15 },
    { x: 56, h: 16, c: "var(--bg-muted)", d: 0.3 },
    { x: 72, h: 40, c: "var(--accent)", d: 0.45 },
    { x: 88, h: 26, c: "var(--bg-muted)", d: 0.6 },
  ];
  return (
    <svg viewBox="0 0 120 88" className="svc-svg" role="img" aria-hidden>
      <rect x="14" y="14" width="92" height="60" rx="8" fill="var(--bg-app)" stroke="var(--border-default)" strokeWidth="1.6" />
      {cols.map((c, i) => (
        <motion.rect
          key={i}
          x={c.x}
          width="10"
          rx="3"
          fill={c.c}
          style={{ transformOrigin: `${c.x + 5}px 62px` }}
          animate={reduce ? { y: 62 - c.h, height: c.h } : { y: [62, 62 - c.h, 62 - c.h], height: [0, c.h, c.h] }}
          transition={reduce ? undefined : loop({ duration: 3.6, times: [0, 0.4, 1], delay: c.d })}
        />
      ))}
      <line x1="20" y1="62" x2="100" y2="62" stroke="var(--border-default)" strokeWidth="1.6" />
      <motion.line
        x1="20"
        x2="100"
        stroke="var(--brand-strong)"
        strokeWidth="1.6"
        strokeDasharray="3 4"
        animate={reduce ? { y1: 40, y2: 40 } : { y1: [50, 34, 50], y2: [50, 34, 50] }}
        transition={reduce ? undefined : loop({ duration: 4 })}
      />
    </svg>
  );
}

const VISUALS = [BrandVisual, WebVisual, SocialVisual, GraphicVisual];
const ICON_TO_VISUAL = { star: BrandVisual, grid: WebVisual, message: SocialVisual, layers: GraphicVisual };

function ServiceVisual({ index, icon, accent }) {
  const reduce = useReducedMotion();
  const Visual = VISUALS[index] || ICON_TO_VISUAL[icon] || BrandVisual;
  return (
    <div className={"svc-stage" + (accent ? " svc-stage--accent" : "")}>
      <span className="svc-stage-glow" aria-hidden />
      <Visual reduce={reduce} />
    </div>
  );
}

export function ServicesPage({ t, navigate }) {
  const s = t.services;
  // No `lang` prop is passed to this page, so detect it from `t` for any
  // NEW visible labels below (bilingual EN/ES, hyphen rule respected).
  const isEs = t.nav?.services === "Servicios";
  const banner = isEs
    ? { lead: "Mira los planes y elige tu ritmo.", cta: "Ver precios" }
    : { lead: "See the plans and pick your pace.", cta: "View pricing" };

  return (
    <div className="page-enter">
      <section className="hero surface-canvas">
        <div className="hero-blobs">
          <span className="blob a" />
          <span className="blob b" />
        </div>
        <div className="container" style={{ position: "relative", zIndex: 1, padding: "84px 28px 56px", textAlign: "center" }}>
          <Reveal>
            <div style={{ marginBottom: 18 }}>
              <Eyebrow>{s.eyebrow}</Eyebrow>
            </div>
          </Reveal>
          <Reveal delay={60}>
            <h1 className="t-display-md balance" style={{ marginBottom: 18, maxWidth: 820, margin: "0 auto 18px" }}>
              {s.h1}
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="pretty" style={{ fontSize: 19, lineHeight: "30px", color: "var(--text-secondary)", maxWidth: 640, margin: "0 auto" }}>
              {s.sub}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section surface-canvas" style={{ paddingTop: 24 }}>
        <div className="container">
          <div className="grid grid-2">
            {s.items.map((it, i) => (
              <Reveal key={i} delay={(i % 2) * 90}>
                <Card padded={32} hover style={{ height: "100%" }}>
                  <div className="feature-card">
                    {/* S-1 — animated, branded visual per discipline */}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
                      <ServiceVisual index={i} icon={it.icon} accent={i % 2 === 1} />
                      <span className="t-mono" style={{ fontSize: 13, color: "var(--text-quaternary)" }}>
                        0{i + 1}
                      </span>
                    </div>
                    <h3 className="t-h2" style={{ marginTop: 14, fontSize: 23 }}>
                      {it.title}
                    </h3>
                    {/* S-2 — body rewritten problem→solution in content; render as-is */}
                    <p className="pretty" style={{ fontSize: 16, lineHeight: "25px", color: "var(--text-secondary)" }}>
                      {it.body}
                    </p>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>

          {/* S-3 — mid-page banner is now DISTINCT from the booking CTA:
              it routes to pricing instead of duplicating "book a demo". */}
          <Reveal delay={120}>
            <div style={{ marginTop: 56, display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between", padding: "32px 36px", background: "var(--bg-app)", borderRadius: 18, border: "1px solid var(--border-default)" }}>
              <p className="t-h3 balance" style={{ maxWidth: 560 }}>
                {banner.lead}
              </p>
              <Button variant="outline" size="lg" iconEnd="arrowRight" onClick={() => navigate("pricing")}>
                {banner.cta}
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <FinalCTA t={t} navigate={navigate} />
    </div>
  );
}
