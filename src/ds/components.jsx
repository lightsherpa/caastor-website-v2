/* ──────────────────────────────────────────────────────────────────
   Caastor v2 — design-system primitives (React module)
   Ported 1:1 from the v2 design-system bundle. Icon set is the
   Apple-feel outline collection (currentColor, 24×24, ~1.6px stroke).
   ────────────────────────────────────────────────────────────────── */
import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { SPRING, GESTURE } from "../motion/tokens.js";

/* ── ICONS — inline SVG paths/fragments ─────────────────────── */
export const ICONS = {
  search: <path d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm10 2-5.2-5.2" />,
  plus: <path d="M12 5v14M5 12h14" />,
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
  chevronLeft: <path d="m15 6-6 6 6 6" />,
  dot: <circle cx="12" cy="12" r="4" />,
  sparkles: <path d="M12 3v4m0 10v4M3 12h4m10 0h4M5.6 5.6l2.8 2.8m7.2 7.2 2.8 2.8M5.6 18.4l2.8-2.8m7.2-7.2 2.8-2.8" />,
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
  users: (
    <>
      <circle cx="9" cy="8" r="4" />
      <path d="M3 21v-1a6 6 0 0 1 12 0v1" />
      <path d="M16 4a4 4 0 0 1 0 8" />
      <path d="M21 21v-1a6 6 0 0 0-3-5" />
    </>
  ),
  activity: <path d="M3 12h4l3-9 4 18 3-9h4" />,
  flag: <path d="M4 21V4m0 0 12 1-2 4 2 4H4" />,
  home: (
    <>
      <path d="m3 11 9-8 9 8" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M9.5 21v-6h5v6" />
    </>
  ),
  tag: (
    <>
      <path d="M3 12V4h8l9 9-8 8-9-9Z" />
      <circle cx="7.5" cy="7.5" r="1.2" />
    </>
  ),
  blog: (
    <>
      <path d="M6 3h7l5 5v13H6z" />
      <path d="M13 3v5h5" />
      <path d="M9 13h6M9 17h4" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.2a2.6 2.6 0 1 1 3.6 2.4c-.7.4-1.1.9-1.1 1.7" />
      <path d="M12 17h.01" />
    </>
  ),
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
  command: <path d="M6 9a3 3 0 1 1 3-3v12a3 3 0 1 1-3-3h12a3 3 0 1 1-3 3V6a3 3 0 1 1 3 3Z" />,
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
      initial="rest"
      animate="rest"
      whileHover={reduce ? undefined : "hover"}
      whileTap={reduce ? undefined : "press"}
      variants={
        reduce
          ? undefined
          : {
              rest: { scale: 1, scaleX: 1, scaleY: 1 },
              // Anticipation: a tiny wind-up dip before the pop settles.
              hover: { scale: [0.985, GESTURE.hoverPop.scale], transition: SPRING.snappy },
              // Squash on press; spring release lets it stretch back past 1.
              press: { ...GESTURE.tapSquash, transition: SPRING.snappy },
            }
      }
      transition={SPRING.snappy}
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
      {iconEnd &&
        (reduce ? (
          <Icon name={iconEnd} size={s.ic} />
        ) : (
          // Secondary action: end icon nudges forward + lifts when the button hovers.
          <motion.span
            style={{ display: "inline-flex" }}
            variants={{
              rest: { x: 0, y: 0 },
              hover: { x: 2, y: -1, transition: SPRING.bouncy },
              press: { x: 0, y: 0 },
            }}
          >
            <Icon name={iconEnd} size={s.ic} />
          </motion.span>
        ))}
    </motion.button>
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

/* ── SWITCH, above, is the last shipped primitive. ── */
