self.importScripts('./js/dbhelper.js');
const version = 15;
const cacheNamePrefix = 'restaurant-';
const staticCacheName = `${cacheNamePrefix}static-cache-v`;
const imgCacheName    = `${cacheNamePrefix}image-cache-v`;
const currentStaticCacheName = `${staticCacheName}${version}`;
const currentImgCacheName    = `${imgCacheName}${version}`;
const currentCaches = [
  currentStaticCacheName,
  currentImgCacheName
];

// install is called when service worker is actually installed
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(currentStaticCacheName)
    .then(cache => cache.addAll([
      '/',
      `/css/restaurant-detail.css?v=${version}`,
      `/css/restaurant-list.css?v=${version}`,
      '/favicon.ico',
      `/index.html?v=${version}`,
      `/restaurant.html?v=${version}`,
      DBHelper.DATABASE_URL,
      `/js/main.js?v=${version}`,
      `/js/dbhelper.js?v=${version}`,
      `/js/restaurant_info.js?v=${version}`
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
          .filter(cacheName => 
            (cacheName.startsWith(staticCacheName) || cacheName.startsWith(imgCacheName) ) && !currentCaches.includes(cacheName))
          .map( cacheName => {
            console.log('deleting cache named %s', cacheName);
            caches.delete( cacheName).catch("Error deleting cache named %s", cacheName);
          })
      )
    ) 
  ); 
});

// listen for requests
self.addEventListener('fetch', event => {
  
  var requestUrl = new URL(event.request.url);

  // make sure to handle only our origin's requests
  if (requestUrl.origin === location.origin) {
    // handle image requests
    if(requestUrl.pathname.startsWith(DBHelper.IMAGE_ROOT)) {
      event.respondWith( serveImage(event.request) );
      return;
    }

    if(requestUrl.pathname.startsWith('/restaurant.html')){
      event.respondWith( caches.match(event.request, {ignoreSearch: true}));
      return;
    }

    // same origin .css or .js updates
    // if(requestUrl.pathname.endsWith('.css') || requestUrl.pathname.endsWith('.js')) {
    //   event.respondWith( serveAsset(event.request) );
    //   return;
    // }

    // any other request return a cached response or fetch it
    event.respondWith( 
      caches.match(event.request)
      .then(response => response || fetch(event.request) )
      .catch(reason => console.log("Cache miss: ",reason)) );
    return;
  }
});

// listen for service worker messages
self.addEventListener('message', event => {
  if(event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

function serveImage(request) {
  let imgKey = request.url.replace(/-\d+\.jpg$/, '');
  return caches
          .open(currentImgCacheName)
          .then(cache => 
            cache.match(imgKey)
            .then(response => 
              response || fetch(request)
              .then(imageResponse => {
                cache.put(imgKey, imageResponse.clone()); 
                return imageResponse;
              }) 
            )
          );
}

function serveAsset(request) {
  return caches
  .open(currentStaticCacheName)
  .then(cache => 
    cache.match(request)
    .then(response => 
      response || fetch(request, {cache: "no-cache"})
      .then(networkResponse => {
        cache.put(request, networkResponse.clone());
        return networkResponse;
      }) 
    )
  );
}
