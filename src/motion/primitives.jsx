/* ──────────────────────────────────────────────────────────────────
   Caastor v2 — motion primitives built on `motion` + `lenis`.
   Refined, Apple-feel physics. Everything degrades gracefully when
   the user prefers reduced motion.
   ────────────────────────────────────────────────────────────────── */
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useSpring,
  useMotionValue,
  useTransform,
  useInView,
} from "motion/react";
import Lenis from "lenis";

const EASE = [0.22, 0.61, 0.36, 1]; // macOS-standard ease-out

/* ── SmoothScroll — Lenis inertial scrolling. GSAP + ScrollTrigger are
   loaded asynchronously (kept OUT of the critical bundle) and take over
   driving Lenis once ready; until then a plain rAF runs it, so smooth
   scroll is immediate and nothing blocks first paint. ── */
export function SmoothScroll() {
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    window.__lenis = lenis;

    let cleaned = false;
    let rafId = requestAnimationFrame(function loop(t) {
      lenis.raf(t);
      rafId = requestAnimationFrame(loop);
    });
    let teardown = () => cancelAnimationFrame(rafId);

    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([g, st]) => {
      if (cleaned) return;
      const gsap = g.default;
      const { ScrollTrigger } = st;
      gsap.registerPlugin(ScrollTrigger);
      window.__gsap = gsap;
      window.__ScrollTrigger = ScrollTrigger;
      cancelAnimationFrame(rafId); // hand off from plain rAF to gsap ticker
      lenis.on("scroll", ScrollTrigger.update);
      const onTick = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(onTick);
      gsap.ticker.lagSmoothing(0);
      ScrollTrigger.refresh();
      teardown = () => gsap.ticker.remove(onTick);
    });

    return () => {
      cleaned = true;
      teardown();
      lenis.destroy();
      window.__lenis = null;
    };
  }, [reduce]);
  return null;
}

/* ── ScrollProgress — thin brand bar pinned to the top ────────── */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  return <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden />;
}

/* ── Reveal — opacity + rise + de-blur, spring-settled on view ── */
export function Reveal({ children, delay = 0, style, as = "div", y = 22, className }) {
  const reduce = useReducedMotion();
  const Comp = motion[as] || motion.div;
  if (reduce) return <Comp className={className} style={style}>{children}</Comp>;
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.7, delay: delay / 1000, ease: EASE }}
      style={style}
    >
      {children}
    </Comp>
  );
}

/* ── PageTransition — coordinated fade + rise + de-blur on route ── */
export function PageTransition({ routeKey, children }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <motion.div
      key={routeKey}
      initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ── SlotWord — masked vertical "slot machine" rotator (Rever-style).
   Each word slides up out of an overflow-clipped slot; the next rises
   in from below. Always travels one direction — no reverse flash. ── */
export function SlotWord({ words, interval = 2100, className }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduce || words.length < 2) return;
    const id = setInterval(() => setI((x) => (x + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [words, interval, reduce]);
  if (reduce) return <span className={className}>{words[0]}</span>;
  return (
    <span className="slot">
      {/* invisible sizer reserves the slot's width + height for the
         current word, so the masked words can be absolutely stacked. */}
      <span className="slot-sizer" aria-hidden="true">{words[i]}</span>
      <AnimatePresence initial={false}>
        <motion.span
          key={i}
          className={"slot-word " + (className || "")}
          initial={{ y: "105%" }}
          animate={{ y: "0%" }}
          exit={{ y: "-105%" }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* ── ScrollTilt — Rever-style 3D product surface. Rests at a slight
   back-tilt, adds live pointer parallax, and drifts/parallaxes as the
   hero scrolls away. Children at translateZ separate under perspective. ── */
export function ScrollTilt({ children, rest = 7, className, style }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const sp = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 });

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 120, damping: 18 });
  const sy = useSpring(py, { stiffness: 120, damping: 18 });

  const driftRotX = useTransform(sp, [0, 1], [0, 6]);
  const mRotX = useTransform(sy, [0, 1], [3, -3]);
  const rotateX = useTransform([driftRotX, mRotX], ([d, m]) => rest + d + m);
  const rotateY = useTransform(sx, [0, 1], [-6, 6]);
  const y = useTransform(sp, [0, 1], [0, -64]);

  if (reduce) return <div className={className} style={style}>{children}</div>;

  const onMove = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };
  return (
    <div ref={ref} className={className} style={{ perspective: 1200, ...style }}>
      <motion.div
        initial={{ opacity: 0, y: 54, rotateX: rest + 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ rotateX, rotateY, y, transformStyle: "preserve-3d", willChange: "transform" }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ── MagneticCursor — a brand pill that trails the pointer and pops a
   label over any [data-cursor] element. Desktop fine-pointer only. ── */
export function MagneticCursor() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(false);
  const [label, setLabel] = useState("");
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 380, damping: 30, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 380, damping: 30, mass: 0.5 });
  useEffect(() => {
    if (reduce) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e) => {
      const el = e.target.closest?.("[data-cursor]");
      if (el) {
        setActive(true);
        setLabel(el.getAttribute("data-cursor") || "");
      } else {
        setActive(false);
      }
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
    };
  }, [reduce]);
  if (reduce || typeof document === "undefined") return null;
  return createPortal(
    <motion.div className="hero-cursor" style={{ x: sx, y: sy }} aria-hidden>
      <span className={"hero-cursor-inner" + (active ? " on" : "")}>{label}</span>
    </motion.div>,
    document.body
  );
}

/* ── Marquee — seamless infinite auto-scroll (pauses on hover) ── */
export function Marquee({ children, speed = 38, gap = 18, className }) {
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <div className={"marquee-static " + (className || "")} style={{ gap }}>
        {children}
      </div>
    );
  }
  // Each group carries its own internal gap + a trailing gap, so two
  // identical groups loop seamlessly under translateX(-50%).
  const Group = () => (
    <div className="marquee-group" style={{ gap, paddingRight: gap }}>
      {children}
    </div>
  );
  return (
    <div className={"marquee " + (className || "")}>
      <div className="marquee-track" style={{ animationDuration: `${speed}s` }}>
        <Group />
        <Group />
      </div>
    </div>
  );
}

/* ── CountUp — animates 0→to when scrolled into view ─────────── */
export function CountUp({ to, suffix = "", duration = 1.3, className }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (reduce) {
      setVal(to);
      return;
    }
    if (!inView) return;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(to * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration, reduce]);
  return (
    <span ref={ref} className={className}>
      {val}
      {suffix}
    </span>
  );
}

/* ── HeroHeadline — word-by-word kinetic reveal, serif accent last ─ */
export function HeroHeadline({ a, serif, b, className = "t-display-lg balance", style }) {
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <h1 className={className} style={style}>
        {a} <span className="serif-accent">{serif}</span> {b}
      </h1>
    );
  }
  const words = [
    ...a.split(" ").map((w) => ({ w, serif: false })),
    { w: serif, serif: true },
    ...b.split(" ").map((w) => ({ w, serif: false })),
  ];
  const container = { hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.12 } } };
  const word = {
    hidden: { opacity: 0, y: "0.5em", filter: "blur(8px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: EASE } },
  };
  return (
    <motion.h1 className={className} style={style} variants={container} initial="hidden" animate="show">
      {words.map((it, i) => (
        <motion.span
          key={i}
          variants={word}
          className={it.serif ? "serif-accent" : undefined}
          style={{ display: "inline-block", marginRight: "0.26em", willChange: "transform, filter" }}
        >
          {it.w}
        </motion.span>
      ))}
    </motion.h1>
  );
}
