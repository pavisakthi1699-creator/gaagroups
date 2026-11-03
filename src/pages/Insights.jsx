import React, { useEffect, useMemo, useState } from "react";
import { Link, useRouter } from "../router";
import { CATS, dueIn, monthName, monthShort } from "../data/calendar.js";
import Icon from "../components/Icon";
import DueSoon from "../components/DueSoon";
import useReveal from "../lib/useReveal";
import { sendEnquiry, track } from "../lib/send";
import { listPosts, formatDate, COMPANY_LABEL } from "../lib/api";

const WEEKDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const FILTERS = [["", "All articles"], ["gaa-consulting", "GAA Consulting"], ["filings-first", "Filings First"], ["hirings-first", "Hirings First"]];

export function PostCard({ p, big }) {
  return (
    <Link to={`/insights/${p.slug}`} className={`bl-c${big ? " big" : ""}`}>
      <span className="bl-img">{p.cover_image ? <img src={p.cover_image} alt="" loading="lazy" /> : <i className={`bl-ph c-${p.company}`}><b>{COMPANY_LABEL[p.company]}</b></i>}</span>
      <span className="bl-b">
        <span className="bl-meta"><em className={`bl-co c-${p.company}`}>{COMPANY_LABEL[p.company] || "GAA Group"}</em>{p.category && <span>{p.category}</span>}</span>
        <b className="bl-t">{p.title}</b>
        <span className="bl-x">{p.excerpt}</span>
        <span className="bl-f"><span>{formatDate(p.published_at)}{p.read_minutes ? ` · ${p.read_minutes} min read` : ""}</span><Icon name="arrow" /></span>
      </span>
    </Link>
  );
}

/* Month-by-month due date planner (needs today's date, so it is filled in the browser) */
function Planner() {
  const [months, setMonths] = useState(null);
  const [cur, setCur] = useState(0);
  const [cat, setCat] = useState("all");
  useEffect(() => {
    const t = new Date();
    setMonths(Array.from({ length: 12 }, (_, k) => {
      const m = ((t.getMonth() + k) % 12) + 1;
      return { y: t.getFullYear() + Math.floor((t.getMonth() + k) / 12), m };
    }));
  }, []);
  const sel = months && months[cur];
  const list = sel ? dueIn(sel.y, sel.m).filter((e) => cat === "all" || e.cat === cat) : [];
  const today = new Date();
  const byDay = list.reduce((a, e) => { (a[e.day] = a[e.day] || []).push(e); return a; }, {});

  return (
    <div className="ip-box">
      <div className="ip-months" role="tablist" aria-label="Choose a month">
        {(months || Array.from({ length: 12 }, () => null)).map((x, i) => (
          <button key={i} type="button" role="tab" aria-selected={i === cur} className={i === cur ? "on" : ""} disabled={!x} onClick={() => setCur(i)}>
            {x ? <><b>{monthShort(x.m)}</b><small>{x.y}</small></> : <b>&nbsp;</b>}
          </button>
        ))}
      </div>
      <div className="ip-bar">
        <h3>{sel ? `${monthName(sel.m)} ${sel.y}` : "Loading the calendar"}</h3>
        <div className="ip-cats">
          {[["all", "All"], ...Object.entries(CATS)].map(([k, v]) => (
            <button key={k} type="button" className={cat === k ? "on" : ""} onClick={() => setCat(k)}>{v}</button>
          ))}
        </div>
      </div>
      <div className="ip-list" key={`${cur}-${cat}`}>
        {Object.keys(byDay).length === 0 && sel && <p className="ip-empty">No usual due dates in this category this month.</p>}
        {Object.entries(byDay).map(([d, es], i) => {
          const date = es[0].date;
          const past = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
          return (
            <div className={`ip-day${past ? " past" : ""}`} key={d} style={{ "--k": i }}>
              <div className="ip-date"><b>{d}</b><small>{WEEKDAY[date.getDay()]}</small></div>
              <div className="ip-items">
                {es.map((e) => (
                  <div className="ip-it" key={e.title}>
                    <em className={`c-${e.cat}`}>{e.catName}</em>
                    <b>{e.title}</b>
                    <p>{e.text}</p>
                  </div>
                ))}
              </div>
              {past && <span className="ip-gone">Passed</span>}
            </div>
          );
        })}
      </div>
      <p className="ip-note"><Icon name="bell" />These are the usual statutory due dates for many businesses. Your dates can differ, for example for quarterly GST filers or audit cases, and the government can change or extend them. <Link to="/contact#tax">Ask us what applies to you</Link>.</p>
    </div>
  );
}

