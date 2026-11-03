import React, { Fragment } from "react";

/* Heading text with one highlighted (orange gradient) word: <Hl text={"First line\nSecond line"} word="partner." />
   Line breaks come from "\n". If no word is given, the last word is highlighted. */
export default function Hl({ text, word, lines = false }) {
  const parts = String(text).split("\n");
  const all = parts.join(" ").trim().split(/\s+/);
  const target = word || all[all.length - 1];
  let done = false;
  const line = (p) => {
    if (done) return p;
    const i = p.indexOf(target);
    if (i < 0) return p;
    done = true;
    return <>{p.slice(0, i)}<em className="hw-o">{target}</em>{p.slice(i + target.length)}</>;
  };
  return parts.map((p, i) => (
    <Fragment key={i}>
      {lines ? <span>{line(p)}</span> : line(p)}
      {!lines && i < parts.length - 1 && <br />}
    </Fragment>
  ));
}
