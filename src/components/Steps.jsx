/* ──────────────────────────────────────────────────────────────────
   Caastor v2 — "Steps to success" connected auto-stepper.
   A drawing connector rail with numbered nodes; the active step's copy
   + a product mock cross-fade/slide in. Auto-advances, pauses on hover,
   click any node to jump. Reduced-motion → static 3-up.
   ────────────────────────────────────────────────────────────────── */
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion, useInView } from "motion/react";
import { Icon } from "../ds/components.jsx";
import { Reveal, SectionHead } from "./shell.jsx";
import { EASE, DUR, SPRING } from "../motion/tokens.js";

const ROTATE = 4400; // ms per step — matches the CSS progress animation

/* Follow-through child: rises + settles on a soft spring (overshoots, then
   eases home) so the cascade feels alive instead of snapping into place. */
const copyChild = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: SPRING.soft },
  exit: { opacity: 0, y: -10, transition: { duration: DUR.fast, ease: EASE.out } },
};

/* ── Per-step media: a real platform screenshot in a browser frame,
   with a live floating annotation that reinforces the step.
   NOTE: brief/review use stand-in shots until the real ones land at
   /assets/platform/step-brief.png and /assets/platform/step-review.png. ── */
function browserFrame(src, url, alt) {
  return (
    <div className="browser-frame step-frame" style={{ boxShadow: "var(--shadow-xl)" }}>
      <div className="browser-bar">
        <span className="browser-dots">
          <span style={{ background: "#FF5F57" }} />
          <span style={{ background: "#FEBC2E" }} />
          <span style={{ background: "#28C840" }} />
        </span>
        <div className="browser-url">{url}</div>
        <span style={{ width: 52 }} />
      </div>
      <img className="browser-shot" src={src} alt={alt} loading="lazy" />
    </div>
  );
}

function StepShot({ active, lang }) {
  const es = lang === "es";
  if (active === 0) {
    return (
      <div className="step-shot">
        {browserFrame("/assets/platform/step-brief.png", "app.caastor.co/brief", "Caastor brief")}
        <div className="step-anno step-anno--br">
          <span className="step-anno-ic ok"><Icon name="check" size={14} /></span>
          <div>
            <div className="step-anno-t">{es ? "Brief recibido" : "Brief received"}</div>
            <div className="step-anno-s">{es ? "en cola · con seguimiento" : "queued · tracked"}</div>
          </div>
        </div>
      </div>
    );
  }
  if (active === 1) {
    return (
      <div className="step-shot">
        {browserFrame("/assets/platform/step-design.png", "app.caastor.co/canvas", "Caastor canvas")}
        <motion.div
          className="step-anno step-anno--cursor"
          animate={{ x: [0, 18, -6, 0], y: [0, 14, 4, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Icon name="arrowUp" size={12} style={{ transform: "rotate(-35deg)" }} />
          <span>Sofia · {es ? "diseñando" : "designing"}</span>
        </motion.div>
      </div>
    );
  }
  return (
    <div className="step-shot">
      {browserFrame("/assets/platform/step-review.png", "app.caastor.co/review", "Caastor review")}
      <div className="step-anno step-anno--comment">{es ? "¡Aclara este árbol!" : "Make this tree lighter!"}</div>
      <div className="step-anno step-anno--approve">
        <Icon name="check" size={13} />
        {es ? "Aprobado" : "Approved"}
      </div>
    </div>
  );
}

export function StepsSection({ t, lang }) {
  const h = t.home.how;
  const steps = h.steps;
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const wrapRef = useRef(null);
  const inView = useInView(wrapRef, { margin: "0px 0px -20% 0px" });

  useEffect(() => {
    if (reduce || paused || !inView) return;
    const id = setInterval(() => setActive((i) => (i + 1) % steps.length), ROTATE);
    return () => clearInterval(id);
  }, [reduce, paused, inView, steps.length]);

  /* Reduced-motion / no-JS-motion: keep the honest static 3-up. */
  if (reduce) {
    return (
      <section id="how" className="section surface-app hairline-top">
        <div className="container">
          <SectionHead eyebrow={h.eyebrow} title={h.header} align="center" max={760} />
          <div className="grid grid-3" style={{ marginTop: 48 }}>
            {steps.map((s, i) => (
              <div key={i} className="feature-card">
                <span className="step-num">{s.n}</span>
                <h3 className="t-h3">{s.title}</h3>
                <p className="pretty" style={{ fontSize: 15, lineHeight: "24px", color: "var(--text-secondary)" }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="how" className="section surface-app hairline-top">
      <div className="container">
        <Reveal>
          <SectionHead eyebrow={h.eyebrow} title={h.header} align="center" max={760} />
        </Reveal>

        <div
          ref={wrapRef}
          className="steps"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* step pills — completed show a check, current is branded */}
          <div className="steps-pills">
            {steps.map((s, i) => (
              <button
                key={i}
                className={"steps-pill" + (i < active ? " is-done" : "") + (i === active ? " on" : "")}
                onClick={() => setActive(i)}
                aria-current={i === active}
              >
                {/* SECONDARY reaction: the dot of the freshly-activated pill
                   gives a quick spring pop (anticipation dip -> overshoot). */}
                <motion.span
                  className="steps-pill-dot"
                  animate={i === active ? { scale: [0.86, 1.18, 1] } : { scale: 1 }}
                  transition={i === active ? SPRING.bouncy : { duration: DUR.fast, ease: EASE.out }}
                >
                  {i < active ? <Icon name="check" size={13} /> : i + 1}
                </motion.span>
                <span className="steps-pill-label">{s.title}</span>
              </button>
            ))}
          </div>

          {/* focus panel */}
          <div className="steps-panel">
            <div className="steps-copy">
              {/* Ghost numeral — SECONDARY reaction: on each activation it
                 anticipates (dips) then springs up with a touch of overshoot. */}
              <motion.span
                key={"ghost-" + active}
                className="steps-ghost"
                aria-hidden="true"
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: [0.92, 0.97, 1], opacity: [0, 0.4, 1] }}
                transition={{ duration: DUR.slow, ease: EASE.emphasized, times: [0, 0.35, 1] }}
              >
                {steps[active].n}
              </motion.span>
              <AnimatePresence mode="wait">
                {/* Follow-through: number -> title -> body cascade in, each
                   settling on a soft spring rather than stopping dead. */}
                <motion.div
                  key={active}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  variants={{
                    hidden: {},
                    show: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
                    exit: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
                  }}
                >
                  <motion.span className="steps-step-n" variants={copyChild}>
                    {lang === "es" ? "Paso" : "Step"} {steps[active].n}
                  </motion.span>
                  <motion.h3 className="t-h2 steps-step-title" variants={copyChild}>
                    {steps[active].title}
                  </motion.h3>
                  <motion.p className="pretty steps-step-body" variants={copyChild}>
                    {steps[active].body}
                  </motion.p>
                </motion.div>
              </AnimatePresence>
              <div className="steps-progress">
                <span key={active} className="steps-progress-fill" />
              </div>
            </div>

            <div className="steps-stage">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  className="steps-mock-wrap"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -22 }}
                  transition={{ duration: 0.5, ease: EASE.out }}
                >
                  <StepShot active={active} lang={lang} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
