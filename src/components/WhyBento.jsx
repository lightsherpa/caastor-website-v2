/* ──────────────────────────────────────────────────────────────────
   Caastor v2 — WhyBento · "The system most teams don't have"
   Bold bento: a tall Quality hero (cost-vs-in-house bars + senior team),
   a Friction "merge to one platform" visual, and a wide Speed cell with
   turnaround bars + a 48h callout. All visuals are inline SVG/CSS.
   ────────────────────────────────────────────────────────────────── */
import { Reveal, SectionHead } from "./shell.jsx";
import { Icon } from "../ds/components.jsx";
import { useReducedMotion } from "motion/react";
import "./why-bento.css";

/* Shared pointer-glow handlers; no-op under reduced motion. */
function useGlow(reduce) {
  if (reduce) return {};
  return {
    onMouseMove: (e) => {
      const r = e.currentTarget.getBoundingClientRect();
      e.currentTarget.style.setProperty("--wb-x", `${e.clientX - r.left}px`);
      e.currentTarget.style.setProperty("--wb-y", `${e.clientY - r.top}px`);
    },
  };
}

export function WhyBento({ t, lang }) {
  const h = t.home;
  const reduce = useReducedMotion();
  const glow = useGlow(reduce);
  const es = lang === "es";

  const swatches = ["var(--brand)", "var(--brand-strong)", "var(--accent)", "#3DD68C", "#0B1B2F"];
  const team = es
    ? ["Senior", "Coherente", "Brand Library"]
    : ["Senior", "Consistent", "Brand Library"];

  const tools = [
    ["inbox", "Briefs"],
    ["message", es ? "Feedback" : "Feedback"],
    ["layers", es ? "Recursos" : "Assets"],
  ];

  const turn = [
    { name: es ? "Agencia" : "Agency", val: es ? "3 a 4 sem" : "3 to 4 wks", w: "100%", slow: true },
    { name: "Freelance", val: es ? "1 sem" : "1 wk", w: "60%", slow: true },
    { name: "Caastor", val: "48 h", w: "24%", slow: false },
  ];

  return (
    <section className="section surface-canvas">
      <div className="container">
        <Reveal>
          <SectionHead title={h.why.header} max={680} />
        </Reveal>

        <div className="wb-grid">
          {/* ── QUALITY · tall hero cell ───────────────────────────── */}
          <Reveal className="wb-cell wb-cell--quality" delay={0} {...glow}>
            <span className="wb-glow" aria-hidden="true" />
            <span className="wb-tag">
              <span className="wb-tag-ic"><Icon name="sparkles" size={14} /></span>
              {es ? "Calidad" : "Quality"}
            </span>

            <div className="wb-viz">
              {/* brand swatch row — the consistent palette */}
              <div className="wb-swatches" aria-hidden="true">
                {swatches.map((c, i) => (
                  <span
                    key={i}
                    style={{
                      background: c,
                      animation: reduce ? "none" : `wbSwatch 0.5s ${0.1 + i * 0.07}s cubic-bezier(0.22,0.61,0.36,1) both`,
                    }}
                  />
                ))}
              </div>

              {/* senior team signal chips */}
              <div className="wb-team">
                {team.map((label, i) => (
                  <span key={i} className="wb-team-chip">
                    <span className="wb-dot" />
                    {label}
                  </span>
                ))}
              </div>

              {/* cost vs in-house — the proof */}
              <div
                className="wb-cost"
                role="img"
                aria-label={es ? "Coste de Caastor frente a un equipo interno" : "Caastor cost versus an in house team"}
              >
                <span className="wb-cost-save">{es ? "−90%" : "−90%"}</span>
                <div className="wb-cost-col is-them">
                  <span className="wb-cost-amt">$12k+</span>
                  <div
                    className="wb-cost-bar is-them"
                    style={{ height: 132, transform: reduce ? "none" : "scaleY(0)", animation: reduce ? "none" : "wbRise 0.7s 0.15s cubic-bezier(0.22,0.61,0.36,1) forwards" }}
                  />
                  <span className="wb-cost-cap">{es ? "Equipo interno" : "In house team"}</span>
                </div>
                <div className="wb-cost-col is-us">
                  <span className="wb-cost-amt">{es ? "Desde 750 €" : "From $800"}</span>
                  <div
                    className="wb-cost-bar is-us"
                    style={{ height: 50, transform: reduce ? "none" : "scaleY(0)", animation: reduce ? "none" : "wbRise 0.7s 0.3s cubic-bezier(0.22,0.61,0.36,1) forwards" }}
                  />
                  <span className="wb-cost-cap">Caastor</span>
                </div>
              </div>
            </div>

            <div className="wb-body">
              <h3 className="t-h3">{h.why.benefits[0].title}</h3>
              <p className="pretty">{h.why.benefits[0].body}</p>
            </div>
          </Reveal>

          {/* ── FRICTION · merge many tools into one platform ──────── */}
          <Reveal className="wb-cell" delay={90} {...glow}>
            <span className="wb-glow" aria-hidden="true" />
            <span className="wb-tag">
              <span className="wb-tag-ic"><Icon name="layers" size={14} /></span>
              {es ? "Sin fricción" : "Zero friction"}
            </span>

            <div className="wb-viz">
              <div className="wb-merge">
                <div className="wb-merge-stack">
                  {tools.map(([ic, label], i) => (
                    <span
                      key={i}
                      className="wb-merge-chip"
                      style={{ animation: reduce ? "none" : `wbChipIn 0.5s ${0.1 + i * 0.1}s cubic-bezier(0.22,0.61,0.36,1) both` }}
                    >
                      <Icon name={ic} size={14} />
                      {label}
                    </span>
                  ))}
                </div>

                {/* connector wires: three inputs converge to one node */}
                <svg className="wb-merge-wires" viewBox="0 0 100 96" preserveAspectRatio="none" aria-hidden="true">
                  <path className="wb-merge-wire is-live" d="M0 16 C 55 16, 55 48, 100 48" />
                  <path className="wb-merge-wire" d="M0 48 L 100 48" />
                  <path className="wb-merge-wire is-live" d="M0 80 C 55 80, 55 48, 100 48" />
                </svg>

                <div className="wb-merge-one">
                  <span
                    className="wb-merge-mark"
                    style={{ animation: reduce ? "none" : "wbPulse 2.4s ease-in-out 0.6s infinite" }}
                  >
                    C
                  </span>
                  <span className="wb-merge-one-lbl">{es ? "Una plataforma" : "One platform"}</span>
                </div>
              </div>
            </div>

            <div className="wb-body">
              <h3 className="t-h3">{h.why.benefits[1].title}</h3>
              <p className="pretty">{h.why.benefits[1].body}</p>
            </div>
          </Reveal>

          {/* ── SPEED · turnaround bars + 48h callout ──────────────── */}
          <Reveal className="wb-cell wb-cell--speed" delay={150} {...glow}>
            <span className="wb-glow" aria-hidden="true" />
            <span className="wb-tag">
              <span className="wb-tag-ic"><Icon name="activity" size={14} /></span>
              {es ? "Velocidad" : "Speed"}
            </span>

            <div className="wb-viz">
              <div className="wb-speed-row">
                <div className="wb-big">
                  <span className="wb-big-num">
                    48<span className="wb-big-unit">h</span>
                  </span>
                  <span className="wb-big-cap">{es ? "Primeras propuestas" : "First drafts"}</span>
                </div>

                <div
                  className="wb-turn"
                  role="img"
                  aria-label={es ? "Tiempo de entrega frente a agencias y freelance" : "Turnaround versus agencies and freelancers"}
                >
                  {turn.map((r, i) => (
                    <div key={i} className={"wb-turn-row " + (r.slow ? "is-slow" : "is-fast")}>
                      <span className="wb-turn-name">{r.name}</span>
                      <div className="wb-turn-track">
                        <span
                          className={"wb-turn-fill " + (r.slow ? "is-slow" : "is-fast")}
                          style={{
                            width: r.w,
                            transform: reduce ? "none" : "scaleX(0)",
                            animation: reduce ? "none" : `wbGrow 0.65s ${0.15 + i * 0.12}s cubic-bezier(0.22,0.61,0.36,1) forwards`,
                          }}
                        />
                      </div>
                      <span className="wb-turn-val">{r.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="wb-body">
              <h3 className="t-h3">{h.why.benefits[2].title}</h3>
              <p className="pretty">{h.why.benefits[2].body}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
