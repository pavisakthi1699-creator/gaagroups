import React, { useEffect } from "react";
import { usePath, navigate } from "./group/router.jsx";
import { useSeo } from "./group/seo.js";
import GroupHome from "./group/GroupHome.jsx";
import GroupAbout from "./group/GroupAbout.jsx";
import GroupContactPage, { NotFound } from "./group/GroupContactPage.jsx";
import { COMPANIES } from "./group/sites.js";
import { CURRENT, LOCAL } from "./brand.js";
import GaaSite from "./pages/gaa/GaaSite";
import FFHome from "./ff/FFHome.jsx";
import { FFService, FFCalendar } from "./ff/FFPages.jsx";
import { getService } from "./ff/ffData.js";
import HFHome from "./hf/HFHome.jsx";
import { HFTalent, HFCategory, HFHire } from "./hf/HFPages.jsx";
import { getCategory } from "./hf/hfData.js";
import { seoFor, brandOfPath } from "./routes.js";

/* One codebase, three domains.
   Every domain:      /  /about  /contact             shared GAA Group pages
   gaaconsulting.com: /gaa-consulting/...             GAA Consulting
   filingsfirst.com:  /filings-first/...              Filings First
   hiringsfirst.com:  /hirings-first/...              Hirings First
   Locally (npm run dev) all of them work on one address. */

// Old #/ links (bookmarks, earlier review links) are redirected to the new real URLs.
function useLegacyHashRedirect() {
  useEffect(() => {
    const h = window.location.hash;
    if (h.startsWith("#/")) navigate(h.slice(1).split("?")[0] || "/", { replace: true });
  }, []);
}

// Page names used by the GAA pages' onNavigate(...) calls → real paths
function toPath(page) {
  if (!page || page === "home") return "/";
  if (page === "about") return "/about";
  if (page === "contact") return "/contact?company=gaa";
  if (page === "gaa" || page === "gaa-consulting") return "/gaa-consulting";
  return "/" + page.replace(/^\/+/, "");
}

function Page({ path }) {
  const onNavigate = (page) => navigate(toPath(page));
  if (path === "/") return <GroupHome />;
  if (path === "/about") return <GroupAbout />;
  if (path === "/contact") return <GroupContactPage />;

  if (path === "/gaa-consulting" || path.startsWith("/gaa-consulting/"))
    return <GaaSite path={path.replace(/^\/gaa-consulting\/?/, "")} onNavigate={onNavigate} />;

  if (path === "/filings-first") return <FFHome />;
  if (path === "/filings-first/compliance-calendar") return <FFCalendar />;
  const fs = path.match(/^\/filings-first\/services\/([a-z-]+)$/);
  if (fs && getService(fs[1])) return <FFService key={fs[1]} slug={fs[1]} />;

  if (path === "/hirings-first") return <HFHome />;
  if (path === "/hirings-first/talent") return <HFTalent />;
  if (path === "/hirings-first/hire") return <HFHire />;
  const hc = path.match(/^\/hirings-first\/talent\/([a-z-]+)$/);
  if (hc && getCategory(hc[1])) return <HFCategory key={hc[1]} slug={hc[1]} />;

  return <NotFound />;
}

export default function App() {
  useLegacyHashRedirect();
  const path = usePath();
  useSeo(seoFor(path, CURRENT));

  // On a live domain, another company's pages belong on that company's domain.
  const brand = brandOfPath(path);
  if (!LOCAL && brand && brand !== CURRENT) {
    window.location.replace(COMPANIES[brand].domain + path + window.location.search);
    return null;
  }
  return <Page path={path} />;
}
