import React, { useEffect, useRef, useState } from "react";
import TEAM from "../data/team.json";

/* Our Team: the same photo mosaic as the GAA Group website. Photos change a few at a time; hover (or tap on
   phones) shows who it is. Three tiles carry the group's words. */
const TILES = 34;
const WORDS = [
  { t: "w", cls: "w-o", label: "Advisory" },
  { t: "w", cls: "w-k", label: "Compliance" },
  { t: "w", cls: "w-c", label: "Talent" },
];
/* Partners section: edit this list (names as in src/data/team.json) to change who is shown, in this order */
/* Partners section. Add each partner's LinkedIn address in linkedin: "" to make the icon clickable. */
const PARTNER_CARDS = [
  { name: "Akshay G", role: "Partner – Regulatory & NBFC", text: "Focuses on NBFC regulation, RBI compliance, governance and risk advisory.", photo: "/images/partners/akshay-g.webp", linkedin: "" },
  { name: "Akshitha B R", role: "Partner – Corporate & Transactions", text: "Advises on corporate structuring, fundraising, M&A and strategic corporate actions.", photo: "/images/partners/akshitha-b-r.webp", linkedin: "" },
  { name: "Aroop Prabhu", role: "Partner – Finance & Operations", text: "Drives finance, accounting, taxation and operational excellence across the Group.", photo: "/images/partners/aroop-prabhu.webp", linkedin: "" },
  { name: "Ravi Keshava K M", role: "Partner – Global Business & FEMA", text: "Leads India entry, FEMA advisory and cross-border compliance for international clients.", photo: "/images/partners/ravi-keshava-k-m.webp", linkedin: "" },
  { name: "Swathi Yadav", role: "Partner – Compliance & Governance", text: "Oversees secretarial compliance, corporate governance and regulatory advisory.", photo: "/images/partners/swathi-yadav.webp", linkedin: "" },
]
const POOL = TEAM.map((p) => ({ t: "p", src: p.photo, name: p.name, role: p.role, co: p.company }));

