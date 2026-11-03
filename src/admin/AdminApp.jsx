import React, { useEffect, useState } from "react";
import { Link, useRouter } from "../router";
import { admin, setCsrf } from "../lib/api";
import Icon from "../components/Icon";
import Dashboard from "./Dashboard";
import Posts from "./Posts";
import PostEdit from "./PostEdit";
import Enquiries from "./Enquiries";
import EnquiryView from "./EnquiryView";
import Subscribers from "./Subscribers";
import Users from "./Users";
import "./admin.css";

/* Admin panel at /admin: blog posts, form submissions, subscribers and admin users.
   Talks to the PHP API in /api/admin (session login, MySQL). */
const NAV = [
  ["/admin", "Dashboard", "bars"],
  ["/admin/posts", "Blog posts", "doc"],
  ["/admin/enquiries", "Form submissions", "mail"],
  ["/admin/subscribers", "Subscribers", "bell"],
  ["/admin/users", "Users & password", "user"],
];

function Login({ onIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setErr(""); setBusy(true);
    const r = await admin.login(email.trim(), password);
    setBusy(false);
    if (!r.ok) return setErr(r.error || "Could not sign in.");
    setCsrf(r.csrf); onIn(r.user);
  };
  return (
    <div className="adm-login">
      <form className="adm-lbox" onSubmit={submit}>
        <img src="/images/gaa-mark.webp" alt="GAA" className="adm-llogo" />
        <h1>Management login</h1>
        <p>Sign in to manage the blog and see form submissions.</p>
        <label><span>Email</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required autoFocus /></label>
        <label><span>Password</span><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required /></label>
        {err && <p className="adm-err" role="alert">{err}</p>}
        <button className="adm-btn pri wide" disabled={busy}>{busy ? "Signing in..." : "Sign in"}</button>
        <a className="adm-back" href="/">&larr; Back to the website</a>
      </form>
    </div>
  );
}

function Screen({ path }) {
  const m = path.match(/^\/admin\/([a-z]+)(?:\/([a-z0-9-]+))?/);
  const sec = m ? m[1] : "";
  const id = m ? m[2] : "";
  if (sec === "posts" && id) return <PostEdit id={id} />;
  if (sec === "posts") return <Posts />;
  if (sec === "enquiries" && id) return <EnquiryView id={id} />;
  if (sec === "enquiries") return <Enquiries />;
  if (sec === "subscribers") return <Subscribers />;
  if (sec === "users") return <Users />;
  return <Dashboard />;
}

export default function AdminApp({ path }) {
  const { navigate } = useRouter();
  const [user, setUser] = useState(undefined);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    document.title = "Admin | GAA Group";
    admin.me().then((r) => { if (r.ok && r.user) { setCsrf(r.csrf); setUser(r.user); } else setUser(null); });
  }, []);
  useEffect(() => setMenu(false), [path]);

  if (user === undefined) return <div className="adm adm-wait"><span className="adm-spin" /></div>;
  if (!user) return <div className="adm"><Login onIn={setUser} /></div>;

  const out = async () => { await admin.logout(); setUser(null); navigate("/admin"); };
  const active = (p) => (p === "/admin" ? path === "/admin" : path.startsWith(p));

  return (
    <div className={`adm adm-shell${menu ? " menu" : ""}`}>
      <aside className="adm-side">
        <Link to="/admin" className="adm-brand"><img src="/images/gaa-mark.webp" alt="GAA" /><span>Admin</span></Link>
        <nav>
          {NAV.map(([p, t, ic]) => <Link key={p} to={p} className={active(p) ? "on" : ""}><Icon name={ic} />{t}</Link>)}
        </nav>
        <div className="adm-side-f">
          <a href="/" target="_blank" rel="noopener"><Icon name="eye" />View website</a>
          <button type="button" onClick={out}><Icon name="arrow" />Sign out</button>
        </div>
      </aside>
      <div className="adm-main">
        <header className="adm-top">
          <button type="button" className="adm-burger" onClick={() => setMenu((x) => !x)} aria-label="Menu"><Icon name={menu ? "close" : "menu"} /></button>
          <span className="adm-hi">Signed in as <b>{user.name}</b></span>
          <Link className="adm-btn pri sm" to="/admin/posts/new"><Icon name="plus" />New post</Link>
        </header>
        <div className="adm-body"><Screen path={path} /></div>
      </div>
    </div>
  );
}
