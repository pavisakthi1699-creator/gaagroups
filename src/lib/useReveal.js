import { useEffect } from "react";

/* Adds the class "on" to matching elements when they scroll into view (fade and rise animations).
   Elements stay visible without JavaScript because the class is only needed for the animation start state. */
export default function useReveal(selector, deps = []) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll(selector));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("on"));
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          if (!el.style.transitionDelay && el.parentNode) {
            const i = Array.prototype.indexOf.call(el.parentNode.children, el);
            el.style.transitionDelay = `${(i % 6) * 0.06}s`;
          }
          el.classList.add("on");
          io.unobserve(el);
        }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
