/* Google Analytics 4. Set VITE_GA_MEASUREMENT_ID (for example G-XXXXXXX) in Vercel to switch it on.
   Only the top window talks to Google; pages shown inside the desktop frame pass their events up.
   Events: page_view, consultation_click, form_start, generate_lead, recruitment_application,
   insights_subscribe, outbound_click. */
const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

function inFrame() {
  try { return window.self !== window.top; } catch (e) { return true; }
}

export function initAnalytics() {
  if (inFrame()) {
    window.gcTrack = (name, params = {}) => {
      try { window.parent.postMessage({ gaa: "event", name, params }, window.location.origin); } catch (e) { /* ignore */ }
    };
    return;
  }
  if (GA_ID && !window.gtag) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, { send_page_view: false, anonymize_ip: true });
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
    document.head.appendChild(s);
  }
  window.gcTrack = (name, params = {}) => {
    if (import.meta.env.DEV) console.info("[analytics]", name, params);
    if (window.gtag) window.gtag("event", name, params);
  };
  window.addEventListener("message", (e) => {
    if (e.origin !== window.location.origin) return;
    const d = e.data;
    if (d && d.gaa === "event" && typeof d.name === "string") window.gcTrack(d.name, d.params || {});
  });
}

export function track(name, params = {}) {
  if (window.gcTrack) window.gcTrack(name, params);
}
