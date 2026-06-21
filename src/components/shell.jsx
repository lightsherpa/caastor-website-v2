/* ──────────────────────────────────────────────────────────────────
   Caastor v2 — shared shell: Reveal, Eyebrow, SectionHead, Header, Footer
   ────────────────────────────────────────────────────────────────── */
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Icon, Button } from "../ds/components.jsx";
import { bookingProps } from "../lib/booking.js";

/* Reveal lives in the motion layer; re-exported here for back-compat. */
export { Reveal } from "../motion/primitives.jsx";

/* ── Eyebrow + section head ────────────────────────────────── */
export function Eyebrow({ children, dot = true }) {
  return (
    <span className="eyebrow">
      {dot && <span className="dot" />}
      {children}
    </span>
  );
}

export function SectionHead({ eyebrow, title, sub, align = "left", max = 720 }) {
  return (
    <div style={{ textAlign: align, maxWidth: max, margin: align === "center" ? "0 auto" : undefined }}>
      {eyebrow && (
        <div style={{ marginBottom: 16 }}>
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
      )}
      {title && (
        <h2 className="t-display-sm balance" style={{ marginBottom: sub ? 16 : 0 }}>
          {title}
        </h2>
      )}
      {sub && (
        <p
          className="t-body-lg pretty"
          style={{ fontSize: 18, lineHeight: "28px", maxWidth: 640, margin: align === "center" ? "0 auto" : undefined }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

/* ── Header ────────────────────────────────────────────────── */
export function Header({ t, lang, setLang, theme, toggleTheme, route, navigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [overHero, setOverHero] = useState(route === "home");
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      if (route === "home") {
        const heroEl = document.querySelector(".hero--dark");
        const threshold = heroEl ? heroEl.offsetHeight - 80 : 560;
        setOverHero(y < threshold);
      } else {
        setOverHero(false);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [route]);
  useEffect(() => {
    setMenuOpen(false);
  }, [route]);

  // Over the dark hero the header is transparent with light text; once
  // scrolled past it, it becomes the solid light bar.
  const onDark = overHero && !menuOpen;
  const lightLogo = theme === "dark" || onDark;

  const navItems = [
    ["home", t.nav.home],
    ["services", t.nav.services],
    ["pricing", t.nav.pricing],
    ["contact", t.nav.contact],
    ["about", t.nav.about],
    ["blog", t.nav.blog],
    ["faq", t.nav.faq],
  ];

  return (
    <header className={"site-header" + (scrolled ? " scrolled" : "") + (onDark ? " on-dark" : "")}>
      <div className="container header-inner">
        <a
          onClick={() => navigate("home")}
          className="brand-lockup"
          aria-label="Caastor home"
        >
          {/* One consistent lockup in every state: mascot + wordmark. The
             wordmark SVG is white; over a light bar it flips to ink via a
             filter, so the composition never changes between themes. */}
          <img className="brand-mascot" src="/assets/mascot-yellow.png" alt="" />
          <img
            className={"brand-wordmark" + (lightLogo ? "" : " is-ink")}
            src="/assets/logotype-white.svg"
            alt="Caastor"
          />
        </a>

        <nav className="nav-links">
          {navItems.map(([key, label]) => (
            <span
              key={key}
              className={"nav-link" + (route === key ? " active" : "")}
              onClick={() => navigate(key)}
            >
              {label}
              {route === key && (
                <motion.span
                  className="nav-underline"
                  layoutId="nav-underline"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
            </span>
          ))}
        </nav>

        <div className="header-controls">
          <div className="lang-toggle" role="group" aria-label="Language">
            <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")}>
              EN
            </button>
            <button className={lang === "es" ? "on" : ""} onClick={() => setLang("es")}>
              ES
            </button>
          </div>
          <button className="icon-btn" onClick={(e) => toggleTheme(e)} aria-label="Toggle theme">
            <Icon name={theme === "dark" ? "sun" : "moon"} size={18} />
          </button>
          <span className="login-link desktop-only" onClick={() => navigate("contact")}>
            {t.login}
          </span>
          <span className="desktop-only">
            <Button variant="primary" size="md" iconEnd="arrowRight" {...bookingProps}>
              {t.headerCta}
            </Button>
          </span>
          <button className="icon-btn menu-btn" onClick={() => setMenuOpen((o) => !o)} aria-label="Menu">
            <Icon
              name={menuOpen ? "plus" : "list"}
              size={20}
              style={{ transform: menuOpen ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}
            />
          </button>
        </div>
      </div>

      <div
        className={"mobile-menu" + (menuOpen ? " open" : "")}
        style={{ background: "var(--bg-canvas)", padding: "28px 0 40px" }}
      >
        <div className="container" style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {navItems.map(([key, label]) => (
            <span
              key={key}
              className={"nav-link" + (route === key ? " active" : "")}
              style={{ padding: "12px 12px", fontSize: 16 }}
              onClick={() => navigate(key)}
            >
              {label}
            </span>
          ))}
          <div style={{ marginTop: 12 }}>
            <Button variant="primary" size="lg" full iconEnd="arrowRight" {...bookingProps}>
              {t.headerCta}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ── Footer ────────────────────────────────────────────────── */
export function Footer({ t, navigate }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const navItems = [
    ["home", t.nav.home],
    ["services", t.nav.services],
    ["pricing", t.nav.pricing],
    ["about", t.nav.about],
    ["contact", t.nav.contact],
    ["faq", t.nav.faq],
    ["blog", t.nav.blog],
  ];
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <img src="/assets/logotype-white.svg" alt="Caastor" style={{ height: 24, marginBottom: 18 }} />
            <p className="serif-accent" style={{ fontSize: 26, lineHeight: "32px", color: "#fff", maxWidth: 320, margin: 0 }}>
              {t.footer.tagline}
            </p>
          </div>

          <div>
            <div className="footer-h">{t.footer.colNav}</div>
            {navItems.map(([key, label]) => (
              <span key={key} className="footer-link" onClick={() => navigate(key)}>
                {label}
              </span>
            ))}
          </div>

          <div>
            <div className="footer-h">{t.footer.colLegal}</div>
            <span className="footer-link">{t.footer.privacy}</span>
            <span className="footer-link">{t.footer.terms}</span>
            <span className="footer-link" onClick={() => navigate("contact")}>
              {t.nav.contact}
            </span>
          </div>

          <div>
            <div className="footer-h">Newsletter</div>
            <p style={{ color: "rgba(255,255,255,0.66)", fontSize: 14, lineHeight: "22px", margin: "0 0 14px", maxWidth: 280 }}>
              {t.footer.newsletter}
            </p>
            {done ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--status-success)", fontSize: 14, fontWeight: 600 }}>
                <Icon name="check" size={16} /> {t.footer.newsletterCta} ✓
              </div>
            ) : (
              <form
                style={{ display: "flex", gap: 8 }}
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email.includes("@")) setDone(true);
                }}
              >
                <input
                  className="footer-input"
                  type="email"
                  placeholder={t.footer.emailPh}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button variant="accent" size="md" onClick={() => { if (email.includes("@")) setDone(true); }}>
                  {t.footer.newsletterCta}
                </Button>
              </form>
            )}
          </div>
        </div>

        <div
          style={{
            marginTop: 56,
            paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.66)" }}>{t.footer.legal}</span>
          <span className="t-mono" style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
            Caastor v2 · caastor.co
          </span>
        </div>
      </div>
    </footer>
  );
}
