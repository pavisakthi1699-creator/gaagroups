import React, { useEffect, useRef, useState } from "react";
import { GAA_NAV, GAA_FOOTER_GROUPS } from "../../data/gaaContent";
import { GAA_SERVICES } from "../../data/gaaServices";
import { siteHref } from "../../group/sites.js";

// Sister companies live on their own domains
const EXTERNAL = { "filings-first": () => siteHref("ff", "/filings-first"), "hirings-first": () => siteHref("hf", "/hirings-first") };

// Services menu uses the five services from the GAA Consulting Services design
const MENU = GAA_SERVICES.map((s) => ({ slug: s.slug, navName: s.name, navDesc: s.ideal }));

/* Build an href + click handler for internal links.
   `to` is a GAA sub path ("practices", "practices/fdi-fema", "" for GAA home),
   optionally with an in-page anchor ("insights#calendar"),
   or a group page prefixed with "@" ("@home", "@contact", "@about"). */
export function useLink(onNavigate) {
  return (to, extra = {}) => {
    const [path, anchor] = to.split("#");
    const group = path.startsWith("@");
    const page = group ? path.slice(1) : path ? `gaa-consulting/${path}` : "gaa-consulting";
    if (group && EXTERNAL[page]) return { href: EXTERNAL[page]() };
    const href = page === "home" ? "/" : page === "contact" ? "/contact?company=gaa" : `/${page}`;
    return {
      href,
      onClick: (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        if (extra.before) extra.before();
        if (onNavigate) onNavigate(page, extra.intent || null);
        if (anchor)
          setTimeout(() => document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth" }), 450);
      },
    };
  };
}

/* ------------------------------------------------------------------ */
/* Header: familiar menu labels + Services mega menu + mobile menu     */
/* ------------------------------------------------------------------ */
export function GaaHeader({ link, active = "" }) {
  const [dd, setDd] = useState(false);
  const [mob, setMob] = useState(false);
  const ddRef = useRef(null);
  const closeT = useRef(0);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setDd(false);
        setMob(false);
      }
    };
    const onDown = (e) => {
      if (ddRef.current && !ddRef.current.contains(e.target)) setDd(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("gaa-lock", mob);
    return () => document.documentElement.classList.remove("gaa-lock");
  }, [mob]);

  const open = () => {
    clearTimeout(closeT.current);
    setDd(true);
  };
  const close = () => {
    closeT.current = setTimeout(() => setDd(false), 140);
  };
  const isCur = (to) =>
    to === active || (to === "practices" && (active === "practices" || active === "india-entry"));
  const shut = { before: () => { setDd(false); setMob(false); } };

  return (
    <>
      <div id="pg"></div>
      <header id="hdr" className={`gh${dd ? " dd-on" : ""}`}>
        <div className="hd">
          <a {...link("", shut)} aria-label="GAA Consulting home" className="lg">
            <img src="/gaa-consulting-logo.png" alt="GAA Consulting" />
          </a>
          <nav aria-label="Main" className="gnav">
            {GAA_NAV.map(([to, label]) =>
              to === "practices" ? (
                <div className="ddw" key={to} ref={ddRef} onMouseEnter={open} onMouseLeave={close}>
                  <button
                    type="button"
                    className="ddb"
                    aria-expanded={dd}
                    aria-controls="gaa-services-menu"
                    aria-current={isCur(to) ? "page" : undefined}
                    onClick={() => setDd((v) => !v)}
                  >
                    {label}
                    <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" /></svg>
                  </button>
                  <div className="mega" id="gaa-services-menu" data-open={dd}>
                    <div className="mega-in">
                      <ul className="mega-list">
                        {MENU.map((p) => (
                          <li key={p.slug}>
                            <a {...link(`practices/${p.slug}`, shut)}>
                              <b>{p.navName}</b>
                              <span>{p.navDesc}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                      <div className="mega-side">
                        <a className="mega-feat" {...link("india-entry", shut)}>
                          <span className="k">For foreign companies</span>
                          <b>Set up your business in India</b>
                          <span className="d">Subsidiary, JV, LLP or branch office, incorporated and FEMA compliant.</span>
                          <i aria-hidden="true">↗</i>
                        </a>
                        <a className="mega-all" {...link("practices", shut)}>
                          View all services
                        </a>
                        <a className="mega-all" {...link("how-we-work", shut)}>
                          How we work and our fees
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <a key={label} {...link(to, shut)} aria-current={isCur(to) ? "page" : undefined}>
                  {label}
                </a>
              )
            )}
          </nav>
          <a className="book" {...link("@contact", shut)}>
            Book a Consultation
          </a>
          <button
            type="button"
            className="burger"
            aria-expanded={mob}
            aria-controls="gaa-mobile-menu"
            aria-label={mob ? "Close menu" : "Open menu"}
            onClick={() => setMob((v) => !v)}
          >
            <span></span>
            <span></span>
          </button>
        </div>
      </header>
      <div className="mnav" id="gaa-mobile-menu" data-open={mob} aria-hidden={!mob}>
        <div className="mnav-in">
          <a {...link("", shut)} tabIndex={mob ? 0 : -1}>Home</a>
          <a {...link("@about", shut)} tabIndex={mob ? 0 : -1}>About Us</a>
          <details>
            <summary tabIndex={mob ? 0 : -1}>Services</summary>
            <div>
              {MENU.map((p) => (
                <a key={p.slug} {...link(`practices/${p.slug}`, shut)} tabIndex={mob ? 0 : -1}>
                  {p.navName}
                </a>
              ))}
              <a {...link("india-entry", shut)} tabIndex={mob ? 0 : -1}>Set Up in India</a>
              <a {...link("practices", shut)} tabIndex={mob ? 0 : -1}>All services</a>
            </div>
          </details>
          <a {...link("industries", shut)} tabIndex={mob ? 0 : -1}>Industries</a>
          <a {...link("people", shut)} tabIndex={mob ? 0 : -1}>Our Team</a>
          <a {...link("@contact", shut)} tabIndex={mob ? 0 : -1}>Contact Us</a>
          <a className="btn o" {...link("@contact", shut)} tabIndex={mob ? 0 : -1}>
            Book a Consultation
          </a>
        </div>
      </div>
    </>
  );
}

/* Strip under the header: back to group + breadcrumb */
export function GaaSubBar({ link, crumbs = [] }) {
  return (
    <div className="sbar">
      <div className="w">
        <a className="back" {...link("@home")}>
          <span>←</span>
          <span>Back to GAA Group</span>
        </a>
        <nav className="crumbs" aria-label="Breadcrumb">
          <a {...link("")}>Home</a>
          {crumbs.map(([to, label], k) => (
            <React.Fragment key={label}>
              <i aria-hidden="true">/</i>
              {k === crumbs.length - 1 || to == null ? (
                <span aria-current="page">{label}</span>
              ) : (
                <a {...link(to)}>{label}</a>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>
    </div>
  );
}

export function GaaFooter({ link }) {
  return (
    <footer className="gf">
      <div className="w gf-top">
        <div className="gf-cta">
          <p className="gf-big">Have a compliance or transaction question?</p>
          <a className="btn o" {...link("@contact")}>
            Book a Consultation <span className="ar">→</span>
          </a>
        </div>
        {GAA_FOOTER_GROUPS.map(([title, items]) => (
          <nav className="gf-col" key={title} aria-label={title}>
            <b>{title}</b>
            {items.map(([to, label]) => (
              <a key={label} {...link(to)}>
                {label}
              </a>
            ))}
          </nav>
        ))}
      </div>
      <div className="ft">
        <img src="/gaa-consulting-logo.png" alt="GAA Consulting" />
        <div>
          <a data-site="gaa" {...link("")}>GAA Consulting</a>
          <a data-site="filings" {...link("@filings-first")}>Filings First ↗</a>
          <a data-site="hirings" {...link("@hirings-first")}>Hirings First ↗</a>
          <a {...link("@about")}>About us</a>
          <a {...link("@contact")}>Contact us</a>
        </div>
        <span>© 2026 · All rights reserved</span>
      </div>
    </footer>
  );
}

/* Hero headline with the same line-mask + hover-skew words as the home hero. */
export function HeroTitle({ lines, em = [] }) {
  return (
    <h1 aria-label={lines.join(" ")}>
      {lines.map((ln, i) => {
        const words = ln.split(" ").map((w, k) => (
          <React.Fragment key={k}>
            {k > 0 && " "}
            <span className="hw">{w}</span>
          </React.Fragment>
        ));
        return (
          <span className="ln" key={i} aria-hidden="true">
            <span>{em.includes(i) ? <em>{words}</em> : words}</span>
          </span>
        );
      })}
    </h1>
  );
}

function Ticker({ items }) {
  return (
    <div className="tk" aria-hidden="true">
      <div>
        {[0, 1, 2, 3].flatMap((r) =>
          items.map((t, k) => (
            <React.Fragment key={`${r}-${k}`}>
              <span>{t}</span>
              <span className="s">✦</span>
            </React.Fragment>
          ))
        )}
      </div>
    </div>
  );
}

/* Inner-page hero.
   variant "stack": headline left, stacked card right (same device as the GAA home hero).
   variant "type":  oversized headline across the page, intro + actions in a lower band,
                    facts in an open row (no card). */
export function SubHero({ tag, lines, em, sub, actions, aside, facts, ticker, variant = "stack" }) {
  if (variant === "type") {
    return (
      <section className="hero6 hsub htype" id="top">
        <div className="w">
          <span className="tag6 e3" style={{ "--t": ".05s" }}>{tag}</span>
          <HeroTitle lines={lines} em={em} />
          <div className="ht-low e3" style={{ "--t": ".55s" }}>
            <p className="sub6">{sub}</p>
            {actions && <div className="acts">{actions}</div>}
          </div>
          {facts && (
            <dl className="facts e3" style={{ "--t": ".75s" }}>
              {facts.map(([n, l], i) => (
                <div key={`${n}-${l}-${i}`}>
                  <dt>{n}</dt>
                  <dd>{l}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
        {ticker && <Ticker items={ticker} />}
      </section>
    );
  }
  return (
    <section className="hero6 hsub" id="top">
      <span className="sect" aria-hidden="true">§</span>
      <div className="w h6main">
        <div>
          <span className="tag6 e3" style={{ "--t": ".05s" }}>{tag}</span>
          <HeroTitle lines={lines} em={em} />
          <p className="sub6 e3" style={{ "--t": ".55s" }}>{sub}</p>
          {actions && <div className="acts e3" style={{ "--t": ".7s" }}>{actions}</div>}
        </div>
        {aside && (
          <div className="stackc e3" style={{ "--t": ".4s" }}>
            <div className="lyr l3"></div>
            <div className="lyr l2"></div>
            <div className="front">{aside}</div>
          </div>
        )}
      </div>
      {ticker && <Ticker items={ticker} />}
    </section>
  );
}

export function GlanceCard({ head = "At a glance", rows, note }) {
  return (
    <>
      <div className="fh">
        <span>{head}</span>
        <span>GAA Consulting</span>
      </div>
      <dl className="gl">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      {note && <p className="fnote">{note}</p>}
    </>
  );
}

/* Split section: sticky heading column on the left, content on the right */
export function Split({ id, alt, dark, title, p, actions, children, wide }) {
  return (
    <section className={`s split${alt ? " alt" : ""}${dark ? " dk" : ""}`} id={id}>
      <div className={`w sp-g${wide ? " wide" : ""}`}>
        <div className="sp-h">
          <h2>{title}</h2>
          {p && <p>{p}</p>}
          {actions && <div className="acts">{actions}</div>}
        </div>
        <div className="sp-c">{children}</div>
      </div>
    </section>
  );
}

/* Centered-left section heading with intro on the right of the heading */
export function SectionHead({ children, p }) {
  return (
    <div className="shd">
      <h2>{children}</h2>
      {p && <p>{p}</p>}
    </div>
  );
}

/* Ledger rows: full-width typographic list that floods ink on hover.
   items: [{ key, to, title, desc, meta, extra }] */
export function Ledger({ link, items, numbered = false, big = false }) {
  return (
    <ol className={`ledger${big ? " big" : ""}${numbered ? "" : " nn"}`}>
      {items.map((it, i) => (
        <li key={it.key || it.title}>
          <a {...link(it.to, it.linkExtra || {})}>
            {numbered && <span className="lg-n">{String(i + 1).padStart(2, "0")}</span>}
            <span className="lg-t">{it.title}</span>
            <span className="lg-d">
              {it.desc}
              {it.extra && <span className="lg-x">{it.extra}</span>}
            </span>
            {it.meta && <span className="lg-m">{it.meta}</span>}
            <span className="lg-a" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M6 18 18 6M9 6h9v9" /></svg>
            </span>
          </a>
        </li>
      ))}
    </ol>
  );
}

export function CtaBand({ link, title, em, p, intent }) {
  return (
    <section className="s band">
      <span className="orb"></span>
      <span className="orb"></span>
      <div className="w">
        <h2>
          {title} <em>{em}</em>
        </h2>
        <p>{p}</p>
        <div className="acts">
          <a className="btn o" {...link("@contact", { intent })}>
            Book a Consultation <span className="ar">→</span>
          </a>
          <a className="btn g" {...link("practices")}>
            View All Services
          </a>
        </div>
      </div>
    </section>
  );
}

export function FaqList({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="faq">
      {items.map(([q, a], i) => {
        const isOpen = open === i;
        const id = `faq-${i}-${q.length}`;
        return (
          <div className="faq-i" key={q}>
            <button type="button" aria-expanded={isOpen} aria-controls={id} onClick={() => setOpen(isOpen ? -1 : i)}>
              <b>{q}</b>
              <span className="pm" aria-hidden="true"></span>
            </button>
            <div className="fa" id={id} role="region">
              <div>
                <p>{a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Ring() {
  return <div id="gaa-cursor-ring" aria-hidden="true"></div>;
}
