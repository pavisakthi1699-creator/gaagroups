// Header, footer and page wrapper shared by the group pages (Home, About us, Contact us)
// on all three domains. Floating glass header, full-screen mobile menu, statement footer.
import React, { useEffect, useState } from "react";
import { Link, usePath } from "./router.jsx";
import { COMPANIES, ORDER, GROUP, HERE, siteHref } from "./sites.js";
import { CURRENT } from "../brand.js";
import { useReveal, useMagnetic, useCursor } from "./motion.js";
import { ArrowIcon } from "./Icons.jsx";

export function GroupMark({ light = false }) {
  return (
    <span className={`g-mark${light ? " g-light" : ""}`} aria-label="GAA Group">
      <b>GAA</b>
      <i aria-hidden="true"></i>
      <span>Group</span>
    </span>
  );
}

const domainOf = (c) => c.domain.replace(/^https?:\/\/(www\.)?/, "");

export function GroupHeader() {
  const path = usePath();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("g-lock", open);
    const k = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", k);
    return () => {
      document.documentElement.classList.remove("g-lock");
      document.removeEventListener("keydown", k);
    };
  }, [open]);

  const items = [
    { to: "/", label: "Home", cur: path === "/" },
    { to: "/about", label: "About us", cur: path === "/about" },
    ...ORDER.map((k) => ({ to: siteHref(k, COMPANIES[k].home), label: COMPANIES[k].name, brand: k })),
    { to: "/contact", label: "Contact us", cur: path === "/contact" },
  ];
  const close = () => setOpen(false);

  return (
    <>
      <a className="g-skip" href="#main">Skip to content</a>
      <header className={`g-hdr${scrolled ? " g-scrolled" : ""}${open ? " g-open" : ""}`}>
        <div className="g-hdr-in">
          <Link to="/" className="g-home" aria-label="GAA Group home" onClick={close}>
            <GroupMark light />
          </Link>
          <nav className="g-nav" aria-label="Main">
            {items.map((it) => (
              <Link key={it.label} to={it.to} aria-current={it.cur ? "page" : undefined} className={it.brand ? "g-brand" : ""}>
                <span data-t={it.label}>{it.label}</span>
              </Link>
            ))}
          </nav>
          <Link to="/contact" className="g-btn g-accent g-sm g-hcta" data-mag>
            Book a consultation
          </Link>
          <button type="button" className="g-burger" aria-expanded={open} aria-controls="g-menu" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((v) => !v)}>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      <div id="g-menu" className="g-menu" data-open={open} aria-hidden={!open}>
        <nav aria-label="Mobile">
          {items.filter((it) => !it.brand).map((it, i) => (
            <Link key={it.label} to={it.to} onClick={close} tabIndex={open ? 0 : -1} style={{ "--i": i }} className="g-mlink">
              <span>{it.label}</span>
              <ArrowIcon />
            </Link>
          ))}
          <p className="g-mlabel" style={{ "--i": 4 }}>Our companies</p>
          {ORDER.map((k, i) => {
            const c = COMPANIES[k];
            return (
              <Link key={k} to={siteHref(k, c.home)} onClick={close} tabIndex={open ? 0 : -1} style={{ "--i": 5 + i }} className="g-mco">
                <span className="g-plate g-xs"><img src={c.logo} alt="" /></span>
                <span>
                  <b>{c.name}</b>
                  <small>{c.two}</small>
                </span>
                <ArrowIcon />
              </Link>
            );
          })}
          <Link to="/contact" onClick={close} tabIndex={open ? 0 : -1} className="g-btn g-accent g-block" style={{ "--i": 8 }}>
            Book a consultation
          </Link>
        </nav>
      </div>
    </>
  );
}

export function GroupFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="g-foot">
      <div className="g-wrap">
        <div className="g-foot-cta" data-rv>
          <h2>
            Ready when <span>you are.</span>
          </h2>
          <Link to="/contact" className="g-round" data-mag aria-label="Book a consultation">
            <span>Let's talk</span>
            <ArrowIcon />
          </Link>
        </div>

        <div className="g-foot-grid">
          <div className="g-foot-brand">
            <GroupMark light />
            <p>{GROUP.intro}</p>
            <span className="g-foot-office">{GROUP.office}</span>
          </div>
          <nav className="g-foot-links" aria-label="Group">
            <b>Group</b>
            <Link to="/">Home</Link>
            <Link to="/about">About us</Link>
            <Link to="/about#people">Our people</Link>
            <Link to="/contact">Contact us</Link>
            <Link to={siteHref("gaa", "/gaa-consulting/careers")}>Careers &amp; CS training</Link>
          </nav>
          {ORDER.map((k) => {
            const c = COMPANIES[k];
            return (
              <div className="g-foot-co" key={k}>
                <Link to={siteHref(k, c.home)} className="g-foot-logo" aria-label={`${c.name} website`}>
                  <span className="g-plate g-sm"><img src={c.logo} alt={`${c.name} logo`} /></span>
                </Link>
                <b>{c.name}</b>
                <span className="g-twow">{c.two}</span>
                <Link to={siteHref(k, c.home)}>{domainOf(c)}</Link>
                {c.email && <a href={`mailto:${c.email}`}>{c.email}</a>}
                {c.phone && <a href={`tel:${c.phone.replace(/\s/g, "")}`}>{c.phone}</a>}
              </div>
            );
          })}
        </div>

        <div className="g-foot-word" aria-hidden="true">
          GAA<span>Group</span>
        </div>

        <div className="g-foot-bot">
          <span>© {year} {GROUP.legalName}. All rights reserved.</span>
          <span>
            You are on the <b>{HERE.name}</b> website
          </span>
        </div>
      </div>
    </footer>
  );
}

function ScrollBar() {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        setP(h > 0 ? window.scrollY / h : 0);
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return <div className="g-progress" style={{ transform: `scaleX(${p})` }} aria-hidden="true" />;
}

// Wrapper for group pages
export function GroupPage({ children }) {
  const path = usePath();
  useReveal([path]);
  useMagnetic();
  useCursor();
  return (
    <div className="grp">
      <ScrollBar />
      <GroupHeader />
      <main id="main">{children}</main>
      <GroupFooter />
    </div>
  );
}

export const CURRENT_KEY = CURRENT;
