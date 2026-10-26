import React from "react";
import "../GaaConsultingPage.css";
import "./GaaSubpages.css";
import GaaHome from "./GaaHome";
import GaaServicesPage from "./GaaServicesPage";
import GaaServiceDetailPage from "./GaaServiceDetailPage";
import GaaIndiaEntryPage from "./GaaIndiaEntryPage";
import GaaIndustriesPage from "./GaaIndustriesPage";
import GaaExperiencePage from "./GaaExperiencePage";
import GaaInsightsPage from "./GaaInsightsPage";
import GaaPeoplePage from "./GaaPeoplePage";
import GaaHowWeWorkPage from "./GaaHowWeWorkPage";
import GaaDisclaimerPage from "./GaaDisclaimerPage";
import GaaCareersPage from "./GaaCareersPage";
import { getService, LEGACY_SLUGS } from "../../data/gaaServices";

/* Routes for the GAA Consulting site (all under /gaa-consulting/...)
   ""                      -> Home (GaaHome: new black, white and orange design)
   practices               -> GAA Consulting Services (design: GAA_Consulting_Services)
   practices/<slug>        -> Service detail: corporate-law, company-secretarial,
                              mergers-and-acquisitions, fundraising-and-restructuring,
                              regulatory-advisory (older practice slugs map via LEGACY_SLUGS)
   india-entry             -> India Entry Desk
   industries              -> Industries
   experience              -> Representative mandates
   insights                -> Insights & compliance calendar
   people                  -> GAA Consulting team
   how-we-work             -> Engagement models, process, FAQs
   careers                 -> Careers & CS Training (moved from the group home page)
   disclaimer              -> Disclaimer & privacy */
export default function GaaSite({ path = "", onNavigate }) {
  const [a, b] = path.split("/").filter(Boolean);
  const k = path || "home";

  switch (a) {
    case "practices":
    case "services": {
      const slug = b && (getService(b) ? b : LEGACY_SLUGS[b]);
      if (slug) return <GaaServiceDetailPage slug={slug} key={k} onNavigate={onNavigate} />;
      return <GaaServicesPage key={k} onNavigate={onNavigate} />;
    }
    case "india-entry":
      return <GaaIndiaEntryPage key={k} onNavigate={onNavigate} />;
    case "industries":
      return <GaaIndustriesPage key={k} onNavigate={onNavigate} />;
    case "experience":
    case "insights":
      return <GaaHome key={k} onNavigate={onNavigate} />;
    case "people":
      return <GaaPeoplePage key={k} onNavigate={onNavigate} />;
    case "how-we-work":
      return <GaaHowWeWorkPage key={k} onNavigate={onNavigate} />;
    case "careers":
      return <GaaCareersPage key={k} onNavigate={onNavigate} />;
    case "disclaimer":
      return <GaaDisclaimerPage key={k} onNavigate={onNavigate} />;
    default:
      return <GaaHome key={k} onNavigate={onNavigate} />;
  }
}
