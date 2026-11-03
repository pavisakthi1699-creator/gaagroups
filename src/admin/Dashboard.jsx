import React, { useEffect, useState } from "react";
import { Link } from "../router";
import { admin } from "../lib/api";
import Icon from "../components/Icon";
import { PageHead, Co, Status, when } from "./ui";

export default function Dashboard() {
  const [d, setD] = useState(null);
  const [err, setErr] = useState("");
  useEffect(() => { admin.stats().then((r) => (r.ok ? setD(r) : setErr(r.error))); }, []);
  if (err) return <p className="adm-err">{err}</p>;
  if (!d) return <div className="adm-load"><span className="adm-spin" /></div>;
  const cards = [
    ["New submissions", d.enquiries_new, "/admin/enquiries?status=new", "mail"],
    ["Submissions this month", d.enquiries_month, "/admin/enquiries", "bars"],
    ["Published posts", d.posts_published, "/admin/posts", "doc"],
    ["Drafts", d.posts_draft, "/admin/posts", "book"],
    ["Subscribers", d.subscribers, "/admin/subscribers", "bell"],
  ];
  return (
    <>
      <PageHead title="Dashboard" sub="What's new on the website." />
      <div className="adm-stats">
        {cards.map(([t, v, to, ic]) => (
          <Link key={t} to={to.split("?")[0]} className="adm-stat"><Icon name={ic} /><b>{v}</b><span>{t}</span></Link>
        ))}
      </div>
      <div className="adm-two">
        <section className="adm-card">
          <div className="adm-card-h"><h2>Latest submissions</h2><Link to="/admin/enquiries">View all</Link></div>
          {d.latest_enquiries.length ? (
            <ul className="adm-list">
              {d.latest_enquiries.map((e) => (
                <li key={e.id}><Link to={`/admin/enquiries/${e.id}`}>
                  <span><b>{e.name}</b><small>{e.service_label} · {when(e.created_at)}</small></span>
                  <span className="adm-list-r"><Co id={e.company} /><Status s={e.status} /></span>
                </Link></li>
              ))}
            </ul>
          ) : <p className="adm-muted">No submissions yet.</p>}
        </section>
        <section className="adm-card">
          <div className="adm-card-h"><h2>Latest posts</h2><Link to="/admin/posts">View all</Link></div>
          {d.latest_posts.length ? (
            <ul className="adm-list">
              {d.latest_posts.map((p) => (
                <li key={p.id}><Link to={`/admin/posts/${p.id}`}>
                  <span><b>{p.title}</b><small>{when(p.updated_at)}</small></span>
                  <span className="adm-list-r"><Co id={p.company} /><Status s={p.status} /></span>
                </Link></li>
              ))}
            </ul>
          ) : <p className="adm-muted">No posts yet.</p>}
          <Link className="adm-btn" to="/admin/posts/new"><Icon name="plus" />Write a new post</Link>
        </section>
      </div>
    </>
  );
}
