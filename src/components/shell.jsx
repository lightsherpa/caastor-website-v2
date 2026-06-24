/* ──────────────────────────────────────────────────────────────────
   Caastor v2 — shared shell: Reveal, Eyebrow, SectionHead, Header, Footer
   ────────────────────────────────────────────────────────────────── */
import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Icon, Button } from "../ds/components.jsx";
import { bookingProps } from "../lib/booking.js";
import "./footer.css";

/* Reveal lives in the motion layer; re-exported here for back-compat. */
export { Reveal } from "../motion/primitives.jsx";

/* One icon per nav route (revise-the-menu reference). */
const NAV_ICONS = {
  home: "home",
  services: "layers",
  pricing: "tag",
  contact: "message",
  about: "users",
  blog: "blog",
  faq: "help",
};

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
      {/* nav icons (reference revise): each item carries an icon; the active
          route's icon bounces in via the navBounce keyframe. */}
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
          {navItems.map(([key, label]) => {
            const active = route === key;
            return (
              <span
                key={key}
                className={"nav-link nav-link--ic" + (active ? " active" : "")}
                onClick={() => navigate(key)}
                aria-current={active ? "page" : undefined}
              >
                <span className={"nav-ic" + (active ? " on" : "")}>
                  <Icon name={NAV_ICONS[key]} size={16} />
                </span>
                <span className="nav-lbl">{label}</span>
              </span>
            );
          })}
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
          {navItems.map(([key, label]) => {
            const active = route === key;
            return (
              <span
                key={key}
                className={"nav-link nav-link--ic" + (active ? " active" : "")}
                style={{ padding: "12px 12px", fontSize: 16 }}
                onClick={() => navigate(key)}
              >
                <span className={"nav-ic" + (active ? " on" : "")}>
                  <Icon name={NAV_ICONS[key]} size={18} />
                </span>
                <span className="nav-lbl">{label}</span>
              </span>
            );
          })}
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
  const reduce = useReducedMotion();

  const submit = (e) => {
    if (e) e.preventDefault();
    if (email.includes("@")) setDone(true);
  };

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
    <footer className="ftr">
      <div className="container ftr-inner">
        {/* Hero band: big serif tagline + playful mascot */}
        <div className="ftr-hero">
          <div>
            <img className="ftr-wordmark" src="/assets/logotype-white.svg" alt="Caastor" />
            <p className="serif-accent ftr-tagline">{t.footer.tagline}</p>
          </div>
          <div className="ftr-mascot-wrap">
            <span className="ftr-mascot-halo" aria-hidden="true" />
            <motion.img
              className="ftr-mascot"
              src="/assets/mascot-yellow.png"
              alt=""
              aria-hidden="true"
              animate={reduce ? undefined : { y: [0, -10, 0], rotate: [0, -2.5, 0] }}
              transition={
                reduce
                  ? undefined
                  : { duration: 6, repeat: Infinity, ease: "easeInOut" }
              }
            />
          </div>
        </div>

        {/* Columns + featured newsletter panel */}
        <div className="ftr-main">
          <div>
            <h3 className="ftr-h">{t.footer.colNav}</h3>
            <div className="ftr-col-links">
              {navItems.map(([key, label]) => (
                <button key={key} className="ftr-link" onClick={() => navigate(key)}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="ftr-h">{t.footer.colLegal}</h3>
            <div className="ftr-col-links">
              <button className="ftr-link">{t.footer.privacy}</button>
              <button className="ftr-link">{t.footer.terms}</button>
              <button className="ftr-link" onClick={() => navigate("contact")}>
                {t.nav.contact}
              </button>
            </div>
          </div>

          <div className="ftr-news">
            <h3 className="ftr-news-title">{t.footer.newsletterCta}</h3>
            <p className="ftr-news-copy">{t.footer.newsletter}</p>
            {done ? (
              <div className="ftr-done">
                <Icon name="check" size={18} /> {t.footer.newsletterCta} ✓
              </div>
            ) : (
              <form className="ftr-form" onSubmit={submit}>
                <input
                  className="ftr-input"
                  type="email"
                  placeholder={t.footer.emailPh}
                  aria-label={t.footer.emailPh}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button
                  variant="primary"
                  size="md"
                  iconEnd="arrowRight"
                  type="submit"
                  aria-label={t.footer.newsletterCta}
                  onClick={submit}
                >
                  {t.footer.newsletterCta}
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="ftr-bottom">
          <span className="ftr-legal">{t.footer.legal}</span>
          <span className="t-mono ftr-sig">
            <span className="ftr-dot" aria-hidden="true" />
            Caastor v2 · caastor.co
          </span>
        </div>
      </div>
    </footer>
  );
}
