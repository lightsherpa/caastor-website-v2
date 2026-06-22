/* Caastor v2 — Home page */
import { Button, Card, Icon } from "../ds/components.jsx";
import { Reveal, Eyebrow, SectionHead } from "../components/shell.jsx";
import { ScrollTilt, HeroHeadline, SlotWord, MagneticCursor, Marquee } from "../motion/primitives.jsx";
import { useReducedMotion } from "motion/react";
import { HeroCanvas } from "../motion/HeroCanvas.jsx";
import { Waves } from "../motion/Waves.jsx";
import { ShowcaseSection } from "../components/Showcase.jsx";
import { StepsSection } from "../components/Steps.jsx";
import { PlatformMock } from "../components/PlatformMock.jsx";
import { BundlesSection } from "../components/Bundles.jsx";
import { FinalCTA } from "../components/FinalCTA.jsx";
import { FAQList } from "../components/Faq.jsx";
import { bookingProps } from "../lib/booking.js";
import "./home-extras.css";

/* Brand monogram for testimonials: derive 1-2 letters from the company
   in qt.role (the part after the comma, e.g. "CEO, Geoking" -> "GE"),
   with a deterministic brand-family tint per company. No fabricated faces. */
const MONOGRAM_TINTS = [
  "linear-gradient(135deg, var(--brand), var(--brand-strong))",
  "linear-gradient(135deg, var(--accent), var(--brand-strong))",
  "linear-gradient(135deg, var(--brand-strong), #0B1B2F)",
  "linear-gradient(135deg, #3DD68C, var(--brand-strong))",
];
function companyFromRole(role = "") {
  const after = role.includes(",") ? role.slice(role.indexOf(",") + 1) : role;
  return after.trim();
}
function monogram(company = "") {
  const words = company.split(/\s+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return company.slice(0, 2).toUpperCase();
}

/* ── Hero visual — real platform screen in a browser frame, with
   Rever-style floating UI fragments layered forward in 3D ─────── */
function HeroVisual({ lang }) {
  const L =
    lang === "es"
      ? { draft: "Borrador listo", ago: "hace 2 min", fast: "Entregado en 48h", live: "En curso", cta: "Reservar demo" }
      : { draft: "Draft ready", ago: "2 min ago", fast: "Shipped in 48h", live: "On track", cta: "Book a demo" };
  return (
    <div
      style={{ position: "relative", transformStyle: "preserve-3d", cursor: "pointer" }}
      data-cursor={L.cta}
      {...bookingProps}
    >
      <div className="browser-frame" style={{ boxShadow: "var(--shadow-xl)" }}>
        <div className="browser-bar">
          <span className="browser-dots">
            <span style={{ background: "#FF5F57" }} />
            <span style={{ background: "#FEBC2E" }} />
            <span style={{ background: "#28C840" }} />
          </span>
          <div className="browser-url">app.caastor.co</div>
          <span style={{ width: 52 }} />
        </div>
        <PlatformMock lang={lang} />
      </div>

      {/* floating draft-ready toast (front layer) */}
      <div
        className="hero-float"
        style={{ left: -26, bottom: -26, transform: "translateZ(55px)", display: "flex", alignItems: "center", gap: 12 }}
      >
        <div style={{ width: 34, height: 34, borderRadius: 9, background: "var(--status-success-soft)", color: "var(--status-success)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name="check" size={18} />
        </div>
        <div style={{ whiteSpace: "nowrap" }}>
          <div style={{ fontSize: 13, fontWeight: 700 }}>{L.draft}</div>
          <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{L.ago}</div>
        </div>
      </div>

      {/* floating turnaround chip (front layer) */}
      <div
        className="hero-float"
        style={{ left: -34, top: 64, transform: "translateZ(78px)", display: "flex", alignItems: "center", gap: 9, padding: "9px 13px" }}
      >
        <span style={{ width: 8, height: 8, borderRadius: 999, background: "var(--brand)", boxShadow: "0 0 0 4px rgba(var(--brand-glow),0.18)" }} />
        <span style={{ fontSize: 13, fontWeight: 700, whiteSpace: "nowrap" }}>{L.fast}</span>
      </div>

      {/* mascot peek (front-most) */}
      <img
        src="/assets/mascot-yellow.png"
        alt=""
        style={{ position: "absolute", right: -28, top: -34, width: 74, transform: "rotate(8deg) translateZ(96px)", filter: "drop-shadow(0 10px 22px rgba(0,0,0,0.16))" }}
      />
    </div>
  );
}

export function HomePage({ t, lang, navigate, logoNames }) {
  const h = t.home;
  const logos = logoNames || h.logos.names;
  const reduce = useReducedMotion();

  return (
    <div className="page-enter">
      {/* 1 · HERO — dark, Three.js particle field + crisp product */}
      <section className="hero hero--dark">
        <div className="hero-fallback" aria-hidden="true" />
        <HeroCanvas />
        <MagneticCursor />
        {/* H-2/H-3: tightened hero so headline + rotor + one sub line stay
            <= 4 lines and the platform mock sits above the fold on a laptop. */}
        <div className="container" style={{ position: "relative", zIndex: 1, padding: "84px 28px 52px" }}>
          <div className="hero-stack">
            <Reveal>
              <div style={{ marginBottom: 18, display: "flex", justifyContent: "center" }}>
                <Eyebrow>{h.hero.eyebrow}</Eyebrow>
              </div>
            </Reveal>
            <HeroHeadline
              a={h.hero.h1a}
              serif={h.hero.h1serif}
              b={h.hero.h1b}
              className="t-display-lg balance hero-h1"
              style={{ marginBottom: 14, textAlign: "center" }}
            />
            <Reveal delay={90}>
              <div className="hero-rotor">
                <span className="hero-rotor-pre">{lang === "es" ? "Diseño para" : "Creative for"}</span>
                <SlotWord
                  className="hero-rotor-word"
                  words={lang === "es"
                    ? ["webs", "marcas", "redes", "decks", "ads", "campañas"]
                    : ["websites", "brands", "social", "decks", "ads", "campaigns"]}
                />
              </div>
            </Reveal>
            {/* Rendered statically (no fade) so it's the LCP element and
               paints with first paint instead of after the reveal.
               Intentional on-dark-hero white kept. */}
            <p className="pretty" style={{ fontSize: 18, lineHeight: "28px", color: "rgba(255,255,255,0.72)", maxWidth: 560, margin: "16px auto 26px", textAlign: "center" }}>
              {h.hero.sub}
            </p>
            <Reveal delay={180}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
                <Button variant="primary" size="lg" iconEnd="arrowRight" className="btn-cta" {...bookingProps}>
                  {h.hero.ctaPrimary}
                </Button>
                <Button variant="outline" size="lg" style={{ color: "#fff", borderColor: "rgba(255,255,255,0.28)" }} onClick={() => navigate("pricing")}>
                  {h.hero.ctaSecondary}
                </Button>
              </div>
            </Reveal>
          </div>

          {/* marginTop override pulls the stage up so it crests the fold */}
          <div className="hero-stage" style={{ marginTop: 32 }}>
            <ScrollTilt>
              <HeroVisual lang={lang} />
            </ScrollTilt>
          </div>
        </div>
      </section>

      {/* 2 · LOGO BAR */}
      <section className="section-sm surface-app hairline-top">
        <div className="container">
          <Reveal>
            <p className="balance" style={{ textAlign: "center", maxWidth: 760, margin: "0 auto 8px", fontSize: 17, fontWeight: 600, color: "var(--text-secondary)", lineHeight: "26px" }}>
              {h.logos.headline}
            </p>
            <p style={{ textAlign: "center", marginBottom: 28, fontSize: 13, fontStyle: "italic", color: "var(--text-tertiary)" }}>{h.logos.eyebrow}</p>
            <Marquee speed={42} gap={16}>
              {logos.map((n, i) => {
                const name = typeof n === "string" ? n : n.name;
                const image = typeof n === "object" ? n.image : null;
                return image ? (
                  <img key={i} className="logo-img" src={image} alt={name} loading="lazy" />
                ) : (
                  <span key={i} className="logo-chip">
                    {name}
                  </span>
                );
              })}
            </Marquee>
          </Reveal>
        </div>
      </section>

      {/* 3 · POSITIONING — H-5: dark, premium old-way vs Caastor with an
          ambient brand-tinted wave field behind an elevated glass panel. */}
      <section className="section pos-section">
        <Waves className="pos-waves" strokeColor="rgba(245,180,0,0.13)" />
        <div className="container">
          <div className="cmp-wrap">
            <Reveal>
              <h2 className="t-display-md balance pos-h2">
                {h.intro.headlineA} <span className="serif-accent">{h.intro.headlineSerif}</span>
              </h2>
            </Reveal>
            <Reveal delay={90}>
              <p className="pretty pos-sub">{h.intro.body}</p>
            </Reveal>

            <Reveal delay={140} style={{ minWidth: 0 }}>
              <div className="cmp-panel">
                <div className="cmp-col is-old">
                  <div className="cmp-col-h">{h.intro.compare.oldLabel}</div>
                  {h.intro.compare.old.map((x, i) => (
                    <div key={i} className="cmp-row">
                      <span className="cmp-mark is-x"><Icon name="plus" size={12} style={{ transform: "rotate(45deg)" }} /></span>
                      <span>{x}</span>
                    </div>
                  ))}
                </div>

                <div className="cmp-divider" aria-hidden="true">
                  <span className="cmp-arrow"><Icon name="arrowRight" size={18} /></span>
                </div>

                <div className="cmp-col is-new">
                  <div className="cmp-col-h">{h.intro.compare.newLabel}</div>
                  {h.intro.compare.new.map((x, i) => (
                    <div key={i} className="cmp-row">
                      <span className="cmp-mark is-check"><Icon name="check" size={13} /></span>
                      <span>{x}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={180}>
              <span
                className="pos-link"
                onClick={() => document.getElementById("how")?.scrollIntoView({ behavior: "smooth" })}
              >
                {h.intro.cta}
              </span>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 4 · STEPS TO SUCCESS — connected auto-stepper */}
      <StepsSection t={t} lang={lang} />

      {/* 5 · WHY CAASTOR — bento, each cell shows the benefit visually */}
      <section className="section surface-canvas">
        <div className="container">
          <Reveal>
            <SectionHead title={h.why.header} max={680} />
          </Reveal>
          <div className="why-bento">
            {/* Quality — large cell: brand swatches + senior team chips, then
                a real cost-vs-in-house comparison chart (H-6). */}
            <Reveal className="why-cell why-cell--lg" delay={0}>
              <div className="why-visual">
                <div className="why-swatches">
                  {["var(--brand)", "var(--brand-strong)", "var(--accent)", "#3DD68C", "#0B1B2F"].map((c, i) => (
                    <span key={i} style={{ background: c }} />
                  ))}
                </div>
                <div className="wv-cost" role="img"
                  aria-label={lang === "es" ? "Coste de Caastor frente a un equipo interno" : "Caastor cost versus in house team"}>
                  <div className="wv-cost-col is-them">
                    <span className="wv-cost-amt">$12k+</span>
                    <div className="wv-cost-bar is-them" style={{ height: 120, transform: reduce ? "none" : "scaleY(0)", animation: reduce ? "none" : "wvRise 0.7s 0.1s cubic-bezier(0.22,0.61,0.36,1) forwards" }} />
                    <span className="wv-cost-cap">{lang === "es" ? "Equipo interno" : "In house team"}</span>
                  </div>
                  <div className="wv-cost-col is-us">
                    <span className="wv-cost-amt">{lang === "es" ? "Desde 750 €" : "From $800"}</span>
                    <div className="wv-cost-bar is-us" style={{ height: 48, transform: reduce ? "none" : "scaleY(0)", animation: reduce ? "none" : "wvRise 0.7s 0.22s cubic-bezier(0.22,0.61,0.36,1) forwards" }} />
                    <span className="wv-cost-cap">Caastor</span>
                  </div>
                </div>
              </div>
              <div className="why-body">
                <h3 className="t-h3">{h.why.benefits[0].title}</h3>
                <p className="pretty">{h.why.benefits[0].body}</p>
              </div>
            </Reveal>

            {/* Friction — many tools merge into one platform */}
            <Reveal className="why-cell" delay={90}>
              <div className="why-merge">
                {[["inbox", lang === "es" ? "Briefs" : "Briefs"], ["message", lang === "es" ? "Feedback" : "Feedback"], ["layers", lang === "es" ? "Recursos" : "Assets"]].map(([ic, lb], i) => (
                  <span key={i} className="why-merge-chip"><Icon name={ic} size={13} />{lb}</span>
                ))}
                <span className="why-merge-arrow"><Icon name="arrowRight" size={14} /></span>
                <span className="why-merge-one"><span className="why-merge-mark">C</span>{lang === "es" ? "Una plataforma" : "One platform"}</span>
              </div>
              <div className="why-body">
                <h3 className="t-h3">{h.why.benefits[1].title}</h3>
                <p className="pretty">{h.why.benefits[1].body}</p>
              </div>
            </Reveal>

            {/* Speed — turnaround comparison bars with labels (H-6) */}
            <Reveal className="why-cell why-cell--speed" delay={150}>
              <div className="why-visual" style={{ minHeight: 0 }}>
                <div className="wv-turn">
                  {[
                    { name: lang === "es" ? "Agencia" : "Agency", val: lang === "es" ? "3 a 4 sem" : "3 to 4 wks", w: "100%", slow: true },
                    { name: lang === "es" ? "Freelance" : "Freelance", val: lang === "es" ? "1 sem" : "1 wk", w: "62%", slow: true },
                    { name: "Caastor", val: lang === "es" ? "48 h" : "48 h", w: "26%", slow: false },
                  ].map((r, i) => (
                    <div key={i} className={"wv-turn-row " + (r.slow ? "is-slow" : "is-fast")}>
                      <span className="wv-turn-name">{r.name}</span>
                      <div className="wv-turn-track">
                        <span
                          className={"wv-turn-fill " + (r.slow ? "is-slow" : "is-fast")}
                          style={{ width: r.w, transform: reduce ? "none" : "scaleX(0)", animation: reduce ? "none" : `wvGrow 0.65s ${0.12 + i * 0.12}s cubic-bezier(0.22,0.61,0.36,1) forwards` }}
                        />
                      </div>
                      <span className="wv-turn-val">{r.val}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="why-body">
                <h3 className="t-h3">{h.why.benefits[2].title}</h3>
                <p className="pretty">{h.why.benefits[2].body}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 6 · SERVICES — auto-cycling tabbed showcase */}
      <ShowcaseSection t={t} navigate={navigate} />

      {/* 6b · BUNDLES — outcome-led packages */}
      <BundlesSection t={t} navigate={navigate} />

      {/* 7 · TESTIMONIALS — metric-led proof, not just quotes */}
      <section className="section surface-canvas">
        <div className="container">
          <Reveal>
            <SectionHead title={h.testimonials.header} max={680} />
          </Reveal>
          <Reveal>
            <div style={{ marginTop: 48 }}>
              <Marquee speed={52} gap={20}>
                {h.testimonials.quotes.map((qt, i) => {
                  const company = companyFromRole(qt.role);
                  return (
                  <div key={i} className="tm-card">
                    <Card padded={26} style={{ height: "100%" }}>
                      <div className="tm-inner">
                        <div className="tm-metric">
                          <span className="tm-metric-v">{qt.metric}</span>
                          <span className="tm-metric-l">{qt.metricLabel}</span>
                        </div>
                        <p className="balance tm-quote">&ldquo;{qt.quote}&rdquo;</p>
                        <div className="tm-person">
                          {/* T-1: branded company monogram chip (no fabricated faces) */}
                          <span
                            className="tm-monogram"
                            style={{ background: MONOGRAM_TINTS[i % MONOGRAM_TINTS.length] }}
                            role="img"
                            aria-label={company}
                          >
                            {monogram(company)}
                          </span>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 14 }}>{qt.name}</div>
                            <div style={{ fontSize: 13, color: "var(--text-tertiary)" }}>{qt.role}</div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                  );
                })}
              </Marquee>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 8 · PRICING TEASER — removed (P-1) */}

      {/* 9 · FAQ TEASER */}
      <section className="section surface-canvas">
        <div className="container container-narrow">
          <Reveal>
            <SectionHead title={h.faqTeaser.header} align="center" />
          </Reveal>
          <Reveal delay={80}>
            <div style={{ marginTop: 40 }}>
              <FAQList items={t.faq.items.slice(0, 4)} />
            </div>
            <div style={{ marginTop: 28, textAlign: "center" }}>
              <span className="text-link" style={{ fontSize: 16, cursor: "pointer" }} onClick={() => navigate("faq")}>
                {h.faqTeaser.cta}
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 10 · FINAL CTA */}
      <FinalCTA t={t} navigate={navigate} />
    </div>
  );
}
