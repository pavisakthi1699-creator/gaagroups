import React, { useEffect, useState } from "react";

/* Shows one finished page design (a self-contained HTML file in src/designs) full screen.

   Same look on every screen size:
   - Laptops and monitors between 1280 and 1920 px wide show the design at their real size
     (the design is fluid in that range).
   - Smaller laptops (900 to 1279 px) render the design as a 1280 px screen, scaled down to fit.
   - Large monitors, 4K/5K screens and TVs (bigger than 1920 x 1080) render it as a
     1920 x 1080 screen scaled up to fill; ultrawide screens keep the same height and get
     extra width at the sides.
   So the layout, spacing and proportions stay the same at 100% browser zoom on any screen.
   Phones and tablets under 900 px use the design's own mobile layout. */
const MIN_W = 1280; // smallest desktop layout
const BASE_W = 1920; // large screens are scaled up from a 1920 x 1080 layout
const BASE_H = 1080;
const MOBILE = 900;

function measure() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (w < MOBILE) return { w, h, s: 1 };
  let s = 1;
  if (w < MIN_W) s = w / MIN_W; // small laptops: draw at 1280 wide, scale down
  else if (w > BASE_W && h > BASE_H) s = Math.min(w / BASE_W, h / BASE_H); // big monitors, TVs, ultrawides: scale up
  return { w: w / s, h: h / s, s };
}

export default function DesignFrame({ html, title }) {
  const [box, setBox] = useState(measure);

  useEffect(() => {
    const prev = document.title;
    document.title = title;
    const onResize = () => setBox(measure());
    window.addEventListener("resize", onResize);
    return () => {
      document.title = prev;
      window.removeEventListener("resize", onResize);
    };
  }, [title]);

  return (
    <iframe
      title={title}
      srcDoc={html}
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: `${box.w}px`,
        height: `${box.h}px`,
        border: 0,
        background: "#fff",
        transform: box.s === 1 ? "none" : `scale(${box.s})`,
        transformOrigin: "0 0",
      }}
    />
  );
}
