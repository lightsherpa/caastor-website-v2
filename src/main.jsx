import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/tokens.css";
import "./styles/site.css";
import "./motion/motion.css";
import "./blog/blog.css";
import "./admin/admin.css";
import App from "./App.jsx";
import { Analytics } from "@vercel/analytics/react";

/* Magic-link safety net: if Supabase redirects the auth token to the site root
   (its fallback Site URL, when /admin isn't in the allowed Redirect URLs), the
   homepage would load instead of the CMS. Detect an auth token off /admin and
   forward it to /admin with the token preserved, so the session lands there.
   Runs synchronously before React/Supabase so the token isn't consumed early. */
(() => {
  const { pathname, search, hash } = window.location;
  const hasAuthToken = /(?:access_token|refresh_token)=|[?&]code=|type=(?:magiclink|recovery|invite|signup|email)/.test(hash + search);
  if (hasAuthToken && pathname !== "/admin") {
    window.location.replace("/admin" + search + hash);
  }
})();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <Analytics />
  </StrictMode>
);
