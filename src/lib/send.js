/* Sends a form to the website's own function (/api/enquiry.php). If that function is not set up yet, the message
   goes to the office inbox through FormSubmit instead, so no enquiry is lost. */
import { SITE } from "../site";

export const MAILBOX = SITE.email;

export function track(name, params = {}) {
  try {
    if (window.gcTrack) window.gcTrack(name, params);
  } catch (e) { /* analytics is optional */ }
}

function readFile(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result).split(",")[1] || "");
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

/* CV uploads: a standard multipart form posted in the background, which is how FormSubmit accepts attachments */
function viaPost(fields, file) {
  return new Promise((resolve) => {
    const name = `fs${Date.now()}`;
    const ifr = document.createElement("iframe");
    ifr.name = name; ifr.style.display = "none"; ifr.title = "upload"; ifr.setAttribute("aria-hidden", "true");
    const form = document.createElement("form");
    form.method = "POST"; form.action = `https://formsubmit.co/${MAILBOX}`; form.enctype = "multipart/form-data"; form.target = name; form.style.display = "none";
    Object.entries({ ...fields, _next: `${window.location.origin}/robots.txt` }).forEach(([k, v]) => {
      const i = document.createElement("input"); i.type = "hidden"; i.name = k; i.value = v; form.appendChild(i);
    });
    const fi = document.createElement("input"); fi.type = "file"; fi.name = "attachment";
    try { const dt = new DataTransfer(); dt.items.add(file); fi.files = dt.files; } catch (e) { /* older browsers */ }
    form.appendChild(fi);
    let done = false;
    ifr.onload = () => { if (done) return; done = true; setTimeout(() => { resolve(true); ifr.remove(); form.remove(); }, 300); };
    setTimeout(() => { if (!done) { done = true; resolve(false); } }, 30000);
    document.body.appendChild(ifr); document.body.appendChild(form); form.submit();
  });
}

function viaMail(d, file) {
  const recruitment = d.type === "recruitment";
  const fields = {
    _subject: `${recruitment ? "Application" : d.type === "subscription" ? "Insights updates" : "Enquiry"}: ${d.serviceLabel} from ${d.name}`,
    _template: "table", _captcha: "false", _replyto: d.email,
    _autoresponse: `Thank you for contacting GAA Group. Your ${recruitment ? "application" : "message"} about ${d.serviceLabel} has been received and our team will get back to you shortly.`,
    Type: recruitment ? "Recruitment application" : d.type === "subscription" ? "Insights updates" : "Client enquiry",
    Service: d.serviceLabel, Name: d.name, Company: d.company || "-", email: d.email, Phone: d.phone || "-", Message: d.message, Page: d.page,
  };
  if (file) return viaPost(fields, file);
  const fd = new FormData();
  Object.entries(fields).forEach(([k, v]) => fd.append(k, v));
  return fetch(`https://formsubmit.co/ajax/${MAILBOX}`, { method: "POST", headers: { Accept: "application/json" }, body: fd })
    .then((r) => r.json().then((j) => {
      const ok = r.ok && (j.success === true || j.success === "true");
      if (!ok && console && console.warn)
        console.warn("Enquiry email not sent:", (j && j.message) || r.status, `(if this mentions activation, open the FormSubmit email sent to ${MAILBOX} and click Activate Form)`);
      return ok;
    }))
    .catch(() => false);
}

/* data: { type, service, serviceLabel, routedTo, name, company, email, phone, message, consent, website, elapsedMs, page } */
export async function sendEnquiry(data, file) {
  const body = { ...data };
  if (file) body.cv = { name: file.name, type: file.type || "application/octet-stream", size: file.size, data: await readFile(file) };
  let res;
  try {
    const r = await fetch("/api/enquiry.php", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const j = await r.json().catch(() => ({}));
    res = { ok: r.ok, status: r.status, j };
  } catch (e) {
    res = { ok: false, status: 599, j: {} };
  }
  if (res.status >= 500 || res.status === 404 || res.status === 405) {
    const ok = await viaMail(data, file);
    if (ok) return { ok: true, acknowledged: true };
  }
  if (!res.ok || !res.j.ok) return { ok: false, error: res.j.error || `We could not send your message right now. Please email us at ${MAILBOX}.` };
  /* saved in the admin panel, but the server could not send the email (mail or SMTP not set up): email it through FormSubmit too */
  if (res.j.mailed === false) {
    const sent = await viaMail(data, file);
    return { ok: true, acknowledged: !!res.j.acknowledged || sent };
  }
  return { ok: true, acknowledged: !!res.j.acknowledged };
}
