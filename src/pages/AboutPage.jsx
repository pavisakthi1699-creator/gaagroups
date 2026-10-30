import React from "react";
import DesignFrame from "./DesignFrame";
import aboutHtml from "../designs/gaa-about.html?raw";

/* GAA Group About Us page. To change it, edit src/designs/gaa-about.html. */
export default function AboutPage() {
  return <DesignFrame html={aboutHtml} title="About Us | GAA Group" />;
}
