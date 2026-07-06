const CACHE_NAME = "sound-a-tude-legacy-redirect-v126";

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
    event.respondWith(Response.redirect(`/development/soundatude/${suffix}${url.search}${url.hash}`, 302));
  }
});
