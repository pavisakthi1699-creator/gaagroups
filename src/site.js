/* One website for GAA Group and its three companies, on one domain:
     /                 GAA Group (shared Home, About, Our Team, Careers, Insights, Contact)
     /gaa-consulting   GAA Consulting and its service pages
     /filings-first    Filings First and its service pages
     /hirings-first    Hirings First and its service pages
     /admin            Admin panel (blog posts, form submissions, subscribers)
   Used by the React app and by scripts/prerender.mjs (search engine tags, structured data, sitemap). */
import consultingServices from "./data/consulting-services.json";
import { SERVICES as FF_SERVICES } from "./data/services.js";
import { HF_SERVICES } from "./data/hirings-services.js";

export const SITE = {
  name: "GAA Group",
  locale: "en_IN",
  language: "en-IN",
  themeColor: "#E0612F",
  defaultImage: "/og-image.jpg",
  logo: "/logo.png",
  company: "G Akshay & Associates",
  parent: "GAA Group",
  email: "Akshay@gakshayassociates.com",
  phone: "+91 80 4890 2200",
  phoneHref: "+918048902200",
  address: "#389, 2nd Floor, 5th Main Road, Vijaya Bank Layout, Bilekahalli, Bengaluru, Karnataka 560076",
  street: "#389, 2nd Floor, 5th Main Road, Vijaya Bank Layout, Bilekahalli",
  locality: "Bengaluru",
  region: "Karnataka",
  postalCode: "560076",
  country: "IN",
  linkedin: "", // add the LinkedIn page URL here
  sameAs: [],
};

const CONSULTING_NAV = [
  { slug: "india-entry", name: "India Entry Desk", short: "Market entry, incorporation and operations in India", contact: "india-entry" },
  { slug: "corporate-advisory", name: "Corporate Advisory", short: "Company law, governance and board matters", contact: "corporate" },
  { slug: "transactional-advisory", name: "Transactional Advisory", short: "Mergers, acquisitions, due diligence and restructuring", contact: "transactions" },
  { slug: "fundraising-advisory", name: "Fundraising Advisory", short: "Investment rounds, documentation and filings", contact: "fundraising" },
  { slug: "nbfc-compliance-office", name: "NBFC Compliance Office", short: "NBFC registration and RBI compliance", contact: "nbfc" },
  { slug: "startup-compliance-office", name: "Startup Compliance Office", short: "Incorporation to annual compliance for startups", contact: "startup" },
];

const CONSULTING_META = {
  "india-entry": {
    title: "India Entry Desk | Set Up and Operate in India | GAA Consulting",
    description:
      "India Entry Desk by GAA Consulting: incorporation, resident director, registered office, FEMA compliance, bank account and Razorpay integration, accounting, tax and ongoing compliance for foreign companies entering India.",
    serviceType: "Market entry and business setup in India",
  },
  "corporate-advisory": {
    title: "Corporate Advisory | Company Law & Governance | GAA Consulting",
    description:
      "Corporate Advisory by GAA Consulting: company law advice, board and shareholder matters, governance frameworks, secretarial audit, agreements and regulatory representation.",
    serviceType: "Corporate law and governance advisory",
  },
  "transactional-advisory": {
    title: "Transactional Advisory | M&A, Due Diligence & Restructuring | GAA Consulting",
    description:
      "Transactional Advisory by GAA Consulting: transaction structuring, legal and secretarial due diligence, mergers and amalgamations, acquisitions, restructuring and documentation.",
    serviceType: "Transaction advisory",
  },
  "fundraising-advisory": {
    title: "Fundraising Advisory | Investment Rounds & Filings | GAA Consulting",
    description:
      "Fundraising Advisory by GAA Consulting: investment readiness, cap table, term sheets, shareholders' agreements, share allotments, FEMA reporting and ESOPs for founders and companies.",
    serviceType: "Fundraising advisory",
  },
  "nbfc-compliance-office": {
    title: "NBFC Compliance Office | Registration & RBI Compliance | GAA Consulting",
    description:
      "NBFC Compliance Office by GAA Consulting: NBFC registration, RBI returns and reporting, change in control approvals, governance policies and corporate secretarial compliance.",
    serviceType: "NBFC regulatory compliance",
  },
  "startup-compliance-office": {
    title: "Startup Compliance Office | Incorporation to Annual Compliance | GAA Consulting",
    description:
      "Startup Compliance Office by GAA Consulting: incorporation, founder agreements, Startup India recognition, ESOPs, fundraising filings and annual ROC compliance for startups.",
    serviceType: "Startup compliance",
  },
};

