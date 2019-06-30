import {openDB} from 'idb';
import {updateRestaurants} from '../js/main.js';

export function IndexController(container) {
  this._container = container;
  this._dbPromise = this.openDatabase();
  this._registerServiceWorker();
}

IndexController.prototype.initMap = function() {
  let loc = {
    lat: 40.722216,
    lng: -73.987501
  };
  self.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: loc,
    scrollwheel: false
  });
  updateRestaurants();
};

IndexController.prototype.updateRestaurants = function() {
  updateRestaurants();
}

IndexController.prototype.openDatabase = function() {
  console.log("Opening db");
  debugger;
  if (!navigator.serviceWorker) {
    return Promise.resolve();
  }

  return openDB("restaurants", 5, 
  {
    upgrade(db, oldVersion, newVersion, transaction) {
      console.log("db: %o", db);
    //create an object store
    var keyValStore = db.createObjectStore('restaurants');
    keyValStore.put('testval', 'testkey');  
    },
    blocked() {
      // …
    },
    blocking() {
      // …
    }
  } 
    );
};

IndexController.prototype._registerServiceWorker = function() {
  if(navigator.serviceWorker) {
    navigator.serviceWorker.register("./main-sw.js")
    .then( swRegistration => {
      console.log("Service worker registered: %o", swRegistration);
  
      if (!navigator.serviceWorker.controller) {
        return;
      }
  
      // activate a waiting service worker
      if (swRegistration.waiting) {
        activateServiceWorker(swRegistration.waiting);
        return;
      }
  
      // watch a service working that's installing and activate when its done
      if (swRegistration.installing) {
        waitForInstalledServiceWorker(swRegistration.installing);
        return;
      }
  
      // if an updated service worker is found, activate when it's installed
      swRegistration.addEventListener('updatefound', () => 
        waitForInstalledServiceWorker(swRegistration.installing)
      );
    })
    .catch(err => {
      console.log("Error registering service worker: %o", err);
    });
  
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    })
  
    function waitForInstalledServiceWorker(worker) {
      worker.addEventListener('statechange', () => {
        if (worker.state == 'installed') {
          activateServiceWorker(worker);
        }
      });
    }
  
    function activateServiceWorker(worker) {
      worker.postMessage({action: 'skipWaiting'});
    }
  }
};
