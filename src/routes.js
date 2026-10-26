// SEO data for all three domains. Plain JavaScript (no Vite-only code) so scripts/seo-pages.mjs
// can read it too. Each domain gets the shared group pages (/, /about, /contact) with its own
// titles, plus its own company pages.
import * as gaa from "./seo/gaa.js";
import * as ff from "./seo/ff.js";
import * as hf from "./seo/hf.js";

export const SITES = { gaa, ff, hf };

// Which company a path belongs to (null for the shared group pages)
export function brandOfPath(path) {
  if (path.startsWith("/gaa-consulting")) return "gaa";
  if (path.startsWith("/filings-first")) return "ff";
  if (path.startsWith("/hirings-first")) return "hf";
  return null;
}

export function seoFor(path, here = "gaa") {
  const site = SITES[brandOfPath(path) || here];
  const r = site.ROUTES.find((x) => x.path === path);
  if (r) return { ...r, canonical: r.canonical || site.SITE + r.path };
  return { path, title: `Page not found | ${site.BRAND}`, description: "This page could not be found.", canonical: site.SITE + path };
}
