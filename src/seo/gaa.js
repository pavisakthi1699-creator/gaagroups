// SEO data for every page on gaaconsulting.com. Plain JavaScript (no imports) so the
// build script (scripts/seo-pages.mjs) can read it to write static HTML, sitemap.xml and robots.txt.
export const SITE = "https://www.gaaconsulting.com"; // TODO(client): confirm production domain
export const BRAND = "GAA Consulting";
// Shared group pages: the group's primary domain is the canonical home for /about.
export const GROUP_CANONICAL = "https://www.gaaconsulting.com";

const S = (slug, name, desc) => ({
  path: `/gaa-consulting/practices/${slug}`,
  title: `${name} | GAA Consulting`,
  description: desc,
});

export const ROUTES = [
  {
    path: "/",
    title: "GAA Consulting | Corporate Advisory | GAA Group",
    description:
      "GAA Consulting, part of GAA Group: corporate law, company secretarial, M&A, fundraising and regulatory advisory for businesses in India. Explore GAA Consulting, Filings First and Hirings First.",
  },
  {
    path: "/about",
    title: "About GAA Group | GAA Consulting, Filings First, Hirings First",
    description:
      "GAA Group brings together GAA Consulting, Filings First and Hirings First: corporate advisory, financial compliance and talent solutions under one accountable partner.",
    canonical: GROUP_CANONICAL + "/about",
  },
  {
    path: "/contact",
    title: "Contact GAA Group | Book a Consultation",
    description: "Talk to GAA Consulting, Filings First or Hirings First. Share your requirement and the right specialist will reply within one working day.",
  },
  {
    path: "/gaa-consulting",
    title: "GAA Consulting | Corporate Law, Company Secretarial & M&A Advisory",
    description:
      "Partner-led corporate law, company secretarial, M&A, fundraising and regulatory advisory for founders, boards, NBFCs and foreign companies in India.",
  },
  {
    path: "/gaa-consulting/practices",
    title: "Services | GAA Consulting",
    description: "Corporate law, company secretarial, mergers & acquisitions, fundraising & restructuring and regulatory advisory from GAA Consulting.",
  },
  S("corporate-law", "Corporate Law", "Advice on entity structuring, shareholder agreements, governance and legal documentation from GAA Consulting."),
  S("company-secretarial", "Company Secretarial Services", "Board and general meetings, statutory registers, secretarial audit and event-based filings handled by experienced company secretaries."),
  S("mergers-and-acquisitions", "Mergers & Acquisitions", "M&A advisory from deal structuring and due diligence to transaction documentation and post-deal integration."),
  S("fundraising-and-restructuring", "Fundraising & Restructuring", "Fundraise structuring, investor documentation, schemes of arrangement and capital restructuring."),
  S("regulatory-advisory", "Regulatory Advisory for NBFCs", "NBFC registration, regulatory filings, compliance reviews and approvals for NBFCs and financial institutions."),
  { path: "/gaa-consulting/india-entry", title: "Set Up Your Business in India | GAA Consulting", description: "India entry for foreign companies: subsidiary, JV, LLP or branch office, incorporated and FEMA compliant." },
  { path: "/gaa-consulting/industries", title: "Industries We Serve | GAA Consulting", description: "Corporate and regulatory advisory for technology, fintech, NBFC, manufacturing, healthcare, real estate and more." },
  { path: "/gaa-consulting/people", title: "Our Team | GAA Consulting", description: "Meet the company secretaries, corporate lawyers and finance professionals at GAA Consulting." },
  { path: "/gaa-consulting/careers", title: "Careers & CS Training | GAA Consulting", description: "Practical company secretarial and compliance training on live files, with mentorship from practising professionals at GAA Consulting." },
  { path: "/gaa-consulting/how-we-work", title: "How We Work & Fees | GAA Consulting", description: "Fixed-fee mandates, annual retainers and partner advisory: clear scope, fixed fees and no surprises." },
  { path: "/gaa-consulting/disclaimer", title: "Disclaimer | GAA Consulting", description: "Legal disclaimer and privacy notice for the GAA Consulting website." },
];

export const ORG = { type: "LegalService", extra: { address: { "@type": "PostalAddress", addressLocality: "Bengaluru", addressRegion: "Karnataka", addressCountry: "IN" } } };
