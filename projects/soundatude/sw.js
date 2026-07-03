const CACHE_NAME = "sound-a-tude-v66-record-action";
const MALE_AVATAR_PHRASE_IDS = [
  "sat-p004",
  "sat-p006",
  "sat-p009",
  "sat-p018",
  "sat-p021",
  "sat-p024",
  "sat-p031",
  "sat-p032",
  "sat-p041",
  "sat-p042",
];
const WAVEFORM_MATCHED_MALE_AVATAR_VOICE_IDS = [
  "am_echo",
  "am_eric",
  "am_fenrir",
  "am_onyx",
  "am_puck",
  "am_santa",
];
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./script.js",
  "./manifest.webmanifest",
  "./icons/icon.svg",
  "./assets/audio/attitude-effort-sample.mp3",
  "./assets/audio/positive_affirmations1.mp3",
  "./assets/audio/positive_affirmations2.mp3",
  "./assets/audio/positive_affirmations3.mp3",
  "./assets/audio/positive_affirmations4.mp3",
  "./assets/audio/positive_affirmations5.mp3",
  "./assets/audio/positive_affirmations6.mp3",
  "./assets/audio/positive_affirmations7.mp3",
  "./assets/audio/positive_affirmations8.mp3",
  "./assets/images/avatars/soundatude-avatar-male-v001.png",
  "./assets/images/avatars/soundatude-avatar-female-v001.png",
  "./assets/video/avatars/male/kokoro-am_michael-v001/sat-p004-avatar-male-kokoro-am_michael-seedance-480p-v001.mp4",
  "./assets/video/avatars/male/kokoro-am_michael-v001/sat-p006-avatar-male-kokoro-am_michael-seedance-480p-v001.mp4",
  "./assets/video/avatars/male/kokoro-am_michael-v001/sat-p009-avatar-male-kokoro-am_michael-seedance-480p-v001.mp4",
  "./assets/video/avatars/male/kokoro-am_michael-v001/sat-p018-avatar-male-kokoro-am_michael-seedance-480p-v001.mp4",
  "./assets/video/avatars/male/kokoro-am_michael-v001/sat-p021-avatar-male-kokoro-am_michael-seedance-480p-v001.mp4",
  "./assets/video/avatars/male/kokoro-am_michael-v001/sat-p024-avatar-male-kokoro-am_michael-seedance-480p-v001.mp4",
  "./assets/video/avatars/male/kokoro-am_michael-v001/sat-p031-avatar-male-kokoro-am_michael-seedance-480p-v001.mp4",
  "./assets/video/avatars/male/kokoro-am_michael-v001/sat-p032-avatar-male-kokoro-am_michael-seedance-480p-v001.mp4",
  "./assets/video/avatars/male/kokoro-am_michael-v001/sat-p041-avatar-male-kokoro-am_michael-seedance-480p-v001.mp4",
  "./assets/video/avatars/male/kokoro-am_michael-v001/sat-p042-avatar-male-kokoro-am_michael-seedance-480p-v001.mp4",
  "./assets/video/avatars/male/kokoro-am_adam-v001/sat-p004-avatar-male-kokoro-am_adam-waveform-matched-480p-v001.mp4",
  "./assets/video/avatars/male/kokoro-am_adam-v001/sat-p006-avatar-male-kokoro-am_adam-waveform-matched-480p-v001.mp4",
  "./assets/video/avatars/male/kokoro-am_adam-v001/sat-p009-avatar-male-kokoro-am_adam-waveform-matched-480p-v001.mp4",
  "./assets/video/avatars/male/kokoro-am_adam-v001/sat-p018-avatar-male-kokoro-am_adam-waveform-matched-480p-v001.mp4",
  "./assets/video/avatars/male/kokoro-am_adam-v001/sat-p021-avatar-male-kokoro-am_adam-waveform-matched-480p-v001.mp4",
  "./assets/video/avatars/male/kokoro-am_adam-v001/sat-p024-avatar-male-kokoro-am_adam-waveform-matched-480p-v001.mp4",
  "./assets/video/avatars/male/kokoro-am_adam-v001/sat-p031-avatar-male-kokoro-am_adam-waveform-matched-480p-v001.mp4",
  "./assets/video/avatars/male/kokoro-am_adam-v001/sat-p032-avatar-male-kokoro-am_adam-waveform-matched-480p-v001.mp4",
  "./assets/video/avatars/male/kokoro-am_adam-v001/sat-p041-avatar-male-kokoro-am_adam-waveform-matched-480p-v001.mp4",
  "./assets/video/avatars/male/kokoro-am_adam-v001/sat-p042-avatar-male-kokoro-am_adam-waveform-matched-480p-v001.mp4",
  "./assets/video/avatars/male/kokoro-am_liam-v001/sat-p004-avatar-male-am_liam-waveform-matched-480p-v001.mp4",
  "./assets/video/avatars/male/kokoro-am_liam-v001/sat-p006-avatar-male-am_liam-waveform-matched-480p-v001.mp4",
  "./assets/video/avatars/male/kokoro-am_liam-v001/sat-p009-avatar-male-am_liam-waveform-matched-480p-v001.mp4",
  "./assets/video/avatars/male/kokoro-am_liam-v001/sat-p018-avatar-male-am_liam-waveform-matched-480p-v001.mp4",
  "./assets/video/avatars/male/kokoro-am_liam-v001/sat-p021-avatar-male-am_liam-waveform-matched-480p-v001.mp4",
  "./assets/video/avatars/male/kokoro-am_liam-v001/sat-p024-avatar-male-am_liam-waveform-matched-480p-v001.mp4",
  "./assets/video/avatars/male/kokoro-am_liam-v001/sat-p031-avatar-male-am_liam-waveform-matched-480p-v001.mp4",
  "./assets/video/avatars/male/kokoro-am_liam-v001/sat-p032-avatar-male-am_liam-waveform-matched-480p-v001.mp4",
  "./assets/video/avatars/male/kokoro-am_liam-v001/sat-p041-avatar-male-am_liam-waveform-matched-480p-v001.mp4",
  "./assets/video/avatars/male/kokoro-am_liam-v001/sat-p042-avatar-male-am_liam-waveform-matched-480p-v001.mp4",
  ...WAVEFORM_MATCHED_MALE_AVATAR_VOICE_IDS.flatMap((sourceVoiceId) => (
    MALE_AVATAR_PHRASE_IDS.map((phraseId) => (
      `./assets/video/avatars/male/kokoro-${sourceVoiceId}-v001/${phraseId}-avatar-male-kokoro-${sourceVoiceId}-waveform-matched-480p-v001.mp4`
    ))
  )),
  "./assets/video/avatars/female/kokoro-af_nicole-v001/sat-p004-avatar-female-kokoro-af_nicole-seedance-480p-v002.mp4",
  "./assets/video/avatars/female/kokoro-af_nicole-v001/sat-p006-avatar-female-kokoro-af_nicole-seedance-480p-v002.mp4",
  "./assets/video/avatars/female/kokoro-af_nicole-v001/sat-p009-avatar-female-kokoro-af_nicole-seedance-480p-v002.mp4",
  "./assets/video/avatars/female/kokoro-af_nicole-v001/sat-p018-avatar-female-kokoro-af_nicole-seedance-480p-v002.mp4",
  "./assets/video/avatars/female/kokoro-af_nicole-v001/sat-p021-avatar-female-kokoro-af_nicole-seedance-480p-v002.mp4",
  "./assets/video/avatars/female/kokoro-af_nicole-v001/sat-p024-avatar-female-kokoro-af_nicole-seedance-480p-v002.mp4",
  "./assets/video/avatars/female/kokoro-af_nicole-v001/sat-p031-avatar-female-kokoro-af_nicole-seedance-480p-v002.mp4",
  "./assets/video/avatars/female/kokoro-af_nicole-v001/sat-p032-avatar-female-kokoro-af_nicole-seedance-480p-v002.mp4",
  "./assets/video/avatars/female/kokoro-af_nicole-v001/sat-p041-avatar-female-kokoro-af_nicole-seedance-480p-v002.mp4",
  "./assets/video/avatars/female/kokoro-af_nicole-v001/sat-p042-avatar-female-kokoro-af_nicole-seedance-480p-v002.mp4",
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
