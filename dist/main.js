"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addMarkersToMap = exports.createRestaurantHTML = exports.fillRestaurantsHTML = exports.resetRestaurants = exports.updateRestaurants = exports.fillCuisinesHTML = exports.fetchCuisines = exports.fillNeighborhoodsHTML = exports.fetchNeighborhoods = void 0;

var _dbhelper = _interopRequireDefault(require("./dbhelper.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let restaurants, neighborhoods, cuisines;
var map;
var markers = [];
/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */

document.addEventListener('DOMContentLoaded', event => {
  fetchNeighborhoods();
  fetchCuisines();
});
/**
 * Fetch all neighborhoods and set their HTML.
 */

var fetchNeighborhoods = () => {
  _dbhelper.default.fetchNeighborhoods().then(neighborhoods => {
    self.neighborhoods = neighborhoods;
    fillNeighborhoodsHTML(neighborhoods);
  });
};
/**
 * Set neighborhoods HTML.
 */


exports.fetchNeighborhoods = fetchNeighborhoods;

var fillNeighborhoodsHTML = function fillNeighborhoodsHTML() {
  let neighborhoods = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.neighborhoods;
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
};
/**
 * Fetch all cuisines and set their HTML.
 */


exports.fillNeighborhoodsHTML = fillNeighborhoodsHTML;

var fetchCuisines = () => {
  _dbhelper.default.fetchCuisines().then(cuisines => {
    self.cuisines = cuisines;
    fillCuisinesHTML();
  }).catch(error => console.error(error));
};
/**
 * Set cuisines HTML.
 */


exports.fetchCuisines = fetchCuisines;

var fillCuisinesHTML = function fillCuisinesHTML() {
  let cuisines = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.cuisines;
  const select = document.getElementById('cuisines-select');
  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
};
/**
 * Initialize Google map, called from HTML.
 */


exports.fillCuisinesHTML = fillCuisinesHTML;

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
};
/**
 * Update page and map for current restaurants.
 */


var updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');
  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;
  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  _dbhelper.default.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood).then(restaurants => {
    resetRestaurants(restaurants);
    fillRestaurantsHTML();
  }).catch(error => console.error(error));
};
/**
 * Clear current restaurants, their HTML and remove their map markers.
 */


exports.updateRestaurants = updateRestaurants;

var resetRestaurants = restaurants => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = ''; // Remove all map markers

  if (self.markers) {
    self.markers.forEach(marker => marker.setMap(null));
  }

  self.markers = [];
  self.restaurants = restaurants;
};
/**
 * Create all restaurants HTML and add them to the webpage.
 */


exports.resetRestaurants = resetRestaurants;

var fillRestaurantsHTML = function fillRestaurantsHTML() {
  let restaurants = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurants;
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap();
};
/**
 * Create restaurant HTML.
 */


exports.fillRestaurantsHTML = fillRestaurantsHTML;

var createRestaurantHTML = restaurant => {
  const li = document.createElement('li');
  const src1 = _dbhelper.default.imageUrlForRestaurant(restaurant, "600") + ' 400w';
  const src2 = _dbhelper.default.imageUrlForRestaurant(restaurant, "600") + ' 600w';
  const src3 = _dbhelper.default.imageUrlForRestaurant(restaurant, "1600") + ' 1600w';
  const liInner = "\n  <figure>\n    <img srcset=\"".concat(src1, ", ").concat(src2, ", ").concat(src3, "\" class=\"restaurant-img\" src=\"").concat(src1, "\" alt=\"").concat(restaurant.name, " Restaurant\" tabindex=\"0\">\n    <figcaption>\n      <h1 tabindex=\"0\">").concat(restaurant.name, "</h1>\n      <p tabindex=\"0\">").concat(restaurant.neighborhood, "</p>\n      <p tabindex=\"0\">").concat(restaurant.address, "</p>\n      \n    </figcaption>\n  </figure>\n  <a href=\"").concat(_dbhelper.default.urlForRestaurant(restaurant), "\">View Details!</a>\n  ");
  li.innerHTML = liInner;
  return li;
};
/**
 * Add markers for current restaurants to the map.
 */


exports.createRestaurantHTML = createRestaurantHTML;

var addMarkersToMap = function addMarkersToMap() {
  let restaurants = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurants;
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = _dbhelper.default.mapMarkerForRestaurant(restaurant, self.map);

    google.maps.event.addListener(marker, 'click', () => {
      window.location.href = marker.url;
    });
    self.markers.push(marker);
  });
};

exports.addMarkersToMap = addMarkersToMap;