const CACHE_NAME = "obs-version-1";
const ASSETS = ["/", "/index.html", "/src/App.css", "/src/index.css"];

self.addEventListener("install", (event) => {
  // event.waitUntil(
  //   caches.open(CACHE_NAME).then((cache) => {
  //     cache.addAll(ASSETS);
  //   })
  // );
});

self.addEventListener("activate", (event) => {});

self.addEventListener("fetch", (event) => {
  // event.respondWith(
  //   caches.match(event.request).then((response) => {
  //     return (
  //       response ||
  //       fetch(event.request).catch(function () {
  //         return caches.match("/offline.html"); // Serve offline.html when there's no network response
  //       })
  //     );
  //   })
  // );
});
