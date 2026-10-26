// Filings First content. Services follow the client's existing offering
// (Companies Act, accounting, audits, income tax, GST) and the approved services design.

export const FF = {
  name: "Filings First",
  tagline: "Your filings, first.",
  blurb:
    "Accounting, bookkeeping, taxation, GST and corporate compliance, handled on a shared calendar so your obligations never become emergencies.",
  since: "2013", // TODO(client): confirm year of establishment
  address: "Bannerghatta Road, Bengaluru 560076", // TODO(client): confirm full address
};

export const SERVICES = [
  {
    slug: "accounting",
    name: "Accounting",
    icon: "ledger",
    short: "Accurate accounts and financial statements.",
    desc: "Accurate accounts and financial statements that give owners, lenders and auditors a clear view of the business.",
    incl: ["Financial statements", "Monthly MIS reporting", "Audit support", "Ledger reviews"],
    ideal: "Growing companies that need reliable numbers for decisions and audits.",
    cadence: "Monthly close, quarterly review, annual accounts",
    faqs: [
      ["Which accounting software do you work with?", "We work in Tally, Zoho Books and QuickBooks, and can migrate your books if needed."],
      ["Can you work with our statutory auditor?", "Yes. We prepare audit-ready schedules and coordinate directly with your auditor."],
    ],
  },
  {
    slug: "bookkeeping",
    name: "Bookkeeping",
    icon: "book",
    short: "Day-to-day records and a dependable monthly close.",
    desc: "Day-to-day recording and reconciliation with a dependable monthly close, so your books are always current.",
    incl: ["Transaction recording", "Bank reconciliations", "Payables & receivables", "Monthly close"],
    ideal: "Founders and SMEs without an in-house accounts team.",
    cadence: "Weekly entries, monthly close",
    faqs: [
      ["How do we share documents?", "Through a shared folder or your accounting software. We send a simple checklist each month."],
      ["How soon are books updated?", "Entries are posted weekly and the books are closed by the 10th of the following month."],
    ],
  },
  {
    slug: "taxation",
    name: "Taxation",
    icon: "tax",
    short: "Income tax planning, filings and TDS.",
    desc: "Income tax planning, computation and filings, handled on time with full documentation.",
    incl: ["Tax planning", "Return filing", "Advance tax & TDS", "Assessment support"],
    ideal: "Companies and promoters who want tax handled proactively.",
    cadence: "Quarterly advance tax and TDS, annual returns",
    faqs: [
      ["Do you handle tax notices?", "Yes. We review the notice, prepare the response and represent you in assessment proceedings."],
      ["Can you file returns for promoters too?", "Yes. Many clients have us handle both the company and its promoters' personal returns."],
    ],
  },
  {
    slug: "gst",
    name: "GST",
    icon: "gst",
    short: "Registration, returns and reconciliations.",
    desc: "Registration, periodic returns and reconciliations that keep your GST position clean and defensible.",
    incl: ["GST registration", "Periodic returns", "Input tax credit reconciliation", "Notices & departmental queries"],
    ideal: "Businesses with multi-state operations or high transaction volumes.",
    cadence: "Monthly or quarterly returns, annual return",
    faqs: [
      ["Monthly or quarterly returns?", "It depends on turnover and the QRMP scheme. We advise the best option at onboarding."],
      ["Do you reconcile input tax credit?", "Yes. We match your purchase register with GSTR-2B every month before filing."],
    ],
  },
  {
    slug: "corporate-compliance",
    name: "Corporate compliance",
    icon: "shield",
    short: "ROC filings on a shared compliance calendar.",
    desc: "Statutory and regulatory filings tracked on a shared compliance calendar so nothing slips.",
    incl: ["ROC & annual filings", "Compliance calendar", "Statutory registers", "Due-date tracking & alerts"],
    ideal: "Private and public companies managing recurring statutory obligations.",
    cadence: "Event-based and annual filings",
    faqs: [
      ["Which filings are included?", "Annual filings such as AOC-4 and MGT-7, director KYC, DPT-3, MSME-1 and event-based forms."],
      ["Do you send reminders?", "Yes. You get alerts ahead of every due date and a monthly status update."],
    ],
  },
  {
    slug: "registrations",
    name: "Business registrations",
    icon: "spark",
    short: "Company, LLP, GST, trademark and MSME registration.",
    desc: "Start right with the registrations your business needs, filed correctly the first time.",
    incl: ["Company & LLP incorporation", "GST & professional tax", "Trademark filing", "MSME (Udyam) & IEC"],
    ideal: "Founders starting a new business or adding a new line of activity.",
    cadence: "One-time, with follow-through on approvals",
    faqs: [
      ["How long does incorporation take?", "Usually two to three weeks, depending on name approval and document readiness."],
      ["Do you continue after registration?", "Yes. Most clients move straight onto our bookkeeping and compliance plans."],
    ],
  },
];

