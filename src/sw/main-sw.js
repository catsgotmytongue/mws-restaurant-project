import {DBHelper} from '../dbhelper.js';
import {ApiHelper} from '../apihelper.js';
import {UrlHelper} from '../urlHelper.js';
import {getParameterByName} from '../commonFunctions';
import nanoid from 'nanoid';

const version = 52;
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


log(`Running sw.js version ${version}`);

// install is called when service worker is actually installed
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(currentStaticCacheName)
    .then(cache => cache.addAll([
      '/',
      `/css/restaurant_detail.css`,
      `/css/restaurant_list.css`,
      '/favicon.ico',
      '/manifest.json',
      `/index.html`,
      `/restaurant.html`,
      `/restaurant_list.js`,
      `/dbhelper.js`,
      `/restaurant_detail.js`,
      '/register_sw.js',
      'https://kit.fontawesome.com/be9114bde4.js'
    ]))
    .catch(err=> log('Error when adding cached items %o', err))
  )
});

// activate is called when an installed service worker is becoming the active service worker
self.addEventListener('activate', event => {
  log("activating service worker with version %s", version);

  event.waitUntil(
    caches.keys()
    .then( cacheNames => 
      Promise.all(
        cacheNames
          .filter(cacheName => 
            (cacheName.startsWith(staticCacheName) || cacheName.startsWith(imgCacheName) ) && !currentCaches.includes(cacheName))
          .map( cacheName => {
            log('deleting cache named %s', cacheName);
            caches.delete( cacheName).catch("Error deleting cache named %s", cacheName);
          })
      )
    ) 
  ); 

  log('createDB() from service worker activation...');
  // reccomended creation of DB during SW activation event: 
  // https://developers.google.com/web/ilt/pwa/live-data-in-the-service-worker
  event.waitUntil(
    DBHelper.getDB()
  );
});

// listen for requests
self.addEventListener('fetch', event => {
  
  var requestUrl = new URL(event.request.url);

  // make sure to handle only our origin's requests
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
      .then(response => response || fetch(event.request).catch(err=> log('error fetching: %o', event.request)) )
      .catch(reason => log("Cache miss: ",reason)) 
  );
  return;
});

// listen for service worker messages
self.addEventListener('message', async event => {
  if(event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }

  if(event.data.action === 'online')  {
    log("User Online");

  }

  if(event.data.action === 'offline') {
    log("User Offline");
  }
});

// background sync API
self.addEventListener('sync', async event =>{
  log('sync event: %o', event);

  if(event.tag === "syncReviews") {
    let reviews = await DBHelper.getReviewsForUpdate();

    for( var review of reviews) {
      log('Review to post %o', review);
      
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
  //log("fetchApiResponse: %o, %o", requestUrl.href, apiUrl.href);
  
  if(event.request.method === "GET") {
    if(requestUrl.href === apiUrl.href) {
      //log('handle promises with await!')
      // handle /restaurants endpoint
      let restaurants = await DBHelper.getRestaurants();
      log('restaurants from db: %o', restaurants);
      
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
      log("fetchApiResponse: reviews for restaurant %o, %o ... %o", restaurantId, requestUrl.href, requestUrl.pathname);
      
      let dbReviews = await DBHelper.getRestaurantReviewsByRestaurant(restaurantId);

      event.waitUntil( 
        fetch(event.request)
          .then( res => res.clone().json())
          .then( reviews => {
            log("adding restaurants to DB:%o", reviews);
            return DBHelper.addRestaurantReviewsforRestaurant(reviews); }) 
      );

      return jsonResponse(dbReviews);
    }

    if(/.*\/restaurants\/\d+\//.test(requestUrl.href)) {
      let re = /.*\/restaurants\/(?<restaurantId>\d+)\//;
      let result = re.exec(requestUrl.href);
      let id = result.groups.restaurantId
      
      let restaurant = await DBHelper.getRestaurantById(id);
      if(restaurant)
        return jsonResponse(restaurant);

      const restaurantFromApi = await ApiHelper.fetchRestaurantById(id);
      log('res: %o', restaurantFromApi);
      DBHelper.addRestaurant(restaurantFromApi);
      return restaurantFromApi;
    }
  }

  if(event.request.method === 'POST') {
    log(`POST(${requestUrl.pathname})`)
    if(requestUrl.pathname === "/reviews") {
      var reqClone = event.request.clone();
      var reqjson = (await reqClone.text());
      var jobject = JSON.parse(reqjson);

      log("intercepted post: %o", {event, reqClone, reqjson, jobject});

      var revObj = await ApiHelper.postRestaurantReview(jobject).then( review => {
        log('Posted review(fetchResponse): %o', review);
        DBHelper.addRestaurantReview(review).then(rev => log('review: %o', rev));
        return review;
      }).catch( err => {
        log('Error in post %o', err);
        let offlineReview = {...jobject, createdAt: Date.now(), id: nanoid(16)};
        DBHelper.addRestaurantReview(offlineReview).then(rev => log('review: %o', rev));
        log('reg info: %o:: %o', self, registration);
        if(self.registration.sync) {
          let eventTag = 'syncReviews';
          self.registration.sync.register(eventTag);
          log('registered sync event %o', eventTag);
        }
        return offlineReview;
      });

      return jsonResponse(revObj);
    }
  }

  if(event.request.method === 'PUT') {
    log(`PUT(${requestUrl.href})`);

    if(/.*is_favorite=.*/.test(requestUrl.search)) {
      let re = /.*\/restaurants\/(?<restaurantId>\d+)\/.*is_favorite=(?<is_favorite>true|false|undefined)/g;
      let result = re.exec(requestUrl.href);
      let {restaurantId, is_favorite} = result.groups;
      //log(`Set favorite: ${is_favorite} on restuarant ${restaurantId}`);

      return fetch(event.request).then(res => {
          //log('Result from fav op: %o', res);
          DBHelper.setFavoriteRestaurant(restaurantId, is_favorite);
          return res;
        })
      .catch(err => {
        log(`error marking favorite: ${requestUrl.pathname}`);
      });
    }
  }

  log('fetchApiResponse: Unknown state: %o, %o', event.request, requestUrl);
  let response = await caches.match(event.request);
  return response || fetch(event.request).catch(reason => log("fetchApiResponse::Cache miss: ",reason)); 
}

async function fetchSameOriginResponse(event, requestUrl) {
  //log('SameOriginFetch: %o', event);

  if(event.request.method === 'GET') {
    // handle root, when offline
    if(requestUrl.pathname === '/') {
      return caches.match('/index.html');
    }

    // handle image requests
    if(requestUrl.pathname.startsWith(UrlHelper.IMAGE_ROOT)) {
      return serveImage(event.request);
    }

    if(requestUrl.pathname.startsWith('/restaurant.html')){
      return caches.match(event.request, {ignoreSearch: true});
    }
  }


  // any other request return a cached response or fetch it
  return caches.match(event.request).then(response => 
    response || fetch(event.request) )
    .catch(reason => log("Cache miss: %o %o", reason, event.request));
}

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