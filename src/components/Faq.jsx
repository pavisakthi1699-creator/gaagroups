import React, { useState } from "react";
import { Link } from "../router";
import Icon from "./Icon";

/* Questions section shared by every service page: intro and help card on the left, accordion on the right.
   The open question turns dark with an orange accent. */
export default function Faq({ faq, title = "Common questions,\nclear answers.", contact = "/contact", company = "our team" }) {
  const [open, setOpen] = useState(0);
  const [t1, t2] = String(title).replace(/\.$/, "").split("\n");
  return (
    <section className="fq" id="faq">
      <div className="ff-in fq-in">
        <div className="fq-l">
          <span className="ff-eye">Frequently asked questions</span>
          <h2 className="ff-h2"><span>{t1}</span>{t2 && <span className="hw-o">{t2}.</span>}</h2>
          <p className="ff-p">Straight answers to what clients ask us most. If your question is not here, we will answer it in a short call.</p>
          <div className="fq-help">
            <span className="fq-help-i"><Icon name="mail" /></span>
            <div><b>Still have a question?</b><span>Talk to {company}.</span></div>
            <Link className="fq-help-a" to={contact} aria-label="Ask a question"><Icon name="arrow" /></Link>
          </div>
        </div>
        <div className="fq-list">
          {faq.map((f, i) => (
            <div key={f.q} className={`fq-it${open === i ? " open" : ""}`}>
              <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
                <span className="fq-n">{String(i + 1).padStart(2, "0")}</span>
                <span className="fq-q">{f.q}</span>
                <span className="fq-ic"><Icon name="plus" /></span>
              </button>
              <div className="fq-a"><div><p>{f.a}</p></div></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
