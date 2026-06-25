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
import "./platform-mock.css";

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
  review: { fg: "var(--pm-warn-fg)", bg: "var(--status-warning-soft)" }, // AA on tint in light + dark
  progress: { fg: "var(--accent-strong)", bg: "var(--accent-soft)" },
  done: { fg: "var(--status-success)", bg: "var(--status-success-soft)" },
  queued: { fg: "var(--text-tertiary)", bg: "var(--bg-muted)" },
};

// Top stat strip — active requests / in review / delivered
function stats(es) {
  return [
    { v: "12", label: es ? "Peticiones activas" : "Active requests", delta: "+3", dot: "var(--accent)" },
    { v: "3", label: es ? "En revisión" : "In review", delta: es ? "Hoy" : "Today", dot: "var(--status-warning)" },
    { v: "47", label: es ? "Entregados" : "Delivered", delta: es ? "Este mes" : "This mo.", dot: "var(--status-success)" },
  ];
}

// Specialist avatars — initials + branded tints
const TEAM = [
  { i: "MR", bg: "linear-gradient(135deg, var(--brand), var(--brand-strong))" },
  { i: "JL", bg: "linear-gradient(135deg, var(--accent), #6D5BD6)" },
  { i: "AS", bg: "linear-gradient(135deg, #3DD68C, #16A34A)" },
];

// Activity / feed rail — recent status updates
function feed(es) {
  return [
    {
      ic: "check",
      fg: "var(--status-success)",
      bg: "var(--status-success-soft)",
      lead: es ? (<><b>Mariana</b> entregó un borrador</>) : (<><b>Mariana</b> shipped a draft</>),
      time: es ? "hace 2 min" : "2 min ago",
    },
    {
      ic: "message",
      fg: "var(--accent-strong)",
      bg: "var(--accent-soft)",
      lead: es ? (<><b>Comentario</b> en Deck Q3</>) : (<><b>Comment</b> on Q3 deck</>),
      time: es ? "hace 18 min" : "18 min ago",
    },
    {
      ic: "sparkles",
      fg: "var(--pm-warn-fg)",
      bg: "var(--status-warning-soft)",
      lead: es ? (<><b>Nueva petición</b> asignada</>) : (<><b>New request</b> assigned</>),
      time: es ? "hace 1 h" : "1 h ago",
    },
  ];
}

// Usage / turnaround mini chart — relative bar heights (%)
const CHART = [42, 58, 50, 74, 66, 88, 80];

export function PlatformMock({ lang = "en", animate = true }) {
  const es = lang === "es";
  const reduce = useReducedMotion();
  const live = animate && !reduce;
  const cards = projects(es);
  const statCards = stats(es);
  const feedRows = feed(es);

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

        {/* stat strip — active requests / in review / delivered */}
        <div className="pmx-stats">
          {statCards.map((s, i) => {
            const Cell = live ? motion.div : "div";
            return (
              <Cell
                key={i}
                className="pmx-stat"
                {...(live
                  ? {
                      initial: { opacity: 0, y: 8 },
                      whileInView: { opacity: 1, y: 0 },
                      viewport: { once: true },
                      transition: { delay: 0.1 + i * 0.06, duration: 0.45, ease: [0.22, 0.61, 0.36, 1] },
                    }
                  : {})}
              >
                <div className="pmx-stat-top">
                  <span className="pmx-stat-dot" style={{ background: s.dot }} />
                  <span className="pmx-stat-v">{s.v}</span>
                  <span className="pmx-stat-delta">{s.delta}</span>
                </div>
                <div className="pmx-stat-label">{s.label}</div>
              </Cell>
            );
          })}
        </div>

        <div className="pm-filters">
          {[es ? "Todos" : "All", es ? "En curso" : "In progress", es ? "En revisión" : "In review", es ? "Entregado" : "Delivered"].map((f, i) => (
            <span key={f} className={"pm-filter" + (i === 0 ? " on" : "")}>{f}</span>
          ))}
        </div>

        {/* project grid + right-hand activity rail */}
        <div className="pmx-body">
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

          {/* activity / feed rail */}
          <div className="pmx-rail">
            {/* specialists online */}
            <div className="pmx-panel">
              <div className="pmx-panel-head">
                <Icon name="users" size={13} />
                <span className="pmx-panel-title">{es ? "Especialistas" : "Specialists"}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span className="pmx-team">
                  {TEAM.map((m, i) => (
                    <i key={i} style={{ background: m.bg }}>{m.i}</i>
                  ))}
                  <i className="more">+5</i>
                </span>
                <span className="pmx-online">{es ? "En línea" : "Online"}</span>
              </div>
            </div>

            {/* recent activity feed */}
            <div className="pmx-panel">
              <div className="pmx-panel-head">
                <Icon name="activity" size={13} />
                <span className="pmx-panel-title">{es ? "Actividad" : "Activity"}</span>
                <span className="pmx-panel-meta">{es ? "En vivo" : "Live"}</span>
              </div>
              <div className="pmx-feed">
                {feedRows.map((r, i) => (
                  <div key={i} className="pmx-feed-row">
                    <span className="pmx-feed-ic" style={{ color: r.fg, background: r.bg }}>
                      <Icon name={r.ic} size={11} stroke={2} />
                    </span>
                    <span className="pmx-feed-txt">
                      <span className="pmx-feed-lead">{r.lead}</span>
                      <span className="pmx-feed-time">{r.time}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* usage / turnaround chart */}
            <div className="pmx-panel">
              <div className="pmx-panel-head">
                <Icon name="activity" size={13} />
                <span className="pmx-panel-title">{es ? "Tiempo de entrega" : "Turnaround"}</span>
                <span className="pmx-panel-meta">{es ? "7 d" : "7 d"}</span>
              </div>
              <div className="pmx-chart" aria-hidden="true">
                {CHART.map((h, i) => (
                  <span
                    key={i}
                    className={"pmx-bar" + (h >= 85 ? " peak" : "")}
                    style={{ height: h + "%" }}
                  />
                ))}
              </div>
              <div className="pmx-chart-cap">
                <span className="pmx-chart-num">41</span>
                <span className="pmx-chart-unit">{es ? "h promedio" : "h avg"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