export const getService = (slug) => SERVICES.find((s) => s.slug === slug);

export const STEPS = [
  ["Onboard", "We review your books, registrations and pending filings."],
  ["Set up", "A compliance calendar and monthly routine are agreed."],
  ["File", "Returns and filings are prepared and submitted on time."],
  ["Review", "Regular reviews keep your position clean and audit-ready."],
];

// Recurring due dates for a business with a 31 March year end.
// type: gst | it | tds | roc. General guide only, verify against current notifications.
export const CALENDAR = [
  { m: 3, d: "30 Apr", t: "roc", f: "MSME-1", w: "Half-yearly return of dues to MSME suppliers" },
  { m: 4, d: "31 May", t: "tds", f: "TDS return", w: "Quarterly TDS return for January to March" },
  { m: 5, d: "15 Jun", t: "it", f: "Advance tax", w: "First instalment of advance tax" },
  { m: 5, d: "30 Jun", t: "roc", f: "DPT-3", w: "Return of deposits" },
  { m: 6, d: "31 Jul", t: "it", f: "ITR", w: "Income tax return for non-audit cases" },
  { m: 6, d: "31 Jul", t: "tds", f: "TDS return", w: "Quarterly TDS return for April to June" },
  { m: 8, d: "15 Sep", t: "it", f: "Advance tax", w: "Second instalment of advance tax" },
  { m: 8, d: "30 Sep", t: "it", f: "Tax audit", w: "Tax audit report" },
  { m: 8, d: "30 Sep", t: "roc", f: "AGM", w: "Annual general meeting" },
  { m: 9, d: "31 Oct", t: "it", f: "ITR", w: "Income tax return for audit cases" },
  { m: 9, d: "AGM + 30 days", t: "roc", f: "AOC-4", w: "Financial statements to ROC" },
  { m: 10, d: "AGM + 60 days", t: "roc", f: "MGT-7", w: "Annual return to ROC" },
  { m: 11, d: "15 Dec", t: "it", f: "Advance tax", w: "Third instalment of advance tax" },
  { m: 11, d: "31 Dec", t: "gst", f: "GSTR-9", w: "GST annual return" },
  { m: 2, d: "15 Mar", t: "it", f: "Advance tax", w: "Final instalment of advance tax" },
];

export const MONTHLY = [
  { d: "7th", t: "tds", f: "TDS payment", w: "Deposit tax deducted in the previous month" },
  { d: "11th", t: "gst", f: "GSTR-1", w: "Outward supplies (monthly filers)" },
  { d: "20th", t: "gst", f: "GSTR-3B", w: "Summary return and tax payment (monthly filers)" },
];

export const TYPES = {
  gst: { label: "GST", color: "#FF5B14" },
  it: { label: "Income tax", color: "#0A0A0A" },
  tds: { label: "TDS", color: "#8A8A8A" },
  roc: { label: "ROC / MCA", color: "#FFB08A" },
};

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
