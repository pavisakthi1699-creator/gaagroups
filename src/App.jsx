import React, { useEffect, useRef } from "react";
import { RouterProvider, useRouter, scrollToHash } from "./router";
import { findRoute, NOT_FOUND } from "./site";
import { applyHead } from "./lib/head";
import { track } from "./lib/analytics";
import mountScrollLines from "./lib/scrollLines";
import Header from "./components/Header";
import Footer from "./components/Footer";
import GroupHome from "./pages/group/GroupHome";
import GroupAbout from "./pages/group/GroupAbout";
import GroupCareers from "./pages/group/GroupCareers";
import ConsultingHome from "./pages/consulting/ConsultingHome";
import ConsultingService from "./pages/consulting/ConsultingService";
import FilingsHome from "./pages/filings/FilingsHome";
import FilingsService from "./pages/filings/FilingsService";
import HiringsHome from "./pages/hirings/HiringsHome";
import HiringsService from "./pages/hirings/HiringsService";
import Team from "./pages/Team";
import Insights from "./pages/Insights";
import Post from "./pages/Post";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import AdminApp from "./admin/AdminApp";
import "./styles/index.js";

function Page({ route }) {
  switch (route.kind) {
    case "group-home": return <GroupHome />;
    case "group-about": return <GroupAbout />;
    case "group-careers": return <GroupCareers />;
    case "consulting-home": return <ConsultingHome />;
    case "consulting-service": return <ConsultingService slug={route.slug} />;
    case "filings-home": return <FilingsHome />;
    case "filings-service": return <FilingsService slug={route.slug} />;
    case "hirings-home": return <HiringsHome />;
    case "hirings-service": return <HiringsService slug={route.slug} />;
    case "team": return <Team />;
    case "insights": return <Insights />;
    case "post": return <Post slug={route.slug} />;
    case "contact": return <Contact />;
    case "privacy": return <Privacy />;
    default: return <NotFound />;
  }
}

function Site() {
  const { path, hash } = useRouter();
  const route = findRoute(path);
  const page = route || NOT_FOUND;
  const first = useRef(true);

  /* new page: title and tags, page view, then scroll to the top or to the #section in the address */
  useEffect(() => {
    if (!first.current) {
      applyHead(page, !route);
      track("page_view", { page_path: path, page_title: page.title, page_location: window.location.origin + path });
    } else if (!window.__gcFirstView) {
      window.__gcFirstView = true;
      track("page_view", { page_path: path, page_title: page.title, page_location: window.location.origin + path });
    }
    const t = setTimeout(() => (hash ? scrollToHash(hash, !first.current) : window.scrollTo(0, 0)), first.current ? 120 : 30);
    first.current = false;
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  /* links to the contact page and to other websites are measured */
  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest && e.target.closest("a[href]");
      if (!a) return;
      const label = (a.textContent || "").trim().replace(/\s+/g, " ").slice(0, 60);
      let u;
      try { u = new URL(a.href); } catch (x) { return; }
      if (u.origin !== window.location.origin) {
        if (/^https?:$/.test(u.protocol)) track("outbound_click", { link_url: u.href, link_text: label });
      } else if (u.pathname === "/contact" && path !== "/contact") track("consultation_click", { link_text: label, from_page: path });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [path]);

  /* numbered step lists: the orange dot follows the scroll from 01 to the last step */
  useEffect(() => {
    if (page.kind === "admin") return undefined;
    let off = () => {};
    const t = setTimeout(() => { off = mountScrollLines(document.getElementById("main") || document); }, 350);
    return () => { clearTimeout(t); off(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  if (page.kind === "admin") return <AdminApp path={path} />;

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Header />
      <div id="main" key={page.path}>
        <Page route={page} />
      </div>
      <Footer />
    </>
  );
}

export default function App({ url }) {
  return (
    <RouterProvider url={url}>
      <Site />
    </RouterProvider>
  );
}
