import React from "react";
import { Link, useRouter } from "../router";
import { COMPANY, companyOf, SITE } from "../site";
import Icon from "./Icon";

/* Minimal call to action shown above the footer on every page (except Contact, Privacy and the 404 page) */
const SKIP = ["/contact", "/privacy", "/404"];
export default function MiniCta() {
  const { path } = useRouter();
  if (SKIP.includes(path)) return null;
  const co = companyOf(path);
  const name = co ? COMPANY[co].name : "GAA Group";
  const svc = co ? COMPANY[co].services.find((s) => s.path === path) : null;
  const to = svc ? `/contact#${svc.contact}` : co ? `/contact#${co}` : "/contact";
  return (
    <section className="mc" aria-label="Contact">
      <div className="ff-in mc-in">
        <div className="mc-t">
          <span className="mc-dot" aria-hidden="true" />
          <p><b>Have something in mind?</b> Tell {name} what you need and we will reply with a clear scope and fee.</p>
        </div>
        <div className="mc-r">
          <a className="mc-ph" href={`tel:${SITE.phoneHref}`}><Icon name="phone" />{SITE.phone}</a>
          <Link className="mc-btn" to={to}>Talk to Our Team <Icon name="arrow" /></Link>
        </div>
      </div>
    </section>
  );
}
