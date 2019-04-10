
const version = 14;
const staticCacheName = 'restaurant-static-cache-v';
const currentStaticCacheName = `${staticCacheName}${version}`;
const allCaches = [
  currentStaticCacheName
];

// install is called when service worker is actually installed
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(currentStaticCacheName)
    .then(cache => cache.addAll([
      '/',
      '/favicon.ico',
      '/index.html',
      'restaurant.html',
      '/js/main.js',
      'js/dbhelper.js',
      '/js/restaurant_info.js'
    ]))
    .catch(err=> console.log('Error when adding cached items %o', err))
  )
});

// activate is called when an installed service worker is becoming the active service worker
self.addEventListener('activate', event => {
  console.log("activating service worker with version %s", version);

  event.waitUntil(
    caches.keys()
    .then( cacheNames => 
      Promise.all(
        cacheNames
          .filter(cacheName => cacheName.startsWith(staticCacheName) && cacheName !== currentStaticCacheName)
          .map( cacheName => {
            console.log('deleting cache named %s', cacheName);
            caches.delete( cacheName).catch("Error deleting cache named %s", cacheName);
          })
      )
    ) 
  )
});

self.addEventListener('fetch', event => {
  event.respondWith( caches.match(event.request).then(response => response || fetch(event.request) ) );
});