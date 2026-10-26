// Per-page SEO: title, description, canonical, Open Graph and Twitter tags.
// The build script (scripts/seo-pages.mjs) writes the same tags into static HTML
// for every route, so crawlers see them without running JavaScript.
import { useEffect } from "react";
import { HERE } from "./sites.js";

function setMeta(attr, key, value) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

export function useSeo({ title, description, path, canonical }) {
  useEffect(() => {
    document.title = title;
    setMeta("name", "description", description);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", HERE.domain + (path || window.location.pathname));
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonical || HERE.domain + (path || window.location.pathname);
  }, [title, description, path, canonical]);
}
