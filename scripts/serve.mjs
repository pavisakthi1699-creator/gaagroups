/* Local preview of the built site (dist/) with the same clean addresses as Vercel. No dependencies.
   npm run preview  ->  http://localhost:4300   (set PORT to change it) */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "dist");
const PORT = Number(process.env.PORT) || 4300;
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".xml": "application/xml",
  ".txt": "text/plain", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".ico": "image/x-icon", ".mjs": "text/javascript" };

function resolve(p) {
  const clean = path.normalize(decodeURIComponent(p)).replace(/^(\.\.[/\\])+/, "");
  for (const c of [clean, clean + ".html", path.join(clean, "index.html")]) {
    const f = path.join(DIST, c);
    if (f.startsWith(DIST) && fs.existsSync(f) && fs.statSync(f).isFile()) return f;
  }
  return null;
}

http.createServer((req, res) => {
  const url = new URL(req.url, "http://x");
  if (url.pathname.length > 1 && url.pathname.endsWith("/")) { res.writeHead(308, { Location: url.pathname.slice(0, -1) + url.search }); return res.end(); }
  const f = resolve(url.pathname);
  const file = f || path.join(DIST, "404.html");
  res.writeHead(f ? 200 : 404, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, () => console.log(`Preview: http://localhost:${PORT}`));
