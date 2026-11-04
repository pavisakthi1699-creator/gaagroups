import React from "react";
import { Link } from "../router";
import { SITE } from "../site";

/* GAA Group footer (Warm Cream design), the same on every page */
const Arrow = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" /></svg>;

/* to: a page on this website; href: an outside link; neither: shown but not clickable yet */
const COLS = [
  { title: "Corporate", links: [["About GAA", "/about"], ["Our Team", "/our-team"], ["Industries We Serve", "/about#connected"], ["Why GAA", "/#section-3"], ["Contact", "/contact"]] },
  { title: "Knowledge", links: [["Insights & Articles", "/insights"], ["Regulatory Updates", "/insights#gaa-consulting"], ["Resources & FAQs", "/insights#planner"], ["Case Studies", "/insights"]] },
  { title: "People & Platforms", links: [["Careers & CS Training", "/careers"], ["Hirings First", "/hirings-first"], ["Employee Portal", null], ["Management Login", "/admin"], ["CS Trainee Login", null], ["Client Portal", null]] },
];

function Item({ label, to }) {
  if (!to) return <span className="sf-soon" title="Coming soon">{label} <Arrow /></span>;
  if (to === "/admin") return <a href={to}>{label} <Arrow /></a>;
  return <Link to={to}>{label} <Arrow /></Link>;
}

export default function Footer() {
  return (
    <footer className="sf" id="footer" aria-label="Footer">
      <div className="sf-art" aria-hidden="true">
        <svg className="sf-tl" viewBox="0 0 600 560" preserveAspectRatio="none">
          <defs>
            <linearGradient id="sfA" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F7B48A" stopOpacity=".95" /><stop offset=".55" stopColor="#F7B48A" stopOpacity=".25" /><stop offset="1" stopColor="#F7B48A" stopOpacity="0" /></linearGradient>
            <linearGradient id="sfB" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#E98A45" stopOpacity=".9" /><stop offset="1" stopColor="#E98A45" stopOpacity="0" /></linearGradient>
            <filter id="sfF" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="10" /></filter>
          </defs>
          <path d="M0 0H330C230 40 120 120 0 240Z" fill="url(#sfA)" />
          <path d="M0 200C110 110 210 45 330 0" fill="none" stroke="url(#sfB)" strokeWidth="10" filter="url(#sfF)" />
          <path d="M0 212C112 120 214 52 336 0" fill="none" stroke="url(#sfB)" strokeWidth="1.6" />
        </svg>
        <svg className="sf-br" viewBox="0 0 1000 400" preserveAspectRatio="none">
          <defs>
            <linearGradient id="sfC" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#E98A45" stopOpacity="0" /><stop offset=".6" stopColor="#E98A45" stopOpacity=".7" /><stop offset="1" stopColor="#F7B48A" stopOpacity="1" /></linearGradient>
            <radialGradient id="sfR" cx="1" cy="1" r="1"><stop offset="0" stopColor="#F7B48A" stopOpacity=".5" /><stop offset=".5" stopColor="#F7B48A" stopOpacity=".12" /><stop offset="1" stopColor="#F7B48A" stopOpacity="0" /></radialGradient>
            <filter id="sfH" x="-10%" y="-50%" width="120%" height="200%"><feGaussianBlur stdDeviation="8" /></filter>
          </defs>
          <rect width="1000" height="400" fill="url(#sfR)" />
          <path d="M180 400C520 380 820 330 1000 190" fill="none" stroke="url(#sfC)" strokeWidth="9" filter="url(#sfH)" />
          <path d="M180 400C520 380 820 330 1000 190" fill="none" stroke="url(#sfC)" strokeWidth="2" />
          <path d="M420 400C680 392 880 360 1000 290" fill="none" stroke="url(#sfC)" strokeWidth="1.2" opacity=".7" />
        </svg>
      </div>
      <div className="sf-in">
        <div className="sf-top">
          <div className="sf-brand">
            <Link className="sf-logo" to="/" aria-label="GAA Group home"><img src="/images/footer/gaa.png" alt="GAA" width="300" height="134" loading="lazy" /></Link>
            <span className="sf-bar" />
            <div className="sf-cos">
              <Link to="/gaa-consulting" aria-label="GAA Consulting"><img src="/images/footer/gaa-consulting-w.png" alt="GAA Consulting" loading="lazy" /></Link>
              <i />
              <Link to="/filings-first" aria-label="Filings First"><img src="/images/footer/filings-first-w.png" alt="Filings First" loading="lazy" /></Link>
              <i />
              <Link to="/hirings-first" aria-label="Hirings First"><img src="/images/footer/hirings-first-w.png" alt="Hirings First" loading="lazy" /></Link>
            </div>
          </div>
          {COLS.map((c) => (
            <div className="sf-col" key={c.title}>
              <h4>{c.title}</h4>
              <nav aria-label={c.title}>{c.links.map(([l, to]) => <Item key={l} label={l} to={to} />)}</nav>
            </div>
          ))}
          <div className="sf-col sf-get">
            <h4>Get in Touch</h4>
            <address>
              <span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>Bengaluru, Karnataka, India</span>
              <a href={`mailto:${SITE.email}`}><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3.5 6.5 8.5 6.5 8.5-6.5" /></svg>{SITE.email}</a>
              <a href={`tel:${SITE.phoneHref}`}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg>{SITE.phone}</a>
              {SITE.linkedin
                ? <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer"><b className="sf-in-i">in</b>Follow us on LinkedIn</a>
                : <span><b className="sf-in-i">in</b>Follow us on LinkedIn</span>}
            </address>
            <Link className="sf-cta" to="/contact">Business Enquiries <Arrow /></Link>
          </div>
        </div>
        <div className="sf-bot">
          <span>&copy; {new Date().getFullYear()} GAA. All Rights Reserved.</span>
          <nav aria-label="Legal"><Link to="/privacy#privacy">Privacy Policy</Link><i>|</i><Link to="/privacy#terms">Terms of Use</Link><i>|</i><Link to="/privacy#disclaimer">Disclaimer</Link></nav>
        </div>
      </div>
    </footer>
  );
}
