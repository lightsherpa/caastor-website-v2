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

            {/* right: inline Cal.com scheduler */}
            <Reveal delay={120}>
              <div
                style={{
                  background: "var(--bg-canvas)",
                  border: "1px solid var(--border-default)",
                  borderRadius: 20,
                  boxShadow: "var(--shadow-lg)",
                  padding: 8,
                  overflow: "hidden",
                  height: 540,
                  maxHeight: "70vh",
                }}
              >
                <Cal
                  calLink={CAL_LINK}
                  config={{ theme: "auto", layout: "month_view" }}
                  style={{ width: "100%", height: "100%", overflow: "auto" }}
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
