import React, { useEffect, useState } from "react";
import { Link } from "../router";
import { COMPANY } from "../site";
import Icon from "../components/Icon";
import { getPost, formatDate, COMPANY_LABEL } from "../lib/api";
import { PostCard } from "./Insights";
import { applyHead } from "../lib/head";

/* One blog article: /insights/<slug>. The text comes from the admin panel (MySQL). */
export default function Post({ slug }) {
  const [d, setD] = useState({ loading: true });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let live = true;
    setD({ loading: true });
    getPost(slug).then((r) => {
      if (!live) return;
      if (!r.ok || !r.post) { setD({ loading: false, missing: true }); return; }
      setD({ loading: false, post: r.post, related: r.related || [] });
      applyHead({ path: `/insights/${slug}`, title: `${r.post.seo_title || r.post.title} | GAA Group Insights`, description: r.post.seo_description || r.post.excerpt || "" }, false);
    });
    return () => { live = false; };
  }, [slug]);

  if (d.loading) {
    return (
      <main className="pst" id="top">
        <section className="pst-hero"><div className="ff-in pst-in"><div className="pst-sk" aria-hidden="true"><i /><i /><i /></div></div></section>
      </main>
    );
  }
  if (d.missing) {
    return (
      <main className="pst" id="top">
        <section className="pst-hero"><div className="ff-in pst-in">
          <span className="ff-eye">Insights</span>
          <h1 className="ff-h1">This article isn't available.</h1>
          <p className="pst-lead">It may have been moved or unpublished.</p>
          <div className="ff-btns"><Link className="ff-btn pri" to="/insights">All Articles <Icon name="arrow" /></Link></div>
        </div></section>
      </main>
    );
  }

  const p = d.post;
  const co = COMPANY[p.company];
  const url = typeof window !== "undefined" ? window.location.origin + `/insights/${p.slug}` : "";
  const share = encodeURIComponent(url);
  const copy = () => { try { navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch (e) { /* ignore */ } };

  return (
    <main className="pst" id="top">
      <section className="pst-hero">
        <div className="ff-in pst-in">
          <nav className="sv-bc" aria-label="Breadcrumb"><Link to="/">Home</Link><span>/</span><Link to="/insights">Insights</Link><span>/</span><b>{COMPANY_LABEL[p.company]}</b></nav>
          <div className="pst-meta">
            <Link to={`/insights#${p.company}`} className={`bl-co c-${p.company}`}>{COMPANY_LABEL[p.company]}</Link>
            {p.category && <span>{p.category}</span>}
          </div>
          <h1 className="ff-h1 pst-h1">{p.title}</h1>
          {p.excerpt && <p className="pst-lead">{p.excerpt}</p>}
          <div className="pst-by">
            <span className="pst-av">{(p.author_name || "G").slice(0, 1)}</span>
            <span><b>{p.author_name || `${COMPANY_LABEL[p.company]} team`}</b><small>{formatDate(p.published_at)}{p.read_minutes ? ` · ${p.read_minutes} min read` : ""}</small></span>
          </div>
        </div>
        {p.cover_image && <div className="ff-in"><figure className="pst-cover"><img src={p.cover_image} alt="" /></figure></div>}
      </section>

      <section className="pst-body">
        <div className="ff-in pst-grid">
          <aside className="pst-share" aria-label="Share">
            <small>Share</small>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${share}`} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn"><i className="in">in</i></a>
            <a href={`https://wa.me/?text=${encodeURIComponent(p.title + " " + url)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp"><Icon name="phone" /></a>
            <a href={`mailto:?subject=${encodeURIComponent(p.title)}&body=${share}`} aria-label="Share by email"><Icon name="mail" /></a>
            <button type="button" onClick={copy} aria-label="Copy link">{copied ? <Icon name="check" /> : <Icon name="layers" />}</button>
          </aside>
          <article className="prose" dangerouslySetInnerHTML={{ __html: p.content_html }} />
          <aside className="pst-side">
            {co && (
              <div className="pst-co">
                <span className="hg-logo"><img src={co.logo} alt="" /></span>
                <small>Written by the team at</small>
                <b>{co.name}</b>
                <p>{co.short}</p>
                <Link className="ff-lk" to={`/${co.id}`}>Explore {co.name} <Icon name="arrow" /></Link>
              </div>
            )}
            <div className="pst-ask">
              <b>Have a question about this?</b>
              <p>Our team can explain what it means for your business.</p>
              <Link className="ff-btn pri" to={`/contact#${p.company === "gaa-group" ? "" : p.company}`}>Talk to Our Team <Icon name="arrow" /></Link>
            </div>
          </aside>
        </div>
        <div className="ff-in"><p className="pst-dis">This article is general information, not legal, tax or professional advice for your situation. Laws and due dates change; please speak to us before acting on it.</p></div>
      </section>

      {d.related.length > 0 && (
        <section className="ff-sec pst-rel">
          <div className="ff-in">
            <div className="ff-hd"><div><span className="ff-eye">Keep reading</span><h2 className="ff-h2">More articles.</h2></div><Link className="ff-lk" to="/insights">All articles <Icon name="arrow" /></Link></div>
            <div className="bl-g three">{d.related.map((r) => <PostCard key={r.slug} p={r} />)}</div>
          </div>
        </section>
      )}
    </main>
  );
}
