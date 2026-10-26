import React, { useRef, useState } from "react";
import "./GaaServices.css";
import logoMain from "../../assets/logo-main.png";
import { GAA_FIRM, GAA_SERVICES, GAA_STEPS, OTHER_FIRMS } from "../../data/gaaServices";
import { useScrollState, CallbackForm, jumpTo } from "./GaaServiceShell";
import { GaaHeader, GaaSubBar, GaaFooter, Ring, useLink } from "./GaaShell";
import useGaaMotion from "./useGaaMotion";
import { siteHref } from "../../group/sites.js";

/* "GAA Consulting Services" page, built from GAA_Consulting_Services.dc.html */
const anchor = (name) => name.toLowerCase().replace(/[^a-z]+/g, "-");
const COUNT = String(GAA_SERVICES.length).padStart(2, "0");

export default function GaaServicesPage({ onNavigate }) {
  const ref = useRef(null);
  const link = useLink(onNavigate);
  useGaaMotion(ref, "Services | GAA Consulting");

  const listRef = useRef(null);
  const [active, setActive] = useState(0);
  const [pick, setPick] = useState(0);

  const measureActive = () => {
    const list = listRef.current;
    if (!list) return;
    const vh = window.innerHeight;
    let a = 0;
    list.querySelectorAll("[data-svc]").forEach((el, i) => {
      if (el.getBoundingClientRect().top < vh * 0.45) a = i;
    });
    setActive(a);
  };
  const { y, vw, mounted } = useScrollState(measureActive);
  const narrow = vw < 900;

  return (
    <div className="gaa-consulting-root gaa-sub" ref={ref}>
      <GaaHeader link={link} active="practices" />
      <GaaSubBar link={link} crumbs={[[null, "Services"]]} />

      <main className="gsv">
        {/* ============ HERO ============ */}
        <section className="sv-herow">
          <div className="sv-hero">
            <div className="sv-hero-top">
              <div className="x-l">
                <span className="sv-lgbox"><img src={logoMain} alt="" className="x-lgB" /></span>
                <span className="x-mono">{GAA_FIRM.area}</span>
              </div>
              <span className="x-mono">Services · {COUNT}</span>
            </div>
            <div className="sv-verb" aria-hidden="true" style={{ transform: `translate(${-y * 0.25}px,-58%)` }}>
              {GAA_FIRM.verb}
            </div>
            <div className="sv-hero-g">
              <h1>
                <span className="x-mask">
                  <span style={{ transform: `translateY(${mounted ? 0 : 110}%)` }}>{GAA_FIRM.name}</span>
                </span>
              </h1>
              <div className="x-r">
                <p>{GAA_FIRM.blurb}</p>
                <div className="x-btns">
                  <a href="#contact" onClick={jumpTo("contact")} className="sv-btn x-dark">{GAA_FIRM.cta} →</a>
                  <a href="#services" onClick={jumpTo("services")} className="sv-btn x-line">Explore services ↓</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ QUICK LINKS ============ */}
        <section className="sv-quickw">
          <div className="sv-quick">
            {GAA_SERVICES.map((s, i) => (
              <a key={s.slug} href={`#${anchor(s.name)}`} onClick={jumpTo(anchor(s.name))}>
                <div>
                  <span className="x-mono x-n">{"0" + (i + 1)}</span>
                  <span className="x-nm">{s.name}</span>
                </div>
                <span>↓</span>
              </a>
            ))}
          </div>
        </section>

        {/* ============ SERVICES LIST ============ */}
        <section id="services" className={`sv-list${narrow ? " narrow" : ""}`}>
          <aside className="sv-aside">
            <span className="x-mono x-m">What we do</span>
            <div className="sv-index">
              {GAA_SERVICES.map((s, i) => (
                <a key={s.slug} {...link(`practices/${s.slug}`)} className={i === active ? "on" : ""}>
                  <span className="x-bar"></span>
                  <span className="x-num">{"0" + (i + 1)}</span>
                  <span>{s.name}</span>
                </a>
              ))}
            </div>
            <div className="sv-acard">
              <span className="x-mono">Now viewing</span>
              <span className="x-nm">{GAA_SERVICES[active].name}</span>
              <a href="#contact" onClick={jumpTo("contact")} className="x-u">Ask about this service →</a>
            </div>
          </aside>
          <div ref={listRef} className="sv-arts">
            {GAA_SERVICES.map((s, i) => {
              const on = i === active;
              return (
                <article key={s.slug} id={anchor(s.name)} data-svc="1" className="sv-art">
                  <div className="x-hd">
                    <span className={`x-big${on ? " on" : ""}`}>{"0" + (i + 1)}</span>
                    <span className="x-mono x-m">{"0" + (i + 1)} / {COUNT}</span>
                  </div>
                  <h2>{s.name}</h2>
                  <p className="x-d">{s.desc}</p>
                  <div className="x-two">
                    <div className="x-incl">
                      <span className="x-mono">What's included</span>
                      <div>
                        {s.incl.map((x) => (
                          <div className="x-row" key={x}><span className="x-dot"></span><span>{x}</span></div>
                        ))}
                      </div>
                    </div>
                    <div className="x-ideal">
                      <div>
                        <span className="x-mono x-m">Ideal for</span>
                        <span className="x-tx">{s.ideal}</span>
                      </div>
                      <a {...link(`practices/${s.slug}`)}>View {s.short} in detail →</a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ============ HOW WE WORK ============ */}
        <section className="sv-proc">
          <div className="x-in">
            <div className="x-h">
              <span className="x-mono x-o">How we work</span>
              <h2>{GAA_FIRM.procTitle}</h2>
            </div>
            <div className="x-steps">
              {GAA_STEPS.map(([n, d], i) => (
                <div className="x-step" key={n}>
                  <span className="x-num">{"0" + (i + 1)}</span>
                  <div>
                    <span className="x-nm">{n}</span>
                    <span className="x-d">{d}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ OFTEN PAIRED WITH ============ */}
        <section className="sv-pair">
          <div className="x-h">
            <div>
              <span className="x-mono x-o2">Across the group</span>
              <h2>Often paired with</h2>
            </div>
          </div>
          <div className="x-cards">
            {OTHER_FIRMS.map((f) => (
              <a key={f.key} href={siteHref(f.site, f.home)} className={`x-card ${f.key}`}>
                <div className="x-top">
                  <span className="x-mono">{f.area}</span>
                  <span className="x-ar">→</span>
                </div>
                <div className="x-b">
                  <span className="x-nm">{f.name}</span>
                  <span className="x-ls">{f.services.join(" · ")}</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ============ CONTACT ============ */}
        <section id="contact" className="sv-contact">
          <div className="sv-ct">
            <div className="x-l">
              <span className="x-mono x-o">{GAA_FIRM.name}</span>
              <h2>{GAA_FIRM.close1} <span className="x-o">{GAA_FIRM.close2}</span></h2>
            </div>
            <div className="x-r">
              <span className="x-mono x-soft">Service needed</span>
              <div className="x-picks">
                {GAA_SERVICES.map((s, i) => (
                  <button type="button" key={s.slug} className={pick === i ? "on" : ""} aria-pressed={pick === i} onClick={() => setPick(i)}>
                    {s.name}
                  </button>
                ))}
              </div>
              <CallbackForm onNavigate={onNavigate} />
            </div>
          </div>
        </section>
      </main>

      <GaaFooter link={link} />
      <Ring />
    </div>
  );
}
