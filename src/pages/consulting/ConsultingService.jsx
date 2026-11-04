import React from "react";
import { Link } from "../../router";
import { CONSULTING_DATA as SERVICE_DATA } from "../../site";
import Icon from "../../components/Icon";
import Lines from "../../components/Lines";
import Hl from "../../components/Hl";
import Faq from "../../components/Faq";
import useReveal from "../../lib/useReveal";

const FEATURES = [
  ["hand", "End-to-end\nsupport"],
  ["team", "Single, accountable\nteam"],
  ["shield", "Regulatory expertise\nand practical execution"],
];

export default function ServicePage({ slug }) {
  const d = SERVICE_DATA[slug];
  const contact = `/contact#${d.contact}`;
  useReveal(".ie-card,.ie-st,.ie-plan,.ie-why-i,.ie-q,.ie-steps", [slug]);
  const n = (i) => String(i + 1).padStart(2, "0");

  return (
    <main className="ie" id="top">
      <section className="ie-hero no-quote">
        <div className="ie-hero-bg" aria-hidden="true">
          <img src={`/images/consulting/${slug}.webp`} alt="" fetchPriority="high" width="1774" height="887" />
        </div>
        <div className="ie-in ie-hero-in">
          <div className="ie-hero-l">
            <nav className="ie-bc" aria-label="Breadcrumb">
              <Link to="/">GAA Group</Link><span>&rsaquo;</span>
              <Link to="/gaa-consulting">GAA Consulting</Link><span>&rsaquo;</span>
              <b>{d.name}</b>
            </nav>
            <span className="ie-eye">{d.name}</span>
            <h1 className="ie-h1"><Hl text={d.h1} word={d.hl} /></h1>
            <p className="ie-lead">{d.lead}</p>
            <div className="ie-btns">
              <Link className="ie-btn pri" to={contact}>{d.cta} <Icon name="arrow" /></Link>
            </div>
            <div className="ie-feats">
              {FEATURES.map(([icon, text]) => (
                <span key={icon}><Icon name={icon} /><Lines text={text} /></span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="ie-sec ie-jr">
        <div className="ie-in">
          <span className="ie-eye">{d.journeyEyebrow}</span>
          <h2 className="ie-h2">{d.journeyTitle}</h2>
          <ol className="ie-steps">
            {d.steps.map((s, i) => (
              <li className="ie-st" key={s.title}>
                <div className="ie-st-h"><span className="ie-n">{n(i)}</span><Icon name={s.icon} /></div>
                <b>{s.title}</b>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="ie-sec ie-svc" id="services">
        <div className="ie-in"><div className="ie-panel">
          <span className="ie-eye">Our services</span>
          <h2 className="ie-h2">{d.servicesTitle}</h2>
          <p className="ie-p">Choose individual services or a comprehensive solution. Our team supports you from incorporation to ongoing operations.</p>
          <div className="ie-cards">
            {d.services.map((c, i) => (
              <article className="ie-card" key={c.title}>
                <span className="ie-ic"><Icon name={c.icon} /></span>
                <div>
                  <h3><span>{n(i)}.</span> {c.title}</h3>
                  <p>{c.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div></div>
      </section>

      <section className="ie-sec ie-eng">
        <div className="ie-in"><div className="ie-panel">
          <div className="ie-2 ie-eng-h">
            <div><span className="ie-eye">Engagement options</span><h2 className="ie-h2">Flexible engagement options<br />to suit your requirements.</h2></div>
            <p className="ie-p">Choose an individual service or an end-to-end solution.<br />We will tailor the scope based on your business, industry and plans.</p>
          </div>
          <div className="ie-plans">
            {d.plans.map((p) => (
              <article className={`ie-plan${p.popular ? " pop" : ""}`} key={p.title}>
                {p.popular && <span className="ie-pop">Most Popular</span>}
                <Icon name={p.icon} />
                <h3>{p.title}</h3>
                <span className="ie-sub">{p.subtitle}</span>
                <ul>{p.points.map((x) => <li key={x}><Icon name="check" />{x}</li>)}</ul>
                <Link className={`ie-btn${p.popular ? " pri" : ""}`} to={contact}>Discuss This Option <Icon name="arrow" /></Link>
              </article>
            ))}
          </div>
        </div></div>
      </section>

      <section className="ie-sec ie-why">
        <div className="ie-in ie-why-in">
          <div><span className="ie-eye">Why GAA</span><h2 className="ie-h2"><Lines text={d.whyTitle} /></h2></div>
          <div className="ie-why-g">
            {d.why.map((w) => <div className="ie-why-i" key={w.text}><Icon name={w.icon} /><span>{w.text}</span></div>)}
          </div>
        </div>
      </section>

      <section className="ie-sec ie-who">
        <div className="ie-in ie-2">
          <div>
            <span className="ie-eye">Who we work with</span>
            <h2 className="ie-h2"><Lines text={d.whoTitle} /></h2>
            <p className="ie-p">{d.whoText}</p>
          </div>
          <ul className="ie-checks">
            {d.who.map((w) => <li key={w}><Icon name="check" />{w}</li>)}
          </ul>
        </div>
      </section>

      <Faq faq={d.faq} title={d.faqTitle} contact={contact} company="the GAA Consulting team" />

      <section className="ie-sec ie-focus">
        <div className="ie-in"><div className="ie-dark">
          <div className="ie-dark-top">
            <div className="ie-dark-l">
              <span className="ie-tag">Service focus</span>
              <h2><Lines text={d.focus.title} /></h2>
              <p>{d.focus.text}</p>
              <div className="ie-btns">
                <Link className="ie-btn pri" to={contact}>Discuss This Service <Icon name="arrow" /></Link>
              </div>
            </div>
            <div className="ie-dark-r" aria-hidden="true">
              <div className="ie-lap">
                <div className="ie-scr">
                  <div className="ie-scr-h"><b>{d.focus.screen.title}</b><span>Today</span></div>
                  <div className="ie-scr-k">
                    <span><small>{d.focus.screen.k1}</small><b>{d.focus.screen.v1}</b></span>
                    <span><small>{d.focus.screen.k2}</small><b>{d.focus.screen.v2}</b></span>
                  </div>
                  <svg viewBox="0 0 300 90">
                    <path d="M0 70 C40 60 60 30 100 40 S160 75 200 45 S260 15 300 25" fill="none" stroke="#F08A5D" strokeWidth="3" />
                    <path d="M0 70 C40 60 60 30 100 40 S160 75 200 45 S260 15 300 25 V90 H0Z" fill="rgba(240,138,93,.18)" />
                  </svg>
                  <div className="ie-scr-r">{d.focus.screen.chips.map((c) => <span key={c}>{c}</span>)}</div>
                </div>
                <div className="ie-base" />
              </div>
            </div>
          </div>
          <div className="ie-dark-f">
            {d.focus.features.map((f) => <span key={f.text}><Icon name={f.icon} /><em className="ie-ft"><Lines text={f.text} /></em></span>)}
          </div>
        </div></div>
      </section>
    </main>
  );
}
