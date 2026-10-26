import React, { useRef, useState } from "react";
import useGaaMotion from "./useGaaMotion";
import { GaaHeader, GaaSubBar, GaaFooter, SubHero, SectionHead, CtaBand, Ring, useLink } from "./GaaShell";
import { TEAM_MEMBERS } from "../../data/teamData";

const GAA = TEAM_MEMBERS.filter((m) => m.department === "GAA Consulting");
const GROUPS = [
  ["all", "Everyone"],
  ["senior", "Senior Associates"],
  ["specialist", "Legal"],
  ["trainee", "Trainees"],
];

export default function GaaPeoplePage({ onNavigate }) {
  const ref = useRef(null);
  const link = useLink(onNavigate);
  useGaaMotion(ref, "Our Team | GAA Consulting");
  const [g, setG] = useState("all");
  const leaders = GAA.filter((m) => m.category === "leadership");
  const team = GAA.filter((m) => m.category !== "leadership");
  const shown = g === "all" ? team : team.filter((m) => m.category === g);
  const count = (c) => (c === "all" ? team.length : team.filter((m) => m.category === c).length);

  return (
    <div className="gaa-consulting-root gaa-sub" ref={ref}>
      <GaaHeader link={link} active="people" />
      <GaaSubBar link={link} crumbs={[[null, "Our Team"]]} />
      <main>
        <SubHero
          variant="type"
          tag="Our Team"
          lines={["The people who", "handle your", "file personally."]}
          em={[2]}
          sub="Company Secretaries, corporate lawyers and finance professionals. Every engagement is led by a senior partner and supported by a dedicated secretarial team."
          actions={<a className="btn o" {...link("@contact")}>Speak with our team <span className="ar">→</span></a>}
          facts={[[String(GAA.length), "Professionals"], [String(leaders.length), "Practice leaders"], [String(count("senior")), "Senior associates"], [String(count("trainee")), "CS trainees"]]}
        />

        <section className="s" id="leadership">
          <div className="w">
            <SectionHead p="The leaders accountable for every GAA Consulting engagement.">
              Leadership.
            </SectionHead>
            <div className="leads">
              {leaders.map((m) => (
                <article className="lead" key={m.id}>
                  <div className="ph"><img src={m.image} alt={m.name} loading="lazy" /></div>
                  <div className="bd">
                    <span className="t">{m.badge}</span>
                    <h3>{m.name}</h3>
                    <span className="rl">{m.role}</span>
                    <p>{m.bio}</p>
                    <p className="sk">{m.skills.join(", ")}</p>
                    <div className="plnk">
                      {m.email && <a href={`mailto:${m.email}`}>Email</a>}
                      {m.linkedin && <a href={m.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="s alt" id="team">
          <div className="w">
            <SectionHead p="The associates and trainees who prepare, track and file your work under partner review.">
              The team behind <em>the filings.</em>
            </SectionHead>
            <div className="ftabs" role="group" aria-label="Filter team">
              {GROUPS.filter(([c]) => count(c) > 0).map(([c, l]) => (
                <button type="button" key={c} aria-pressed={g === c} onClick={() => setG(c)}>
                  {l}
                </button>
              ))}
            </div>
            <div className="ppls" aria-live="polite">
              {shown.map((m) => (
                <article className="ppl" key={m.id}>
                  <div className="ph"><img src={m.image} alt={m.name} loading="lazy" /></div>
                  <h3>{m.name}</h3>
                  <span className="rl">{m.role}</span>
                  {m.linkedin && (
                    <a className="lin" href={m.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${m.name} on LinkedIn`}>in</a>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="s dk why">
          <div className="w why-g">
            <p className="statement">We train CS students and young professionals on live work from day one, with partner mentoring across M&amp;A, FEMA and governance.</p>
            <div className="tx">
              <p>Interested in joining GAA Consulting? Send us your CV and the kind of work you want to do.</p>
              <div className="acts">
                <a className="btn o" {...link("careers")}>Careers &amp; CS training <span className="ar">→</span></a>
                <a className="btn g" {...link("@about")}>Meet the whole group</a>
              </div>
            </div>
          </div>
        </section>

        <CtaBand link={link} title="Work directly with" em="our partners." p="Book a confidential call. You will speak with a senior partner, not a sales team." />
      </main>
      <GaaFooter link={link} />
      <Ring />
    </div>
  );
}
