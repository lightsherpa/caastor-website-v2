/* Caastor v2 — admin entry: Supabase magic-link auth, admin gate,
   dashboard with Content / Plans / Logos / Blog. */
import { useState, useEffect } from "react";
import { Button, Icon } from "../ds/components.jsx";
import { Text } from "./ui.jsx";
import { supabase, isSupabaseConfigured } from "../lib/supabase.js";
import { fetchSiteContent } from "../content/useSiteContent.js";
import { CONTENT } from "../content.js";
import { TreeEditor, PlansEditor, LogosEditor } from "./editors.jsx";
import { BlogAdmin } from "./BlogAdmin.jsx";

const clone = (o) => JSON.parse(JSON.stringify(o));

/* ── Not configured ───────────────────────────────────────────── */
function SetupPanel({ navigate }) {
  return (
    <div className="admin-center">
      <div className="admin-login">
        <img src="/assets/logo-full-yellow.png" alt="Caastor" style={{ height: 28, marginBottom: 20 }} />
        <h1 className="admin-h">Connect Supabase to enable the CMS</h1>
        <p className="admin-sub">
          The site is running on its bundled content. To edit content, add your Supabase keys
          (<code>VITE_SUPABASE_URL</code>, <code>VITE_SUPABASE_ANON_KEY</code>) and run the SQL in{" "}
          <code>supabase/schema.sql</code>. Full steps are in <code>SUPABASE-SETUP.md</code>.
        </p>
        <Button variant="outline" size="md" onClick={() => navigate("home")}>
          ← Back to site
        </Button>
      </div>
    </div>
  );
}

