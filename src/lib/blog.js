/* ──────────────────────────────────────────────────────────────────
   Blog data access (Supabase `blog_posts`). Public reads see only
   published rows (enforced by RLS); admin functions require auth.
   ────────────────────────────────────────────────────────────────── */
import { supabase, isSupabaseConfigured } from "./supabase.js";

export const BLOG_ENABLED = isSupabaseConfigured;

/** Published posts for a language, newest first. */
export async function fetchPublishedPosts(lang) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("blog_posts")
    .select("slug, lang, title, excerpt, cover_url, tags, author, published_at")
    .eq("status", "published")
    .eq("lang", lang)
    .order("published_at", { ascending: false });
  if (error) return [];
  return data || [];
}

/** A single published post by slug (prefers the requested language). */
export async function fetchPostBySlug(slug, lang) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published");
  if (error || !data || !data.length) return null;
  return data.find((p) => p.lang === lang) || data[0];
}

/* ── Admin CRUD (requires an authenticated admin; RLS enforces) ── */
export async function listAllPosts() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, slug, lang, status, title, author, published_at, updated_at")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getPost(id) {
  const { data, error } = await supabase.from("blog_posts").select("*").eq("id", id).single();
  if (error) throw error;
  return data;
}

export async function savePost(post) {
  const row = { ...post, updated_at: new Date().toISOString() };
  const { data, error } = await supabase.from("blog_posts").upsert(row).select().single();
  if (error) throw error;
  return data;
}

export async function deletePost(id) {
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) throw error;
}

/** Flip a post between draft/published without touching its content.
   Stamps published_at the first time it goes live. */
export async function setPostStatus(id, status, publishedAt) {
  const patch = { status, updated_at: new Date().toISOString() };
  if (status === "published" && !publishedAt) patch.published_at = new Date().toISOString();
  const { error } = await supabase.from("blog_posts").update(patch).eq("id", id);
  if (error) throw error;
}
