/* ──────────────────────────────────────────────────────────────────
   Caastor v2 — Waves: ambient simplex-noise line field (SVG).
   Ported to JSX from a shared component, brand-tinted, used as a subtle
   backdrop behind the dark positioning section.

   Guards this codebase expects: skips entirely on reduced-motion,
   coarse-pointer and small screens (the SVG path field is CPU-heavy and
   the section reads fine without it); pauses its rAF when offscreen; and
   never blocks clicks or scroll (pointer-events: none, no touch handler).
   ────────────────────────────────────────────────────────────────── */
import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { createNoise2D } from "simplex-noise";

export function Waves({ className = "", strokeColor = "rgba(245,180,0,0.13)", backgroundColor = "transparent" }) {
  const reduce = useReducedMotion();
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const mouseRef = useRef({ x: -10, y: 0, lx: 0, ly: 0, sx: 0, sy: 0, v: 0, vs: 0, a: 0, set: false });
  const pathsRef = useRef([]);
  const linesRef = useRef([]);
  const noiseRef = useRef(null);
  const rafRef = useRef(null);
  const boundingRef = useRef(null);

  useEffect(() => {
    if (reduce) return;
    // Desktop fine-pointer only — keeps mobile snappy; the dark section
    // still looks premium without the field.
    if (!window.matchMedia("(min-width: 800px) and (pointer: fine)").matches) return;
    const container = containerRef.current;
    const svg = svgRef.current;
    if (!container || !svg) return;

    noiseRef.current = createNoise2D();
    setSize();
    setLines();

    const onResize = () => { setSize(); setLines(); };
    const onScroll = () => { boundingRef.current = container.getBoundingClientRect(); };
    const onMouseMove = (e) => updateMousePosition(e.clientX, e.clientY);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // Pause the animation loop while the section is scrolled out of view.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && rafRef.current == null) {
          rafRef.current = requestAnimationFrame(tick);
        } else if (!entry.isIntersecting && rafRef.current != null) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
      },
      { threshold: 0 }
    );
    io.observe(container);

    rafRef.current = requestAnimationFrame(tick);

    function setSize() {
      boundingRef.current = container.getBoundingClientRect();
      const { width, height } = boundingRef.current;
      svg.style.width = `${width}px`;
      svg.style.height = `${height}px`;
    }

    function setLines() {
      const { width, height } = boundingRef.current;
      linesRef.current = [];
      pathsRef.current.forEach((p) => p.remove());
      pathsRef.current = [];

      const xGap = 14;
      const yGap = 12;
      const oWidth = width + 200;
      const oHeight = height + 30;
      const totalLines = Math.ceil(oWidth / xGap);
      const totalPoints = Math.ceil(oHeight / yGap);
      const xStart = (width - xGap * totalLines) / 2;
      const yStart = (height - yGap * totalPoints) / 2;

      for (let i = 0; i < totalLines; i++) {
        const points = [];
        for (let j = 0; j < totalPoints; j++) {
          points.push({
            x: xStart + xGap * i,
            y: yStart + yGap * j,
            wave: { x: 0, y: 0 },
            cursor: { x: 0, y: 0, vx: 0, vy: 0 },
          });
        }
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", strokeColor);
        path.setAttribute("stroke-width", "1");
        svg.appendChild(path);
        pathsRef.current.push(path);
        linesRef.current.push(points);
      }
    }

    function updateMousePosition(x, y) {
      const b = boundingRef.current;
      if (!b) return;
      const m = mouseRef.current;
      m.x = x - b.left;
      m.y = y - b.top;
      if (!m.set) {
        m.sx = m.x; m.sy = m.y; m.lx = m.x; m.ly = m.y;
        m.set = true;
      }
    }

    function movePoints(time) {
      const noise = noiseRef.current;
      const m = mouseRef.current;
      if (!noise) return;
      linesRef.current.forEach((points) =>
        points.forEach((p) => {
          const move = noise((p.x + time * 0.008) * 0.003, (p.y + time * 0.003) * 0.002) * 8;
          p.wave.x = Math.cos(move) * 12;
          p.wave.y = Math.sin(move) * 6;

          const dx = p.x - m.sx;
          const dy = p.y - m.sy;
          const d = Math.hypot(dx, dy);
          const l = Math.max(175, m.vs);
          if (d < l) {
            const s = 1 - d / l;
            const f = Math.cos(d * 0.001) * s;
            p.cursor.vx += Math.cos(m.a) * f * l * m.vs * 0.00035;
            p.cursor.vy += Math.sin(m.a) * f * l * m.vs * 0.00035;
          }
          p.cursor.vx += (0 - p.cursor.x) * 0.01;
          p.cursor.vy += (0 - p.cursor.y) * 0.01;
          p.cursor.vx *= 0.95;
          p.cursor.vy *= 0.95;
          p.cursor.x += p.cursor.vx;
          p.cursor.y += p.cursor.vy;
          p.cursor.x = Math.min(50, Math.max(-50, p.cursor.x));
          p.cursor.y = Math.min(50, Math.max(-50, p.cursor.y));
        })
      );
    }

    function moved(point, withCursor = true) {
      return {
        x: point.x + point.wave.x + (withCursor ? point.cursor.x : 0),
        y: point.y + point.wave.y + (withCursor ? point.cursor.y : 0),
      };
    }

    function drawLines() {
      linesRef.current.forEach((points, li) => {
        const path = pathsRef.current[li];
        if (points.length < 2 || !path) return;
        const first = moved(points[0], false);
        let d = `M ${first.x} ${first.y}`;
        for (let i = 1; i < points.length; i++) {
          const c = moved(points[i]);
          d += `L ${c.x} ${c.y}`;
        }
        path.setAttribute("d", d);
      });
    }

    function tick(time) {
      const m = mouseRef.current;
      m.sx += (m.x - m.sx) * 0.1;
      m.sy += (m.y - m.sy) * 0.1;
      const dx = m.x - m.lx;
      const dy = m.y - m.ly;
      const d = Math.hypot(dx, dy);
      m.v = d;
      m.vs += (d - m.vs) * 0.1;
      m.vs = Math.min(100, m.vs);
      m.lx = m.x;
      m.ly = m.y;
      m.a = Math.atan2(dy, dx);
      movePoints(time);
      drawLines();
      rafRef.current = requestAnimationFrame(tick);
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
      pathsRef.current.forEach((p) => p.remove());
      pathsRef.current = [];
    };
  }, [reduce, strokeColor]);

  if (reduce) return null;
  return (
    <div
      ref={containerRef}
      className={"waves-bg " + className}
      style={{ position: "absolute", inset: 0, backgroundColor, overflow: "hidden", pointerEvents: "none" }}
      aria-hidden="true"
    >
      <svg ref={svgRef} style={{ display: "block" }} xmlns="http://www.w3.org/2000/svg" />
    </div>
  );
}
