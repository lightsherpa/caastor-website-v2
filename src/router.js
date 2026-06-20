/* ──────────────────────────────────────────────────────────────────
   Caastor v2 — tiny History-API router (real paths, no dependency).
   Static pages map 1:1; /blog/:slug is parsed dynamically.
   ────────────────────────────────────────────────────────────────── */

export const STATIC_ROUTES = {
  "/": "home",
  "/services": "services",
  "/pricing": "pricing",
  "/about-us": "about",
  "/contact-us": "contact",
  "/faq": "faq",
  "/blog": "blog",
  "/admin": "admin",
};

// key → canonical path (used by nav links)
export const PATH_OF = {
  home: "/",
  services: "/services",
  pricing: "/pricing",
  about: "/about-us",
  contact: "/contact-us",
  faq: "/faq",
  blog: "/blog",
  admin: "/admin",
};

export function parseLocation() {
  const path = window.location.pathname || "/";
  if (STATIC_ROUTES[path]) return { route: STATIC_ROUTES[path], slug: null, path };
  const m = path.match(/^\/blog\/(.+?)\/?$/);
  if (m) return { route: "blogpost", slug: decodeURIComponent(m[1]), path };
  return { route: "notfound", slug: null, path };
}

// Resolve a navigation target (a route key, or a raw "/path") to a pathname.
export function pathForTarget(target) {
  if (typeof target === "string" && target.startsWith("/")) return target;
  return PATH_OF[target] || "/";
}