function shuffle(a) {
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

function Layer({ it, nx }) {
  if (it.t === "w") return <div className={`ly ly-w ${it.cls}${nx ? " nx" : ""}`}><span>{it.label}</span></div>;
  return (
    <div className={`ly${nx ? " nx" : ""}`}>
      <img src={it.src} alt={it.name} />
      <figcaption><b>{it.name}</b><small>Bengaluru</small></figcaption>
    </div>
  );
}

export default function Team() {
  const sec = useRef(null);
  const tileEls = useRef([]);
  const [tiles, setTiles] = useState(() => Array.from({ length: TILES }, () => []));
  const [tap, setTap] = useState(-1);
  const items = useRef([]);
  const busy = useRef({});
  const tapRef = useRef(-1);
  tapRef.current = tap;

  useEffect(() => {
    const vis = () => tileEls.current.map((el, k) => (el && el.offsetParent !== null ? k : -1)).filter((k) => k >= 0);
    const pool = shuffle(POOL);
    const it = Array.from({ length: TILES }, (_, k) => pool[k % pool.length]);
    shuffle(vis()).slice(0, WORDS.length).forEach((k, i) => { it[k] = WORDS[i]; });
    items.current = it;
    let uid = 0;
    setTiles(it.map((x) => [{ id: uid++, it: x, nx: false }]));
    requestAnimationFrame(() => requestAnimationFrame(() => sec.current && sec.current.classList.add("in")));

    const timers = [];
    const put = (k, x) => {
      busy.current[k] = Date.now() + 1400;
      items.current[k] = x;
      const id = uid++;
      setTiles((t) => t.map((ls, i) => (i === k ? [...ls, { id, it: x, nx: true }] : ls)));
      requestAnimationFrame(() => requestAnimationFrame(() =>
        setTiles((t) => t.map((ls, i) => (i === k ? ls.map((l) => (l.id === id ? { ...l, nx: false } : l)) : ls)))));
      timers.push(setTimeout(() => setTiles((t) => t.map((ls, i) => (i === k ? ls.filter((l) => l.id >= id) : ls))), 800));
    };
    const freePhoto = () => {
      const f = pool.filter((p) => !items.current.includes(p));
      return f.length ? f[Math.floor(Math.random() * f.length)] : null;
    };
    const rnd = (a) => a[Math.floor(Math.random() * a.length)];
    let n = 0;
    const tick = () => {
      if (document.hidden) return;
      n++;
      const now = Date.now();
      const ks = vis().filter((k) => !tileEls.current[k].matches(":hover") && !(busy.current[k] > now) && tapRef.current !== k);
      const ph = ks.filter((k) => items.current[k].t === "p");
      const wd = ks.filter((k) => items.current[k].t === "w");
      if (n % 3 === 0 && wd.length && ph.length) {
        const a = rnd(wd), b = rnd(ph), w = items.current[a], p = freePhoto() || items.current[b];
        put(b, w); put(a, p);
      } else if (ph.length) {
        const c = rnd(ph), q = freePhoto();
        if (q) put(c, q);
      }
    };
    /* about half of the tiles are changing at any moment: 4 tiles every 0.5s, each tile rests 1.4s */
    let iv = null;
    if (!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches)) iv = setInterval(() => { tick(); tick(); tick(); tick(); }, 500);
    const offTap = (e) => { if (!e.target.closest("#hmGrid")) setTap(-1); };
    document.addEventListener("click", offTap);
    return () => { clearInterval(iv); timers.forEach(clearTimeout); document.removeEventListener("click", offTap); };
  }, []);

  const onTile = (k) => {
    if (!items.current[k] || items.current[k].t !== "p") return setTap(-1);
    setTap((t) => (t === k ? -1 : k));
  };
  const toFooter = (e) => {
    e.preventDefault();
    const t = document.getElementById("partners");
    if (t) window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY, behavior: "smooth" });
  };

  /* Partners: one card at a time on mobile, swipe or use the arrows; moves on by itself until touched */
  const ppRef = useRef(null);
  const ppPaused = useRef(false);
  const [ppCur, setPpCur] = useState(0);
  const ppGo = (i, user = true) => {
    if (user) ppPaused.current = true;
    const el = ppRef.current;
    setPpCur(i);
    if (el && el.children[i]) el.scrollTo({ left: el.children[i].offsetLeft - el.offsetLeft, behavior: "smooth" });
  };
  useEffect(() => {
    const el = ppRef.current;
    if (!el) return undefined;
    const isMob = () => window.matchMedia && window.matchMedia("(max-width: 899px)").matches;
    const onScroll = () => {
      const w = el.children[0] ? el.children[0].getBoundingClientRect().width + 14 : 1;
      setPpCur(Math.max(0, Math.min(PARTNER_CARDS.length - 1, Math.round(el.scrollLeft / w))));
    };
    const stop = () => { ppPaused.current = true; };
    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("touchstart", stop, { passive: true });
    const t = setInterval(() => {
      if (ppPaused.current || document.hidden || !isMob()) return;
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      setPpCur((c) => {
        const n = (c + 1) % PARTNER_CARDS.length;
        if (el.children[n]) el.scrollTo({ left: el.children[n].offsetLeft - el.offsetLeft, behavior: "smooth" });
        return n;
      });
    }, 3600);
    return () => { clearInterval(t); el.removeEventListener("scroll", onScroll); el.removeEventListener("touchstart", stop); };
  }, []);

  return (
    <main className="gtm" id="top">
      <section className="hm" ref={sec}>
        <div className="hm-g" id="hmGrid">
          <div className="hm-c">
            <span className="eye">Our team</span>
            <h1 className="hm-h1"><span>Professional-led.</span> <span>Hands-on. One <em className="hw-o">team.</em></span></h1>
            <p className="hm-p">Advisers, accountants, company secretaries and talent professionals, working as one team across GAA Consulting, Filings First and Hirings First.</p>
          </div>
          {tiles.map((ls, k) => (
            <figure key={k} className={`hm-t${tap === k ? " tap" : ""}`} style={{ "--k": k }} ref={(el) => { tileEls.current[k] = el; }} onClick={() => onTile(k)}>
              {ls.map((l) => <Layer key={l.id} it={l.it} nx={l.nx} />)}
            </figure>
          ))}
        </div>
        <a className="hm-sc" href="#partners" aria-label="Scroll down" onClick={toFooter}>
          <span>Scroll</span>
          <i><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6" /></svg></i>
        </a>
      </section>
      <section className="pp" id="partners">
        <div className="pp-hero">
          <img className="pp-bg" src="/images/partners/partners-group.webp" alt="The partners of GAA Group" width="2174" height="828" loading="lazy" />
          <div className="pp-in pp-hero-in">
            <span className="pp-eye">Our partners</span>
            <h2 className="pp-h">The Partners<br />Behind GAA</h2>
            <p className="pp-lead">A leadership team that combines deep regulatory expertise, hands-on execution and a shared commitment to building a trusted, long-term advisory platform.</p>
            <a className="pp-btn" href="#pp-cards" onClick={(e) => { e.preventDefault(); const t = document.getElementById("pp-cards"); if (t) window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 90, behavior: "smooth" }); }}>Meet the Partners <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6" /></svg></a>
          </div>
        </div>
        <div className="pp-in">
          <div className="pp-cards" id="pp-cards" ref={ppRef}>
            {PARTNER_CARDS.map((p) => (
              <article className="pp-c" key={p.name}>
                <div className="pp-ph"><img src={p.photo} alt={p.name} width="360" height="340" loading="lazy" /></div>
                <h3>{p.name}</h3>
                <span className="pp-role">{p.role}</span>
                <span className="pp-bar" />
                <p>{p.text}</p>
                {p.linkedin
                  ? <a className="pp-in-i" href={p.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${p.name} on LinkedIn`}>in</a>
                  : <span className="pp-in-i" aria-hidden="true">in</span>}
              </article>
            ))}
          </div>
          <div className="pp-nav">
            <div className="pp-dots">{PARTNER_CARDS.map((p, i) => <button key={p.name} type="button" aria-label={`Show ${p.name}`} className={i === ppCur ? "on" : ""} onClick={() => ppGo(i)} />)}</div>
            <div className="pp-arr">
              <button type="button" aria-label="Previous partner" onClick={() => ppGo((ppCur - 1 + PARTNER_CARDS.length) % PARTNER_CARDS.length)}><svg viewBox="0 0 24 24"><path d="M19 12H5M11 18l-6-6 6-6" /></svg></button>
              <button type="button" aria-label="Next partner" onClick={() => ppGo((ppCur + 1) % PARTNER_CARDS.length)}><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg></button>
            </div>
          </div>
          <div className="pp-common">
            <h2>Different Expertise.<br />A <em>Common Purpose.</em></h2>
            <p>Together, we bring a balanced mix of regulatory depth, domain knowledge and execution focus to help businesses navigate complexity, stay compliant and grow with confidence.</p>
          </div>
          <div className="pp-vals">
            <span><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3.2" /><path d="M3 19a6 6 0 0 1 12 0" /><circle cx="17" cy="9" r="2.6" /><path d="M15.5 14.2A5 5 0 0 1 21 19" /></svg>Hands-on Leadership</span>
            <span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 9 5-9 5-9-5 9-5z" /><path d="m3 13 9 5 9-5" /></svg>Multi-disciplinary Expertise</span>
            <span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12l4-4 4 3 3-2 4 4" /><path d="m7 13 3 3a1.5 1.5 0 0 0 2 0l5-5" /><path d="M22 12l-4-4-2 1" /></svg>Client-first Approach</span>
            <span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h16" /><rect x="5" y="13" width="3" height="5" /><rect x="10.5" y="9" width="3" height="9" /><rect x="16" y="5" width="3" height="13" /></svg>Long-term Value Creation</span>
          </div>
        </div>
      </section>
      <ul className="sr-only">
        {TEAM.map((p) => <li key={p.name}>{p.name}, {p.role}, {p.company}</li>)}
      </ul>
    </main>
  );
}
