import React, { useEffect, useRef, useState } from "react";
import { Link, useRouter } from "../router";
import { SITE } from "../site";
import { sendEnquiry, track } from "../lib/send";

/* Contact Us: same design and flow as the GAA Group website. Enquiries are routed to the right company. */
const GROUPS = [
  { label: "GAA Consulting", to: "GAA Consulting", options: [["india-entry", "India Entry Desk"], ["corporate", "Corporate Advisory"], ["transactions", "Transactional Advisory"], ["fundraising", "Fundraising Advisory"], ["nbfc", "NBFC Compliance Office"], ["startup", "Startup Compliance Office (legal)"]] },
  { label: "Filings First", to: "Filings First", options: [["accounting", "Accounting & Bookkeeping"], ["tax", "Tax & Financial Compliance"], ["ff-startup", "Startup Compliance Office"]] },
  { label: "Hirings First", to: "Hirings First", options: [["talent", "Talent Acquisition"], ["workforce", "Workforce & HR Solutions"]] },
  { label: "Careers", to: null, options: [["articleship", "CS Articleship", "GAA Consulting"], ["cs-semi-qualified", "CS Semi-qualified", "GAA Consulting"], ["cs-qualified", "CS Qualified", "GAA Consulting"], ["lawyers", "Lawyers", "GAA Consulting"], ["internship", "College Internship Programmes", "Hirings First"], ["accounts-roles", "Accounts and finance roles", "Filings First"], ["careers", "Other roles", "GAA Group"]] },
  { label: "Other", to: "GAA Group", options: [["other", "Something else"]] },
];
const OPTIONS = GROUPS.flatMap((g) => g.options.map(([v, l, to]) => ({ v, l, to: to || g.to })));
const BY = Object.fromEntries(OPTIONS.map((o) => [o.v, o]));
const COMPANY = { "gaa-consulting": "corporate", "filings-first": "accounting", "hirings-first": "talent" };
const REC = ["articleship", "cs-semi-qualified", "cs-qualified", "lawyers", "internship", "accounts-roles", "careers"];
const ROUTES_TO = [
  { to: "GAA Consulting", small: "Advisory, transactions and corporate compliance", hash: "gaa-consulting" },
  { to: "Filings First", small: "Accounting, tax and statutory filings", hash: "filings-first" },
  { to: "Hirings First", small: "Recruitment, staffing and HR support", hash: "hirings-first" },
];
const Arrow = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export default function Contact() {
  const { hash } = useRouter();
  const top = useRef(null);
  const next = useRef(null);
  const form = useRef(null);
  const started = useRef(Date.now());
  const begun = useRef(false);
  const [svc, setSvc] = useState("india-entry");
  const [bad, setBad] = useState({});
  const [err, setErr] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(null);

  const pick = BY[svc] || BY["india-entry"];
  const rec = REC.includes(svc);

  /* preselect a service from the address, e.g. /contact#tax or /contact#hirings-first */
  useEffect(() => {
    const h = (hash || "").replace("#", "");
    const v = COMPANY[h] || h;
    if (v && BY[v]) setSvc(v);
  }, [hash]);

  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => top.current && top.current.classList.add("in")));
    if (!("IntersectionObserver" in window)) { next.current.classList.add("on"); return undefined; }
    const io = new IntersectionObserver((es) => es.forEach((x) => { if (x.isIntersecting) { x.target.classList.add("on"); io.disconnect(); } }), { threshold: 0.2 });
    io.observe(next.current);
    return () => io.disconnect();
  }, []);

  const clear = (name) => { setErr(""); setBad((b) => (b[name] ? { ...b, [name]: false } : b)); };
  const onInput = (e) => {
    if (!begun.current) { begun.current = true; track("form_start", { form: "enquiry", service: svc }); }
    clear(e.target.name);
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    const f = form.current;
    const fd = new FormData(f);
    const b = {};
    ["name", "email", "message"].forEach((k) => { if (!String(fd.get(k) || "").trim()) b[k] = true; });
    if (fd.get("email") && !EMAIL.test(fd.get("email"))) b.email = true;
    if (!f.consent.checked) b.consent = true;
    const file = rec && f.cv.files && f.cv.files[0];
    if (rec && !file) b.cv = true;
    setBad(b);
    const first = Object.keys(b)[0];
    if (first) { const el = f.elements[first]; if (el && el.focus) el.focus(); return; }
    if (file && file.size > 3 * 1024 * 1024) { setBad({ cv: true }); return setErr("Your CV is larger than 3 MB. Please upload a smaller file."); }
    if (file && !/\.(pdf|docx?)$/i.test(file.name)) { setBad({ cv: true }); return setErr("Please upload your CV as a PDF, DOC or DOCX file."); }
    const data = {
      type: rec ? "recruitment" : "client_lead", service: svc, serviceLabel: pick.l, routedTo: pick.to,
      name: fd.get("name"), company: fd.get("company"), email: fd.get("email"), phone: fd.get("phone"), message: fd.get("message"),
      consent: true, website: fd.get("website"), elapsedMs: Date.now() - started.current, page: window.location.href,
    };
    setSending(true);
    let res;
    try { res = await sendEnquiry(data, file || null); } catch (x) { res = { ok: false, error: "We could not reach the server. Please check your connection and try again." }; }
    setSending(false);
    if (!res.ok) return setErr(res.error);
    track(rec ? "recruitment_application" : "generate_lead", { service: svc, routed_to: pick.to });
    setDone({ rec, to: pick.to, ack: res.acknowledged });
  };

  const again = () => { form.current.reset(); setSvc("india-entry"); setDone(null); setBad({}); begun.current = false; started.current = Date.now(); };
  const btnText = sending ? "Sending..." : rec ? "Send application" : "Send enquiry";

  return (
    <main className="gcu" id="top-wrap">
      <section className="cu" id="top" ref={top}>
        <div className="cu-in">
          <div className="cu-l">
            <span className="cu-eye cr" style={{ "--k": 0 }}>Contact us</span>
            <h1 className="cu-h1 cr" style={{ "--k": 1 }}>Tell us what you need. We will route it <em className="hw-o">right.</em></h1>
            <p className="cu-p cr" style={{ "--k": 2 }}>Whether you are entering India, raising capital, setting up compliance or building a team, share a few details and your enquiry goes straight to the company best placed to help. A senior member of that team will get back to you.</p>
            <div className="cu-rk cr" style={{ "--k": 3 }}>Your enquiry is routed to</div>
            <ul className="cu-rts cr" style={{ "--k": 4 }}>
              {ROUTES_TO.map((r) => (
                <li key={r.to} className={`cu-rt${pick.to === r.to ? " on" : ""}`}>
                  <span className="cu-dot" />
                  <div><b>{r.to}</b><small>{r.small}</small></div>
                  <Link to={`/contact#${r.hash}`} aria-label={`Enquire with ${r.to}`}><Arrow /></Link>
                </li>
              ))}
            </ul>
            <div className="cu-loc cr" style={{ "--k": 5 }}>
              <div><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg><span><b>{SITE.company}</b>{SITE.address}</span></div>
              <a href={`mailto:${SITE.email}`}><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m4 7 8 6 8-6" /></svg><span>{SITE.email}</span></a>
            </div>
          </div>
          <div className="cu-r cr" style={{ "--k": 2 }}>
            <form className={`cu-f${rec ? " cv" : ""}${done ? " done" : ""}`} id="cuForm" noValidate ref={form} onSubmit={submit} onInput={onInput} onChange={(e) => clear(e.target.name)}>
              <div className="cu-fh">
                <div><h2>Request a fixed-scope proposal</h2><p>Takes about a minute. Fields marked * are required.</p></div>
                <span className="cu-to" id="cuTo">Routed to <b>{pick.to}</b></span>
              </div>
              <label className="cu-fd cu-full"><span>Which service do you need? *</span>
                <div className="cu-sel">
                  <select name="service" id="cuSvc" required value={svc} onChange={(e) => setSvc(e.target.value)}>
                    {GROUPS.map((g) => (
                      <optgroup key={g.label} label={g.label}>
                        {g.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                      </optgroup>
                    ))}
                  </select>
                </div>
              </label>
              <label className={`cu-fd${bad.name ? " bad" : ""}`}><span>Full name *</span><input name="name" required autoComplete="name" placeholder="Your name" /></label>
              <label className="cu-fd"><span>Company / Organisation</span><input name="company" autoComplete="organization" placeholder="Company name" /></label>
              <label className={`cu-fd${bad.email ? " bad" : ""}`}><span>Business email *</span><input name="email" type="email" required autoComplete="email" placeholder="name@company.com" /></label>
              <label className="cu-fd"><span>Phone</span><input name="phone" type="tel" autoComplete="tel" placeholder="+91" /></label>
              <label className={`cu-fd cu-full${bad.message ? " bad" : ""}`}><span>Tell us what you need *</span><textarea name="message" required rows={3} placeholder="Briefly describe your requirement" /></label>
              <label className={`cu-fd cu-full cu-cv${bad.cv ? " bad" : ""}`}><span>Upload your CV * <i>PDF, DOC or DOCX, up to 3 MB</i></span><input name="cv" id="cuCv" type="file" required={rec} accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" /></label>
              <label className={`cu-fd cu-full cu-cn${bad.consent ? " bad" : ""}`}><input type="checkbox" name="consent" id="cuConsent" required /><span>I agree to GAA Group contacting me about this enquiry, as described in the <Link to="/privacy">privacy notice</Link>. *</span></label>
              <div className="cu-hp" aria-hidden="true"><label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
              <div className="cu-ft cu-full">
                <button type="submit" className="cu-btn" id="cuBtn" disabled={sending}><span>{btnText}</span> <Arrow /></button>
                <small>Your details are sent securely and used only to respond to you.</small>
              </div>
              <p className={`cu-err cu-full${err ? " on" : ""}`} id="cuErr" role="alert">{err}</p>
              <div className="cu-ok" role="status">
                <span className="cu-ok-i"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg></span>
                <h3>{done && done.rec ? "Thank you. Your application is on its way." : "Thank you. Your enquiry is on its way."}</h3>
                <p>It has been routed to the <b>{done ? done.to : pick.to}</b> team, who will get back to you shortly.{done && done.ack ? " A confirmation has been sent to your email." : ""}</p>
                <button type="button" className="cu-again" onClick={again}>Send another enquiry</button>
              </div>
            </form>
          </div>
        </div>
      </section>
      <section className="nx" id="next" ref={next}>
        <div className="nx-in">
          <div className="nx-hd"><span className="nx-eye">What happens next</span><h2 className="nx-h2">From enquiry to a <em className="hw-o">clear proposal.</em></h2></div>
          <ol className="nx-steps">
            <li style={{ "--k": 0 }}><span className="nx-n">01</span><b>We review your enquiry</b><p>Your request reaches the company that handles that service, not a general inbox.</p></li>
            <li style={{ "--k": 1 }}><span className="nx-n">02</span><b>The right team gets in touch</b><p>A senior member of the team contacts you to understand the details and timelines.</p></li>
            <li style={{ "--k": 2 }}><span className="nx-n">03</span><b>You receive a fixed-scope proposal</b><p>A clear scope of work, deliverables and fees, so you know exactly what to expect.</p></li>
            <li style={{ "--k": 3 }}><span className="nx-n">04</span><b>Work begins with one point of contact</b><p>One owner coordinates across GAA Group companies if your work needs more than one.</p></li>
          </ol>
          <div className="nx-cos">
            <Link to="/gaa-consulting"><small>Advisory</small><b>GAA Consulting</b><Arrow /></Link>
            <Link to="/filings-first"><small>Business support</small><b>Filings First</b><Arrow /></Link>
            <Link to="/hirings-first"><small>Talent &amp; people</small><b>Hirings First</b><Arrow /></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
