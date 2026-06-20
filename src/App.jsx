/* Caastor v2 — App root: theme + language, real-path routing, CMS content overlay */
import { useState, useEffect, lazy, Suspense } from "react";
import { flushSync } from "react-dom";
import { Header, Footer } from "./components/shell.jsx";
import { SmoothScroll, ScrollProgress, PageTransition } from "./motion/primitives.jsx";
import { GsapEffects } from "./motion/GsapEffects.jsx";
import { parseLocation, pathForTarget } from "./router.js";
import { useSiteContent } from "./content/useSiteContent.js";
import { useCalInit } from "./lib/booking.js";
import { HomePage } from "./pages/Home.jsx";
import { ServicesPage } from "./pages/Services.jsx";
import { PricingPage } from "./pages/Pricing.jsx";
import { AboutPage } from "./pages/About.jsx";
import { ContactPage } from "./pages/Contact.jsx";
import { FaqPage } from "./pages/Faq.jsx";
import { NotFoundPage } from "./pages/NotFound.jsx";

// Code-split: the admin (CMS) and blog (markdown deps) load on demand only.
const BlogIndexPage = lazy(() => import("./pages/Blog.jsx").then((m) => ({ default: m.BlogIndexPage })));
const BlogPostPage = lazy(() => import("./pages/BlogPost.jsx").then((m) => ({ default: m.BlogPostPage })));
const AdminApp = lazy(() => import("./admin/AdminApp.jsx").then((m) => ({ default: m.AdminApp })));

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem("caastor_lang") || "en");
  const [theme, setTheme] = useState(() => localStorage.getItem("caastor_theme") || "light");
  const [loc, setLoc] = useState(parseLocation);

  const content = useSiteContent();
  const t = content[lang];
  useCalInit();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("caastor_theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("caastor_lang", lang);
    document.documentElement.setAttribute("lang", lang);
  }, [lang]);

  // History-API routing
  useEffect(() => {
    const onPop = () => setLoc(parseLocation());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = (target) => {
    const path = pathForTarget(target);
    if (path !== window.location.pathname) window.history.pushState({}, "", path);
    setLoc(parseLocation());
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const toggleTheme = (e) => {
    const next = theme === "dark" ? "light" : "dark";
    const supported = typeof document.startViewTransition === "function";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!supported || reduce) {
      setTheme(next);
      return;
    }
    if (e) {
      document.documentElement.style.setProperty("--vt-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--vt-y", `${e.clientY}px`);
    }
    document.startViewTransition(() => {
      flushSync(() => setTheme(next));
    });
  };

  const { route, slug } = loc;

  // Admin is a standalone surface — no marketing chrome.
  if (route === "admin") {
    return (
      <Suspense fallback={<div className="admin-center">Loading…</div>}>
        <AdminApp navigate={navigate} theme={theme} toggleTheme={toggleTheme} />
      </Suspense>
    );
  }

  let Page = null;
  // Logos are brand-level (shared across languages) — always source from `en`.
  const logoNames = content.en?.home?.logos?.names || t.home.logos.names;
  if (route === "home") Page = <HomePage t={t} lang={lang} navigate={navigate} logoNames={logoNames} />;
  else if (route === "services") Page = <ServicesPage t={t} navigate={navigate} />;
  else if (route === "pricing") Page = <PricingPage t={t} lang={lang} navigate={navigate} />;
  else if (route === "about") Page = <AboutPage t={t} navigate={navigate} />;
  else if (route === "contact") Page = <ContactPage t={t} navigate={navigate} />;
  else if (route === "faq") Page = <FaqPage t={t} navigate={navigate} />;
  else if (route === "blog") Page = <BlogIndexPage t={t} lang={lang} navigate={navigate} />;
  else if (route === "blogpost") Page = <BlogPostPage t={t} lang={lang} slug={slug} navigate={navigate} />;
  else Page = <NotFoundPage t={t} navigate={navigate} />;

  return (
    <>
      <ScrollProgress />
      <SmoothScroll />
      <GsapEffects routeKey={route + (slug || "") + lang} />
      <Header t={t} lang={lang} setLang={setLang} theme={theme} toggleTheme={toggleTheme} route={route} navigate={navigate} />
      <main>
        <Suspense fallback={<div style={{ minHeight: "60vh" }} />}>
          <PageTransition routeKey={route + (slug || "") + lang}>{Page}</PageTransition>
        </Suspense>
      </main>
      <Footer t={t} navigate={navigate} />
    </>
  );
}
