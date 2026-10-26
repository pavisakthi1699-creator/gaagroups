// Shared About Us page (same on all three domains).
// Group photograph, "One group, one partner", What we stand for, the group structure
// with the three logos, and Our people (name, designation, native place, LinkedIn, email).
import React, { useMemo, useState } from "react";
import { GroupPage } from "./GroupChrome.jsx";
import { Link } from "./router.jsx";
import { COMPANIES, ORDER, GROUP, siteHref } from "./sites.js";
import { LEADERS, MEMBERS, TEAM } from "./team.js";
import { useScrollProgress, spotlight } from "./motion.js";
import { ArrowIcon, LinkedInIcon, MailIcon, PinIcon } from "./Icons.jsx";

// Put the group photograph in /public/group-photo.jpg (recommended 2400 × 1050 px).
const GROUP_PHOTO = "/group-photo.jpg";

const VALUES = [
  ["Clarity", "Straight answers in plain language. You know what matters, what it costs and what happens next."],
  ["Rigour", "Reliable execution on every deadline, with work that stands up to auditors, regulators and boards."],
  ["One team", "Our advisors, accountants and recruiters plan together, so you deal with one accountable partner."],
];

// Team filters by function (not by company, as requested).
const FILTERS = [
  ["all", "Everyone"],
  ["cs", "Corporate Secretarial & Legal"],
  ["fin", "Finance, Accounts & Audit"],
  ["ops", "HR & Operations"],
  ["trainee", "Trainees"],
];
const fnOf = (p) => {
  const r = p.role.toLowerCase();
  if (r.includes("trainee")) return "trainee";
  if (r.includes("secretarial") || r.includes("legal")) return "cs";
  if (r.includes("account") || r.includes("finance") || r.includes("audit")) return "fin";
  return "ops";
};

const linkedInFor = (p) => p.linkedin || `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(p.name)}`;
const mailFor = (p) => (p.email ? `mailto:${p.email}` : `mailto:${COMPANIES.gaa.email}?subject=${encodeURIComponent(`Attention: ${p.name}`)}`);

function Person({ p, big, i = 0 }) {
  return (
    <article className={`g-person${big ? " g-big" : ""}`} data-rv style={{ "--d": `${(i % 4) * 70}ms` }} onMouseMove={spotlight}>
      <div className="g-ph">
        <span className="g-ph-bg" aria-hidden="true"></span>
        <span className="g-ph-word" aria-hidden="true">{p.name.split(" ")[0]}</span>
        <img src={p.cutout || p.image} alt={p.name} loading="lazy" width="640" height="800" />
        <div className="g-social">
          <a href={linkedInFor(p)} target="_blank" rel="noopener noreferrer" aria-label={`${p.name} on LinkedIn`} title="LinkedIn">
            <LinkedInIcon />
          </a>
          <a href={mailFor(p)} aria-label={`Email ${p.name}`} title="Email">
            <MailIcon />
          </a>
        </div>
      </div>
      <div className="g-pinfo">
        <h3>{p.name}</h3>
        <p className="g-role">{p.role}</p>
        <p className="g-native">
          <PinIcon />
          {p.native ? <span>{p.native}</span> : <span className="g-tbd">Native place to be updated</span>}
        </p>
      </div>
    </article>
  );
}

