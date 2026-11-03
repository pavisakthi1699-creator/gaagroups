import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useRouter } from "../router";
import { COMPANIES, COMPANY, companyOf, NAV } from "../site";
import Icon from "./Icon";

/* One header for the whole domain. The brand on the left follows the company you are in. */
function searchIndex() {
  const items = [
    { t: "Home", k: "GAA Group", u: "/" },
    { t: "About Us", k: "GAA Group", u: "/about" },
    { t: "Our Team", k: "GAA Group", u: "/our-team" },
    { t: "Careers", k: "GAA Group", u: "/careers" },
    { t: "Insights and blog", k: "GAA Group", u: "/insights" },
    { t: "Compliance due date planner", k: "Insights", u: "/insights#planner" },
    { t: "Contact Us", k: "GAA Group", u: "/contact" },
    { t: "Privacy, terms and disclaimer", k: "Legal", u: "/privacy" },
  ];
  COMPANIES.forEach((c) => {
    items.push({ t: c.name, k: "Company", u: `/${c.id}` });
    c.services.forEach((s) => items.push({ t: s.name, k: c.name, u: s.path }));
  });
  return items;
}

export function Brand({ company, className = "brand" }) {
  if (!company) {
    return (
      <Link className={`${className} gb-brand`} to="/" aria-label="GAA Group home">
        <img src="/images/gaa-mark.webp" alt="GAA" width="560" height="251" />
      </Link>
    );
  }
  const c = COMPANY[company];
  return (
    <Link className={`${className} ff-brand`} to={`/${c.id}`} aria-label={`${c.name} home`}>
      <img src={c.logo} alt="" width="136" height="136" />
      <span><b>{c.name}</b><small>A GAA Group company</small></span>
    </Link>
  );
}

export default function Header() {
  const { path } = useRouter();
  const company = companyOf(path);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(false);
  const [q, setQ] = useState("");
  const [hide, setHide] = useState(false);
  const [solid, setSolid] = useState(false);
  const input = useRef(null);
  const panel = useRef(null);
  const index = useMemo(searchIndex, []);
  const svc = company ? COMPANY[company].services.find((s) => s.path === path) : null;
  const cta = svc ? `/contact#${svc.contact}` : company ? `/contact#${company}` : "/contact";
  const onCompany = !!company;

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 8);
      if (y < 80 || y < last - 4) setHide(false);
      else if (y > last + 4) setHide(true);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); setSearch(false); }, [path]);

  useEffect(() => {
    if (!search) return undefined;
    input.current && input.current.focus();
    const onKey = (e) => e.key === "Escape" && setSearch(false);
    const onClick = (e) => panel.current && !panel.current.contains(e.target) && !e.target.closest("#ieSearch") && setSearch(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("click", onClick); };
  }, [search]);

  const v = q.trim().toLowerCase();
  const results = index.filter((x) => (v ? `${x.t} ${x.k}`.toLowerCase().includes(v) : x.k === "Company")).slice(0, 9);
  const close = () => setSearch(false);
  const on = (p) => (path === p || (p !== "/" && path.startsWith(p + "/")) ? { className: "on", "aria-current": "page" } : {});

  return (
    <header className={`hdr${hide && !open && !search ? " hide" : ""}${solid ? " solid" : ""}`} id="hdr">
      <div className="hdr-in">
        <Brand company={company} />
        <nav className="nav" aria-label="Main">
          {NAV.filter((n) => n.show).map((n) => n.companies ? (
            <div key="co" className={`grp grp-mega${onCompany ? " on" : ""}`}>
              <button type="button" aria-haspopup="true">
                {n.label} <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" /></svg>
              </button>
              <div className="grp-panel mega">
                {COMPANIES.map((c) => (
                  <div className={`mg-col${company === c.id ? " cur" : ""}`} key={c.id}>
                    <Link className="mg-co" to={`/${c.id}`}>
                      <span className="mg-lg"><img src={c.logo} alt="" /></span>
                      <span><b>{c.name}</b><small>{c.tag}</small></span>
                    </Link>
                    {c.services.map((sv) => (
                      <Link key={sv.slug} to={sv.path} className={`mg-s${path === sv.path ? " cur" : ""}`}>{sv.name}<i>&rarr;</i></Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ) : <Link key={n.to} to={n.to} {...on(n.to)}>{n.label}</Link>)}
        </nav>
        <div className="ie-hr">
          <button type="button" className="ie-srch" id="ieSearch" aria-label="Search the website" aria-expanded={search} onClick={() => { setQ(""); setSearch((s) => !s); }}>
            <Icon name="search" />
          </button>
          <Link className="book ie-book" to={cta}>Book a Consultation <Icon name="arrow" /></Link>
        </div>
        <button className="burger" id="burger" type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          {open ? "✕" : "☰"}
        </button>
      </div>
      <div className={`mnav${open ? " open" : ""}`} id="mnav">
        {NAV.filter((n) => n.show).map((n) => n.companies ? COMPANIES.map((c) => (
          <React.Fragment key={c.id}>
            <span className="k">{c.name}</span>
            <Link to={`/${c.id}`}>Overview <span>&rarr;</span></Link>
            {c.services.map((sv) => <Link key={sv.slug} to={sv.path}>{sv.name} <span>&rarr;</span></Link>)}
          </React.Fragment>
        )) : <Link key={n.to} to={n.to}>{n.label} <span>&rarr;</span></Link>)}
        <Link className="cta" to={cta}>Book a Consultation</Link>
      </div>
      <div className={`ie-sp${search ? " open" : ""}`} id="ieSp" role="dialog" aria-label="Search the website" ref={panel}>
        <div className="ie-sp-in">
          <input ref={input} id="ieQ" value={q} onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { const a = panel.current.querySelector("#ieRes a"); if (a) a.click(); } }}
            placeholder="Search companies, services and pages" aria-label="Search the website" />
          <div id="ieRes">
            {results.length ? results.map((x) => (
              <Link key={x.t + x.u} to={x.u} onClick={close}>{x.t}<small>{x.k}</small></Link>
            )) : <p>No match. <Link to="/contact" onClick={close}>Ask our team</Link></p>}
          </div>
        </div>
      </div>
    </header>
  );
}
