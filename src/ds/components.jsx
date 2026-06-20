/* ──────────────────────────────────────────────────────────────────
   Caastor v2 — design-system primitives (React module)
   Ported 1:1 from the v2 design-system bundle. Icon set is the
   Apple-feel outline collection (currentColor, 24×24, ~1.6px stroke).
   ────────────────────────────────────────────────────────────────── */
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

/* ── ICONS — inline SVG paths/fragments ─────────────────────── */
export const ICONS = {
  search: <path d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm10 2-5.2-5.2" />,
  plus: <path d="M12 5v14M5 12h14" />,
  bell: <path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8Zm4 13a2 2 0 0 0 4 0" />,
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82c.27.6.86.99 1.51 1H21a2 2 0 1 1 0 4h-.09c-.65.01-1.24.4-1.51 1Z" />
    </>
  ),
  check: <path d="m5 12 5 5L20 7" />,
  arrowRight: (
    <>
      <path d="M5 12h14" />
      <path d="m13 5 7 7-7 7" />
    </>
  ),
  arrowUp: <path d="M12 19V5m-7 7 7-7 7 7" />,
  arrowDown: <path d="M12 5v14m-7-7 7 7 7-7" />,
  chevronRight: <path d="m9 6 6 6-6 6" />,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  chevronLeft: <path d="m15 6-6 6 6 6" />,
  dot: <circle cx="12" cy="12" r="4" />,
  sparkles: <path d="M12 3v4m0 10v4M3 12h4m10 0h4M5.6 5.6l2.8 2.8m7.2 7.2 2.8 2.8M5.6 18.4l2.8-2.8m7.2-7.2 2.8-2.8" />,
  filter: <path d="M3 5h18M6 12h12M10 19h4" />,
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  list: (
    <>
      <path d="M8 6h13M8 12h13M8 18h13" />
      <circle cx="4" cy="6" r="1" />
      <circle cx="4" cy="12" r="1" />
      <circle cx="4" cy="18" r="1" />
    </>
  ),
  inbox: (
    <>
      <path d="M22 12h-6l-2 3h-4l-2-3H2" />
      <path d="M5.5 5h13l3.5 7v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6Z" />
    </>
  ),
  folder: <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />,
  users: (
    <>
      <circle cx="9" cy="8" r="4" />
      <path d="M3 21v-1a6 6 0 0 1 12 0v1" />
      <path d="M16 4a4 4 0 0 1 0 8" />
      <path d="M21 21v-1a6 6 0 0 0-3-5" />
    </>
  ),
  activity: <path d="M3 12h4l3-9 4 18 3-9h4" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </>
  ),
  flag: <path d="M4 21V4m0 0 12 1-2 4 2 4H4" />,
  more: (
    <>
      <circle cx="5" cy="12" r="1.4" />
      <circle cx="12" cy="12" r="1.4" />
      <circle cx="19" cy="12" r="1.4" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4 12H2m20 0h-2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5" />
    </>
  ),
  moon: <path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10Z" />,
  star: <path d="m12 3 2.7 5.5 6.3.9-4.5 4.4 1 6.2-5.5-2.9-5.5 2.9 1-6.2L3 9.4l6.3-.9Z" />,
  layers: (
    <>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 13 9 5 9-5" />
      <path d="m3 18 9 5 9-5" />
    </>
  ),
  message: <path d="M21 12a8 8 0 0 1-12 7l-5 1 1-5A8 8 0 1 1 21 12Z" />,
  link: (
    <>
      <path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" />
      <path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
    </>
  ),
  upload: <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m4-7 5-5 5 5m-5-5v13" />,
  download: <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m4-5 5 5 5-5m-5 5V3" />,
  command: <path d="M6 9a3 3 0 1 1 3-3v12a3 3 0 1 1-3-3h12a3 3 0 1 1-3 3V6a3 3 0 1 1 3 3Z" />,
  beaver: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <circle cx="9" cy="10" r="1.4" />
      <circle cx="15" cy="10" r="1.4" />
      <path d="M9 15h6M10 17l2 2 2-2" />
    </>
  ),
};

