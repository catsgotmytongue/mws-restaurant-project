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

export async function supportsWebp() {
  if (!self.createImageBitmap) return false;
  
  const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
  const blob = await fetch(webpData).then(r => r.blob());
  return createImageBitmap(blob).then(() => true, () => false);
}

const forEach = (fn, arr) => {
  const l = arr.length
  for (let i = 0; i < l; i += 1) {
    fn(arr[i])
  }
}


const flatten = arr => {
  let out = []
  forEach(x => out = out.concat(x), arr)
  return out
}

// https://jsfiddle.net/foxbunny/4omknunb/4/?source=post_page---------------------------
export const h = (tag, attrs, ...children) => {
  const elm = document.createElement(tag)
  for (let key in attrs) {
    if (key.slice(0, 2) == 'on') {
      const evtName = key.slice(2)
      const cb = attrs[key]
      if (cb == null) continue  // we can use null or undefnied to suppress
      elm.addEventListener(evtName, cb)
    } else if (['disabled', 'autocomplete', 'selected', 'checked'].indexOf(key) > -1) {
      if (attrs[key]) {
        elm.setAttribute(key, key)
      }
    } else {
      if (attrs[key] == null) continue  // Don't set undefined or null attributes
      elm.setAttribute(key, attrs[key])
    }
  }
  if (children.length === 0) {
    return elm
  }
  forEach(child => {
    if (child instanceof Node) {
      elm.appendChild(child)
    } else {
      elm.appendChild(document.createTextNode(child))
    }
  }, flatten(children))
  return elm
}
