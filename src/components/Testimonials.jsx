/* ──────────────────────────────────────────────────────────────────
   Testimonials — "Real brands. Real talk."
   Metric-led proof: a featured lead testimonial beside a continuous
   marquee wall. Real client photos are used; a branded company
   monogram chip is the fallback only when a photo is missing.
   Reference (21st.dev, "testimonials wall marquee"): a multi-column
   scrolling testimonial wall — layout/motion idea rebuilt here in our
   JSX + design tokens (no external code reused).
   ────────────────────────────────────────────────────────────────── */
import { Card, Avatar } from "../ds/components.jsx";
import { Reveal, SectionHead } from "../components/shell.jsx";
import { Marquee } from "../motion/primitives.jsx";
import "./testimonials.css";

/* Pull the company name (after the comma in role, e.g. "CEO, Geoking"). */
function companyFromRole(role = "") {
  const parts = role.split(",");
  return (parts.length > 1 ? parts.slice(1).join(",") : role).trim();
}

/* 1–2 letter monogram from the company name. */
function monogram(company = "") {
  const words = company.replace(/[^A-Za-z0-9 ]/g, "").split(/\s+/).filter(Boolean);
  if (!words.length) return "•";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

const MONO_TINTS = [
  "linear-gradient(135deg, var(--brand), var(--brand-strong))",
  "linear-gradient(135deg, var(--accent), var(--brand-strong))",
  "linear-gradient(135deg, var(--brand-strong), var(--text-primary))",
  "linear-gradient(135deg, var(--brand), var(--accent))",
];

/* Person block: real photo via <Avatar>, else branded monogram chip. */
function Person({ name, role, photo, size = 40, idx = 0 }) {
  const company = companyFromRole(role);
  return (
    <>
      {photo ? (
        <Avatar src={photo} name={name} size={size} />
      ) : (
        <span
          className="tw-monogram"
          style={{
            width: size,
            height: size,
            fontSize: Math.max(12, size * 0.36),
            background: MONO_TINTS[idx % MONO_TINTS.length],
          }}
          role="img"
          aria-label={company}
        >
          {monogram(company)}
        </span>
      )}
      <div>
        <div className="tw-name">{name}</div>
        <div className="tw-role">{role}</div>
      </div>
    </>
  );
}

export function Testimonials({ t }) {
  const h = t.home;
  const quotes = h.testimonials.quotes || [];
  if (!quotes.length) return null;

  // Lead testimonial = first quote (strongest metric in our data: "60%").
  const lead = quotes[0];
  // The wall cycles every quote so it never looks thin with only a few items.
  const wall = quotes.length > 1 ? quotes.slice(1) : quotes;

  return (
    <section className="section surface-canvas">
      <div className="container">
        <Reveal>
          <SectionHead title={h.testimonials.header} max={680} />
        </Reveal>

        <Reveal delay={80}>
          <div className="tw-wrap">
            <div className="tw-grid">
              {/* ── Featured lead testimonial ── */}
              <article className="tw-lead">
                <div className="tw-lead-quotemark" aria-hidden>
                  &ldquo;
                </div>
                <div className="tw-lead-metric">
                  <span className="tw-lead-metric-v">{lead.metric}</span>
                  <span className="tw-lead-metric-l">{lead.metricLabel}</span>
                </div>
                <p className="tw-lead-quote balance">{lead.quote}</p>
                <div className="tw-lead-person">
                  <Person
                    name={lead.name}
                    role={lead.role}
                    photo={lead.photo}
                    size={46}
                    idx={0}
                  />
                </div>
              </article>

              {/* ── Marquee wall ── */}
              <div className="tw-wall">
                <Marquee speed={46} gap={18}>
                  {wall.map((qt, i) => (
                    <div className="tw-card" key={`${qt.name}-${i}`}>
                      <Card padded={22} hover style={{ height: "100%" }}>
                        <div className="tw-card-inner">
                          <div className="tw-card-top">
                            <span className="tw-card-metric-v">{qt.metric}</span>
                            <span className="tw-card-metric-l">{qt.metricLabel}</span>
                          </div>
                          <p className="tw-card-quote">&ldquo;{qt.quote}&rdquo;</p>
                          <div className="tw-card-person">
                            <Person
                              name={qt.name}
                              role={qt.role}
                              photo={qt.photo}
                              size={38}
                              idx={i + 1}
                            />
                          </div>
                        </div>
                      </Card>
                    </div>
                  ))}
                </Marquee>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
