/* ──────────────────────────────────────────────────────────────────
   Caastor v2 — GsapEffects
   Scroll-scrubbed choreography built on GSAP ScrollTrigger (loaded from
   the same async chunk SmoothScroll already fetched). Scoped to the dark
   hero so it never fights the body's motion-based reveal system:
     • hero text rises + fades as the hero scrolls away
     • the dark background parallaxes slower than the content (depth)
     • any [data-parallax] element drifts on scroll (opt-in, plain DOM)
   Reverts cleanly on route change; disabled under reduced-motion.
   ────────────────────────────────────────────────────────────────── */
import { useEffect } from "react";
import { useReducedMotion } from "motion/react";

export function GsapEffects({ routeKey }) {
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    let cleaned = false;
    let ctx;
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([g, st]) => {
      if (cleaned) return;
      const gsap = g.default;
      const { ScrollTrigger } = st;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const hero = document.querySelector(".hero--dark");
        if (hero) {
          const stack = hero.querySelector(".hero-stack");
          const bg = hero.querySelectorAll(".hero-fallback, .hero-canvas");
          if (stack) {
            gsap.to(stack, {
              yPercent: -16,
              opacity: 0,
              ease: "none",
              scrollTrigger: { trigger: hero, start: "top top", end: "72% top", scrub: 0.5 },
            });
          }
          if (bg.length) {
            gsap.to(bg, {
              yPercent: 18,
              ease: "none",
              scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.5 },
            });
          }
        }

        // Opt-in depth parallax for any plain (non-motion) element.
        gsap.utils.toArray("[data-parallax]").forEach((el) => {
          const amt = parseFloat(el.getAttribute("data-parallax")) || 0.08;
          gsap.fromTo(
            el,
            { yPercent: amt * 60 },
            {
              yPercent: -amt * 60,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 },
            }
          );
        });
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    });

    return () => {
      cleaned = true;
      if (ctx) ctx.revert();
    };
  }, [reduce, routeKey]);

  return null;
}
