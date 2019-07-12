import {DBHelper} from '../dbhelper.js';
import {ApiHelper} from '../apihelper.js';
import {UrlHelper} from '../urlHelper.js';

const version = 111;

const apiUrl = new URL(`${ApiHelper.ApiUrl}/restaurants`);

const cacheNamePrefix = 'restaurant-';
const staticCacheName = `${cacheNamePrefix}static-cache-v`;
const imgCacheName    = `${cacheNamePrefix}image-cache-v`;
const currentStaticCacheName = `${staticCacheName}${version}`;
const currentImgCacheName    = `${imgCacheName}${version}`;
const currentCaches = [
  currentStaticCacheName,
  currentImgCacheName
];

console.log(`Running sw.js version ${version}`);

// install is called when service worker is actually installed
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(currentStaticCacheName)
    .then(cache => cache.addAll([
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

  console.log('createDB() from service worker activation...');
  // reccomended creation of DB during SW activation event: 
  // https://developers.google.com/web/ilt/pwa/live-data-in-the-service-worker
  event.waitUntil(
    DBHelper.createDB()
  );
});

// listen for requests
self.addEventListener('fetch', event => {
  //console.log("REQ: %o", event.request);
  
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
      .then(response => response || fetch(event.request).catch(err=> console.log('error fetching: %o', event.request)) )
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

function jsonResponse(obj) {
  return new Response(JSON.stringify(obj), {
  headers: {'Content-Type': 'application/json'}
});
}


async function fetchApiResponse(event, requestUrl) {
  console.log("fetchApiResponse: %o, %o", requestUrl.href, apiUrl.href);
  
  if(requestUrl.href === apiUrl.href) {
    console.log('handle promises with await!')
    // handle /restaurants endpoint
    let restaurants = await DBHelper.getRestaurants();
    console.log('restaurants from db: %o', restaurants);
    
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
    console.log("fetchApiResponse: reviews for restaurant %o, %o ... %o", restaurantId, requestUrl.href, requestUrl.pathname);
    
    let reviews = await DBHelper.getRestaurantReviewsByRestaurant(restaurantId);
    if(reviews && reviews.length > 0)
      return jsonResponse(reviews);
    
    const res = await fetch(event.request);
    const clonedRes = res.clone();
    reviews = await clonedRes.json();
    DBHelper.addRestaurantReviewsforRestaurant(reviews);
    return res;
  }

  if(requestUrl.pathname.startsWith('/restaurants/')) {
    const id = requestUrl.pathname.replace('/restaurants/', '');
    console.log('try to add restaurant based on %o, %o', requestUrl.pathname, id);
    let restaurant = await DBHelper.getRestaurantById(id);
    if(restaurant)
      return jsonResponse(restaurant);

    const res = await ApiHelper.fetchRestaurantById(id);
    restaurant = await res.clone().json();
    DBHelper.addRestaurant(restaurant);
    return res;
  }

  console.log('fetchApiResponse: Unknown state: %o, %o', event.request, requestUrl);
  let response = await caches.match(event.request);
  return response || fetch(event.request).catch(reason => console.log("fetchApiResponse::Cache miss: ",reason)); 
}

function fetchSameOriginResponse(event, requestUrl) {
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

  // any other request return a cached response or fetch it
  return caches.match(event.request).then(response => 
    response || fetch(event.request) )
    .catch(reason => console.log("Cache miss: %o %o", reason, event.request));
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

/**
 * Get a parameter by name from page URL.
 */
var getParameterByName = (name, url) => {
  if(!url)
    throw("url is undefined");

  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
