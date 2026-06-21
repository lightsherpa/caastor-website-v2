/* Caastor v2 — About page */
import { useReducedMotion } from "motion/react";
import { Card, Icon } from "../ds/components.jsx";
import { Reveal, Eyebrow, SectionHead } from "../components/shell.jsx";
import { FinalCTA } from "../components/FinalCTA.jsx";
import "./about-timeline.css";

export function AboutPage({ t, navigate }) {
  const a = t.about;
  const reduce = useReducedMotion();

  // AboutPage isn't passed a `lang` prop, so derive language from `t` for any
  // NEW visible labels we introduce here (timeline eyebrow + heading).
  const isEs = a.missionLabel === "Nuestra misión";
  const tlEyebrow = isEs ? "Nuestro recorrido" : "Our journey";
  const tlTitle = isEs ? "Cómo nació Caastor" : "How Caastor came to be";

  const timeline = Array.isArray(a.timeline) ? a.timeline : [];
  // Branded node icons cycle through the existing icon set.
  const nodeIcons = ["sparkles", "flag", "activity", "star", "check"];
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
                <div style={{ position: "absolute", left: -22, bottom: -22, background: "var(--brand)", color: "var(--text-on-brand)", borderRadius: 16, padding: "16px 20px", boxShadow: "var(--shadow-lg)", maxWidth: 220 }}>
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

      {/* Origin-story timeline */}
      {timeline.length > 0 && (
        <section className="section surface-canvas hairline-top">
          <div className="container">
            <Reveal>
              <SectionHead eyebrow={tlEyebrow} title={tlTitle} max={620} />
            </Reveal>
            <div className={"cstr-tl" + (reduce ? " cstr-tl--stacked" : "")}>
              <ol
                className="cstr-tl__track"
                aria-label={tlTitle}
                style={{ listStyle: "none", margin: 0 }}
              >
                {timeline.map((m, i) => (
                  <Reveal key={i} as="li" className="cstr-tl__item" delay={i * 90}>
                    <span className="cstr-tl__node" aria-hidden="true">
                      <Icon name={nodeIcons[i % nodeIcons.length]} size={20} />
                    </span>
                    <div className="cstr-tl__card">
                      <div className="cstr-tl__year t-mono">{m.year}</div>
                      <h3 className="t-h3 cstr-tl__title">{m.title}</h3>
                      <p className="pretty cstr-tl__body">{m.body}</p>
                    </div>
                  </Reveal>
                ))}
              </ol>
            </div>
          </div>
        </section>
      )}

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
