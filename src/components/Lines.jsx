import React, { Fragment } from "react";

/* Text with line breaks: "First line\nSecond line" */
export default function Lines({ text }) {
  const parts = String(text).split("\n");
  return parts.map((p, i) => (
    <Fragment key={i}>
      {p}
      {i < parts.length - 1 && <br />}
    </Fragment>
  ));
}
