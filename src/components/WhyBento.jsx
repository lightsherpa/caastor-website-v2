/* ──────────────────────────────────────────────────────────────────
   Caastor v2 — WhyBento · "The system most teams don't have"
   Bold bento: a tall Quality hero (cost-vs-in-house bars + senior team),
   a Friction "merge to one platform" visual, and a wide Speed cell with
   turnaround bars + a 48h callout. All visuals are inline SVG/CSS.
   ────────────────────────────────────────────────────────────────── */
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Reveal, SectionHead } from "./shell.jsx";
import { Icon } from "../ds/components.jsx";
import { EASE, DUR, SPRING } from "../motion/tokens.js";
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

/* Follow-through / overlapping: each cell's children (visual -> heading ->
   body) trail in and settle on view. Guarded — under reduced motion the
   wrapper renders inert and children appear immediately. */
function WbStagger({ reduce, children, className }) {
  if (reduce) return <div className={className} style={{ display: "contents" }}>{children}</div>;
  return (
    <motion.div
      className={className}
      style={{ display: "contents" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.04 } } }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
    >
      {children}
    </motion.div>
  );
}

/* A single staggered child: rises + de-blurs and overshoots gently to settle. */
const WB_ITEM = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: DUR.slow, ease: EASE.emphasized } },
};
function WbItem({ reduce, children, className }) {
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} variants={WB_ITEM}>
      {children}
    </motion.div>
  );
}

/* Hover hooks shared by every cell. The handlers live on a display:contents
   group inside the Reveal (events bubble up from the whole cell), so the
   Reveal entrance is untouched. Under reduced motion, hover is inert. */
function useHover(reduce) {
  const [hovered, setHovered] = useState(false);
  if (reduce) return { hovered: false, bind: {} };
  return {
    hovered,
    bind: { onMouseEnter: () => setHovered(true), onMouseLeave: () => setHovered(false) },
  };
}

/* ── QUALITY ──────────────────────────────────────────────────────── */
function QualityCell({ h, es, reduce, glow, swatches, team }) {
  const { hovered, bind } = useHover(reduce);
  return (
    <Reveal className="wb-cell wb-cell--quality" delay={0} {...glow}>
      <WbStagger reduce={reduce}>
        <motion.div style={{ display: "contents" }} {...bind}>
          <span className="wb-glow" aria-hidden="true" />
          <WbItem reduce={reduce}>
            <span className="wb-tag">
              <span className="wb-tag-ic"><Icon name="sparkles" size={14} /></span>
              {es ? "Calidad" : "Quality"}
            </span>
          </WbItem>

          <WbItem reduce={reduce} className="wb-viz">
            {/* brand swatch row — secondary action: swatches spring on hover */}
            <div className="wb-swatches" aria-hidden="true">
              {swatches.map((c, i) => (
                <motion.span
                  key={i}
                  style={{ background: c, transformOrigin: "bottom" }}
                  animate={reduce || !hovered ? { scaleY: 1, y: 0 } : { scaleY: [1, 0.78, 1.06, 1], y: [0, 2, -3, 0] }}
                  transition={reduce ? { duration: 0 } : { duration: 0.5, delay: i * 0.04, ease: EASE.emphasized }}
                >
                  <span
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      borderRadius: "inherit",
                      transformOrigin: "bottom",
                      animation: reduce ? "none" : `wbSwatch 0.5s ${0.1 + i * 0.07}s cubic-bezier(0.22,0.61,0.36,1) both`,
                    }}
                  />
                </motion.span>
              ))}
            </div>

            {/* senior team signal chips — secondary action: dots pulse */}
            <div className="wb-team">
              {team.map((label, i) => (
                <span key={i} className="wb-team-chip">
                  <motion.span
                    className="wb-dot"
                    animate={reduce || !hovered ? { scale: 1 } : { scale: [1, 1.55, 1] }}
                    transition={reduce ? { duration: 0 } : { duration: 0.45, delay: i * 0.06, ease: EASE.out }}
                  />
                  {label}
                </span>
              ))}
            </div>

            {/* cost vs in-house — secondary action: our bar re-grows + ticks */}
            <div
              className="wb-cost"
              role="img"
              aria-label={es ? "Coste de Caastor frente a un equipo interno" : "Caastor cost versus an in house team"}
            >
              <motion.span
                className="wb-cost-save"
                animate={reduce || !hovered ? { scale: 1, rotate: 0 } : { scale: [1, 1.12, 1], rotate: [0, -4, 0] }}
                transition={reduce ? { duration: 0 } : SPRING.bouncy}
              >
                {es ? "−90%" : "−90%"}
              </motion.span>
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
                <motion.div
                  className="wb-cost-bar is-us"
                  style={{ height: 50, transformOrigin: "bottom center", transform: reduce ? "none" : "scaleY(0)", animation: reduce ? "none" : "wbRise 0.7s 0.3s cubic-bezier(0.22,0.61,0.36,1) forwards" }}
                  animate={reduce || !hovered ? {} : { scaleY: [1, 0.86, 1.05, 1] }}
                  transition={reduce ? { duration: 0 } : { duration: 0.55, ease: EASE.emphasized }}
                />
                <span className="wb-cost-cap">Caastor</span>
              </div>
            </div>
          </WbItem>

          <WbItem reduce={reduce} className="wb-body">
            <h3 className="t-h3">{h.why.benefits[0].title}</h3>
            <p className="pretty">{h.why.benefits[0].body}</p>
          </WbItem>
        </motion.div>
      </WbStagger>
    </Reveal>
  );
}

