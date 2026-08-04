const CACHE_NAME = "brain-shift-project-redirect-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    const url = new URL(event.request.url);
    const suffix = url.pathname.endsWith("/marketing.html")
      ? "marketing.html"
      : url.pathname.endsWith("/privacy.html")
        ? "privacy.html"
        : "";
    event.respondWith(Response.redirect(`/development/brain-shift/${suffix}${url.search}${url.hash}`, 302));
  }
});
