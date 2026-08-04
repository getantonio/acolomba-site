const APP_STORE_URL = "https://apps.apple.com/app/brain-shift/id6787929828";

const isBrainShiftCache = (cacheName) => (
  cacheName.startsWith("brain-shift") || cacheName.startsWith("sound-a-tude")
);

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => Promise.all(
        cacheNames
          .filter(isBrainShiftCache)
          .map((cacheName) => caches.delete(cacheName))
      ))
      .then(() => self.clients.claim())
      .then(() => self.registration.unregister())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode !== "navigate") return;

  const url = new URL(event.request.url);
  if (url.pathname.endsWith("/privacy.html")) {
    event.respondWith(Response.redirect(`/development/brain-shift/privacy.html${url.search}`, 302));
    return;
  }

  if (url.pathname.endsWith("/marketing.html")) {
    event.respondWith(Response.redirect(`/development/brain-shift/marketing.html${url.search}`, 302));
    return;
  }

  event.respondWith(Response.redirect(APP_STORE_URL, 302));
});
