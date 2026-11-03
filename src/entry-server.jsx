/* Used at build time only: renders each page to HTML for scripts/prerender.mjs. */
import React from "react";
import { renderToString } from "react-dom/server";
import App from "./App";

export { ROUTES, NOT_FOUND, SITE, CONSULTING_DATA, FF_DATA, HF_DATA, COMPANY, POST_ROUTE, ADMIN_ROUTE } from "./site";
export const CAREER_FAQ = [];

export function render(url) {
  return renderToString(<App url={url} />);
}
