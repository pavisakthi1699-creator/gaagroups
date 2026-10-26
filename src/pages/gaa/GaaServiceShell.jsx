import React, { useEffect, useRef, useState } from "react";
import logoMain from "../../assets/logo-main.png";
import { GAA_FIRM, OTHER_FIRMS } from "../../data/gaaServices";
import { siteHref } from "../../group/sites.js";

/* Shared pieces for the GAA Consulting Services page and the service detail pages,
   built from the "Service Detail" / "GAA Consulting Services" designs. */

// Scroll state used by both pages: header hide/show, scroll position, viewport width, mount flag
export function useScrollState(onMeasure) {
  const lastY = useRef(0);
  const raf = useRef(0);
  const [st, setSt] = useState({ y: 0, up: true, vw: typeof window !== "undefined" ? window.innerWidth : 1400 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    const measure = () => {
      const y = window.scrollY;
      setSt((s) => {
        const up = y < 120 || y < lastY.current - 2 ? true : y > lastY.current + 2 ? false : s.up;
        lastY.current = y;
        return { y, up, vw: window.innerWidth };
      });
      if (onMeasure) onMeasure();
    };
    const onScroll = () => {
      if (raf.current) return;
      raf.current = requestAnimationFrame(() => {
        raf.current = 0;
        measure();
      });
    };
    document.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    measure();
    const t = setTimeout(() => setMounted(true), 80);
    return () => {
      document.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf.current);
      clearTimeout(t);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { ...st, mounted };
}

// Internal link helper: page names are the ones App.handleNavigate understands
export function useNav(onNavigate) {
  return (page) => ({
    href: page === "home" ? "/" : page === "contact" ? "/contact?company=gaa" : `/${page}`,
    onClick: (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      if (onNavigate) onNavigate(page);
    },
  });
}

export const SERVICES_PAGE = "gaa-consulting/practices";
export const servicePage = (slug) => `gaa-consulting/practices/${slug}`;

export function jumpTo(id) {
  return (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };
}

export function SvHeader({ up, nav }) {
  return (
    <header className="sv-hdr" style={{ transform: `translateY(${up ? 0 : -100}%)` }}>
      <div className="sv-hdr-in">
        <a {...nav("home")} className="sv-logo" aria-label="GAA Group home">
          <img src={logoMain} alt="GAA Consulting" />
        </a>
        <nav className="sv-nav" aria-label="Main">
          <a {...nav("home")}>Home</a>
          <a {...nav("about")}>About us</a>
          {OTHER_FIRMS.map((f) => (
            <a key={f.key} href={siteHref(f.site, f.home)} className="sv-firm">{f.name}</a>
          ))}
          <a {...nav(SERVICES_PAGE)} className="sv-firm x-cur" aria-current="page">{GAA_FIRM.name}</a>
        </nav>
        <a href="#contact" onClick={jumpTo("contact")} className="sv-cta">Start a conversation</a>
      </div>
    </header>
  );
}

// Email box shared by the contact sections: keeps the email and opens the full contact form
export function CallbackForm({ onNavigate }) {
  const [email, setEmail] = useState("");
  const submit = (e) => {
    e.preventDefault();
    try {
      sessionStorage.setItem("gaa-intro-email", email);
    } catch (err) {
      /* storage unavailable */
    }
    if (onNavigate) onNavigate("contact");
  };
  return (
    <form className="sv-form" onSubmit={submit}>
      <label className="sv-sr" htmlFor="sv-email">Your work email</label>
      <input id="sv-email" type="email" required placeholder="Your work email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button type="submit">Request a callback</button>
    </form>
  );
}

export function SvFootBar({ nav }) {
  return (
    <div className="sv-foot">
      <span className="x-lgw"><img src={logoMain} alt="GAA Consulting" /></span>
      <div>
        {OTHER_FIRMS.map((f) => (
          <a key={f.key} href={siteHref(f.site, f.home)}>{f.name}</a>
        ))}
        <a {...nav(SERVICES_PAGE)}>{GAA_FIRM.name}</a>
      </div>
      <span>© 2026 · All rights reserved</span>
    </div>
  );
}