export function GroupStructure() {
  return (
    <section className="g-struct" aria-labelledby="g-struct-h">
      <div className="g-wrap">
        <div className="g-sec-h g-center">
          <span className="g-eb" data-rv>The group at a glance</span>
          <h2 id="g-struct-h" data-rv>
            One parent. <span>Three specialists.</span>
          </h2>
        </div>
        <div className="g-tree" data-rv>
          <div className="g-root">
            <span className="g-root-mark">GAA</span>
            <span>
              <b>{GROUP.legalName}</b>
              <small>GAA Group</small>
            </span>
          </div>
          <svg className="g-lines" viewBox="0 0 900 90" preserveAspectRatio="none" aria-hidden="true">
            <path pathLength="1" d="M450 0 V45 M150 45 H750 M150 45 V90 M450 45 V90 M750 45 V90" />
          </svg>
          <div className="g-branches">
            {ORDER.map((k, i) => {
              const c = COMPANIES[k];
              return (
                <Link key={k} to={siteHref(k, c.home)} className="g-branch" style={{ "--d": `${400 + i * 150}ms` }} onMouseMove={spotlight}>
                  <span className="g-plate g-lg"><img src={c.logo} alt={`${c.name} logo`} /></span>
                  <span className="g-twow">{c.two}</span>
                  <b>{c.name}</b>
                  <span className="g-line">{c.line}</span>
                  <span className="g-branch-go">Visit website <ArrowIcon /></span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function Story() {
  const [ref, p] = useScrollProgress();
  const text =
    "GAA Consulting advises on corporate law, transactions and regulation. Filings First keeps your books, taxes and filings on time. Hirings First builds your teams. All three share one view of your business, so a new hire, a compliance change and a fundraise are planned together.";
  const words = text.split(" ");
  const lit = Math.round(p * words.length * 1.15);
  return (
    <section className="g-story" aria-labelledby="g-story-h">
      <div className="g-wrap g-story-in">
        <div>
          <span className="g-eb" data-rv>One group, one partner</span>
          <h2 id="g-story-h" data-rv>
            A growing business shouldn't have to <span>coordinate its advisors.</span>
          </h2>
        </div>
        <p className="g-state-tx g-sm" ref={ref}>
          {words.map((w, i) => (
            <span key={i} className={i < lit ? "on" : ""}>{w} </span>
          ))}
        </p>
      </div>
    </section>
  );
}

export default function GroupAbout() {
  const [photoOk, setPhotoOk] = useState(true);
  const [f, setF] = useState("all");
  const members = useMemo(() => MEMBERS.filter((p) => f === "all" || fnOf(p) === f), [f]);
  const counts = useMemo(() => Object.fromEntries(FILTERS.map(([k]) => [k, MEMBERS.filter((p) => k === "all" || fnOf(p) === k).length])), []);
  const lineup = [TEAM[5], TEAM[22], TEAM[1], TEAM[7], TEAM[0], TEAM[9], TEAM[2], TEAM[28], TEAM[15]].filter(Boolean);

  return (
    <GroupPage>
      <section className="g-ahero" aria-labelledby="g-ah">
        <div className="g-hero-bg" aria-hidden="true">
          <span className="g-orb g-o1"></span>
          <span className="g-grid"></span>
          <span className="g-grain"></span>
        </div>
        <div className="g-wrap">
          <div className="g-ahero-top">
            <span className="g-eb g-up" style={{ "--d": "100ms" }}>About us</span>
            <h1 id="g-ah" className="g-h1 g-sm">
              <span className="g-mask"><span className="g-rise" style={{ "--d": "150ms" }}>Specialists who</span></span>
              <span className="g-mask"><span className="g-rise g-acc" style={{ "--d": "300ms" }}>work as one.</span></span>
            </h1>
            <p className="g-up" style={{ "--d": "600ms" }}>
              {TEAM.length} professionals across three specialist companies, working from one office in Bengaluru.
            </p>
          </div>
          <figure className="g-photo g-up" style={{ "--d": "750ms" }}>
            {photoOk ? (
              <img src={GROUP_PHOTO} alt="The GAA Group team" onError={() => setPhotoOk(false)} />
            ) : (
              <div className="g-lineup" aria-label="The GAA Group team">
                {lineup.map((p, i) => (
                  <img key={p.id} src={p.cutout} alt="" loading="lazy" style={{ "--i": i }} />
                ))}
                <span className="g-lineup-word" aria-hidden="true">One team</span>
              </div>
            )}
            <figcaption>The GAA Group team, Bengaluru</figcaption>
          </figure>
        </div>
      </section>

      <Story />

      <section className="g-values" aria-labelledby="g-values-h">
        <div className="g-wrap">
          <div className="g-sec-h g-split">
            <div>
              <span className="g-eb" data-rv>What we stand for</span>
              <h2 id="g-values-h" data-rv>
                Three principles. <span>Every engagement.</span>
              </h2>
            </div>
          </div>
          <ol className="g-vals">
            {VALUES.map(([t, d], i) => (
              <li key={t} data-rv style={{ "--d": `${i * 100}ms` }}>
                <span className="g-n">0{i + 1}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <GroupStructure />

      <section className="g-people" id="people" aria-labelledby="g-people-h">
        <div className="g-wrap">
          <div className="g-sec-h g-split">
            <div>
              <span className="g-eb" data-rv>Our people</span>
              <h2 id="g-people-h" data-rv>
                The team behind <span>the work.</span>
              </h2>
            </div>
            <p data-rv>Hover a card to connect on LinkedIn or send an email.</p>
          </div>

          <h3 className="g-sub" data-rv>Leadership</h3>
          <div className="g-leads">
            {LEADERS.map((p, i) => <Person key={p.id} p={p} big i={i} />)}
          </div>

          <div className="g-team-head">
            <h3 className="g-sub" data-rv>
              Our team <span>{String(members.length).padStart(2, "0")}</span>
            </h3>
            <div className="g-filters" role="group" aria-label="Filter team by function">
              {FILTERS.map(([k, l]) => (
                <button key={k} type="button" aria-pressed={f === k} onClick={() => setF(k)}>
                  {l} <small>{counts[k]}</small>
                </button>
              ))}
            </div>
          </div>
          <div className="g-team" key={f}>
            {members.map((p, i) => <Person key={p.id} p={p} i={i} />)}
          </div>
        </div>
      </section>

      <section className="g-cta">
        <div className="g-wrap g-cta-in">
          <h2 data-rv>
            Meet the team <span>in person.</span>
          </h2>
          <div className="g-acts" data-rv>
            <Link to="/contact" className="g-btn g-dark" data-mag>
              Request an introduction <ArrowIcon />
            </Link>
            <Link to={siteHref("gaa", "/gaa-consulting/careers")} className="g-btn g-outline-dark" data-mag>
              Careers &amp; CS training
            </Link>
          </div>
        </div>
      </section>
    </GroupPage>
  );
}
