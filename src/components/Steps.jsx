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

const ROTATE = 4400; // ms per step — matches the CSS progress animation

const EASE = [0.22, 0.61, 0.36, 1];

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

  const fill = steps.length > 1 ? active / (steps.length - 1) : 1;

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
          {/* connector rail */}
          <div className="steps-rail">
            <div className="steps-rail-line">
              <motion.span
                className="steps-rail-fill"
                animate={{ scaleX: fill }}
                transition={{ duration: 0.6, ease: EASE }}
              />
            </div>
            {steps.map((s, i) => (
              <button
                key={i}
                className={"steps-node" + (i <= active ? " reached" : "") + (i === active ? " on" : "")}
                onClick={() => setActive(i)}
                aria-current={i === active}
              >
                <span className="steps-node-dot">{i < active ? <Icon name="check" size={15} /> : s.n}</span>
                <span className="steps-node-label">{s.title}</span>
              </button>
            ))}
          </div>

          {/* focus panel */}
          <div className="steps-panel">
            <div className="steps-copy">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  <span className="steps-step-n">{steps[active].n}</span>
                  <h3 className="t-h2 steps-step-title">{steps[active].title}</h3>
                  <p className="pretty steps-step-body">{steps[active].body}</p>
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
                  transition={{ duration: 0.5, ease: EASE }}
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
