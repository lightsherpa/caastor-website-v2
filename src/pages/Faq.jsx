/* Caastor v2 — FAQ page */
import { Button } from "../ds/components.jsx";
import { Reveal, Eyebrow } from "../components/shell.jsx";
import { FinalCTA } from "../components/FinalCTA.jsx";
import { FAQList } from "../components/Faq.jsx";

export function FaqPage({ t, navigate }) {
  const f = t.faq;
  return (
    <div className="page-enter">
      <section className="hero surface-canvas">
        <div className="hero-blobs">
          <span className="blob a" />
        </div>
        <div className="container container-narrow" style={{ position: "relative", zIndex: 1, padding: "84px 28px 56px", textAlign: "center" }}>
          <Reveal>
            <div style={{ marginBottom: 18 }}>
              <Eyebrow>{f.eyebrow}</Eyebrow>
            </div>
          </Reveal>
          <Reveal delay={60}>
            <h1 className="t-display-md balance" style={{ marginBottom: 18 }}>
              {f.h1}
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="pretty" style={{ fontSize: 19, lineHeight: "30px", color: "var(--text-secondary)", maxWidth: 560, margin: "0 auto" }}>
              {f.sub}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-sm surface-canvas" style={{ paddingTop: 0 }}>
        <div className="container container-narrow">
          <Reveal>
            <FAQList items={f.items} />
          </Reveal>
          <Reveal delay={80}>
            <div style={{ marginTop: 48, textAlign: "center", padding: "40px 28px", background: "var(--bg-app)", borderRadius: 18, border: "1px solid var(--border-default)" }}>
              <p className="t-h3" style={{ marginBottom: 16 }}>
                {t.contact.h1}
              </p>
              <Button variant="primary" size="lg" iconEnd="arrowRight" onClick={() => navigate("contact")}>
                {f.cta}
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <FinalCTA t={t} navigate={navigate} />
    </div>
  );
}
