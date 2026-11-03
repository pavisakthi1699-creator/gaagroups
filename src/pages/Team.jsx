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
const PARTNER_NAMES = ["Rose Agarwal", "Chetana N S", "Apoorva G", "M Mahesh", "Athira Augustine"];
const PARTNERS = PARTNER_NAMES.map((n) => TEAM.find((p) => p.name === n)).filter(Boolean);
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
      <figcaption><b>{it.name}</b><span>{it.role}</span><small>{it.co ? `${it.co} · ` : ""}Bangalore</small></figcaption>
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
      <section className="pt" id="partners">
        <div className="ff-in">
          <div className="ff-hd">
            <div><span className="ff-eye">Leadership</span><h2 className="ff-h2"><span>Partners and</span><span>practice <em className="hw-o">leads.</em></span></h2></div>
            <p className="ff-p">The senior professionals who lead our advisory, finance, audit and people practices, and stay involved in your work from the first conversation.</p>
          </div>
          <div className="pt-g">
            {PARTNERS.map((p) => (
              <article className="pt-c" key={p.name}>
                <span className="pt-ph" aria-hidden="true" />
                {p.linkedin && <a className="pt-in" href={p.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${p.name} on LinkedIn`}>in</a>}
                <div className="pt-b">
                  <span className="pt-tag">{p.company}</span>
                  <h3>{p.name}</h3>
                  <p>{p.role}</p>
                  <span className="pt-bar" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <ul className="sr-only">
        {TEAM.map((p) => <li key={p.name}>{p.name}, {p.role}, {p.company}</li>)}
      </ul>
    </main>
  );
}
