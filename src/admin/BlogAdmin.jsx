/* Caastor v2 — admin blog manager: post list + block-based editor. */
import { useState, useEffect } from "react";
import { Button, Icon, Badge, Switch } from "../ds/components.jsx";
import { Text, Select, Field } from "./ui.jsx";
import { uploadMedia } from "../lib/supabase.js";
import { listAllPosts, getPost, savePost, deletePost, setPostStatus } from "../lib/blog.js";
import { BLOCK_TYPES, blankBlock } from "../blog/blocks.js";

function slugify(s) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function UploadButton({ folder, onDone, label = "Upload" }) {
  const [busy, setBusy] = useState(false);
  return (
    <label style={{ display: "inline-block" }}>
      <Button variant="soft" size="sm" icon="upload" onClick={(e) => e.currentTarget.parentElement.querySelector("input").click()}>
        {busy ? "…" : label}
      </Button>
      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={async (e) => {
          const file = e.target.files[0];
          if (!file) return;
          setBusy(true);
          try {
            onDone(await uploadMedia(file, folder));
          } catch (err) {
            alert("Upload failed: " + err.message);
          } finally {
            setBusy(false);
          }
        }}
      />
    </label>
  );
}

function BlockFields({ block, set }) {
  switch (block.type) {
    case "heading":
      return (
        <>
          <Text label="Heading text" value={block.text} onChange={(v) => set({ text: v })} />
          <Select label="Level" value={String(block.level)} options={[{ value: "2", label: "H2" }, { value: "3", label: "H3" }, { value: "4", label: "H4" }]} onChange={(v) => set({ level: Number(v) })} />
        </>
      );
    case "paragraph":
      return <Text label="Text (Markdown)" value={block.markdown} multiline onChange={(v) => set({ markdown: v })} />;
    case "image":
      return (
        <>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            <div style={{ flex: 1 }}>
              <Text label="Image URL" value={block.url} onChange={(v) => set({ url: v })} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <UploadButton folder="blog" onDone={(url) => set({ url })} />
            </div>
          </div>
          {block.url ? (
            <img src={block.url} alt={block.alt || ""} style={{ maxWidth: "100%", maxHeight: 160, borderRadius: 8, border: "1px solid var(--border-default)", display: "block", marginBottom: 8 }} />
          ) : null}
          <Text label="Alt text" value={block.alt} onChange={(v) => set({ alt: v })} />
          <Text label="Caption" value={block.caption} onChange={(v) => set({ caption: v })} />
        </>
      );
    case "gallery": {
      const images = block.images || [];
      const setImg = (i, patch) => set({ images: images.map((x, idx) => (idx === i ? { ...x, ...patch } : x)) });
      return (
        <Field label="Images">
          {images.length === 0 && <p style={{ color: "var(--text-tertiary)", fontSize: 13, margin: "0 0 8px" }}>No images yet. Add a URL or upload one.</p>}
          {images.map((im, i) => (
            <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6, alignItems: "center" }}>
              {im.url ? <img src={im.url} alt="" style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6, border: "1px solid var(--border-default)", flexShrink: 0 }} /> : null}
              <input style={{ flex: 2 }} value={im.url ?? ""} placeholder="Image URL" onChange={(e) => setImg(i, { url: e.target.value })} />
              <input style={{ flex: 1 }} value={im.alt ?? ""} placeholder="Alt text" onChange={(e) => setImg(i, { alt: e.target.value })} />
              <Button variant="soft" size="sm" onClick={() => set({ images: images.filter((_, idx) => idx !== i) })}>
                ✕
              </Button>
            </div>
          ))}
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="soft" size="sm" icon="plus" onClick={() => set({ images: [...images, { url: "", alt: "" }] })}>
              Add URL
            </Button>
            <UploadButton folder="blog" label="Upload image" onDone={(url) => set({ images: [...images, { url, alt: "" }] })} />
          </div>
        </Field>
      );
    }
    case "quote":
      return (
        <>
          <Text label="Quote" value={block.text} multiline onChange={(v) => set({ text: v })} />
          <Text label="Citation" value={block.cite} onChange={(v) => set({ cite: v })} />
        </>
      );
    case "callout":
      return (
        <>
          <Select label="Tone" value={block.tone || "brand"} options={[{ value: "brand", label: "Brand" }, { value: "info", label: "Info" }, { value: "success", label: "Success" }, { value: "warning", label: "Warning" }]} onChange={(v) => set({ tone: v })} />
          <Text label="Title" value={block.title} onChange={(v) => set({ title: v })} />
          <Text label="Body" value={block.body} multiline onChange={(v) => set({ body: v })} />
        </>
      );
    case "code":
      return (
        <>
          <Text label="Language" value={block.lang} onChange={(v) => set({ lang: v })} />
          <Text label="Code" value={block.code} multiline onChange={(v) => set({ code: v })} />
        </>
      );
    case "cta":
      return (
        <>
          <Text label="Text" value={block.text} onChange={(v) => set({ text: v })} />
          <Text label="Button label" value={block.label} onChange={(v) => set({ label: v })} />
          <Text label="Link (/path or https://…)" value={block.href} onChange={(v) => set({ href: v })} />
        </>
      );
    case "embed":
      return (
        <>
          <Text label="YouTube / Vimeo / iframe URL" value={block.url} onChange={(v) => set({ url: v })} />
          <p style={{ color: "var(--text-tertiary)", fontSize: 13, margin: "2px 0 0" }}>Paste a share or watch URL — it’s embedded responsively on the post.</p>
        </>
      );
    case "divider":
      return <p style={{ color: "var(--text-tertiary)", fontSize: 13 }}>A horizontal rule.</p>;
    default:
      return null;
  }
}

