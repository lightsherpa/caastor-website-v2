/* ──────────────────────────────────────────────────────────────────
   Caastor v2 — Bundles: outcome-led service packages.
   Replaces the generic "list of services" with curated bundles that
   show value (what's included, who it's for) rather than describe it.
   ────────────────────────────────────────────────────────────────── */
import { Button, Icon } from "../ds/components.jsx";
import { Reveal, SectionHead } from "./shell.jsx";
import { bookingProps } from "../lib/booking.js";

const ACCENT = {
  brand: "linear-gradient(135deg, var(--brand), var(--brand-strong))",
  accent: "linear-gradient(135deg, #FF8A3D, #F5B400)",
  indigo: "linear-gradient(135deg, var(--accent), #6D5BD6)",
};

export function BundlesSection({ t, navigate }) {
  const b = t.home.bundles;
  return (
    <section className="section surface-app hairline-top">
      <div className="container">
        <Reveal>
          <SectionHead title={b.header} sub={b.sub} align="center" max={760} />
        </Reveal>

        <div className="bundles">
          {b.items.map((it, i) => (
            <Reveal key={i} delay={i * 90} className={"bundle" + (it.accent === "brand" ? " is-feature" : "")}>
              <div className="bundle-bar" style={{ background: ACCENT[it.accent] || ACCENT.brand }} />
              <div className="bundle-head">
                <span className="bundle-name">{it.name}</span>
                {it.tag ? <span className="bundle-tag">{it.tag}</span> : null}
              </div>
              <div className="bundle-for">{it.forWho}</div>
              <p className="bundle-desc">{it.desc}</p>
              <div className="bundle-incl">
                {it.includes.map((inc, k) => (
                  <div key={k} className="bundle-incl-row">
                    <span className="bundle-incl-ic"><Icon name="check" size={13} /></span>
                    {inc}
                  </div>
                ))}
              </div>
              <div className="bundle-foot">
                <Button
                  variant={it.accent === "brand" ? "primary" : "outline"}
                  size="md"
                  full
                  iconEnd="arrowRight"
                  {...bookingProps}
                >
                  {b.ctaPrimary}
                </Button>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="bundles-foot">
            <span className="text-link" style={{ fontSize: 16, cursor: "pointer" }} onClick={() => navigate("contact")}>
              {b.ctaSecondary}
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
