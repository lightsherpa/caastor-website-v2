/* Caastor v2 — Home page */
import { Button, Card, Badge, Avatar, AvatarGroup, Icon } from "../ds/components.jsx";
import { Reveal, Eyebrow, SectionHead } from "../components/shell.jsx";
import { ScrollTilt, HeroHeadline, SlotWord, MagneticCursor, Marquee, CountUp } from "../motion/primitives.jsx";
import { HeroCanvas } from "../motion/HeroCanvas.jsx";
import { ShowcaseSection } from "../components/Showcase.jsx";
import { StepsSection } from "../components/Steps.jsx";
import { PlatformMock } from "../components/PlatformMock.jsx";
import { BundlesSection } from "../components/Bundles.jsx";
import { FinalCTA } from "../components/FinalCTA.jsx";
import { FAQList } from "../components/Faq.jsx";
import { bookingProps } from "../lib/booking.js";

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

  return (
    <div className="page-enter">
      {/* 1 · HERO — dark, Three.js particle field + crisp product */}
      <section className="hero hero--dark">
        <div className="hero-fallback" aria-hidden="true" />
        <HeroCanvas />
        <MagneticCursor />
        <div className="container" style={{ position: "relative", zIndex: 1, padding: "124px 28px 96px" }}>
          <div className="hero-stack">
            <Reveal>
              <div style={{ marginBottom: 24, display: "flex", justifyContent: "center" }}>
                <Eyebrow>{h.hero.eyebrow}</Eyebrow>
              </div>
            </Reveal>
            <HeroHeadline
              a={h.hero.h1a}
              serif={h.hero.h1serif}
              b={h.hero.h1b}
              className="t-display-lg balance hero-h1"
              style={{ marginBottom: 16, textAlign: "center" }}
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
               paints with first paint instead of after the reveal. */}
            <p className="pretty" style={{ fontSize: 19, lineHeight: "30px", color: "rgba(255,255,255,0.72)", maxWidth: 580, margin: "20px auto 34px", textAlign: "center" }}>
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

          <div className="hero-stage">
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

      {/* 3 · POSITIONING — editorial old-way vs Caastor contrast */}
      <section className="section surface-canvas">
        <div className="container">
          <div className="pos-wrap">
            <div className="pos-lead">
              <Reveal>
                <h2 className="t-display-md balance" style={{ margin: "0 0 20px" }}>
                  {h.intro.headlineA} <span className="serif-accent">{h.intro.headlineSerif}</span>
                </h2>
              </Reveal>
              <Reveal delay={120}>
                <p className="pretty" style={{ fontSize: 19, lineHeight: "31px", color: "var(--text-secondary)", maxWidth: 460, marginBottom: 26 }}>
                  {h.intro.body}
                </p>
              </Reveal>
              <Reveal delay={160}>
                <span
                  className="text-link"
                  style={{ fontSize: 16, cursor: "pointer" }}
                  onClick={() => document.getElementById("how")?.scrollIntoView({ behavior: "smooth" })}
                >
                  {h.intro.cta}
                </span>
              </Reveal>
            </div>

            <Reveal delay={120} style={{ minWidth: 0 }}>
              <div className="pos-compare">
                <div className="pos-col is-old">
                  <div className="pos-col-h">{lang === "es" ? "Lo de siempre" : "The old way"}</div>
                  {(lang === "es"
                    ? ["Briefs perdidos en cadenas de email", "Plazos de 3 a 4 semanas", "Un junior distinto cada vez", "Presupuestos por proyecto", "Recursos dispersos en chats"]
                    : ["Briefs lost in email threads", "Three to four week turnarounds", "A different junior each time", "Per-project quotes and scope creep", "Assets scattered across chats"]
                  ).map((x, i) => (
                    <div key={i} className="pos-row is-old">
                      <span className="pos-x"><Icon name="plus" size={12} style={{ transform: "rotate(45deg)" }} /></span>
                      <span>{x}</span>
                    </div>
                  ))}
                </div>
                <div className="pos-col is-new">
                  <div className="pos-col-h">{lang === "es" ? "Con Caastor" : "With Caastor"}</div>
                  {(lang === "es"
                    ? ["Una plataforma para briefs, feedback y recursos", "Primeras propuestas en 48 horas", "El mismo equipo senior, siempre", "Una tarifa plana al mes, cancela cuando quieras", "Toda tu Brand Library en un sitio"]
                    : ["One platform for briefs, feedback and assets", "First drafts in 48 hours", "The same senior team, every time", "One flat monthly fee, cancel anytime", "Your whole Brand Library in one place"]
                  ).map((x, i) => (
                    <div key={i} className="pos-row is-new">
                      <span className="pos-check"><Icon name="check" size={13} /></span>
                      <span>{x}</span>
                    </div>
                  ))}
                </div>
              </div>
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
            {/* Quality — large cell */}
            <Reveal className="why-cell why-cell--lg" delay={0}>
              <div className="why-visual">
                <div className="why-swatches">
                  {["var(--brand)", "var(--brand-strong)", "var(--accent)", "#3DD68C", "#0B1B2F"].map((c, i) => (
                    <span key={i} style={{ background: c }} />
                  ))}
                </div>
                <AvatarGroup
                  size={34}
                  avatars={[{ name: "Ana L" }, { name: "Sam K" }, { name: "Mara R" }, { name: "Joe T" }, { name: "Bea N" }]}
                />
              </div>
              <div className="why-body">
                <h3 className="t-h3">{h.why.benefits[0].title}</h3>
                <p className="pretty">{h.why.benefits[0].body}</p>
              </div>
            </Reveal>

            {/* Friction — merge visual */}
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

            {/* Speed — big number + bars */}
            <Reveal className="why-cell why-cell--speed" delay={150}>
              <div className="why-speed">
                <div className="why-48"><span>48</span><i>h</i></div>
                <div className="why-bars">
                  {[40, 64, 88, 100].map((hgt, i) => (
                    <span key={i} style={{ height: hgt + "%" }} />
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
                {h.testimonials.quotes.map((qt, i) => (
                  <div key={i} className="tm-card">
                    <Card padded={26} style={{ height: "100%" }}>
                      <div className="tm-inner">
                        <div className="tm-metric">
                          <span className="tm-metric-v">{qt.metric}</span>
                          <span className="tm-metric-l">{qt.metricLabel}</span>
                        </div>
                        <p className="balance tm-quote">&ldquo;{qt.quote}&rdquo;</p>
                        <div className="tm-person">
                          <Avatar src={qt.photo} name={qt.name} size={40} />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 14 }}>{qt.name}</div>
                            <div style={{ fontSize: 13, color: "var(--text-tertiary)" }}>{qt.role}</div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </Marquee>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 8 · PRICING TEASER */}
      <section className="section surface-app hairline-top">
        <div className="container">
          <Reveal>
            <Card padded={0} style={{ overflow: "hidden", borderRadius: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", alignItems: "stretch" }} className="grid-2">
                <div style={{ padding: "48px 44px" }}>
                  <h2 className="t-display-sm balance" style={{ marginBottom: 16 }}>
                    {h.pricingTeaser.header}
                  </h2>
                  <p className="pretty" style={{ fontSize: 17, lineHeight: "27px", color: "var(--text-secondary)", maxWidth: 420, marginBottom: 28 }}>
                    {h.pricingTeaser.sub}
                  </p>
                  <Button variant="primary" size="lg" iconEnd="arrowRight" onClick={() => navigate("pricing")}>
                    {t.cta.compare}
                  </Button>
                </div>
                <div style={{ background: "var(--bg-inverse)", color: "var(--text-inverse)", padding: "48px 44px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 18 }}>
                  {[
                    { v: 60, suffix: "%", l: lang === "es" ? "más rápido que contratar" : "faster than hiring in-house" },
                    { v: 48, suffix: "h", l: lang === "es" ? "primeras propuestas" : "to first drafts" },
                    { v: null, l: lang === "es" ? "peticiones, una tarifa plana" : "requests, one flat fee" },
                  ].map((s, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
                      <span style={{ fontWeight: 800, fontSize: 40, letterSpacing: "-0.03em", color: "var(--brand)", minWidth: 90 }}>
                        {s.v === null ? "∞" : <CountUp to={s.v} suffix={s.suffix} />}
                      </span>
                      <span style={{ fontSize: 15, color: "rgba(255,255,255,0.7)" }}>{s.l}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </Reveal>
        </div>
      </section>

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