/* Main menu. Set show: false to hide an item, true to show it again. */
export const NAV = [
  { to: "/", label: "Home", show: true },
  { to: "/about", label: "About Us", show: true },
  { companies: true, label: "Our Companies", show: false },
  { to: "/our-team", label: "Our Team", show: true },
  { to: "/insights", label: "Insights", show: false },
  { to: "/careers", label: "Careers", show: false },
  { to: "/contact", label: "Contact", show: true },
];

/* The three companies */
export const COMPANIES = [
  {
    id: "gaa-consulting", name: "GAA Consulting", tag: "Advisory", logo: "/images/gaa-consulting-mark.webp",
    short: "Corporate and transaction advisory, India entry and NBFC matters.",
    services: CONSULTING_NAV.map((s) => ({ ...s, path: `/gaa-consulting/${s.slug}` })),
  },
  {
    id: "filings-first", name: "Filings First", tag: "Business support", logo: "/images/ff-mark.png",
    short: "Accounting, tax, statutory filings and startup compliance.",
    services: FF_SERVICES.map((s) => ({ slug: s.slug, name: s.name, short: s.short, contact: s.contact, icon: s.icon, path: `/filings-first/${s.slug}` })),
  },
  {
    id: "hirings-first", name: "Hirings First", tag: "Talent & people", logo: "/images/hirings-first-mark.webp",
    short: "Recruitment, workforce solutions and HR support.",
    services: HF_SERVICES.map((s) => ({ slug: s.slug, name: s.name, short: s.short, contact: s.contact, icon: s.icon, path: `/hirings-first/${s.slug}` })),
  },
];
export const COMPANY = Object.fromEntries(COMPANIES.map((c) => [c.id, c]));

/* service page content by company */
export const CONSULTING_DATA = Object.fromEntries(consultingServices.map((s) => [s.slug, s]));
export const FF_DATA = Object.fromEntries(FF_SERVICES.map((s) => [s.slug, s]));
export const HF_DATA = Object.fromEntries(HF_SERVICES.map((s) => [s.slug, s]));
export const FF_NAV = COMPANY["filings-first"].services;
export const HF_NAV = COMPANY["hirings-first"].services;
/* kept for older imports */
export const SERVICE_NAV = FF_NAV;
export const SERVICE_DATA = FF_DATA;
export const GROUP = {
  group: { name: "GAA Group", url: "/", img: "/images/gaa-mark.webp", tag: "The group" },
  consulting: { name: "GAA Consulting", url: "/gaa-consulting", img: "/images/gaa-consulting-mark.webp", tag: "Advisory" },
  filings: { name: "Filings First", url: "/filings-first", img: "/images/ff-mark.png", tag: "Business support" },
  hirings: { name: "Hirings First", url: "/hirings-first", img: "/images/hirings-first-mark.webp", tag: "Talent & people" },
};

