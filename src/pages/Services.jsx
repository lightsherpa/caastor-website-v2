/* Caastor v2 — Services page */
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Button, Card } from "../ds/components.jsx";
import { Reveal, Eyebrow } from "../components/shell.jsx";
import { FinalCTA } from "../components/FinalCTA.jsx";
import { EASE, SPRING } from "../motion/tokens.js";
import "./services-extra.css";

/* ──────────────────────────────────────────────────────────────────
   S-1 — one small animated, branded visual per discipline.
   Keyed by index (0 Brand · 1 Web/UI · 2 Social · 3 Graphic) with the
   service icon as a fallback key. Pure inline SVG/CSS + framer `motion`,
   every animation guarded by useReducedMotion(). Theme vars only.
   ────────────────────────────────────────────────────────────────── */

const loop = (extra = {}) => ({ repeat: Infinity, ease: "easeInOut", ...extra });

/* Follow-through stagger for a card's internals: eyebrow -> visual ->
   title -> body. Children settle with a soft spring overshoot rather than
   stopping dead. Reduced-motion swaps to a no-op (handled at call site). */
const cardStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};
const cardChild = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: SPRING.soft },
};

/* 0 · Brand & identity — a mark assembling from rotating brand tokens. */
function BrandVisual({ reduce, hovered }) {
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
        animate={reduce ? undefined : { scale: hovered ? 1.4 : [1, 1.25, 1] }}
        transition={reduce ? undefined : hovered ? SPRING.bouncy : loop({ duration: 3 })}
        style={{ transformOrigin: "60px 44px" }}
      />
    </svg>
  );
}

/* 1 · Web & UI/UX — a browser frame whose blocks lay themselves out. */
function WebVisual({ reduce, hovered }) {
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
        <motion.circle
          key={cx}
          cx={cx}
          cy="21"
          r="2"
          fill={i === 0 ? "var(--accent)" : "var(--text-quaternary)"}
          animate={reduce ? undefined : { scale: hovered && i === 0 ? 1.5 : 1 }}
          transition={reduce ? undefined : SPRING.bouncy}
          style={{ transformOrigin: `${cx}px 21px` }}
        />
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
function SocialVisual({ reduce, hovered }) {
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
        animate={reduce ? undefined : { scale: hovered ? 1.55 : [1, 1.3, 1] }}
        transition={reduce ? undefined : hovered ? SPRING.bouncy : loop({ duration: 1.4 })}
        style={{ transformOrigin: "87px 63px" }}
      />
    </svg>
  );
}

/* 3 · Graphic & layout — grid columns + a chart bar that grows. */
function GraphicVisual({ reduce, hovered }) {
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
        animate={
          reduce
            ? { y1: 40, y2: 40 }
            : hovered
            ? { y1: 28, y2: 28 }
            : { y1: [50, 34, 50], y2: [50, 34, 50] }
        }
        transition={reduce ? undefined : hovered ? SPRING.snappy : loop({ duration: 4 })}
      />
    </svg>
  );
}

const VISUALS = [BrandVisual, WebVisual, SocialVisual, GraphicVisual];
const ICON_TO_VISUAL = { star: BrandVisual, grid: WebVisual, message: SocialVisual, layers: GraphicVisual };

function ServiceVisual({ index, icon, reduce, hovered }) {
  const Visual = VISUALS[index] || ICON_TO_VISUAL[icon] || BrandVisual;
  return <Visual reduce={reduce} hovered={hovered} />;
}

/* One service card. Holds its own hover state so the animated visual can
   react (secondary action) and the media panel lifts with anticipation.
   Internals reveal in a follow-through cascade (tag -> visual -> title ->
   body) via the stagger variants. All motion is reduced-motion guarded. */
