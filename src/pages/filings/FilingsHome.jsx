import React from "react";
import { Link } from "../../router";
import { FF_NAV as SERVICE_NAV, FF_DATA as SERVICE_DATA, GROUP } from "../../site";
import Icon from "../../components/Icon";
import DueSoon from "../../components/DueSoon";
import useReveal from "../../lib/useReveal";

const WHY = [
  { icon: "clock", title: "Deadline-first working", text: "Every client gets a compliance calendar. We work back from each due date, not up to it." },
  { icon: "check", title: "Reconciled before it's filed", text: "Returns are prepared from reconciled books, so the numbers still hold when someone checks them." },
  { icon: "user", title: "One accountable team", text: "A named team owns your books, tax and filings, and you always know who to call." },
  { icon: "layers", title: "Connected to GAA Group", text: "Legal advice from GAA Consulting and hiring support from Hirings First, when you need them." },
];

const STEPS = [
  { title: "Talk to us", text: "A short call to understand your business, your current setup and what is pending." },
  { title: "Fixed scope and fee", text: "You receive a written proposal with the scope, timelines and fee agreed upfront." },
  { title: "Onboarding", text: "We take over your books and filings, fix gaps and set up your compliance calendar." },
  { title: "Every month, on time", text: "Books updated, returns filed and a clear report, month after month." },
];

const WHO = ["Startups", "Private limited companies", "LLPs and partnership firms", "Small and medium businesses", "E-commerce and D2C brands", "Professional firms", "Indian subsidiaries of foreign companies", "Founders and directors"];

