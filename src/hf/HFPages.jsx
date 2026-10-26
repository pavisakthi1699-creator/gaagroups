import React, { useState } from "react";
import { Link } from "../group/router.jsx";
import { HFPage, FinalBanner, TalentCard, Icon, BASE, HIRE } from "./HFLayout.jsx";
import { ProcessFlow } from "./HFHome.jsx";
import { CATEGORIES, TALENT, getCategory } from "./hfData.js";
import { COMPANIES, GROUP } from "../group/sites.js";

export function HFTalent() {
  const [cat, setCat] = useState("all");
  const list = TALENT.filter((t) => cat === "all" || t.cat === cat);
  return (
    <HFPage>
      <section className="h-phero">
        <div className="h-w">
          <span className="h-eb">Explore candidates</span>
          <h1>Talent, <em>ready when you are.</em></h1>
          <p>Browse example profiles by team. Request profiles and we share matching, pre-screened candidates.</p>
        </div>
      </section>
      <section className="h-sec h-tight">
        <div className="h-w">
          <div className="h-chips" role="group" aria-label="Filter by team">
            <button type="button" aria-pressed={cat === "all"} onClick={() => setCat("all")}>All</button>
            {CATEGORIES.map((c) => (
              <button key={c.slug} type="button" aria-pressed={cat === c.slug} onClick={() => setCat(c.slug)}>{c.name}</button>
            ))}
          </div>
          <div className="h-grid">
            {list.map((t) => <TalentCard key={t.role} t={t} />)}
          </div>
          <div className="h-pool-cta">
            <Link to={HIRE} className="h-pill h-lg">Request Profiles</Link>
          </div>
        </div>
      </section>
      <section className="h-sec h-cats">
        <div className="h-w">
          <div className="h-head"><span className="h-eb">By team</span><h2>Talent categories</h2></div>
          <div className="h-tiles">
            {CATEGORIES.map((c) => (
              <Link key={c.slug} to={`${BASE}/talent/${c.slug}`} className={`h-tile h-${c.tone}`}>
                <span className="h-tile-ic"><Icon name={c.slug} size={30} /></span>
                <h3>{c.name}</h3>
                <p>{c.line}</p>
                <span className="h-tile-go">Explore <Icon name="chev" size={14} sw={2} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <FinalBanner />
    </HFPage>
  );
}

export function HFCategory({ slug }) {
  const c = getCategory(slug) || CATEGORIES[0];
  const pool = TALENT.filter((t) => t.cat === c.slug);
  const others = CATEGORIES.filter((x) => x.slug !== c.slug);
  return (
    <HFPage>
      <section className={`h-phero h-cat-hero h-${c.tone}`}>
        <div className="h-w">
          <nav className="h-crumbs" aria-label="Breadcrumb">
            <Link to={BASE}>Hirings First</Link><i>›</i><Link to={`${BASE}/talent`}>Talent</Link><i>›</i><span aria-current="page">{c.name}</span>
          </nav>
          <span className="h-tile-ic big"><Icon name={c.slug} size={40} /></span>
          <h1>{c.name}</h1>
          <p>{c.line}</p>
          <div className="h-acts center">
            <Link to={`${HIRE}?category=${c.slug}`} className="h-pill h-lg">Hire {c.name} talent</Link>
          </div>
        </div>
      </section>

      <section className="h-sec">
        <div className="h-w h-two">
          <div>
            <span className="h-eb">Roles we place</span>
            <ul className="h-roles">
              {c.roles.map((r) => <li key={r}>{r}</li>)}
            </ul>
          </div>
          <div className="h-assess">
            <span className="h-eb">How candidates are assessed</span>
            <ol>
              {c.assess.map((a, i) => (
                <li key={a}><span>{i + 1}</span>{a}</li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {pool.length > 0 && (
        <section className="h-sec h-pool h-tight">
          <div className="h-w">
            <div className="h-head"><span className="h-eb">Available talent</span><h2>{c.name} profiles</h2></div>
            <div className="h-grid">
              {pool.map((t) => <TalentCard key={t.role} t={t} />)}
            </div>
          </div>
        </section>
      )}

      <ProcessFlow />

      <section className="h-sec h-cats">
        <div className="h-w">
          <div className="h-head"><span className="h-eb">Other teams</span><h2>Explore more talent.</h2></div>
          <div className="h-tiles h-small">
            {others.map((o) => (
              <Link key={o.slug} to={`${BASE}/talent/${o.slug}`} className={`h-tile h-${o.tone}`}>
                <span className="h-tile-ic"><Icon name={o.slug} size={26} /></span>
                <h3>{o.name}</h3>
                <span className="h-tile-go">Explore <Icon name="chev" size={14} sw={2} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <FinalBanner />
    </HFPage>
  );
}

function initial() {
  const q = new URLSearchParams(window.location.search);
  return {
    mode: q.get("for") === "candidate" ? "candidate" : "hire",
    category: getCategory(q.get("category") || "") ? q.get("category") : CATEGORIES[0].slug,
    role: q.get("role") || "",
  };
}

export function HFHire() {
  const init = initial();
  const [mode, setMode] = useState(init.mode);
  const [f, setF] = useState({ name: "", email: "", phone: "", company: "", category: init.category, role: init.role, count: "1", location: "", message: "", website: "" });
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);
  const on = (e) => setF((p) => ({ ...p, [e.target.name]: e.target.value }));
  const hiring = mode === "hire";

  const submit = async (e) => {
    e.preventDefault();
    if (f.website) return;
    if (!f.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) {
      setStatus({ t: "er", m: "Please add your name and a valid email address." });
      return;
    }
    const payload = { company: "Hirings First", type: hiring ? "Hiring request" : "Candidate registration", ...f, category: getCategory(f.category)?.name, page: window.location.href };
    delete payload.website;
    setBusy(true);
    try {
      if (GROUP.formEndpoint) {
        const r = await fetch(GROUP.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(payload) });
        if (!r.ok) throw new Error("failed");
        setStatus({ t: "ok", m: hiring ? "Thank you. Matching profiles usually arrive within 72 hours." : "Thank you. Our team will be in touch when a matching role opens." });
      } else {
        const body = Object.entries(payload).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join("\n");
        window.location.href = `mailto:${COMPANIES.hf.email}?subject=${encodeURIComponent(payload.type)}&body=${encodeURIComponent(body)}`;
        setStatus({ t: "ok", m: `Your email app should now open with your request addressed to ${COMPANIES.hf.email}.` });
      }
    } catch (err) {
      setStatus({ t: "er", m: `Something went wrong. Please email ${COMPANIES.hf.email}.` });
    }
    setBusy(false);
  };

  return (
    <HFPage>
      <section className="h-phero">
        <div className="h-w">
          <span className="h-eb">{hiring ? "Hire talent" : "For candidates"}</span>
          <h1>{hiring ? <>Tell us who <em>you need.</em></> : <>Join our <em>talent pool.</em></>}</h1>
          <p>{hiring ? "Share the role in a few lines. Most mandates receive profiles within 72 hours." : "Share your details and the kind of role you want. We contact you when a matching opportunity opens."}</p>
        </div>
      </section>
      <section className="h-sec h-tight">
        <div className="h-w h-formw">
          <div className="h-seg" role="tablist" aria-label="I am">
            <button type="button" role="tab" aria-selected={hiring} onClick={() => setMode("hire")}>I'm hiring</button>
            <button type="button" role="tab" aria-selected={!hiring} onClick={() => setMode("candidate")}>I'm looking for a role</button>
          </div>
          <form className="h-form" onSubmit={submit} noValidate>
            <div className="h-f2">
              <label><span>Full name *</span><input name="name" value={f.name} onChange={on} autoComplete="name" required /></label>
              <label><span>Email *</span><input name="email" type="email" value={f.email} onChange={on} autoComplete="email" required /></label>
            </div>
            <div className="h-f2">
              <label><span>Phone</span><input name="phone" type="tel" value={f.phone} onChange={on} autoComplete="tel" /></label>
              {hiring ? (
                <label><span>Company</span><input name="company" value={f.company} onChange={on} autoComplete="organization" /></label>
              ) : (
                <label><span>Current location</span><input name="location" value={f.location} onChange={on} /></label>
              )}
            </div>
            <div className="h-f2">
              <label>
                <span>Team</span>
                <select name="category" value={f.category} onChange={on}>
                  {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </select>
              </label>
              <label><span>{hiring ? "Role(s) to fill" : "Role you want"}</span><input name="role" value={f.role} onChange={on} placeholder={hiring ? "e.g. Finance Executive" : "e.g. HR Executive"} /></label>
            </div>
            {hiring && (
              <div className="h-f2">
                <label><span>Number of positions</span><input name="count" type="number" min="1" value={f.count} onChange={on} /></label>
                <label><span>Job location</span><input name="location" value={f.location} onChange={on} /></label>
              </div>
            )}
            <label><span>{hiring ? "Anything else we should know?" : "Experience and skills"}</span><textarea name="message" rows={4} value={f.message} onChange={on} /></label>
            <input className="h-hp" name="website" value={f.website} onChange={on} tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <div className="h-form-foot">
              <button type="submit" className="h-pill h-lg" disabled={busy}>{busy ? "Sending…" : hiring ? "Request Profiles" : "Submit details"}</button>
              <span>We reply within one working day.</span>
            </div>
            {status && <p className={`h-status h-${status.t}`} role="status">{status.m}</p>}
          </form>
        </div>
      </section>
    </HFPage>
  );
}
