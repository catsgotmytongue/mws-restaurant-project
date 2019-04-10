if(navigator.serviceWorker) {
  navigator.serviceWorker.register("./main-sw.js")
  .then( swRegistration => console.log("Service worker registered: %o", swRegistration))
  .catch(err => {
    console.log("Error registering service worker: %o", err);
  });
}