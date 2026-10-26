import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// One project, three domains.
//   npm run dev          → all three sites together at http://localhost:5173
//   npm run build        → dist/gaa, dist/ff, dist/hf (one folder per domain)
const SITES = ["gaa", "ff", "hf"];

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: { port: 5173 },
  preview: { port: 4173 },
  build: {
    outDir: SITES.includes(mode) ? `dist/${mode}` : "dist",
    emptyOutDir: true,
    assetsInlineLimit: 0,
  },
}));
