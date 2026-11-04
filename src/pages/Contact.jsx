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
const Arrow = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const CARDS = [
  { key: "GAA Consulting", tag: "Advisory", logo: "/images/footer/gaa-consulting.png" },
  { key: "Filings First", tag: "Business support", logo: "/images/footer/filings-first.png" },
  { key: "Hirings First", tag: "Talent & people", logo: "/images/footer/hirings-first.png" },
];
const EXTRA = [{ key: "Careers", label: "Apply for a role" }, { key: "Other", label: "Something else" }];
const WORDS = ["India entry.", "compliance.", "next hire.", "fundraise."];
const STEPS = [
  ["Choose a company", "GAA Consulting, Filings First or Hirings First."],
  ["Pick a service", "So the right specialist picks it up first."],
  ["Share your details", "A senior team member replies with next steps."],
];
const groupOf = (v) => (GROUPS.find((g) => g.options.some(([x]) => x === v)) || GROUPS[0]).label;

function Typed() {
  const [t, setT] = useState(WORDS[0]);
  useEffect(() => {
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    let w = 0, i = WORDS[0].length, del = true, timer;
    const tick = () => {
      const word = WORDS[w];
      if (del) {
        i -= 1;
        setT(word.slice(0, i));
        if (i <= 0) { del = false; w = (w + 1) % WORDS.length; }
        timer = setTimeout(tick, 45);
      } else {
        i += 1;
        setT(WORDS[w].slice(0, i));
        if (i >= WORDS[w].length) { del = true; timer = setTimeout(tick, 1700); } else timer = setTimeout(tick, 85);
      }
    };
    timer = setTimeout(tick, 1800);
    return () => clearTimeout(timer);
  }, []);
  return <span className="cw-typed hw-o">{t || "\u00a0"}</span>;
}

