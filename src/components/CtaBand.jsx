import React from "react";
import { Link } from "../router";
import Icon from "./Icon";

/* Closing call to action used at the end of each page */
export default function CtaBand({ eyebrow = "Let's talk", title = ["Tell us what you need.", "We'll send a fixed-scope proposal."], text, to = "/contact", button = "Request a Proposal", second }) {
  return (
    <section className="ff-cta">
      <div className="ff-in">
        <div className="ff-cta-box rv">
          <div>
            <span className="ff-eye">{eyebrow}</span>
            <h2>{title.map((t) => <span key={t}>{t}</span>)}</h2>
            <p>{text || "Share a few details about your business. A senior member of the Filings First team will get back to you with a clear scope, timeline and fee."}</p>
          </div>
          <div className="ff-cta-r">
            <Link className="ff-btn wh" to={to}>{button} <Icon name="arrow" /></Link>
            {second && <Link className="ff-btn gh" to={second.to}>{second.label} <Icon name="arrow" /></Link>}
            <small>Your details are used only to respond to you.</small>
          </div>
        </div>
      </div>
    </section>
  );
}
