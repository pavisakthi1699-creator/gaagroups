// Group landing page, the same on all three domains.
// Black hero with motion, a services marquee, the group statement, the three companies,
// "One Group. Three Strengths." and contact.
import React, { useEffect, useState } from "react";
import { GroupPage } from "./GroupChrome.jsx";
import { Link } from "./router.jsx";
import { COMPANIES, ORDER, GROUP, siteHref } from "./sites.js";
import { TEAM } from "./team.js";
import Ecosystem from "./Ecosystem.jsx";
import ContactBlock from "./ContactBlock.jsx";
import { CURRENT } from "../brand.js";
import { useCountUp, useScrollProgress, spotlight } from "./motion.js";
import { ArrowIcon } from "./Icons.jsx";

const domainOf = (c) => c.domain.replace(/^https?:\/\/(www\.)?/, "");

/** The three companies as large interactive rows. Used on Home, Contact and 404. */
export function BrandDoors({ compact = false }) {
  return (
    <div className={`g-rows${compact ? " g-compact" : ""}`}>
      {ORDER.map((k, i) => {
        const c = COMPANIES[k];
        const here = k === CURRENT;
        return (
          <Link
            key={k}
            to={siteHref(k, c.home)}
            className="g-row"
            data-rv
            style={{ "--d": `${i * 90}ms` }}
            onMouseMove={spotlight}
            aria-label={`${c.name}: ${c.two}. Visit website`}
          >
            <span className="g-row-n">0{i + 1}</span>
            <span className="g-plate g-lg"><img src={c.logo} alt={`${c.name} logo`} /></span>
            <span className="g-row-main">
              <span className="g-row-two">
                {c.two}
                {here && <em className="g-herepill">You are here</em>}
              </span>
              <span className="g-row-name">{c.name}</span>
              <span className="g-row-line">{c.line}</span>
            </span>
            <span className="g-row-dom">{domainOf(c)}</span>
            <span className="g-row-go" aria-hidden="true"><ArrowIcon /></span>
          </Link>
        );
      })}
    </div>
  );
}

const WORDS = ["advisory.", "compliance.", "talent."];
function Rotator() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((v) => (v + 1) % WORDS.length), 2200);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="g-rot" aria-label="advisory, compliance and talent">
      {WORDS.map((w, n) => (
        <span key={w} className={n === i ? "on" : n === (i + WORDS.length - 1) % WORDS.length ? "out" : ""} aria-hidden="true">
          {w}
        </span>
      ))}
    </span>
  );
}

function Letters({ text, from = 0 }) {
  return [...text].map((ch, i) => (
    <span key={i} className="g-ch" style={{ "--i": from + i }}>
      {ch}
    </span>
  ));
}

function Hero() {
  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--hx", `${((e.clientX - r.left) / r.width) * 100}%`);
    e.currentTarget.style.setProperty("--hy", `${((e.clientY - r.top) / r.height) * 100}%`);
  };
  const toCos = (e) => {
    e.preventDefault();
    document.getElementById("companies")?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <section className="g-hero" onMouseMove={move} aria-labelledby="g-hero-h">
      <div className="g-hero-bg" aria-hidden="true">
        <span className="g-orb g-o1"></span>
        <span className="g-orb g-o2"></span>
        <span className="g-grid"></span>
        <span className="g-grain"></span>
      </div>
      <div className="g-wrap g-hero-in">
        <div className="g-hero-meta g-up" style={{ "--d": "100ms" }}>
          <span><i className="g-live"></i>{GROUP.legalName}</span>
          <span>{GROUP.office}</span>
        </div>
        <h1 id="g-hero-h" className="g-h1" aria-label="Business, first.">
          <span className="g-l1" aria-hidden="true"><Letters text="Business," /></span>
          <span className="g-l2" aria-hidden="true"><Letters text="first." from={9} /></span>
        </h1>
        <div className="g-hero-low">
          <p className="g-hero-lead g-up" style={{ "--d": "900ms" }}>
            One group for your <Rotator />
            <span className="g-hero-sub">{GROUP.intro}</span>
          </p>
          <div className="g-acts g-up" style={{ "--d": "1050ms" }}>
            <a href="#companies" className="g-btn g-accent" data-mag onClick={toCos}>
              Explore our companies <ArrowIcon />
            </a>
            <Link to="/contact" className="g-btn g-ghost" data-mag>Book a consultation</Link>
          </div>
        </div>
        <div className="g-hero-cos g-up" style={{ "--d": "1200ms" }}>
          {ORDER.map((k) => {
            const c = COMPANIES[k];
            return (
              <Link key={k} to={siteHref(k, c.home)} className="g-chip">
                <span className="g-plate g-xs"><img src={c.logo} alt="" /></span>
                <span>
                  <b>{c.name}</b>
                  <small>{c.two}</small>
                </span>
                <ArrowIcon />
              </Link>
            );
          })}
        </div>
      </div>
      <a href="#companies" className="g-scroll" onClick={toCos} aria-label="Scroll to our companies"><span></span></a>
    </section>
  );
}