export function Icon({ name, size = 18, stroke = 1.6, color = "currentColor", style }) {
  const path = ICONS[name];
  if (!path) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      aria-hidden
    >
      {path}
    </svg>
  );
}

/* ── BUTTON — primary/accent/secondary/outline/ghost/soft/danger ─ */
const BTN_SIZES = {
  sm: { h: 32, px: 12, fs: 13, ic: 14, gap: 6, rad: 8 },
  md: { h: 38, px: 16, fs: 14, ic: 16, gap: 8, rad: 10 },
  lg: { h: 46, px: 20, fs: 15, ic: 18, gap: 10, rad: 12 },
};
const BTN_VARIANTS = {
  primary: { bg: "var(--brand)", color: "var(--text-on-brand)", bd: "transparent", hover: "var(--brand-strong)" },
  accent: { bg: "var(--accent)", color: "var(--text-on-accent)", bd: "transparent", hover: "var(--accent-strong)" },
  secondary: { bg: "var(--text-primary)", color: "var(--bg-canvas)", bd: "transparent", hover: "var(--text-secondary)" },
  outline: { bg: "transparent", color: "var(--text-primary)", bd: "var(--border-strong)", hover: "var(--bg-muted)" },
  ghost: { bg: "transparent", color: "var(--text-primary)", bd: "transparent", hover: "var(--bg-muted)" },
  soft: { bg: "var(--bg-muted)", color: "var(--text-primary)", bd: "transparent", hover: "var(--border-default)" },
  danger: { bg: "var(--status-danger)", color: "#fff", bd: "transparent", hover: "var(--status-danger)" },
};

export function Button({ variant = "primary", size = "md", icon, iconEnd, children, onClick, style, full, square, ...rest }) {
  const s = BTN_SIZES[size];
  const v = BTN_VARIANTS[variant];
  const reduce = useReducedMotion();
  const ref = useRef(null);
  // Magnetic pull only on prominent CTAs (brand/accent), never full-width or square.
  const magnetic = !reduce && (variant === "primary" || variant === "accent") && !full && !square;
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 16, mass: 0.4 });
  const y = useSpring(my, { stiffness: 220, damping: 16, mass: 0.4 });

  const onMove = (e) => {
    if (!magnetic) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - (r.left + r.width / 2)) * 0.12);
    my.set((e.clientY - (r.top + r.height / 2)) * 0.16);
  };
  const reset = (e) => {
    mx.set(0);
    my.set(0);
    e.currentTarget.style.background = v.bg;
  };

  return (
    <motion.button
      ref={ref}
      {...rest}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={reset}
      onMouseOver={(e) => {
        e.currentTarget.style.background = v.hover;
      }}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      style={{
        x: magnetic ? x : 0,
        y: magnetic ? y : 0,
        height: s.h,
        padding: square ? 0 : `0 ${s.px}px`,
        width: square ? s.h : full ? "100%" : undefined,
        background: v.bg,
        color: v.color,
        border: `1px solid ${v.bd}`,
        borderRadius: s.rad,
        fontFamily: "inherit",
        fontWeight: 600,
        fontSize: s.fs,
        letterSpacing: "-0.01em",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: s.gap,
        cursor: "pointer",
        whiteSpace: "nowrap",
        transition: "background-color var(--dur-fast) var(--ease-out)",
        boxShadow: variant === "primary" ? "var(--shadow-brand)" : variant === "accent" ? "var(--shadow-accent)" : "none",
        ...style,
      }}
    >
      {icon && <Icon name={icon} size={s.ic} />}
      {children}
      {iconEnd && <Icon name={iconEnd} size={s.ic} />}
    </motion.button>
  );
}

