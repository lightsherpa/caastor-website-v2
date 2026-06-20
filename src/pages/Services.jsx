/* Caastor v2 — Services page */
import { Button, Card, Icon } from "../ds/components.jsx";
import { Reveal, Eyebrow } from "../components/shell.jsx";
import { FinalCTA } from "../components/FinalCTA.jsx";

export function ServicesPage({ t, navigate }) {
  const s = t.services;
  return (
    <div className="page-enter">
      <section className="hero surface-canvas">
        <div className="hero-blobs">
          <span className="blob a" />
          <span className="blob b" />
        </div>
        <div className="container" style={{ position: "relative", zIndex: 1, padding: "84px 28px 56px", textAlign: "center" }}>
          <Reveal>
            <div style={{ marginBottom: 18 }}>
              <Eyebrow>{s.eyebrow}</Eyebrow>
            </div>
          </Reveal>
          <Reveal delay={60}>
            <h1 className="t-display-md balance" style={{ marginBottom: 18, maxWidth: 820, margin: "0 auto 18px" }}>
              {s.h1}
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="pretty" style={{ fontSize: 19, lineHeight: "30px", color: "var(--text-secondary)", maxWidth: 640, margin: "0 auto" }}>
              {s.sub}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section surface-canvas" style={{ paddingTop: 24 }}>
        <div className="container">
          <div className="grid grid-2">
            {s.items.map((it, i) => (
              <Reveal key={i} delay={(i % 2) * 90}>
                <Card padded={32} hover style={{ height: "100%" }}>
                  <div className="feature-card">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span className={"icon-tile" + (i % 2 ? " accent" : "")} style={{ width: 52, height: 52 }}>
                        <Icon name={it.icon} size={26} />
                      </span>
                      <span className="t-mono" style={{ fontSize: 13, color: "var(--text-quaternary)" }}>
                        0{i + 1}
                      </span>
                    </div>
                    <h3 className="t-h2" style={{ marginTop: 8, fontSize: 23 }}>
                      {it.title}
                    </h3>
                    <p className="pretty" style={{ fontSize: 16, lineHeight: "25px", color: "var(--text-secondary)" }}>
                      {it.body}
                    </p>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <div style={{ marginTop: 56, display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between", padding: "32px 36px", background: "var(--bg-app)", borderRadius: 18, border: "1px solid var(--border-default)" }}>
              <p className="t-h3 balance" style={{ maxWidth: 560 }}>
                {t.home.services.header}
              </p>
              <Button variant="primary" size="lg" iconEnd="arrowRight" onClick={() => navigate("contact")}>
                {s.cta}
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <FinalCTA t={t} navigate={navigate} />
    </div>
  );
}