const SERVICES = ["Corporate Law", "Company Secretarial", "Mergers & Acquisitions", "Fundraising", "Regulatory Advisory", "Accounting", "Bookkeeping", "GST", "Income Tax", "Corporate Compliance", "Recruitment", "Leadership Hiring", "Campus Hiring"];
function Marquee() {
  const row = SERVICES.flatMap((s) => [<span key={s}>{s}</span>, <i key={s + "-x"} aria-hidden="true">✦</i>]);
  return (
    <div className="g-marquee" aria-label={`Services: ${SERVICES.join(", ")}`}>
      <div className="g-mq-track" aria-hidden="true">
        <div>{row}</div>
        <div>{row}</div>
      </div>
    </div>
  );
}

const STATEMENT =
  "GAA Group brings three specialist firms under one roof. Advisory, compliance and talent, planned together around your business, with one team accountable for the result.";

function Stat({ to, label, suffix = "" }) {
  const [ref, n] = useCountUp(to);
  return (
    <div className="g-stat" ref={ref} data-rv>
      <b>
        {String(n).padStart(2, "0")}
        <span>{suffix}</span>
      </b>
      <small>{label}</small>
    </div>
  );
}

function Statement() {
  const [ref, p] = useScrollProgress();
  const words = STATEMENT.split(" ");
  const lit = Math.round(p * words.length * 1.15);
  return (
    <section className="g-state" aria-label="About the group">
      <div className="g-wrap">
        <span className="g-eb" data-rv>Who we are</span>
        <p className="g-state-tx" ref={ref}>
          {words.map((w, i) => (
            <span key={i} className={i < lit ? "on" : ""}>{w} </span>
          ))}
        </p>
        <div className="g-stats">
          <Stat to={3} label="Specialist companies" />
          <Stat to={TEAM.length} label="Professionals in Bengaluru" />
          <Stat to={1} label="Accountable partner for you" />
          <div className="g-stat g-stat-link" data-rv>
            <Link to="/about" className="g-link">
              Meet the team <ArrowIcon />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function GroupHome() {
  return (
    <GroupPage>
      <Hero />
      <Marquee />
      <Statement />
      <section className="g-cos" id="companies" aria-labelledby="g-cos-h">
        <div className="g-wrap">
          <div className="g-sec-h g-split">
            <div>
              <span className="g-eb" data-rv>Our companies</span>
              <h2 id="g-cos-h" data-rv>
                Three firms. <span>One group.</span>
              </h2>
            </div>
            <p data-rv>Each company has its own specialists and its own website. Choose one to continue.</p>
          </div>
          <BrandDoors />
        </div>
      </section>
      <Ecosystem />
      <ContactBlock />
    </GroupPage>
  );
}
