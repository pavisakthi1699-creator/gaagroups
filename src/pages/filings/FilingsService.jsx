import React, { useEffect, useRef, useState } from "react";
import { Link } from "../../router";
import { FF_DATA as SERVICE_DATA, FF_NAV as SERVICE_NAV } from "../../site";
import Icon from "../../components/Icon";
import Hl from "../../components/Hl";
import Faq from "../../components/Faq";
import useReveal from "../../lib/useReveal";

const n2 = (i) => String(i + 1).padStart(2, "0");
const STATUS = (s) => (/done|filed|complete|tracked/i.test(s) ? "ok" : /review|progress|scheduled/i.test(s) ? "wip" : "due");

/* Animated status board shown in the hero */
function Board({ b }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <div className="sv-board" aria-hidden="true">
      <div className="sv-bd-h">
        <div><b>{b.title}</b><small>{b.sub}</small></div>
        <div className="sv-ring">
          <svg viewBox="0 0 80 80"><circle cx="40" cy="40" r={r} className="bg" /><circle cx="40" cy="40" r={r} className="fg" style={{ strokeDasharray: c, "--off": c * (1 - b.progress / 100), "--c": c }} /></svg>
          <span>{b.progress}%</span>
        </div>
      </div>
      <ul>
        {b.rows.map(([t, s], i) => (
          <li key={t} style={{ "--k": i }}>
            <span className={`sv-dot ${STATUS(s)}`}><Icon name={STATUS(s) === "ok" ? "check" : "clock"} /></span>
            <span className="sv-bd-t">{t}</span>
            <em className={STATUS(s)}>{s}</em>
          </li>
        ))}
      </ul>
      <div className="sv-bd-f"><Icon name="shield" /> {b.note}</div>
      <div className="sv-float"><Icon name="bell" /><span><b>Reminder sent</b><small>Next due date is on your calendar</small></span></div>
    </div>
  );
}

/* How we work: click a step, or let it move on by itself */
function Steps({ steps, slug }) {
  const [cur, setCur] = useState(0);
  const [auto, setAuto] = useState(true);
  const box = useRef(null);
  useEffect(() => setCur(0), [slug]);
  useEffect(() => {
    if (!auto) return undefined;
    if (typeof window !== "undefined" && window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    let visible = false;
    const io = "IntersectionObserver" in window ? new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.3 }) : null;
    if (io && box.current) io.observe(box.current);
    const t = setInterval(() => { if (visible && !document.hidden) setCur((c) => (c + 1) % steps.length); }, 5200);
    return () => { clearInterval(t); io && io.disconnect(); };
  }, [auto, steps.length]);
  const s = steps[cur];
  return (
    <div className={`sv-steps${auto ? " auto" : ""}`} ref={box}>
      <ol className="sv-tabs" role="tablist" aria-label="How we work">
        {steps.map((x, i) => (
          <li key={x.title}>
            <button type="button" role="tab" aria-selected={i === cur} className={i === cur ? "on" : i < cur ? "past" : ""} onClick={() => { setCur(i); setAuto(false); }}>
              <span className="sv-tn">{n2(i)}</span>
              <span className="sv-tt">{x.title}</span>
              <i className="sv-bar" key={i === cur ? `on${cur}` : "off"} />
            </button>
          </li>
        ))}
      </ol>
      <div className="sv-panel" role="tabpanel" key={cur}>
        <span className="sv-big" aria-hidden="true">{n2(cur)}</span>
        <span className="ff-eye">Step {n2(cur)} of {String(steps.length).padStart(2, "0")}</span>
        <h3>{s.title}</h3>
        <p>{s.text}</p>
        <div className="sv-gg">
          <div><small>You share</small><b>{s.give}</b></div>
          <div className="we"><small>We deliver</small><b>{s.get}</b></div>
        </div>
      </div>
    </div>
  );
}

