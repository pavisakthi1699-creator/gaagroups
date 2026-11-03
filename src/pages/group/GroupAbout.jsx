import React, { useEffect, useRef } from "react";
import { Link } from "../../router";
import { runGroupPage } from "./effects";

/* GAA Group about page: same design as the GAA Group website, built in React. Styles: src/styles/group-about.css */
export default function GroupAbout() {
  const root = useRef(null);
  const dialRef = useRef(null);
  useEffect(() => runGroupPage("about", root.current, dialRef), []);
  return (
    <div className="gga" ref={root}>
<main>
<section className="hz ah2" id="top"><div className="hx-in"><div className="hx-main">
  <span className="hx-eye ah2-eye hr" style={{"--k": "0"}}>GAA Group</span>
  <h1 className="ah2-h1 hr" style={{"--k": "1"}} id="ahFit"><span className="l1">One Group.</span><span className="l2">Every Dimension of <br className="mb" />Business <em className="hw-o">Growth.</em></span></h1>
  <p className="ah2-lead hr" style={{"--k": "2"}}>GAA Group is an integrated business solutions group bringing together corporate advisory, financial operations and workforce expertise to support businesses across their lifecycle.</p>
  <div className="ah2-cols hr" style={{"--k": "3"}}><p>Our approach extends beyond individual services. We help businesses establish strong foundations, navigate regulatory and operational complexities, strengthen financial processes and build the teams they need to grow.</p><p>Through our specialized businesses we combine distinct areas of expertise within one connected ecosystem, delivering coordinated support that enables businesses to operate with clarity, confidence and a long-term vision for growth.</p></div>
  <div className="hx-btns ah2-btns hr" style={{"--k": "4"}}><a className="hw-b pri" href="#connected">Explore Our Group <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a><Link className="hw-b sec" to="/our-team">Meet Our Team <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></Link></div>
</div><div className="hx-strip hr" style={{"--k": "6"}}><span>GAA Consulting <small>Corporate Advisory &amp; Compliance</small></span><span>Filings First <small>Accounting &amp; Taxation</small></span><span>Hirings First <small>Talent &amp; Workforce Solutions</small></span></div></div></section>
<section className="lc" id="connected"><div className="lc-in">
  <div className="lc-l">
    <span className="lc-eye">How our companies are connected</span>
    <h2 className="lc-h2">Three companies. <em className="hw-o">One connected journey.</em></h2>
    <p className="lc-p">Through our specialised businesses we combine distinct areas of expertise within one connected ecosystem, delivering coordinated support that enables businesses to operate with clarity, confidence and a long-term vision for growth.</p>
    <ul className="lc-pts"><li><b>One point of contact</b><span>for every company in the group</span></li><li><b>One shared view</b><span>of your business and its plans</span></li><li><b>One coordinated plan</b><span>across advice, compliance and people</span></li></ul>
  </div>
  <ol className="lc-list"><span className="lc-rail" aria-hidden="true"><i></i></span><li className="lc-r" style={{"--k": "0"}}>
        <span className="lc-dot"><img src="/images/group/c5505df3de.webp" alt="GAA Consulting logo" /></span>
        <div className="lc-body">
          <div className="lc-meta"><span className="lc-st">Stage 01</span><span className="lc-co">GAA Consulting <small>Corporate Advisory &amp; Compliance</small></span></div>
          <h3>Set up and structure</h3><p>Advises on India entry, structuring, transactions and NBFC matters, and lays the corporate foundation.</p>
          <span className="lc-hand"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6" /></svg>Hands the compliance calendar to Filings First</span>
        </div></li><li className="lc-r" style={{"--k": "1"}}>
        <span className="lc-dot"><img src="/images/group/3d314fc428.png" alt="Filings First logo" /></span>
        <div className="lc-body">
          <div className="lc-meta"><span className="lc-st">Stage 02</span><span className="lc-co">Filings First <small>Accounting &amp; Taxation</small></span></div>
          <h3>Run and comply</h3><p>Keeps books, tax and statutory filings accurate and on time as the business operates.</p>
          <span className="lc-hand"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6" /></svg>Shares people and payroll needs with Hirings First</span>
        </div></li><li className="lc-r" style={{"--k": "2"}}>
        <span className="lc-dot"><img src="/images/group/e20d83fa50.webp" alt="Hirings First logo" /></span>
        <div className="lc-body">
          <div className="lc-meta"><span className="lc-st">Stage 03</span><span className="lc-co">Hirings First <small>Talent &amp; Workforce Solutions</small></span></div>
          <h3>Grow the team</h3><p>Builds the teams the business needs, from leadership hires to workforce and HR support.</p>
          <span className="lc-hand"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>Feeds growth plans back into advisory and compliance</span>
        </div></li></ol>
</div></section>
<section className="au" id="firms">
  <div className="au-in">
    <div className="au-l">
      <div className="au-brand"><span className="au-eye au-big ar" style={{"--k": "0"}} id="auBig">GAA Group</span>
      <h2 className="au-h1 ar" style={{"--k": "1"}} id="auSub"><span>Three firms.</span> <em>One business journey.</em></h2></div>
      <div className="au-nms ar" style={{"--k": "2"}} aria-live="polite"><span className="au-nm act" data-f="0">GAA Consulting</span><span className="au-nm" data-f="1">Filings First</span><span className="au-nm" data-f="2">Hirings First</span></div>
      <div className="au-vbs ar" style={{"--k": "3"}}><div className="au-vb act" data-f="0"><span>Advise <em>·</em> </span><span>Structure</span></div><div className="au-vb" data-f="1"><span>Account <em>·</em> </span><span>Comply</span></div><div className="au-vb" data-f="2"><span>Recruit <em>·</em> </span><span>Staff</span></div></div>
      <div className="au-exs ar" style={{"--k": "4"}}><p className="au-ex act" data-f="0">Corporate advisory and compliance, from company structuring and secretarial governance to FEMA and transaction support.</p><p className="au-ex" data-f="1">Accounting and taxation, with bookkeeping, GST, income tax and statutory filings handled accurately and on time.</p><p className="au-ex" data-f="2">Talent and workforce solutions, from recruitment and staffing to HR support that builds the teams you need to grow.</p></div>
    </div>
    <div className="au-r ar" style={{"--k": "2"}}>
      <div className="au-dial" id="dial" style={{"--R": "0deg"}}>
        <svg viewBox="0 0 600 600" aria-hidden="true">
          <circle className="au-ring" cx="300" cy="300" r="240" />
          <circle className="au-in-ring" cx="300" cy="300" r="160" />
          <g className="au-rot"><circle className="au-prog" cx="300" cy="300" r="240" transform="rotate(210 300 300)" /><line className="au-ch" x1="180.0" y1="92.2" x2="420.0" y2="92.2" /><line className="au-ch" x1="540.0" y1="300.0" x2="420.0" y2="507.8" /><line className="au-ch" x1="180.0" y1="507.8" x2="60.0" y2="300.0" /><circle className="au-nd" data-f="0" cx="180.0" cy="92.2" r="6" /><circle className="au-nd" data-f="0" cx="420.0" cy="92.2" r="6" /><circle className="au-nd" data-f="1" cx="540.0" cy="300.0" r="6" /><circle className="au-nd" data-f="1" cx="420.0" cy="507.8" r="6" /><circle className="au-nd" data-f="2" cx="180.0" cy="507.8" r="6" /><circle className="au-nd" data-f="2" cx="60.0" cy="300.0" r="6" /></g>
          <g className="au-hl"><path className="au-arc" d="M92.2 180.0 A240 240 0 0 1 507.8 180.0" /><g className="au-glow"><line className="au-gch" x1="180.0" y1="92.2" x2="420.0" y2="92.2" />
      <circle className="au-halo" cx="180.0" cy="92.2" r="20" /><circle className="au-halo" cx="420.0" cy="92.2" r="20" />
      <circle className="au-gn" cx="180.0" cy="92.2" r="10" /><circle className="au-gn" cx="420.0" cy="92.2" r="10" /></g></g>
        </svg>
        <div className="au-lbs"><span className="au-lb act" data-f="0" style={{"--a": "-30deg"}}><i>Advise</i><b>Advise</b></span><span className="au-lb act" data-f="0" style={{"--a": "30deg"}}><i>Structure</i><b>Structure</b></span><span className="au-lb" data-f="1" style={{"--a": "90deg"}}><i>Account</i><b>Account</b></span><span className="au-lb" data-f="1" style={{"--a": "150deg"}}><i>Comply</i><b>Comply</b></span><span className="au-lb" data-f="2" style={{"--a": "210deg"}}><i>Recruit</i><b>Recruit</b></span><span className="au-lb" data-f="2" style={{"--a": "270deg"}}><i>Staff</i><b>Staff</b></span></div>
        <div className="au-core"><span className="au-cring"></span><span className="au-disc"><img className="au-cl act" data-f="0" src="/images/group/c5505df3de.webp" alt="GAA Consulting" /><img className="au-cl" data-f="1" src="/images/group/3d314fc428.png" alt="Filings First" /><img className="au-cl" data-f="2" src="/images/group/e20d83fa50.webp" alt="Hirings First" /></span></div>
      </div>
      <div className="au-legend" role="group" aria-label="Choose a firm"><button type="button" className="au-lgd act" data-f="0"><i></i><b>GAA Consulting:</b> Advise · Structure</button><button type="button" className="au-lgd" data-f="1"><i></i><b>Filings First:</b> Account · Comply</button><button type="button" className="au-lgd" data-f="2"><i></i><b>Hirings First:</b> Recruit · Staff</button></div>
    </div>
  </div>
</section>
</main>
    </div>
  );
}
