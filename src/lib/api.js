/* Talks to the PHP backend in /api. Public calls (blog) and admin calls (session cookie + CSRF token). */

export const COMPANY_LABEL = {
  "gaa-group": "GAA Group",
  "gaa-consulting": "GAA Consulting",
  "filings-first": "Filings First",
  "hirings-first": "Hirings First",
};

async function call(url, opts = {}) {
  let r;
  try {
    r = await fetch(url, { credentials: "same-origin", ...opts });
  } catch (e) {
    return { ok: false, status: 0, error: "Could not reach the server. Check your connection." };
  }
  let j = {};
  try { j = await r.json(); } catch (e) { j = {}; }
  if (!r.ok || j.ok === false) return { ok: false, status: r.status, error: j.error || `Request failed (${r.status})`, ...j };
  return { ok: true, status: r.status, ...j };
}

/* ---------- public ---------- */
export function listPosts({ company = "", q = "", page = 1, limit = 12, exclude = "" } = {}) {
  const p = new URLSearchParams();
  if (company) p.set("company", company);
  if (q) p.set("q", q);
  if (exclude) p.set("exclude", exclude);
  p.set("page", page); p.set("limit", limit);
  return call(`/api/posts.php?${p}`);
}

export function getPost(slug) {
  /* the server puts the article into the page for search engines and a fast first view */
  if (typeof window !== "undefined" && window.__POST__ && window.__POST__.post && window.__POST__.post.slug === slug) {
    const d = window.__POST__;
    return Promise.resolve({ ok: true, ...d });
  }
  return call(`/api/posts.php?slug=${encodeURIComponent(slug)}`);
}

export const formatDate = (s) => {
  if (!s) return "";
  const d = new Date(String(s).replace(" ", "T"));
  if (isNaN(d)) return "";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

/* ---------- admin ---------- */
let csrf = "";
export const setCsrf = (t) => { csrf = t || ""; };
const json = (method, body) => ({ method, headers: { "Content-Type": "application/json", "X-CSRF-Token": csrf }, body: JSON.stringify(body || {}) });

export const admin = {
  me: () => call("/api/admin/session.php"),
  login: (email, password) => call("/api/admin/session.php", json("POST", { action: "login", email, password })),
  logout: () => call("/api/admin/session.php", json("POST", { action: "logout" })),
  stats: () => call("/api/admin/stats.php"),
  posts: (params = {}) => call(`/api/admin/posts.php?${new URLSearchParams(params)}`),
  post: (id) => call(`/api/admin/posts.php?id=${id}`),
  savePost: (p) => call("/api/admin/posts.php", json("POST", { action: "save", post: p })),
  deletePost: (id) => call("/api/admin/posts.php", json("POST", { action: "delete", id })),
  upload: (file) => {
    const fd = new FormData(); fd.append("file", file);
    return call("/api/admin/upload.php", { method: "POST", headers: { "X-CSRF-Token": csrf }, body: fd });
  },
  enquiries: (params = {}) => call(`/api/admin/enquiries.php?${new URLSearchParams(params)}`),
  enquiry: (id) => call(`/api/admin/enquiries.php?id=${id}`),
  updateEnquiry: (id, fields) => call("/api/admin/enquiries.php", json("POST", { action: "update", id, ...fields })),
  deleteEnquiry: (id) => call("/api/admin/enquiries.php", json("POST", { action: "delete", id })),
  subscribers: (params = {}) => call(`/api/admin/subscribers.php?${new URLSearchParams(params)}`),
  deleteSubscriber: (id) => call("/api/admin/subscribers.php", json("POST", { action: "delete", id })),
  users: () => call("/api/admin/users.php"),
  saveUser: (u) => call("/api/admin/users.php", json("POST", { action: "save", ...u })),
  deleteUser: (id) => call("/api/admin/users.php", json("POST", { action: "delete", id })),
  password: (current, next) => call("/api/admin/users.php", json("POST", { action: "password", current, next })),
};
