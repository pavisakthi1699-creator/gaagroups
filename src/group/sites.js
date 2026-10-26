// ─────────────────────────────────────────────────────────────────────────────
// GAA GROUP: shared configuration used by all three websites.
// Edit domains, contact details and the two-word descriptors HERE only, 
// ─────────────────────────────────────────────────────────────────────────────
import { CURRENT, LOCAL } from "../brand.js";
import gaaLogo from "./assets/gaa-consulting.png";
import ffLogo from "./assets/filings-first.png";
import hfLogo from "./assets/hirings-first.png";

export const GROUP = {
  name: "GAA Group",
  legalName: "G Akshay and Associates",
  tagline: "Business, first.",
  intro:
    "Corporate advisory, accounting and compliance, and talent solutions for businesses establishing, operating and growing in India.",
  // Optional form endpoint (Formspree, Web3Forms, your own API). Leave empty to use email.
  formEndpoint: "",
  // TODO(client): confirm registered office address
  office: "Bengaluru, Karnataka, India",
};

// Each company: its own domain, colour, two-word descriptor and contact details.
// TODO(client): confirm production domains for GAA Consulting and Hirings First.
export const COMPANIES = {
  gaa: {
    key: "gaa",
    name: "GAA Consulting",
    full: "G Akshay and Associates",
    short: "GAA",
    two: "Corporate Advisory", // two-word descriptor (see proposal for alternatives)
    line: "Corporate law, company secretarial, transactions and regulatory advisory.",
    color: "#B5482A",
    domain: "https://www.gaaconsulting.com",
    home: "/gaa-consulting",
    logo: gaaLogo,
    email: "enquiries@gaaconsulting.com",
    phone: "",
  },
  ff: {
    key: "ff",
    name: "Filings First",
    full: "Filings First",
    short: "FF",
    two: "Financial Compliance",
    line: "Accounting, bookkeeping, taxation, GST and corporate compliance.",
    color: "#1F4A8A",
    domain: "https://filingsfirst.com",
    home: "/filings-first",
    logo: ffLogo,
    email: "info@filingsfirst.com",
    phone: "+91 90084 76666",
  },
  hf: {
    key: "hf",
    name: "Hirings First",
    full: "Hirings First",
    short: "HF",
    two: "Talent Solutions",
    line: "Recruitment, leadership hiring, campus placements and workforce solutions.",
    color: "#FB3D00",
    domain: "https://www.hiringsfirst.com",
    home: "/hirings-first",
    logo: hfLogo,
    email: "hello@hiringsfirst.com",
    phone: "",
  },
};

export const ORDER = ["gaa", "ff", "hf"];
export const HERE = COMPANIES[CURRENT];

/** URL for a page on any of the three sites.
    Same site, or running locally (all three sites run together) → internal path; otherwise the other domain. */
export function siteHref(key, path = "/") {
  if (key === CURRENT || LOCAL) return path;
  return COMPANIES[key].domain + path;
}

export const isInternal = (href) => href.startsWith("/") && !href.startsWith("//");
