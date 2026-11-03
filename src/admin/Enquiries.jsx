import React, { useEffect, useState } from "react";
import { Link } from "../router";
import { admin } from "../lib/api";
import Icon from "../components/Icon";
import { PageHead, Co, Status, when, Pager, Empty, COMPANY_OPTIONS, ENQ_STATUS } from "./ui";

const LIMIT = 25;

export default function Enquiries() {
  const [f, setF] = useState(() => {
    const s = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("status") : "";
    return { company: "", type: "", status: s || "", q: "", page: 1 };
  });
  const [d, setD] = useState(null);
  useEffect(() => {
    let live = true;
    const t = setTimeout(() => admin.enquiries({ ...f, limit: LIMIT }).then((r) => live && setD(r.ok ? r : { items: [], total: 0, error: r.error })), f.q ? 250 : 0);
    return () => { live = false; clearTimeout(t); };
  }, [f]);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value, page: 1 });
  const csv = `/api/admin/enquiries.php?${new URLSearchParams({ company: f.company, type: f.type, status: f.status, q: f.q, export: "csv" })}`;

  return (
    <>
      <PageHead title="Form submissions" sub="Everything sent through the contact form, the careers options and the website's other forms.">
        <a className="adm-btn" href={csv}><Icon name="download" />Export CSV</a>
      </PageHead>
      <div className="adm-filters">
        <input placeholder="Search name, email, company or message" value={f.q} onChange={set("q")} />
        <select value={f.company} onChange={set("company")}><option value="">All companies</option>{COMPANY_OPTIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
        <select value={f.type} onChange={set("type")}><option value="">All types</option><option value="client_lead">Client enquiries</option><option value="recruitment">Job applications</option></select>
        <select value={f.status} onChange={set("status")}><option value="">Any status</option>{ENQ_STATUS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
      </div>
      {!d ? <div className="adm-load"><span className="adm-spin" /></div> : d.error ? <p className="adm-err">{d.error}</p> : !d.items.length ? <Empty>No submissions match.</Empty> : (
        <div className="adm-table">
          <table>
            <thead><tr><th>Received</th><th>From</th><th>Service</th><th>Routed to</th><th>Status</th><th /></tr></thead>
            <tbody>
              {d.items.map((e) => (
                <tr key={e.id} className={e.status === "new" ? "unread" : ""}>
                  <td>{when(e.created_at)}</td>
                  <td><Link to={`/admin/enquiries/${e.id}`} className="adm-tt">{e.name}</Link><small>{e.email}{e.company_name ? ` · ${e.company_name}` : ""}</small></td>
                  <td>{e.service_label}{e.type === "recruitment" && <span className="adm-tag">Application{e.has_cv ? " + CV" : ""}</span>}</td>
                  <td><Co id={e.company} /></td>
                  <td><Status s={e.status} /></td>
                  <td className="adm-act"><Link to={`/admin/enquiries/${e.id}`}>Open</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {d && <Pager page={f.page} total={d.total || 0} limit={LIMIT} onPage={(page) => setF({ ...f, page })} />}
    </>
  );
}
