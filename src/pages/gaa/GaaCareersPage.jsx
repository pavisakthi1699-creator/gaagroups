import React, { useRef } from "react";
import useGaaMotion from "./useGaaMotion";
import { GaaHeader, GaaSubBar, GaaFooter, SubHero, SectionHead, Split, FaqList, CtaBand, Ring, useLink } from "./GaaShell";
import { Link } from "../../group/router.jsx";

/* Careers & CS Training: moved off the group home page into its own GAA page (client feedback). */
const APPLY = "/contact?company=any";

const PROGRAMME = [
  ["Practical exposure", "Work on live corporate and compliance matters from your first week, not mock files."],
  ["Mentorship", "Regular one-to-one guidance from practising Company Secretaries and corporate lawyers."],
  ["Trainee experience", "Hands-on exposure to MCA secretarial filings, board processes and M&A due diligence."],
  ["Career path", "Strong trainees are considered for associate roles across GAA Consulting."],
];

const ROLES = [
  ["CS Trainee", "ICSI practical training for CS Executive and Professional students.", "Bengaluru"],
  ["Associate, Corporate Secretarial", "Qualified or semi-qualified CS with filing and board-process experience.", "Bengaluru"],
  ["Associate, Corporate Legal", "Law graduates interested in corporate, transactional and regulatory work.", "Bengaluru"],
];

const STEPS = [
  ["Apply", "Send your CV and the kind of work you want to do through the enquiry form."],
  ["Conversation", "A short call with our team to understand your goals and availability."],
  ["Practical task", "A simple exercise based on real secretarial or legal work."],
  ["Offer", "We share the role, mentor, start date and training plan in writing."],
];

const FAQS = [
  ["Who can apply for CS training?", "Students registered with ICSI who need practical training, and recent CS qualifiers who want structured exposure to live corporate work."],
  ["Is the training paid?", "Yes. Trainees receive a monthly stipend. Details are shared at the offer stage."],
  ["Where will I work?", "Our team works from Bengaluru. Some work involves client visits and meetings with regulators."],
  ["Do you hire throughout the year?", "Yes. We review applications every month and contact shortlisted candidates directly."],
];

export default function GaaCareersPage({ onNavigate }) {
  const ref = useRef(null);
  const link = useLink(onNavigate);
  useGaaMotion(ref, "Careers & CS Training | GAA Consulting");

  return (
    <div className="gaa-consulting-root gaa-sub" ref={ref}>
      <GaaHeader link={link} active="careers" />
      <GaaSubBar link={link} crumbs={[[null, "Careers & CS Training"]]} />
      <main>
        <SubHero
          variant="type"
          tag="Careers & CS Training"
          lines={["Learn on", "real files,", "with real mentors."]}
          em={[2]}
          sub="Practical exposure in company secretarial and compliance work, guided by practising professionals at GAA Consulting."
          actions={
            <>
              <Link to={APPLY} className="btn o">Apply for training <span className="ar">→</span></Link>
              <a className="btn g" href="#roles" onClick={(e) => { e.preventDefault(); document.getElementById("roles")?.scrollIntoView({ behavior: "smooth" }); }}>See open roles</a>
            </>
          }
          facts={[["4", "Stages from application to offer"], ["1:1", "Mentor for every trainee"], ["Live", "Client files from week one"]]}
        />

        <section className="s" id="programme">
          <div className="w">
            <SectionHead p="A structured programme that turns classroom knowledge into confident, practical skill.">
              What the programme <em>gives you.</em>
            </SectionHead>
            <dl className="svl">
              {PROGRAMME.map(([t, d]) => (
                <div key={t}>
                  <dt>{t}</dt>
                  <dd>{d}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="s alt" id="roles">
          <div className="w">
            <SectionHead p="We hire throughout the year. Apply even if the exact role is not listed.">
              Open <em>roles.</em>
            </SectionHead>
            <ol className="ledger nn">
              {ROLES.map(([t, d, loc]) => (
                <li key={t}>
                  <Link to={APPLY}>
                    <span className="lg-t">{t}</span>
                    <span className="lg-d">{d}</span>
                    <span className="lg-m">{loc}</span>
                    <span className="lg-a" aria-hidden="true">
                      <svg viewBox="0 0 24 24"><path d="M6 18 18 6M9 6h9v9" /></svg>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="s" id="process">
          <div className="w">
            <SectionHead p="Simple and quick. Most applicants hear back within two weeks.">
              How to <em>apply.</em>
            </SectionHead>
            <ol className="trk draw">
              {STEPS.map(([t, d], i) => (
                <li key={t}>
                  <span className="trk-n">{i + 1}</span>
                  <b>{t}</b>
                  <p>{d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <Split id="faq" alt title={<>Questions from <em>applicants.</em></>} p="Anything else? Ask us through the enquiry form.">
          <FaqList items={FAQS} />
        </Split>

        <CtaBand link={link} title="Start your" em="CS career here." p="Share your CV and the kind of work you want to do. Our team reviews applications every month." />
      </main>
      <GaaFooter link={link} />
      <Ring />
    </div>
  );
}
