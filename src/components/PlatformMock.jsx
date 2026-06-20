/* ──────────────────────────────────────────────────────────────────
   Caastor v2 — PlatformMock
   A crisp, hand-built representation of the Caastor "Projects" app:
   vector-sharp at any resolution (no bitmap), believable content, no
   "test" strings. Stands in for a real screenshot and is reusable
   across the hero and the steps section.
   PLACEHOLDER: project names/metrics are realistic but illustrative —
   replace with a real exported screenshot before launch if preferred.
   ────────────────────────────────────────────────────────────────── */
import { motion, useReducedMotion } from "motion/react";
import { Icon } from "../ds/components.jsx";

const NAV = [
  { icon: "grid", label: "Projects", on: true },
  { icon: "inbox", label: "Briefs" },
  { icon: "layers", label: "Brand Library" },
  { icon: "users", label: "Specialists" },
];

function projects(es) {
  return [
    { title: es ? "Landing de lanzamiento Q3" : "Q3 launch landing page", tone: "brand", status: es ? "En revisión" : "In review", st: "review", pct: 82 },
    { title: es ? "Set de Instagram · junio" : "Instagram set · June", tone: "accent", status: es ? "En curso" : "In progress", st: "progress", pct: 64 },
    { title: es ? "Deck para inversores" : "Investor pitch deck", tone: "indigo", status: es ? "Entregado" : "Delivered", st: "done", pct: 100 },
    { title: es ? "Refresco de marca v2" : "Brand refresh v2", tone: "mint", status: es ? "En cola" : "Queued", st: "queued", pct: 12 },
  ];
}

const TONE = {
  brand: "linear-gradient(135deg, var(--brand), var(--brand-strong))",
  accent: "linear-gradient(135deg, #FF8A3D, #F5B400)",
  indigo: "linear-gradient(135deg, var(--accent), #6D5BD6)",
  mint: "linear-gradient(135deg, #3DD68C, #16A34A)",
};

const STATUS = {
  review: { fg: "#8a5e00", bg: "var(--status-warning-soft)" }, // darker for AA on tint
  progress: { fg: "var(--accent-strong)", bg: "var(--accent-soft)" },
  done: { fg: "var(--status-success)", bg: "var(--status-success-soft)" },
  queued: { fg: "var(--text-tertiary)", bg: "var(--bg-muted)" },
};

export function PlatformMock({ lang = "en", animate = true }) {
  const es = lang === "es";
  const reduce = useReducedMotion();
  const live = animate && !reduce;
  const cards = projects(es);

  return (
    <div className="pm">
      {/* sidebar */}
      <aside className="pm-side">
        <div className="pm-brand">
          <span className="pm-brand-mark">C</span>
          <span className="pm-brand-name">Caastor</span>
        </div>
        <div className="pm-nav">
          {NAV.map((n) => (
            <div key={n.label} className={"pm-nav-item" + (n.on ? " on" : "")}>
              <Icon name={n.icon} size={15} />
              <span>{n.label}</span>
            </div>
          ))}
        </div>
        <div className="pm-credits">
          <div className="pm-credits-row">
            <span>{es ? "Créditos" : "Credits"}</span>
            <span className="pm-credits-v">820</span>
          </div>
          <div className="pm-credits-bar"><span style={{ width: "68%" }} /></div>
        </div>
      </aside>

      {/* main */}
      <div className="pm-main">
        <div className="pm-top">
          <div className="pm-title">{es ? "Proyectos" : "Projects"}</div>
          <div className="pm-search"><Icon name="search" size={13} /><span>{es ? "Buscar" : "Search"}</span></div>
          <div className="pm-new">{es ? "Nueva petición" : "New request"}<Icon name="plus" size={13} /></div>
        </div>

        <div className="pm-filters">
          {[es ? "Todos" : "All", es ? "En curso" : "In progress", es ? "En revisión" : "In review", es ? "Entregado" : "Delivered"].map((f, i) => (
            <span key={f} className={"pm-filter" + (i === 0 ? " on" : "")}>{f}</span>
          ))}
        </div>

        <div className="pm-grid">
          {cards.map((c, i) => {
            const s = STATUS[c.st];
            const Row = live ? motion.div : "div";
            return (
              <Row
                key={i}
                className="pm-card"
                {...(live
                  ? {
                      initial: { opacity: 0, y: 12 },
                      whileInView: { opacity: 1, y: 0 },
                      viewport: { once: true },
                      transition: { delay: 0.15 + i * 0.08, duration: 0.5, ease: [0.22, 0.61, 0.36, 1] },
                    }
                  : {})}
              >
                <div className="pm-thumb" style={{ background: TONE[c.tone] }}>
                  <span className="pm-thumb-tag">48h</span>
                </div>
                <div className="pm-card-body">
                  <div className="pm-card-title">{c.title}</div>
                  <div className="pm-card-meta">
                    <span className="pm-badge" style={{ color: s.fg, background: s.bg }}>{c.status}</span>
                    <span className="pm-avs">
                      <i /><i /><i className="more">+2</i>
                    </span>
                  </div>
                  <div className="pm-prog"><span style={{ width: c.pct + "%", background: c.st === "done" ? "var(--status-success)" : "var(--brand)" }} /></div>
                </div>
              </Row>
            );
          })}
        </div>
      </div>
    </div>
  );
}
