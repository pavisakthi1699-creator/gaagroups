import React, { useEffect, useRef } from "react";
import { Link } from "../../router";
import { runGroupPage } from "./effects";

/* GAA Group home page: same design as the GAA Group website, built in React. Styles: src/styles/group-home.css */
export default function GroupHome() {
  const root = useRef(null);
  const dialRef = useRef(null);
  useEffect(() => runGroupPage("home", root.current, dialRef), []);
  return (
    <div className="ggh" ref={root}>
<main>

<section className="hz hx-c" id="top"><div className="hx-in"><div className="hx-main">
  <div className="hx-ctr"><span className="hx-eye hr" style={{"--k": "0"}}>Advisory<i></i>Compliance<i></i>Talent</span><h1 className="hx-h1 hr" style={{"--k": "1"}} id="hxFit"><span>Your ambition. <br className="mb" />Our expertise.</span><span>One <em className="hw-o">team.</em></span></h1></div>
  <div className="hx-cols hr" style={{"--k": "3"}}><p className="hx-p">Entering India, acquiring a business or making an investment, GAA brings business, tax and regulatory advice together. We support companies, founders, family offices and investors across M&amp;A, cross-border transactions, corporate structuring and NBFC matters, with senior experts involved from initial planning through execution and post-deal support.</p></div>
  <div className="hx-ctr"><div className="hx-btns hr" style={{"--k": "4"}}><Link className="hw-b pri" to="/contact">Book a Consultation <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></Link><a className="hw-b sec" href="#services">Explore Our Services <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a></div><p className="hx-note hr" style={{"--k": "5"}}>Tell us what you need. We’ll connect you with the right team.</p></div>
</div><div className="hx-strip hr" style={{"--k": "6"}}><span>Regulatory depth</span><span>Dedicated teams</span><span>Ownership of execution</span></div></div></section>
<section className="os" id="services">
  <div className="os-in">
    <div className="os-head">
      <span className="os-eye">Our services</span>
      <h2 className="os-h2">Specialist expertise. One connected group.</h2>
      <p className="os-sub">Advisory and business support services from GAA Consulting, Filings First and Hirings First.</p>
    </div>
    <div className="os-grid"><div className="os-col" style={{"--c": "0"}}><h3 className="os-ch"><button type="button" className="os-tg" aria-expanded="false"><span>Entry &amp; Transactions</span><i aria-hidden="true"></i></button></h3><div className="os-list"><Link className="os-it" to="/gaa-consulting/india-entry" style={{"--k": "0"}}><span className="os-tx"><b>India Entry Desk</b><small>Establish and operate your business in India.</small></span><i><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" /></svg></i></Link><Link className="os-it" to="/gaa-consulting/corporate-advisory" style={{"--k": "1"}}><span className="os-tx"><b>Corporate Advisory</b><small>Advice on corporate matters, governance and business decisions.</small></span><i><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" /></svg></i></Link><Link className="os-it" to="/gaa-consulting/transactional-advisory" style={{"--k": "2"}}><span className="os-tx"><b>Transactional Advisory</b><small>Support for evaluating, structuring and executing transactions.</small></span><i><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" /></svg></i></Link><Link className="os-it" to="/gaa-consulting/fundraising-advisory" style={{"--k": "3"}}><span className="os-tx"><b>Fundraising Advisory</b><small>Advisory and execution support for your fundraising process.</small></span><i><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" /></svg></i></Link></div></div><div className="os-col" style={{"--c": "1"}}><h3 className="os-ch"><button type="button" className="os-tg" aria-expanded="false"><span>Regulatory &amp; Tax</span><i aria-hidden="true"></i></button></h3><div className="os-list"><Link className="os-it" to="/gaa-consulting/nbfc-compliance-office" style={{"--k": "4"}}><span className="os-tx"><b>NBFC Compliance Office</b><small>Regulatory compliance, governance and advisory support for NBFCs.</small></span><i><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" /></svg></i></Link><Link className="os-it" to="/filings-first/startup-compliance-office" style={{"--k": "5"}}><span className="os-tx"><b>Startup Compliance Office</b><small>Company setup, governance and startup compliance support.</small></span><i><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" /></svg></i></Link><Link className="os-it" to="/filings-first/tax-financial-compliance" style={{"--k": "6"}}><span className="os-tx"><b>Tax &amp; Financial Compliance</b><small>Specialist support for tax obligations and financial compliance.</small></span><i><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" /></svg></i></Link></div></div><div className="os-col" style={{"--c": "2"}}><h3 className="os-ch"><button type="button" className="os-tg" aria-expanded="false"><span>Operations &amp; People</span><i aria-hidden="true"></i></button></h3><div className="os-list"><Link className="os-it" to="/filings-first/accounting-bookkeeping" style={{"--k": "7"}}><span className="os-tx"><b>Accounting &amp; Bookkeeping</b><small>Reliable financial records and clear business reporting.</small></span><i><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" /></svg></i></Link><Link className="os-it" to="/hirings-first/talent-acquisition" style={{"--k": "8"}}><span className="os-tx"><b>Talent Acquisition</b><small>Recruitment support for business and leadership roles.</small></span><i><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" /></svg></i></Link><Link className="os-it" to="/hirings-first/workforce-hr-solutions" style={{"--k": "9"}}><span className="os-tx"><b>Workforce &amp; HR Solutions</b><small>Support for HR policies, people operations and workforce processes.</small></span><i><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" /></svg></i></Link></div></div></div>
    <div className="os-foot"><span>Not sure where to start?</span><Link className="os-cta" to="/contact">Talk to our team <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" /></svg></Link></div>
  </div>
</section>
<section className="wg" id="section-3">
  <div className="wg-in">
    <div className="wg-l">
      <span className="wg-eye">Why GAA</span>
      <h2 className="wg-h2">More than advice. Ownership of <em>execution.</em></h2>
      <p className="wg-p">Commercial, tax and regulatory perspectives, brought together around your business.</p>
      <Link className="wg-btn" to="/our-team">Meet Our Team <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" /></svg></Link>
    </div>
    <div className="wg-grid"><article className="wg-c" style={{"--k": "0"}}><span className="wg-n">01</span><h3>Professional-led <br />involvement</h3><p>Experienced practitioners stay involved in key decisions and throughout delivery.</p></article><article className="wg-c" style={{"--k": "1"}}><span className="wg-n">02</span><h3>Connected expertise</h3><p>Corporate, transaction, tax and regulatory specialists work together around your business objectives.</p></article><article className="wg-c" style={{"--k": "2"}}><span className="wg-n">03</span><h3>Advice grounded <br />in execution</h3><p>Practical recommendations backed by documentation, coordination and implementation support.</p></article><article className="wg-c" style={{"--k": "3"}}><span className="wg-n">04</span><h3>Clear accountability</h3><p>Defined scopes, a dedicated point of contact and regular updates keep engagements on track.</p></article></div>
  </div>
</section>
<section className="gc" id="companies">
  <div className="gc-in">
    <div className="gc-head"><span className="gc-eye">Our group companies</span>
      <h2 className="gc-h2">Three specialist companies. <br />One coordinated group.</h2>
      <p className="gc-sub">GAA Group brings together advisory, business support and talent expertise through three specialist companies, connecting the right teams around your needs.</p></div>
    <div className="gc-grid"><Link className="gc-c" to="/gaa-consulting" style={{"--k": "0"}}>
        <span className="gc-lg"><img src="/images/group/c5505df3de.webp" alt="GAA Consulting logo" /></span>
        <span className="gc-k">Advisory</span><b className="gc-n">GAA Consulting</b><span className="gc-d">Corporate and transaction advisory, India entry and NBFC matters.</span></Link><Link className="gc-c" to="/filings-first" style={{"--k": "1"}}>
        <span className="gc-lg"><img src="/images/group/3d314fc428.png" alt="Filings First logo" /></span>
        <span className="gc-k">Business Support</span><b className="gc-n">Filings First</b><span className="gc-d">Accounting, tax, statutory filings and ongoing business support.</span></Link><Link className="gc-c" to="/hirings-first" style={{"--k": "2"}}>
        <span className="gc-lg"><img src="/images/group/e20d83fa50.webp" alt="Hirings First logo" /></span>
        <span className="gc-k">Talent &amp; People</span><b className="gc-n">Hirings First</b><span className="gc-d">Recruitment, workforce solutions and HR support.</span></Link></div>
    <div className="gc-nav" aria-label="Browse companies"><span className="gc-dots">{[0, 1, 2].map((k) => <i key={k} data-k={k} />)}</span><button type="button" className="gc-prev" aria-label="Previous company"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6" /></svg></button><button type="button" className="gc-next" aria-label="Next company"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></button></div>
    <div className="gc-foot"><b>Connected expertise. Coordinated around your business.</b><Link className="gc-cta" to="/contact">Talk to our team <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" /></svg></Link></div>
  </div>
</section>
</main>
    </div>
  );
}
