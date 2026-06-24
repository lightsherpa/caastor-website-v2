/* Caastor v2 — Social-proof logo bar.
   Premium logo cloud: refined headline with a masked hairline rule,
   an edge-faded marquee, and grayscale→full-color logos that brighten
   on hover. Dual rendering preserved: each item is either a plain
   string (styled wordmark chip) OR an object with .image/.name (a real
   brand logo uploaded via the CMS, rendered as a normalized <img>). */
import { Reveal } from "./shell.jsx";
import { Marquee } from "../motion/primitives.jsx";
import "./logo-bar.css";

export function LogoBar({ t, logos }) {
  const h = t.home.logos;
  const items = logos || h.names;

  return (
    <section className="section-sm surface-app hairline-top lb-section">
      <div className="container">
        <Reveal>
          <p className="balance lb-headline">{h.headline}</p>
          <p className="lb-eyebrow">{h.eyebrow}</p>
          <span className="lb-rule" aria-hidden="true" />
        </Reveal>

        <Reveal delay={90}>
          <div className="lb-cloud">
            <Marquee speed={42} gap={16} className="lb-marquee">
              {items.map((n, i) => {
                const name = typeof n === "string" ? n : n.name;
                const image = typeof n === "object" ? n.image : null;
                return image ? (
                  <span key={i} className="lb-item lb-item-img">
                    <img className="logo-img lb-logo-img" src={image} alt={name} loading="lazy" />
                  </span>
                ) : (
                  <span key={i} className="lb-item">
                    <span className="logo-chip lb-chip">{name}</span>
                  </span>
                );
              })}
            </Marquee>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
