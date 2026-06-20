/* Caastor v2 — Blog index */
import { useState, useEffect } from "react";
import { Icon } from "../ds/components.jsx";
import { Reveal, Eyebrow } from "../components/shell.jsx";
import { FinalCTA } from "../components/FinalCTA.jsx";
import { fetchPublishedPosts, BLOG_ENABLED } from "../lib/blog.js";

const COPY = {
  en: { eyebrow: "Blog", h1: "Ideas, craft & the occasional bad pun.", sub: "Notes on design, brand and shipping fast without cutting corners.", empty: "No posts yet, the first one is on its way.", soon: "The blog is being set up. Check back soon.", read: "Read", min: "min read" },
  es: { eyebrow: "Blog", h1: "Ideas, oficio y algún chiste malo.", sub: "Notas sobre diseño, marca y entregar rápido sin atajos.", empty: "Aún no hay posts , el primero está en camino.", soon: "El blog se está configurando. Vuelve pronto.", read: "Leer", min: "min de lectura" },
};

function fmtDate(d, lang) {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString(lang === "es" ? "es-ES" : "en-US", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

export function BlogIndexPage({ t, lang, navigate }) {
  const c = COPY[lang] || COPY.en;
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    document.title = "Blog · Caastor";
    let active = true;
    if (!BLOG_ENABLED) {
      setPosts([]);
      return;
    }
    fetchPublishedPosts(lang).then((p) => active && setPosts(p));
    return () => {
      active = false;
    };
  }, [lang]);

  return (
    <div className="page-enter">
      <section className="hero surface-canvas">
        <div className="hero-blobs">
          <span className="blob a" />
        </div>
        <div className="container" style={{ position: "relative", zIndex: 1, padding: "84px 28px 48px", textAlign: "center" }}>
          <Reveal>
            <div style={{ marginBottom: 18 }}>
              <Eyebrow>{c.eyebrow}</Eyebrow>
            </div>
          </Reveal>
          <Reveal delay={60}>
            <h1 className="t-display-md balance" style={{ marginBottom: 18, maxWidth: 720, margin: "0 auto 18px" }}>
              {c.h1}
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="pretty" style={{ fontSize: 19, lineHeight: "30px", color: "var(--text-secondary)", maxWidth: 560, margin: "0 auto" }}>
              {c.sub}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section surface-canvas" style={{ paddingTop: 24 }}>
        <div className="container">
          {posts === null ? (
            <p style={{ textAlign: "center", color: "var(--text-tertiary)" }}>…</p>
          ) : posts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 24px", color: "var(--text-tertiary)" }}>
              <img src="/assets/mascot-yellow.png" alt="" style={{ width: 72, marginBottom: 18, opacity: 0.9 }} />
              <p className="t-h3" style={{ color: "var(--text-secondary)" }}>{BLOG_ENABLED ? c.empty : c.soon}</p>
            </div>
          ) : (
            <div className="blog-grid">
              {posts.map((p, i) => (
                <Reveal key={p.slug} delay={(i % 3) * 80}>
                  <article className="blog-card" onClick={() => navigate(`/blog/${p.slug}`)}>
                    {p.cover_url ? (
                      <img className="blog-card-cover" src={p.cover_url} alt={p.title} loading="lazy" />
                    ) : (
                      <div className="blog-card-cover" />
                    )}
                    <div className="blog-card-body">
                      <div className="blog-card-meta">
                        {(p.tags || []).slice(0, 2).map((tag) => (
                          <span key={tag} className="blog-tag">
                            {tag}
                          </span>
                        ))}
                        <span>{fmtDate(p.published_at, lang)}</span>
                      </div>
                      <h3 className="t-h2" style={{ fontSize: 21, lineHeight: "27px" }}>
                        {p.title}
                      </h3>
                      {p.excerpt && (
                        <p className="pretty" style={{ fontSize: 15, lineHeight: "23px", color: "var(--text-tertiary)" }}>
                          {p.excerpt}
                        </p>
                      )}
                      <span className="text-link" style={{ marginTop: "auto", fontSize: 14 }}>
                        {c.read} <Icon name="arrowRight" size={15} />
                      </span>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <FinalCTA t={t} navigate={navigate} />
    </div>
  );
}
