/* Caastor v2 — Pricing page */
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Button, Badge, Icon } from "../ds/components.jsx";
import { Reveal, Eyebrow, SectionHead } from "../components/shell.jsx";
import { FinalCTA } from "../components/FinalCTA.jsx";
import { FAQList } from "../components/Faq.jsx";
import "./pricing-extra.css";

function BillingToggle({ p, yearly, setYearly, liveNote }) {
  const b = p.billing;
  // Roving-tabindex radiogroup: the two options behave as radios so AT
  // announces "radio button, 1 of 2 / 2 of 2" and the price-change note.
  const onKeyDown = (e) => {
    switch (e.key) {
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        setYearly(false);
        break;
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        setYearly(true);
        break;
      case "Home":
        e.preventDefault();
        setYearly(false);
        break;
      case "End":
        e.preventDefault();
        setYearly(true);
        break;
      default:
        break;
    }
  };
  const opt = (isYearly, label) => {
    const selected = yearly === isYearly;
    return (
      <button
        type="button"
        role="radio"
        aria-checked={selected}
        tabIndex={selected ? 0 : -1}
        className={"pr-seg-btn" + (selected ? " is-active" : "")}
        onClick={() => setYearly(isYearly)}
        onKeyDown={onKeyDown}
      >
        {label}
      </button>
    );
  };
  return (
    <div className="pr-billing">
      <div
        className="pr-seg"
        role="radiogroup"
        aria-label={b.monthlyLabel + " / " + b.yearlyLabel}
      >
        <span className={"pr-seg-thumb" + (yearly ? " is-yearly" : "")} aria-hidden />
        {opt(false, b.monthlyLabel)}
        {opt(true, b.yearlyLabel)}
      </div>
      <span className="pr-save">
        <Badge tone="success" dot>
          {b.saveLabel}
        </Badge>
      </span>
      <span className="pr-live" role="status" aria-live="polite">
        {liveNote}
      </span>
    </div>
  );
}

function PlanCard({ plan, p, navigate, yearly, lang }) {
  const isPop = plan.popular;
  const reduce = useReducedMotion();
  const amount = yearly ? plan.priceYearly : plan.price;
  const per = yearly ? p.yearlyPer : p.per;
  const inclLabel = lang === "es" ? "Incluido" : "What's included";

  return (
    <article className={"prc-card" + (isPop ? " is-popular" : "")}>
      {isPop && (
        <span className="prc-ribbon">
          <Icon name="sparkles" size={13} />
          {p.popular}
        </span>
      )}

      <div className="prc-head">
        <div className="prc-sku-row">
          <span className="prc-sku">{plan.sku}</span>
        </div>

        <div className="prc-price-row">
          <span className="prc-amount">
            {p.currency === "$" ? "$" : ""}
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={amount}
                initial={reduce ? false : { y: 10, opacity: 0 }}
                animate={reduce ? {} : { y: 0, opacity: 1 }}
                exit={reduce ? {} : { y: -10, opacity: 0 }}
                transition={{ type: "spring", stiffness: 420, damping: 30 }}
                style={{ display: "inline-block" }}
              >
                {amount}
              </motion.span>
            </AnimatePresence>
            {p.currency === "€" ? " €" : ""}
          </span>
          <span className="prc-per">{per}</span>
        </div>
        {p.vat && <div className="prc-vat">{p.vat}</div>}

        <p className="prc-best pretty">{plan.best}</p>
      </div>

      <div className="prc-cta">
        <Button
          variant={plan.variant}
          size="lg"
          full
          iconEnd={plan.variant === "primary" ? "arrowRight" : undefined}
          onClick={() => navigate("contact")}
        >
          {plan.cta}
        </Button>
      </div>

      <div className="prc-body">
        <div className="prc-incl">{inclLabel}</div>
        <ul className="prc-feats">
          {plan.features.map((f, i) => (
            <li key={i} className="prc-feat">
              <span className="prc-feat-ck">
                <Icon name="check" size={13} stroke={2.2} />
              </span>
              {f}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export function PricingPage({ t, navigate, lang }) {
  const p = t.pricing;
  const resolvedLang = lang || (t.code === "ES" ? "es" : "en");
  const [yearly, setYearly] = useState(false);
  // Spoken note for the aria-live region so screen readers hear the
  // billing period + matching unit price change, not just a toggle flip.
  const b = p.billing;
  const liveNote =
    (yearly ? b.yearlyLabel : b.monthlyLabel) + " · " + (yearly ? p.yearlyPer : p.per);
  return (
    <div className="page-enter">
      <section className="hero surface-canvas">
        <div className="hero-blobs">
          <span className="blob a" />
          <span className="blob b" />
        </div>
        <div className="container" style={{ position: "relative", zIndex: 1, padding: "84px 28px 40px", textAlign: "center" }}>
          <Reveal>
            <div style={{ marginBottom: 18 }}>
              <Eyebrow>{p.eyebrow}</Eyebrow>
            </div>
          </Reveal>
          <Reveal delay={60}>
            <h1 className="t-display-md balance" style={{ marginBottom: 18, maxWidth: 760, margin: "0 auto 18px" }}>
              {p.h1a} <span className="serif-accent">{p.h1serif}</span>
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="pretty" style={{ fontSize: 18, lineHeight: "28px", color: "var(--text-secondary)", maxWidth: 660, margin: "0 auto" }}>
              {p.sub}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="surface-canvas" style={{ paddingBottom: 8 }}>
        <div className="container">
          <Reveal>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
              <BillingToggle p={p} yearly={yearly} setYearly={setYearly} liveNote={liveNote} />
            </div>
          </Reveal>
          <div className="prc-plate">
            <div className="prc-grid">
              {p.plans.map((plan, i) => (
                <Reveal key={i} delay={i * 70} style={{ height: "100%" }}>
                  <PlanCard plan={plan} p={p} navigate={navigate} yearly={yearly} lang={resolvedLang} />
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={80}>
            <div style={{ marginTop: 28, display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: "center", textAlign: "center" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--text-secondary)" }}>
                <Icon name="check" size={16} color="var(--status-success)" /> {p.helper}
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-sm surface-canvas">
        <div className="container container-narrow">
          <Reveal>
            <div style={{ background: "var(--bg-app)", border: "1px solid var(--border-default)", borderRadius: 18, padding: "30px 32px", display: "flex", gap: 18, alignItems: "flex-start" }}>
              <span className="icon-tile" style={{ flexShrink: 0 }}>
                <Icon name="flag" size={22} />
              </span>
              <div>
                <p className="pretty" style={{ fontSize: 16, lineHeight: "25px", color: "var(--text-primary)", fontWeight: 600, marginBottom: 8 }}>
                  {p.anchor}
                </p>
                <p className="pretty" style={{ fontSize: 15, lineHeight: "24px", color: "var(--text-secondary)" }}>
                  {p.risk}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section surface-app hairline-top">
        <div className="container container-narrow">
          <Reveal>
            <SectionHead eyebrow={p.eyebrow} title={p.faqHeader} align="center" />
          </Reveal>
          <Reveal delay={80}>
            <div style={{ marginTop: 36 }}>
              <FAQList items={p.faqs} />
            </div>
          </Reveal>
        </div>
      </section>

      <FinalCTA t={t} navigate={navigate} />
    </div>
  );
}
