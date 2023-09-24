// Define the cache name and assets to be cached
var CACHE_NAME = 'my-pwa-cache-v2'; // You can increment the version to force an update
var urlsToCache = [
  '/',
  'index.html',
  'main.css',
  'qrcode.min.js',
  'invoice.html', // Add your additional HTML file
  'invoice.css',  // Add your additional CSS file
  // Add other assets you want to cache, including images, fonts, etc.
];

// Install the service worker and cache assets
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
  );
});

// Intercept network requests and serve from cache if available
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response from cache
        if (response) {
          return response;
        }

        // If not found in cache, fetch from network
        return fetch(event.request);
      })
  );
});

// Remove old caches when a new service worker is activated
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
