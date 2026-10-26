// Motion helpers for the group pages: scroll reveals, magnetic buttons, a soft cursor,
// count-up numbers and scroll-linked word highlighting. All respect "reduce motion".
import { useEffect, useRef, useState } from "react";

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = () => typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/** Adds .is-in to every [data-rv] element when it scrolls into view (including ones added later). */
export function useReveal(deps = []) {
  useEffect(() => {
    const show = (el) => el.classList.add("is-in");
    if (reduced() || !("IntersectionObserver" in window)) {
      const all = () => document.querySelectorAll("[data-rv]:not(.is-in)").forEach(show);
      all();
      const mo = new MutationObserver(all);
      mo.observe(document.body, { childList: true, subtree: true });
      return () => mo.disconnect();
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            show(e.target);
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    const scan = () => document.querySelectorAll("[data-rv]:not(.is-in):not([data-rv-watch])").forEach((el) => {
      el.setAttribute("data-rv-watch", "");
      io.observe(el);
    });
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
      document.querySelectorAll("[data-rv-watch]").forEach((el) => el.removeAttribute("data-rv-watch"));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** Buttons and links with [data-mag] drift toward the pointer. Pointer devices only. */
export function useMagnetic() {
  useEffect(() => {
    if (reduced() || !finePointer()) return;
    const move = (e) => {
      const el = e.target.closest?.("[data-mag]");
      document.querySelectorAll("[data-mag].mag-on").forEach((m) => {
        if (m !== el) {
          m.classList.remove("mag-on");
          m.style.transform = "";
        }
      });
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.classList.add("mag-on");
      el.style.transform = `translate(${x * 0.22}px, ${y * 0.3}px)`;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);
}

/** A soft orange cursor ring that grows over links. Pointer devices only. */
export function useCursor() {
  useEffect(() => {
    if (reduced() || !finePointer()) return;
    const dot = document.createElement("div");
    dot.className = "g-cursor";
    document.body.appendChild(dot);
    let x = -100, y = -100, cx = -100, cy = -100, raf = 0;
    const move = (e) => {
      x = e.clientX;
      y = e.clientY;
      const t = e.target.closest?.("a,button,label,select,[data-cur]");
      dot.classList.toggle("is-big", !!t);
      dot.classList.toggle("is-text", !!e.target.closest?.("input,textarea"));
    };
    const loop = () => {
      cx += (x - cx) * 0.2;
      cy += (y - cy) * 0.2;
      dot.style.transform = `translate(${cx}px, ${cy}px)`;
      raf = requestAnimationFrame(loop);
    };
    const leave = () => dot.classList.add("is-off");
    const enter = () => dot.classList.remove("is-off");
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    document.addEventListener("pointerenter", enter);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      document.removeEventListener("pointerenter", enter);
      dot.remove();
    };
  }, []);
}

/** Counts from 0 to `to` when the element scrolls into view. */
export function useCountUp(to, ms = 1600) {
  const ref = useRef(null);
  const [n, setN] = useState(reduced() ? to : 0);
  useEffect(() => {
    if (reduced() || !ref.current || !("IntersectionObserver" in window)) {
      setN(to);
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / ms);
        setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    io.observe(ref.current);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, ms]);
  return [ref, n];
}

/** 0 → 1 progress of an element through the viewport, for scroll-linked effects. */
export function useScrollProgress() {
  const ref = useRef(null);
  const [p, setP] = useState(reduced() ? 1 : 0);
  useEffect(() => {
    if (reduced()) return;
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;
        setP(Math.max(0, Math.min(1, (vh * 0.85 - r.top) / (r.height + vh * 0.35))));
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);
  return [ref, p];
}

/** Pointer position inside an element as CSS variables --mx / --my (for spotlights). */
export function spotlight(e) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}
