import React, { useEffect, useState } from "react";
import { Link, useRouter } from "../router";
import { admin } from "../lib/api";
import Icon from "../components/Icon";
import { PageHead, Co, Status, when, Notice, ENQ_STATUS } from "./ui";

export default function EnquiryView({ id }) {
  const { navigate } = useRouter();
  const [e, setE] = useState(null);
  const [err, setErr] = useState("");
  const [notes, setNotes] = useState("");
  const [msg, setMsg] = useState("");
  useEffect(() => {
    admin.enquiry(id).then((r) => {
      if (!r.ok) return setErr(r.error);
      setE(r.item); setNotes(r.item.notes || "");
      if (r.item.status === "new") admin.updateEnquiry(id, { status: "in_progress" }).then((x) => x.ok && setE((v) => ({ ...v, status: "in_progress" })));
    });
  }, [id]);
  if (err) return <p className="adm-err">{err}</p>;
  if (!e) return <div className="adm-load"><span className="adm-spin" /></div>;

  const status = async (s) => { const r = await admin.updateEnquiry(id, { status: s }); if (r.ok) { setE({ ...e, status: s }); setMsg("Status updated."); } else setErr(r.error); };
  const saveNotes = async () => { const r = await admin.updateEnquiry(id, { notes }); setMsg(r.ok ? "Notes saved." : ""); if (!r.ok) setErr(r.error); };
  const del = async () => { if (!window.confirm("Delete this submission and any CV attached to it?")) return; const r = await admin.deleteEnquiry(id); if (r.ok) navigate("/admin/enquiries"); else setErr(r.error); };
  const rows = [["Name", e.name], ["Email", <a href={`mailto:${e.email}`}>{e.email}</a>], ["Phone", e.phone ? <a href={`tel:${e.phone}`}>{e.phone}</a> : "-"], ["Company", e.company_name || "-"], ["Service", e.service_label], ["Routed to", <Co id={e.company} />], ["Type", e.type === "recruitment" ? "Job application" : e.type === "subscription" ? "Newsletter" : "Client enquiry"], ["Received", when(e.created_at)], ["Page", e.page_url ? <a href={e.page_url} target="_blank" rel="noopener">{e.page_url}</a> : "-"], ["Email sent", e.mailed ? "Yes" : "No (check mail settings)"]];

  return (
    <>
      <PageHead title={e.name} sub={<>{e.service_label} · <Status s={e.status} /></>}>
        <Link className="adm-btn" to="/admin/enquiries">&larr; All submissions</Link>
        <a className="adm-btn pri" href={`mailto:${e.email}?subject=${encodeURIComponent("Re: " + e.service_label)}`}><Icon name="mail" />Reply by email</a>
      </PageHead>
      <Notice msg={msg} />
      <div className="adm-edit">
        <div className="adm-edit-main">
          <section className="adm-card">
            <h3>Message</h3>
            <p className="adm-msg">{e.message}</p>
            {e.has_cv ? <a className="adm-btn" href={`/api/admin/cv.php?id=${e.id}`}><Icon name="download" />Download CV ({e.cv_name})</a> : null}
          </section>
          <section className="adm-card">
            <h3>Internal notes</h3>
            <textarea className="adm-notes" rows={5} value={notes} onChange={(x) => setNotes(x.target.value)} placeholder="Notes for your team. Not visible to the person who wrote in." />
            <button type="button" className="adm-btn" onClick={saveNotes}>Save notes</button>
          </section>
        </div>
        <aside className="adm-edit-side">
          <section className="adm-card">
            <h3>Details</h3>
            <dl className="adm-dl">{rows.map(([k, v]) => <React.Fragment key={k}><dt>{k}</dt><dd>{v}</dd></React.Fragment>)}</dl>
          </section>
          <section className="adm-card">
            <h3>Status</h3>
            <div className="adm-chips">{ENQ_STATUS.map(([v, l]) => <button key={v} type="button" className={e.status === v ? "on" : ""} onClick={() => status(v)}>{l}</button>)}</div>
          </section>
          <button type="button" className="adm-link bad" onClick={del}>Delete this submission</button>
        </aside>
      </div>
    </>
  );
}
