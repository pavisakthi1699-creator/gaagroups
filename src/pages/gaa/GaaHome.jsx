// GAA Consulting home page (/gaa-consulting). Black, white and orange; one font.
// Uses the GAA header and footer so it matches the other GAA Consulting pages.
import React, { useEffect, useRef, useState } from "react";
import useGaaMotion from "./useGaaMotion";
import { GaaHeader, GaaFooter, Ring, useLink } from "./GaaShell";
import { GAA_FIRM, GAA_SERVICES, GAA_STEPS, OTHER_FIRMS } from "../../data/gaaServices";
import { INDUSTRIES, ENGAGEMENT_MODELS } from "../../data/gaaContent";
import { COMPANIES, siteHref } from "../../group/sites.js";
import { useReveal, useScrollProgress, spotlight } from "../../group/motion.js";
import { ArrowIcon } from "../../group/Icons.jsx";
import "./GaaHome.css";

const VERBS = ["incorporate.", "govern.", "merge.", "raise capital.", "stay compliant."];

function Rotator() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((v) => (v + 1) % VERBS.length), 2000);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="gx-rot" aria-label={VERBS.join(", ")}>
      {VERBS.map((w, n) => (
        <span key={w} aria-hidden="true" className={n === i ? "on" : n === (i + VERBS.length - 1) % VERBS.length ? "out" : ""}>
          {w}
        </span>
      ))}
    </span>
  );
}

