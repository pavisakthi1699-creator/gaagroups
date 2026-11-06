/* Scroll-linked step lines.
   Every numbered step list gets the same line with an orange dot. As the visitor scrolls, the dot travels
   from 01 to 02 to 03..., and each number it reaches lights up. Works for rows, columns and any layout,
   because the line is drawn between the actual number markers. */

const LISTS = [
  [".lc-list", ".lc-dot"],
  [".ie-steps", ".ie-n"],
  [".nx-steps", ".nx-n"],
  [".ct-path ol", ".ct-n"],
  [".hp-g", ".hp-n"],
  [".hf-tl", ".hf-tl-n"],
  [".gc-proc", ".gc-pr-n"],
  [".cv1-steps", ".cv1-num"],
];

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
/* these lists play by themselves (01 -> 02 -> ... -> last, short pause, repeat) once they are on screen */
const AUTO = ["*"]; /* every step line on the site plays by itself */
const STEP_MS = 1300, HOLD_MS = 1600;

export default function mountScrollLines(root = document) {
  const items = [];
  LISTS.forEach(([listSel, markSel]) => {
    root.querySelectorAll(listSel).forEach((list) => {
      const marks = [...list.querySelectorAll(markSel)];
      if (marks.length < 2 || list.querySelector(":scope > .sl-path")) return;
      list.classList.add("sl");
      const path = document.createElement("span");
      path.className = "sl-path";
      path.setAttribute("aria-hidden", "true");
      const segs = marks.slice(1).map(() => {
        const s = document.createElement("span");
        s.className = "sl-seg";
        s.appendChild(document.createElement("i"));
        path.appendChild(s);
        return s;
      });
      const dot = document.createElement("span");
      dot.className = "sl-dot";
      path.appendChild(dot);
      list.prepend(path);
      marks.forEach((m) => m.classList.add("sl-m"));
      const auto = AUTO.some((sel) => sel === "*" || list.matches(sel));
      if (auto) list.classList.add("sl-auto");
      items.push({ list, marks, segs, dot, path, auto, t0: 0 });
    });
  });
  if (!items.length) return () => {};

  let raf = 0;
  const update = () => {
    raf = 0;
    const vh = window.innerHeight || 800;
    const anchor = vh * 0.62;
    let anyAuto = false;
    items.forEach((it) => {
      const { list, marks, segs, dot } = it;
      if (!list.isConnected) return;
      const lr = list.getBoundingClientRect();
      if (lr.bottom < -vh || lr.top > vh * 2) return;
      const pts = marks.map((m) => {
        const r = m.getBoundingClientRect();
        return { x: r.left + r.width / 2 - lr.left, y: r.top + r.height / 2 - lr.top, vy: r.top + r.height / 2 };
      });
      const n = pts.length;
      const vertical = Math.abs(pts[n - 1].y - pts[0].y) > 40;
      let s; // position along the steps, 0 .. n-1
      if (it.auto) {
        const onScreen = lr.top < vh * 0.9 && lr.bottom > vh * 0.1;
        if (onScreen && !it.t0) it.t0 = performance.now();
        if (!onScreen) it.t0 = 0;
        const run = (n - 1) * STEP_MS;
        const el = it.t0 ? (performance.now() - it.t0) % (run + HOLD_MS) : 0;
        s = clamp(el / STEP_MS, 0, n - 1);
        if (onScreen) anyAuto = true;
      } else if (vertical) {
        if (anchor <= pts[0].vy) s = 0;
        else if (anchor >= pts[n - 1].vy) s = n - 1;
        else {
          let k = 0;
          while (k < n - 2 && anchor > pts[k + 1].vy) k++;
          s = k + clamp((anchor - pts[k].vy) / Math.max(1, pts[k + 1].vy - pts[k].vy), 0, 1);
        }
      } else {
        const t = clamp((vh * 0.88 - lr.top) / (vh * 0.55), 0, 1);
        s = t * (n - 1);
      }
      segs.forEach((seg, k) => {
        const a = pts[k], b = pts[k + 1];
        const len = Math.hypot(b.x - a.x, b.y - a.y);
        const ang = Math.atan2(b.y - a.y, b.x - a.x);
        seg.style.cssText = `left:${a.x}px;top:${a.y}px;width:${len}px;transform:rotate(${ang}rad)`;
        seg.firstChild.style.transform = `scaleX(${clamp(s - k, 0, 1)})`;
      });
      const k = Math.min(n - 2, Math.floor(s));
      const f = s - k;
      const x = pts[k].x + (pts[k + 1].x - pts[k].x) * f;
      const y = pts[k].y + (pts[k + 1].y - pts[k].y) * f;
      dot.style.transform = `translate(${x}px,${y}px)`;
      marks.forEach((m, i) => m.classList.toggle("sl-hit", s >= i - 0.02));
    });
    if (anyAuto) req();
  };
  const req = () => { if (!raf) raf = requestAnimationFrame(update); };
  window.addEventListener("scroll", req, { passive: true });
  window.addEventListener("resize", req);
  const tick = setInterval(req, 400); // catches layout changes from reveal animations and font loading
  req();
  return () => {
    window.removeEventListener("scroll", req);
    window.removeEventListener("resize", req);
    clearInterval(tick);
    cancelAnimationFrame(raf);
    items.forEach(({ list, path, marks }) => {
      path.remove();
      list.classList.remove("sl");
      marks.forEach((m) => m.classList.remove("sl-m", "sl-hit"));
    });
  };
}
