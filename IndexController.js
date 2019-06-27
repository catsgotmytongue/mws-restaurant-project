
console.log('INDEXCONTROLLER!');

import { idb } from 'idb';

function openDatabase() {
  console.log("Opening db");

  if (!navigator.serviceWorker) {
    return Promise.resolve();
  }

  return idb.openDB("restaurants", 1, upgradeDb => {
    console.log("db: %o", upgradeDb);
  });

}

export default function IndexController(container) {
  this._container = container;
  this._dbPromise = openDatabase();
  this._registerServiceWorker();
}

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
