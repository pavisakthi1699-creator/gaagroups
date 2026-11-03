import React from "react";
import { Link } from "../router";
import { COMPANY_LABEL } from "../lib/api";

/* Small building blocks shared by the admin screens */
export const COMPANY_OPTIONS = [["gaa-group", "GAA Group"], ["gaa-consulting", "GAA Consulting"], ["filings-first", "Filings First"], ["hirings-first", "Hirings First"]];
export const ENQ_STATUS = [["new", "New"], ["in_progress", "In progress"], ["closed", "Closed"], ["spam", "Spam"]];

export function PageHead({ title, sub, children }) {
  return (
    <div className="adm-ph">
      <div><h1>{title}</h1>{sub && <p>{sub}</p>}</div>
      {children && <div className="adm-ph-r">{children}</div>}
    </div>
  );
}

export const Co = ({ id }) => <span className={`adm-co c-${id}`}>{COMPANY_LABEL[id] || id || "GAA Group"}</span>;
export const Status = ({ s }) => <span className={`adm-st s-${s}`}>{({ published: "Published", draft: "Draft", new: "New", in_progress: "In progress", closed: "Closed", spam: "Spam" })[s] || s}</span>;

export const when = (s) => {
  if (!s) return "";
  const d = new Date(String(s).replace(" ", "T"));
  return isNaN(d) ? s : d.toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

export function Pager({ page, total, limit, onPage }) {
  const pages = Math.max(1, Math.ceil(total / limit));
  if (pages <= 1) return null;
  return (
    <div className="adm-pager">
      <button type="button" disabled={page <= 1} onClick={() => onPage(page - 1)}>&larr; Previous</button>
      <span>Page {page} of {pages}</span>
      <button type="button" disabled={page >= pages} onClick={() => onPage(page + 1)}>Next &rarr;</button>
    </div>
  );
}

export function Empty({ children, to, action }) {
  return <div className="adm-empty"><p>{children}</p>{to && <Link className="adm-btn pri" to={to}>{action}</Link>}</div>;
}

export function Notice({ msg, kind = "ok" }) {
  if (!msg) return null;
  return <div className={`adm-note ${kind}`} role="status">{msg}</div>;
}
