/* Caastor v2 — App root: theme + language, real-path routing, CMS content overlay */
import { useState, useEffect, lazy, Suspense } from "react";
import { flushSync } from "react-dom";
import { Header, Footer } from "./components/shell.jsx";
import { SmoothScroll, ScrollProgress, PageTransition } from "./motion/primitives.jsx";
import { GsapEffects } from "./motion/GsapEffects.jsx";
import { parseLocation, pathForTarget } from "./router.js";
import { useSiteContent } from "./content/useSiteContent.js";
import { useCalInit } from "./lib/booking.js";
// Home stays eager — it's the landing route and drives LCP.
import { HomePage } from "./pages/Home.jsx";

// Code-split: every non-home page loads on demand so the Home route ships lighter.
// The admin (CMS) and blog (markdown deps) were already split; the rest follow now.
const ServicesPage = lazy(() => import("./pages/Services.jsx").then((m) => ({ default: m.ServicesPage })));
const PricingPage = lazy(() => import("./pages/Pricing.jsx").then((m) => ({ default: m.PricingPage })));
const AboutPage = lazy(() => import("./pages/About.jsx").then((m) => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import("./pages/Contact.jsx").then((m) => ({ default: m.ContactPage })));
const FaqPage = lazy(() => import("./pages/Faq.jsx").then((m) => ({ default: m.FaqPage })));
const NotFoundPage = lazy(() => import("./pages/NotFound.jsx").then((m) => ({ default: m.NotFoundPage })));
const BlogIndexPage = lazy(() => import("./pages/Blog.jsx").then((m) => ({ default: m.BlogIndexPage })));
const BlogPostPage = lazy(() => import("./pages/BlogPost.jsx").then((m) => ({ default: m.BlogPostPage })));
const AdminApp = lazy(() => import("./admin/AdminApp.jsx").then((m) => ({ default: m.AdminApp })));

// Per-route document titles + meta descriptions (bilingual). Keyed by route.
const PAGE_META = {
  home: {
    en: { title: "Caastor · Creative as a Service", desc: "Your on-demand design team. Unlimited design requests, senior work, shipped in 48 hours, one flat monthly fee." },
    es: { title: "Caastor · Creatividad como servicio", desc: "Tu equipo de diseño a demanda. Peticiones ilimitadas, nivel senior, entregado en 48 horas y una tarifa plana al mes." },
  },
  services: {
    en: { title: "Services · Caastor", desc: "Explore Caastor's services and how we help your team grow." },
    es: { title: "Servicios · Caastor", desc: "Explora los servicios de Caastor y cómo ayudamos a tu equipo a crecer." },
  },
  pricing: {
    en: { title: "Pricing · Caastor", desc: "Simple, transparent pricing for Caastor's design subscription." },
    es: { title: "Precios · Caastor", desc: "Precios simples y transparentes para los sistemas de crecimiento de Caastor." },
  },
  about: {
    en: { title: "About · Caastor", desc: "Learn about Caastor — who we are and how we work." },
    es: { title: "Nosotros · Caastor", desc: "Conoce a Caastor — quiénes somos y cómo trabajamos." },
  },
  contact: {
    en: { title: "Contact · Caastor", desc: "Get in touch with the Caastor team." },
    es: { title: "Contacto · Caastor", desc: "Ponte en contacto con el equipo de Caastor." },
  },
  faq: {
    en: { title: "FAQ · Caastor", desc: "Answers to common questions about Caastor." },
    es: { title: "Preguntas frecuentes · Caastor", desc: "Respuestas a las preguntas frecuentes sobre Caastor." },
  },
  blog: {
    en: { title: "Blog · Caastor", desc: "Insights and updates from the Caastor team." },
    es: { title: "Blog · Caastor", desc: "Ideas y novedades del equipo de Caastor." },
  },
  blogpost: {
    en: { title: "Blog · Caastor", desc: "Insights and updates from the Caastor team." },
    es: { title: "Blog · Caastor", desc: "Ideas y novedades del equipo de Caastor." },
  },
  admin: {
    en: { title: "Admin · Caastor", desc: "" },
    es: { title: "Admin · Caastor", desc: "" },
  },
  notfound: {
    en: { title: "Page not found · Caastor", desc: "The page you're looking for doesn't exist." },
    es: { title: "Página no encontrada · Caastor", desc: "La página que buscas no existe." },
  },
};

// Apply the document <title> and meta description for the active route + language.
function applyPageMeta(route, lang) {
  const byRoute = PAGE_META[route] || PAGE_META.notfound;
  const meta = byRoute[lang] || byRoute.en;
  document.title = meta.title;
  if (typeof meta.desc === "string") {
    let tag = document.querySelector('meta[name="description"]');
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute("name", "description");
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", meta.desc);
  }
}

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

  // Per-route document title + meta description (bilingual).
  useEffect(() => {
    applyPageMeta(loc.route, lang);
  }, [loc.route, lang]);

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
