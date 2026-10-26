// Hirings First content, from the client's "References for HF Website" brief.

export const HF = {
  name: "Hirings First",
  headline: ["Great Talent.", "Ready to Perform."],
  sub: "Pre-screened professionals across Finance, HR, Sales, Marketing, Operations, and Technology.",
  diff: ["We don't send resumes.", "We send people ready to contribute."],
  sla: "Most mandates receive profiles within 72 hours.",
  banner: ["Hiring shouldn't be complicated.", "Find the right person. Faster."],
};

export const PILLARS = [
  { key: "screened", title: "Screened", text: "Technical and communication assessments completed." },
  { key: "deployable", title: "Deployable", text: "Ready to join and perform from day one." },
  { key: "fast", title: "Fast", text: "Shortlists delivered within days, not weeks." },
];

export const CATEGORIES = [
  {
    slug: "finance-accounting",
    name: "Finance & Accounting",
    line: "Accountants, finance executives and analysts who close books on time.",
    tone: "light",
    roles: ["Accounts Executive", "Finance Executive", "Accounts Payable / Receivable", "GST & Tax Associate", "Financial Analyst", "Finance Manager"],
    assess: ["Tally / Zoho Books / ERP test", "GST and TDS knowledge check", "Reconciliation exercise", "Communication round"],
  },
  {
    slug: "human-resources",
    name: "Human Resources",
    line: "HR generalists, recruiters and payroll specialists who keep people moving.",
    tone: "dark",
    roles: ["HR Executive", "Talent Acquisition Specialist", "Payroll Executive", "HR Business Partner", "HR Operations", "HR Manager"],
    assess: ["Recruitment workflow case", "Payroll and statutory compliance check", "HRMS familiarity", "Communication round"],
  },
  {
    slug: "sales-business-development",
    name: "Sales & Business Development",
    line: "Closers and relationship builders for B2B and B2C growth.",
    tone: "light",
    roles: ["Sales Executive", "Inside Sales", "Business Development Executive", "Key Account Manager", "Channel Sales", "Sales Manager"],
    assess: ["Mock sales pitch", "CRM familiarity", "Target and pipeline discussion", "Communication round"],
  },
  {
    slug: "marketing",
    name: "Marketing",
    line: "Digital, performance and brand marketers who bring in demand.",
    tone: "accent",
    roles: ["Digital Marketing Executive", "Performance Marketer", "SEO Specialist", "Content Writer", "Social Media Executive", "Marketing Manager"],
    assess: ["Portfolio review", "Channel and analytics test", "Campaign brief exercise", "Communication round"],
  },
  {
    slug: "operations",
    name: "Operations",
    line: "Operators who run processes, vendors and reporting without friction.",
    tone: "light",
    roles: ["Operations Executive", "MIS Executive", "Admin & Facilities", "Supply Chain Executive", "Customer Support Lead", "Operations Manager"],
    assess: ["Excel and MIS test", "Process scenario", "Vendor coordination case", "Communication round"],
  },
  {
    slug: "technology",
    name: "Technology",
    line: "Engineers and IT professionals assessed on real technical tasks.",
    tone: "dark",
    roles: ["Frontend Developer", "Backend Developer", "Full Stack Developer", "QA Engineer", "IT Support", "Data Analyst"],
    assess: ["Hands-on coding or technical task", "System and tools review", "Problem-solving round", "Communication round"],
  },
];
export const getCategory = (slug) => CATEGORIES.find((c) => c.slug === slug);

// "Available Talent": anonymised example profiles (no names), per the brief.
// TODO(client): replace with your live talent pool when ready.
export const TALENT = [
  { role: "Finance Executive", cat: "finance-accounting", skills: ["Zoho Books", "GST", "Tally"], exp: "2-4 yrs", city: "Bengaluru" },
  { role: "HR Executive", cat: "human-resources", skills: ["Recruitment", "Payroll", "Compliance"], exp: "2-3 yrs", city: "Bengaluru" },
  { role: "Sales Executive", cat: "sales-business-development", skills: ["B2B Sales", "CRM", "Lead Generation"], exp: "1-3 yrs", city: "Bengaluru" },
  { role: "Digital Marketing Executive", cat: "marketing", skills: ["SEO", "Meta Ads", "Analytics"], exp: "2-4 yrs", city: "Remote" },
  { role: "Operations Executive", cat: "operations", skills: ["MIS", "Excel", "Vendor Management"], exp: "1-3 yrs", city: "Bengaluru" },
  { role: "Full Stack Developer", cat: "technology", skills: ["React", "Node.js", "SQL"], exp: "3-5 yrs", city: "Bengaluru" },
  { role: "Accounts Payable Executive", cat: "finance-accounting", skills: ["Tally", "Reconciliation", "TDS"], exp: "1-2 yrs", city: "Bengaluru" },
  { role: "Talent Acquisition Specialist", cat: "human-resources", skills: ["Sourcing", "Naukri", "LinkedIn"], exp: "2-4 yrs", city: "Bengaluru" },
  { role: "Inside Sales Executive", cat: "sales-business-development", skills: ["Cold Calling", "CRM", "Demos"], exp: "0-2 yrs", city: "Bengaluru" },
  { role: "Content Writer", cat: "marketing", skills: ["SEO Writing", "Research", "WordPress"], exp: "1-3 yrs", city: "Remote" },
  { role: "MIS Executive", cat: "operations", skills: ["Advanced Excel", "Power BI", "Reporting"], exp: "2-4 yrs", city: "Bengaluru" },
  { role: "QA Engineer", cat: "technology", skills: ["Manual Testing", "Selenium", "API Testing"], exp: "2-4 yrs", city: "Bengaluru" },
];

export const PROCESS = [
  ["Tell Us What You Need", "Share the role, team and timeline in a short brief."],
  ["We Screen & Match", "Technical and communication assessments narrow the field."],
  ["Interview & Select", "You meet a focused shortlist and choose."],
  ["Hire", "We support the offer, joining and first weeks."],
];

// TODO(client): add client logo files (public/clients/*.png) and names to show "Companies hiring through HF".
export const CLIENT_LOGOS = [];
