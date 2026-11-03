/* Behaviour of the GAA Group page designs (Home, About, Careers), run by the React pages after they mount.
   Every listener, observer and timer is removed again when the page unmounts. */

function tracker() {
  const offs = [];
  return {
    on(t, ev, fn, opt) { t.addEventListener(ev, fn, opt); offs.push(() => t.removeEventListener(ev, fn, opt)); },
    later(fn, ms) { const id = setTimeout(fn, ms); offs.push(() => clearTimeout(id)); },
    every(fn, ms) { const id = setInterval(fn, ms); offs.push(() => clearInterval(id)); },
    io(el, cls, threshold) {
      if (!el) return;
      if (!("IntersectionObserver" in window)) { el.classList.add(cls); return; }
      const o = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { el.classList.add(cls); o.disconnect(); } }), { threshold });
      o.observe(el);
      offs.push(() => o.disconnect());
    },
    done() { offs.splice(0).forEach((f) => f()); },
  };
}

/* hero headline size on Home and About (1 = fills the full width) */
const HERO_SCALE = 0.86;

const fontsReady = (fn) => { if (document.fonts && document.fonts.ready) document.fonts.ready.then(fn); };

/* One wheel turn or key press moves one full-screen section on desktop. Inside the About "Three firms" dial,
   each step moves to the next firm first. */
function snap(t, root, dial) {
  const mq = matchMedia("(min-width:900px) and (min-height:600px)");
  let lock = false;
  const secs = () => [...root.querySelectorAll("main>section"), document.getElementById("footer")].filter(Boolean);
  const idx = () => { const y = scrollY + innerHeight / 2; let k = 0; secs().forEach((s, i) => { if (s.offsetTop <= y) k = i; }); return k; };
  const tall = (s) => s.offsetHeight > innerHeight + 2;
  const hold = (ms) => { lock = true; t.later(() => { lock = false; }, ms); };
  const go = (d) => {
    const a = secs(); const i = Math.max(0, Math.min(a.length - 1, idx() + d)); const s = a[i];
    let top = s.offsetTop;
    if (d < 0 && tall(s)) top = s.offsetTop + s.offsetHeight - innerHeight;
    if (s.id === "footer") top = Math.min(top, document.documentElement.scrollHeight - innerHeight);
    if (Math.abs(top - scrollY) < 2) return;
    window.scrollTo({ top, behavior: "smooth" }); hold(900);
  };
  const inside = (dir) => {
    const s = secs()[idx()]; if (!tall(s)) return false;
    const top = s.offsetTop, bot = top + s.offsetHeight - innerHeight;
    return dir > 0 ? scrollY < bot - 2 && scrollY >= top - 2 : scrollY > top + 2 && scrollY <= bot + 2;
  };
  const firmStep = (dir) => {
    const s = secs()[idx()]; if (!dial.current || s.id !== "firms" || Math.abs(scrollY - s.offsetTop) > 4) return false;
    const c = dial.current.cur(), n = c + dir; if (n < 0 || n > 2) return false;
    dial.current.go(n); hold(1150); return true;
  };
  const step = (dir) => { if (lock) return; if (firmStep(dir)) return; go(dir); };
  const busy = () => document.querySelector(".ie-sp.open, .mnav.open");
  t.on(window, "wheel", (e) => {
    if (!mq.matches || e.ctrlKey || busy()) return;
    const dir = e.deltaY > 0 ? 1 : -1; if (inside(dir)) return;
    const a = secs(); if (a[idx()].id === "footer" && dir > 0) return;
    e.preventDefault(); if (Math.abs(e.deltaY) < 4) return; step(dir);
  }, { passive: false });
  t.on(window, "keydown", (e) => {
    if (!mq.matches || /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) || busy()) return;
    const k = e.key; const dir = (k === "PageDown" || k === "ArrowDown" || (k === " " && !e.shiftKey)) ? 1 : (k === "PageUp" || k === "ArrowUp") ? -1 : 0;
    if (!dir || inside(dir)) return; e.preventDefault(); step(dir);
  });
}

