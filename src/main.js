import "./sass/restaurant-list.scss";

import { ApiHelper } from './apihelper';
import { UrlHelper } from './urlHelper';
import { mapMarkerForRestaurant, detectOnlineStatus, log, trueBool, setNetworkIndicator, h } from './commonFunctions';
const currentPage = window.location.href;
let updateInterval = 5000;
let logPrefix = '[main.js]';
let restaurants,
  neighborhoods,
  cuisines
var map
var markers = [];

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = async function() {
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
   setNetworkIndicator();
   requestAnimationFrame(await update);
 }

 let lastUpdateTime = 0;
async function update(currentTime) {

  // time our animation frame and animate only while online
  if(navigator.onLine && lastUpdateTime == 0 || currentTime-lastUpdateTime >= updateInterval) {
    log(logPrefix, "update: %o", currentTime);
    
    try {
      updateRestaurants(false);
      lastUpdateTime = currentTime;
    } catch(err) {
      log(logPrefix, 'Update Error: %o', err);
    }
  }

  // loop forever to keep html up to date (unless we leave the page)
  // if(currentPage === window.location.href) {
  //   requestAnimationFrame(await update);
  // }
}

 window.toggleFavorite = toggleFavorite;
 window.updateRestaurants = updateRestaurants;

 window.addEventListener('offline', function(event) {
  window.document.querySelector('.network-indicator').classList.add('offline');
});

window.addEventListener('online', function(event) {
  window.document.querySelector('.network-indicator').classList.remove('offline');

});
/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  fetchNeighborhoods();
  fetchCuisines();
  setNetworkIndicator();
});

/**
 * Fetch all neighborhoods and set their HTML.
 */
export var fetchNeighborhoods = () => {
  ApiHelper.fetchNeighborhoods()
  .then( neighborhoods => {
    self.neighborhoods = neighborhoods;
    fillNeighborhoodsHTML(neighborhoods);
  });
}

/**
 * Set neighborhoods HTML.
 */
export var fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    // const option = document.createElement('option');
    // option.innerHTML = neighborhood;
    // option.value = neighborhood;
    select.append( renderOption({value: neighborhood, text: neighborhood}) );
  });
}

/** @jsx h */
export const renderOption = option => {
  return (
    <option value={`${option.value}`}>{option.text}</option>
  );
}

/**
 * Fetch all cuisines and set their HTML.
 */
export var fetchCuisines = () => {
  ApiHelper.fetchCuisines()
  .then(cuisines => {
      self.cuisines = cuisines;
      fillCuisinesHTML();
  })
  .catch(error => console.error(error));
}

/**
 * Set cuisines HTML.
 */
export var fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    // const option = document.createElement('option');
    // option.innerHTML = cuisine;
    // option.value = cuisine;
    select.append( renderOption({value: cuisine, text: cuisine}) );
  });
}

/**
 * Update page and map for current restaurants.
 */
export function updateRestaurants(withReset = true) {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  ApiHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood)
  .then( async restaurants => {
    if(withReset) {
      resetRestaurants(restaurants);
      addMarkersToMap();
    }
    await fillRestaurantsHTML(restaurants);
  })
  .catch(error => console.error(error) )
}

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
export var resetRestaurants = (restaurants) => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  if (self.markers) {
    self.markers.forEach(marker => marker.setMap(null));
  }
  self.markers = [];
  self.restaurants = restaurants;
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
export var fillRestaurantsHTML = async (restaurants = self.restaurants) => {
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';
  restaurants.forEach(async restaurant => {
    ul.append( renderRestaurantCard(restaurant) );
  });
}

/**
 * Create restaurant HTML.
 */
// export var createRestaurantHTML = async (restaurant) => {
//   const li = document.createElement('li');

//   const src1 = await UrlHelper.imageUrlForRestaurant(restaurant, "600")+' 400w';
//   const src2 = await UrlHelper.imageUrlForRestaurant(restaurant, "600")+' 600w';
//   const src3 = await UrlHelper.imageUrlForRestaurant(restaurant, "1600")+' 1600w';
  
//   const liInner = `
//   <figure>
//     <img srcset="${src1}, ${src2}, ${src3}" class="restaurant-img" src="${src1}" alt="${restaurant.name} Restaurant" tabindex="0">
//     <figcaption>
//       <h1 tabindex="0">${restaurant.name} </h1>
//       <p tabindex="0">${restaurant.neighborhood}</p>
//       <p tabindex="0">${restaurant.address}</p>
      
//     </figcaption>
//     <a href="javascript:toggleFavorite(${restaurant.id}, ${restaurant.is_favorite})" class="make-favorite-link" aria-label="favorite ${restaurant.name}">
//       ${getFavoriteIcon(restaurant.id, restaurant.is_favorite)}
//     </a>
//   </figure>
//   <a href="${UrlHelper.urlForRestaurant(restaurant)}" class="details-btn" tabindex="0">View Details!</a>
//   `;
//   li.innerHTML = liInner;
//   return li;
// }

/** @jsx h **/
export const renderRestaurantCard = restaurant => {
  const src1 = UrlHelper.imageUrlForRestaurant(restaurant, "600")+' 400w';
  const src2 = UrlHelper.imageUrlForRestaurant(restaurant, "600")+' 600w';
  const src3 = UrlHelper.imageUrlForRestaurant(restaurant, "1600")+' 1600w';
  return (
  <li>
  <figure>
    <img srcset={`${src1}, ${src2}, ${src3}`} class="restaurant-img" src={`${src1}`} alt={`${restaurant.name} Restaurant`} tabindex="0"/>
    <figcaption>
      <h1 tabindex="0">{restaurant.name} </h1>
      <p tabindex="0">{restaurant.neighborhood}</p>
      <p tabindex="0">{restaurant.address}</p>
      
    </figcaption>
    {renderFavoriteLink(restaurant)}
  </figure>
  <a href={`${UrlHelper.urlForRestaurant(restaurant)}`} class="details-btn" tabindex="0">View Details!</a> 
  </li>
  );
};


/** @jsx h **/
export const renderFavoriteLink = (restaurant) => (
    <a href={`javascript:toggleFavorite(${restaurant.id})`} class="make-favorite-link" aria-label={`favorite ${restaurant.name}`}>
      {renderFavoriteIcon(restaurant)}
    </a>
);

/** @jsx h **/
export const renderFavoriteIcon = ({id, is_favorite}) => {
  let fav = trueBool(is_favorite);
  return (<i id={`fav-${id}`} class={`fa fa-heart ${fav?"favorite":""} favorite-icon`} is-favorite={`${fav}`}></i>)
}
/**
 * 
 * @param {number} restaurant 
 * @param {boolean} is_favorite 
 * @param {string} elementId 
 */
export function toggleFavorite(restaurantId) {
  let iconElement = document.getElementById(`fav-${restaurantId}`);
  let isFav = iconElement.getAttribute('is-favorite');
  ApiHelper.favoriteRestaurant(restaurantId, !trueBool(isFav))
  .then(restaurant => {
    iconElement.replaceWith( renderFavoriteIcon(restaurant) )
  });
}
/**
 * Add markers for current restaurants to the map.
 */
export var addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = mapMarkerForRestaurant(restaurant, self.map);
    google.maps.event.addListener(marker, 'click', () => {
      window.location.href = marker.url
    });
    self.markers.push(marker);
  });

}