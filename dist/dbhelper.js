"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es6.regexp.split");

var _idb = require("idb");

/**
 * Common database helper functions.
 */
class DBHelper {
  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    return "http://localhost:8001/restaurants";
  }

  static get IMAGE_ROOT() {
    return "/img/";
  }

  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants() {
    return fetch(DBHelper.DATABASE_URL).then(res => res.json()).catch(err => console.log("Error in fetchRestaurants(): %o", err));
  }
  /**
   * Fetch a restaurant by its ID.
   */


  static fetchRestaurantById(id) {
    // fetch all restaurants with proper error handling.
    return DBHelper.fetchRestaurants().then(restaurants => restaurants.find(r => r.id == id)).catch(err => console.log('Restaurant does not exist'));
  }
  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */


  static fetchRestaurantByCuisine(cuisine) {
    // Fetch all restaurants  with proper error handling
    return DBHelper.fetchRestaurants().then(restaurants => restaurants.filter(r => r.cuisine_type == cuisine)).catch(err => null);
  }
  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */


  static fetchRestaurantByNeighborhood(neighborhood) {
    // Fetch all restaurants
    return DBHelper.fetchRestaurants().then(restaurants => restaurants.filter(r => r.neighborhood == neighborhood)).catch(err => null);
  }
  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */


  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood) {
    return DBHelper.fetchRestaurants().then(restaurants => {
      let results = restaurants;

      if (cuisine != 'all') {
        // filter by cuisine
        results = results.filter(r => r.cuisine_type == cuisine);
      }

      if (neighborhood != 'all') {
        // filter by neighborhood
        results = results.filter(r => r.neighborhood == neighborhood);
      }

      return results;
    }).catch(err => null);
  }
  /**
   * Fetch all neighborhoods with proper error handling.
   */


  static fetchNeighborhoods() {
    return DBHelper.fetchRestaurants().then(restaurants => {
      return restaurants.map((v, i) => restaurants[i].neighborhood).filter((v, i, neighborhoods) => neighborhoods.indexOf(v) == i);
    }).catch(err => null);
  }
  /**
   * Fetch all cuisines with proper error handling.
   */


  static fetchCuisines() {
    return DBHelper.fetchRestaurants().then(restaurants => restaurants.map((v, i) => restaurants[i].cuisine_type).filter((v, i, cuisines) => cuisines.indexOf(v) == i)).catch(err => null);
  }
  /**
   * Restaurant page URL.
   */


  static urlForRestaurant(restaurant) {
    return "./restaurant.html?id=".concat(restaurant.id);
  }
  /**
   * Restaurant image URL.
   */


  static imageUrlForRestaurant(restaurant) {
    let suffix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
    var photoSplit = restaurant.photograph.includes('.') ? restaurant.photograph.split('.') : [restaurant.photograph, 'jpg'];
    return "".concat(DBHelper.IMAGE_ROOT).concat(photoSplit[0]).concat(suffix ? '-' + suffix : '', ".").concat(photoSplit[1]);
  }
  /**
   * Map marker for a restaurant.
   */


  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP
    });
    return marker;
  }

}

exports.default = DBHelper;