export default function Home() {
  useReveal(".rv");
  return (
    <div className="hm2"><main className="hm2" id="top">
      {/* 1. hero */}
      <section className="hh">
        <div className="hh-bg" aria-hidden="true"><i /><i /><i /></div>
        <div className="ff-in hh-in">
          <div className="hh-l">
            <span className="ff-eye">Accounting · Tax · Startup compliance</span>
            <h1 className="ff-h1 hh-h1"><span>Books, tax and filings.</span><span>Handled <em className="hw-o">first.</em></span></h1>
            <p className="hh-p">Filings First keeps your accounts current, your tax returns on time and your company compliant, so you can spend your time on the business, not on deadlines.</p>
            <div className="ff-btns">
              <Link className="ff-btn pri" to="/contact#filings-first">Request a Proposal <Icon name="arrow" /></Link>
              <Link className="ff-btn" to="#services">Explore Services <Icon name="arrow" /></Link>
            </div>
          </div>
          <div className="hh-r">
            <div className="hh-card">
              <span className="hh-k">What can we take off your plate?</span>
              <div className="ff-rows">
                {SERVICE_NAV.map((s, i) => (
                  <Link key={s.slug} className={`ff-row hh-row${i === 0 ? " cur" : ""}`} to={s.path} style={{ "--k": i }}>
                    <span><b>{s.name}</b><p>{s.short}</p></span>
                    <Icon name="arrow" />
                  </Link>
                ))}
              </div>
              <div className="hh-card-f"><Icon name="shield" />Part of GAA Group, Bengaluru</div>
            </div>
          </div>
        </div>
        <div className="hh-strip">
          <div className="ff-in hh-strip-in">
            <span><Icon name="book" />Books closed every month</span>
            <span><Icon name="clock" />Filed before the due date</span>
            <span><Icon name="calc" />GST, TDS and income tax</span>
            <span><Icon name="building" />ROC and startup compliance</span>
          </div>
        </div>
      </section>

      {/* 2. services */}
      <section className="ff-sec hs" id="services">
        <div className="ff-in">
          <div className="ff-hd">
            <div><span className="ff-eye">Our services</span><h2 className="ff-h2"><span>Three services.</span><span>Every routine filing covered.</span></h2></div>
            <p className="ff-p">Take one service or all three. They are designed to work together, so your books, tax and company filings always agree.</p>
          </div>
          <div className="hs-g">
            {SERVICE_NAV.map((s, i) => (
              <Link key={s.slug} to={s.path} className="hs-c rv">
                <div className="hs-top"><span className="ff-ic"><Icon name={s.icon} /></span><span className="hs-n">{String(i + 1).padStart(2, "0")}</span></div>
                <h3>{s.name}</h3>
                <p>{s.short}</p>
                <ul>{SERVICE_DATA[s.slug].scope.slice(0, 4).map((c) => <li key={c.title}><Icon name="check" />{c.title}</li>)}</ul>
                <span className="ff-lk">Explore service <Icon name="arrow" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. why */}
      <section className="ff-sec hw2">
        <div className="ff-in hw2-in">
          <div className="hw2-l">
            <span className="ff-eye">Why Filings First</span>
            <h2 className="ff-h2"><span>Compliance that runs</span><span>like clockwork.</span></h2>
            <p className="ff-p">Most compliance problems come from things that were left to the last day. We are set up to do the opposite.</p>
            <div className="hw2-q">
              <Icon name="quote" />
              <p>Our job is simple to describe: the right numbers, filed on time, with no surprises later.</p>
              <span>Our promise to every client</span>
            </div>
          </div>
          <div className="hw2-g">
            {WHY.map((w, i) => (
              <article className="hw2-c rv" key={w.title}>
                <span className="hw2-n">{String(i + 1).padStart(2, "0")}</span>
                <span className="ff-ic"><Icon name={w.icon} /></span>
                <h3>{w.title}</h3>
                <p>{w.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. due soon */}
      <section className="ff-sec hd">
        <div className="ff-in hd-in">
          <div className="hd-l">
            <span className="ff-eye">Coming up</span>
            <h2 className="ff-h2"><span>The next due dates,</span><span>worked out for today.</span></h2>
            <p className="ff-p">Here are the next statutory due dates that apply to many businesses. Our clients don't need to remember them: they are already on our calendar.</p>
            <div className="ff-btns">
              <Link className="ff-btn dk" to="/insights#planner">Open the Due Date Planner <Icon name="arrow" /></Link>
            </div>
            <small className="hd-note">Usual due dates. The government can change or extend them.</small>
          </div>
          <div className="hd-r rv"><DueSoon n={5} /></div>
        </div>
      </section>

      {/* 5. process */}
      <section className="ff-sec hp">
        <div className="ff-in">
          <div className="ff-hd c">
            <span className="ff-eye c">How it works</span>
            <h2 className="ff-h2">From first call to filed returns.</h2>
          </div>
          <ol className="hp-g">
            {STEPS.map((s, i) => (
              <li className="rv" key={s.title} style={{ transitionDelay: `${i * 0.08}s` }}>
                <span className="hp-n">{String(i + 1).padStart(2, "0")}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
          <div className="hp-who rv">
            <span className="hp-k">We work with</span>
            <div className="hp-mq"><div>{[...WHO, ...WHO].map((w, i) => <span key={i} aria-hidden={i >= WHO.length}>{w}<i /></span>)}</div></div>
          </div>
        </div>
      </section>

      {/* 6. GAA Group */}
      <section className="ff-sec hg">
        <div className="ff-in">
          <div className="ff-hd">
            <div><span className="ff-eye">Part of GAA Group</span><h2 className="ff-h2"><span>One group behind</span><span>every part of your business.</span></h2></div>
            <p className="ff-p">Filings First works alongside GAA Consulting and Hirings First. When your work needs more than one of us, one team coordinates it for you.</p>
          </div>
          <div className="hg-g">
            {[
              { ...GROUP.consulting, text: "Corporate legal, regulatory and transaction advisory.", ext: true },
              { ...GROUP.filings, text: "Accounting, tax and startup compliance. You are here.", here: true },
              { ...GROUP.hirings, text: "Recruitment, staffing and HR solutions.", ext: true },
            ].map((c) => {
              const inner = (
                <>
                  <span className="hg-logo"><img src={c.img} alt="" loading="lazy" /></span>
                  <small>{c.tag}</small>
                  <h3>{c.name}</h3>
                  <p>{c.text}</p>
                  <span className="ff-lk">{c.here ? "Explore our services" : `Visit ${c.name}`} <Icon name="arrow" /></span>
                </>
              );
              return c.here ? (
                <Link key={c.name} to="/filings-first#services" className="hg-c here rv">{inner}</Link>
              ) : (
                <a key={c.name} href={c.url} className="hg-c rv">{inner}</a>
              );
            })}
          </div>
        </div>
      </section>
    </main></div>
  );
}
