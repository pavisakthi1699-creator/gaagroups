import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import ScaledSite from "./ScaledSite";
import { initAnalytics } from "./lib/analytics";

initAnalytics();
const root = document.getElementById("root");
const d = document.documentElement;

if (d.classList.contains("framed")) {
  createRoot(root).render(<ScaledSite />);
} else {
  if (root.firstElementChild) hydrateRoot(root, <App />);
  else createRoot(root).render(<App />);
  /* a phone-sized window that becomes desktop-sized switches to the scaled layout */
  if (!d.classList.contains("in-frame") && !d.classList.contains("admin")) {
    const onResize = () => {
      if (window.innerWidth >= 900) {
        window.removeEventListener("resize", onResize);
        window.location.reload();
      }
    };
    window.addEventListener("resize", onResize);
  }
}
