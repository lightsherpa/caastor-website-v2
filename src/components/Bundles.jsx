/* ──────────────────────────────────────────────────────────────────
   Caastor v2 — Bundles: outcome-led service packages.
   Premium, conversion-grade comparison cards. The "Most popular" card
   (accent "brand") is elevated: scaled up, dark fill, floating ribbon.
   Each card carries a prominent price anchor, a use-case rail, and a
   crisp includes-vs-excludes split. All data bindings + booking CTA
   are preserved.
   ────────────────────────────────────────────────────────────────── */
import { useReducedMotion } from "motion/react";
import { Button, Icon } from "../ds/components.jsx";
import { Reveal, SectionHead } from "./shell.jsx";
import { bookingProps } from "../lib/booking.js";
import "./bundles-extra.css";

const ACCENT = {
  brand: "linear-gradient(135deg, var(--brand), var(--brand-strong))",
  accent: "linear-gradient(135deg, #FF8A3D, #F5B400)",
  indigo: "linear-gradient(135deg, var(--accent), #6D5BD6)",
};

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
          {b.items.map((it, i) => {
            const feature = it.accent === "brand";
            const bar = ACCENT[it.accent] || ACCENT.brand;
            return (
              <Reveal
                key={i}
                delay={i * 90}
                className={"bx-card" + (feature ? " is-feature" : "") + (reduce ? " no-motion" : "")}
              >
                {/* glow halo for the feature card */}
                {feature ? <span className="bx-halo" aria-hidden /> : null}

                {/* top accent bar — brand identity per bundle */}
                <span className="bx-accentbar" style={{ background: bar }} aria-hidden />

                {/* floating ribbon for the popular card */}
                {it.tag ? (
                  <span className="bx-ribbon">
                    <Icon name="sparkles" size={12} />
                    {it.tag}
                  </span>
                ) : null}

                <div className="bx-top">
                  <div className="bx-name-row">
                    <span className="bx-name">{it.name}</span>
                  </div>
                  <div className="bx-for">{it.forWho}</div>

                  {/* price anchor — the headline number */}
                  {it.price ? (
                    <div className="bx-price">
                      <span className="bx-price-from">{L.from}</span>
                      <span className="bx-price-amount">{splitPrice(it.price, isEs).amount}</span>
                      {splitPrice(it.price, isEs).cadence ? (
                        <span className="bx-price-cadence">{splitPrice(it.price, isEs).cadence}</span>
                      ) : null}
                    </div>
                  ) : null}

                  <p className="bx-desc">{it.desc}</p>
                </div>

                {/* CTA pinned near the price for fast conversion */}
                <div className="bx-cta">
                  <Button
                    variant={feature ? "primary" : "outline"}
                    size="md"
                    full
                    iconEnd="arrowRight"
                    {...bookingProps}
                  >
                    {b.ctaPrimary}
                  </Button>
                </div>

                {/* use-case rail — concrete audience + when to pick it */}
                {it.useCase ? (
                  <div className="bx-usecase">
                    <span className="bx-usecase-ic"><Icon name="users" size={15} /></span>
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
                      <div key={k} className="bx-incl-row">
                        <span className="bx-incl-ic"><Icon name="check" size={13} /></span>
                        <span>{inc}</span>
                      </div>
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
              </Reveal>
            );
          })}
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
