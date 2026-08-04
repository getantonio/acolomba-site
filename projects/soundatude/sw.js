const TARGET_BASE = "/projects/brain-shift/";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("fetch", (event) => {
  if (event.request.mode !== "navigate") return;

  const url = new URL(event.request.url);
  if (!url.pathname.startsWith("/projects/soundatude/")) return;

  const suffix = url.pathname.slice("/projects/soundatude/".length);
  event.respondWith(Response.redirect(`${TARGET_BASE}${suffix}${url.search}${url.hash}`, 302));
});
