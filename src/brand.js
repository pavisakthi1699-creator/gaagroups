// Which domain this build is for: "gaa" | "ff" | "hf".
// Set by the build mode (.env.gaa, .env.ff, .env.hf). `npm run dev` shows all three sites together.
export const CURRENT = import.meta.env.VITE_SITE || "gaa";
export const LOCAL =
  import.meta.env.DEV ||
  (typeof window !== "undefined" && /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname));
