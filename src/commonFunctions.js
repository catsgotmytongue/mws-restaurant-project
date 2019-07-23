import {UrlHelper} from './urlHelper';

export function trueBool(b) {
  return b === 'false' ? false : Boolean(b);
}
export function mapMarkerForRestaurant(restaurant, map) {
  const marker = new google.maps.Marker({
    position: restaurant.latlng,
    title: restaurant.name,
    url: UrlHelper.urlForRestaurant(restaurant),
    map: map,
    animation: google.maps.Animation.DROP}
    );
    return marker;
}

export function detectOnlineStatus() {
  window.addEventListener('offline', function(event) {
    console.log("We are offline! :(");
  });
  
  window.addEventListener('online', function(event) {
    console.log("We are online! :)");
  });
}

export function setNetworkIndicator() {
  if(!navigator.onLine) {
    window.document.querySelector('.network-indicator').classList.add('offline');
  } else {
    window.document.querySelector('.network-indicator').classList.remove('offline');
  }
}

export function log(logPrefix, str, ...args) {
  console.log(logPrefix+"::"+str, ...args);
}

/**
 * Get a parameter by name from page URL.
 */
export function getParameterByName(name, url) {
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