/* ── Login (magic link) ───────────────────────────────────────── */
function Login() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState("");

  const send = async (e) => {
    e?.preventDefault();
    setErr("");
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setErr("Enter a valid email address.");
      return;
    }
    setSending(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: trimmed,
        options: { emailRedirectTo: window.location.origin + "/admin" },
      });
      if (error) setErr(error.message || "Couldn’t send the link. Please try again.");
      else setSent(true);
    } catch (e2) {
      setErr(e2?.message || "Network error — check your connection and try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="admin-center">
      <div className="admin-login">
        <img src="/assets/logo-full-yellow.png" alt="Caastor" style={{ height: 28, marginBottom: 20 }} />
        {sent ? (
          <>
            <h1 className="admin-h">Check your inbox</h1>
            <div className="admin-note admin-note--ok">
              <Icon name="check" size={18} />
              <span>
                We emailed a magic link to <strong>{email.trim()}</strong>. Open it on this device to finish signing in.
              </span>
            </div>
            <p className="admin-sub" style={{ margin: "16px 0 14px" }}>
              The link expires after a short while and can only be used once. Don’t see it? Check spam, then resend.
            </p>
            <Button
              variant="outline"
              size="md"
              full
              onClick={() => {
                setSent(false);
                setErr("");
              }}
            >
              Use a different email or resend
            </Button>
          </>
        ) : (
          <>
            <h1 className="admin-h">Admin sign in</h1>
            <p className="admin-sub">We’ll email you a magic link — no password.</p>
            <form onSubmit={send} noValidate>
              <Text label="Email" value={email} onChange={setEmail} placeholder="you@caastor.co" />
              {err && (
                <p className="admin-error" role="alert">
                  <Icon name="flag" size={15} /> {err}
                </p>
              )}
              <Button variant="primary" size="lg" full iconEnd="arrowRight" onClick={send} disabled={sending}>
                {sending ? "Sending…" : "Send magic link"}
              </Button>
            </form>
            <p className="admin-hint">
              Link doesn’t arrive or lands on an error page? The current domain ({window.location.origin}) must be listed in your
              Supabase project under <strong>Authentication → URL Configuration</strong> (both the Site URL and the Redirect URLs).
            </p>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Dashboard ────────────────────────────────────────────────── */
const TABS = [
  { key: "content", label: "Content", icon: "message" },
  { key: "plans", label: "Plans", icon: "grid" },
  { key: "logos", label: "Logos", icon: "star" },
  { key: "blog", label: "Blog", icon: "layers" },
];

function Dashboard({ session, navigate, theme, toggleTheme }) {
  const [tab, setTab] = useState("content");
  const [lang, setLang] = useState("en");
  const [doc, setDoc] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSiteContent().then((d) => setDoc(d || clone(CONTENT)));
  }, []);

  const updateLang = (next) => {
    setDoc((d) => ({ ...d, [lang]: next }));
    setDirty(true);
  };

  // Lets editors patch the whole document (e.g. write a shared value to both languages).
  const patchDoc = (fn) => {
    setDoc((d) => fn(d));
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from("site_content").upsert({ id: 1, data: doc, updated_at: new Date().toISOString() });
      if (error) throw error;
      setDirty(false);
    } catch (e) {
      alert("Save failed: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const signOut = () => supabase.auth.signOut();

  if (!doc) {
    return (
      <div className="admin">
        <div className="admin-main">Loading…</div>
      </div>
    );
  }

  const langData = doc[lang] || {};

  return (
    <div className="admin">
      <div className="admin-topbar">
        <div className="admin-brand">
          <img src="/assets/logo-full-yellow.png" alt="Caastor" style={{ height: 22 }} />
          <span className="t-mono">CMS</span>
        </div>
        {tab !== "blog" && (
          <div className="lang-toggle" role="group" aria-label="Language" style={{ marginLeft: 8 }}>
            <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")}>
              EN
            </button>
            <button className={lang === "es" ? "on" : ""} onClick={() => setLang("es")}>
              ES
            </button>
          </div>
        )}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          <button className="icon-btn" onClick={(e) => toggleTheme(e)} aria-label="Theme">
            <Icon name={theme === "dark" ? "sun" : "moon"} size={18} />
          </button>
          <Button variant="ghost" size="sm" icon="link" onClick={() => navigate("home")}>
            View site
          </Button>
          <Button variant="soft" size="sm" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </div>

      <div className="admin-body">
        <nav className="admin-nav">
          {TABS.map((tt) => (
            <button key={tt.key} className={tab === tt.key ? "on" : ""} onClick={() => setTab(tt.key)}>
              <Icon name={tt.icon} size={16} /> {tt.label}
            </button>
          ))}
          <div style={{ marginTop: 16, padding: "0 12px", fontSize: 12, color: "var(--text-quaternary)" }}>
            Signed in as<br />
            <span style={{ color: "var(--text-tertiary)" }}>{session.user.email}</span>
          </div>
        </nav>

        <main className="admin-main">
          {tab === "content" && (
            <>
              <div className="admin-h">Site content</div>
              <p className="admin-sub">Every text on the site, in {lang.toUpperCase()}. Edit a field and hit Save.</p>
              <TreeEditor value={langData} onChange={updateLang} />
            </>
          )}
          {tab === "plans" && (
            <>
              <div className="admin-h">Pricing plans</div>
              <p className="admin-sub">Prices, features and the “most popular” flag ({lang.toUpperCase()}).</p>
              <PlansEditor pricing={langData.pricing} onChange={(pricing) => updateLang({ ...langData, pricing })} />
            </>
          )}
          {tab === "logos" && (
            <>
              <div className="admin-h">Logo wall</div>
              <p className="admin-sub">Logos are shared across all languages. The headline text stays per-language ({lang.toUpperCase()}).</p>
              <LogosEditor doc={doc} lang={lang} patchDoc={patchDoc} />
            </>
          )}
          {tab === "blog" && <BlogAdmin />}
        </main>
      </div>

      {dirty && tab !== "blog" && (
        <div className="admin-savebar">
          <span>Unsaved changes</span>
          <Button variant="primary" size="md" onClick={save}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      )}
    </div>
  );
}

/* ── Orchestrator ─────────────────────────────────────────────── */
export function AdminApp({ navigate, theme, toggleTheme }) {
  const [session, setSession] = useState(undefined); // undefined = loading
  const [isAdmin, setIsAdmin] = useState(null); // null = unchecked, true/false = result
  const [gateError, setGateError] = useState("");

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    supabase.auth
      .getSession()
      .then(({ data }) => setSession(data.session || null))
      .catch(() => setSession(null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s || null));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) {
      setIsAdmin(null);
      setGateError("");
      return;
    }
    let cancelled = false;
    setIsAdmin(null);
    setGateError("");
    supabase
      .from("admins")
      .select("email")
      .eq("email", session.user.email)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        // A missing row is not an error (maybeSingle → data null). A real
        // error (network / RLS) shouldn't masquerade as "not an admin".
        if (error) setGateError(error.message || "Couldn’t verify access.");
        setIsAdmin(!!data);
      });
    return () => {
      cancelled = true;
    };
  }, [session]);

  if (!isSupabaseConfigured) return <SetupPanel navigate={navigate} />;
  if (session === undefined) return <AdminLoading label="Loading admin…" />;
  if (!session) return <Login />;
  if (isAdmin === null) return <AdminLoading label="Verifying your access…" />;
  if (!isAdmin) {
    return (
      <div className="admin-center">
        <div className="admin-login" style={{ textAlign: "center" }}>
          <img src="/assets/logo-full-yellow.png" alt="Caastor" style={{ height: 28, margin: "0 auto 20px" }} />
          <h1 className="admin-h">{gateError ? "Couldn’t verify access" : "This account isn’t an admin"}</h1>
          {gateError ? (
            <p className="admin-sub">
              We reached Supabase but the access check failed: <strong>{gateError}</strong>. This is usually a Row Level
              Security policy on the <code>admins</code> table. Try again, or sign out and use a different account.
            </p>
          ) : (
            <p className="admin-sub">
              You’re signed in as <strong>{session.user.email}</strong>, but it isn’t on the admin list. Add this exact
              email to the <code>admins</code> table in Supabase, then sign out and back in.
            </p>
          )}
          <div className="admin-actions">
            <Button variant="soft" size="md" full onClick={() => supabase.auth.signOut()}>
              Sign out
            </Button>
            <Button variant="ghost" size="md" full onClick={() => navigate("home")}>
              ← Back to site
            </Button>
          </div>
        </div>
      </div>
    );
  }
  return <Dashboard session={session} navigate={navigate} theme={theme} toggleTheme={toggleTheme} />;
}

/* ── Loading splash ───────────────────────────────────────────── */
function AdminLoading({ label }) {
  return (
    <div className="admin-center">
      <div className="admin-loading">
        <span className="admin-spinner" aria-hidden />
        <span>{label}</span>
      </div>
    </div>
  );
}
