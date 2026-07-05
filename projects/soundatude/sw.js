const CACHE_NAME = "sound-a-tude-v118-amp-75-speed-pitch-row";
const APP_SHELL = [
  "./",
  "./index.html",
  "./marketing.html",
  "./privacy.html",
  "./styles.css",
  "./marketing.css",
  "./script.js",
  "./manifest.webmanifest",
  "./icons/icon.svg",
  "./assets/images/marketing/iphone-player.png",
  "./assets/audio/attitude-effort-sample.mp3",
  "./assets/audio/positive_affirmations1.mp3",
  "./assets/audio/positive_affirmations2.mp3",
  "./assets/audio/positive_affirmations3.mp3",
  "./assets/audio/positive_affirmations4.mp3",
  "./assets/audio/positive_affirmations5.mp3",
  "./assets/audio/positive_affirmations6.mp3",
  "./assets/audio/positive_affirmations7.mp3",
  "./assets/audio/positive_affirmations8.mp3",
  "./assets/audio/conversations/sat-c001-confidence-connection-conversation-mara-v001-theo-v001-mix-v003.mp3",
  "./assets/audio/conversations/sat-c002-attitude-effort-conversation-mara-v001-theo-v001-mix-v001.mp3"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => Promise.all(
      cacheNames
        .filter((cacheName) => cacheName !== CACHE_NAME)
        .map((cacheName) => caches.delete(cacheName))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put("./", copy));
          return response;
        })
        .catch(() => caches.match(event.request).then((cachedResponse) => (
          cachedResponse || caches.match("./")
        )))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => (
      cachedResponse || fetch(event.request)
    ))
  );
});
