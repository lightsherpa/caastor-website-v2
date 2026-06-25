/* ──────────────────────────────────────────────────────────────────
   Caastor v2 — Bundles: outcome-led service packages.
   Premium, conversion-grade comparison cards. The "Most popular" card
   (accent "brand") is elevated: scaled up, dark fill, floating ribbon.
   Each card carries a prominent price anchor, a use-case rail, and a
   crisp includes-vs-excludes split. All data bindings + booking CTA
   are preserved.
   ────────────────────────────────────────────────────────────────── */
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Button, Icon } from "../ds/components.jsx";
import { Reveal, SectionHead } from "./shell.jsx";
import { bookingProps } from "../lib/booking.js";
import { EASE, SPRING } from "../motion/tokens.js";
import "./bundles-extra.css";

const ACCENT = {
  brand: "linear-gradient(135deg, var(--brand), var(--brand-strong))",
  accent: "linear-gradient(135deg, #FF8A3D, #F5B400)",
  indigo: "linear-gradient(135deg, var(--accent), #6D5BD6)",
};

/* Tracks the >=921px breakpoint so the feature card's raised+scaled rest
   pose (driven by Framer Motion) matches the CSS baseline only on desktop;
   on mobile the CSS lays it flat and we let the variant rest flat too. */
function useDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 921px)");
    const on = () => setDesktop(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return desktop;
}

