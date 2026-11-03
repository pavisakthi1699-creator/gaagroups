import React, { useEffect, useRef, useState } from "react";
import { admin } from "../lib/api";

/* A simple rich text editor for blog posts: headings, bold, italic, lists, quotes, links, images and tables.
   The server cleans the HTML again before saving it. */
const TOOLS = [
  ["formatBlock:H2", "H2", "Heading"],
  ["formatBlock:H3", "H3", "Sub-heading"],
  ["formatBlock:P", "¶", "Paragraph"],
  ["bold", "B", "Bold"],
  ["italic", "I", "Italic"],
  ["insertUnorderedList", "• List", "Bulleted list"],
  ["insertOrderedList", "1. List", "Numbered list"],
  ["formatBlock:BLOCKQUOTE", "❝", "Quote"],
  ["link", "Link", "Add link"],
  ["unlink", "Unlink", "Remove link"],
  ["image", "Image", "Insert image"],
  ["table", "Table", "Insert table"],
  ["insertHorizontalRule", "—", "Divider"],
  ["removeFormat", "Clear", "Clear formatting"],
  ["undo", "↶", "Undo"],
  ["redo", "↷", "Redo"],
];

export default function Editor({ value, onChange }) {
  const box = useRef(null);
  const file = useRef(null);
  const [html, setHtml] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (box.current && !html && box.current.innerHTML !== value) box.current.innerHTML = value || "<p></p>";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [html]);
  useEffect(() => { if (box.current && !html && document.activeElement !== box.current && box.current.innerHTML !== value) box.current.innerHTML = value || "<p></p>"; }, [value, html]);

  const emit = () => box.current && onChange(box.current.innerHTML);
  const run = (cmd) => {
    if (html) return;
    box.current.focus();
    if (cmd.startsWith("formatBlock:")) document.execCommand("formatBlock", false, cmd.split(":")[1]);
    else if (cmd === "link") {
      const u = window.prompt("Link address (https://...)", "https://");
      if (u && /^(https?:|mailto:|\/)/i.test(u)) document.execCommand("createLink", false, u);
    } else if (cmd === "image") { file.current.click(); return; }
    else if (cmd === "table") document.execCommand("insertHTML", false, "<table><thead><tr><th>Heading</th><th>Heading</th></tr></thead><tbody><tr><td>Text</td><td>Text</td></tr><tr><td>Text</td><td>Text</td></tr></tbody></table><p></p>");
    else document.execCommand(cmd, false, null);
    emit();
  };
  const onImage = async (e) => {
    const f = e.target.files && e.target.files[0]; e.target.value = "";
    if (!f) return;
    setBusy(true); setErr("");
    const r = await admin.upload(f);
    setBusy(false);
    if (!r.ok) return setErr(r.error);
    box.current.focus();
    document.execCommand("insertHTML", false, `<img src="${r.url}" alt="" />`);
    emit();
  };
  const onPaste = (e) => {
    /* paste as plain text with line breaks, so formatting from Word or websites does not come along */
    const t = e.clipboardData && e.clipboardData.getData("text/plain");
    if (t == null) return;
    e.preventDefault();
    const safe = t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    document.execCommand("insertHTML", false, safe.split(/\n{2,}/).map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`).join(""));
    emit();
  };

  return (
    <div className={`adm-ed${html ? " src" : ""}`}>
      <div className="adm-ed-bar" role="toolbar" aria-label="Formatting">
        {TOOLS.map(([c, l, t]) => (
          <button key={c} type="button" title={t} aria-label={t} disabled={html} onMouseDown={(e) => e.preventDefault()} onClick={() => run(c)} className={`t-${c.replace(/[^a-z]/gi, "")}`}>{l}</button>
        ))}
        <span className="adm-ed-sp" />
        <button type="button" className={`adm-ed-mode${html ? " on" : ""}`} onClick={() => { if (!html) emit(); setHtml(!html); }}>{html ? "Visual editor" : "HTML"}</button>
      </div>
      {html ? (
        <textarea className="adm-ed-src" value={value} onChange={(e) => onChange(e.target.value)} spellCheck={false} />
      ) : (
        <div ref={box} className="adm-ed-box prose" contentEditable suppressContentEditableWarning onInput={emit} onBlur={emit} onPaste={onPaste} />
      )}
      <input ref={file} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={onImage} />
      {busy && <p className="adm-muted">Uploading image...</p>}
      {err && <p className="adm-err">{err}</p>}
    </div>
  );
}
