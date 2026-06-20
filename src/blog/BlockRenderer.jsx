/* Public renderer for blog page-builder blocks. Markdown is parsed
   with `marked` and sanitised with DOMPurify before injection. */
import { marked } from "marked";
import DOMPurify from "dompurify";
import { Button } from "../ds/components.jsx";

marked.setOptions({ breaks: true, gfm: true });

function md(src) {
  return { __html: DOMPurify.sanitize(marked.parse(src || "")) };
}

const CALLOUT_TONES = {
  brand: { bg: "var(--brand-soft)", bd: "var(--brand)", fg: "var(--brand-strong)" },
  info: { bg: "var(--status-info-soft)", bd: "var(--status-info)", fg: "var(--status-info)" },
  success: { bg: "var(--status-success-soft)", bd: "var(--status-success)", fg: "var(--status-success)" },
  warning: { bg: "var(--status-warning-soft)", bd: "var(--status-warning)", fg: "var(--status-warning)" },
};

function embedUrl(url) {
  if (!url) return null;
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return url;
}

function Block({ block, navigate }) {
  switch (block.type) {
    case "heading": {
      const Tag = `h${Math.min(4, Math.max(2, block.level || 2))}`;
      const cls = block.level === 2 ? "t-display-sm" : block.level === 3 ? "t-h2" : "t-h3";
      return <Tag className={`${cls} balance prose-heading`}>{block.text}</Tag>;
    }
    case "paragraph":
      return <div className="prose-body" dangerouslySetInnerHTML={md(block.markdown)} />;
    case "image":
      return (
        <figure className="prose-figure">
          {block.url && <img src={block.url} alt={block.alt || ""} loading="lazy" />}
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      );
    case "gallery":
      return (
        <div className="prose-gallery">
          {(block.images || []).map((im, i) => (
            <img key={i} src={im.url} alt={im.alt || ""} loading="lazy" />
          ))}
        </div>
      );
    case "quote":
      return (
        <blockquote className="prose-quote">
          <p className="serif-accent">{block.text}</p>
          {block.cite && <cite>— {block.cite}</cite>}
        </blockquote>
      );
    case "callout": {
      const tone = CALLOUT_TONES[block.tone] || CALLOUT_TONES.brand;
      return (
        <aside className="prose-callout" style={{ background: tone.bg, borderColor: tone.bd }}>
          {block.title && <strong style={{ color: tone.fg }}>{block.title}</strong>}
          {block.body && <span>{block.body}</span>}
        </aside>
      );
    }
    case "code":
      return (
        <pre className="prose-code">
          <code>{block.code}</code>
        </pre>
      );
    case "cta": {
      const isInternal = block.href && block.href.startsWith("/");
      return (
        <div className="prose-cta">
          {block.text && <p className="t-h3">{block.text}</p>}
          <Button
            variant="primary"
            size="lg"
            iconEnd="arrowRight"
            onClick={() => (isInternal ? navigate(block.href) : window.open(block.href, "_blank"))}
          >
            {block.label || "Learn more"}
          </Button>
        </div>
      );
    }
    case "embed": {
      const src = embedUrl(block.url);
      if (!src) return null;
      return (
        <div className="prose-embed">
          <iframe src={src} title="embed" loading="lazy" allowFullScreen frameBorder="0" />
        </div>
      );
    }
    case "divider":
      return <hr className="prose-divider" />;
    default:
      return null;
  }
}

export function BlockRenderer({ blocks, navigate }) {
  if (!blocks || !blocks.length) return null;
  return (
    <div className="prose">
      {blocks.map((b) => (
        <Block key={b.id} block={b} navigate={navigate} />
      ))}
    </div>
  );
}