/* ── FRICTION ─────────────────────────────────────────────────────── */
function FrictionCell({ h, es, reduce, glow, tools }) {
  const { hovered, bind } = useHover(reduce);
  return (
    <Reveal className="wb-cell" delay={90} {...glow}>
      <WbStagger reduce={reduce}>
        <motion.div style={{ display: "contents" }} {...bind}>
          <span className="wb-glow" aria-hidden="true" />
          <WbItem reduce={reduce}>
            <span className="wb-tag">
              <span className="wb-tag-ic"><Icon name="layers" size={14} /></span>
              {es ? "Sin fricción" : "Zero friction"}
            </span>
          </WbItem>

          <WbItem reduce={reduce} className="wb-viz">
            <div className="wb-merge">
              {/* secondary action: chips nudge toward the node on hover (arc via y) */}
              <div className="wb-merge-stack">
                {tools.map(([ic, label], i) => (
                  <motion.span
                    key={i}
                    className="wb-merge-chip"
                    style={{ animation: reduce ? "none" : `wbChipIn 0.5s ${0.1 + i * 0.1}s cubic-bezier(0.22,0.61,0.36,1) both` }}
                    animate={reduce || !hovered ? { x: 0, y: 0 } : { x: [0, 5, 0], y: [0, i === 0 ? -2 : i === 2 ? 2 : 0, 0] }}
                    transition={reduce ? { duration: 0 } : { duration: 0.5, delay: i * 0.05, ease: EASE.emphasized }}
                  >
                    <Icon name={ic} size={14} />
                    {label}
                  </motion.span>
                ))}
              </div>

              {/* connector wires: three inputs converge to one node */}
              <svg className="wb-merge-wires" viewBox="0 0 100 96" preserveAspectRatio="none" aria-hidden="true">
                <path className="wb-merge-wire is-live" d="M0 16 C 55 16, 55 48, 100 48" />
                <path className="wb-merge-wire" d="M0 48 L 100 48" />
                <path className="wb-merge-wire is-live" d="M0 80 C 55 80, 55 48, 100 48" />
              </svg>

              <div className="wb-merge-one">
                {/* secondary action: the merge node pops on hover (and idle-pulses) */}
                <motion.span
                  className="wb-merge-mark"
                  style={{ animation: reduce ? "none" : "wbPulse 2.4s ease-in-out 0.6s infinite" }}
                  animate={reduce || !hovered ? { scale: 1 } : { scale: [1, 0.9, 1.08, 1] }}
                  transition={reduce ? { duration: 0 } : SPRING.bouncy}
                >
                  C
                </motion.span>
                <span className="wb-merge-one-lbl">{es ? "Una plataforma" : "One platform"}</span>
              </div>
            </div>
          </WbItem>

          <WbItem reduce={reduce} className="wb-body">
            <h3 className="t-h3">{h.why.benefits[1].title}</h3>
            <p className="pretty">{h.why.benefits[1].body}</p>
          </WbItem>
        </motion.div>
      </WbStagger>
    </Reveal>
  );
}

/* ── SPEED ────────────────────────────────────────────────────────── */
function SpeedCell({ h, es, reduce, glow, turn }) {
  const { hovered, bind } = useHover(reduce);
  return (
    <Reveal className="wb-cell wb-cell--speed" delay={150} {...glow}>
      <WbStagger reduce={reduce}>
        <motion.div style={{ display: "contents" }} {...bind}>
          <span className="wb-glow" aria-hidden="true" />
          <WbItem reduce={reduce}>
            <span className="wb-tag">
              <span className="wb-tag-ic"><Icon name="activity" size={14} /></span>
              {es ? "Velocidad" : "Speed"}
            </span>
          </WbItem>

          <WbItem reduce={reduce} className="wb-viz">
            <div className="wb-speed-row">
              <div className="wb-big">
                {/* secondary action: the 48h number ticks/pops on hover */}
                <motion.span
                  className="wb-big-num"
                  style={{ transformOrigin: "left center" }}
                  animate={reduce || !hovered ? { scale: 1 } : { scale: [1, 1.06, 1], y: [0, -2, 0] }}
                  transition={reduce ? { duration: 0 } : SPRING.bouncy}
                >
                  48<span className="wb-big-unit">h</span>
                </motion.span>
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
                      {/* secondary action: bars re-grow from the left on hover */}
                      <motion.span
                        className={"wb-turn-fill " + (r.slow ? "is-slow" : "is-fast")}
                        style={{
                          width: r.w,
                          transformOrigin: "left center",
                          transform: reduce ? "none" : "scaleX(0)",
                          animation: reduce ? "none" : `wbGrow 0.65s ${0.15 + i * 0.12}s cubic-bezier(0.22,0.61,0.36,1) forwards`,
                        }}
                        animate={reduce || !hovered ? {} : { scaleX: [1, 0.55, 1.02, 1] }}
                        transition={reduce ? { duration: 0 } : { duration: 0.6, delay: i * 0.07, ease: EASE.emphasized }}
                      />
                    </div>
                    <span className="wb-turn-val">{r.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </WbItem>

          <WbItem reduce={reduce} className="wb-body">
            <h3 className="t-h3">{h.why.benefits[2].title}</h3>
            <p className="pretty">{h.why.benefits[2].body}</p>
          </WbItem>
        </motion.div>
      </WbStagger>
    </Reveal>
  );
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
          <QualityCell h={h} es={es} reduce={reduce} glow={glow} swatches={swatches} team={team} />

          {/* ── FRICTION · merge many tools into one platform ──────── */}
          <FrictionCell h={h} es={es} reduce={reduce} glow={glow} tools={tools} />

          {/* ── SPEED · turnaround bars + 48h callout ──────────────── */}
          <SpeedCell h={h} es={es} reduce={reduce} glow={glow} turn={turn} />
        </div>
      </div>
    </section>
  );
}
