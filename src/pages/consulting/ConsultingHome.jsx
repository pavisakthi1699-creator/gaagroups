import React, { useEffect, useRef } from "react";
import { Link } from "../../router";
import home from "../../data/consulting-home.json";
import Icon from "../../components/Icon";
import useReveal from "../../lib/useReveal";

const SERVICE_LINKS = [
  "/gaa-consulting/corporate-advisory",
  "/gaa-consulting/nbfc-compliance-office",
  "/gaa-consulting/india-entry",
  "/gaa-consulting/fundraising-advisory",
  "/gaa-consulting/transactional-advisory",
  "/gaa-consulting/startup-compliance-office",
];
const TRUST = [
  ["shield", "Independent, professionally managed firm"],
  ["layers", "Corporate and regulatory expertise"],
  ["people", "Multidisciplinary professional capabilities"],
  ["user", "Senior-led involvement in key matters"],
];
const n = (i) => String(i + 1).padStart(2, "0");

export default function Home() {
  const photo = useRef(null);
  const proc = useRef(null);
  useReveal(".gc-r,.gc-svc,.gc-why-i,.gc-pr,.gc-ins-c,.gc-about-img");

  /* hero photo drifts slightly and the process line fills as you scroll */
  useEffect(() => {
    const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    const onScroll = () => {
      const y = window.scrollY;
      if (photo.current && !reduce) photo.current.style.transform = `translateY(${-Math.min(y, 700) * 0.12}px)`;
      const el = proc.current;
      if (el) {
        const r = el.getBoundingClientRect();
        const h = window.innerHeight;
        const p = Math.max(0, Math.min(1, (h * 0.75 - r.top) / (r.height + h * 0.25)));
        el.style.setProperty("--p", p.toFixed(3));
        const items = el.querySelectorAll(".gc-pr");
        items.forEach((it, i) => it.classList.toggle("lit", p >= i / items.length + 0.05));
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="gch"><main className="gc" id="top">
      <section className="gc-hero">
        <div className="gc-in gc-hero-in">
          <div className="gc-hero-l">
            <span className="gc-eye gc-a" style={{ "--d": 0 }}>Corporate Legal &amp; Strategic Advisory</span>
            <h1 className="gc-h1">
              <span className="gc-ln"><span style={{ "--d": 1 }}>Clarity in Complexity.</span></span>
              <span className="gc-ln"><span style={{ "--d": 2 }}>Confidence in Every <em className="hw-o">Decision.</em></span></span>
            </h1>
            <p className="gc-lead gc-a" style={{ "--d": 3 }}>
              GAA Consulting partners with businesses, founders and institutions to navigate corporate regulations, structure transactions and build stronger governance frameworks.
            </p>
            <div className="gc-btns gc-a" style={{ "--d": 4 }}>
              <Link className="gc-btn pri" to="/contact#gaa-consulting">Schedule a Consultation <Icon name="arrow" /></Link>
              <Link className="gc-btn" to="#services">Explore Our Expertise <Icon name="arrow" /></Link>
            </div>
          </div>
          <div className="gc-hero-r gc-a" style={{ "--d": 2 }}>
            <div className="gc-frame" />
            <div className="gc-photo">
              <img ref={photo} src="/images/consulting/gaa-skyline.webp" alt="Modern corporate towers at sunset" fetchPriority="high" id="gcPar" />
            </div>
            <div className="gc-tag"><b>Empowering Businesses.</b><span>Structuring Growth. Strengthening Governance.</span></div>
          </div>
        </div>
        <div className="gc-scroll" aria-hidden="true"><span /></div>
      </section>

      <section className="gc-trust">
        <div className="gc-in">
          <ul>{TRUST.map(([i, t]) => <li key={t}><Icon name={i} /><span>{t}</span></li>)}</ul>
        </div>
      </section>

      <section className="gc-sec gc-about" id="about">
        <div className="gc-in gc-about-in">
          <div className="gc-about-img gc-r">
            <img src="/images/consulting/gaa-skyline.webp" alt="City skyline representing businesses GAA Consulting supports" loading="lazy" />
            <span className="gc-about-badge">Bengaluru, India</span>
          </div>
          <div className="gc-about-tx">
            <span className="gc-eye gc-r">About GAA</span>
            <h2 className="gc-h2 gc-r">A Trusted Partner in Corporate Advisory and <em className="hw-o">Governance.</em></h2>
            <p className="gc-p gc-r">GAA Consulting is an independent, professionally managed corporate advisory firm providing comprehensive legal, regulatory and strategic support to businesses across their lifecycle.</p>
            <p className="gc-p gc-r">We work alongside founders, management teams, investors and established enterprises to address complex corporate requirements, manage regulatory responsibilities and facilitate informed business decisions.</p>
            <Link className="gc-btn gc-r" to="#services">Explore Our Services <Icon name="arrow" /></Link>
          </div>
        </div>
      </section>

      <section className="gc-sec gc-band" id="services">
        <div className="gc-in">
          <div className="gc-head">
            <div>
              <span className="gc-eye gc-r">Core advisory services</span>
              <h2 className="gc-h2 gc-r">Integrated Expertise. <em className="hw-o">Practical Business Solutions.</em></h2>
            </div>
            <p className="gc-p gc-r">From corporate structuring and regulatory compliance to strategic transactions, we provide professional advisory support across critical business requirements.</p>
          </div>
          <div className="gc-svcs">
            {home.services.map((s, k) => (
              <article className="gc-svc" style={{ "--k": k }} key={s.title}>
                <Link to={SERVICE_LINKS[k]} aria-label={s.title}>
                  <div className="gc-svc-top"><span className="gc-no">{n(k)}</span><span className="gc-svc-ic"><Icon name={s.icon} /></span></div>
                  <h3>{s.title}</h3>
                  <ul>{s.points.map((p) => <li key={p}>{p}</li>)}</ul>
                  <span className="gc-more">Explore service <Icon name="arrow" /></span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="gc-sec gc-band">
        <div className="gc-in gc-why-in">
          <div className="gc-why-h">
            <span className="gc-eye gc-r">Why choose GAA</span>
            <h2 className="gc-h2 gc-r">Beyond Compliance. <em className="hw-o">A Partner in Business Decisions.</em></h2>
          </div>
          <div className="gc-why">
            {home.why.map((w, k) => (
              <div className="gc-why-i" style={{ "--k": k }} key={w.title}>
                <span className="gc-why-ic"><Icon name={w.icon} /></span>
                <span className="gc-no">{n(k)}</span>
                <h3>{w.title}</h3>
                <p>{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="gc-sec">
        <div className="gc-in">
          <div className="gc-head"><div>
            <span className="gc-eye gc-r">Our engagement process</span>
            <h2 className="gc-h2 gc-r">A Structured Approach to <em className="hw-o">Every Business Challenge.</em></h2>
          </div></div>
          <ol className="gc-proc" id="gcProc" ref={proc}>
            {home.process.map((p, k) => (
              <li className="gc-pr" style={{ "--k": k }} key={p.title}>
                <span className="gc-pr-n">{n(k)}</span><b>{p.title}</b><p>{p.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="gc-sec gc-band" id="insights">
        <div className="gc-in">
          <div className="gc-head">
            <div>
              <span className="gc-eye gc-r">Insights &amp; publications</span>
              <h2 className="gc-h2 gc-r">Insights That Keep <em className="hw-o">You Ahead.</em></h2>
            </div>
            <div className="gc-cats gc-r">{home.cats.map((c) => <span key={c}>{c}</span>)}</div>
          </div>
          <div className="gc-ins">
            {home.insights.map((x, k) => (
              <article className="gc-ins-c" style={{ "--k": k }} key={x.cat}>
                <span className="gc-cat">{x.cat}</span><h3>{x.cat}</h3><p>{x.text}</p><span className="gc-soon">Coming soon</span>
              </article>
            ))}
          </div>
          <div className="gc-more-row gc-r"><Link className="gc-btn" to="/insights#gaa-consulting">Explore Insights <Icon name="arrow" /></Link></div>
        </div>
      </section>

      <section className="gc-sec">
        <div className="gc-in gc-rel-in">
          <div>
            <span className="gc-eye gc-r">Client relationships</span>
            <h2 className="gc-h2 gc-r">Built on Trust. <em className="hw-o">Sustained Through Professional Relationships.</em></h2>
            <p className="gc-p gc-r">We work with businesses at every stage, from first-time founders to boards of established enterprises, and many engagements continue well beyond the first assignment.</p>
          </div>
          <ul className="gc-aud">{home.audience.map((a) => <li key={a}><Icon name="check" />{a}</li>)}</ul>
        </div>
      </section>
    </main></div>
  );
}
