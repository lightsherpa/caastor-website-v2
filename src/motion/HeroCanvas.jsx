/* ──────────────────────────────────────────────────────────────────
   Caastor v2 — HeroCanvas
   A GPU-shader particle field for the dark hero. Three.js is loaded
   lazily (its own chunk) AFTER mount, so first paint shows the static
   gradient fallback and LCP stays fast. Hard-skips on reduced-motion,
   small screens, Save-Data and missing WebGL. Pauses when offscreen or
   the tab is hidden, caps DPR, and fully disposes on unmount.
   ────────────────────────────────────────────────────────────────── */
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

const VERT = `
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;
  varying float vH;
  void main() {
    vUv = uv;
    vec3 p = position;
    float w = sin(p.x * 0.6 + uTime * 0.8) * 0.5
            + cos(p.y * 0.8 + uTime * 0.6) * 0.4
            + sin((p.x + p.y) * 0.4 + uTime) * 0.3;
    float d = distance(p.xy, uMouse * 8.0);
    w += sin(d * 1.2 - uTime * 2.0) * 0.18 * exp(-d * 0.15);
    p.z += w;
    vH = w;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

// A glowing, undulating design grid (amber→indigo) that fades at the
// edges — a creative platform's "canvas", not a starfield.
const FRAG = `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uGrid;
  varying vec2 vUv;
  varying float vH;
  void main() {
    vec2 coord = vUv * uGrid;
    vec2 gw = fwidth(coord);
    vec2 grid = abs(fract(coord - 0.5) - 0.5) / gw;
    float line = 1.0 - min(min(grid.x, grid.y), 1.0);
    float vig = smoothstep(0.95, 0.18, length(vUv - 0.5));
    float h = clamp(vH * 0.5 + 0.5, 0.0, 1.0);
    vec3 col = mix(uColorB, uColorA, h);
    float alpha = line * vig * (0.28 + 0.72 * h);
    if (alpha < 0.004) discard;
    gl_FragColor = vec4(col, alpha);
  }
`;

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")));
  } catch {
    return false;
  }
}

function initScene(THREE, canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setClearColor(0x000000, 0);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(dpr);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 100);
  camera.position.set(0, 0, 6);

  const geo = new THREE.PlaneGeometry(20, 12, 80, 52);
  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uGrid: { value: 30.0 },
      uColorA: { value: new THREE.Color(0xf5b400) },
      uColorB: { value: new THREE.Color(0x4f46e5) },
      uMouse: { value: new THREE.Vector2(0, 0) },
    },
    vertexShader: VERT,
    fragmentShader: FRAG,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI * 0.36;
  mesh.position.y = -0.6;
  scene.add(mesh);

  function resize() {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  const mouse = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };
  const onMove = (e) => {
    mouse.x = e.clientX / window.innerWidth - 0.5;
    mouse.y = e.clientY / window.innerHeight - 0.5;
  };
  window.addEventListener("pointermove", onMove, { passive: true });

  const clock = new THREE.Clock();
  let raf = 0;
  let running = false;
  const loop = () => {
    const t = clock.getElapsedTime();
    mat.uniforms.uTime.value = t;
    target.x += (mouse.x - target.x) * 0.05;
    target.y += (mouse.y - target.y) * 0.05;
    camera.position.x = target.x * 1.6;
    camera.position.y = -target.y * 1.0;
    camera.lookAt(0, -0.4, 0);
    mat.uniforms.uMouse.value.set(target.x, target.y);
    renderer.render(scene, camera);
    raf = requestAnimationFrame(loop);
  };
  const start = () => {
    if (running || document.hidden) return;
    running = true;
    raf = requestAnimationFrame(loop);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  const io = new IntersectionObserver(([en]) => (en.isIntersecting ? start() : stop()), { threshold: 0 });
  io.observe(canvas);
  const onVis = () => (document.hidden ? stop() : start());
  document.addEventListener("visibilitychange", onVis);
  start();

  return () => {
    stop();
    ro.disconnect();
    io.disconnect();
    window.removeEventListener("pointermove", onMove);
    document.removeEventListener("visibilitychange", onVis);
    geo.dispose();
    mat.dispose();
    renderer.dispose();
  };
}

export function HeroCanvas() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const small = window.matchMedia("(max-width: 760px)").matches;
    const saveData = navigator.connection && navigator.connection.saveData;
    if (small || saveData || !hasWebGL()) return; // fallback gradient only

    let cancelled = false;
    let cleanup = () => {};
    import("three")
      .then((THREE) => {
        if (cancelled || !ref.current) return;
        cleanup = initScene(THREE, ref.current);
        setOn(true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      cleanup();
    };
  }, [reduce]);

  return <canvas ref={ref} className={"hero-canvas" + (on ? " is-on" : "")} aria-hidden="true" />;
}
