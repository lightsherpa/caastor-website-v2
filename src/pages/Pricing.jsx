/* Caastor v2 — Pricing page */
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Button, Card, Badge, Icon } from "../ds/components.jsx";
import { Reveal, Eyebrow, SectionHead } from "../components/shell.jsx";
import { FinalCTA } from "../components/FinalCTA.jsx";
import { FAQList } from "../components/Faq.jsx";
import "./pricing-extra.css";

function BillingToggle({ p, yearly, setYearly }) {
  const b = p.billing;
  return (
    <div className="pr-billing">
      <div className="pr-seg" role="group" aria-label={b.monthlyLabel + " / " + b.yearlyLabel}>
        <span className={"pr-seg-thumb" + (yearly ? " is-yearly" : "")} aria-hidden />
        <button
          type="button"
          className={"pr-seg-btn" + (!yearly ? " is-active" : "")}
          aria-pressed={!yearly}
          onClick={() => setYearly(false)}
        >
          {b.monthlyLabel}
        </button>
        <button
          type="button"
          className={"pr-seg-btn" + (yearly ? " is-active" : "")}
          aria-pressed={yearly}
          onClick={() => setYearly(true)}
        >
          {b.yearlyLabel}
        </button>
      </div>
      <span className="pr-save">
        <Badge tone="success" dot>
          {b.saveLabel}
        </Badge>
      </span>
    </div>
  );
}

function PlanCard({ plan, p, navigate, yearly }) {
  const isPop = plan.popular;
  const reduce = useReducedMotion();
  const amount = yearly ? plan.priceYearly : plan.price;
  const per = yearly ? p.yearlyPer : p.per;
  return (
    <Card padded={26} hover style={{ height: "100%", position: "relative" }} className={isPop ? "plan-popular-ring" : undefined}>
      {isPop && <span className="plan-crown" />}
      <div className="plan">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: 24 }}>
          <span className="t-overline" style={{ color: "var(--text-secondary)", fontSize: 12 }}>
            {plan.sku}
          </span>
          {isPop && (
            <Badge tone="brand" dot>
              {p.popular}
            </Badge>
          )}
        </div>
        <div>
          <div className="plan-price" style={{ display: "flex", alignItems: "baseline" }}>
            <span style={{ fontWeight: 800, fontSize: 40, letterSpacing: "-0.03em", display: "inline-flex", alignItems: "baseline" }}>
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
            <span style={{ fontSize: 15, color: "var(--text-tertiary)", marginLeft: 4 }}>{per}</span>
          </div>
          {p.vat && <div style={{ fontSize: 12, color: "var(--text-quaternary)", marginTop: 2 }}>{p.vat}</div>}
        </div>
        <p className="pretty" style={{ fontSize: 13.5, lineHeight: "20px", color: "var(--text-tertiary)", minHeight: 40 }}>
          {plan.best}
        </p>
        <Button
          variant={plan.variant}
          size="md"
          full
          iconEnd={plan.variant === "primary" ? "arrowRight" : undefined}
          onClick={() => navigate("contact")}
        >
          {plan.cta}
        </Button>
        <ul className="plan-features" style={{ marginTop: 4 }}>
          {plan.features.map((f, i) => (
            <li key={i} className="plan-feature">
              <span className="ck">
                <Icon name="check" size={16} />
              </span>
              {f}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

export function PricingPage({ t, navigate }) {
  const p = t.pricing;
  const [yearly, setYearly] = useState(false);
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
              <BillingToggle p={p} yearly={yearly} setYearly={setYearly} />
            </div>
          </Reveal>
          <div className="plan-grid">
            {p.plans.map((plan, i) => (
              <Reveal key={i} delay={i * 70}>
                <PlanCard plan={plan} p={p} navigate={navigate} yearly={yearly} />
              </Reveal>
            ))}
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
