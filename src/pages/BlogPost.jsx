/* Caastor v2 — single blog post */
import { useState, useEffect } from "react";
import { Icon } from "../ds/components.jsx";
import { Reveal } from "../components/shell.jsx";
import { Avatar } from "../ds/components.jsx";
import { FinalCTA } from "../components/FinalCTA.jsx";
import { BlockRenderer } from "../blog/BlockRenderer.jsx";
import { fetchPostBySlug } from "../lib/blog.js";

const COPY = {
  en: { back: "All posts", notFound: "We couldn’t find that post.", by: "By" },
  es: { back: "Todos los posts", notFound: "No encontramos ese post.", by: "Por" },
};

function fmtDate(d, lang) {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString(lang === "es" ? "es-ES" : "en-US", { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return "";
  }
}

function setMeta(name, content) {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content || "");
}

export function BlogPostPage({ t, lang, slug, navigate }) {
  const c = COPY[lang] || COPY.en;
  const [post, setPost] = useState(undefined); // undefined = loading, null = not found

  useEffect(() => {
    let active = true;
    setPost(undefined);
    fetchPostBySlug(slug, lang).then((p) => {
      if (!active) return;
      setPost(p || null);
      if (p) {
        document.title = `${p.seo_title || p.title} · Caastor`;
        setMeta("description", p.seo_description || p.excerpt || "");
      }
    });
    return () => {
      active = false;
    };
  }, [slug, lang]);

  if (post === undefined) {
    return <div className="page-enter" style={{ minHeight: "60vh" }} />;
  }
  if (post === null) {
    return (
      <div className="page-enter">
        <section className="section surface-canvas" style={{ textAlign: "center", paddingTop: 120 }}>
          <div className="container container-narrow">
            <h1 className="t-display-sm" style={{ marginBottom: 18 }}>{c.notFound}</h1>
            <span className="text-link" style={{ cursor: "pointer" }} onClick={() => navigate("blog")}>
              ← {c.back}
            </span>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <article>
        <header className="hero surface-canvas">
          <div className="hero-blobs">
            <span className="blob a" />
          </div>
          <div className="container container-narrow" style={{ position: "relative", zIndex: 1, padding: "72px 28px 36px" }}>
            <Reveal>
              <span className="text-link" style={{ cursor: "pointer", fontSize: 14, marginBottom: 22, display: "inline-flex" }} onClick={() => navigate("blog")}>
                <Icon name="chevronLeft" size={15} /> {c.back}
              </span>
            </Reveal>
            <Reveal delay={60}>
              <div className="blog-card-meta" style={{ marginBottom: 16 }}>
                {(post.tags || []).map((tag) => (
                  <span key={tag} className="blog-tag">
                    {tag}
                  </span>
                ))}
                <span>{fmtDate(post.published_at, lang)}</span>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="t-display-md balance" style={{ marginBottom: 22 }}>
                {post.title}
              </h1>
            </Reveal>
            {post.excerpt && (
              <Reveal delay={140}>
                <p className="pretty" style={{ fontSize: 20, lineHeight: "31px", color: "var(--text-secondary)", maxWidth: 680 }}>
                  {post.excerpt}
                </p>
              </Reveal>
            )}
            {post.author && (
              <Reveal delay={180}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 24 }}>
                  <Avatar name={post.author} size={40} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{post.author}</div>
                    <div style={{ fontSize: 13, color: "var(--text-tertiary)" }}>{c.by} Caastor</div>
                  </div>
                </div>
              </Reveal>
            )}
          </div>
        </header>

        {post.cover_url && (
          <div className="container container-narrow" style={{ marginTop: 8, marginBottom: 8 }}>
            <Reveal>
              <img
                src={post.cover_url}
                alt={post.title}
                style={{ width: "100%", borderRadius: 18, boxShadow: "var(--shadow-lg)", display: "block", aspectRatio: "16/9", objectFit: "cover" }}
              />
            </Reveal>
          </div>
        )}

        <section className="section-sm surface-canvas">
          <div className="container container-narrow">
            <Reveal>
              <BlockRenderer blocks={post.blocks} navigate={navigate} />
            </Reveal>
          </div>
        </section>
      </article>

      <FinalCTA t={t} navigate={navigate} />
    </div>
  );
}
