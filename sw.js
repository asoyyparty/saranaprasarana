const CACHE_NAME = 'sarpras-cache-v2';
const urlsToCache = [
  './',
  'index.php',
  'manifest.json',
  'assets/images/sarana-icon-192.png',
  'assets/images/sarana-icon-512.png',
  'assets/images/sarana-icon.png',
  'assets/images/apple-touch-icon.png',
  'assets/images/cba.png',
  'assets/css/style.css',
  'assets/css/mobile_view.css'
];

// Install Service Worker
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache', CACHE_NAME);
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch events
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Activate & remove old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});
