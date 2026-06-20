/* Caastor v2 — About page */
import { Card, Icon } from "../ds/components.jsx";
import { Reveal, Eyebrow, SectionHead } from "../components/shell.jsx";
import { FinalCTA } from "../components/FinalCTA.jsx";

export function AboutPage({ t, navigate }) {
  const a = t.about;
  return (
    <div className="page-enter">
      <section className="hero surface-canvas">
        <div className="hero-blobs">
          <span className="blob a" />
          <span className="blob b" />
        </div>
        <div className="container" style={{ position: "relative", zIndex: 1, padding: "84px 28px 64px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.1fr) minmax(0,0.9fr)", gap: 56, alignItems: "center" }} className="hero-grid">
            <div>
              <Reveal>
                <div style={{ marginBottom: 18 }}>
                  <Eyebrow>{a.eyebrow}</Eyebrow>
                </div>
              </Reveal>
              <Reveal delay={60}>
                <h1 className="t-display-md balance" style={{ marginBottom: 24 }}>
                  {a.h1a} <span className="serif-accent">{a.h1serif}</span>
                </h1>
              </Reveal>
              <Reveal delay={120}>
                <p className="pretty" style={{ fontSize: 18, lineHeight: "29px", color: "var(--text-secondary)", maxWidth: 540 }}>
                  {a.story}
                </p>
              </Reveal>
            </div>
            <Reveal delay={140}>
              <div style={{ position: "relative" }}>
                <img
                  src="/assets/profile-photo-5.jpg"
                  alt=""
                  style={{ width: "100%", borderRadius: 18, boxShadow: "var(--shadow-lg)", display: "block", aspectRatio: "4/5", objectFit: "cover" }}
                />
                <div style={{ position: "absolute", left: -22, bottom: -22, background: "var(--brand)", color: "#0B0B0F", borderRadius: 16, padding: "16px 20px", boxShadow: "var(--shadow-lg)", maxWidth: 220 }}>
                  <div className="serif-accent" style={{ fontSize: 19, lineHeight: "24px" }}>
                    &ldquo;{t.footer.tagline}&rdquo;
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Mission band */}
      <section className="section surface-app hairline-top">
        <div className="container container-narrow" style={{ textAlign: "center" }}>
          <Reveal>
            <div style={{ marginBottom: 16 }}>
              <Eyebrow>{a.missionLabel}</Eyebrow>
            </div>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="t-display-sm balance" style={{ maxWidth: 760, margin: "0 auto" }}>
              {a.mission}
            </h2>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="section surface-canvas">
        <div className="container">
          <Reveal>
            <SectionHead eyebrow={a.eyebrow} title={a.valuesHeader} max={620} />
          </Reveal>
          <div className="grid grid-3" style={{ marginTop: 48 }}>
            {a.values.map((v, i) => (
              <Reveal key={i} delay={i * 90}>
                <Card padded={28} hover style={{ height: "100%" }}>
                  <div className="feature-card">
                    <span className={"icon-tile" + (i === 1 ? " accent" : "")}>
                      <Icon name={["star", "sparkles", "users"][i]} size={22} />
                    </span>
                    <h3 className="t-h3" style={{ marginTop: 4 }}>
                      {v.title}
                    </h3>
                    <p className="pretty" style={{ fontSize: 15, lineHeight: "24px", color: "var(--text-secondary)" }}>
                      {v.body}
                    </p>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FinalCTA t={t} navigate={navigate} />
    </div>
  );
}
