import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Real-path routing (e.g. /blog/my-post) requires absolute asset URLs, so base "/".
export default defineConfig({
  base: "/",
  plugins: [react()],
});
