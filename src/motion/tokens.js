/* ──────────────────────────────────────────────────────────────────
   Caastor v2 — shared motion tokens. One vocabulary for eases, durations,
   springs, and gesture presets so every component animates the same way.
   EASE.out matches the long-standing macOS ease-out used across the site.
   ────────────────────────────────────────────────────────────────── */

export const EASE = {
  out: [0.22, 0.61, 0.36, 1], // macOS-standard ease-out (the site default)
  inOut: [0.42, 0, 0.58, 1],
  emphasized: [0.16, 1, 0.3, 1], // strong slow-out with a gentle overshoot tail
};

export const DUR = { fast: 0.15, base: 0.3, slow: 0.6 };

export const SPRING = {
  soft: { type: "spring", stiffness: 140, damping: 20, mass: 0.6 },
  snappy: { type: "spring", stiffness: 320, damping: 24, mass: 0.6 },
  bouncy: { type: "spring", stiffness: 340, damping: 12, mass: 0.7 }, // personality overshoot
};

/* Gesture presets — squash & stretch + anticipation for interactive bits.
   Pair tapSquash (whileTap) with a spring release so it stretches back. */
export const GESTURE = {
  hoverPop: { scale: 1.03 },
  tapSquash: { scaleX: 1.05, scaleY: 0.92 }, // pressed: wider + shorter
};
