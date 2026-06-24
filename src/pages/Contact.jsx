/* Caastor v2 — Contact page */
import Cal from "@calcom/embed-react";
import { Icon } from "../ds/components.jsx";
import { Reveal, Eyebrow } from "../components/shell.jsx";
import { CAL_LINK } from "../lib/booking.js";

export function ContactPage({ t }) {
  const c = t.contact;

  return (
    <div className="page-enter">
      <section className="hero surface-canvas">
        <div className="hero-blobs">
          <span className="blob a" />
          <span className="blob b" />
        </div>
        <div className="container" style={{ position: "relative", zIndex: 1, padding: "84px 28px 88px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 56, alignItems: "start" }} className="hero-grid">
            {/* left: intro + expectations */}
            <div>
              <Reveal>
                <div style={{ marginBottom: 18 }}>
                  <Eyebrow>{c.eyebrow}</Eyebrow>
                </div>
              </Reveal>
              <Reveal delay={60}>
                <h1 className="t-display-md balance" style={{ marginBottom: 18 }}>
                  {c.h1}
                </h1>
              </Reveal>
              <Reveal delay={120}>
                <p className="pretty" style={{ fontSize: 18, lineHeight: "29px", color: "var(--text-secondary)", maxWidth: 460, marginBottom: 36 }}>
                  {c.sub}
                </p>
              </Reveal>
              <Reveal delay={160}>
                <div className="t-overline" style={{ marginBottom: 16 }}>
                  {c.asideTitle}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {c.asideItems.map((it, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <span style={{ flexShrink: 0, width: 24, height: 24, borderRadius: 999, background: "var(--brand-soft)", color: "var(--brand-strong)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon name="check" size={14} />
                      </span>
                      <span style={{ fontSize: 15, lineHeight: "23px", color: "var(--text-secondary)" }}>{it}</span>
                    </div>
                  ))}
                </div>
                <img src="/assets/mascot-yellow.png" alt="" style={{ width: 70, marginTop: 40, transform: "rotate(-6deg)" }} />
              </Reveal>
            </div>

            {/* right: premium-framed inline Cal.com scheduler */}
            <Reveal delay={120}>
              <div
                style={{
                  position: "relative",
                  background: "var(--bg-canvas)",
                  border: "1px solid var(--border-default)",
                  borderRadius: 24,
                  boxShadow: "var(--shadow-lg)",
                  overflow: "hidden",
                }}
              >
                {/* brand hairline along the top edge of the scheduler panel */}
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    insetInline: 0,
                    top: 0,
                    height: 3,
                    background: "linear-gradient(90deg, transparent, var(--brand) 22%, var(--brand-strong) 50%, var(--brand) 78%, transparent)",
                    zIndex: 2,
                  }}
                />
                {/* panel header: eyebrow + micro reassurance */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "18px 20px",
                    borderBottom: "1px solid var(--border-default)",
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      width: 30,
                      height: 30,
                      borderRadius: 999,
                      background: "var(--brand-soft)",
                      color: "var(--brand-strong)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon name="message" size={16} />
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div className="t-overline" style={{ marginBottom: 2 }}>
                      {c.button}
                    </div>
                    <div style={{ fontSize: 13, lineHeight: "18px", color: "var(--text-tertiary)" }}>
                      {c.micro}
                    </div>
                  </div>
                </div>

                <div style={{ padding: 8, height: 520, maxHeight: "66vh" }}>
                  <Cal
                    calLink={CAL_LINK}
                    config={{ theme: "auto", layout: "month_view" }}
                    style={{ width: "100%", height: "100%", overflow: "auto" }}
                  />
                </div>
              </div>

              {/* fallback: if the embed is slow, open the Cal page directly */}
              <p style={{ marginTop: 14, fontSize: 13, lineHeight: "20px", color: "var(--text-tertiary)", textAlign: "center" }}>
                <a
                  href={`https://${CAL_LINK}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--brand-strong)", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: 3, display: "inline-flex", alignItems: "center", gap: 6 }}
                >
                  {c.button}
                  <Icon name="arrowRight" size={13} />
                </a>
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
