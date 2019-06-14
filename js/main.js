import { DBHelper } from './dbhelper.js';

let restaurants,
  neighborhoods,
  cuisines
var map
var markers = []

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  fetchNeighborhoods();
  fetchCuisines();
});

/**
 * Fetch all neighborhoods and set their HTML.
 */
export var fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods()
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
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
}

/**
 * Fetch all cuisines and set their HTML.
 */
export var fetchCuisines = () => {
  DBHelper.fetchCuisines()
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
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
}

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
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
}

/**
 * Update page and map for current restaurants.
 */
export var updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood)
  .then(restaurants => {
    resetRestaurants(restaurants);
    fillRestaurantsHTML();
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
export var fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap();
}

/**
 * Create restaurant HTML.
 */
export var createRestaurantHTML = (restaurant) => {
  const li = document.createElement('li');

  const src1 = DBHelper.imageUrlForRestaurant(restaurant, "600")+' 400w';
  const src2 = DBHelper.imageUrlForRestaurant(restaurant, "600")+' 600w';
  const src3 = DBHelper.imageUrlForRestaurant(restaurant, "1600")+' 1600w';
  
  const liInner = `
  <figure>
    <img srcset="${src1}, ${src2}, ${src3}" class="restaurant-img" src="${src1}" alt="${restaurant.name} Restaurant" tabindex="0">
    <figcaption>
      <h1 tabindex="0">${restaurant.name}</h1>
      <p tabindex="0">${restaurant.neighborhood}</p>
      <p tabindex="0">${restaurant.address}</p>
      
    </figcaption>
  </figure>
  <a href="${DBHelper.urlForRestaurant(restaurant)}">View Details!</a>
  `;
  li.innerHTML = liInner;
  return li;
}

/**
 * Add markers for current restaurants to the map.
 */
export var addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
    google.maps.event.addListener(marker, 'click', () => {
      window.location.href = marker.url
    });
    self.markers.push(marker);
  });

}
