// Runs after `vite build`. For every route in src/routes.js it writes dist/<route>/index.html
// with that page's own <title>, description, canonical and Open Graph tags, so search engines
// and link previews see the right information without running JavaScript.
// It also writes sitemap.xml, robots.txt and SPA fallback files for common hosts.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
// Usage: node scripts/seo-pages.mjs <gaa|ff|hf>
const key = process.argv[2];
const { SITES } = await import(pathToFileURL(join(root, "src/routes.js")).href);
if (!SITES[key]) throw new Error("Pass the site: gaa, ff or hf");
const dist = join(root, "dist", key);
const { ROUTES, SITE, BRAND, ORG } = SITES[key];

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const base = readFileSync(join(dist, "index.html"), "utf8");

function head(r) {
  const url = SITE + (r.path === "/" ? "/" : r.path);
  const canonical = r.canonical || url;
  const ld = {
    "@context": "https://schema.org",
    "@type": ORG?.type || "Organization",
    name: BRAND,
    url: SITE,
    logo: SITE + "/logo.png",
    parentOrganization: { "@type": "Organization", name: "G Akshay and Associates (GAA Group)" },
    ...(ORG?.extra || {}),
  };
  return [
    `<title>${esc(r.title)}</title>`,
    `<meta name="description" content="${esc(r.description)}" />`,
    `<link rel="canonical" href="${esc(canonical)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(BRAND)}" />`,
    `<meta property="og:title" content="${esc(r.title)}" />`,
    `<meta property="og:description" content="${esc(r.description)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:image" content="${esc(SITE + "/og-image.png")}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(r.title)}" />`,
    `<meta name="twitter:description" content="${esc(r.description)}" />`,
    `<script type="application/ld+json">${JSON.stringify(ld)}</script>`,
  ].join("\n    ");
}

const marker = /<!--SEO-->[\s\S]*?<!--\/SEO-->/;
if (!marker.test(base)) throw new Error("index.html is missing the <!--SEO--> ... <!--/SEO--> block");

for (const r of ROUTES) {
  const html = base.replace(marker, `<!--SEO-->\n    ${head(r)}\n    <!--/SEO-->`);
  const dir = r.path === "/" ? dist : join(dist, r.path);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), html);
}
// 404 page = app shell (the app shows its own "page not found" view)
writeFileSync(join(dist, "404.html"), base.replace(marker, `<!--SEO-->\n    ${head({ path: "/404", title: `Page not found | ${BRAND}`, description: "This page could not be found." })}\n    <!--/SEO-->`));

const today = new Date().toISOString().slice(0, 10);
const urls = ROUTES.filter((r) => !r.canonical || r.canonical.startsWith(SITE))
  .map((r) => `  <url><loc>${SITE}${r.path === "/" ? "/" : r.path}</loc><lastmod>${today}</lastmod><priority>${r.path === "/" ? "1.0" : r.path.split("/").length > 3 ? "0.6" : "0.8"}</priority></url>`)
  .join("\n");
writeFileSync(join(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
writeFileSync(join(dist, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);

// SPA fallbacks for unknown deep links on popular hosts
writeFileSync(join(dist, "_redirects"), "/*  /404.html  404\n"); // Netlify
writeFileSync(join(dist, ".htaccess"), "Options -MultiViews\nDirectoryIndex index.html\nErrorDocument 404 /404.html\n"); // Apache / cPanel
console.log(`SEO: wrote ${ROUTES.length} pages, sitemap.xml and robots.txt for ${SITE}`);
