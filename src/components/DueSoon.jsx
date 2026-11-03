import React, { useEffect, useState } from "react";
import { upcoming, daysUntil, monthShort } from "../data/calendar.js";

/* Next due dates, worked out in the browser from today's date (blank placeholders while pre-rendered) */
export default function DueSoon({ n = 4, className = "" }) {
  const [list, setList] = useState(null);
  useEffect(() => setList(upcoming(n)), [n]);
  const rows = list || Array.from({ length: n }, () => null);
  return (
    <ul className={`ds ${className}`}>
      {rows.map((e, i) => {
        if (!e) return <li key={i} className="ds-sk" aria-hidden="true"><span className="ds-d" /><span className="ds-t" /></li>;
        const left = daysUntil(e.date);
        return (
          <li key={e.title + e.day + e.month} style={{ "--k": i }}>
            <span className="ds-d"><b>{e.day}</b><small>{monthShort(e.month)}</small></span>
            <span className="ds-t"><em>{e.catName}</em><b>{e.title}</b><small>{e.text}</small></span>
            <span className={`ds-l${left <= 3 ? " hot" : ""}`}>{left === 0 ? "Today" : left === 1 ? "Tomorrow" : `In ${left} days`}</span>
          </li>
        );
      })}
    </ul>
  );
}
