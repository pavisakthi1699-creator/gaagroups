import React, { useEffect, useRef, useState } from "react";
import { Link, useRouter } from "../router";
import { admin } from "../lib/api";
import Icon from "../components/Icon";
import Editor from "./Editor";
import { PageHead, Notice, COMPANY_OPTIONS, Status } from "./ui";

const BLANK = { id: 0, title: "", slug: "", company: "gaa-group", category: "", excerpt: "", content_html: "<p></p>", cover_image: "", author_name: "", status: "draft", published_at: "", seo_title: "", seo_description: "" };
const slugify = (s) => s.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-").slice(0, 90);
const localInput = (s) => (s ? String(s).replace(" ", "T").slice(0, 16) : "");

export default function PostEdit({ id }) {
  const { navigate } = useRouter();
  const isNew = id === "new";
  const [p, setP] = useState(isNew ? BLANK : null);
  const [autoSlug, setAutoSlug] = useState(isNew);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [preview, setPreview] = useState(false);
  const [dirty, setDirty] = useState(false);
  const cover = useRef(null);

  useEffect(() => {
    if (isNew) { setP(BLANK); setAutoSlug(true); return; }
    admin.post(id).then((r) => (r.ok ? setP(r.post) : setErr(r.error || "Post not found")));
  }, [id, isNew]);

  useEffect(() => {
    const warn = (e) => { if (dirty) { e.preventDefault(); e.returnValue = ""; } };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  if (err && !p) return <p className="adm-err">{err}</p>;
  if (!p) return <div className="adm-load"><span className="adm-spin" /></div>;

  const set = (k, v) => {
    setDirty(true); setMsg("");
    setP((x) => {
      const n = { ...x, [k]: v };
      if (k === "title" && autoSlug) n.slug = slugify(v);
      return n;
    });
  };
  const words = (p.content_html || "").replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;

  const save = async (status) => {
    setErr(""); setMsg("");
    if (!p.title.trim()) return setErr("Please add a title.");
    if (!p.slug.trim()) return setErr("Please add a web address (slug).");
    setSaving(true);
    const r = await admin.savePost({ ...p, status: status || p.status });
    setSaving(false);
    if (!r.ok) return setErr(r.error);
    setDirty(false);
    setP(r.post);
    setMsg(r.post.status === "published" ? "Saved and published." : "Draft saved.");
    if (isNew) navigate(`/admin/posts/${r.post.id}`, { replace: true });
  };
  const del = async () => {
    if (!window.confirm("Delete this post? This cannot be undone.")) return;
    const r = await admin.deletePost(p.id);
    if (!r.ok) return setErr(r.error);
    setDirty(false); navigate("/admin/posts");
  };
  const upCover = async (e) => {
    const f = e.target.files && e.target.files[0]; e.target.value = "";
    if (!f) return;
    setMsg("Uploading cover image...");
    const r = await admin.upload(f);
    if (!r.ok) { setMsg(""); return setErr(r.error); }
    set("cover_image", r.url); setMsg("");
  };

  return (
    <>
      <PageHead title={isNew ? "New post" : "Edit post"} sub={isNew ? "Write an article for the Insights page." : <>Status: <Status s={p.status} /></>}>
        <Link className="adm-btn" to="/admin/posts">&larr; All posts</Link>
        {p.status === "published" && p.id ? <a className="adm-btn" href={`/insights/${p.slug}`} target="_blank" rel="noopener"><Icon name="eye" />View live</a> : null}
      </PageHead>
      <Notice msg={msg} />
      {err && <div className="adm-note bad" role="alert">{err}</div>}
      <div className="adm-edit">
        <div className="adm-edit-main">
          <input className="adm-title" placeholder="Post title" value={p.title} onChange={(e) => set("title", e.target.value)} />
          <label className="adm-f"><span>Short summary (shown on cards and in search results)</span>
            <textarea rows={2} maxLength={300} value={p.excerpt} onChange={(e) => set("excerpt", e.target.value)} placeholder="One or two sentences about the article" />
          </label>
          <Editor value={p.content_html} onChange={(v) => set("content_html", v)} />
          <p className="adm-muted">{words} words · about {Math.max(1, Math.round(words / 200))} min read</p>
        </div>
        <aside className="adm-edit-side">
          <div className="adm-card">
            <h3>Publish</h3>
            <label className="adm-f"><span>Status</span>
              <select value={p.status} onChange={(e) => set("status", e.target.value)}><option value="draft">Draft (not visible)</option><option value="published">Published</option></select>
            </label>
            <label className="adm-f"><span>Publish date</span>
              <input type="datetime-local" value={localInput(p.published_at)} onChange={(e) => set("published_at", e.target.value.replace("T", " "))} />
              <small>Leave empty to use the time you publish.</small>
            </label>
            <div className="adm-row">
              <button type="button" className="adm-btn" disabled={saving} onClick={() => save("draft")}>Save draft</button>
              <button type="button" className="adm-btn pri" disabled={saving} onClick={() => save("published")}>{saving ? "Saving..." : p.status === "published" ? "Update" : "Publish"}</button>
            </div>
            <button type="button" className="adm-link" onClick={() => setPreview(true)}>Preview</button>
          </div>
          <div className="adm-card">
            <h3>Details</h3>
            <label className="adm-f"><span>Company</span>
              <select value={p.company} onChange={(e) => set("company", e.target.value)}>{COMPANY_OPTIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
            </label>
            <label className="adm-f"><span>Category</span><input value={p.category} onChange={(e) => set("category", e.target.value)} placeholder="For example GST, FEMA, Hiring" /></label>
            <label className="adm-f"><span>Author</span><input value={p.author_name} onChange={(e) => set("author_name", e.target.value)} placeholder="Name or team" /></label>
            <label className="adm-f"><span>Web address</span>
              <div className="adm-slug"><small>/insights/</small><input value={p.slug} onChange={(e) => { setAutoSlug(false); set("slug", slugify(e.target.value)); }} /></div>
            </label>
          </div>
          <div className="adm-card">
            <h3>Cover image</h3>
            {p.cover_image ? (
              <div className="adm-cover"><img src={p.cover_image} alt="" /><button type="button" className="adm-link" onClick={() => set("cover_image", "")}>Remove</button></div>
            ) : <p className="adm-muted">No cover image. Cards show a branded placeholder.</p>}
            <button type="button" className="adm-btn" onClick={() => cover.current.click()}><Icon name="download" />Upload image</button>
            <input ref={cover} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={upCover} />
            <small className="adm-muted">JPG, PNG or WebP, up to 5 MB. Wide images (16:9) work best.</small>
          </div>
          <div className="adm-card">
            <h3>Search engines</h3>
            <label className="adm-f"><span>SEO title</span><input maxLength={70} value={p.seo_title} onChange={(e) => set("seo_title", e.target.value)} placeholder={p.title} /><small>{(p.seo_title || p.title).length}/60 characters recommended</small></label>
            <label className="adm-f"><span>SEO description</span><textarea rows={3} maxLength={170} value={p.seo_description} onChange={(e) => set("seo_description", e.target.value)} placeholder={p.excerpt} /><small>{(p.seo_description || p.excerpt || "").length}/155 characters recommended</small></label>
          </div>
          {p.id ? <button type="button" className="adm-link bad" onClick={del}>Delete this post</button> : null}
        </aside>
      </div>
      {preview && (
        <div className="adm-modal" role="dialog" aria-label="Preview" onClick={(e) => e.target === e.currentTarget && setPreview(false)}>
          <div className="adm-modal-in">
            <button type="button" className="adm-x" onClick={() => setPreview(false)} aria-label="Close"><Icon name="close" /></button>
            {p.cover_image && <img className="adm-pv-cover" src={p.cover_image} alt="" />}
            <h1 className="adm-pv-h">{p.title || "Untitled"}</h1>
            {p.excerpt && <p className="adm-pv-x">{p.excerpt}</p>}
            <div className="prose" dangerouslySetInnerHTML={{ __html: p.content_html }} />
          </div>
        </div>
      )}
    </>
  );
}