function ServiceCard({ it, index, accent, reduce, labels }) {
  const [hovered, setHovered] = useState(false);
  const { problem, solution } = splitBody(it.body);

  // Reduced motion: render plain children with no variants/stagger.
  const stagger = reduce ? undefined : cardStagger;
  const child = reduce ? undefined : cardChild;
  const mv = reduce ? {} : { variants: stagger, initial: "hidden", whileInView: "show", viewport: { once: true, margin: "0px 0px -12% 0px" } };
  const cv = reduce ? {} : { variants: child };

  return (
    <Card padded={28} hover className={"svc-card" + (accent ? " svc-card--accent" : "")} style={{ height: "100%" }}>
      <motion.div
        {...mv}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ display: "flex", flexDirection: "column", height: "100%" }}
      >
        {/* S-1 — animated, branded visual per discipline. On hover the
            panel lifts (anticipation) and a CHILD in the figure reacts. */}
        <motion.div
          className="svc-media"
          {...cv}
          animate={reduce ? undefined : { y: hovered ? -4 : 0 }}
          transition={reduce ? undefined : SPRING.soft}
        >
          <span className="svc-media-grid" aria-hidden />
          <span className="svc-num">0{index + 1}</span>
          <ServiceVisual index={index} icon={it.icon} reduce={reduce} hovered={hovered} />
          <span className="svc-media-sheen" aria-hidden />
        </motion.div>

        <motion.span className="svc-tag" {...cv}>
          <span className="svc-tag-dot" aria-hidden />
          {it.tag || it.title}
        </motion.span>

        <motion.h3 className="t-h2 balance svc-title" {...cv}>
          {it.title}
        </motion.h3>

        {/* S-2 — render the bound body as a problem → solution split;
            the full `it.body` data is the source. */}
        <motion.div className="svc-body" {...cv}>
          {problem && (
            <div className="svc-line svc-line--problem">
              <span className="svc-line-mark svc-line-mark--problem" aria-hidden>
                ✕
              </span>
              <span className="svc-connector" aria-hidden />
              <p className="svc-line-text">
                <span className="t-mono" style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-quaternary)", display: "block", marginBottom: 3 }}>
                  {labels.problem}
                </span>
                {problem}
              </p>
            </div>
          )}
          <div className="svc-line svc-line--solution">
            <span className="svc-line-mark svc-line-mark--solution" aria-hidden>
              ✓
            </span>
            <p className="svc-line-text">
              <span className="t-mono" style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-quaternary)", display: "block", marginBottom: 3 }}>
                {labels.solution}
              </span>
              {solution}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </Card>
  );
}

/* Split the one-sentence body into a problem (first sentence) and the
   solution (the rest) without mutating the bound `it.body` data. Falls
   back gracefully when there is no clean sentence break. */
function splitBody(body) {
  if (!body) return { problem: "", solution: "" };
  const m = body.match(/^(.*?[.!?])\s+(.*)$/s);
  if (m && m[2]) return { problem: m[1].trim(), solution: m[2].trim() };
  return { problem: "", solution: body.trim() };
}

export function ServicesPage({ t, navigate }) {
  const s = t.services;
  const reduce = useReducedMotion();
  // No `lang` prop is passed to this page, so detect it from `t` for any
  // NEW visible labels below (bilingual EN/ES, hyphen rule respected).
  const isEs = t.nav?.services === "Servicios";
  const banner = isEs
    ? { lead: "Mira los planes y elige tu ritmo.", cta: "Ver precios" }
    : { lead: "See the plans and pick your pace.", cta: "View pricing" };
  const labels = isEs
    ? { problem: "El problema", solution: "Lo que hacemos" }
    : { problem: "The problem", solution: "What we do" };
  const stats = isEs
    ? [
        { k: "24 a 48 h", l: "entrega" },
        { k: "Diseñadores senior", l: "en cada proyecto" },
        { k: "Una suscripción", l: "todo el diseño" },
      ]
    : [
        { k: "24 to 48 h", l: "turnaround" },
        { k: "Senior designers", l: "on every brief" },
        { k: "One subscription", l: "all your design" },
      ];

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
            <h1 className="t-display-md balance" style={{ maxWidth: 820, margin: "0 auto 18px" }}>
              {s.h1}
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="pretty" style={{ fontSize: 19, lineHeight: "30px", color: "var(--text-secondary)", maxWidth: 640, margin: "0 auto" }}>
              {s.sub}
            </p>
          </Reveal>
          <Reveal delay={180}>
            <div className="svc-hero-stats">
              {stats.map((st, i) => (
                <span key={i} className="svc-stat">
                  <span className="svc-stat-dot" aria-hidden />
                  <span className="svc-stat-k">{st.k}</span>
                  <span className="svc-stat-l">{st.l}</span>
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section surface-canvas" style={{ paddingTop: 24 }}>
        <div className="container">
          <div className="grid grid-2">
            {s.items.map((it, i) => {
              const accent = i % 2 === 1;
              return (
                <Reveal key={i} delay={(i % 2) * 90}>
                  <ServiceCard it={it} index={i} accent={accent} reduce={reduce} labels={labels} />
                </Reveal>
              );
            })}
          </div>

          {/* S-3 — mid-page banner is DISTINCT from the booking CTA:
              it routes to pricing instead of duplicating "book a demo". */}
          <Reveal delay={120}>
            <div className="svc-banner">
              <span className="svc-banner-glow" aria-hidden />
              <p className="t-h3 balance" style={{ maxWidth: 560, position: "relative" }}>
                {banner.lead}
              </p>
              <Button variant="primary" size="lg" iconEnd="arrowRight" onClick={() => navigate("pricing")}>
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
