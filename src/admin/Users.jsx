import React, { useEffect, useState } from "react";
import { admin } from "../lib/api";
import { PageHead, Notice, when } from "./ui";

export default function Users() {
  const [d, setD] = useState(null);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [nu, setNu] = useState({ name: "", email: "", password: "", role: "editor" });
  const [pw, setPw] = useState({ current: "", next: "", again: "" });
  const load = () => admin.users().then((r) => (r.ok ? setD(r) : setErr(r.error)));
  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault(); setErr(""); setMsg("");
    const r = await admin.saveUser(nu);
    if (!r.ok) return setErr(r.error);
    setNu({ name: "", email: "", password: "", role: "editor" }); setMsg("User added."); load();
  };
  const del = async (u) => {
    if (!window.confirm(`Remove ${u.name}? They will no longer be able to sign in.`)) return;
    const r = await admin.deleteUser(u.id); if (!r.ok) return setErr(r.error); load();
  };
  const change = async (e) => {
    e.preventDefault(); setErr(""); setMsg("");
    if (pw.next !== pw.again) return setErr("The new passwords do not match.");
    const r = await admin.password(pw.current, pw.next);
    if (!r.ok) return setErr(r.error);
    setPw({ current: "", next: "", again: "" }); setMsg("Password changed.");
  };

  return (
    <>
      <PageHead title="Users & password" sub="Who can sign in to this admin panel." />
      <Notice msg={msg} />
      {err && <div className="adm-note bad" role="alert">{err}</div>}
      <div className="adm-two">
        <section className="adm-card">
          <h3>Admin users</h3>
          {!d ? <div className="adm-load"><span className="adm-spin" /></div> : (
            <ul className="adm-list plain">
              {d.users.map((u) => (
                <li key={u.id}><span><b>{u.name}{u.id === d.me ? " (you)" : ""}</b><small>{u.email} · {u.role === "admin" ? "Administrator" : "Editor"} · last sign-in {u.last_login ? when(u.last_login) : "never"}</small></span>
                  {d.role === "admin" && u.id !== d.me && <button type="button" className="adm-link bad" onClick={() => del(u)}>Remove</button>}
                </li>
              ))}
            </ul>
          )}
          {d && d.role === "admin" && (
            <form className="adm-form" onSubmit={add}>
              <h3>Add a user</h3>
              <label className="adm-f"><span>Name</span><input required value={nu.name} onChange={(e) => setNu({ ...nu, name: e.target.value })} /></label>
              <label className="adm-f"><span>Email</span><input required type="email" value={nu.email} onChange={(e) => setNu({ ...nu, email: e.target.value })} /></label>
              <label className="adm-f"><span>Password (at least 10 characters)</span><input required type="password" minLength={10} value={nu.password} onChange={(e) => setNu({ ...nu, password: e.target.value })} autoComplete="new-password" /></label>
              <label className="adm-f"><span>Role</span><select value={nu.role} onChange={(e) => setNu({ ...nu, role: e.target.value })}><option value="editor">Editor (blog and submissions)</option><option value="admin">Administrator (also manages users)</option></select></label>
              <button className="adm-btn pri">Add user</button>
            </form>
          )}
        </section>
        <section className="adm-card">
          <form className="adm-form" onSubmit={change}>
            <h3>Change your password</h3>
            <label className="adm-f"><span>Current password</span><input required type="password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} autoComplete="current-password" /></label>
            <label className="adm-f"><span>New password (at least 10 characters)</span><input required type="password" minLength={10} value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} autoComplete="new-password" /></label>
            <label className="adm-f"><span>New password again</span><input required type="password" minLength={10} value={pw.again} onChange={(e) => setPw({ ...pw, again: e.target.value })} autoComplete="new-password" /></label>
            <button className="adm-btn pri">Change password</button>
          </form>
        </section>
      </div>
    </>
  );
}