export default function Contact() {
  const { hash } = useRouter();
  const top = useRef(null);
  const next = useRef(null);
  const form = useRef(null);
  const started = useRef(Date.now());
  const begun = useRef(false);
  const [step, setStep] = useState(1);
  const [back, setBack] = useState(false);
  const [group, setGroup] = useState("");
  const [svc, setSvc] = useState("");
  const [shake, setShake] = useState(0);
  const [bad, setBad] = useState({});
  const [err, setErr] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(null);

  const pick = BY[svc] || BY["india-entry"];
  const rec = REC.includes(svc);
  const options = (GROUPS.find((g) => g.label === group) || { options: [] }).options;

  const go = (n, b = false) => { setBack(b); setStep(n); };

  /* preselect from the address, e.g. /contact#tax jumps to the details step, /contact#hirings-first to the service step */
  useEffect(() => {
    const h = (hash || "").replace("#", "");
    if (!h) return;
    if (COMPANY[h]) { setGroup(GROUPS.find((g) => g.options.some(([x]) => x === COMPANY[h])).label); setSvc(""); go(2); return; }
    if (BY[h]) { setGroup(groupOf(h)); setSvc(h); go(3); }
  }, [hash]);

  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => top.current && top.current.classList.add("in")));
    if (!("IntersectionObserver" in window)) { next.current.classList.add("on"); return undefined; }
    const io = new IntersectionObserver((es) => es.forEach((x) => { if (x.isIntersecting) { x.target.classList.add("on"); io.disconnect(); } }), { threshold: 0.2 });
    io.observe(next.current);
    return () => io.disconnect();
  }, []);

  const chooseGroup = (g) => {
    setGroup(g);
    const opts = GROUPS.find((x) => x.label === g).options;
    if (opts.length === 1) { setSvc(opts[0][0]); setTimeout(() => go(3), 300); return; }
    setSvc("");
    setTimeout(() => go(2), 300);
  };
  const chooseSvc = (v) => {
    setSvc(v);
    if (!begun.current) { begun.current = true; track("form_start", { form: "enquiry", service: v }); }
    setTimeout(() => go(3), 300);
  };
  const nudge = () => setShake((k) => k + 1);

  const clear = (name) => { setErr(""); setBad((b) => (b[name] ? { ...b, [name]: false } : b)); };

  const submit = async (e) => {
    if (e) e.preventDefault();
    if (step === 1) return group ? go(2) : nudge();
    if (step === 2) return svc ? go(3) : nudge();
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

  const again = () => { form.current.reset(); setGroup(""); setSvc(""); go(1); setDone(null); setBad({}); begun.current = false; started.current = Date.now(); };
  const btnText = step < 3 ? "Continue" : sending ? "Sending..." : rec ? "Send application" : "Send enquiry";

  return (
    <main className="gcu" id="top-wrap">
      <section className="cw" id="top" ref={top}>
        <div className="cw-glow" aria-hidden="true" />
        <div className="cw-in">
          <div className="cw-l">
            <span className="cw-eye cr" style={{ "--k": 0 }}>Contact us</span>
            <h1 className="cw-h1 cr" style={{ "--k": 1 }}>Let&rsquo;s plan your<br /><Typed /></h1>
            <p className="cw-p cr" style={{ "--k": 2 }}>Three quick steps and your enquiry reaches the right specialist at GAA Consulting, Filings First or Hirings First, with everything they need to respond properly.</p>
            <div className="cw-q cr" style={{ "--k": 4 }}>
              <a href={`mailto:${SITE.email}`}><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m4 7 8 6 8-6" /></svg><span><small>Email</small>{SITE.email}</span></a>
              <a href={`tel:${SITE.phoneHref}`}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg><span><small>Phone</small>{SITE.phone}</span></a>
              <div className="cw-addr"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg><span><small>{SITE.company}</small>{SITE.address}</span></div>
            </div>
          </div>

          <div className="cw-r cr" style={{ "--k": 2 }}>
            <ol className="cw-steps" style={{ "--p": (step - 1) / 2 }}>
              {STEPS.map(([t, d], i) => (
                <li key={t} className={`${i < step ? "on" : ""}${i === step - 1 ? " cur" : ""}`}>
                  <span className="cw-n">{i < step - 1 ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg> : String(i + 1).padStart(2, "0")}</span>
                  <span className="cw-sx"><b>{t}</b><small>{d}</small></span>
                </li>
              ))}
            </ol>
            <form className={`cw-card${done ? " done" : ""}`} id="cuForm" noValidate ref={form} onSubmit={submit} onInput={(e) => clear(e.target.name)} onChange={(e) => clear(e.target.name)}>
              <div className="cw-body">

                <div className={`cw-st${step === 1 ? " on" : ""}${back ? " back" : ""}`} aria-hidden={step !== 1}>
                  <h2>Which company can help?</h2>
                  <p>Not sure? Choose the closest fit and we will route it internally.</p>
                  <div className="cw-opts" key={`s1${shake}`} data-shake={shake ? "1" : undefined}>
                    {CARDS.map((c) => (
                      <button type="button" key={c.key} className={`cw-opt${group === c.key ? " on" : ""}`} onClick={() => chooseGroup(c.key)} tabIndex={step === 1 ? 0 : -1}>
                        <span className="cw-lg"><img src={c.logo} alt="" /></span><b>{c.key}</b><small>{c.tag}</small>
                      </button>
                    ))}
                  </div>
                  <div className="cw-extra">
                    {EXTRA.map((x) => (
                      <button type="button" key={x.key} className={group === x.key ? "on" : ""} onClick={() => chooseGroup(x.key)} tabIndex={step === 1 ? 0 : -1}>{x.label} <Arrow /></button>
                    ))}
                  </div>
                </div>

                <div className={`cw-st${step === 2 ? " on" : ""}${back ? " back" : ""}`} aria-hidden={step !== 2}>
                  <h2>{group === "Careers" ? "Which role are you applying for?" : "What do you need help with?"}</h2>
                  <p>{group === "Careers" ? "Choose the closest match. You will be able to upload your CV next." : "Select one service. You can mention others in your message."}</p>
                  <div className="cw-list" key={`s2${group}${shake}`} data-shake={shake ? "1" : undefined}>
                    {options.map(([v, l], i) => (
                      <button type="button" key={v} className={svc === v ? "on" : ""} style={{ animationDelay: `${i * 50}ms` }} onClick={() => chooseSvc(v)} tabIndex={step === 2 ? 0 : -1}><i />{l}</button>
                    ))}
                  </div>
                </div>

                <div className={`cw-st${step === 3 ? " on" : ""}${back ? " back" : ""}`} aria-hidden={step !== 3}>
                  <h2>{rec ? "Your application" : "Your details"}</h2>
                  <p>Sending to <b>{pick.to}</b> &middot; <b>{svc ? pick.l : "-"}</b></p>
                  <div className="cw-f">
                    <label className={`cw-fd${bad.name ? " bad" : ""}`}><input name="name" required autoComplete="name" placeholder=" " /><span>Full name *</span></label>
                    <label className={`cw-fd${bad.email ? " bad" : ""}`}><input name="email" type="email" required autoComplete="email" placeholder=" " /><span>Business email *</span></label>
                    <label className="cw-fd"><input name="company" autoComplete="organization" placeholder=" " /><span>{rec ? "Current college / employer" : "Company / organisation"}</span></label>
                    <label className="cw-fd"><input name="phone" type="tel" autoComplete="tel" placeholder=" " /><span>Phone</span></label>
                    <label className={`cw-fd cw-full${bad.message ? " bad" : ""}`}><textarea name="message" required rows={3} placeholder=" " /><span>{rec ? "Tell us about yourself *" : "Tell us what you need *"}</span></label>
                    {rec && <label className={`cw-cv cw-full${bad.cv ? " bad" : ""}`}><b>Upload your CV *</b><small>PDF, DOC or DOCX, up to 3 MB</small><input name="cv" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" /></label>}
                    {!rec && <input type="file" name="cv" hidden tabIndex={-1} aria-hidden="true" />}
                    <label className={`cw-cn cw-full${bad.consent ? " bad" : ""}`}><input type="checkbox" name="consent" required /><span>I agree to GAA Group contacting me about this enquiry, as described in the <Link to="/privacy">privacy notice</Link>. *</span></label>
                    <div className="cu-hp" aria-hidden="true"><label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
                  </div>
                  <p className={`cw-err${err ? " on" : ""}`} role="alert">{err}</p>
                </div>

                <div className="cw-nav">
                  <button type="button" className="cw-back" disabled={step === 1} onClick={() => go(step - 1, true)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>Back</button>
                  <button type="submit" className="cw-btn" disabled={sending}><span>{btnText}</span> <Arrow /></button>
                </div>
              </div>

              <div className="cw-ok" role="status">
                <span className="cw-ok-i"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg></span>
                <h3>{done && done.rec ? "Your application is on its way." : "You're all set."}</h3>
                <p>It has been routed to the <b>{done ? done.to : pick.to}</b> team, who will get back to you shortly.{done && done.ack ? " A confirmation has been sent to your email." : ""}</p>
                <button type="button" className="cw-again" onClick={again}>Send another enquiry</button>
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
