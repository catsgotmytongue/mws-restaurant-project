import {DBHelper} from '../dbhelper.js';
import {ApiHelper} from '../apihelper.js';
import {UrlHelper} from '../urlHelper.js';
import {getParameterByName, supportsWebp} from '../commonFunctions';
import nanoid from 'nanoid';

const version = 115;
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

// activate is called when an installed service worker is becoming the active service worker
self.addEventListener('activate', event => {
  //log("activating service worker with version %s", version);

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

  // // capture all font-awesome requests :)
  // if(event.request.url.includes('fontawesome.com') || event.request.referrer.includes('font-awesome') || requestUrl.pathname.startsWith("/algo") ) {
  //   event.respondWith( fetchFontAwesomeResource(event, requestUrl) );
  //   return;
  // }

  // make sure to handle our origin's requests
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
      .then(response => response || fetch(event.request).catch(err=> {
        log('error fetching: %o', event.request);
        return new Response({});
      }))
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
  //log('sync event: %o', event);

  if(event.tag === "syncReviews") {
    let reviews = await DBHelper.getReviewsForUpdate();

    for( var review of reviews) {
      //log('Review to post %o', review);
      
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
      // handle /restaurants endpoint
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
      //log("fetchApiResponse: reviews for restaurant %o, %o ... %o", restaurantId, requestUrl.href, requestUrl.pathname);
      
      let dbReviews = await DBHelper.getRestaurantReviewsByRestaurant(restaurantId);

      event.waitUntil( 
        fetch(event.request)
          .then( res => res.clone().json())
          .then( reviews => {
            //log("adding restaurants to DB:%o", reviews);
            return DBHelper.addRestaurantReviewsforRestaurant(reviews); }) 
      );

      return jsonResponse(dbReviews);
    }

    if(/.*\/restaurants\/\d+/.test(requestUrl.href)) {
      let re = /.*\/restaurants\/(\d+)/;
      let result = re.exec(requestUrl.href);

      //console.log('result: %o', result);
      let id = result[1];
      let restaurant = await DBHelper.getRestaurantById(id);
      if(restaurant)
        return jsonResponse(restaurant);

      const restaurantFromApi = await ApiHelper.fetchRestaurantById(id);
      //log('res: %o', restaurantFromApi);
      DBHelper.addRestaurant(restaurantFromApi);
      return jsonResponse(restaurantFromApi);
    }
  }

  if(event.request.method === 'POST') {
    //log(`POST(${requestUrl.pathname})`)
    if(requestUrl.pathname === "/reviews") {
      var reqClone = event.request.clone();
      var reqjson = (await reqClone.text());
      var jobject = JSON.parse(reqjson);

      //log("intercepted post: %o", {event, reqClone, reqjson, jobject});

      var revObj = await ApiHelper.postRestaurantReview(jobject).then( review => {
        //log('Posted review(fetchResponse): %o', review);
        DBHelper.addRestaurantReview(review);
        return review;
      }).catch( err => {
        //log('Error in post %o', err);
        let offlineReview = {...jobject, createdAt: Date.now(), id: nanoid(16)};
        DBHelper.addRestaurantReview(offlineReview);
        //log('reg info: %o:: %o', self, registration);
        if(self.registration.sync) {
          let eventTag = 'syncReviews';
          self.registration.sync.register(eventTag);
          //log('registered sync event %o', eventTag);
        }
        return offlineReview;
      });

      return jsonResponse(revObj);
    }
  }

  if(event.request.method === 'PUT') {
    //log(`PUT(${requestUrl.href})`);

    if(/.*is_favorite=.*/.test(requestUrl.search)) {
      let re = /.*\/restaurants\/(\d+)\/.*is_favorite=(true|false|undefined)/g;
      let result = re.exec(requestUrl.href);
      //console.log('result: %o', result);
      let [_,restaurantId, is_favorite] = result;
      //log(`Set favorite: ${is_favorite} on restuarant ${restaurantId}`);

      return fetch(event.request).then(res => {
          //log('Result from fav op: %o', res);
          DBHelper.setFavoriteRestaurant(restaurantId, is_favorite);
          return res;
        })
      .catch(err => {
        //log(`error marking favorite: ${requestUrl.pathname}`);
          DBHelper.setFavoriteRestaurant(restaurantId, is_favorite);
          return jsonResponse({id: restaurantId, is_favorite});
      });
    }
  }

  //log('fetchApiResponse: Unknown state: %o, %o', event.request, requestUrl);
  let response = await caches.match(event.request);
  return response || fetch(event.request).catch(reason => log("fetchApiResponse::Failure: ",reason)); 
}
async function fetchAndCache(url, event) {
  const res = await fetch(url);
  let cache = await caches.open(currentStaticCacheName);
  cache.put(event.request, res.clone());
  return res;
}
async function fetchSameOriginResponse(event, requestUrl) {
  //log('SameOriginFetch: %o', event);

  if(event.request.method === 'GET') {
    // handle root, when offline
    if(requestUrl.pathname === '/') {
      //try to get from cache first but no matter what update the cache
      return caches.match('/index.html');
      // .catch( async err => {
      //   event.waitUntil( async f => {
      //     let res = await fetchAndCache('/index.html', event) 
      //     return res;
      //   } );
      // });
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

// async function fetchFontAwesomeResource(event, requestUrl) {
//   let file = filenameFromPath(requestUrl.pathname);
//   //log('font awesome: %o', file );
//   //filenameFromPath(requestUrl.pathname);

//   return caches.match(event.request).then(response => 
//     response || fetch(`/font-awesome${file}`) ).then( async res => {
//       let cache  = await caches.open(currentStaticCacheName);
//       cache.put(event.request, res.clone());
//       return res;
//     })
//     .catch(reason => log("Cache miss: %o %o", reason, event.request));

// }

const filenameFromPath = (path) => path.substring(path.lastIndexOf('/'));

async function serveImage(request) {
  let imgKey = request.url.replace(/-\d+$/, '');

  let cache = await caches.open(currentImgCacheName);
  let cacheResponse = await cache.match(imgKey);
  if(cacheResponse)
    //log('serve image from cache: %o => %o', imgKey, request.url);
  
    if(webpSupported){
      //log('attempt to return webp image...');
    }
    let fetchImage = new Promise( (resolve, reject) => {
      if(webpSupported) {
        //log(`fetch webp... ${imgKey}, ${request.url}, replace .jpg: ${request.url.replace('.jpg', '.webp')}`);
        return fetch(request.url.replace('.jpg', '.webp')).then( img => resolve(img)).catch(err=> reject(err));
      } else {
        //log(`fetch jpg... ${imgKey}`);
        return fetch(request).then(img => resolve(img)).catch(err => reject(err));
      }
    });
    
  return cacheResponse || fetchImage.then(imageResponse => {
                cache.put(imgKey, imageResponse.clone()); 
                return imageResponse;
              });
}