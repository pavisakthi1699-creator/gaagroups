// Tiny path-based router (History API). Real URLs like /about and
// /filings-first/services/gst are indexable by search engines, unlike #/hash routes.
import React, { useEffect, useState } from "react";

const listeners = new Set();
const notify = () => listeners.forEach((fn) => fn(window.location.pathname));

export function navigate(to, { replace = false } = {}) {
  const [path, hash] = to.split("#");
  const target = path || window.location.pathname;
  if (target !== window.location.pathname) {
    window.history[replace ? "replaceState" : "pushState"](null, "", target + (hash ? `#${hash}` : ""));
    notify();
    if (hash) setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" }), 120);
    else window.scrollTo({ top: 0, behavior: "instant" });
  } else if (hash) {
    document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

export function usePath() {
  const [path, setPath] = useState(() => window.location.pathname);
  useEffect(() => {
    const on = () => setPath(window.location.pathname);
    listeners.add(setPath);
    window.addEventListener("popstate", on);
    return () => {
      listeners.delete(setPath);
      window.removeEventListener("popstate", on);
    };
  }, []);
  return path.replace(/\/+$/, "") || "/";
}

/** <Link to="/about"> for internal pages; absolute URLs (other group sites) render a normal link. */
export function Link({ to, children, onClick, ...rest }) {
  const internal = to.startsWith("/") && !to.startsWith("//");
  const handle = (e) => {
    if (onClick) onClick(e);
    if (!internal || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button > 0) return;
    e.preventDefault();
    navigate(to);
  };
  return (
    <a href={to} onClick={handle} {...rest}>
      {children}
    </a>
  );
}
