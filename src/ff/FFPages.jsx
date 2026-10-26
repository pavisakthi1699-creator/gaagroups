import React, { useState } from "react";
import { Link } from "../group/router.jsx";
import { FFPage, CtaBand, Icon, BASE, CONTACT } from "./FFLayout.jsx";
import { SERVICES, STEPS, CALENDAR, MONTHLY, TYPES, MONTHS, getService } from "./ffData.js";
import { Legend, YearRibbon } from "./FFHome.jsx";

export function FFService({ slug }) {
  const s = getService(slug) || SERVICES[0];
  const others = SERVICES.filter((x) => x.slug !== s.slug);
  return (
    <FFPage>
      <section className="f-shero">
        <div className="f-w">
          <nav className="f-crumbs" aria-label="Breadcrumb">
            <Link to={BASE}>Filings First</Link><i>/</i><Link to={`${BASE}#services`}>Services</Link><i>/</i><span aria-current="page">{s.name}</span>
          </nav>
          <div className="f-shero-in">
            <span className="f-svc-ic big"><Icon name={s.icon} size={32} /></span>
            <h1>{s.name}</h1>
            <p>{s.desc}</p>
            <div className="f-acts">
              <Link to={CONTACT} className="f-btn f-primary">Enquire about {s.name.toLowerCase()}</Link>
              <Link to={`${BASE}#services`} className="f-btn f-line">All services</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="f-sec">
        <div className="f-w f-detail">
          <div className="f-card">
            <span className="f-eb">What's included</span>
            <ul className="f-checks">
              {s.incl.map((x) => (
                <li key={x}><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 10 3 3 7-7" /></svg>{x}</li>
              ))}
            </ul>
          </div>
          <div className="f-card f-soft">
            <div>
              <span className="f-eb">Ideal for</span>
              <p className="f-big">{s.ideal}</p>
            </div>
            <div>
              <span className="f-eb">How often</span>
              <p className="f-big">{s.cadence}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="f-sec f-alt">
        <div className="f-w">
          <div className="f-sec-h"><span className="f-eb">How it works</span><h2>From onboarding to audit-ready.</h2></div>
          <ol className="f-steps">
            {STEPS.map(([t, d], i) => (
              <li key={t}><span className="f-step-n">{i + 1}</span><h3>{t}</h3><p>{d}</p></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="f-sec">
        <div className="f-w f-faqw">
          <div className="f-sec-h"><span className="f-eb">Questions</span><h2>Good to know.</h2></div>
          <div className="f-faq">
            {s.faqs.map(([q, a]) => (
              <details key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="f-sec f-alt">
        <div className="f-w">
          <div className="f-sec-h"><span className="f-eb">Other services</span><h2>Often taken together.</h2></div>
          <div className="f-svcs f-compact">
            {others.map((o) => (
              <Link key={o.slug} to={`${BASE}/services/${o.slug}`} className="f-svc">
                <span className="f-svc-ic"><Icon name={o.icon} /></span>
                <h3>{o.name}</h3>
                <p>{o.short}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <CtaBand title={`Talk to us about ${s.name.toLowerCase()}.`} />
    </FFPage>
  );
}

export function FFCalendar() {
  const [type, setType] = useState("all");
  const order = [3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2];
  const rows = CALENDAR.filter((c) => type === "all" || c.t === type);
  return (
    <FFPage>
      <section className="f-shero">
        <div className="f-w">
          <nav className="f-crumbs" aria-label="Breadcrumb">
            <Link to={BASE}>Filings First</Link><i>/</i><span aria-current="page">Compliance calendar</span>
          </nav>
          <div className="f-shero-in">
            <span className="f-svc-ic big"><Icon name="cal" size={32} /></span>
            <h1>Compliance calendar</h1>
            <p>Key GST, income tax, TDS and ROC due dates for a business with a 31 March year end.</p>
          </div>
        </div>
      </section>
      <section className="f-sec">
        <div className="f-w">
          <YearRibbon />
          <div className="f-filter" role="group" aria-label="Filter by type">
            <button type="button" aria-pressed={type === "all"} onClick={() => setType("all")}>All</button>
            {Object.entries(TYPES).map(([k, t]) => (
              <button key={k} type="button" aria-pressed={type === k} onClick={() => setType(k)} style={{ "--c": t.color }}>
                <i></i>{t.label}
              </button>
            ))}
          </div>
          <div className="f-monthly">
            <b>Every month</b>
            {MONTHLY.filter((c) => type === "all" || c.t === type).map((c) => (
              <span key={c.f}><i style={{ background: TYPES[c.t].color }}></i>{c.d}: {c.f}</span>
            ))}
          </div>
          <div className="f-cal">
            {order.map((m) => {
              const items = rows.filter((c) => c.m === m);
              if (!items.length) return null;
              return (
                <div className="f-cal-m" key={m}>
                  <h3>{MONTHS[m]}</h3>
                  <ul>
                    {items.map((c) => (
                      <li key={c.f + c.d}>
                        <b>{c.d}</b>
                        <span className="f-chip" style={{ "--c": TYPES[c.t].color }}>{TYPES[c.t].label}</span>
                        <strong>{c.f}</strong>
                        <span>{c.w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          <p className="f-note">A general guide. Dates can be extended or changed by government notifications, and some depend on your AGM date or filing category. Clients get a dated calendar for their own business.</p>
          <Legend />
        </div>
      </section>
      <CtaBand title="Want this calendar run for you?" />
    </FFPage>
  );
}
