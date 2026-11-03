import React from "react";
import { Link } from "../../router";
import { HF_NAV, HF_DATA } from "../../site";
import TEAM from "../../data/team.json";
import Icon from "../../components/Icon";
import useReveal from "../../lib/useReveal";

const WHY = [
  { title: "We listen first", text: "Every search starts with a proper brief, so we look for the person you actually need." },
  { title: "Screened, not forwarded", text: "We speak to every candidate before you see a profile, and tell you why they fit." },
  { title: "Hiring and HR together", text: "One team helps you hire the right people and set up the HR that keeps them." },
  { title: "Part of GAA Group", text: "Payroll and compliance with Filings First, and legal advice with GAA Consulting." },
];

const FACES = (() => {
  const hf = TEAM.filter((p) => p.company === "Hirings First");
  const rest = TEAM.filter((p) => p.company !== "Hirings First");
  return [...hf, ...rest].slice(0, 6);
})();

export default function HiringsHome() {
  useReveal(".rv");
  const ta = HF_DATA["talent-acquisition"];
  return (
    <main className="hfh" id="top">
      <section className="hfh-hero">
        <div className="hf-blob" aria-hidden="true" />
        <div className="ff-in hfh-hero-in">
          <div className="hf-hero-l">
            <span className="hf-tag"><i />Hirings First · Talent &amp; people</span>
            <h1 className="ff-h1"><span>Great teams start</span><span>with the right <em className="hw-o">hire.</em></span></h1>
            <p className="hf-lead">Hirings First helps growing businesses find the right people and run the people operations that keep them: recruitment for business and leadership roles, and HR policies, processes and compliance.</p>
            <div className="ff-btns">
              <Link className="ff-btn pri" to="/contact#hirings-first">Talk to Hirings First <Icon name="arrow" /></Link>
              <Link className="ff-btn" to="#services">Our Services <Icon name="arrow" /></Link>
            </div>
            <ul className="hf-stats"><li><Icon name="check" />Business and leadership roles</li><li><Icon name="check" />HR set up and run for you</li></ul>
          </div>
          <div className="hfh-ph" aria-hidden="true">
            {FACES.map((p, i) => <figure key={p.name} style={{ "--k": i }}><img src={p.photo} alt="" /></figure>)}
            <div className="hfh-badge"><img src="/images/hirings-first-mark.webp" alt="" /><span><b>Hirings First</b><small>A GAA Group company</small></span></div>
          </div>
        </div>
      </section>
      <div className="hf-tick" aria-hidden="true">
        <div>{[0, 1].map((k) => <span key={k}>{ta.tabs.flatMap((t) => t.items.slice(0, 2)).map((x) => <React.Fragment key={x}>{x}<i>✦</i></React.Fragment>)}</span>)}</div>
      </div>

      <section className="ff-sec" id="services">
        <div className="ff-in">
          <div className="ff-hd">
            <div><span className="ff-eye">Our services</span><h2 className="ff-h2"><span>Hire well.</span><span>Then look after them well.</span></h2></div>
            <p className="ff-p">Two services that work on their own or together, from the first job post to the HR that runs every month.</p>
          </div>
          <div className="hfh-two">
            {HF_NAV.map((s) => (
              <Link key={s.slug} to={s.path} className="hfh-sv rv">
                <span className="ff-ic"><Icon name={s.icon} /></span>
                <h3>{s.name}</h3>
                <p>{HF_DATA[s.slug].lead}</p>
                <ul>{HF_DATA[s.slug].offer.slice(0, 4).map((o) => <li key={o.title}><Icon name="check" />{o.title}</li>)}</ul>
                <span className="ff-lk">Explore {s.name} <Icon name="arrow" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="ff-sec hfh-why">
        <div className="ff-in">
          <div className="ff-hd c">
            <span className="ff-eye c">Why Hirings First</span>
            <h2 className="ff-h2">People you'll be glad you hired.</h2>
          </div>
          <div className="hfh-why-g">
            {WHY.map((w, i) => (
              <article className="hfh-why-c rv" key={w.title}><b>{String(i + 1).padStart(2, "0")}</b><h3>{w.title}</h3><p>{w.text}</p></article>
            ))}
          </div>
        </div>
      </section>

      <section className="ff-sec hf-proc">
        <div className="ff-in">
          <div className="ff-hd c">
            <span className="ff-eye c">How hiring works</span>
            <h2 className="ff-h2">From brief to first day.</h2>
          </div>
          <ol className="hp-g hfh-steps">
            {ta.steps.slice(0, 4).map((s, i) => (
              <li className="rv" key={s.title} style={{ transitionDelay: `${i * 0.08}s` }}>
                <span className="hp-n">{String(i + 1).padStart(2, "0")}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
