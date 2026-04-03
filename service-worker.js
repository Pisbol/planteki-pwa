const CACHE_NAME="planteki-v1";
const urlsToCache=["./","./splash.html","./login.html","./index.html","./plant-wiki.html","./styles.css","./app.js"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(urlsToCache))); });
self.addEventListener("fetch", e => { e.respondWith(caches.match(e.request).then(resp=>resp||fetch(e.request))); });