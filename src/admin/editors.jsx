/* Caastor v2 — admin content editors:
   - TreeEditor: recursive, edits the whole bilingual content document.
   - PlansEditor / LogosEditor: dedicated UIs for the two things you
     most often touch (named explicitly in the brief).
   All three mutate the shared `doc[lang]` subtree via `onChange`. */
import { useState } from "react";
import { Button, Icon } from "../ds/components.jsx";
import { Text, Field, Select, humanize } from "./ui.jsx";
import { uploadMedia } from "../lib/supabase.js";

/* ─────────────────────────────── Tree editor ─────────────────── */
function emptyLike(sample) {
  if (typeof sample === "string") return "";
  if (typeof sample === "number") return 0;
  if (typeof sample === "boolean") return false;
  if (Array.isArray(sample)) return sample.length ? [emptyLike(sample[0])] : [];
  if (sample && typeof sample === "object") {
    const o = {};
    for (const k of Object.keys(sample)) o[k] = emptyLike(sample[k]);
    return o;
  }
  return "";
}

function Node({ keyName, value, onChange }) {
  if (typeof value === "string") {
    return <Text label={humanize(keyName)} value={value} multiline={value.length > 56} onChange={onChange} />;
  }
  if (typeof value === "number") {
    return <Text label={humanize(keyName)} value={String(value)} onChange={(v) => onChange(v === "" ? 0 : Number(v))} />;
  }
  if (typeof value === "boolean") {
    return (
      <Select
        label={humanize(keyName)}
        value={String(value)}
        options={[{ value: "true", label: "Yes" }, { value: "false", label: "No" }]}
        onChange={(v) => onChange(v === "true")}
      />
    );
  }
  if (Array.isArray(value)) return <ArrayNode keyName={keyName} value={value} onChange={onChange} />;
  if (value && typeof value === "object") return <ObjectNode keyName={keyName} value={value} onChange={onChange} />;
  return null;
}

function ObjectNode({ keyName, value, onChange, open = false }) {
  return (
    <details className="tree-group" open={open}>
      <summary>
        <Icon name="chevronRight" size={14} /> {humanize(keyName)}
      </summary>
      <div className="tree-inner">
        {Object.keys(value).map((k) => (
          <Node key={k} keyName={k} value={value[k]} onChange={(nv) => onChange({ ...value, [k]: nv })} />
        ))}
      </div>
    </details>
  );
}

function ArrayNode({ keyName, value, onChange }) {
  const primitive = value.length === 0 || typeof value[0] !== "object";
  const removeAt = (i) => onChange(value.filter((_, idx) => idx !== i));
  const add = () => onChange([...value, value.length ? emptyLike(value[0]) : ""]);
  return (
    <details className="tree-group" open>
      <summary>
        <Icon name="chevronRight" size={14} /> {humanize(keyName)} · {value.length}
      </summary>
      <div className="tree-inner">
        {value.map((item, i) => (
          <div className="tree-item" key={i}>
            {primitive ? (
              <Text
                label={`#${i + 1}`}
                value={String(item ?? "")}
                multiline={String(item ?? "").length > 56}
                onChange={(nv) => {
                  const a = [...value];
                  a[i] = nv;
                  onChange(a);
                }}
              />
            ) : (
              Object.keys(item).map((k) => (
                <Node
                  key={k}
                  keyName={k}
                  value={item[k]}
                  onChange={(nv) => {
                    const a = [...value];
                    a[i] = { ...item, [k]: nv };
                    onChange(a);
                  }}
                />
              ))
            )}
            <div className="tree-row-tools">
              <Button variant="ghost" size="sm" icon="arrowUp" onClick={() => i > 0 && onChange(swap(value, i, i - 1))} />
              <Button variant="ghost" size="sm" icon="arrowDown" onClick={() => i < value.length - 1 && onChange(swap(value, i, i + 1))} />
              <Button variant="soft" size="sm" onClick={() => removeAt(i)}>
                Remove
              </Button>
            </div>
          </div>
        ))}
        <Button variant="soft" size="sm" icon="plus" onClick={add}>
          Add item
        </Button>
      </div>
    </details>
  );
}

function swap(arr, a, b) {
  const c = [...arr];
  [c[a], c[b]] = [c[b], c[a]];
  return c;
}

export function TreeEditor({ value, onChange }) {
  return (
    <div>
      {Object.keys(value).map((k) => (
        <Node key={k} keyName={k} value={value[k]} onChange={(nv) => onChange({ ...value, [k]: nv })} />
      ))}
    </div>
  );
}