/* ── INPUT ──────────────────────────────────────────────────── */
export function Input({ value, onChange, placeholder, icon, type = "text", size = "md", style }) {
  const [focus, setFocus] = useState(false);
  const h = { sm: 32, md: 40, lg: 46 }[size];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        height: h,
        padding: "0 12px",
        background: "var(--bg-canvas)",
        border: `1px solid ${focus ? "var(--border-focus)" : "var(--border-default)"}`,
        borderRadius: 10,
        boxShadow: focus ? "var(--shadow-focus)" : "none",
        transition: "border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)",
        ...style,
      }}
    >
      {icon && <Icon name={icon} size={16} color="var(--text-tertiary)" />}
      <input
        type={type}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange && onChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          flex: 1,
          border: 0,
          outline: 0,
          background: "transparent",
          color: "var(--text-primary)",
          fontFamily: "inherit",
          fontSize: 14,
          height: "100%",
        }}
      />
    </div>
  );
}

/* ── BADGE ──────────────────────────────────────────────────── */
const BADGE_TONES = {
  neutral: { bg: "var(--bg-muted)", fg: "var(--text-secondary)", bd: "var(--border-default)" },
  brand: { bg: "var(--brand-soft)", fg: "var(--brand-strong)", bd: "transparent" },
  accent: { bg: "var(--accent-soft)", fg: "var(--accent-strong)", bd: "transparent" },
  success: { bg: "var(--status-success-soft)", fg: "var(--status-success)", bd: "transparent" },
  warning: { bg: "var(--status-warning-soft)", fg: "var(--status-warning)", bd: "transparent" },
  danger: { bg: "var(--status-danger-soft)", fg: "var(--status-danger)", bd: "transparent" },
  info: { bg: "var(--status-info-soft)", fg: "var(--status-info)", bd: "transparent" },
};

export function Badge({ tone = "neutral", children, icon, dot, style }) {
  const t = BADGE_TONES[tone];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "3px 9px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "-0.005em",
        background: t.bg,
        color: t.fg,
        border: `1px solid ${t.bd}`,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {dot && <span style={{ width: 6, height: 6, borderRadius: 999, background: t.fg }} />}
      {icon && <Icon name={icon} size={12} />}
      {children}
    </span>
  );
}

/* ── CARD ───────────────────────────────────────────────────── */
export function Card({ children, padded = true, hover = false, style, onClick, className }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className={className}
      style={{
        background: "var(--bg-canvas)",
        border: "1px solid var(--border-default)",
        borderRadius: 14,
        padding: padded ? (typeof padded === "number" ? padded : 20) : 0,
        boxShadow:
          hov && hover ? "var(--shadow-md), 0 14px 34px rgba(var(--brand-glow), 0.10)" : "var(--shadow-xs)",
        transform: hov && hover ? "translateY(-3px)" : "translateY(0)",
        transition: "transform var(--dur-base) var(--ease-spring), box-shadow var(--dur-base) var(--ease-out)",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ── AVATAR ─────────────────────────────────────────────────── */
export function Avatar({ src, name = "?", size = 32, status }) {
  const initials = name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: 999,
          overflow: "hidden",
          background: "linear-gradient(135deg, var(--brand-soft), var(--accent-soft))",
          color: "var(--text-primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: Math.max(10, size * 0.38),
          fontWeight: 600,
          border: "1.5px solid var(--bg-canvas)",
        }}
      >
        {src ? <img src={src} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : initials}
      </div>
      {status && (
        <span
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            width: size * 0.32,
            height: size * 0.32,
            borderRadius: 999,
            background: status === "online" ? "var(--status-success)" : "var(--text-quaternary)",
            border: "2px solid var(--bg-canvas)",
          }}
        />
      )}
    </div>
  );
}

/* ── AVATAR GROUP ───────────────────────────────────────────── */
export function AvatarGroup({ avatars, size = 28, max = 4 }) {
  const visible = avatars.slice(0, max);
  const rest = avatars.length - visible.length;
  return (
    <div style={{ display: "flex" }}>
      {visible.map((a, i) => (
        <div key={i} style={{ marginLeft: i ? -size * 0.32 : 0, zIndex: visible.length - i }}>
          <Avatar {...a} size={size} />
        </div>
      ))}
      {rest > 0 && (
        <div
          style={{
            marginLeft: -size * 0.32,
            width: size,
            height: size,
            borderRadius: 999,
            background: "var(--bg-muted)",
            color: "var(--text-secondary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: Math.max(10, size * 0.34),
            fontWeight: 600,
            border: "1.5px solid var(--bg-canvas)",
          }}
        >
          +{rest}
        </div>
      )}
    </div>
  );
}

