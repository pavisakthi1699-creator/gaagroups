import React, { useEffect, useState } from "react";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";

/* Two pages for now: Home (#/) and About Us (#/about). Any other address shows Home. */
const pageFromHash = () => (/^#\/?about/i.test(window.location.hash) ? "about" : "home");

export default function App() {
  const [page, setPage] = useState(pageFromHash);

  useEffect(() => {
    const onChange = () => setPage(pageFromHash());
    window.addEventListener("hashchange", onChange);
    window.addEventListener("popstate", onChange);
    return () => {
      window.removeEventListener("hashchange", onChange);
      window.removeEventListener("popstate", onChange);
    };
  }, []);

  return page === "about" ? <AboutPage key="about" /> : <HomePage key="home" />;
}