/* Muted ✕ for "not included" rows (no x glyph in the shared icon set). */
function Cross({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

const LABELS = {
  en: { from: "From", useCase: "Best for", includes: "What's included", excludes: "Not included" },
  es: { from: "Desde", useCase: "Ideal para", includes: "Qué incluye", excludes: "No incluye" },
};

export function BundlesSection({ t, navigate, lang }) {
  const reduce = useReducedMotion();
  const b = t.home.bundles;
  // lang is not always threaded in; fall back to detecting Spanish from the
  // contract-guaranteed price string ("Desde …/mes" + "€" vs "From $…/mo").
  const isEs =
    lang === "es" ||
    (lang == null &&
      (b.items || []).some(
        (it) => typeof it.price === "string" && (/^desde/i.test(it.price.trim()) || it.price.includes("€"))
      ));
  const L = isEs ? LABELS.es : LABELS.en;

  return (
    <section className="section surface-app hairline-top">
      <div className="container">
        <Reveal>
          <SectionHead title={b.header} sub={b.sub} align="center" max={760} />
        </Reveal>

        <div className="bx-grid">
          {b.items.map((it, i) => (
            <BundleCard
              key={i}
              it={it}
              index={i}
              reduce={reduce}
              L={L}
              isEs={isEs}
              ctaPrimary={b.ctaPrimary}
            />
          ))}
        </div>

        <Reveal delay={120}>
          <div className="bx-foot">
            <span className="text-link bx-foot-link" onClick={() => navigate("contact")}>
              {b.ctaSecondary}
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── BundleCard ────────────────────────────────────────────────────
   One comparison card. Owns its entry reveal (so it can also be the
   hover-reactive element without an extra wrapper) and a coordinated
   hover where CHILDREN react to the parent's hover state:
   - lift via SPRING.soft (the card body)                  [Appeal]
   - price/icon/checks tick + glow as secondary reactions  [Secondary]
   - the feature card lifts higher + breathes              [Exaggeration]
   - check rows settle with a tiny staggered overshoot     [Follow-through]
   - the ribbon sparkle drifts on a gentle arc             [Arc]
   Every motion is gated on `reduce`; when reduced, the CSS `.no-motion`
   path drives a flat, transform-light hover instead. ── */
function BundleCard({ it, index, reduce, L, isEs, ctaPrimary }) {
  const feature = it.accent === "brand";
  const bar = ACCENT[it.accent] || ACCENT.brand;
  const price = it.price ? splitPrice(it.price, isEs) : null;
  // The feature card only sits raised + scaled on desktop (matches the CSS
  // baseline at >=921px); on mobile it lies flat, so mirror that here.
  const desktop = useDesktop();

  // Parent hover state drives every child reaction in one orchestration.
  // The feature card rises a little further and breathes a touch on hover
  // for exaggerated personality. Base cards lift from flat.
  const cardVariants =
    feature && desktop
      ? {
          rest: { y: -12, scale: 1.035 },
          hover: { y: -18, scale: 1.045, transition: SPRING.soft },
        }
      : {
          rest: { y: 0, scale: 1 },
          hover: { y: -6, transition: SPRING.soft },
        };
  // Entry: rise + de-blur, settling on the emphasized ease (overshoot tail).
  const entry = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 22, filter: "blur(8px)" },
        whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
        viewport: { once: true, margin: "0px 0px -10% 0px" },
        transition: { duration: 0.7, delay: (index * 90) / 1000, ease: EASE.out },
      };

  // Plain (reduced-motion) render: no hover orchestration, CSS owns hover.
  if (reduce) {
    return (
      <div className={"bx-card no-motion" + (feature ? " is-feature" : "")}>
        <CardInner it={it} feature={feature} bar={bar} L={L} price={price} ctaPrimary={ctaPrimary} reduce />
      </div>
    );
  }

  return (
    <motion.div
      className={"bx-card bx-card-motion" + (feature ? " is-feature" : "")}
      variants={cardVariants}
      initial="rest"
      whileInView="rest"
      whileHover="hover"
      style={{ willChange: "transform" }}
      {...entry}
    >
      <CardInner it={it} feature={feature} bar={bar} L={L} price={price} ctaPrimary={ctaPrimary} />
    </motion.div>
  );
}

/* Shared inner markup. `reduce` strips the motion wrappers so the static
   DOM stays identical (same classes) for the reduced-motion path. */
function CardInner({ it, feature, bar, L, price, ctaPrimary, reduce }) {
  // Secondary reactions keyed off the parent "hover" variant.
  const haloV = { rest: { opacity: 1, scale: 1 }, hover: { opacity: 1, scale: 1.06 } };
  const priceV = { rest: { y: 0, scale: 1 }, hover: { y: -2, scale: 1.04, transition: SPRING.snappy } };
  const sparkV = { rest: { rotate: 0, y: 0 }, hover: { rotate: [0, -12, 8, 0], y: [0, -2, 0], transition: { duration: 0.7, ease: EASE.inOut } } };
  // Check rows: follow-through — each nudges + pops its icon, gently staggered.
  const rowV = { rest: { x: 0 }, hover: { x: 2, transition: SPRING.soft } };
  const checkIcV = { rest: { scale: 1 }, hover: { scale: 1.18, transition: SPRING.bouncy } };
  const usecaseIcV = { rest: { rotate: 0 }, hover: { rotate: [0, -8, 6, 0], transition: { duration: 0.6, ease: EASE.inOut } } };

  const Wrap = reduce ? "span" : motion.span;
  const RowWrap = reduce ? "div" : motion.div;

  return (
    <>
      {/* glow halo for the feature card — breathes a touch on hover */}
      {feature ? (
        reduce ? (
          <span className="bx-halo" aria-hidden />
        ) : (
          <motion.span className="bx-halo" aria-hidden variants={haloV} />
        )
      ) : null}

      {/* top accent bar — brand identity per bundle */}
      <span className="bx-accentbar" style={{ background: bar }} aria-hidden />

      {/* floating ribbon for the popular card */}
      {it.tag ? (
        <span className="bx-ribbon">
          {reduce ? (
            <Icon name="sparkles" size={12} />
          ) : (
            <motion.span className="bx-ribbon-spark" variants={sparkV} style={{ display: "inline-flex" }}>
              <Icon name="sparkles" size={12} />
            </motion.span>
          )}
          {it.tag}
        </span>
      ) : null}

      <div className="bx-top">
        <div className="bx-name-row">
          <span className="bx-name">{it.name}</span>
        </div>
        <div className="bx-for">{it.forWho}</div>

        {/* price anchor — the headline number; ticks up as secondary action */}
        {price ? (
          reduce ? (
            <div className="bx-price">
              <span className="bx-price-from">{L.from}</span>
              <span className="bx-price-amount">{price.amount}</span>
              {price.cadence ? <span className="bx-price-cadence">{price.cadence}</span> : null}
            </div>
          ) : (
            <motion.div className="bx-price" variants={priceV} style={{ transformOrigin: "left center" }}>
              <span className="bx-price-from">{L.from}</span>
              <span className="bx-price-amount">{price.amount}</span>
              {price.cadence ? <span className="bx-price-cadence">{price.cadence}</span> : null}
            </motion.div>
          )
        ) : null}

        <p className="bx-desc">{it.desc}</p>
      </div>

      {/* CTA pinned near the price for fast conversion */}
      <div className="bx-cta">
        <Button variant={feature ? "primary" : "outline"} size="md" full iconEnd="arrowRight" {...bookingProps}>
          {ctaPrimary}
        </Button>
      </div>

      {/* use-case rail — concrete audience + when to pick it */}
      {it.useCase ? (
        <div className="bx-usecase">
          <Wrap className="bx-usecase-ic" variants={reduce ? undefined : usecaseIcV}>
            <Icon name="users" size={15} />
          </Wrap>
          <span className="bx-usecase-text">
            <strong className="bx-usecase-lbl">{L.useCase}: </strong>
            {it.useCase}
          </span>
        </div>
      ) : null}

      {/* includes — the value, with crisp check rows */}
      <div className="bx-list">
        <div className="bx-list-label">{L.includes}</div>
        <div className="bx-incl-list">
          {it.includes.map((inc, k) => (
            <RowWrap key={k} className="bx-incl-row" variants={reduce ? undefined : rowV} custom={k}>
              <Wrap className="bx-incl-ic" variants={reduce ? undefined : checkIcV}>
                <Icon name="check" size={13} />
              </Wrap>
              <span>{inc}</span>
            </RowWrap>
          ))}
        </div>
      </div>

      {/* excludes — clearly separated, dimmed, set expectations */}
      {it.excludes && it.excludes.length ? (
        <div className="bx-excludes">
          <div className="bx-list-label bx-list-label-muted">{L.excludes}</div>
          <div className="bx-excl-list">
            {it.excludes.map((ex, k) => (
              <div key={k} className="bx-excl-row">
                <span className="bx-excl-ic"><Cross size={11} /></span>
                <span>{ex}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}

/* Split "From $1,200/mo" / "Desde 1.100 €/mes" into amount + cadence so we
   can style the cadence ("/mo") smaller next to the big number. The styled
   "From" label is rendered separately, so strip it from the amount. */
function splitPrice(price, isEs) {
  const re = isEs ? /^\s*desde\s+/i : /^\s*from\s+/i;
  const rest = price.replace(re, "").trim();
  const slash = rest.indexOf("/");
  if (slash === -1) return { amount: rest, cadence: "" };
  return { amount: rest.slice(0, slash).trim(), cadence: rest.slice(slash).trim() };
}
