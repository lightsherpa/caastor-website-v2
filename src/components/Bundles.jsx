/* ──────────────────────────────────────────────────────────────────
   Caastor v2 — Bundles: outcome-led service packages.
   Replaces the generic "list of services" with curated bundles that
   show value (price, who it's for, when to pick it, what's included
   AND what's not) rather than describe it.
   ────────────────────────────────────────────────────────────────── */
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
      strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

const LABELS = {
  en: { from: "From", useCase: "Best for", includes: "Includes", excludes: "Not included" },
  es: { from: "Desde", useCase: "Ideal para", includes: "Incluye", excludes: "No incluye" },
};

export function BundlesSection({ t, navigate, lang }) {
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

        <div className="bundles">
          {b.items.map((it, i) => (
            <Reveal key={i} delay={i * 90} className={"bundle" + (it.accent === "brand" ? " is-feature" : "")}>
              <div className="bundle-bar" style={{ background: ACCENT[it.accent] || ACCENT.brand }} />
              <div className="bundle-head">
                <span className="bundle-name">{it.name}</span>
                {it.tag ? <span className="bundle-tag">{it.tag}</span> : null}
              </div>
              <div className="bundle-for">{it.forWho}</div>

              {/* B-4: clear "from" price anchor */}
              {it.price ? (
                <div className="bx-price">
                  <span className="bx-price-from">{L.from}</span>
                  <span className="bx-price-amount">{stripFrom(it.price, isEs)}</span>
                </div>
              ) : null}

              <p className="bundle-desc">{it.desc}</p>

              {/* B-2: surface the use case — audience + when to pick it */}
              {it.useCase ? (
                <div className="bx-usecase">
                  <span className="bx-usecase-ic"><Icon name="users" size={16} /></span>
                  <span className="bx-usecase-text">
                    <strong style={{ color: "var(--text-primary)", fontWeight: 700 }}>{L.useCase}: </strong>
                    {it.useCase}
                  </span>
                </div>
              ) : null}

              <div className="bx-list-label">{L.includes}</div>
              <div className="bundle-incl">
                {it.includes.map((inc, k) => (
                  <div key={k} className="bundle-incl-row">
                    <span className="bundle-incl-ic"><Icon name="check" size={13} /></span>
                    {inc}
                  </div>
                ))}
              </div>

              {/* B-1: what this bundle does NOT include, clearly separated */}
              {it.excludes && it.excludes.length ? (
                <div className="bx-excludes">
                  <div className="bx-list-label">{L.excludes}</div>
                  <div className="bx-excl-list">
                    {it.excludes.map((ex, k) => (
                      <div key={k} className="bx-excl-row">
                        <span className="bx-excl-ic"><Cross size={11} /></span>
                        {ex}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="bundle-foot">
                <Button
                  variant={it.accent === "brand" ? "primary" : "outline"}
                  size="md"
                  full
                  iconEnd="arrowRight"
                  {...bookingProps}
                >
                  {b.ctaPrimary}
                </Button>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="bundles-foot">
            <span className="text-link" style={{ fontSize: 16, cursor: "pointer" }} onClick={() => navigate("contact")}>
              {b.ctaSecondary}
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* Drop a leading "From "/"Desde " so the styled "from" label isn't doubled,
   while keeping the full amount + cadence (e.g. "$800/mo", "750 €/mes"). */
function stripFrom(price, isEs) {
  const re = isEs ? /^\s*desde\s+/i : /^\s*from\s+/i;
  return price.replace(re, "").trim();
}
