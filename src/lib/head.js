/* Keeps the title, description, canonical address and sharing tags in sync after in-app navigation.
   (The first load already has them, written by scripts/prerender.mjs.) */
function setMeta(doc, selector, attr, key, value) {
  let el = doc.head.querySelector(selector);
  if (!el) {
    el = doc.createElement("meta");
    el.setAttribute(attr, key);
    doc.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

export function applyHead(route, notFound) {
  const docs = [document];
  try {
    if (window.parent !== window && window.parent.location.origin === window.location.origin) docs.push(window.parent.document);
  } catch (e) { /* ignore */ }
  const origin = window.location.origin;
  const url = origin + (notFound ? window.location.pathname : route.path);
  docs.forEach((doc) => {
    doc.title = route.title;
    setMeta(doc, 'meta[name="description"]', "name", "description", route.description);
    setMeta(doc, 'meta[property="og:title"]', "property", "og:title", route.title);
    setMeta(doc, 'meta[property="og:description"]', "property", "og:description", route.description);
    setMeta(doc, 'meta[property="og:url"]', "property", "og:url", url);
    setMeta(doc, 'meta[name="robots"]', "name", "robots", notFound ? "noindex, follow" : "index, follow, max-image-preview:large");
    let link = doc.head.querySelector('link[rel="canonical"]');
    if (!link) {
      link = doc.createElement("link");
      link.rel = "canonical";
      doc.head.appendChild(link);
    }
    link.href = url;
  });
}