/* the hero headline is sized to fill the width and still fit one screen */
function fitHx(t, root) {
  const h = root.querySelector("#hxFit"); if (!h) return;
  const box = h.parentNode.parentNode, sec = root.querySelector("#top");
  const cols = root.querySelector(".hx-c .hx-cols");
  const fit = () => {
    h.style.fontSize = ""; if (innerWidth < 900) { if (cols) cols.style.removeProperty("--hw"); return; }
    const l = h.firstElementChild; const cw = box.clientWidth, w = l.scrollWidth || l.getBoundingClientRect().width;
    const fs = parseFloat(getComputedStyle(h).fontSize);
    let nf = Math.min(fs * cw / w * 0.985, 170) * HERO_SCALE; h.style.fontSize = nf.toFixed(1) + "px";
    sec.classList.remove("tight", "tighter");
    if (sec.offsetHeight > innerHeight + 1) sec.classList.add("tight");
    if (sec.offsetHeight > innerHeight + 1) sec.classList.add("tighter");
    for (let k = 0; k < 10 && sec.offsetHeight > innerHeight + 1; k++) { nf *= 0.97; h.style.fontSize = nf.toFixed(1) + "px"; }
    if (cols) { const r = document.createRange(); r.selectNodeContents(h.firstElementChild); cols.style.setProperty("--hw", Math.round(r.getBoundingClientRect().width) + "px"); }
  };
  fit(); t.on(window, "resize", fit); fontsReady(fit); t.later(fit, 600); t.later(fit, 900);
}

function fitAh(t, root) {
  const h = root.querySelector("#ahFit"); if (!h) return;
  const l2 = h.querySelector(".l2"), sec = root.querySelector("#top"), box = h.parentNode;
  const fit = () => {
    h.style.fontSize = ""; if (innerWidth < 900) return;
    const cw = box.clientWidth, fs = parseFloat(getComputedStyle(h).fontSize), w = l2.getBoundingClientRect().width;
    let nf = Math.min(fs * cw / w * 0.995, 150) * HERO_SCALE; h.style.fontSize = nf.toFixed(1) + "px";
    sec.classList.remove("tight", "tighter");
    if (sec.offsetHeight > innerHeight + 1) sec.classList.add("tight");
    if (sec.offsetHeight > innerHeight + 1) sec.classList.add("tighter");
    for (let k = 0; k < 10 && sec.offsetHeight > innerHeight + 1; k++) { nf *= 0.97; h.style.fontSize = nf.toFixed(1) + "px"; }
  };
  fit(); t.on(window, "resize", fit); fontsReady(fit); t.later(fit, 600);
}

/* services: three columns; on phones each column opens like an accordion */
function services(t, root) {
  const s = root.querySelector("#services"); if (!s) return;
  t.io(s, "on", 0.25);
  const mq = matchMedia("(max-width:899px)");
  const cols = [...s.querySelectorAll(".os-col")];
  cols.forEach((c, i) => {
    const b = c.querySelector(".os-tg");
    if (i === 0) { c.classList.add("open"); b.setAttribute("aria-expanded", "true"); }
    t.on(b, "click", () => {
      if (!mq.matches) return;
      const o = !c.classList.contains("open");
      cols.forEach((x) => { x.classList.remove("open"); x.querySelector(".os-tg").setAttribute("aria-expanded", "false"); });
      if (o) { c.classList.add("open"); b.setAttribute("aria-expanded", "true"); }
    });
  });
}


/* Home: on phones the three company cards slide one by one, with arrows and dots */
function companySlider(t, root) {
  const s = root.querySelector("#companies"); if (!s) return;
  const grid = s.querySelector(".gc-grid"), cards = [...grid.children];
  const dots = [...s.querySelectorAll(".gc-dots i")];
  const mq = matchMedia("(max-width:899px)");
  let i = 0, hold = false;
  const go = (k, smooth = true) => {
    i = (k + cards.length) % cards.length;
    if (mq.matches) grid.scrollTo({ left: cards[i].offsetLeft - grid.offsetLeft, behavior: smooth ? "smooth" : "auto" });
    dots.forEach((d, j) => d.classList.toggle("on", j === i));
  };
  go(0, false);
  t.on(s.querySelector(".gc-prev"), "click", () => { go(i - 1); hold = true; });
  t.on(s.querySelector(".gc-next"), "click", () => { go(i + 1); hold = true; });
  dots.forEach((d, j) => t.on(d, "click", () => { go(j); hold = true; }));
  t.on(grid, "touchstart", () => { hold = true; }, { passive: true });
  let st = null;
  t.on(grid, "scroll", () => {
    clearTimeout(st);
    st = setTimeout(() => {
      const k = Math.round(grid.scrollLeft / Math.max(1, cards[0].offsetWidth));
      i = Math.max(0, Math.min(cards.length - 1, k));
      dots.forEach((d, j) => d.classList.toggle("on", j === i));
    }, 80);
  }, { passive: true });
  t.every(() => { if (mq.matches && !hold && !document.hidden) go(i + 1); }, 3200);
  t.every(() => { hold = false; }, 9000);
}

