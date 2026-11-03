import React, { useEffect, useRef, useState } from "react";
import { Link } from "../../router";
import { HF_DATA, HF_NAV } from "../../site";
import Icon from "../../components/Icon";
import Hl from "../../components/Hl";
import Faq from "../../components/Faq";
import useReveal from "../../lib/useReveal";

const n2 = (i) => String(i + 1).padStart(2, "0");

/* Hero visual for Talent Acquisition: candidates moving through a hiring pipeline */
const STAGES = ["Sourced", "Screened", "Interview", "Offer"];
const PEOPLE = [["AK", "Finance manager"], ["RS", "Company secretary"], ["MP", "Sales lead"], ["DN", "Accounts executive"], ["SV", "HR manager"], ["TJ", "Developer"], ["PL", "Operations head"]];
function Pipeline() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const t = setInterval(() => setTick((x) => x + 1), 1800);
    return () => clearInterval(t);
  }, []);
  /* each person sits in a column that advances over time */
  const col = (i) => Math.min(3, Math.floor(((tick + i * 2) % 12) / 3));
  return (
    <div className="hf-pipe" aria-hidden="true">
      <div className="hf-pipe-h"><b>Hiring pipeline</b><span><i />Live</span></div>
      <div className="hf-cols">
        {STAGES.map((s, k) => (
          <div className="hf-col" key={s}>
            <small>{s}<em>{PEOPLE.filter((_, i) => col(i) === k).length}</em></small>
            {PEOPLE.map(([a, r], i) => col(i) === k && (
              <div className={`hf-cd${k === 3 ? " win" : ""}`} key={a}>
                <span className="hf-av">{a}</span><span><b>{r}</b><i>{k === 3 ? "Offer sent" : k === 2 ? "Round 2" : k === 1 ? "Shortlisted" : "Profile in"}</i></span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* Hero visual for Workforce & HR: the employee lifecycle */
const LIFE = [["user", "Hire"], ["doc", "Onboard"], ["calc", "Pay"], ["bars", "Grow"], ["shield", "Comply"], ["infinity", "Retain"]];
function Lifecycle() {
  const [cur, setCur] = useState(0);
  useEffect(() => {
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const t = setInterval(() => setCur((x) => (x + 1) % LIFE.length), 1600);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="hf-life" aria-hidden="true">
      <div className="hf-ring" style={{ "--a": `${cur * 60}deg` }}><i /></div>
      {LIFE.map(([ic, t], i) => (
        <span key={t} className={`hf-node${i === cur ? " on" : ""}`} style={{ "--i": i }}><Icon name={ic} /><b>{t}</b></span>
      ))}
      <div className="hf-core"><img src="/images/hirings-first-mark.webp" alt="" /><small>People operations</small><b>{LIFE[cur][1]}</b></div>
    </div>
  );
}

/* scroll progress for the process timeline */
function useProgress(ref) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const on = () => {
      const el = ref.current; if (!el) return;
      const r = el.getBoundingClientRect(); const vh = window.innerHeight;
      setP(Math.max(0, Math.min(1, (vh * 0.6 - r.top) / r.height)));
    };
    on(); window.addEventListener("scroll", on, { passive: true }); window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); };
  }, [ref]);
  return p;
}

export default function HiringsService({ slug }) {
  const d = HF_DATA[slug];
  const contact = `/contact#${d.contact}`;
  const [tab, setTab] = useState(0);
  const [mode, setMode] = useState(1);
  const tl = useRef(null);
  const prog = useProgress(tl);
  useReveal(".rv", [slug]);
  useEffect(() => { setTab(0); setMode(1); }, [slug]);

  return (
    <main className="hf" id="top">
      {/* 1. hero */}
      <section className="hf-hero">
        <div className="hf-blob" aria-hidden="true" />
        <div className="ff-in hf-hero-in">
          <div className="hf-hero-l">
            <nav className="sv-bc" aria-label="Breadcrumb"><Link to="/">GAA Group</Link><span>/</span><Link to="/hirings-first">Hirings First</Link><span>/</span><b>{d.name}</b></nav>
            <span className="hf-tag"><i />Hirings First · {d.name}</span>
            <h1 className="ff-h1"><Hl text={d.h1.join("\n")} word={d.hl} lines /></h1>
            <p className="hf-lead">{d.lead}</p>
            <div className="ff-btns">
              <Link className="ff-btn pri" to={contact}>{d.cta} <Icon name="arrow" /></Link>
              <Link className="ff-btn" to="#offer">What We Do <Icon name="arrow" /></Link>
            </div>
            <ul className="hf-stats">{d.stats.map((s) => <li key={s}><Icon name="check" />{s}</li>)}</ul>
          </div>
          <div className="hf-hero-r">{d.visual === "pipeline" ? <Pipeline /> : <Lifecycle />}</div>
        </div>
        <div className="hf-tick" aria-hidden="true">
          <div>{[0, 1].map((k) => <span key={k}>{d.tabs.flatMap((t) => t.items.slice(0, 2)).map((x) => <React.Fragment key={x}>{x}<i>✦</i></React.Fragment>)}</span>)}</div>
        </div>
      </section>

      {/* 2. what we do: bento */}
      <section className="ff-sec hf-offer" id="offer">
        <div className="ff-in">
          <div className="ff-hd">
            <div><span className="ff-eye">What we do</span><h2 className="ff-h2">{d.offerTitle}</h2></div>
            <p className="ff-p">{d.offerText}</p>
          </div>
          <div className="hf-bento">
            {d.offer.map((o, i) => (
              <div key={o.title} className={`hf-bx hf-bx-st rv${o.big ? " big" : ""}`}>
                <span className="hf-bx-n">{n2(i)}</span>
                <span className="ff-ic"><Icon name={o.icon} /></span>
                <h3>{o.title}</h3>
                <p>{o.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. tabs */}
      <section className="ff-sec hf-tabs">
        <div className="ff-in">
          <div className="ff-hd c">
            <span className="ff-eye c">{d.visual === "pipeline" ? "Roles" : "Coverage"}</span>
            <h2 className="ff-h2">{d.tabsTitle}</h2>
            <p className="ff-p">{d.tabsText}</p>
          </div>
          <div className="hf-tb" role="tablist" aria-label={d.tabsTitle}>
            {d.tabs.map((t, i) => (
              <button key={t.name} type="button" role="tab" aria-selected={i === tab} className={i === tab ? "on" : ""} onClick={() => setTab(i)}>{t.name}</button>
            ))}
          </div>
          <div className="hf-chips" role="tabpanel" key={tab}>
            {d.tabs[tab].items.map((x, i) => <span key={x} style={{ "--k": i }}><Icon name="check" />{x}</span>)}
          </div>
        </div>
      </section>

      {/* 4. process: vertical timeline */}
      <section className="ff-sec hf-proc">
        <div className="ff-in hf-proc-in">
          <div className="hf-proc-l">
            <div className="sv-sticky">
              <span className="ff-eye">How it works</span>
              <h2 className="ff-h2">Five clear steps,<br />one point of contact.</h2>
              <p className="ff-p">You will always know where things stand and what happens next.</p>
              <Link className="ff-btn pri" to={contact}>Start With a Short Call <Icon name="arrow" /></Link>
            </div>
          </div>
          <ol className="hf-tl" ref={tl} style={{ "--p": prog }}>
            <span className="hf-tl-line" aria-hidden="true"><i /></span>
            {d.steps.map((s, i) => (
              <li key={s.title} className={prog * d.steps.length > i ? "done" : ""}>
                <span className="hf-tl-n">{n2(i)}</span>
                <div><h3>{s.title}</h3><p>{s.text}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 5. ways to work: expanding panels */}
      <section className="ff-sec hf-modes">
        <div className="ff-in">
          <div className="ff-hd">
            <div><span className="ff-eye">Engagement options</span><h2 className="ff-h2">{d.modesTitle}</h2></div>
            <p className="ff-p">Every engagement starts with a written scope and fee. Hover or tap an option to see what's included.</p>
          </div>
          <div className="hf-acc">
            {d.modes.map((m, i) => (
              <article key={m.name} className={`hf-ac${i === mode ? " on" : ""}`} onMouseEnter={() => setMode(i)} onClick={() => setMode(i)} tabIndex={0} onFocus={() => setMode(i)}>
                <span className="hf-ac-n">{n2(i)}</span>
                <div className="hf-ac-v"><b>{m.name}</b></div>
                <div className="hf-ac-b">
                  <em>{m.tag}</em>
                  <h3>{m.name}</h3>
                  <p>{m.text}</p>
                  <ul>{m.points.map((p) => <li key={p}><Icon name="check" />{p}</li>)}</ul>
                  <Link className="ff-btn wh" to={contact}>Discuss This Option <Icon name="arrow" /></Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Faq faq={d.faq} title={"Good questions,\nstraight answers"} contact={contact} company="the Hirings First team" />

    </main>
  );
}
