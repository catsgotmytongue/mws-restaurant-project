import {log} from '../commonFunctions';

const logPrefix = '[Register SW]';
 
var registerServiceWorker = function(serviceWorkerFile) {
  if('serviceWorker' in navigator) {
    navigator.serviceWorker.register(serviceWorkerFile)
    .then( swRegistration => {
      log(logPrefix,"Service worker registered: %o", swRegistration);
  
      if (!navigator.serviceWorker.controller) {
        return;
      }
  
      // activate a waiting service worker
      if (swRegistration.waiting) {
        activateServiceWorker(swRegistration.waiting);
        return;
      }
  
      // watch a service worker that's installing and activate when its done
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
      log(logPrefix,"Error registering service worker: %o", err);
    });
  
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });
  
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

// wait until after page loads to register a service worker
if('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    registerServiceWorker("./main-sw.js");
  });

  window.addEventListener('offline', function(event) {
    log(logPrefix, 'online postMessage');
    navigator.serviceWorker.controller.postMessage({action: "offline"})
  });
  
  window.addEventListener('online', function(event) {
    log(logPrefix, 'online postMessage');
    navigator.serviceWorker.controller.postMessage({action: "online"})
  });

  if ('SyncManager' in window) {
    navigator.serviceWorker.ready.then(function(reg) {
      if ('sync' in reg) {
        return reg.sync.register('syncReviews');
      }

      return undefined;
    }).catch(function() {
      // system was unable to register for a sync,
      // this could be an OS-level restriction
      log(logPrefix,"Sync manager couldn't register");
    });
  }
}
