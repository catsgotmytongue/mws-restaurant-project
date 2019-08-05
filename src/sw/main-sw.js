import {DBHelper} from '../dbhelper.js';
import {ApiHelper} from '../apihelper.js';
import {UrlHelper} from '../urlHelper.js';
import {getParameterByName, supportsWebp} from '../commonFunctions';
import nanoid from 'nanoid';

const version = 11;
const apiUrl = new URL(`${ApiHelper.ApiUrl}/restaurants`);
const loggingEnabled = true;
const cacheNamePrefix = 'restaurant-';
const staticCacheName = `${cacheNamePrefix}static-cache-v`;
const imgCacheName    = `${cacheNamePrefix}image-cache-v`;
const currentStaticCacheName = `${staticCacheName}${version}`;
const currentImgCacheName    = `${imgCacheName}${version}`;
const currentCaches = [
  currentStaticCacheName,
  currentImgCacheName
];
let webpSupported = false;

log(`Running sw.js version ${version}`);

// install is called when service worker is actually installed
self.addEventListener('install', event => {
  event.waitUntil( (async () => {
    let cache  = await caches.open(currentStaticCacheName);
    await cache.addAll([
      '/',
      '/index.html',
      '/css/restaurant-list.css',
      '/restaurant.html',
      '/css/restaurant-detail.css',
      '/favicon.ico',
      '/manifest.json',
      '/restaurant-list.js',
      '/dbhelper.js',
      '/restaurant-detail.js',
      '/register-sw.js',
      '/css/fontawesome.min.css',
      '/css/solid.min.css',
      '/webfonts/fa-brands-400.eot',
      '/webfonts/fa-brands-400.svg',
      '/webfonts/fa-brands-400.ttf',
      '/webfonts/fa-brands-400.woff',
      '/webfonts/fa-brands-400.woff2',
      '/webfonts/fa-regular-400.eot',
      '/webfonts/fa-regular-400.svg',
      '/webfonts/fa-regular-400.ttf',
      '/webfonts/fa-regular-400.woff',
      '/webfonts/fa-regular-400.woff2',
      '/webfonts/fa-solid-900.eot',
      '/webfonts/fa-solid-900.svg',
      '/webfonts/fa-solid-900.ttf',
      '/webfonts/fa-solid-900.woff',
      '/webfonts/fa-solid-900.woff2'
      //"https://placehold.it/300"
    ])
    .catch(err=> log('Error when adding cached items %o', err));

    webpSupported = await supportsWebp();

  })() )
});

async function deleteOldCaches() {
  let cacheNames = await caches.keys()
  let deleteOperations = cacheNames.filter(cacheName => 
    (cacheName.startsWith(staticCacheName) || cacheName.startsWith(imgCacheName) ) && !currentCaches.includes(cacheName))
    .map( cacheName => {
      return caches.delete( cacheName).catch("Error deleting cache named %s", cacheName);
    });

  return Promise.all( deleteOperations);
}

// activate is called when an installed service worker is becoming the active service worker
self.addEventListener('activate', event => {

  event.waitUntil( deleteOldCaches() );

  //log('createDB() from service worker activation...');
  // reccomended creation of DB during SW activation event: 
  // https://developers.google.com/web/ilt/pwa/live-data-in-the-service-worker
  event.waitUntil(
    DBHelper.getDB()
  );
});

// listen for requests
self.addEventListener('fetch', event => {
  
  var requestUrl = new URL(event.request.url);
  if (requestUrl.origin === location.origin) {
    event.respondWith(
      fetchSameOriginResponse(event, requestUrl)
    );
    return;
  }

  // api origin requests
  if(requestUrl.origin == apiUrl.origin)
  {
    event.respondWith(
      fetchApiResponse(event, requestUrl)
    );
    return;
  }



  // otherwise return from a cached response or network response appropriately
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(reason => {
        log("Cache miss: ",reason)
        return new Response({});
      })
  );
  return;
});

