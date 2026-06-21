/* Shared closing CTA band, reused across pages. */
import { Button } from "../ds/components.jsx";
import { Reveal } from "./shell.jsx";
import { bookingProps } from "../lib/booking.js";

export function FinalCTA({ t, navigate, primaryPilot = true }) {
  const f = t.home.finalCta;
  return (
    <section className="section" style={{ background: "var(--bg-inverse)", color: "var(--text-inverse)" }}>
      <div className="container container-narrow" style={{ textAlign: "center" }}>
        <Reveal>
          <img src="/assets/mascot-yellow.png" alt="" style={{ width: 64, marginBottom: 22 }} />
          <h2 className="t-display-md balance" style={{ color: "var(--text-inverse)", marginBottom: 18 }}>
            {f.header}
          </h2>
          <p
            className="pretty"
            style={{ fontSize: 19, lineHeight: "30px", color: "color-mix(in srgb, var(--text-inverse) 74%, transparent)", maxWidth: 560, margin: "0 auto 32px" }}
          >
            {f.body}
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Button variant="primary" size="lg" iconEnd="arrowRight" {...bookingProps}>
              {f.ctaPrimary}
            </Button>
            <Button
              variant="outline"
              size="lg"
              style={{ color: "var(--text-inverse)", borderColor: "color-mix(in srgb, var(--text-inverse) 30%, transparent)" }}
              onClick={() => navigate(primaryPilot ? "pricing" : "contact")}
            >
              {f.ctaSecondary}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