function Services({ link }) {
  const [sel, setSel] = useState(0);
  const s = GAA_SERVICES[sel];
  return (
    <section className="gx-svc" id="services" aria-labelledby="gx-svc-h">
      <div className="w">
        <div className="gx-head">
          <span className="gx-eb" data-rv>What we do</span>
          <h2 id="gx-svc-h">
            Five services. <em>One standard.</em>
          </h2>
        </div>
        <div className="gx-svc-grid">
          <ol className="gx-svc-list" role="tablist" aria-label="Services" aria-orientation="vertical">
            {GAA_SERVICES.map((x, i) => (
              <li key={x.slug} data-rv style={{ "--d": `${i * 70}ms` }}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={sel === i}
                  aria-controls="gx-svc-panel"
                  onMouseEnter={() => setSel(i)}
                  onFocus={() => setSel(i)}
                  onClick={() => setSel(i)}
                >
                  <span className="gx-n">0{i + 1}</span>
                  <span className="gx-svc-name">{x.name}</span>
                  <ArrowIcon />
                </button>
              </li>
            ))}
          </ol>
          <div className="gx-svc-panel" id="gx-svc-panel" role="tabpanel" aria-live="polite" data-rv>
            <div className="gx-panel-in" key={s.slug}>
              <span className="gx-panel-n">0{sel + 1} / 05</span>
              <h3>{s.name}</h3>
              <p>{s.desc}</p>
              <ul className="gx-chips">
                {s.incl.map((t) => <li key={t}>{t}</li>)}
              </ul>
              <div className="gx-ideal">
                <small>Ideal for</small>
                <span>{s.ideal}</span>
              </div>
              <a className="gx-btn gx-orange" {...link(`practices/${s.slug}`)}>
                Explore {s.name.toLowerCase()} <ArrowIcon />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Method() {
  const [ref, p] = useScrollProgress();
  return (
    <section className="gx-method" aria-labelledby="gx-m-h">
      <div className="w">
        <div className="gx-head gx-split">
          <div>
            <span className="gx-eb" data-rv>How we work</span>
            <h2 id="gx-m-h">
              Four steps. <em>Every mandate.</em>
            </h2>
          </div>
          <p data-rv>A senior partner leads every engagement, from the first call to the final filing.</p>
        </div>
        <div className="gx-steps" ref={ref} style={{ "--p": p }}>
          <div className="gx-track" aria-hidden="true"><span></span></div>
          {GAA_STEPS.map(([t, d], i) => (
            <div key={t} className={`gx-step${p > i / GAA_STEPS.length ? " on" : ""}`}>
              <span className="gx-dot">0{i + 1}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function GaaHome({ onNavigate }) {
  const ref = useRef(null);
  const link = useLink(onNavigate);
  useGaaMotion(ref);
  useReveal([]);
  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--hx", `${((e.clientX - r.left) / r.width) * 100}%`);
    e.currentTarget.style.setProperty("--hy", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <div className="gaa-consulting-root gaa-sub gx" ref={ref}>
      <GaaHeader link={link} active="" />
      <main>
        {/* Hero */}
        <section className="gx-hero" onMouseMove={move} aria-labelledby="gx-h">
          <div className="gx-bg" aria-hidden="true"><span className="gx-orb"></span><span className="gx-grid"></span></div>
          <div className="w">
            <div className="gx-hero-top gx-up" style={{ "--d": "100ms" }}>
              <span className="gx-tag"><i></i>GAA Consulting · {COMPANIES.gaa.two}</span>
              <span>A GAA Group company</span>
            </div>
            <h1 id="gx-h" className="gx-h1">
              <span className="gx-mask"><span className="gx-rise" style={{ "--d": "150ms" }}>Advice that</span></span>
              <span className="gx-mask"><span className="gx-rise gx-acc" style={{ "--d": "300ms" }}>holds up.</span></span>
            </h1>
            <div className="gx-hero-low">
              <p className="gx-lead gx-up" style={{ "--d": "650ms" }}>
                We help you <Rotator />
                <span>{GAA_FIRM.blurb}</span>
              </p>
              <div className="gx-acts gx-up" style={{ "--d": "800ms" }}>
                <a className="gx-btn gx-orange" {...link("@contact")}>{GAA_FIRM.cta} <ArrowIcon /></a>
                <a className="gx-btn gx-ghost" href="#services" onClick={(e) => { e.preventDefault(); document.getElementById("services")?.scrollIntoView({ behavior: "smooth" }); }}>
                  Explore services
                </a>
              </div>
            </div>
            <ul className="gx-facts gx-up" style={{ "--d": "950ms" }}>
              <li><b>05</b><span>Core services</span></li>
              <li><b>04</b><span>Step method on every mandate</span></li>
              <li><b>01</b><span>Partner leading your file</span></li>
              <li><b>{INDUSTRIES.length < 10 ? `0${INDUSTRIES.length}` : INDUSTRIES.length}</b><span>Industries served</span></li>
            </ul>
          </div>
        </section>

        <Services link={link} />

        <div className="gx-marquee" aria-label={`Industries: ${INDUSTRIES.map((x) => x.name).join(", ")}`}>
          <div className="gx-mq" aria-hidden="true">
            {[0, 1].map((k) => (
              <div key={k}>
                {INDUSTRIES.map((x) => (
                  <React.Fragment key={x.name}>
                    <span>{x.name}</span>
                    <i>✦</i>
                  </React.Fragment>
                ))}
              </div>
            ))}
          </div>
        </div>

        <Method />

        {/* Industries */}
        <section className="gx-ind" aria-labelledby="gx-ind-h">
          <div className="w">
            <div className="gx-head gx-split">
              <div>
                <span className="gx-eb" data-rv>Industries</span>
                <h2 id="gx-ind-h">
                  Sector context, <em>built in.</em>
                </h2>
              </div>
              <a className="gx-link" {...link("industries")} data-rv>All industries <ArrowIcon /></a>
            </div>
            <div className="gx-ind-grid">
              {INDUSTRIES.map((x, i) => (
                <a key={x.name} className="gx-ind-card" {...link("industries")} data-rv style={{ "--d": `${(i % 3) * 80}ms` }} onMouseMove={spotlight}>
                  <span className="gx-ind-tag">{x.tag}</span>
                  <h3>{x.name}</h3>
                  <p>{x.desc}</p>
                  <span className="gx-ind-go"><ArrowIcon /></span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Engagement models */}
        <section className="gx-eng" aria-labelledby="gx-eng-h">
          <div className="w">
            <div className="gx-head">
              <span className="gx-eb" data-rv>Ways to work with us</span>
              <h2 id="gx-eng-h">
                Clear scope. <em>Fixed fees.</em>
              </h2>
            </div>
            <div className="gx-eng-grid">
              {ENGAGEMENT_MODELS.map((m, i) => (
                <article key={m.name} className={`gx-model${m.hl ? " hl" : ""}`} data-rv style={{ "--d": `${i * 90}ms` }} onMouseMove={spotlight}>
                  <span className="gx-model-t">{m.t}</span>
                  <h3>{m.name}</h3>
                  <p>{m.desc}</p>
                  <ul>
                    {m.points.map((pt) => <li key={pt}>{pt}</li>)}
                  </ul>
                  <a className="gx-link" {...link("how-we-work")}>See how it works <ArrowIcon /></a>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Group companies */}
        <section className="gx-group" aria-labelledby="gx-g-h">
          <div className="w">
            <div className="gx-head gx-split">
              <div>
                <span className="gx-eb" data-rv>Part of GAA Group</span>
                <h2 id="gx-g-h">
                  Often paired <em>with.</em>
                </h2>
              </div>
              <p data-rv>Books, filings and hiring handled by our sister companies, planned with your legal work.</p>
            </div>
            <div className="gx-pair">
              {OTHER_FIRMS.map((f) => {
                const c = COMPANIES[f.site];
                return (
                  <a key={f.key} href={siteHref(f.site, f.home)} className="gx-pair-row" data-rv onMouseMove={spotlight}>
                    <span className="gx-plate"><img src={c.logo} alt={`${c.name} logo`} /></span>
                    <span className="gx-pair-main">
                      <small>{c.two}</small>
                      <b>{f.name}</b>
                      <span>{f.services.join(" · ")}</span>
                    </span>
                    <span className="gx-pair-go"><ArrowIcon /></span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="gx-cta" aria-labelledby="gx-cta-h">
          <div className="w gx-cta-in">
            <h2 id="gx-cta-h">
              {GAA_FIRM.close1} <em>{GAA_FIRM.close2}</em>
            </h2>
            <div className="gx-acts" data-rv>
              <a className="gx-btn gx-black" {...link("@contact")}>Book a consultation <ArrowIcon /></a>
              <a className="gx-btn gx-line" {...link("practices")}>All services</a>
            </div>
          </div>
        </section>
      </main>
      <GaaFooter link={link} />
      <Ring />
    </div>
  );
}
