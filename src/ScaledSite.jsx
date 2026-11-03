import React, { useEffect, useRef, useState } from "react";

/* Laptops, desktops and TVs (900 px and wider): the site is laid out as a 1548 px wide screen and scaled to the
   window, so margins, text sizes and spacing keep the same proportions everywhere (13" laptops to 4K screens).
   Very wide, short windows are limited by height so nothing gets squeezed. Phones and tablets use the mobile layout.
   The page shown in the frame is the same React site at the same address. */
const DESIGN_W = 1548;
const MIN_H = 688;
const MOBILE = 900;

function measure() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const s = w >= MOBILE ? Math.min(w / DESIGN_W, h / MIN_H) : 1;
  return { w: w / s, h: h / s, s };
}

export default function ScaledSite() {
  const ref = useRef(null);
  const [box, setBox] = useState(measure);
  const [src] = useState(() => `${window.location.pathname}?embed=1${window.location.hash}`);

  useEffect(() => {
    const onResize = () => setBox(measure());
    /* browser back and forward buttons */
    const onPop = () => {
      try { ref.current.contentWindow.__gcNavigate(window.location.pathname + window.location.hash); } catch (e) { /* ignore */ }
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("popstate", onPop);
    };
  }, []);

  const onLoad = () => {
    try { ref.current.contentWindow.focus({ preventScroll: true }); } catch (e) { /* ignore */ }
  };

  return (
    <iframe
      id="site-frame"
      ref={ref}
      title={typeof document !== "undefined" ? document.title : "GAA Consulting"}
      src={src}
      onLoad={onLoad}
      style={{
        width: `${box.w}px`,
        height: `${box.h}px`,
        transform: box.s === 1 ? "none" : `scale(${box.s})`,
      }}
    />
  );
}
