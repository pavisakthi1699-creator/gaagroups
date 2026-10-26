// Premium contact section used on the group Home page and the /contact page.
import React, { useMemo, useState } from "react";
import { COMPANIES, ORDER, GROUP } from "./sites.js";

const TOPICS = {
  gaa: ["Corporate law", "Company secretarial", "Mergers & acquisitions", "Fundraising & restructuring", "Regulatory advisory"],
  ff: ["Accounting", "Bookkeeping", "Taxation", "GST", "Corporate compliance"],
  hf: ["Hire talent", "Leadership hiring", "Campus placements", "Workforce outsourcing"],
  any: ["Not sure yet", "Careers & CS training", "Something else"],
};

function initialCompany() {
  try {
    const q = new URLSearchParams(window.location.search).get("company");
    if (q && (COMPANIES[q] || q === "any")) return q;
  } catch (e) {
    /* ignore */
  }
  return "any";
}

export default function ContactBlock({ heading = true }) {
  const [co, setCo] = useState(initialCompany);
  const [topic, setTopic] = useState(TOPICS[initialCompany()][0]);
  const [f, setF] = useState({ name: "", email: "", phone: "", company: "", message: "", website: "" });
  const [status, setStatus] = useState({ type: "", text: "" });
  const [sending, setSending] = useState(false);
  const target = useMemo(() => (co === "any" ? COMPANIES.gaa : COMPANIES[co]), [co]);

  const pick = (k) => {
    setCo(k);
    setTopic(TOPICS[k][0]);
  };
  const on = (e) => setF((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (f.website) return; // spam trap
    const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email);
    if (!f.name.trim() || !okEmail) {
      setStatus({ type: "er", text: "Please add your name and a valid email address." });
      document.getElementById(!f.name.trim() ? "gc-name" : "gc-email")?.focus();
      return;
    }
    const payload = { company: co === "any" ? "GAA Group" : target.name, topic, ...f, page: window.location.href };
    setSending(true);
    try {
      if (GROUP.formEndpoint) {
        const r = await fetch(GROUP.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(payload) });
        if (!r.ok) throw new Error("send failed");
        setStatus({ type: "ok", text: "Thank you. Our team will get back to you within one working day." });
        setF({ name: "", email: "", phone: "", company: "", message: "", website: "" });
      } else {
        const body = Object.entries(payload).filter(([k, v]) => v && k !== "website").map(([k, v]) => `${k}: ${v}`).join("\n");
        window.location.href = `mailto:${target.email}?subject=${encodeURIComponent(`Website enquiry: ${topic}`)}&body=${encodeURIComponent(body)}`;
        setStatus({ type: "ok", text: `Your email app should now open with the enquiry addressed to ${target.email}.` });
      }
    } catch (err) {
      setStatus({ type: "er", text: `Something went wrong. Please email us at ${target.email}.` });
    }
    setSending(false);
  };

  return (
    <section className="g-contact" id="contact" aria-labelledby="gc-h">
      <div className="g-wrap g-contact-in">
        <div className="g-contact-l">
          {heading && <span className="g-eb" data-rv>Contact us</span>}
          <h2 id="gc-h" data-rv>Let's talk about <span>your business.</span></h2>
          <p data-rv>Tell us what you need. The right specialist from our three firms will reply within one working day.</p>
          <ul className="g-contact-cos">
            {ORDER.map((k) => {
              const c = COMPANIES[k];
              return (
                <li key={k}>
                  <span className="g-plate g-xs"><img src={c.logo} alt="" /></span>
                  <div>
                    <b>{c.name}</b>
                    <span>
                      {c.email && <a href={`mailto:${c.email}`}>{c.email}</a>}
                      {c.phone && <a href={`tel:${c.phone.replace(/\s/g, "")}`}>{c.phone}</a>}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="g-office">{GROUP.office}</p>
        </div>

        <form className="g-form" onSubmit={submit} noValidate data-rv>
          <fieldset className="g-seg">
            <legend>I need help with</legend>
            <div>
              {[...ORDER, "any"].map((k) => (
                <label key={k} className={co === k ? "on" : ""}>
                  <input type="radio" name="co" value={k} checked={co === k} onChange={() => pick(k)} />
                  <span>{COMPANIES[k] ? COMPANIES[k].two : "Not sure"}</span>
                  <small>{COMPANIES[k] ? COMPANIES[k].name : "Any company"}</small>
                </label>
              ))}
            </div>
          </fieldset>
          <label className="g-field">
            <span>Topic</span>
            <select value={topic} onChange={(e) => setTopic(e.target.value)}>
              {TOPICS[co].map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
          <div className="g-two">
            <label className="g-field"><span>Full name *</span><input id="gc-name" name="name" value={f.name} onChange={on} autoComplete="name" required /></label>
            <label className="g-field"><span>Work email *</span><input id="gc-email" name="email" type="email" value={f.email} onChange={on} autoComplete="email" required /></label>
          </div>
          <div className="g-two">
            <label className="g-field"><span>Phone</span><input name="phone" type="tel" value={f.phone} onChange={on} autoComplete="tel" /></label>
            <label className="g-field"><span>Company</span><input name="company" value={f.company} onChange={on} autoComplete="organization" /></label>
          </div>
          <label className="g-field"><span>How can we help?</span><textarea name="message" rows={4} value={f.message} onChange={on} /></label>
          <input className="g-hp" name="website" value={f.website} onChange={on} tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <div className="g-form-foot">
            <button type="submit" className="g-btn g-accent" data-mag disabled={sending}>{sending ? "Sending…" : "Send enquiry"}</button>
            <span>We never share your details.</span>
          </div>
          {status.text && <p className={`g-status ${status.type}`} role="status">{status.text}</p>}
        </form>
      </div>
    </section>
  );
}
