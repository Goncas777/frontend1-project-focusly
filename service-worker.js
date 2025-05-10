const CACHE_NAME = 'focusly-cache-v1';
const urlsToCache = [
  "/frontend1-project-focusly/",
  "/frontend1-project-focusly/index.html",
  "/frontend1-project-focusly/style.css",
  "/frontend1-project-focusly/scripts/script.js",
  "/frontend1-project-focusly/scripts/fetch.js",
  "/frontend1-project-focusly/scripts/canvas.js",
  "/frontend1-project-focusly/letter-f-initial-icon-logo-template_23987-54-removebg-preview.png"
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});