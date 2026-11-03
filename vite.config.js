import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/* npm run dev serves the React site on http://localhost:5173.
   The PHP backend (blog, forms, admin) runs with "npm run api" on http://localhost:8000 and is reached through the proxy below. */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:8000",
      "/uploads": "http://localhost:8000",
      "/sitemap.xml": { target: "http://localhost:8000", rewrite: () => "/api/sitemap.php" },
    },
  },
  build: { cssCodeSplit: false, chunkSizeWarningLimit: 900 },
});