// listen for service worker messages
self.addEventListener('message', async event => {
  if(event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

// background sync API
self.addEventListener('sync', async event =>{

  if(event.tag === "syncReviews") {
    let reviews = await DBHelper.getReviewsForUpdate();

    for( var review of reviews) {
      
      ApiHelper.postRestaurantReview(review).then(
        async rv => {
          await DBHelper.deleteRestaurantReview(review.id);
          await DBHelper.addRestaurantReview(rv);
        });
    }
  }
});

function jsonResponse(obj) {
  return new Response(JSON.stringify(obj), {
  headers: {'Content-Type': 'application/json'}
});
}
function log(str, ...args) {
  if(loggingEnabled) {
    console.log("[Service Worker]::"+str, ...args);
  }
}


async function fetchApiResponse(event, requestUrl) {
  
  if(event.request.method === "GET") {
    if(requestUrl.href === apiUrl.href) {
      let restaurants = await DBHelper.getRestaurants();
      
      if(restaurants && restaurants.length > 0)
        return jsonResponse(restaurants);
      const res = await fetch(event.request);
      const clonedRes = res.clone();
      restaurants = await clonedRes.json();
      DBHelper.addRestaurants(restaurants);

      return res;
    }

    if(requestUrl.pathname.startsWith("/reviews")) {
      const restaurantId = getParameterByName('restaurant_id', requestUrl.href);      
      let dbReviews = await DBHelper.getRestaurantReviewsByRestaurant(restaurantId);
      event.waitUntil( 
        fetch(event.request)
          .then( res => res.clone().json())
          .then( reviews => {
            return DBHelper.addRestaurantReviewsforRestaurant(reviews); }) 
      );

      return jsonResponse(dbReviews);
    }

    if(/.*\/restaurants\/\d+/.test(requestUrl.href)) {
      let re = /.*\/restaurants\/(\d+)/;
      let result = re.exec(requestUrl.href);

      let id = result[1];
      let restaurant = await DBHelper.getRestaurantById(id);
      if(restaurant)
        return jsonResponse(restaurant);

      const restaurantFromApi = await ApiHelper.fetchRestaurantById(id);
      DBHelper.addRestaurant(restaurantFromApi);
      return jsonResponse(restaurantFromApi);
    }
  }

  if(event.request.method === 'POST') {
    if(requestUrl.pathname === "/reviews") {
      var reqClone = event.request.clone();
      var reqjson = (await reqClone.text());
      var jobject = JSON.parse(reqjson);

      var revObj = await ApiHelper.postRestaurantReview(jobject).then( review => {
        DBHelper.addRestaurantReview(review);
        return review;
      }).catch( err => {
        let offlineReview = {...jobject, createdAt: Date.now(), id: nanoid(16)};
        DBHelper.addRestaurantReview(offlineReview);
        if(self.registration.sync) {
          let eventTag = 'syncReviews';
          self.registration.sync.register(eventTag);
        }
        return offlineReview;
      });

      return jsonResponse(revObj);
    }
  }

  if(event.request.method === 'PUT') {

    if(/.*is_favorite=.*/.test(requestUrl.search)) {
      let re = /.*\/restaurants\/(\d+)\/.*is_favorite=(true|false|undefined)/g;
      let result = re.exec(requestUrl.href);
      let [_,restaurantId, is_favorite] = result;

      return fetch(event.request).then(res => {
          DBHelper.setFavoriteRestaurant(restaurantId, is_favorite);
          return res;
        })
      .catch(err => {
          DBHelper.setFavoriteRestaurant(restaurantId, is_favorite);
          return jsonResponse({id: restaurantId, is_favorite});
      });
    }
  }

  let response = await caches.match(event.request);
  return response || fetch(event.request).catch(reason => log("fetchApiResponse::Failure: ",reason)); 
}

async function fetchSameOriginResponse(event, requestUrl) {

  if(event.request.method === 'GET') {
    if(requestUrl.pathname === '/') {
      return fromCache('/index.html');
    }

    // handle image requests
    if(requestUrl.pathname.startsWith(UrlHelper.IMAGE_ROOT)) {
      return serveImage(event.request);
    }

    if(requestUrl.pathname.startsWith('/restaurant.html')){
      return fromCache(event.request, {ignoreSearch: true});
    }
  }

  return fromCache(event.request).then(response => 
    response || fetch(event.request) )
    .catch(reason => log("Cache miss: %o %o", reason, event.request));
}

const filenameFromPath = (path) => path.substring(path.lastIndexOf('/'));

async function serveImage(request) {
  let imgKey = /-\d+.*\.jpg$/.test(request.url) ? request.url.replace(/-\d+/, '') : request.url;
  let cachedImg = await fromImgCache(imgKey);
  if(cachedImg) {
    return cachedImg;
  }
  return updateImgCache(request, imgKey);
}

async function fromCache(request, options = {}) {
  let cache = await caches.open(currentStaticCacheName);
  return cache.match(request, options);
}

async function updateCache(request) {
  let cache = await caches.open(currentStaticCacheName);
  const res = await fetch(request);
  await cache.put(request, res.clone());
  return res;
}

async function fromImgCache(key) {
  let cache = await caches.open(currentImgCacheName);
  return cache.match(key);
}

async function updateImgCache(request, imgKey) {
  let imgReq = webpSupported && request.url.endsWith('.jpg')
           ? request.url.replace('.jpg', '.webp')
           : request;

  let cache = await caches.open(currentImgCacheName);
  const res = await fetch(imgReq);
  cache.put(imgKey, res.clone());
  return res;
}