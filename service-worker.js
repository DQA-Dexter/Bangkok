const CACHE_NAME = "bangkok-trip-v1";

const URLS_TO_CACHE = [
  "./index.html",

  // icons
  "./image/icon-180.png",
  "./image/icon-192.png",
  "./image/icon-512.png",

  // 你的圖片（有什麼就加什麼）
  "./image/Hotel.png",
  "./image/room1.jpg",
  "./image/room2.jpg",
  "./image/room3.jpg",
  "./image/airplan_ticket_go_HSU.png",
  "./image/airplan_ticket_back_HSU.png",
  "./image/airplan_ticket_go&back_chang.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // 有快取就用快取，沒有就走網路
      return response || fetch(event.request);
    })
  );
});
