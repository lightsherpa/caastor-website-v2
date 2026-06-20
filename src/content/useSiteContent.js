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
  return deepSanitize(restoreLogoCopy(restoreMetrics(merged, bundled), bundled));
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
