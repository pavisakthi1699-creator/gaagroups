import React, { useEffect, useRef } from "react";
import { Link } from "../../router";
import { runGroupPage } from "./effects";

/* GAA Group careers page: same design as the GAA Group website, built in React. Styles: src/styles/group-careers.css */
export default function GroupCareers() {
  const root = useRef(null);
  const dialRef = useRef(null);
  useEffect(() => runGroupPage("careers", root.current, dialRef), []);
  return (
    <div className="ggc" ref={root}>
<main>
<section className="cr" id="top"><div className="cr-in">
  <div className="cr-l">
    <span className="cr-eye">Careers</span>
    <h1 className="cr-h1">Grow your career with GAA <em className="hw-o">Group.</em></h1>
    <p className="cr-p">Whether you are a CS student, a qualified professional, a lawyer or a college student, GAA Group offers practical, mentored work across corporate advisory, compliance, accounting and talent. Choose the path that fits you and apply with your CV.</p>
    <div className="cr-btns"><Link className="cr-b pri" to="/contact#careers">Apply now <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></Link><a className="cr-b" href="#training">About CS Articleship <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a></div>
  </div>
  <ol className="cr-list"><li className="cr-row" id="p-articleship" style={{"--k": "0"}}><span className="cr-n">01</span><div className="cr-tx"><b>CS Articleship</b><p>For CS students. Practical company secretarial and compliance training on live files at GAA Consulting, with regular mentoring from practising professionals.</p></div><Link className="cr-ap" to="/contact#articleship">Apply <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></Link></li><li className="cr-row" id="p-cs-semi-qualified" style={{"--k": "1"}}><span className="cr-n">02</span><div className="cr-tx"><b>CS Semi-qualified</b><p>For CS professionals who have cleared the Executive level. Hands-on work in MCA filings, board processes and corporate compliance for a varied client base.</p></div><Link className="cr-ap" to="/contact#cs-semi-qualified">Apply <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></Link></li><li className="cr-row" id="p-cs-qualified" style={{"--k": "2"}}><span className="cr-n">03</span><div className="cr-tx"><b>CS Qualified</b><p>For qualified Company Secretaries. Roles in corporate advisory, secretarial compliance and governance, working directly with clients and senior professionals.</p></div><Link className="cr-ap" to="/contact#cs-qualified">Apply <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></Link></li><li className="cr-row" id="p-lawyers" style={{"--k": "3"}}><span className="cr-n">04</span><div className="cr-tx"><b>Lawyers</b><p>For law graduates and practising lawyers. Corporate, commercial, regulatory and transaction work alongside our advisory and compliance teams.</p></div><Link className="cr-ap" to="/contact#lawyers">Apply <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></Link></li><li className="cr-row" id="p-internship" style={{"--k": "4"}}><span className="cr-n">05</span><div className="cr-tx"><b>College Internship Programmes</b><p>For college students. Structured internships in advisory, compliance, accounting or HR, with a defined learning plan and real project work.</p></div><Link className="cr-ap" to="/contact#internship">Apply <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></Link></li></ol>
</div></section>
<section className="ct" id="training"><div className="ct-in">
  <div className="ct-top">
    <div className="ct-hd"><span className="ct-eye">CS Articleship</span>
      <h2 className="ct-h2">Learn the profession on <em className="hw-o">real files.</em></h2></div>
    <div className="ct-intro"><p>Practical company secretarial and compliance articleship at GAA Consulting, for CS students who want real work, close mentoring and a clear path into practice.</p>
      <div className="ct-btns"><Link className="ct-b pri" to="/contact#articleship">Apply for Articleship <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></Link></div></div>
  </div>
  <div className="ct-path"><span className="ct-track" aria-hidden="true"><i></i></span><ol><li className="ct-s" style={{"--k": "0"}}><span className="ct-n">01</span><b>Apply</b><p>Share your qualification and interests through the enquiry form.</p></li><li className="ct-s" style={{"--k": "1"}}><span className="ct-n">02</span><b>Practical exposure</b><p>Work on live corporate, secretarial and compliance matters.</p></li><li className="ct-s" style={{"--k": "2"}}><span className="ct-n">03</span><b>Mentorship</b><p>Regular guidance and review from practising company secretaries.</p></li><li className="ct-s" style={{"--k": "3"}}><span className="ct-n">04</span><b>Trainee experience</b><p>Hands-on MCA filings, board processes and M&amp;A due diligence.</p></li></ol></div>
  <div className="ct-foot"><span><b>Who it is for</b>CS pursuants</span><span><b>Where you train</b>GAA Consulting, alongside practising professionals</span><span><b>What you gain</b>Immersive training and expert mentorship</span></div>
  </div></section>
</main>
    </div>
  );
}
