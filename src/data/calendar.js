/* Usual statutory due dates in India, used by the Home page and the Insights planner.
   These are the standard dates; the government can change or extend them, so the pages always say so. */

export const CATS = {
  gst: "GST",
  tds: "TDS",
  tax: "Income tax",
  pay: "Payroll",
  roc: "ROC & LLP",
};

/* month: 1-12 (null = every month), day, category, title, text */
const RULES = [
  { m: null, d: 7, c: "tds", t: "TDS and TCS deposit", x: "Tax deducted or collected in the previous month.", skip: [4] },
  { m: 4, d: 30, c: "tds", t: "TDS deposit for March", x: "March deductions have a longer deadline." },
  { m: null, d: 11, c: "gst", t: "GSTR-1", x: "Outward supplies of the previous month, for monthly filers." },
  { m: null, d: 15, c: "pay", t: "PF and ESI", x: "Contributions for the previous month's salaries." },
  { m: null, d: 20, c: "gst", t: "GSTR-3B", x: "Summary return and GST payment, for monthly filers." },
  { m: 6, d: 15, c: "tax", t: "Advance tax, first instalment", x: "About 15% of the estimated tax for the year." },
  { m: 9, d: 15, c: "tax", t: "Advance tax, second instalment", x: "Cumulatively about 45% of the estimated tax." },
  { m: 12, d: 15, c: "tax", t: "Advance tax, third instalment", x: "Cumulatively about 75% of the estimated tax." },
  { m: 3, d: 15, c: "tax", t: "Advance tax, final instalment", x: "The full estimated tax for the year." },
  { m: 5, d: 31, c: "tds", t: "TDS return, January to March", x: "Quarterly statement of tax deducted." },
  { m: 7, d: 31, c: "tds", t: "TDS return, April to June", x: "Quarterly statement of tax deducted." },
  { m: 10, d: 31, c: "tds", t: "TDS return, July to September", x: "Quarterly statement of tax deducted." },
  { m: 1, d: 31, c: "tds", t: "TDS return, October to December", x: "Quarterly statement of tax deducted." },
  { m: 6, d: 15, c: "tds", t: "Salary TDS certificates", x: "Annual certificates issued to employees." },
  { m: 7, d: 31, c: "tax", t: "Income tax returns (non-audit)", x: "Usual date where no audit is required." },
  { m: 9, d: 30, c: "tax", t: "Tax audit report", x: "For businesses that need a tax audit." },
  { m: 10, d: 31, c: "tax", t: "Income tax returns (audit cases)", x: "Companies and audited businesses." },
  { m: 12, d: 31, c: "gst", t: "GST annual return", x: "Annual return and reconciliation, where required." },
  { m: 9, d: 30, c: "roc", t: "Annual general meeting", x: "Usual last date for companies with a 31 March year end." },
  { m: 5, d: 30, c: "roc", t: "LLP annual return", x: "Annual return of the LLP for the last year." },
  { m: 10, d: 30, c: "roc", t: "LLP accounts and solvency", x: "Statement of accounts and solvency of the LLP." },
];

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const monthName = (m) => MONTHS[m - 1];
export const monthShort = (m) => SHORT[m - 1];

/* all due dates in a month (1-12) of a year, sorted by day */
export function dueIn(year, month) {
  return RULES.filter((r) => (r.m === null ? !(r.skip || []).includes(month) : r.m === month))
    .map((r) => ({ date: new Date(year, month - 1, r.d), day: r.d, month, year, cat: r.c, catName: CATS[r.c], title: r.t, text: r.x }))
    .sort((a, b) => a.day - b.day);
}

/* the next n due dates from a given day (defaults to today) */
export function upcoming(n = 4, from = new Date()) {
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const out = [];
  for (let k = 0; k < 14 && out.length < n; k++) {
    const y = start.getFullYear() + Math.floor((start.getMonth() + k) / 12);
    const m = ((start.getMonth() + k) % 12) + 1;
    dueIn(y, m).forEach((e) => { if (e.date >= start && out.length < n) out.push(e); });
  }
  return out;
}

export const daysUntil = (d, from = new Date()) =>
  Math.round((d - new Date(from.getFullYear(), from.getMonth(), from.getDate())) / 86400000);
