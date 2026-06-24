/* Caastor v2 — About page */
import { useReducedMotion } from "motion/react";
import { Icon } from "../ds/components.jsx";
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
                <div className="cstr-hero__photo">
                  <img src="/assets/profile-photo-5.jpg" alt="" />
                </div>
                <div className="cstr-hero__quote">
                  <div className="serif-accent cstr-hero__quote-text">
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
            <div className="cstr-mission">
              <span className="serif-accent cstr-mission__mark" aria-hidden="true">
                &ldquo;
              </span>
              <h2 className="t-display-sm balance cstr-mission__text">
                {a.mission}
              </h2>
            </div>
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
          <div className="cstr-values">
            {a.values.map((v, i) => {
              const valueIcons = ["star", "sparkles", "users"];
              return (
                <Reveal key={i} delay={i * 90}>
                  <article className={"cstr-value" + (i === 1 ? " cstr-value--accent" : "")} style={{ height: "100%" }}>
                    <span className="cstr-value__index" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="cstr-value__bracket tl" aria-hidden="true" />
                    <span className="cstr-value__bracket br" aria-hidden="true" />
                    <span className="cstr-value__tile">
                      <Icon name={valueIcons[i % valueIcons.length]} size={26} />
                    </span>
                    <h3 className="t-h3 cstr-value__title">{v.title}</h3>
                    <p className="pretty cstr-value__body">{v.body}</p>
                    <span className="cstr-value__rule" aria-hidden="true" />
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <FinalCTA t={t} navigate={navigate} />
    </div>
  );
}
