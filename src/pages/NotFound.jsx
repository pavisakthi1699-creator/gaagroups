import React from "react";
import { Link } from "../router";
import Icon from "../components/Icon";

export default function NotFound() {
  return (
    <main>
      <section className="nf" id="top">
        <div className="nf-in">
          <span className="nf-code" aria-hidden="true">404</span>
          <span className="nf-eye">Page not found</span>
          <h1 className="nf-h1">This page has moved or does not <em className="hw-o">exist.</em></h1>
          <p className="nf-p">The link may be old or mistyped. These pages will help you find what you need.</p>
          <div className="nf-links">
            <Link className="nf-b pri" to="/">Go to Home <Icon name="arrow" className="" /></Link>
            <Link className="nf-b" to="/#services">Our Services <Icon name="arrow" className="" /></Link>
            <Link className="nf-b" to="/insights">Insights <Icon name="arrow" className="" /></Link>
            <Link className="nf-b" to="/contact">Contact Us <Icon name="arrow" className="" /></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
