// Content for the "GAA Consulting Services" page and the five service detail pages,
// taken from the design files (GAA_Consulting_Services.dc.html and
// GAA_Consulting_-_<service>.dc.html). Em dashes from the design copy are replaced
// with commas / colons per the brand's writing rules.

export const GAA_FIRM = {
  name: "GAA Consulting",
  area: "Corporate & strategic advisory",
  verb: "GROW",
  cta: "Speak to an advisor",
  blurb:
    "Corporate law, company secretarial, transactional advisory and regulatory compliance for businesses, financial institutions, NBFCs and promoters.",
  procTitle: "Advice that holds up.",
  close1: "Plan your",
  close2: "next move.",
};

// [slug, name, short, desc, included[], idealFor]
export const GAA_SERVICES = [
  {
    slug: "corporate-law",
    name: "Corporate law",
    short: "corporate law",
    desc: "Advice on structuring, governance and the legal framework your company operates in, from incorporation onwards.",
    incl: ["Entity structuring", "Shareholder agreements", "Governance advisory", "Legal documentation"],
    ideal: "Companies setting up, restructuring or formalising governance.",
  },
  {
    slug: "company-secretarial",
    name: "Company secretarial",
    short: "secretarial services",
    desc: "Board processes, statutory records and secretarial compliance, managed end to end by experienced company secretaries.",
    incl: ["Board & general meetings", "Statutory registers", "Secretarial audit", "Event-based filings"],
    ideal: "Companies that want board and secretarial matters handled professionally.",
  },
  {
    slug: "mergers-and-acquisitions",
    name: "Mergers & acquisitions",
    short: "M&A",
    desc: "Transactional advisory from evaluation through due diligence and documentation to closing.",
    incl: ["Deal structuring", "Due diligence", "Transaction documentation", "Post-deal integration"],
    ideal: "Promoters and companies buying, selling or merging businesses.",
  },
  {
    slug: "fundraising-and-restructuring",
    name: "Fundraising & restructuring",
    short: "fundraising",
    desc: "Support for capital raises and corporate restructuring, with documentation and regulatory approvals in place.",
    incl: ["Fundraise structuring", "Investor documentation", "Schemes of arrangement", "Capital restructuring"],
    ideal: "Businesses raising capital or reorganising group structures.",
  },
  {
    slug: "regulatory-advisory",
    name: "Regulatory advisory",
    short: "regulatory advisory",
    desc: "Guidance for NBFCs and financial institutions on licensing, ongoing compliance and regulatory approvals.",
    incl: ["NBFC registration", "Regulatory filings", "Compliance reviews", "Approvals & representations"],
    ideal: "NBFCs, financial institutions and regulated entities.",
  },
];

export const GAA_STEPS = [
  ["Diagnose", "We understand the objective, constraints and regulatory context."],
  ["Structure", "We design the legal and transactional approach."],
  ["Execute", "Documentation, filings and approvals are managed end to end."],
  ["Comply", "Ongoing secretarial and regulatory support follows through."],
];

// The two sister firms, shown in "Often paired with" and the header.
// Each links to its own website (domains are set in src/group/sites.js).
export const OTHER_FIRMS = [
  {
    key: "hirings",
    site: "hf",
    home: "/hirings-first",
    name: "Hirings First",
    area: "Talent & workforce solutions",
    services: ["IT & corporate recruitment", "Leadership hiring", "Campus placements", "Workforce outsourcing"],
  },
  {
    key: "filings",
    site: "ff",
    home: "/filings-first",
    name: "Filings First",
    area: "Compliance & financial services",
    services: ["Accounting", "Bookkeeping", "Taxation", "GST", "Corporate compliance"],
  },
];

export const getService = (slug) => GAA_SERVICES.find((s) => s.slug === slug);

// Older practice links used elsewhere on the GAA site, mapped to the new service pages.
export const LEGACY_SLUGS = {
  "corporate-secretarial": "company-secretarial",
  "mergers-restructuring": "mergers-and-acquisitions",
  "due-diligence": "mergers-and-acquisitions",
  "fdi-fema": "regulatory-advisory",
  "nbfc-regulatory": "regulatory-advisory",
  "governance-defense": "corporate-law",
};
