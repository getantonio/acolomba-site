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
  const isPlayerEntry = (
    url.pathname.endsWith("/development/brain-shift/") ||
    url.pathname.endsWith("/development/brain-shift/index.html")
  );

  if (isPlayerEntry) {
    event.respondWith(Response.redirect(APP_STORE_URL, 302));
  }
});
