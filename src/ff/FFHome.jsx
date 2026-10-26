import React, { useMemo } from "react";
import { Link } from "../group/router.jsx";
import { FFPage, CtaBand, Icon, BASE, CONTACT } from "./FFLayout.jsx";
import { FF, SERVICES, STEPS, CALENDAR, MONTHLY, TYPES, MONTHS } from "./ffData.js";

const MON = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };

// Next fixed-date deadlines from today, mixing the annual calendar and monthly filings
export function nextDeadlines(n = 4) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const items = [];
  CALENDAR.filter((c) => /^\d{1,2} [A-Z][a-z]{2}$/.test(c.d)).forEach((c) => {
    const [d, m] = c.d.split(" ");
    let dt = new Date(now.getFullYear(), MON[m], +d);
    if (dt < now) dt = new Date(now.getFullYear() + 1, MON[m], +d);
    items.push({ ...c, dt });
  });
  MONTHLY.forEach((c) => {
    const day = parseInt(c.d, 10);
    let dt = new Date(now.getFullYear(), now.getMonth(), day);
    if (dt < now) dt = new Date(now.getFullYear(), now.getMonth() + 1, day);
    items.push({ ...c, dt });
  });
  return items.sort((a, b) => a.dt - b.dt).slice(0, n);
}
const fmt = (dt) => dt.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

export function YearRibbon() {
  const byMonth = useMemo(() => MONTHS.map((_, i) => CALENDAR.filter((c) => c.m === i)), []);
  const order = [3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2]; // financial year: Apr to Mar
  return (
    <div className="f-ribbon" role="img" aria-label="Key filings across the financial year from April to March">
      {order.map((m) => (
        <div className="f-rmonth" key={m}>
          <span className="f-rm">{MONTHS[m]}</span>
          <div className="f-rdots">
            {byMonth[m].map((c) => (
              <span key={c.f + c.d} className="f-rdot" style={{ "--c": TYPES[c.t].color }} title={`${c.d}: ${c.f}`}>
                <em>{c.f}</em>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function Legend() {
  return (
    <ul className="f-legend">
      {Object.entries(TYPES).map(([k, t]) => (
        <li key={k}><i style={{ background: t.color }}></i>{t.label}</li>
      ))}
    </ul>
  );
}

export default function FFHome() {
  const next = nextDeadlines(4);
  const today = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  return (
    <FFPage>
      <section className="f-hero">
        <div className="f-w f-hero-in">
          <div className="f-hero-l">
            <span className="f-eb">Accounting · Taxation · Compliance</span>
            <h1>Your filings, <span>first.</span></h1>
            <p>{FF.blurb}</p>
            <div className="f-acts">
              <Link to={CONTACT} className="f-btn f-primary">Get compliant</Link>
              <Link to={`${BASE}#services`} className="f-btn f-line">Explore services</Link>
            </div>
          </div>
          <aside className="f-due" aria-label="Upcoming due dates">
            <div className="f-due-h">
              <span><Icon name="cal" size={18} /> Next due dates</span>
              <small>as of {today}</small>
            </div>
            <ol>
              {next.map((c) => (
                <li key={c.f + c.dt}>
                  <b>{fmt(c.dt)}</b>
                  <div>
                    <span className="f-chip" style={{ "--c": TYPES[c.t].color }}>{TYPES[c.t].label}</span>
                    <strong>{c.f}</strong>
                    <span>{c.w}</span>
                  </div>
                </li>
              ))}
            </ol>
            <Link to={`${BASE}/compliance-calendar`} className="f-due-f">See the full calendar →</Link>
          </aside>
        </div>
      </section>

      <section className="f-facts" aria-label="Filings First at a glance">
        <div className="f-w">
          <dl>
            <div><dt>{FF.since}</dt><dd>Serving businesses since</dd></div>
            <div><dt>6</dt><dd>Core services under one plan</dd></div>
            <div><dt>1</dt><dd>Shared calendar for every filing</dd></div>
            <div><dt>Pan-India</dt><dd>Support for businesses across India</dd></div>
          </dl>
        </div>
      </section>

      <section className="f-sec" id="services" aria-labelledby="f-svc-h">
        <div className="f-w">
          <div className="f-sec-h">
            <span className="f-eb">What we do</span>
            <h2 id="f-svc-h">Everything your books and filings need.</h2>
          </div>
          <div className="f-svcs">
            {SERVICES.map((s, i) => (
              <Link key={s.slug} to={`${BASE}/services/${s.slug}`} className="f-svc">
                <span className="f-svc-ic"><Icon name={s.icon} /></span>
                <span className="f-svc-n">0{i + 1}</span>
                <h3>{s.name}</h3>
                <p>{s.short}</p>
                <span className="f-more">Learn more <Icon name="arrow" size={16} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="f-sec f-alt" aria-labelledby="f-year-h">
        <div className="f-w">
          <div className="f-sec-h f-row">
            <div>
              <span className="f-eb">Your compliance year</span>
              <h2 id="f-year-h">Twelve months. Every filing mapped.</h2>
            </div>
            <Legend />
          </div>
          <YearRibbon />
          <div className="f-monthly">
            <b>Every month</b>
            {MONTHLY.map((c) => (
              <span key={c.f}><i style={{ background: TYPES[c.t].color }}></i>{c.d}: {c.f}</span>
            ))}
            <Link to={`${BASE}/compliance-calendar`}>Full calendar →</Link>
          </div>
        </div>
      </section>

      <section className="f-sec" aria-labelledby="f-how-h">
        <div className="f-w">
          <div className="f-sec-h">
            <span className="f-eb">How it works</span>
            <h2 id="f-how-h">A calendar you can rely on.</h2>
          </div>
          <ol className="f-steps">
            {STEPS.map(([t, d], i) => (
              <li key={t}>
                <span className="f-step-n">{i + 1}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaBand />
    </FFPage>
  );
}
