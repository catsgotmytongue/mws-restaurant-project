import {DBHelper} from '../dbhelper.js';

const version = 79;

const apiUrl = new URL(DBHelper.ApiUrl);

const cacheNamePrefix = 'restaurant-';
const staticCacheName = `${cacheNamePrefix}static-cache-v`;
const imgCacheName    = `${cacheNamePrefix}image-cache-v`;
const currentStaticCacheName = `${staticCacheName}${version}`;
const currentImgCacheName    = `${imgCacheName}${version}`;
const currentCaches = [
  currentStaticCacheName,
  currentImgCacheName
];

//console.log('DBHELPER %o', DBHelper);
console.log(`Running sw.js version ${version}`);

// install is called when service worker is actually installed
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(currentStaticCacheName)
    .then(cache => cache.addAll([
      `/css/restaurant-detail.css`,
      `/css/restaurant-list.css`,
      '/favicon.ico',
      '/manifest.json',
      `/index.html`,
      `/restaurant.html`,
      `/main.js`,
      `/dbhelper.js`,
      `/restaurant_info.js`,
      '/register_sw.js',
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
  //console.log("REQ: %o", event.request);
  
  var requestUrl = new URL(event.request.url);

  // make sure to handle only our origin's requests
  if (requestUrl.origin === location.origin) {
    // handle root, when offline
    if(requestUrl.pathname === '/') {
      event.respondWith( caches.match('/index.html') );
    }

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

  if(requestUrl.origin == apiUrl.origin)
  {
    console.log("API Call %o, %o", requestUrl.href, apiUrl.href);
    if(requestUrl.href === apiUrl.href) {
      event.respondWith(
        fetch(event.request)
        .then(res => {
          const clonedRes = res.clone();
          clonedRes.json().then( restaurants => {
            DBHelper.putRestaurants(restaurants)
          })
          return res;
        }) 
      );
    }

    return;
  }

  //console.log("Outside Origin: %o", requestUrl);
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request) )
      .catch(reason => console.log("Cache miss: ",reason)) 
  );
  return;
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