function swap(arr, a, b) {
  const c = [...arr];
  [c[a], c[b]] = [c[b], c[a]];
  return c;
}

const BLOCK_LABEL = Object.fromEntries(BLOCK_TYPES.map((b) => [b.type, b.label]));

function PostEditor({ post, onBack, onSaved }) {
  const [p, setP] = useState(post);
  const [saving, setSaving] = useState(false);
  const set = (patch) => setP((prev) => ({ ...prev, ...patch }));
  const blocks = p.blocks || [];
  const setBlock = (i, patch) => set({ blocks: blocks.map((b, idx) => (idx === i ? { ...b, ...patch } : b)) });

  const save = async () => {
    const slug = (p.slug || slugify(p.title)).trim();
    if (!slug) {
      alert("Add a title or slug before saving.");
      return;
    }
    if (p.status === "published" && !(p.title || "").trim()) {
      alert("A published post needs a title.");
      return;
    }
    setSaving(true);
    try {
      const row = {
        ...p,
        slug,
        tags: typeof p.tags === "string" ? p.tags.split(",").map((s) => s.trim()).filter(Boolean) : p.tags || [],
        published_at: p.status === "published" && !p.published_at ? new Date().toISOString() : p.published_at,
      };
      const saved = await savePost(row);
      onSaved(saved);
    } catch (e) {
      alert("Save failed: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const tagsStr = Array.isArray(p.tags) ? p.tags.join(", ") : p.tags || "";

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <Button variant="ghost" size="sm" icon="chevronLeft" onClick={onBack}>
          Posts
        </Button>
        <div style={{ display: "flex", gap: 8 }}>
          <Badge tone={p.status === "published" ? "success" : "neutral"} dot>
            {p.status}
          </Badge>
          <Button variant="primary" size="md" onClick={save} disabled={saving} style={saving ? { opacity: 0.6, pointerEvents: "none" } : undefined}>
            {saving ? "Saving…" : "Save post"}
          </Button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Text label="Title" value={p.title} onChange={(v) => set({ title: v })} />
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
          <div style={{ flex: 1 }}>
            <Text label="Slug" value={p.slug} placeholder={slugify(p.title) || "post-url-slug"} onChange={(v) => set({ slug: v })} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <Button variant="soft" size="sm" onClick={() => set({ slug: slugify(p.title) })} title="Generate slug from title">
              From title
            </Button>
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <Select label="Language" value={p.lang} options={[{ value: "en", label: "English" }, { value: "es", label: "Español" }]} onChange={(v) => set({ lang: v })} />
        <Select label="Status" value={p.status} options={[{ value: "draft", label: "Draft" }, { value: "published", label: "Published" }]} onChange={(v) => set({ status: v })} />
        <Text label="Author" value={p.author} onChange={(v) => set({ author: v })} />
      </div>
      <Text label="Excerpt" value={p.excerpt} multiline onChange={(v) => set({ excerpt: v })} />
      <Text label="Tags (comma-separated)" value={tagsStr} onChange={(v) => set({ tags: v })} />
      <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
        {p.cover_url ? <img src={p.cover_url} alt="" style={{ width: 64, height: 44, objectFit: "cover", borderRadius: 8, border: "1px solid var(--border-default)", flexShrink: 0, marginBottom: 14 }} /> : null}
        <div style={{ flex: 1 }}>
          <Text label="Cover image URL" value={p.cover_url} onChange={(v) => set({ cover_url: v })} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <UploadButton folder="covers" label="Cover" onDone={(url) => set({ cover_url: url })} />
        </div>
      </div>

      <h3 className="admin-h" style={{ fontSize: 16, marginTop: 18, marginBottom: 12 }}>
        Content blocks
      </h3>
      {blocks.length === 0 && (
        <p style={{ color: "var(--text-tertiary)", fontSize: 14, margin: "0 0 8px" }}>
          No blocks yet. Add your first one below to start writing.
        </p>
      )}
      {blocks.map((b, i) => (
        <div className="blocklist-item" key={b.id || i}>
          <div className="blocklist-head">
            <span className="block-type-tag">{BLOCK_LABEL[b.type] || b.type}</span>
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              <span style={{ fontSize: 11, color: "var(--text-tertiary)", marginRight: 4 }}>{i + 1}/{blocks.length}</span>
              <Button variant="ghost" size="sm" icon="arrowUp" disabled={i === 0} style={i === 0 ? { opacity: 0.35, pointerEvents: "none" } : undefined} onClick={() => set({ blocks: swap(blocks, i, i - 1) })} />
              <Button variant="ghost" size="sm" icon="arrowDown" disabled={i === blocks.length - 1} style={i === blocks.length - 1 ? { opacity: 0.35, pointerEvents: "none" } : undefined} onClick={() => set({ blocks: swap(blocks, i, i + 1) })} />
              <Button variant="soft" size="sm" onClick={() => set({ blocks: blocks.filter((_, idx) => idx !== i) })}>
                ✕
              </Button>
            </div>
          </div>
          <BlockFields block={b} set={(patch) => setBlock(i, patch)} />
        </div>
      ))}

      <div style={{ marginTop: 14 }}>
        <div className="admin-sub" style={{ marginBottom: 8 }}>Add a block</div>
        <div className="add-block-grid">
          {BLOCK_TYPES.map((bt) => (
            <button key={bt.type} type="button" onClick={() => set({ blocks: [...blocks, blankBlock(bt.type)] })}>
              <Icon name={bt.icon} size={15} /> {bt.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 22, paddingTop: 16, borderTop: "1px solid var(--border-default)" }}>
        <Button variant="ghost" size="md" onClick={onBack}>
          Back to posts
        </Button>
        <Button variant="primary" size="md" onClick={save} disabled={saving} style={saving ? { opacity: 0.6, pointerEvents: "none" } : undefined}>
          {saving ? "Saving…" : p.status === "published" ? "Save & publish" : "Save draft"}
        </Button>
      </div>
    </div>
  );
}

export function BlogAdmin() {
  const [posts, setPosts] = useState(null);
  const [editing, setEditing] = useState(null);

  const reload = () => listAllPosts().then(setPosts).catch((e) => alert(e.message));
  useEffect(() => {
    reload();
  }, []);

  const newPost = () => setEditing({ lang: "en", status: "draft", title: "Untitled post", slug: "", excerpt: "", author: "", tags: [], cover_url: "", blocks: [] });
  const edit = async (id) => {
    try {
      setEditing(await getPost(id));
    } catch (e) {
      alert(e.message);
    }
  };
  const remove = async (id) => {
    if (!confirm("Delete this post?")) return;
    await deletePost(id);
    reload();
  };
  const toggleStatus = async (p) => {
    const next = p.status === "published" ? "draft" : "published";
    setPosts((prev) => prev.map((x) => (x.id === p.id ? { ...x, status: next } : x))); // optimistic
    try {
      await setPostStatus(p.id, next, p.published_at);
    } catch (e) {
      setPosts((prev) => prev.map((x) => (x.id === p.id ? { ...x, status: p.status } : x))); // revert
      alert("Couldn’t update status: " + e.message);
    }
  };

  if (editing) {
    return (
      <PostEditor
        post={editing}
        onBack={() => setEditing(null)}
        onSaved={() => {
          setEditing(null);
          reload();
        }}
      />
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div>
          <div className="admin-h">Blog</div>
          <div className="admin-sub" style={{ margin: 0 }}>Write and publish posts with the block editor.</div>
        </div>
        <Button variant="primary" size="md" icon="plus" onClick={newPost}>
          New post
        </Button>
      </div>
      {posts === null ? (
        <p style={{ color: "var(--text-tertiary)" }}>Loading…</p>
      ) : posts.length === 0 ? (
        <p style={{ color: "var(--text-tertiary)" }}>No posts yet. Create your first one.</p>
      ) : (
        posts.map((p) => (
          <div className="post-row" key={p.id}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, flexShrink: 0 }} title={p.status === "published" ? "Published — toggle to unpublish" : "Draft — toggle to publish"}>
              <Switch on={p.status === "published"} onChange={() => toggleStatus(p)} />
              <span style={{ fontSize: 12, fontWeight: 600, width: 64, color: p.status === "published" ? "var(--status-success)" : "var(--text-tertiary)" }}>
                {p.status === "published" ? "Published" : "Draft"}
              </span>
            </div>
            <Badge tone="neutral">{p.lang?.toUpperCase()}</Badge>
            <span style={{ flex: 1, fontWeight: 600, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</span>
            <Button variant="ghost" size="sm" onClick={() => edit(p.id)}>
              Edit
            </Button>
            <Button variant="soft" size="sm" onClick={() => remove(p.id)}>
              Delete
            </Button>
          </div>
        ))
      )}
    </div>
  );
}