/* ─────────────────────────────── Plans editor ────────────────── */
export function PlansEditor({ pricing, onChange }) {
  const plans = pricing?.plans || [];
  const setPlan = (i, patch) => {
    const next = plans.map((p, idx) => (idx === i ? { ...p, ...patch } : patch.popular ? { ...p, popular: idx === i } : p));
    onChange({ ...pricing, plans: next });
  };
  const setMeta = (patch) => onChange({ ...pricing, ...patch });

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 18 }}>
        <Text label="Currency symbol" value={pricing.currency} onChange={(v) => setMeta({ currency: v })} />
        <Text label="Per (e.g. /mo)" value={pricing.per} onChange={(v) => setMeta({ per: v })} />
        <Text label='Popular label' value={pricing.popular} onChange={(v) => setMeta({ popular: v })} />
      </div>
      {plans.map((p, i) => (
        <div className="tree-item" key={i} style={{ marginBottom: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Text label="Plan name (SKU)" value={p.sku} onChange={(v) => setPlan(i, { sku: v })} />
            <Text label="Price" value={p.price} onChange={(v) => setPlan(i, { price: v })} />
          </div>
          <Text label="Best for" value={p.best} multiline onChange={(v) => setPlan(i, { best: v })} />
          <Text label="CTA label" value={p.cta} onChange={(v) => setPlan(i, { cta: v })} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Select
              label="Button style"
              value={p.variant || "outline"}
              options={[{ value: "primary", label: "Primary (brand)" }, { value: "outline", label: "Outline" }]}
              onChange={(v) => setPlan(i, { variant: v })}
            />
            <Select
              label="Most popular?"
              value={p.popular ? "true" : "false"}
              options={[{ value: "false", label: "No" }, { value: "true", label: "Yes" }]}
              onChange={(v) => setPlan(i, { popular: v === "true" })}
            />
          </div>
          <Field label="Features">
            {(p.features || []).map((f, fi) => (
              <div key={fi} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                <input
                  style={{ flex: 1 }}
                  value={f}
                  onChange={(e) => {
                    const feats = [...p.features];
                    feats[fi] = e.target.value;
                    setPlan(i, { features: feats });
                  }}
                />
                <Button variant="soft" size="sm" onClick={() => setPlan(i, { features: p.features.filter((_, x) => x !== fi) })}>
                  ✕
                </Button>
              </div>
            ))}
            <Button variant="soft" size="sm" icon="plus" onClick={() => setPlan(i, { features: [...(p.features || []), "New feature"] })}>
              Add feature
            </Button>
          </Field>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────── Logos editor ──────────────────
   The logo LIST (names + images) is shared across all languages, so it
   is written to both `en` and `es`. The headline/eyebrow stay per-language. */
export function LogosEditor({ doc, lang, patchDoc }) {
  const logos = doc.en?.home?.logos?.names || [];
  const curLogos = doc[lang]?.home?.logos || {};
  const [busy, setBusy] = useState(-1);

  // Logo list → both languages stay identical.
  const set = (next) =>
    patchDoc((d) => ({
      ...d,
      en: { ...d.en, home: { ...d.en.home, logos: { ...d.en.home.logos, names: next } } },
      es: { ...d.es, home: { ...d.es.home, logos: { ...d.es.home.logos, names: next } } },
    }));
  // Headline / eyebrow → current language only.
  const setField = (key, val) =>
    patchDoc((d) => ({
      ...d,
      [lang]: { ...d[lang], home: { ...d[lang].home, logos: { ...d[lang].home.logos, [key]: val } } },
    }));

  const item = (l) => (typeof l === "string" ? { name: l } : l);
  const update = (i, patch) => set(logos.map((l, idx) => (idx === i ? { ...item(l), ...patch } : item(l))));

  const onUpload = async (i, file) => {
    if (!file) return;
    setBusy(i);
    try {
      const url = await uploadMedia(file, "logos");
      update(i, { image: url });
    } catch (e) {
      alert("Upload failed: " + e.message);
    } finally {
      setBusy(-1);
    }
  };

  return (
    <div>
      <Text label={`Section headline (${lang.toUpperCase()})`} value={curLogos.headline} multiline onChange={(v) => setField("headline", v)} />
      <Text label={`Eyebrow line (${lang.toUpperCase()})`} value={curLogos.eyebrow} onChange={(v) => setField("eyebrow", v)} />
      <div style={{ height: 10 }} />
      {logos.map((l, i) => {
        const it = item(l);
        return (
          <div className="logo-row" key={i}>
            {it.image ? <img className="logo-thumb" src={it.image} alt={it.name} /> : <div className="logo-thumb" />}
            <input style={{ flex: 1 }} value={it.name || ""} placeholder="Brand name" onChange={(e) => update(i, { name: e.target.value })} />
            <label className="af" style={{ margin: 0 }}>
              <span style={{ display: "none" }}>upload</span>
              <Button variant="soft" size="sm" icon="upload" onClick={(e) => e.currentTarget.parentElement.querySelector("input").click()}>
                {busy === i ? "…" : "Logo"}
              </Button>
              <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => onUpload(i, e.target.files[0])} />
            </label>
            {it.image && (
              <Button variant="ghost" size="sm" onClick={() => update(i, { image: null })}>
                Clear
              </Button>
            )}
            <Button variant="ghost" size="sm" icon="arrowUp" onClick={() => i > 0 && set(swap(logos, i, i - 1))} />
            <Button variant="ghost" size="sm" icon="arrowDown" onClick={() => i < logos.length - 1 && set(swap(logos, i, i + 1))} />
            <Button variant="soft" size="sm" onClick={() => set(logos.filter((_, x) => x !== i))}>
              ✕
            </Button>
          </div>
        );
      })}
      <Button variant="soft" size="sm" icon="plus" onClick={() => set([...logos, { name: "New brand" }])}>
        Add logo
      </Button>
    </div>
  );
}
