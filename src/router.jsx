/* A small router: clean addresses, in-page anchors and smooth scrolling below the fixed header.
   When the site is shown scaled inside the desktop frame, the browser address bar and title follow along. */
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { normalise } from "./site";

const RouterContext = createContext({ path: "/", hash: "", navigate: () => {} });
export const useRouter = () => useContext(RouterContext);

const HEADER_OFFSET = 96;

export function scrollToHash(hash, smooth = true) {
  if (typeof document === "undefined") return;
  if (!hash || hash === "#" || hash === "#top") {
    window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
    return;
  }
  let el = null;
  try { el = document.querySelector(hash); } catch (e) { el = null; }
  if (!el) return;
  const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET, behavior: smooth && !reduce ? "smooth" : "auto" });
}

function parentWindow() {
  try {
    if (window.parent !== window && window.parent.location.origin === window.location.origin) return window.parent;
  } catch (e) { /* not same origin */ }
  return null;
}

export function RouterProvider({ url, children }) {
  const initial = (() => {
    if (typeof window === "undefined") {
      const u = new URL(url || "/", "http://x");
      return { path: normalise(u.pathname), hash: u.hash };
    }
    return { path: normalise(window.location.pathname), hash: window.location.hash };
  })();
  const [loc, setLoc] = useState(initial);

  const navigate = useCallback((to, opts = {}) => {
    const u = new URL(to, window.location.href);
    const path = normalise(u.pathname);
    const samePage = path === normalise(window.location.pathname);
    const next = path + u.hash;
    if (!opts.fromParent) {
      if (opts.replace) window.history.replaceState({}, "", next);
      else if (!(samePage && u.hash === window.location.hash)) window.history.pushState({}, "", next);
      const p = parentWindow();
      if (p) {
        if (opts.replace) p.history.replaceState({}, "", next);
        else if (p.location.pathname + p.location.hash !== next) p.history.pushState({}, "", next);
      }
    } else {
      window.history.replaceState({}, "", next);
    }
    if (samePage) {
      setLoc({ path, hash: u.hash });
      scrollToHash(u.hash);
      return;
    }
    setLoc({ path, hash: u.hash });
  }, []);

  useEffect(() => {
    const onPop = () => setLoc({ path: normalise(window.location.pathname), hash: window.location.hash });
    window.addEventListener("popstate", onPop);
    /* the desktop frame asks us to follow the browser's back and forward buttons */
    window.__gcNavigate = (to) => navigate(to, { fromParent: true });
    return () => window.removeEventListener("popstate", onPop);
  }, [navigate]);

  return <RouterContext.Provider value={{ ...loc, navigate }}>{children}</RouterContext.Provider>;
}

/* <Link to="/careers"> or <Link to="#services">: internal addresses move without a page reload */
/* Pages that are not live yet: links to them show as plain text and cannot be clicked */
export const OFF_PATHS = ["/filings-first", "/hirings-first"];
export const isOff = (to) => typeof to === "string" && OFF_PATHS.some((p) => to === p || to.startsWith(p + "/") || to.startsWith(p + "#"));

export function Link({ to, children, onClick, ...rest }) {
  const { navigate } = useRouter();
  if (isOff(to)) {
    const { className, ...other } = rest;
    return <span className={`${className ? className + " " : ""}is-off`} aria-disabled="true" {...other}>{children}</span>;
  }
  const internal = to.startsWith("/") || to.startsWith("#");
  const handle = (e) => {
    if (onClick) onClick(e);
    if (e.defaultPrevented || !internal || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    if (to.startsWith("#")) {
      window.history.replaceState({}, "", window.location.pathname + to);
      scrollToHash(to);
    } else navigate(to);
  };
  return (
    <a href={to} onClick={handle} {...rest}>
      {children}
    </a>
  );
}
