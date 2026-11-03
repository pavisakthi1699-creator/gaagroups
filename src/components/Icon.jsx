/* Line icons used across the site (24 x 24, drawn with the current text colour). */
import React from "react";

const PATHS = {
  "hand": <><path d="M3 12l4-4 4 2 3-3 7 6-5 5-2-2-2 2-3-3-2 2z"/><path d="M11 10l3 3"/></>,
  "team": <><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.4"/><path d="M3 20c.6-3.6 3-5.6 6-5.6s5.4 2 6 5.6"/><path d="M15.5 14.6c2.6.2 4.4 2 5 5.4"/></>,
  "shield": <><path d="M12 3l7 3v6c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6z"/><path d="m9 12 2 2 4-4"/></>,
  "building": <><path d="M4 21V5l8-3v19M12 8h8v13M8 8h.01M8 12h.01M8 16h.01M16 12h.01M16 16h.01M2 21h20"/></>,
  "user": <><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4.5 4-7 8-7s7 2.5 8 7"/></>,
  "pin": <><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></>,
  "layers": <><path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/></>,
  "bank": <><path d="M3 10l9-6 9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 21h18"/></>,
  "doc": <><path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/></>,
  "calc": <><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h2M12 11h2M16 11h0M8 15h2M12 15h2M8 18h2M12 18h2"/></>,
  "people": <><circle cx="7" cy="8" r="2.5"/><circle cx="17" cy="8" r="2.5"/><circle cx="12" cy="6" r="2.5"/><path d="M2 18c.5-3 2.3-4.6 5-4.6M22 18c-.5-3-2.3-4.6-5-4.6M7 20c.6-3.6 2.4-5.4 5-5.4s4.4 1.8 5 5.4"/></>,
  "bars": <><path d="M5 21V13M10 21V8M15 21V11M20 21V4"/></>,
  "bulb": <><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z"/></>,
  "gear": <><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></>,
  "plane": <><path d="m3 11 18-8-8 18-2-8z"/></>,
  "infinity": <><path d="M7 9c-2.2 0-4 1.3-4 3s1.8 3 4 3c3 0 7-6 10-6 2.2 0 4 1.3 4 3s-1.8 3-4 3c-3 0-7-6-10-6"/></>,
  "id": <><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2.2"/><path d="M5.5 16c.5-1.6 1.8-2.6 3.5-2.6s3 1 3.5 2.6M14 10h4M14 13h4"/></>,
  "card": <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h4"/></>,
  "arrow": <><path d="M5 12h14M13 6l6 6-6 6"/></>,
  "download": <><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></>,
  "check": <><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></>,
  "search": <><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>,
  "plus": <><path d="M12 5v14M5 12h14"/></>,
  "mail": <><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7 8 6 8-6"/></>,
  "phone": <><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></>,
  "cap": <><path d="m2 9 10-5 10 5-10 5z"/><path d="M6 11v5c3 2.5 9 2.5 12 0v-5"/></>,
  "scale": <><path d="M12 3v18M7 21h10M5 7h14M5 7l-3 7a3.5 3.5 0 0 0 6 0zM19 7l-3 7a3.5 3.5 0 0 0 6 0z"/></>,
  "book": <><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/></>,
  "spark": <><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/></>,
  "clock": <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  "bell": <><path d="M6 16V11a6 6 0 1 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/></>,
  "eye": <><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></>,
  "chev": <><path d="m6 9 6 6 6-6"/></>,
  "close": <><path d="M6 6l12 12M18 6 6 18"/></>,
  "menu": <><path d="M4 7h16M4 12h16M4 17h16"/></>,
  "quote": <><path d="M7 7h4v4c0 3-1.5 5-4 6M15 7h4v4c0 3-1.5 5-4 6"/></>,
};

export default function Icon({ name, className = "i" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {PATHS[name] || PATHS.arrow}
    </svg>
  );
}

export const ICON_NAMES = Object.keys(PATHS);
