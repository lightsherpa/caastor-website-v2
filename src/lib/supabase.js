/* ──────────────────────────────────────────────────────────────────
   Supabase client. Reads public env vars (safe to expose — Row Level
   Security enforces all access). If the vars are absent the site still
   runs fully on its bundled content; the CMS simply stays dormant.
   ────────────────────────────────────────────────────────────────── */
import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anon);

export const supabase = isSupabaseConfigured
  ? createClient(url, anon, { auth: { persistSession: true, autoRefreshToken: true } })
  : null;

/* Storage helper — upload a file to the `media` bucket, return public URL. */
export async function uploadMedia(file, folder = "uploads") {
  if (!supabase) throw new Error("Supabase not configured");
  const ext = file.name.split(".").pop();
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 40);
  const path = `${folder}/${Date.now()}-${safe || "file"}.${ext}`.replace(/\.\.+/g, ".");
  const { error } = await supabase.storage.from("media").upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return data.publicUrl;
}
