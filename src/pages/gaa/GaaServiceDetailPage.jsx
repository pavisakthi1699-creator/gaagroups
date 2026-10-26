import React, { useRef } from "react";
import "./GaaServices.css";
import logoMain from "../../assets/logo-main.png";
import { GAA_FIRM, GAA_SERVICES, GAA_STEPS, getService } from "../../data/gaaServices";
import { useScrollState, CallbackForm, jumpTo } from "./GaaServiceShell";
import { GaaHeader, GaaSubBar, GaaFooter, Ring, useLink } from "./GaaShell";
import useGaaMotion from "./useGaaMotion";

/* Service detail page (Corporate law, Company secretarial, Mergers & acquisitions,
   Fundraising & restructuring, Regulatory advisory), built from the "Service Detail" design */
const COUNT = String(GAA_SERVICES.length).padStart(2, "0");

export default function GaaServiceDetailPage({ slug, onNavigate }) {
  const ref = useRef(null);
  const link = useLink(onNavigate);
  const svc = getService(slug) || GAA_SERVICES[0];
  const si = GAA_SERVICES.indexOf(svc);
  const next = GAA_SERVICES[(si + 1) % GAA_SERVICES.length];

  useGaaMotion(ref, `${svc.name} | GAA Consulting`);
  const { vw, mounted } = useScrollState();
  const narrow = vw < 900;

  return (
    <div className="gaa-consulting-root gaa-sub" ref={ref}>
      <GaaHeader link={link} active="practices" />
      <GaaSubBar link={link} crumbs={[["practices", "Services"], [null, svc.name]]} />

      <main className="gsv">
        <section className={`sd-grid${narrow ? " narrow" : ""}`}>
          <aside className="sv-aside sd-aside">
            <span className="x-mono x-m">What we do</span>
            <div className="sv-index">
              {GAA_SERVICES.map((s, i) => (
                <a key={s.slug} {...link(`practices/${s.slug}`)} className={i === si ? "on" : ""} aria-current={i === si ? "page" : undefined}>
                  <span className="x-bar"></span>
                  <span className="x-num">{"0" + (i + 1)}</span>
                  <span>{s.name}</span>
                </a>
              ))}
            </div>
            <div className="sv-acard sd-acard">
              <div className="x-row">
                <span className="sv-lgbox x-sm"><img src={logoMain} alt="" className="x-lgB" /></span>
                <span className="x-mono">{GAA_FIRM.name}</span>
              </div>
              <span className="x-nm">Talk to a {svc.short} specialist</span>
              <a href="#contact" onClick={jumpTo("contact")} className="sd-abtn">Book a consultation →</a>
            </div>
          </aside>

          <div className="sd-main">
            <div className="sd-top">
              <div className="x-hd">
                <span className="x-big">{"0" + (si + 1)}</span>
                <span className="x-mono x-m">{"0" + (si + 1)} / {COUNT}</span>
              </div>
              <h1>
                <span className="x-mask">
                  <span style={{ transform: `translateY(${mounted ? 0 : 110}%)` }}>{svc.name}</span>
                </span>
              </h1>
              <p className="x-lede">{svc.desc}</p>
              <div className="x-btns">
                <a href="#contact" onClick={jumpTo("contact")} className="sv-btn x-dark">Enquire about {svc.short} →</a>
                <a {...link("practices")} className="sv-btn x-soft">All {GAA_FIRM.name} services</a>
              </div>
            </div>

            <div className="sd-panel">
              <div className="x-h">
                <span className="x-mono">What's included</span>
                <span className="x-mono x-nc">{String(svc.incl.length).padStart(2, "0")} components</span>
              </div>
              <div className="x-boxes">
                {svc.incl.map((x, i) => (
                  <a key={x} href="#contact" onClick={jumpTo("contact")} className="x-box">
                    <div className="x-t"><span className="x-num">{si + 1}.{i + 1}</span><span className="x-ar">→</span></div>
                    <span className="x-nm">{x}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="sd-meta">
              <div>
                <span className="x-mono x-o2">Ideal for</span>
                <span className="x-v">{svc.ideal}</span>
              </div>
              <div>
                <span className="x-mono x-o2">Delivered by</span>
                <span className="x-v">{GAA_FIRM.name}, {GAA_FIRM.area.toLowerCase()}</span>
              </div>
            </div>

            <div className="sd-how">
              <span className="x-mono x-o2">How it works</span>
              <div className="x-g">
                {GAA_STEPS.map(([n, d], i) => (
                  <div key={n}>
                    <span className="x-mono x-n">{"0" + (i + 1)}</span>
                    <span className="x-nm">{n}</span>
                    <span className="x-d">{d}</span>
                  </div>
                ))}
              </div>
            </div>

            <a {...link(`practices/${next.slug}`)} className="sd-next">
              <div className="x-t">
                <span className="x-mono">Next service · {"0" + (GAA_SERVICES.indexOf(next) + 1)}</span>
                <span className="x-ar">→</span>
              </div>
              <span className="x-nm">{next.name}</span>
            </a>
          </div>
        </section>

        <section id="contact" className="sv-contact sd-contact">
          <div className="sv-ct">
            <div className="x-l">
              <span className="x-mono x-o">{GAA_FIRM.name} · {svc.name}</span>
              <h2>Let's talk about <span className="x-o">{svc.short}.</span></h2>
            </div>
            <div className="x-r x-tight">
              <CallbackForm onNavigate={onNavigate} />
              <span className="x-note">A {GAA_FIRM.name} specialist will get back to you.</span>
            </div>
          </div>
        </section>
      </main>

      <GaaFooter link={link} />
      <Ring />
    </div>
  );
}
