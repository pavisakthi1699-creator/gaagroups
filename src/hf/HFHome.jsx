import React, { useRef } from "react";
import { Link } from "../group/router.jsx";
import { HFPage, FinalBanner, TalentCard, Icon, BASE, HIRE } from "./HFLayout.jsx";
import { HF, PILLARS, CATEGORIES, TALENT, PROCESS, CLIENT_LOGOS } from "./hfData.js";

export function ProcessFlow() {
  return (
    <section className="h-sec h-process" id="process" aria-labelledby="h-proc-h">
      <div className="h-w h-narrow">
        <span className="h-eb">How it works</span>
        <h2 id="h-proc-h">Four steps. No noise.</h2>
        <ol className="h-flow">
          {PROCESS.map(([t, d], i) => (
            <li key={t}>
              <span className="h-flow-n">{i + 1}</span>
              <div>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
              {i < PROCESS.length - 1 && <span className="h-flow-arrow" aria-hidden="true">↓</span>}
            </li>
          ))}
        </ol>
        <div className="h-sla">
          <b>72<small>hrs</small></b>
          <p>{HF.sla}</p>
        </div>
      </div>
    </section>
  );
}

export default function HFHome() {
  const rail = useRef(null);
  const scroll = (dir) => rail.current?.scrollBy({ left: dir * Math.min(rail.current.clientWidth * 0.8, 680), behavior: "smooth" });
  const heroCards = TALENT.slice(0, 3);
  return (
    <HFPage>
      {/* 1. Hero */}
      <section className="h-hero" aria-labelledby="h-hero-h">
        <div className="h-w">
          <h1 id="h-hero-h">
            {HF.headline[0]}
            <br />
            <em>{HF.headline[1]}</em>
          </h1>
          <p className="h-hero-sub">{HF.sub}</p>
          <div className="h-acts center">
            <Link to={HIRE} className="h-pill h-lg">Hire Talent</Link>
            <Link to={`${BASE}/talent`} className="h-link">Explore Candidates <Icon name="chev" size={16} sw={2} /></Link>
          </div>
          <div className="h-hero-visual" aria-hidden="true">
            {heroCards.map((t, i) => (
              <div className={`h-hv h-hv${i}`} key={t.role}>
                <span className="h-avatar"><Icon name={t.cat} size={18} /></span>
                <div>
                  <b>{t.role}</b>
                  <span>{t.skills.join(" · ")}</span>
                </div>
                <span className="h-ready"><Icon name="check" size={12} sw={2.6} />Ready</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. What makes HF different */}
      <section className="h-sec h-diff" aria-labelledby="h-diff-h">
        <div className="h-w">
          <h2 id="h-diff-h" className="h-statement">
            {HF.diff[0]}
            <br />
            <span>{HF.diff[1]}</span>
          </h2>
          <div className="h-pillars">
            {PILLARS.map((p) => (
              <div className="h-pillar" key={p.key}>
                <span className="h-pi"><Icon name={p.key} size={28} /></span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Talent categories */}
      <section className="h-sec h-cats" aria-labelledby="h-cats-h">
        <div className="h-w">
          <div className="h-head">
            <span className="h-eb">Talent categories</span>
            <h2 id="h-cats-h">Talent for every team.</h2>
          </div>
          <div className="h-tiles">
            {CATEGORIES.map((c) => (
              <Link key={c.slug} to={`${BASE}/talent/${c.slug}`} className={`h-tile h-${c.tone}`}>
                <span className="h-tile-ic"><Icon name={c.slug} size={30} /></span>
                <h3>{c.name}</h3>
                <p>{c.line}</p>
                <span className="h-tile-go">Explore <Icon name="chev" size={14} sw={2} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured talent pool */}
      <section className="h-sec h-pool" aria-labelledby="h-pool-h">
        <div className="h-w">
          <div className="h-head h-row">
            <div>
              <span className="h-eb">Featured talent pool</span>
              <h2 id="h-pool-h">Available Talent</h2>
            </div>
            <div className="h-rail-ctl">
              <button type="button" onClick={() => scroll(-1)} aria-label="Previous profiles">‹</button>
              <button type="button" onClick={() => scroll(1)} aria-label="Next profiles">›</button>
            </div>
          </div>
        </div>
        <div className="h-rail" ref={rail} tabIndex={0} aria-label="Available talent profiles">
          {TALENT.map((t) => <TalentCard key={t.role} t={t} />)}
        </div>
        <div className="h-w h-pool-cta">
          <Link to={HIRE} className="h-pill h-lg">Request Profiles</Link>
          <Link to={`${BASE}/talent`} className="h-link">See all talent <Icon name="chev" size={16} sw={2} /></Link>
        </div>
      </section>

      {/* 5. Process */}
      <ProcessFlow />

      {/* 6. Trust */}
      <section className="h-sec h-trust" aria-labelledby="h-trust-h">
        <div className="h-w">
          <h2 id="h-trust-h" className="h-small-h">Companies Hiring Through HF</h2>
          <div className="h-logos">
            {CLIENT_LOGOS.length
              ? CLIENT_LOGOS.map((l) => <img key={l.name} src={l.src} alt={l.name} />)
              : Array.from({ length: 6 }).map((_, i) => <span key={i} className="h-logo-slot">Client logo</span>)}
          </div>
        </div>
      </section>

      {/* 7. Final banner */}
      <FinalBanner />
    </HFPage>
  );
}
