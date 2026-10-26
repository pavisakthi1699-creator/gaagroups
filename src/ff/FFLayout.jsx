import React, { useEffect, useRef, useState } from "react";
import { Link, usePath } from "../group/router.jsx";
import { COMPANIES, siteHref } from "../group/sites.js";
import { FF, SERVICES } from "./ffData.js";

export const BASE = "/filings-first";
export const CONTACT = "/contact?company=ff";

const ICON_PATHS = {
  ledger: "M5 4h14v16H5zM5 9h14M9 4v16",
  book: "M5 5a2 2 0 0 1 2-2h12v16H7a2 2 0 0 0-2 2zM5 5v16M9 7h6",
  tax: "M6 18 18 6M7.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM16.5 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z",
  gst: "M4 7h16v12H4zM4 11h16M8 15h3M15 4v3M9 4v3",
  shield: "M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6zM9 12l2 2 4-4",
  spark: "M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6",
  cal: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
  arrow: "M5 12h14M13 6l6 6-6 6",
};
export function Icon({ name, size = 24 }) {
  return (
    <svg className="f-ic" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d={ICON_PATHS[name] || ICON_PATHS.spark} />
    </svg>
  );
}

export function FFLogo() {
  return (
    <span className="f-logo">
      <span className="f-logo-plate"><img src={COMPANIES.ff.logo} alt="" /></span>
      <span className="f-logo-tx">
        <b>Filings First</b>
        <small>A GAA Group company</small>
      </span>
    </span>
  );
}

function Header() {
  const path = usePath();
  const [open, setOpen] = useState(false);
  const [hide, setHide] = useState(false);
  const last = useRef(0);
  useEffect(() => {
    const on = () => {
      const y = window.scrollY;
      if (y < 120 || y < last.current - 4) setHide(false);
      else if (y > last.current + 4) setHide(true);
      last.current = y;
    };
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("f-lock", open);
    return () => document.documentElement.classList.remove("f-lock");
  }, [open]);
  const close = () => setOpen(false);
  const nav = [
    [BASE, "Home", path === BASE],
    [`${BASE}#services`, "Services", path.startsWith(`${BASE}/services`)],
    [`${BASE}/compliance-calendar`, "Compliance calendar", path === `${BASE}/compliance-calendar`],
    ["/about", "About us", false],
    [CONTACT, "Contact", false],
  ];
  return (
    <>
      <a className="f-skip" href="#f-main">Skip to content</a>
      <div className="f-util">
        <div className="f-w">
          <Link to="/">← GAA Group</Link>
          <span>
            Also in the group: <Link to={siteHref("gaa", "/gaa-consulting")}>GAA Consulting</Link> · <Link to={siteHref("hf", "/hirings-first")}>Hirings First</Link>
          </span>
        </div>
      </div>
      <header className={`f-hdr${hide && !open ? " f-hide" : ""}`}>
        <div className="f-w f-hdr-in">
          <Link to={BASE} aria-label="Filings First home" onClick={close}><FFLogo /></Link>
          <nav className="f-nav" aria-label="Filings First">
            {nav.map(([to, l, cur]) => (
              <Link key={l} to={to} aria-current={cur ? "page" : undefined}>{l}</Link>
            ))}
          </nav>
          <Link to={CONTACT} className="f-btn f-primary f-hcta">Get compliant</Link>
          <button type="button" className="f-burger" aria-expanded={open} aria-controls="f-menu" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((v) => !v)}>
            <span></span><span></span>
          </button>
        </div>
      </header>
      <div id="f-menu" className="f-menu" data-open={open} aria-hidden={!open}>
        <nav aria-label="Mobile">
          {nav.map(([to, l]) => <Link key={l} to={to} onClick={close} tabIndex={open ? 0 : -1}>{l}</Link>)}
          <div className="f-menu-svc">
            {SERVICES.map((s) => <Link key={s.slug} to={`${BASE}/services/${s.slug}`} onClick={close} tabIndex={open ? 0 : -1}>{s.name}</Link>)}
          </div>
          <Link to={CONTACT} onClick={close} className="f-btn f-primary" tabIndex={open ? 0 : -1}>Get compliant</Link>
        </nav>
      </div>
    </>
  );
}

function Footer() {
  return (
    <footer className="f-foot">
      <div className="f-w">
        <div className="f-foot-top">
          <div className="f-foot-brand">
            <FFLogo />
            <p>{FF.blurb}</p>
            <p className="f-foot-addr">
              {FF.address}
              <br />
              <a href={`tel:${COMPANIES.ff.phone.replace(/\s/g, "")}`}>{COMPANIES.ff.phone}</a> · <a href={`mailto:${COMPANIES.ff.email}`}>{COMPANIES.ff.email}</a>
            </p>
          </div>
          <nav aria-label="Services">
            <b>Services</b>
            {SERVICES.map((s) => <Link key={s.slug} to={`${BASE}/services/${s.slug}`}>{s.name}</Link>)}
          </nav>
          <nav aria-label="Company">
            <b>Company</b>
            <Link to="/about">About GAA Group</Link>
            <Link to={`${BASE}/compliance-calendar`}>Compliance calendar</Link>
            <Link to={CONTACT}>Contact</Link>
            <Link to={siteHref("gaa", "/gaa-consulting/careers")}>Careers</Link>
          </nav>
          <nav aria-label="GAA Group">
            <b>GAA Group</b>
            <Link to="/">Group home</Link>
            <Link to={siteHref("gaa", "/gaa-consulting")}>GAA Consulting ↗</Link>
            <Link to={siteHref("hf", "/hirings-first")}>Hirings First ↗</Link>
          </nav>
        </div>
        <div className="f-foot-bot">
          <span>© {new Date().getFullYear()} Filings First. Part of GAA Group (G Akshay and Associates).</span>
          <span>Due dates shown are a general guide. Always confirm with current notifications.</span>
        </div>
      </div>
    </footer>
  );
}

export function FFPage({ children }) {
  return (
    <div className="ffs">
      <Header />
      <main id="f-main">{children}</main>
      <Footer />
    </div>
  );
}

export function CtaBand({ title = "Never miss a deadline.", text = "Tell us about your business and we will set up your compliance calendar within a week." }) {
  return (
    <section className="f-cta">
      <div className="f-w f-cta-in">
        <div>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        <div className="f-acts">
          <Link to={CONTACT} className="f-btn f-accent">Get compliant</Link>
          <a href={`tel:${COMPANIES.ff.phone.replace(/\s/g, "")}`} className="f-btn f-ghost">Call {COMPANIES.ff.phone}</a>
        </div>
      </div>
    </section>
  );
}
