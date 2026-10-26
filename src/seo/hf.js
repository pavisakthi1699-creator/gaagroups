// SEO data for every page on hiringsfirst.com (plain JS: also read by scripts/seo-pages.mjs).
export const SITE = "https://www.hiringsfirst.com";
export const BRAND = "Hirings First";
export const ORG = { type: "EmploymentAgency", extra: { address: { "@type": "PostalAddress", addressLocality: "Bengaluru", addressRegion: "Karnataka", addressCountry: "IN" } } };
const GROUP_CANONICAL = "https://www.gaaconsulting.com";

const cat = (slug, name, desc) => ({ path: `/hirings-first/talent/${slug}`, title: `Hire Pre-screened ${name} Talent | Hirings First`, description: desc });

export const ROUTES = [
  { path: "/", title: "Hirings First | Pre-screened Talent, Ready to Perform | GAA Group", description: "Hirings First, part of GAA Group: pre-screened professionals across Finance, HR, Sales, Marketing, Operations and Technology. Explore Hirings First, GAA Consulting and Filings First." },
  { path: "/about", title: "About GAA Group | GAA Consulting, Filings First, Hirings First", description: "GAA Group brings together GAA Consulting, Filings First and Hirings First: corporate advisory, financial compliance and talent solutions.", canonical: GROUP_CANONICAL + "/about" },
  { path: "/contact", title: "Contact Hirings First | GAA Group", description: "Talk to Hirings First about hiring pre-screened talent for your team." },
  { path: "/hirings-first", title: "Hirings First | Great Talent. Ready to Perform.", description: "We don't send resumes. We send people ready to contribute. Pre-screened, deployable talent with most mandates receiving profiles within 72 hours." },
  { path: "/hirings-first/talent", title: "Explore Candidates | Available Talent | Hirings First", description: "Browse pre-screened talent across Finance, HR, Sales, Marketing, Operations and Technology, and request matching profiles." },
  { path: "/hirings-first/hire", title: "Hire Talent | Request Profiles | Hirings First", description: "Tell us who you need. Most mandates receive pre-screened profiles within 72 hours. Candidates can also join our talent pool." },
  cat("finance-accounting", "Finance & Accounting", "Accountants, finance executives and analysts assessed on Tally, Zoho Books, GST and reconciliation."),
  cat("human-resources", "Human Resources", "HR executives, recruiters and payroll specialists assessed on real HR workflows."),
  cat("sales-business-development", "Sales & Business Development", "Sales and business development professionals assessed through mock pitches and CRM checks."),
  cat("marketing", "Marketing", "Digital, performance and content marketers assessed on portfolios and channel skills."),
  cat("operations", "Operations", "Operations, MIS and admin professionals assessed on Excel, process and vendor scenarios."),
  cat("technology", "Technology", "Developers, QA engineers and IT professionals assessed on hands-on technical tasks."),
];

