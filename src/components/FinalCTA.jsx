/* Shared closing CTA band, reused across pages.
   Bold branded closing moment: dark base, warm brand glow that drifts up,
   subtle ambient motion (reduced-motion safe), premium buttons. */
import "./final-cta.css";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "../ds/components.jsx";
import { Reveal } from "./shell.jsx";
import { bookingProps } from "../lib/booking.js";
import { SPRING } from "../motion/tokens.js";

export function FinalCTA({ t, navigate, primaryPilot = true }) {
  const f = t.home.finalCta;
  const reduce = useReducedMotion();

  // Exaggeration: the mascot arrives with a little bouncy overshoot, then a
  // tiny settle wobble before handing off to the idle CSS float. Guarded so
  // reduced-motion just shows it in place. Wrapping in motion.div keeps the
  // entrance transform off the <img> itself (idle float stays on the image).
  const mascotEntrance = reduce
    ? {}
    : {
        initial: { scale: 0.6, y: 24, opacity: 0 },
        whileInView: { scale: 1, y: 0, opacity: 1 },
        viewport: { once: true, amount: 0.6 },
        transition: SPRING.bouncy,
      };

  return (
    <section className={`section fcta${reduce ? " fcta--still" : ""}`}>
      {/* Warm brand glow that drifts upward on hover. */}
      <div className="fcta__glow" aria-hidden="true">
        <div className="fcta__glow-halo" />
        <div className="fcta__glow-core" />
      </div>

      <div className="container container-narrow fcta__inner">
        <Reveal>
          <motion.div className="fcta__mascot-wrap" {...mascotEntrance}>
            <img src="/assets/mascot-yellow.png" alt="" className="fcta__mascot" />
          </motion.div>

          <h2 className="t-display-md balance fcta__title">
            <span className="fcta__accent">{f.header}</span>
          </h2>

          <p className="pretty fcta__body">{f.body}</p>

          <div className="fcta__actions">
            <Button variant="primary" size="lg" iconEnd="arrowRight" {...bookingProps}>
              {f.ctaPrimary}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="fcta__secondary"
              onClick={() => navigate(primaryPilot ? "pricing" : "contact")}
            >
              {f.ctaSecondary}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
