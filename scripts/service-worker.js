self.addEventListener("install", (event) => {
    event.waitUntil(
      caches.open("meu-cache-v1").then((cache) => {
        return cache.addAll([
          "/",
          "/index.html",
          "/style.css",
          "/scripts/script.js",
          "/scripts/fetch.js",
          "/scripts/canvas.js"
        ]);
      })
    );
  });
  
  self.addEventListener("fetch", (event) => {
    event.respondWith(
      caches.match(event.request).then((resposta) => {
        return resposta || fetch(event.request);
      })
    );
  });
  