export default function ServicePage({ slug }) {
  const d = SERVICE_DATA[slug];
  const contact = `/contact#${d.contact}`;
  const others = SERVICE_NAV.filter((s) => s.slug !== slug);
  useReveal(".rv", [slug]);

  return (
    <main className="sv" id="top">
      {/* 1. hero */}
      <section className="sv-hero">
        <div className="sv-grid" aria-hidden="true" />
        <div className="ff-in sv-hero-in">
          <div className="sv-hero-l">
            <nav className="sv-bc" aria-label="Breadcrumb">
              <Link to="/">GAA Group</Link><span>/</span><Link to="/filings-first">Filings First</Link><span>/</span><b>{d.name}</b>
            </nav>
            <span className="sv-pill"><Icon name={d.icon} />{d.eyebrow}</span>
            <h1 className="ff-h1 sv-h1"><Hl text={d.h1.join("\n")} word={d.hl} lines /></h1>
            <p className="sv-lead">{d.lead}</p>
            <div className="ff-btns">
              <Link className="ff-btn pri" to={contact}>{d.cta} <Icon name="arrow" /></Link>
              <Link className="ff-btn" to="#scope">{d.cta2 || "See What's Included"} <Icon name="arrow" /></Link>
            </div>
          </div>
          <div className="sv-hero-r"><Board b={d.board} /></div>
        </div>
        <div className="sv-strip">
          <div className="ff-in sv-strip-in">
            {d.promises.map((p) => <span key={p}><Icon name="check" />{p}</span>)}
            <span><Icon name={(d.promise4 || ["layers"])[0]} />{(d.promise4 || [0, "Part of GAA Group"])[1]}</span>
          </div>
        </div>
      </section>

      {/* 2. what's included */}
      <section className="ff-sec sv-scope" id="scope">
        <div className="ff-in sv-scope-in">
          <div className="sv-scope-l">
            <div className="sv-sticky">
              <span className="ff-eye">What's included</span>
              <h2 className="ff-h2">{d.scopeTitle.map((t) => <span key={t}>{t}</span>)}</h2>
              <p className="ff-p">{d.scopeText}</p>
              <Link className="ff-btn pri" to={contact}>Get a Fixed-Scope Proposal <Icon name="arrow" /></Link>
            </div>
          </div>
          <div className="ff-rows sv-list">
            {d.scope.map((c, i) => (
              <div className="ff-row ff-row-st rv" key={c.title}>
                <span className="ff-n">{n2(i)}</span>
                <span><b>{c.title}</b><p>{c.text}</p></span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. who it's for */}
      <section className="ff-sec sv-aud">
        <div className="ff-in">
          <div className="ff-hd">
            <div><span className="ff-eye">Who it's for</span><h2 className="ff-h2">{d.audienceTitle}</h2></div>
            <p className="ff-p">{d.audienceText || "If you recognise your business here, we already know the filings, the deadlines and the questions you will have."}</p>
          </div>
          <div className="sv-aud-g">
            {d.audience.map((a, i) => (
              <article className="sv-aud-c rv" key={a.title}>
                <span className="sv-aud-n">{n2(i)}</span>
                <span className="ff-ic"><Icon name={a.icon} /></span>
                <h3>{a.title}</h3>
                <p>{a.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. how we work */}
      <section className="ff-sec sv-how">
        <div className="ff-in">
          <div className="ff-hd c">
            <span className="ff-eye c">How we work</span>
            <h2 className="ff-h2">{d.howTitle || "Five steps. One accountable team."}</h2>
            <p className="ff-p">{d.howText || "You always know what we need from you, what you get back and who is looking after it."}</p>
          </div>
          <Steps steps={d.steps} slug={slug} />
        </div>
      </section>

      {/* 5. key dates */}
      <section className="ff-sec sv-dates">
        <div className="ff-in">
          <div className="ff-hd">
            <div><span className="ff-eye">Key dates we track</span><h2 className="ff-h2">{d.datesTitle}</h2>{d.datesText && <p className="ff-p" style={{ marginTop: 14, maxWidth: "46em" }}>{d.datesText}</p>}</div>
            <Link className="ff-lk" to="/insights#planner">Open the full due date planner <Icon name="arrow" /></Link>
          </div>
          <ol className="sv-tl">
            {d.dates.map((x, i) => (
              <li className="rv" key={x.title} style={{ transitionDelay: `${i * 0.05}s` }}>
                <span className="sv-tl-d">{x.day}</span>
                <i />
                <b>{x.title}</b>
                <p>{x.text}</p>
              </li>
            ))}
          </ol>
          <p className="sv-note"><Icon name="bell" />{d.datesNote}</p>
        </div>
      </section>

      {/* 6. engagement options */}
      <section className="ff-sec sv-plans">
        <div className="ff-in">
          <div className="ff-hd c">
            <span className="ff-eye c">Engagement options</span>
            <h2 className="ff-h2">{d.plansTitle}</h2>
            <p className="ff-p">{d.plansText || "Every engagement starts with a fixed scope and fee, agreed in writing. Start with one option and move up as you grow."}</p>
          </div>
          <div className="sv-mx rv" role="table" aria-label="Engagement options compared">
            <div className="sv-mx-r sv-mx-h" role="row">
              <span role="columnheader" className="sv-mx-k">What's covered</span>
              {d.plans.map((p, i) => (
                <span role="columnheader" key={p} className={i === d.popular ? "pop" : ""}>
                  {i === d.popular && d.popularLabel !== "" && <em>{d.popularLabel || "Most chosen"}</em>}
                  <b>{p}</b><small>{d.planSubs[i]}</small>
                </span>
              ))}
            </div>
            {d.matrix.map(([label, v]) => (
              <div className="sv-mx-r" role="row" key={label}>
                <span role="rowheader" className="sv-mx-k">{label}</span>
                {v.map((x, i) => (
                  <span role="cell" key={i} className={`${i === d.popular ? "pop " : ""}${x ? "y" : "n"}`}>
                    {x ? <Icon name="check" /> : <i aria-label="Not included" />}
                  </span>
                ))}
              </div>
            ))}
            <div className="sv-mx-r sv-mx-f" role="row">
              <span className="sv-mx-k" />
              {d.plans.map((p, i) => (
                <span key={p} className={i === d.popular ? "pop" : ""}>
                  <Link className={`ff-btn${i === d.popular ? " pri" : ""}`} to={contact}>{(d.planCtas || [])[i] || "Choose"} <Icon name="arrow" /></Link>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Faq faq={d.faq} title={"Answers before\nyou ask"} contact={contact} company="the Filings First team" />

      {d.closing && (
        <section className="sv-close">
          <div className="ff-in">
            <div className="sv-close-box rv">
              <div><h2 className="ff-h2">{d.closing.title}</h2><p className="ff-p">{d.closing.text}</p></div>
              <div className="ff-btns"><Link className="ff-btn pri" to={contact}>{d.closing.cta} <Icon name="arrow" /></Link><Link className="ff-btn" to="/contact">{d.closing.cta2} <Icon name="arrow" /></Link></div>
            </div>
          </div>
        </section>
      )}

      {/* 8. other services */}
      <section className="sv-more">
        <div className="ff-in">
          <div className="sv-more-box">
            <div><span className="ff-eye">More from Filings First</span><h2 className="ff-h2">One team for the rest of it too.</h2></div>
            <div className="ff-rows">
              {others.map((s) => (
                <Link key={s.slug} className="ff-row" to={s.path}>
                  <span><b>{s.name}</b><p>{s.short}</p></span>
                  <Icon name="arrow" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
