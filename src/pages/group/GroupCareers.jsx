import React, { useEffect, useRef, useState } from "react";
import { Link } from "../../router";
import useReveal from "../../lib/useReveal";

/* GAA Group careers page. Centred hero (same pattern as Home and About), the five career paths as cards
   (a one-by-one slider on mobile), then the CS Articleship programme. Styles: src/styles/careers-v1.css */
const Arrow = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;

const ROLES = [
  { id: "articleship", tag: "For CS students", t: "CS Articleship", p: "Practical company secretarial and compliance training on live files at GAA Consulting, with regular mentoring from practising professionals." },
  { id: "cs-semi-qualified", tag: "Executive level cleared", t: "CS Semi-qualified", p: "Hands-on work in MCA filings, board processes and corporate compliance for a varied client base." },
  { id: "cs-qualified", tag: "Qualified CS", t: "CS Qualified", p: "Roles in corporate advisory, secretarial compliance and governance, working directly with clients and senior professionals." },
  { id: "lawyers", tag: "Law graduates", t: "Lawyers", p: "Corporate, commercial, regulatory and transaction work alongside our advisory and compliance teams." },
  { id: "internship", tag: "College students", t: "College Internship Programmes", p: "Structured internships in advisory, compliance, accounting or HR, with a defined learning plan and real project work." },
];
const STEPS = [
  ["Apply", "Share your qualification and interests through the enquiry form."],
  ["Practical exposure", "Work on live corporate, secretarial and compliance matters."],
  ["Mentorship", "Regular guidance and review from practising company secretaries."],
  ["Trainee experience", "Hands-on MCA filings, board processes and M&A due diligence."],
];
const n2 = (i) => String(i + 1).padStart(2, "0");

export default function GroupCareers() {
  const track = useRef(null);
  const [cur, setCur] = useState(0);
  const [lit, setLit] = useState("");
  useReveal(".cv1 .rv", []);

  /* /careers#lawyers etc. highlights that path (and brings it into view on mobile) */
  useEffect(() => {
    const h = window.location.hash.replace("#", "");
    const i = ROLES.findIndex((r) => r.id === h || `p-${r.id}` === h);
    if (i >= 0) { setLit(ROLES[i].id); go(i, false); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mobile = () => window.matchMedia && window.matchMedia("(max-width: 899px)").matches;
  const go = (i, smooth = true) => {
    const el = track.current;
    if (!el || !mobile()) return;
    const card = el.children[i];
    if (card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: smooth ? "smooth" : "auto" });
  };

  /* mobile slider: follow the swipe, and move on by itself every few seconds until the visitor touches it */
  useEffect(() => {
    const el = track.current;
    if (!el) return undefined;
    let paused = false;
    const onScroll = () => {
      const w = el.children[0] ? el.children[0].getBoundingClientRect().width + 14 : 1;
      setCur(Math.max(0, Math.min(ROLES.length - 1, Math.round(el.scrollLeft / w))));
    };
    const stop = () => { paused = true; };
    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("pointerdown", stop);
    el.addEventListener("touchstart", stop, { passive: true });
    const t = setInterval(() => {
      if (paused || document.hidden || !mobile()) return;
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      setCur((c) => { const n = (c + 1) % ROLES.length; go(n); return n; });
    }, 3600);
    return () => { clearInterval(t); el.removeEventListener("scroll", onScroll); el.removeEventListener("pointerdown", stop); el.removeEventListener("touchstart", stop); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="cv1" id="top">
      <section className="cv1-hero">
        <div className="cv1-in">
          <span className="cv1-eye rv">Careers</span>
          <h1 className="cv1-h1 rv" style={{ "--d": 1 }}>Grow your career<br />with GAA <em className="hw-o">Group.</em></h1>
          <p className="cv1-lead rv" style={{ "--d": 2 }}>Whether you are a CS student, a qualified professional, a lawyer or a college student, GAA Group offers practical, mentored work across corporate advisory, compliance, accounting and talent. Choose the path that fits you and apply with your CV.</p>
          <div className="cv1-btns rv" style={{ "--d": 3 }}>
            <Link className="cv1-btn pri" to="/contact#careers">Apply now <Arrow /></Link>
            <Link className="cv1-btn sec" to="#training">About CS Articleship <Arrow /></Link>
          </div>
        </div>
      </section>

      <section className="cv1-roles" aria-label="Career paths">
        <div className="cv1-in">
          <div className="cv1-g" ref={track}>
            {ROLES.map((r, i) => (
              <article key={r.id} id={`p-${r.id}`} className={`cv1-c rv${lit === r.id ? " lit" : ""}`} style={{ "--d": i + 1 }}>
                <span className="cv1-num">{n2(i)}</span>
                <small>{r.tag}</small>
                <b>{r.t}</b>
                <p>{r.p}</p>
                <Link className="cv1-apply" to={`/contact#${r.id}`}>Apply <Arrow /></Link>
              </article>
            ))}
          </div>
          <div className="cv1-nav" aria-hidden="true">
            <div className="cv1-dots">{ROLES.map((r, i) => <button key={r.id} type="button" className={i === cur ? "on" : ""} onClick={() => { setCur(i); go(i); }} tabIndex={-1} />)}</div>
            <div className="cv1-arr">
              <button type="button" tabIndex={-1} onClick={() => { const n = (cur - 1 + ROLES.length) % ROLES.length; setCur(n); go(n); }}><svg viewBox="0 0 24 24"><path d="M19 12H5M11 18l-6-6 6-6" /></svg></button>
              <button type="button" tabIndex={-1} onClick={() => { const n = (cur + 1) % ROLES.length; setCur(n); go(n); }}><Arrow /></button>
            </div>
          </div>
        </div>
      </section>

      <section className="cv1-cs" id="training">
        <div className="cv1-in">
          <div className="cv1-cs-h">
            <div className="rv"><h2 className="cv1-h2">CS Articleship</h2><span className="cv1-bar" /><p className="cv1-sub">Learn the profession on <em className="hw-o">real files.</em></p></div>
            <div className="rv" style={{ "--d": 1 }}>
              <p className="cv1-p">Practical company secretarial and compliance articleship at GAA Consulting, for CS students who want real work, close mentoring and a clear path into practice.</p>
              <Link className="cv1-btn pri" to="/contact#articleship">Apply for Articleship <Arrow /></Link>
            </div>
          </div>
          <ol className="cv1-steps rv" style={{ "--d": 2 }}>
            {STEPS.map(([t, p], i) => <li key={t}><span className="cv1-num">{n2(i)}</span><b>{t}</b><p>{p}</p></li>)}
          </ol>
          <div className="cv1-facts rv" style={{ "--d": 3 }}>
            <div><small>Who it is for</small><b>CS pursuants</b></div>
            <div><small>Where you train</small><b>GAA Consulting, alongside practising professionals</b></div>
            <div><small>What you gain</small><b>Immersive training and expert mentorship</b></div>
          </div>
        </div>
      </section>
    </main>
  );
}
