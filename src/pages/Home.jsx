/* Caastor v2 — Home page (thin composition; sections live as components) */
import { Icon } from "../ds/components.jsx";
import { Reveal, SectionHead } from "../components/shell.jsx";
import { Marquee } from "../motion/primitives.jsx";
import { Waves } from "../motion/Waves.jsx";
import { HeroSection } from "../components/Hero.jsx";
import { ShowcaseSection } from "../components/Showcase.jsx";
import { StepsSection } from "../components/Steps.jsx";
import { WhyBento } from "../components/WhyBento.jsx";
import { Testimonials } from "../components/Testimonials.jsx";
import { BundlesSection } from "../components/Bundles.jsx";
import { FinalCTA } from "../components/FinalCTA.jsx";
import { FAQList } from "../components/Faq.jsx";
import "./home-extras.css";

export function HomePage({ t, lang, navigate, logoNames }) {
  const h = t.home;
  const logos = logoNames || h.logos.names;

  return (
    <div className="page-enter">
      {/* 1 · HERO */}
      <HeroSection t={t} lang={lang} navigate={navigate} />

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

      {/* 3 · POSITIONING — dark, premium old-way vs Caastor with an ambient
          brand-tinted wave field behind an elevated glass panel. */}
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

      {/* 5 · WHY CAASTOR — bold bento */}
      <WhyBento t={t} lang={lang} />

      {/* 6 · SERVICES — auto-cycling tabbed showcase */}
      <ShowcaseSection t={t} navigate={navigate} />

      {/* 6b · BUNDLES — outcome-led packages */}
      <BundlesSection t={t} navigate={navigate} />

      {/* 7 · TESTIMONIALS — metric-led proof */}
      <Testimonials t={t} />

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
