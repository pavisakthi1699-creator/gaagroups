import React, { useEffect, useState } from "react";
import { Link } from "../router";
import { admin } from "../lib/api";
import Icon from "../components/Icon";
import { PageHead, Co, Status, when, Pager, Empty, COMPANY_OPTIONS } from "./ui";

const LIMIT = 20;

export default function Posts() {
  const [f, setF] = useState({ company: "", status: "", q: "", page: 1 });
  const [d, setD] = useState(null);
  useEffect(() => {
    let live = true;
    const t = setTimeout(() => admin.posts({ ...f, limit: LIMIT }).then((r) => live && setD(r.ok ? r : { posts: [], total: 0, error: r.error })), f.q ? 250 : 0);
    return () => { live = false; clearTimeout(t); };
  }, [f]);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value, page: 1 });

  return (
    <>
      <PageHead title="Blog posts" sub="Articles shown on the Insights page. Each post belongs to one company.">
        <Link className="adm-btn pri" to="/admin/posts/new"><Icon name="plus" />New post</Link>
      </PageHead>
      <div className="adm-filters">
        <input placeholder="Search titles" value={f.q} onChange={set("q")} />
        <select value={f.company} onChange={set("company")}><option value="">All companies</option>{COMPANY_OPTIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
        <select value={f.status} onChange={set("status")}><option value="">Any status</option><option value="published">Published</option><option value="draft">Draft</option></select>
      </div>
      {!d ? <div className="adm-load"><span className="adm-spin" /></div> : d.error ? <p className="adm-err">{d.error}</p> : !d.posts.length ? (
        <Empty to="/admin/posts/new" action="Write the first post">No posts match.</Empty>
      ) : (
        <div className="adm-table">
          <table>
            <thead><tr><th>Title</th><th>Company</th><th>Status</th><th>Published</th><th>Updated</th><th /></tr></thead>
            <tbody>
              {d.posts.map((p) => (
                <tr key={p.id}>
                  <td><Link to={`/admin/posts/${p.id}`} className="adm-tt">{p.title}</Link><small>/insights/{p.slug}</small></td>
                  <td><Co id={p.company} /></td>
                  <td><Status s={p.status} /></td>
                  <td>{p.status === "published" ? when(p.published_at) : "-"}</td>
                  <td>{when(p.updated_at)}</td>
                  <td className="adm-act">
                    <Link to={`/admin/posts/${p.id}`}>Edit</Link>
                    {p.status === "published" && <a href={`/insights/${p.slug}`} target="_blank" rel="noopener">View</a>}
                  </td>
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