/* ── SEGMENTED CONTROL ──────────────────────────────────────── */
export function Segmented({ value, onChange, options }) {
  const refs = useRef({});
  const containerRef = useRef(null);
  const [thumb, setThumb] = useState({ left: 0, width: 0 });
  useLayoutEffect(() => {
    const el = refs.current[value];
    const c = containerRef.current;
    if (el && c) {
      const rect = el.getBoundingClientRect();
      const crect = c.getBoundingClientRect();
      setThumb({ left: rect.left - crect.left, width: rect.width });
    }
  }, [value, options]);
  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        display: "inline-flex",
        padding: 3,
        background: "var(--bg-muted)",
        borderRadius: 10,
        border: "1px solid var(--border-subtle)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 3,
          height: "calc(100% - 6px)",
          left: thumb.left,
          width: thumb.width,
          background: "var(--bg-canvas)",
          borderRadius: 8,
          boxShadow: "var(--shadow-sm)",
          transition: "left var(--dur-base) var(--ease-snap), width var(--dur-base) var(--ease-snap)",
        }}
      />
      {options.map((opt) => {
        const val = opt.value ?? opt;
        const label = opt.label ?? opt;
        return (
          <button
            key={val}
            ref={(el) => (refs.current[val] = el)}
            onClick={() => onChange(val)}
            style={{
              position: "relative",
              zIndex: 1,
              padding: "6px 14px",
              background: "transparent",
              border: 0,
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: 13,
              fontWeight: 500,
              color: value === val ? "var(--text-primary)" : "var(--text-tertiary)",
              transition: "color var(--dur-fast) var(--ease-out)",
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

/* ── SWITCH ─────────────────────────────────────────────────── */
export function Switch({ on, onChange }) {
  return (
    <button
      onClick={() => onChange(!on)}
      style={{
        width: 40,
        height: 24,
        borderRadius: 999,
        border: 0,
        padding: 2,
        background: on ? "var(--status-success)" : "var(--bg-muted)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: on ? "flex-end" : "flex-start",
        transition: "background-color var(--dur-base) var(--ease-out)",
        boxShadow: "inset 0 0 0 1px var(--border-default)",
      }}
    >
      <span
        style={{
          width: 20,
          height: 20,
          borderRadius: 999,
          background: "#fff",
          boxShadow: "0 1px 2px rgba(0,0,0,0.25), 0 2px 6px rgba(0,0,0,0.1)",
          transition: "transform var(--dur-base) var(--ease-spring)",
        }}
      />
    </button>
  );
}

/* ── COUNTER — animated number ──────────────────────────────── */
export function Counter({ value, duration = 900, prefix = "", suffix = "", decimals = 0 }) {
  const [v, setV] = useState(0);
  const startRef = useRef(null);
  const fromRef = useRef(0);
  useEffect(() => {
    fromRef.current = v;
    startRef.current = performance.now();
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - startRef.current) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const cur = fromRef.current + (value - fromRef.current) * eased;
      setV(cur);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return (
    <span>
      {prefix}
      {v.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
      {suffix}
    </span>
  );
}

/* ── PROGRESS BAR ───────────────────────────────────────────── */
export function Progress({ value, color = "var(--brand)", height = 6 }) {
  return (
    <div style={{ width: "100%", height, background: "var(--bg-muted)", borderRadius: 999, overflow: "hidden" }}>
      <div
        style={{
          height: "100%",
          width: `${value}%`,
          background: color,
          borderRadius: 999,
          transition: "width var(--dur-slow) var(--ease-out)",
        }}
      />
    </div>
  );
}
