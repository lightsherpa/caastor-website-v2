/* ──────────────────────────────────────────────────────────────────
   Content overlay: start from the bundled `content.js` (always works,
   instant, offline-safe), then overlay the live CMS document from
   Supabase when present. Arrays are replaced wholesale by the CMS;
   objects deep-merge; scalars override.
   ────────────────────────────────────────────────────────────────── */
import { useState, useEffect } from "react";
import { CONTENT } from "../content.js";
// `supabase` is imported dynamically so the heavy client stays out of the
// main bundle — it only loads when a CMS connection is actually configured.

export function deepMerge(base, over) {
  if (over === undefined || over === null) return base;
  if (Array.isArray(over)) return over; // CMS arrays win wholesale
  if (typeof over !== "object") return over;
  const out = { ...(base && typeof base === "object" ? base : {}) };
  for (const k of Object.keys(over)) {
    out[k] = deepMerge(base ? base[k] : undefined, over[k]);
  }
  return out;
}

/* The live CMS document predates several code fixes (em-dash removal,
   testimonial metrics). Until the CMS doc is re-synced, these guards
   apply those fixes to whatever content source is rendered. */
const EMDASH = /\s*—\s*/g;
function fixDashes(s) {
  return s.replace(EMDASH, (m, i, str) => (i + m.length >= str.length ? "," : ", "));
}
function deepSanitize(node) {
  if (typeof node === "string") return fixDashes(node);
  if (Array.isArray(node)) return node.map(deepSanitize);
  if (node && typeof node === "object") {
    const out = {};
    for (const k of Object.keys(node)) out[k] = deepSanitize(node[k]);
    return out;
  }
  return node;
}
/* Re-attach testimonial metrics from the bundle if the CMS quotes lack
   them (CMS arrays replace wholesale, dropping the newer fields). */
function restoreMetrics(merged, base) {
  for (const lang of ["en", "es"]) {
    const mq = merged[lang]?.home?.testimonials?.quotes;
    const bq = base[lang]?.home?.testimonials?.quotes;
    if (Array.isArray(mq) && Array.isArray(bq)) {
      mq.forEach((q, i) => {
        if (q && !q.metric) {
          const b = bq.find((x) => x.name === q.name) || bq[i];
          if (b) {
            q.metric = b.metric;
            q.metricLabel = b.metricLabel;
          }
        }
      });
    }
  }
  return merged;
}

/* Re-attach code-owned structural fields that a live/stale CMS doc may be
   missing. CMS arrays replace wholesale and object overlays can predate newer
   code-owned keys, so each guard copies these back from the bundle (matched by
   index/name) without disturbing CMS-owned copy. */
function restoreStructural(merged, base) {
  for (const lang of ["en", "es"]) {
    const m = merged[lang];
    const b = base[lang];
    if (!m || !b) continue;

    // home.intro.compare — code-owned comparison table.
    if (m.home?.intro && !m.home.intro.compare && b.home?.intro?.compare) {
      m.home.intro.compare = b.home.intro.compare;
    }

    // about.timeline — code-owned milestone list.
    if (m.about && !Array.isArray(m.about.timeline) && Array.isArray(b.about?.timeline)) {
      m.about.timeline = b.about.timeline;
    }

    // home.bundles.items[].{price,useCase,excludes} — matched by name, then index.
    const mItems = m.home?.bundles?.items;
    const bItems = b.home?.bundles?.items;
    if (Array.isArray(mItems) && Array.isArray(bItems)) {
      mItems.forEach((it, i) => {
        if (!it) return;
        const src = bItems.find((x) => x.name === it.name) || bItems[i];
        if (!src) return;
        if (it.price === undefined) it.price = src.price;
        if (it.useCase === undefined) it.useCase = src.useCase;
        if (it.excludes === undefined) it.excludes = src.excludes;
      });
    }

    // pricing.plans[].priceYearly (matched by sku, then index) + pricing.billing + pricing.yearlyPer.
    const mPlans = m.pricing?.plans;
    const bPlans = b.pricing?.plans;
    if (Array.isArray(mPlans) && Array.isArray(bPlans)) {
      mPlans.forEach((p, i) => {
        if (!p) return;
        const src = bPlans.find((x) => x.sku === p.sku) || bPlans[i];
        if (src && p.priceYearly === undefined) p.priceYearly = src.priceYearly;
      });
    }
    if (m.pricing) {
      if (m.pricing.billing === undefined && b.pricing?.billing !== undefined) m.pricing.billing = b.pricing.billing;
      if (m.pricing.yearlyPer === undefined && b.pricing?.yearlyPer !== undefined) m.pricing.yearlyPer = b.pricing.yearlyPer;
    }
  }
  return merged;
}

/* The logo *images* are CMS-managed (user uploads), but the surrounding
   copy is code-owned. The live CMS doc has stale, off-brand headline copy
   ("…Apple, and a bunch of startups"), so restore those two strings from
   the bundle while keeping the uploaded logo list. */
function restoreLogoCopy(merged, base) {
  for (const lang of ["en", "es"]) {
    const ml = merged[lang]?.home?.logos;
    const bl = base[lang]?.home?.logos;
    if (ml && bl) {
      ml.headline = bl.headline;
      ml.eyebrow = bl.eyebrow;
    }
  }
  return merged;
}

export function mergeContent(bundled, cms) {
  if (!cms) return deepSanitize(bundled);
  const merged = {
    en: deepMerge(bundled.en, cms.en),
    es: deepMerge(bundled.es, cms.es),
  };
  return deepSanitize(
    restoreLogoCopy(restoreStructural(restoreMetrics(merged, bundled), bundled), bundled)
  );
}

/** Fetch the singleton site_content document (id = 1). */
export async function fetchSiteContent() {
  const { supabase, isSupabaseConfigured } = await import("../lib/supabase.js");
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase.from("site_content").select("data").eq("id", 1).maybeSingle();
  if (error || !data) return null;
  return data.data;
}

export function useSiteContent() {
  const [content, setContent] = useState(CONTENT);
  useEffect(() => {
    // Skip loading the Supabase chunk entirely when the CMS isn't wired up.
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) return;
    let active = true;
    fetchSiteContent().then((doc) => {
      if (active && doc) setContent(mergeContent(CONTENT, doc));
    });
    return () => {
      active = false;
    };
  }, []);
  return content;
}
