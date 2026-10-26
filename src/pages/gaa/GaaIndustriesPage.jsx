import React, { useRef, useState } from "react";
import useGaaMotion from "./useGaaMotion";
import { GaaHeader, GaaSubBar, GaaFooter, SubHero, CtaBand, Ring, useLink } from "./GaaShell";
import { INDUSTRIES, getPractice } from "../../data/gaaContent";

export default function GaaIndustriesPage({ onNavigate }) {
  const ref = useRef(null);
  const link = useLink(onNavigate);
  useGaaMotion(ref, "Industries | GAA Consulting");
  const [sel, setSel] = useState(0);
  const ind = INDUSTRIES[sel];
  const pr = getPractice(ind.practice);

  return (
    <div className="gaa-consulting-root gaa-sub" ref={ref}>
      <GaaHeader link={link} active="industries" />
      <GaaSubBar link={link} crumbs={[[null, "Industries"]]} />
      <main>
        <SubHero
          variant="type"
          tag="Industries"
          lines={["Company law is", "the same for all.", "Your business isn't."]}
          em={[2]}
          sub="Our teams bring sector context to every engagement, from regulated lenders to capability centres and promoter-led manufacturers."
          actions={<a className="btn o" {...link("@contact")}>Talk to a sector partner <span className="ar">→</span></a>}
          ticker={INDUSTRIES.map((i) => i.name)}
        />

        <section className="s" id="sectors">
          <div className="w ix">
            <div className="ix-list" role="tablist" aria-label="Industries" aria-orientation="vertical">
              <h2>Sectors we <em>know well.</em></h2>
              {INDUSTRIES.map((x, i) => (
                <React.Fragment key={x.name}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={sel === i}
                  aria-controls="ix-panel"
                  onMouseEnter={() => setSel(i)}
                  onFocus={() => setSel(i)}
                  onClick={() => setSel(i)}
                >
                  {x.name}
                </button>
                {sel === i && <Panel ind={ind} pr={pr} link={link} cls="ix-inline" />}
                </React.Fragment>
              ))}
            </div>
            <div className="ix-side">
              <Panel ind={ind} pr={pr} link={link} cls="ix-panel" key={sel} />
            </div>
          </div>
        </section>

        <section className="s dk why">
          <div className="w why-g">
            <p className="statement">
              An NBFC's board calendar is shaped by RBI returns. A capability centre's compliance follows its parent's global close. A family group's restructuring follows succession.
            </p>
            <div className="tx">
              <p>We staff each engagement with people who have seen your kind of business before, so you spend less time explaining and more time deciding.</p>
              <div className="acts">
                <a className="btn o" {...link("practices")}>Explore services <span className="ar">→</span></a>
              </div>
            </div>
          </div>
        </section>

        <CtaBand
          link={link}
          title="Don't see your"
          em="sector here?"
          p="We regularly advise businesses outside these sectors. Share a short brief and a partner will tell you honestly whether we are the right fit."
        />
      </main>
      <GaaFooter link={link} />
      <Ring />
    </div>
  );
}

function Panel({ ind, pr, link, cls }) {
  return (
    <div className={cls} id={cls === "ix-panel" ? "ix-panel" : undefined} role={cls === "ix-panel" ? "tabpanel" : undefined}>
      <span className="t">{ind.tag}</span>
      <h3>{ind.name}</h3>
      <p>{ind.desc}</p>
      <h4>Work we do most often</h4>
      <ul>{ind.mandates.map((m) => <li key={m}>{m}</li>)}</ul>
      <a className="btn o" {...link(`practices/${ind.practice}`)}>
        {pr.navName} <span className="ar">→</span>
      </a>
    </div>
  );
}
