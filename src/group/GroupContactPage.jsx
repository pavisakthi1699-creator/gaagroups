import React from "react";
import { GroupPage } from "./GroupChrome.jsx";
import ContactBlock from "./ContactBlock.jsx";
import { BrandDoors } from "./GroupHome.jsx";
import { Link } from "./router.jsx";

export default function GroupContactPage() {
  return (
    <GroupPage>
      <div className="g-contact-page">
        <ContactBlock />
        <section className="g-cos g-tight" aria-label="Visit a company">
          <div className="g-wrap">
            <div className="g-sec-h">
              <span className="g-eb">Prefer to browse first?</span>
              <h2>Visit a company website.</h2>
            </div>
            <BrandDoors compact />
          </div>
        </section>
      </div>
    </GroupPage>
  );
}

export function NotFound() {
  return (
    <GroupPage>
      <section className="g-404">
        <div className="g-wrap">
          <span className="g-eb">Page not found</span>
          <h1 className="g-h1 g-sm">This page has moved.</h1>
          <p>The link may be old. Start from the home page or pick a company below.</p>
          <div className="g-acts"><Link to="/" className="g-btn g-accent">Go to home page</Link></div>
          <BrandDoors compact />
        </div>
      </section>
    </GroupPage>
  );
}
