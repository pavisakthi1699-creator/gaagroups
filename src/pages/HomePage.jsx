import React from "react";
import DesignFrame from "./DesignFrame";
import homeHtml from "../designs/gaa-home.html?raw";

/* GAA Group home page. To change it, edit src/designs/gaa-home.html. */
export default function HomePage() {
  return <DesignFrame html={homeHtml} title="GAA Group | Advisory, Compliance & Talent" />;
}