function Notify() {
  const [state, setState] = useState("idle");
  const [msg, setMsg] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    const f = e.currentTarget;
    const email = f.email.value.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return setMsg("Please enter a valid email address.");
    if (!f.consent.checked) return setMsg("Please tick the box to agree to receive emails.");
    setState("sending"); setMsg("");
    const res = await sendEnquiry({ type: "subscription", service: "insights", serviceLabel: "Insights updates", routedTo: "GAA Group", name: email, company: "", email, phone: "", message: "Please send me new GAA Group insights.", consent: true, website: f.website.value, elapsedMs: 5000, page: window.location.href }).catch(() => ({ ok: false }));
    if (res.ok) { setState("done"); track("generate_lead", { service: "insights", routed_to: "GAA Group" }); }
    else { setState("idle"); setMsg(res.error || "We could not save your email right now. Please try again."); }
  };
  return (
    <section className="in-ntf">
      <div className="ff-in">
        <div className="in-ntf-box rv">
          <div>
            <span className="ff-eye">Newsletter</span>
            <h2 className="ff-h2">Get new articles by email.</h2>
            <p className="ff-p">Short, practical articles on law, tax, compliance and hiring changes that matter to your business. No spam, and you can unsubscribe any time.</p>
          </div>
          {state === "done" ? (
            <div className="in-ok"><Icon name="check" /><b>You're on the list.</b><span>We'll email you when new articles are published.</span></div>
          ) : (
            <form className="in-form" noValidate onSubmit={submit}>
              <div className="in-row">
                <label className="sr-only" htmlFor="inEmail">Your work email</label>
                <Icon name="mail" />
                <input id="inEmail" name="email" type="email" placeholder="Your work email" autoComplete="email" />
                <button type="submit" className="ff-btn pri" disabled={state === "sending"}>{state === "sending" ? "Saving..." : "Notify Me"} <Icon name="bell" /></button>
              </div>
              <input className="sr-only" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
              <label className="in-cn"><input type="checkbox" name="consent" /> I agree to receive emails about new insights, as described in the <Link to="/privacy">privacy notice</Link>.</label>
              {msg && <p className="in-err" role="alert">{msg}</p>}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}


function Posts({ company, q }) {
  const [state, setState] = useState({ loading: true, posts: [], total: 0, page: 1, error: "" });
  useEffect(() => {
    let live = true;
    setState((s) => ({ ...s, loading: true, error: "" }));
    const t = setTimeout(() => {
      listPosts({ company, q, page: 1, limit: 9 }).then((r) => {
        if (!live) return;
        setState(r.ok ? { loading: false, posts: r.posts || [], total: r.total || 0, page: 1, error: "" } : { loading: false, posts: [], total: 0, page: 1, error: r.error });
      });
    }, q ? 250 : 0);
    return () => { live = false; clearTimeout(t); };
  }, [company, q]);
  const more = () => listPosts({ company, q, page: state.page + 1, limit: 9 }).then((r) => {
    if (r.ok) setState((s) => ({ ...s, posts: [...s.posts, ...(r.posts || [])], page: s.page + 1 }));
  });
  if (state.loading && !state.posts.length) return <div className="bl-g">{[0, 1, 2].map((i) => <div key={i} className="bl-c sk" aria-hidden="true"><span className="bl-img" /><span className="bl-b"><i /><i /><i /></span></div>)}</div>;
  if (state.error) return <p className="bl-empty">Articles could not be loaded right now. Please try again later.</p>;
  if (!state.posts.length) return <p className="bl-empty">{q ? `No articles match “${q}”.` : "New articles are on their way."}</p>;
  const [first, ...rest] = state.posts;
  return (
    <>
      <div className="bl-g">
        <PostCard p={first} big />
        {rest.map((p) => <PostCard key={p.slug} p={p} />)}
      </div>
      {state.posts.length < state.total && <div className="bl-more"><button type="button" className="ff-btn" onClick={more}>Load More Articles <Icon name="arrow" /></button></div>}
    </>
  );
}

export default function Insights() {
  const { hash } = useRouter();
  const [company, setCompany] = useState("");
  const [q, setQ] = useState("");
  useReveal(".rv");
  useEffect(() => {
    const h = (hash || "").replace("#", "");
    if (FILTERS.some(([k]) => k && k === h)) setCompany(h);
  }, [hash]);
  const go = () => {
    const el = document.getElementById("articles");
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: "smooth" });
  };

  return (
    <main className="inx" id="top">
      <section className="in-hero">
        <div className="in-glow" aria-hidden="true" />
        <div className="ff-in in-hero-in">
          <div className="in-hero-l">
            <nav className="sv-bc" aria-label="Breadcrumb"><Link to="/">Home</Link><span>/</span><b>Insights</b></nav>
            <span className="ff-eye">GAA Group Insights</span>
            <h1 className="ff-h1"><span>Law, tax, compliance and hiring,</span><span>made <em className="hw-o">clear.</em></span></h1>
            <p className="in-p">Practical articles from GAA Consulting, Filings First and Hirings First for founders, finance teams and HR leaders, plus a planner with the compliance due dates that matter.</p>
            <form className="in-srch" role="search" onSubmit={(e) => { e.preventDefault(); go(); }}>
              <Icon name="search" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search articles, for example GST, FEMA or hiring" aria-label="Search articles" />
              <button type="submit" aria-label="Search"><Icon name="arrow" /></button>
            </form>
            <div className="in-pop"><span>By company:</span>{FILTERS.slice(1).map(([k, v]) => <button key={k} type="button" onClick={() => { setCompany(k); go(); }}>{v}</button>)}</div>
          </div>
          <div className="in-hero-r">
            <div className="in-due">
              <div className="in-due-h"><span><Icon name="clock" />Due next</span><Link to="#planner">Full planner <Icon name="arrow" /></Link></div>
              <DueSoon n={4} />
            </div>
          </div>
        </div>
      </section>

      <section className="ff-sec bl" id="articles">
        <div className="ff-in">
          <div className="ff-hd">
            <div><span className="ff-eye">Latest articles</span><h2 className="ff-h2">From our teams.</h2></div>
            <div className="bl-tabs" role="tablist" aria-label="Filter by company">
              {FILTERS.map(([k, v]) => <button key={k || "all"} type="button" role="tab" aria-selected={company === k} className={company === k ? "on" : ""} onClick={() => setCompany(k)}>{v}</button>)}
            </div>
          </div>
          <Posts company={company} q={q.trim()} />
        </div>
      </section>

      <section className="ff-sec in-plan" id="planner">
        <div className="ff-in">
          <div className="ff-hd">
            <div><span className="ff-eye">Due date planner</span><h2 className="ff-h2"><span>Every usual due date,</span><span>month by month.</span></h2></div>
            <p className="ff-p">Pick a month and a category to see the GST, TDS, income tax, payroll and ROC dates that usually fall due. Dates that have already passed are marked.</p>
          </div>
          <Planner />
        </div>
      </section>

      <Notify />
    </main>
  );
}