/* Every page with a fixed address. kind decides which page component is shown; company decides the header brand. */
export const ROUTES = [
  { path: "/", kind: "group-home", name: "Home", priority: "1.0",
    title: "GAA Group | Advisory, Compliance and Talent in Bengaluru",
    description: "GAA Group brings together GAA Consulting, Filings First and Hirings First: corporate advisory, accounting and tax compliance, and recruitment and HR for growing businesses." },
  { path: "/about", kind: "group-about", name: "About Us", priority: "0.8",
    title: "About Us | GAA Group",
    description: "One group for every dimension of business growth. Learn how GAA Consulting, Filings First and Hirings First work together to support businesses across their lifecycle." },
  { path: "/our-team", kind: "team", name: "Our Team", priority: "0.6",
    title: "Our Team | GAA Group",
    description: "Meet the professionals behind GAA Group: advisers, accountants, company secretaries and talent specialists working as one team in Bengaluru." },
  { path: "/careers", kind: "group-careers", name: "Careers", priority: "0.6",
    title: "Careers | GAA Group",
    description: "Careers at GAA Group: CS Articleship, CS Semi-qualified and CS Qualified roles, opportunities for lawyers, and college internship programmes in Bengaluru." },
  { path: "/insights", kind: "insights", name: "Insights", priority: "0.8",
    title: "Insights & Blog | GAA Group",
    description: "Practical articles from GAA Consulting, Filings First and Hirings First on corporate law, India entry, GST and tax, compliance, hiring and HR, plus a compliance due date planner." },
  { path: "/contact", kind: "contact", name: "Contact Us", priority: "0.8",
    title: "Contact Us | GAA Group",
    description: "Contact GAA Group in Bengaluru. Request a fixed-scope proposal and your enquiry goes straight to GAA Consulting, Filings First or Hirings First." },
  { path: "/privacy", kind: "privacy", name: "Privacy, Terms and Disclaimer", priority: "0.3",
    title: "Privacy, Terms and Disclaimer | GAA Group",
    description: "Privacy policy, cookie policy, terms of use and disclaimer for the GAA Group websites, operated by G Akshay & Associates." },

  { path: "/gaa-consulting", kind: "consulting-home", company: "gaa-consulting", name: "GAA Consulting", priority: "0.9", image: "/images/consulting/gaa-skyline.webp",
    title: "GAA Consulting | Corporate Legal, Regulatory & Strategic Advisory in Bengaluru",
    description: "GAA Consulting partners with businesses, founders and institutions on corporate law, governance, NBFC and RBI advisory, FEMA, capital markets, transactions and startup advisory." },
  ...CONSULTING_NAV.map((s) => ({ path: `/gaa-consulting/${s.slug}`, kind: "consulting-service", company: "gaa-consulting", slug: s.slug, name: s.name,
    ...CONSULTING_META[s.slug], priority: "0.9", image: `/images/consulting/${s.slug}.webp` })),

  { path: "/filings-first", kind: "filings-home", company: "filings-first", name: "Filings First", priority: "0.9",
    title: "Filings First | Accounting, Tax & Startup Compliance in Bengaluru",
    description: "Filings First looks after bookkeeping, GST, TDS, income tax and ROC compliance for startups and growing businesses. Part of GAA Group, Bengaluru." },
  ...FF_SERVICES.map((s) => ({ path: `/filings-first/${s.slug}`, kind: "filings-service", company: "filings-first", slug: s.slug, name: s.name,
    title: s.metaTitle, description: s.metaDescription, serviceType: s.serviceType, priority: "0.9" })),

  { path: "/hirings-first", kind: "hirings-home", company: "hirings-first", name: "Hirings First", priority: "0.9",
    title: "Hirings First | Recruitment, Talent Acquisition & HR Solutions in Bengaluru",
    description: "Hirings First helps growing businesses hire the right people and run their people operations: recruitment for business and leadership roles, HR policies and labour law compliance." },
  ...HF_SERVICES.map((s) => ({ path: `/hirings-first/${s.slug}`, kind: "hirings-service", company: "hirings-first", slug: s.slug, name: s.name,
    title: s.metaTitle, description: s.metaDescription, serviceType: s.serviceType, priority: "0.9" })),
];

/* blog article template (filled in by the server for each /insights/<slug>) */
export const POST_ROUTE = { path: "/insights/_post", kind: "post", name: "Article", title: "Article | GAA Group Insights", description: "An article from GAA Group Insights." };
export const ADMIN_ROUTE = { path: "/admin", kind: "admin", name: "Admin", title: "Admin | GAA Group", description: "GAA Group website admin." };

export const NOT_FOUND = { path: "/404", kind: "notfound", name: "Page not found", title: "Page not found | GAA Group", description: "The page you are looking for could not be found." };

/* old addresses from the separate websites */
const ALIASES = {
  "/home": "/", "/team": "/our-team", "/about-us": "/about", "/contact-us": "/contact",
  ...Object.fromEntries(CONSULTING_NAV.map((s) => [`/services/${s.slug}`, `/gaa-consulting/${s.slug}`])),
};

export function normalise(pathname) {
  let p = (pathname || "/").replace(/\/index\.html$/i, "/").replace(/\.html$/i, "");
  if (p.length > 1) p = p.replace(/\/+$/, "");
  p = p.toLowerCase() || "/";
  return ALIASES[p] || p;
}

export function findRoute(pathname) {
  const p = normalise(pathname);
  const r = ROUTES.find((x) => x.path === p);
  if (r) return r;
  const m = p.match(/^\/insights\/([a-z0-9-]+)$/);
  if (m && m[1] !== "_post") return { ...POST_ROUTE, path: p, slug: m[1] };
  if (p === "/insights/_post") return POST_ROUTE;
  if (p === "/admin" || p.startsWith("/admin/")) return { ...ADMIN_ROUTE, path: p };
  return null;
}

/* which company a path belongs to (header brand, footer) */
export const companyOf = (path) => (COMPANIES.find((c) => path === `/${c.id}` || path.startsWith(`/${c.id}/`)) || {}).id || null;
