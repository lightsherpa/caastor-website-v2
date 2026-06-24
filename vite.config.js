import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Real-path routing (e.g. /blog/my-post) requires absolute asset URLs, so base "/".
export default defineConfig({
  base: "/",
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Stable vendor code split into long-lived cacheable chunks.
          react: ["react", "react-dom"],
          motion: ["motion"],
          three: ["three"],
          supabase: ["@supabase/supabase-js"],
          gsap: ["gsap"],
        },
      },
    },
  },
});
