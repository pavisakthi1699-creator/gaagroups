import React, { useEffect, useRef, useState } from "react";
import { Link, usePath } from "../group/router.jsx";
import { COMPANIES, siteHref } from "../group/sites.js";
import { CATEGORIES, HF } from "./hfData.js";

export const BASE = "/hirings-first";
export const HIRE = `${BASE}/hire`;

const P = {
  screened: "M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6zM9 12l2 2 4-4",
  deployable: "M5 19c1-4 4-7 8-8M13 11l-2-2 7-6 3 3-6 7zM5 19l3-1-2-2z",
  fast: "M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z",
  "finance-accounting": "M4 20V10M10 20V4M16 20v-7M22 20H2",
  "human-resources": "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM2 20c0-3.5 3-6 7-6s7 2.5 7 6M17 11a3 3 0 1 0 0-6M22 20c0-3-2-5-5-5.5",
  "sales-business-development": "M3 17l6-6 4 4 8-8M15 7h6v6",
  marketing: "M3 11v3l11 5V6L3 11ZM14 9a3 3 0 0 1 0 6M6 15l1 5h3l-1-4",
  operations: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19 12l2-1-1-3-2 .5-1.5-1.5.5-2-3-1-1 2h-2l-1-2-3 1 .5 2L6 7.5 4 7 3 10l2 1v2l-2 1 1 3 2-.5 1.5 1.5-.5 2 3 1 1-2h2l1 2 3-1-.5-2 1.5-1.5 2 .5 1-3-2-1z",
  technology: "M8 8l-4 4 4 4M16 8l4 4-4 4M14 5l-4 14",
  chev: "M9 6l6 6-6 6",
  check: "M5 12l4 4 10-10",
};
export function Icon({ name, size = 24, sw = 1.6 }) {
  return (
    <svg className="h-ic" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ strokeWidth: sw }}>
      <path d={P[name] || P.check} />
    </svg>
  );
}

export function HFLogo({ small }) {
  return (
    <span className={`h-logo${small ? " h-sm" : ""}`}>
      <img src={COMPANIES.hf.logo} alt="" />
      <span>
        <b>Hirings First</b>
        <small>A GAA Group company</small>
      </span>
    </span>
  );
}

function Header() {
  const path = usePath();
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("h-lock", open);
    return () => document.documentElement.classList.remove("h-lock");
  }, [open]);
  const close = () => setOpen(false);
  const nav = [
    [`${BASE}/talent`, "Talent", path.startsWith(`${BASE}/talent`)],
    [`${BASE}#process`, "How it works", false],
    [`${HIRE}?for=candidate`, "For candidates", false],
    ["/about", "About us", false],
    ["/contact?company=hf", "Contact", false],
  ];
  return (
    <>
      <a className="h-skip" href="#h-main">Skip to content</a>
      <header className={`h-hdr${solid ? " h-solid" : ""}`}>
        <div className="h-w h-hdr-in">
          <Link to={BASE} aria-label="Hirings First home" onClick={close}><HFLogo small /></Link>
          <nav className="h-nav" aria-label="Hirings First">
            {nav.map(([to, l, cur]) => <Link key={l} to={to} aria-current={cur ? "page" : undefined}>{l}</Link>)}
          </nav>
          <Link to="/" className="h-group">GAA Group</Link>
          <Link to={HIRE} className="h-pill h-hcta">Hire Talent</Link>
          <button type="button" className="h-burger" aria-expanded={open} aria-controls="h-menu" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((v) => !v)}>
            <span></span><span></span>
          </button>
        </div>
      </header>
      <div id="h-menu" className="h-menu" data-open={open} aria-hidden={!open}>
        <nav aria-label="Mobile">
          <Link to={BASE} onClick={close} tabIndex={open ? 0 : -1}>Home</Link>
          {nav.map(([to, l]) => <Link key={l} to={to} onClick={close} tabIndex={open ? 0 : -1}>{l}</Link>)}
          <Link to="/" onClick={close} tabIndex={open ? 0 : -1}>GAA Group</Link>
          <Link to={HIRE} onClick={close} className="h-pill" tabIndex={open ? 0 : -1}>Hire Talent</Link>
        </nav>
      </div>
    </>
  );
}

function Footer() {
  return (
    <footer className="h-foot">
      <div className="h-w">
        <div className="h-foot-top">
          <div className="h-foot-brand">
            <HFLogo />
            <p>Pre-screened professionals, ready to perform from day one.</p>
            {COMPANIES.hf.email && <a href={`mailto:${COMPANIES.hf.email}`}>{COMPANIES.hf.email}</a>}
          </div>
          <nav aria-label="Talent">
            <b>Talent</b>
            {CATEGORIES.map((c) => <Link key={c.slug} to={`${BASE}/talent/${c.slug}`}>{c.name}</Link>)}
          </nav>
          <nav aria-label="Hirings First">
            <b>Hirings First</b>
            <Link to={HIRE}>Hire talent</Link>
            <Link to={`${BASE}/talent`}>Explore candidates</Link>
            <Link to={`${HIRE}?for=candidate`}>Join our talent pool</Link>
            <Link to="/contact?company=hf">Contact</Link>
          </nav>
          <nav aria-label="GAA Group">
            <b>GAA Group</b>
            <Link to="/">Group home</Link>
            <Link to="/about">About us</Link>
            <Link to={siteHref("gaa", "/gaa-consulting")}>GAA Consulting ↗</Link>
            <Link to={siteHref("ff", "/filings-first")}>Filings First ↗</Link>
          </nav>
        </div>
        <div className="h-foot-bot">
          <span>© {new Date().getFullYear()} Hirings First. Part of GAA Group (G Akshay and Associates).</span>
          <span>Bengaluru, India</span>
        </div>
      </div>
    </footer>
  );
}

export function HFPage({ children }) {
  return (
    <div className="hfs">
      <Header />
      <main id="h-main">{children}</main>
      <Footer />
    </div>
  );
}

export function FinalBanner() {
  return (
    <section className="h-final">
      <div className="h-w">
        <h2>{HF.banner[0]}</h2>
        <p>{HF.banner[1]}</p>
        <Link to={HIRE} className="h-pill h-lg">Start Hiring</Link>
      </div>
    </section>
  );
}

// Anonymised talent card ("no names displayed initially")
export function TalentCard({ t }) {
  const cat = CATEGORIES.find((c) => c.slug === t.cat);
  return (
    <article className="h-tcard">
      <div className="h-tc-top">
        <span className="h-avatar" aria-hidden="true"><Icon name={t.cat} size={20} /></span>
        <span className="h-ex">Example profile</span>
      </div>
      <h3>{t.role}</h3>
      <p className="h-skills">{t.skills.join(" | ")}</p>
      <dl>
        <div><dt>Experience</dt><dd>{t.exp}</dd></div>
        <div><dt>Location</dt><dd>{t.city}</dd></div>
      </dl>
      <ul className="h-badges">
        <li><Icon name="check" size={14} sw={2.4} />Screened</li>
        <li><Icon name="check" size={14} sw={2.4} />Assessed</li>
      </ul>
      <Link to={`${HIRE}?role=${encodeURIComponent(t.role)}`} className="h-tc-cta">Request profile <Icon name="chev" size={14} sw={2} /></Link>
      <span className="h-sr">{cat ? cat.name : ""}</span>
    </article>
  );
}
