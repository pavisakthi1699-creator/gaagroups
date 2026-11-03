import React, { useEffect, useState } from "react";
import { admin } from "../lib/api";
import Icon from "../components/Icon";
import { PageHead, when, Pager, Empty } from "./ui";

const LIMIT = 50;

export default function Subscribers() {
  const [f, setF] = useState({ q: "", page: 1 });
  const [d, setD] = useState(null);
  const load = () => admin.subscribers({ ...f, limit: LIMIT }).then((r) => setD(r.ok ? r : { items: [], total: 0, error: r.error }));
  useEffect(() => { const t = setTimeout(load, f.q ? 250 : 0); return () => clearTimeout(t); /* eslint-disable-next-line */ }, [f]);
  const del = async (id) => { if (!window.confirm("Remove this subscriber?")) return; const r = await admin.deleteSubscriber(id); if (r.ok) load(); };
  return (
    <>
      <PageHead title="Subscribers" sub="People who signed up for new articles on the Insights page.">
        <a className="adm-btn" href={`/api/admin/subscribers.php?export=csv&q=${encodeURIComponent(f.q)}`}><Icon name="download" />Export CSV</a>
      </PageHead>
      <div className="adm-filters"><input placeholder="Search email" value={f.q} onChange={(e) => setF({ q: e.target.value, page: 1 })} /></div>
      {!d ? <div className="adm-load"><span className="adm-spin" /></div> : d.error ? <p className="adm-err">{d.error}</p> : !d.items.length ? <Empty>No subscribers yet.</Empty> : (
        <div className="adm-table">
          <table>
            <thead><tr><th>Email</th><th>Signed up</th><th>From page</th><th /></tr></thead>
            <tbody>{d.items.map((s) => (
              <tr key={s.id}><td className="adm-tt">{s.email}</td><td>{when(s.created_at)}</td><td><small>{s.source || "-"}</small></td><td className="adm-act"><button type="button" onClick={() => del(s.id)}>Remove</button></td></tr>
            ))}</tbody>
          </table>
        </div>
      )}
      {d && <Pager page={f.page} total={d.total || 0} limit={LIMIT} onPage={(page) => setF({ ...f, page })} />}
    </>
  );
}
