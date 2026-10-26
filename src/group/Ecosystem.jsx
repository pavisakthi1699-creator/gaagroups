// "One Group. Three Strengths." Replaces the old "Lifecycle" circle.
// Each company is shown by its two-word descriptor. They light up one by one in the
// company's own colour, then stay together as one ring around the client's business.
import React, { useEffect, useRef, useState } from "react";
import { COMPANIES, ORDER, siteHref } from "./sites.js";
import { Link } from "./router.jsx";
import { ArrowIcon } from "./Icons.jsx";

const R = 150;
const C = 200;
const GAP = 7; // degrees between arcs
const polar = (deg, r = R) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [C + r * Math.cos(a), C + r * Math.sin(a)];
};
const arc = (from, to) => {
  const [x1, y1] = polar(from);
  const [x2, y2] = polar(to);
  return `M ${x1} ${y1} A ${R} ${R} 0 0 1 ${x2} ${y2}`;
};
// company i owns the 120° segment centred on i*120
const SEG = ORDER.map((_, i) => [i * 120 - 60 + GAP / 2, i * 120 + 60 - GAP / 2]);

export const HEADING = "One Group. Three Strengths."; // see proposal for alternatives

export default function Ecosystem() {
  const ref = useRef(null);
  const [step, setStep] = useState(-1); // -1 nothing, 0..2 one company, 3 all together
  const [hover, setHover] = useState(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      setStep(3);
      return;
    }
    let timers = [];
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        [0, 1, 2, 3].forEach((s, i) => timers.push(setTimeout(() => setStep(s), 300 + i * 1100)));
      },
      { threshold: 0.35 }
    );
    if (ref.current) io.observe(ref.current);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  const active = hover !== null ? hover : step;
  const lit = (i) => (hover !== null ? hover === i : step === 3 || i <= step);
  const focus = (i) => (hover !== null ? hover === i : step === i);

  return (
    <section className="g-eco" ref={ref} aria-labelledby="g-eco-h">
      <div className="g-wrap g-eco-in">
        <div className="g-eco-l">
          <span className="g-eb" data-rv>How the group works</span>
          <h2 id="g-eco-h" data-rv>{HEADING}</h2>
          <p data-rv>Three specialist firms around one business: yours.</p>
          <ul className="g-eco-list" data-rv>
            {ORDER.map((k, i) => {
              const c = COMPANIES[k];
              return (
                <li key={k} className={`${lit(i) ? "g-lit" : ""}${focus(i) ? " g-focus" : ""}`}>
                  <Link
                    to={siteHref(k, c.home)}
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover(null)}
                    onFocus={() => setHover(i)}
                    onBlur={() => setHover(null)}
                  >
                    <span className="g-eco-i">0{i + 1}</span>
                    <span className="g-twow">{c.two}</span>
                    <span className="g-nm">{c.name}</span>
                    <ArrowIcon />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="g-ring" aria-hidden="true">
          <svg viewBox="0 0 400 400">
            <circle cx={C} cy={C} r={R} className="g-track" />
            {ORDER.map((k, i) => (
              <path
                key={k}
                d={arc(SEG[i][0], SEG[i][1])}
                pathLength="1"
                className={`g-arc${lit(i) ? " g-on" : ""}${focus(i) ? " g-focus" : ""}`}
              />
            ))}
          </svg>
          {ORDER.map((k, i) => {
            const [x, y] = polar(i * 120);
            const c = COMPANIES[k];
            return (
              <div
                key={k}
                className={`g-node${lit(i) ? " g-on" : ""}${focus(i) ? " g-focus" : ""}`}
                style={{ left: `${(x / 400) * 100}%`, top: `${(y / 400) * 100}%` }}
              >
                <span className="g-plate"><img src={c.logo} alt="" /></span>
                <b>{c.two}</b>
              </div>
            );
          })}
          <div className="g-core">
            <small>At the centre</small>
            <b>Your business</b>
            <span>{active === 3 || active < 0 ? "One group, one partner" : COMPANIES[ORDER[active]].name}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