/* About: the "Three firms" dial */
function dial(t, root, ref) {
  const s = root.querySelector("#firms"), d = root.querySelector("#dial"); if (!s || !d) return;
  const n = 3; let step = 0; let t1 = null, t2 = null;
  const setF = (k, noLb) => s.querySelectorAll("[data-f]").forEach((e) => { if (noLb && e.classList.contains("au-lb")) return; e.classList.toggle("act", +e.dataset.f === k); });
  const prog = (k) => d.setAttribute("data-p", k + 1);
  prog(0);
  const go = (target) => {
    const cur = ((step % n) + n) % n; let diff = target - cur; if (!diff) return;
    prog(target); if (diff === 2) diff = -1; if (diff === -2) diff = 1; step += diff;
    d.classList.add("mv"); setF(-1); d.style.setProperty("--R", (-120 * step) + "deg");
    clearTimeout(t1); clearTimeout(t2);
    t2 = setTimeout(() => setF(target, 1), 480);
    t1 = setTimeout(() => { d.classList.remove("mv"); setF(target); }, 1050);
  };
  s.querySelectorAll(".au-lgd").forEach((b) => { t.on(b, "click", () => go(+b.dataset.f)); t.on(b, "pointerenter", () => go(+b.dataset.f)); });
  const fitSub = () => {
    const g = root.querySelector("#auBig"), h = root.querySelector("#auSub"); if (!g || !h) return;
    const r = document.createRange(); r.selectNodeContents(g); const tr = r.getBoundingClientRect();
    h.style.fontSize = "40px"; const w = h.scrollWidth; if (w) h.style.fontSize = (40 * tr.width / w).toFixed(2) + "px";
  };
  fitSub(); t.on(window, "resize", fitSub); fontsReady(fitSub); t.later(fitSub, 1200);
  ref.current = { cur: () => ((step % n) + n) % n, go };
  return () => { clearTimeout(t1); clearTimeout(t2); ref.current = null; };
}

/* Careers: /careers#lawyers highlights that programme */
function careersHash(t, root) {
  const go = () => {
    const h = (location.hash || "").replace("#", ""); if (!h) return;
    const el = h === "articleship" ? root.querySelector("#training") : root.querySelector("#p-" + h) || root.querySelector("#" + h);
    if (!el) return;
    root.querySelectorAll(".cr-row").forEach((r) => r.classList.toggle("hi", r.id === "p-" + h));
    t.later(() => window.scrollTo({ top: h === "articleship" ? el.getBoundingClientRect().top + scrollY : 0, behavior: "smooth" }), 150);
  };
  go(); t.on(window, "hashchange", go);
}

export function runGroupPage(page, root, dialRef) {
  const t = tracker();
  let extra = null;
  requestAnimationFrame(() => requestAnimationFrame(() => root.querySelectorAll("main>section").forEach((s, i) => { if (i === 0) s.classList.add("in", "on"); })));
  snap(t, root, dialRef || { current: null });
  if (page === "home") {
    fitHx(t, root);
    services(t, root);
    t.io(root.querySelector("#section-3"), "on", 0.35);
    t.io(root.querySelector("#companies"), "on", 0.2);
    companySlider(t, root);
  }
  if (page === "about") {
    fitAh(t, root);
    ["connected", "firms"].forEach((id) => t.io(root.querySelector("#" + id), "on", 0.2));
    extra = dial(t, root, dialRef);
  }
  if (page === "careers") {
    t.io(root.querySelector("#training"), "on", 0.15);
    careersHash(t, root);
  }
  return () => { t.done(); if (extra) extra(); };
}
