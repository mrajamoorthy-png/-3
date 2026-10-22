// இணையம் இல்லாமலும் ஆப் வேலை செய்ய, கோப்புகளை போனில் சேமிக்கிறது.
// ஆப்பில் மாற்றம் செய்தால் CACHE_NAME-ல் உள்ள எண்ணை (v1 -> v2) மாற்றவும்.
var CACHE_NAME = "tiffin-bill-v1";
var FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (c) { return c.addAll(FILES); })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE_NAME; })
        .map(function (k) { return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(function (hit) {
      return hit || fetch(e.request).catch(function () { return caches.match("./index.html"); });
    })
  );
});
