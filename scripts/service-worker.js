const CACHE_NAME = 'focusly-cache-v1';
const urlsToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/scripts/script.js",
  "/scripts/fetch.js",
  "/scripts/canvas.js",
  "letter-f-initial-icon-logo-template_23987-54-removebg-preview.png"
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