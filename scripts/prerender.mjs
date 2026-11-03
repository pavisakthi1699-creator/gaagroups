/* After `vite build`: renders every page of the React app to static HTML (server-side rendering at build time).
   Each address gets dist/<address>/index.html with the full page content, its own title, description, canonical
   link, Open Graph and Twitter tags and JSON-LD structured data. Then 404.html, sitemap.xml and robots.txt.
   The browser then hydrates the page with React.
   Site address: SITE_URL, or Vercel's production domain. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const SSR = path.join(ROOT, "dist-ssr");
const entry = fs.readdirSync(SSR).find((f) => /^entry-server\.(m?js)$/.test(f));
const { render, ROUTES, NOT_FOUND, SITE, CONSULTING_DATA, FF_DATA, HF_DATA, COMPANY, POST_ROUTE, ADMIN_ROUTE } = await import(pathToFileURL(path.join(SSR, entry)).href);

const site = (
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "") ||
  "http://localhost:4300"
).replace(/\/+$/, "");
if (!process.env.SITE_URL && !process.env.VERCEL_PROJECT_PRODUCTION_URL)
  console.warn(`prerender: SITE_URL is not set, using ${site} for canonical links and the sitemap`);

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const template = fs.readFileSync(path.join(DIST, "index.html"), "utf8");
const ORG_ID = `${site}/#organization`;

const organization = {
  "@type": ["Organization", "ProfessionalService"],
  "@id": ORG_ID,
  name: SITE.name,
  legalName: SITE.company,
  url: `${site}/`,
  logo: `${site}${SITE.logo}`,
  image: `${site}${SITE.defaultImage}`,
  email: SITE.email,
  telephone: SITE.phone,
  address: { "@type": "PostalAddress", streetAddress: SITE.street, addressLocality: SITE.locality, addressRegion: SITE.region, postalCode: SITE.postalCode, addressCountry: SITE.country },
  areaServed: "IN",
  parentOrganization: { "@type": "Organization", name: SITE.parent },
  ...(SITE.sameAs.length ? { sameAs: SITE.sameAs } : {}),
};

const DATA = { "consulting-service": CONSULTING_DATA, "filings-service": FF_DATA, "hirings-service": HF_DATA };
const isService = (r) => !!DATA[r.kind];
function faqFor(r) {
  if (isService(r)) return DATA[r.kind][r.slug].faq || [];
  return [];
}

function schema(r, url, image) {
  const graph = [];
  const crumbs = [{ name: "Home", url: `${site}/` }];
  if (isService(r)) crumbs.push({ name: COMPANY[r.company].name, url: `${site}/${r.company}` });
  if (r.path !== "/") crumbs.push({ name: r.name, url });
  if (r.path === "/")
    graph.push(organization, { "@type": "WebSite", "@id": `${site}/#website`, url: `${site}/`, name: SITE.name, inLanguage: SITE.language, publisher: { "@id": ORG_ID } });
  graph.push({
    "@type": r.kind === "contact" ? "ContactPage" : r.kind === "insights" ? "CollectionPage" : r.kind === "group-about" ? "AboutPage" : "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: r.title,
    description: r.description,
    inLanguage: SITE.language,
    isPartOf: { "@id": `${site}/#website` },
    about: { "@id": ORG_ID },
    primaryImageOfPage: { "@type": "ImageObject", url: image },
    ...(crumbs.length > 1 ? { breadcrumb: { "@id": `${url}#breadcrumb` } } : {}),
  });
  if (crumbs.length > 1)
    graph.push({ "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`, itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: c.url })) });
  if (isService(r))
    graph.push({ "@type": "Service", "@id": `${url}#service`, name: r.name, serviceType: r.serviceType, description: r.description, url, provider: { "@type": "Organization", name: COMPANY[r.company].name, parentOrganization: { "@id": ORG_ID } }, areaServed: { "@type": "Country", name: "India" } });
  if (r.kind === "article") {
    const a = r.article;
    graph.push({ "@type": "Article", "@id": `${url}#article`, headline: a.title, description: a.summary, datePublished: a.date, dateModified: a.updated || a.date,
      author: { "@type": "Organization", name: a.author || SITE.name }, publisher: { "@id": ORG_ID }, mainEntityOfPage: { "@id": `${url}#webpage` }, image });
  }
  if (r.path !== "/") graph.push(organization);
  const q = faqFor(r);
  if (q.length) graph.push({ "@type": "FAQPage", "@id": `${url}#faq`, mainEntity: q.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) });
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
}

function head(r, url, index) {
  const image = site + (r.image || SITE.defaultImage);
  return [
    `<title>${esc(r.title)}</title>`,
    `<meta name="description" content="${esc(r.description)}" />`,
    `<meta name="robots" content="${index ? "index, follow, max-image-preview:large" : "noindex, follow"}" />`,
    url ? `<link rel="canonical" href="${url}" />` : "",
    `<meta name="theme-color" content="${SITE.themeColor}" />`,
    `<link rel="icon" type="image/png" href="/favicon.png" />`,
    `<link rel="apple-touch-icon" href="/apple-touch-icon.png" />`,
    `<meta property="og:type" content="${r.kind === "article" ? "article" : "website"}" />`,
    `<meta property="og:site_name" content="${esc(SITE.name)}" />`,
    `<meta property="og:locale" content="${SITE.locale}" />`,
    `<meta property="og:title" content="${esc(r.title)}" />`,
    `<meta property="og:description" content="${esc(r.description)}" />`,
    url ? `<meta property="og:url" content="${url}" />` : "",
    `<meta property="og:image" content="${image}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(r.title)}" />`,
    `<meta name="twitter:description" content="${esc(r.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    r.image ? `<link rel="preload" as="image" href="${r.image}" fetchpriority="high" />` : "",
    index ? `<script type="application/ld+json">${schema(r, url, image)}</script>` : "",
    `<noscript><style>.rv,.hm-t,.cr,.hr,.hm-c .eye,.hm-h1,.hm-p,.gc-r,.gc-svc,.gc-why-i,.gc-pr,.gc-ins-c,.gc-about-img,.ie-card,.ie-st,.ie-plan,.ie-why-i,.ie-q,.os-it,.wg-c,.gc-c{opacity:1!important;transform:none!important}</style></noscript>`,
  ].filter(Boolean).join("\n    ");
}

function page(r, url, index) {
  const html = render(r.path);
  return template.replace("<!--app-head-->", head(r, url, index)).replace("<!--app-html-->", html);
}

for (const r of ROUTES) {
  const url = site + (r.path === "/" ? "/" : r.path);
  const file = r.path === "/" ? path.join(DIST, "index.html") : path.join(DIST, r.path.slice(1), "index.html");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, page(r, url, true));
  console.log("prerendered", r.path.padEnd(36), "->", path.relative(DIST, file).replace(/\\/g, "/"));
}
fs.writeFileSync(path.join(DIST, "404.html"), page(NOT_FOUND, "", false));
console.log("prerendered", "404".padEnd(36), "-> 404.html");
/* template for blog articles: api/page.php fills in the title, tags and article for each /insights/<slug> */
fs.mkdirSync(path.join(DIST, "insights", "_post"), { recursive: true });
fs.writeFileSync(path.join(DIST, "insights", "_post", "index.html"), page(POST_ROUTE, "", true).replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, "<!--post-ld-->"));
console.log("prerendered", "/insights/<slug> template".padEnd(36), "-> insights/_post/index.html");
/* admin panel shell (not indexed) */
fs.mkdirSync(path.join(DIST, "admin"), { recursive: true });
fs.writeFileSync(path.join(DIST, "admin", "index.html"), page(ADMIN_ROUTE, "", false));
console.log("prerendered", "/admin".padEnd(36), "-> admin/index.html");
/* static pages for the server-side sitemap (api/sitemap.php adds the blog articles) */
fs.writeFileSync(path.join(DIST, "api-routes.json"), JSON.stringify(ROUTES.map((r) => ({ path: r.path, priority: r.priority || "0.5", image: r.image || "" }))));

const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(
  path.join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n` +
    ROUTES.map((r) => {
      const loc = site + (r.path === "/" ? "/" : r.path);
      const mod = r.article ? r.article.updated || r.article.date : today;
      const img = r.image ? `<image:image><image:loc>${site}${r.image}</image:loc></image:image>` : "";
      return `  <url><loc>${loc}</loc><lastmod>${mod}</lastmod><changefreq>monthly</changefreq><priority>${r.priority || "0.5"}</priority>${img}</url>`;
    }).join("\n") +
    `\n</urlset>\n`
);
fs.writeFileSync(path.join(DIST, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /admin\n\nSitemap: ${site}/sitemap.xml\n`);
fs.rmSync(SSR, { recursive: true, force: true });
console.log(`sitemap.xml (${ROUTES.length} pages) and robots.txt written for ${site}`);
