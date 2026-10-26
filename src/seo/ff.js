// SEO data for every page on filingsfirst.com (plain JS: also read by scripts/seo-pages.mjs).
export const SITE = "https://filingsfirst.com";
export const BRAND = "Filings First";
export const ORG = { type: "AccountingService", extra: { telephone: "+91 90084 76666", address: { "@type": "PostalAddress", streetAddress: "Bannerghatta Road", addressLocality: "Bengaluru", postalCode: "560076", addressCountry: "IN" } } };
const GROUP_CANONICAL = "https://www.gaaconsulting.com";

const svc = (slug, name, desc) => ({ path: `/filings-first/services/${slug}`, title: `${name} Services in Bengaluru | Filings First`, description: desc });

export const ROUTES = [
  { path: "/", title: "Filings First | Accounting, Taxation & Compliance | GAA Group", description: "Filings First, part of GAA Group: accounting, bookkeeping, taxation, GST and corporate compliance for businesses in India. Explore Filings First, GAA Consulting and Hirings First." },
  { path: "/about", title: "About GAA Group | GAA Consulting, Filings First, Hirings First", description: "GAA Group brings together GAA Consulting, Filings First and Hirings First: corporate advisory, financial compliance and talent solutions.", canonical: GROUP_CANONICAL + "/about" },
  { path: "/contact", title: "Contact Filings First | GAA Group", description: "Talk to Filings First about accounting, bookkeeping, taxation, GST or corporate compliance." },
  { path: "/filings-first", title: "Filings First | Accounting, Bookkeeping, GST & Tax Compliance", description: "Accounting, bookkeeping, taxation, GST and corporate compliance on a shared calendar, so your obligations never become emergencies." },
  { path: "/filings-first/compliance-calendar", title: "Compliance Calendar: GST, Income Tax, TDS & ROC Due Dates | Filings First", description: "Key GST, income tax, TDS and ROC due dates for Indian businesses with a 31 March year end." },
  svc("accounting", "Accounting", "Accurate accounts, monthly MIS and audit support from Filings First."),
  svc("bookkeeping", "Bookkeeping", "Day-to-day bookkeeping, bank reconciliations and a dependable monthly close."),
  svc("taxation", "Income Tax", "Income tax planning, return filing, advance tax, TDS and assessment support."),
  svc("gst", "GST", "GST registration, monthly and quarterly returns, ITC reconciliation and notices."),
  svc("corporate-compliance", "Corporate Compliance", "ROC and annual filings, statutory registers and due-date tracking on a shared compliance calendar."),
  svc("registrations", "Business Registration", "Company and LLP incorporation, GST, trademark, MSME (Udyam) and IEC registration."),
];

