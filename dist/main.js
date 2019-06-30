/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/dbhelper.js":
/*!*************************!*\
  !*** ./src/dbhelper.js ***!
  \*************************/
/*! exports provided: DBHelper */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"DBHelper\", function() { return DBHelper; });\n/**\r\n * Common database helper functions.\r\n */\r\nclass DBHelper {\r\n  static get DbName() {return 'restaurants';};\r\n  static get DbVersion() {return 9;};\r\n  /**\r\n   * Url of the api server\r\n   */\r\n  static get ApiUrl() {\r\n    return `http://localhost:8001/restaurants`;\r\n  }\r\n\r\n  static get IMAGE_ROOT() {\r\n     return \"/img/\" \r\n  };\r\n\r\n  /**\r\n   * Fetch all restaurants.\r\n   */\r\n  static fetchRestaurants() {\r\n    return fetch(DBHelper.ApiUrl)\r\n    .then( res => res.json())\r\n    .catch(err => console.log(\"Error in fetchRestaurants(): %o\", err));\r\n  }\r\n\r\n  /**\r\n   * Fetch a restaurant by its ID.\r\n   */\r\n  static fetchRestaurantById(id) {\r\n    // fetch all restaurants with proper error handling.\r\n    return DBHelper.fetchRestaurants()\r\n    .then(restaurants => restaurants.find(r => r.id == id))\r\n    .catch( err=> console.log('Restaurant does not exist') );\r\n  }\r\n\r\n  /**\r\n   * Fetch restaurants by a cuisine type with proper error handling.\r\n   */\r\n  static fetchRestaurantByCuisine(cuisine) {\r\n    // Fetch all restaurants  with proper error handling\r\n    return DBHelper.fetchRestaurants()\r\n    .then(restaurants => restaurants.filter(r => r.cuisine_type == cuisine))\r\n    .catch(err => null);\r\n  }\r\n\r\n  /**\r\n   * Fetch restaurants by a neighborhood with proper error handling.\r\n   */\r\n  static fetchRestaurantByNeighborhood(neighborhood) {\r\n    // Fetch all restaurants\r\n    return DBHelper.fetchRestaurants()\r\n    .then(restaurants => restaurants.filter(r => r.neighborhood == neighborhood))\r\n    .catch(err => null);\r\n  }\r\n\r\n  /**\r\n   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.\r\n   */\r\n  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood) {\r\n    return DBHelper.fetchRestaurants()\r\n    .then(restaurants => {\r\n        let results = restaurants;\r\n        if (cuisine != 'all') { // filter by cuisine\r\n          results = results.filter(r => r.cuisine_type == cuisine);\r\n        }\r\n        if (neighborhood != 'all') { // filter by neighborhood\r\n          results = results.filter(r => r.neighborhood == neighborhood);\r\n        }\r\n\r\n        return results;\r\n    })\r\n    .catch(err => null);\r\n  }\r\n\r\n  /**\r\n   * Fetch all neighborhoods with proper error handling.\r\n   */\r\n  static fetchNeighborhoods() {\r\n    return DBHelper.fetchRestaurants()\r\n    .then(restaurants => {\r\n      return restaurants.map((v, i) => restaurants[i].neighborhood)\r\n                          .filter((v, i, neighborhoods) => neighborhoods.indexOf(v) == i); \r\n                        } )\r\n    .catch(err => null);\r\n  }\r\n\r\n  /**\r\n   * Fetch all cuisines with proper error handling.\r\n   */\r\n  static fetchCuisines() {\r\n    return DBHelper.fetchRestaurants()\r\n    .then(restaurants => restaurants\r\n                          .map((v, i) => restaurants[i].cuisine_type)\r\n                          .filter((v, i, cuisines) => cuisines.indexOf(v) == i))\r\n    .catch(err => null);\r\n  }\r\n\r\n  /**\r\n   * Restaurant page URL.\r\n   */\r\n  static urlForRestaurant(restaurant) {\r\n    return (`./restaurant.html?id=${restaurant.id}`);\r\n  }\r\n\r\n  /**\r\n   * Restaurant image URL.\r\n   */\r\n  static imageUrlForRestaurant(restaurant, suffix = \"\") {\r\n    var photoSplit = restaurant.photograph.includes('.') ? restaurant.photograph.split('.') : [restaurant.photograph, 'jpg'];\r\n    return (`${DBHelper.IMAGE_ROOT}${photoSplit[0]}${suffix ? '-'+suffix: ''}.${photoSplit[1]}`);\r\n  }\r\n\r\n  /**\r\n   * Map marker for a restaurant.\r\n   */\r\n  static mapMarkerForRestaurant(restaurant, map) {\r\n    const marker = new google.maps.Marker({\r\n      position: restaurant.latlng,\r\n      title: restaurant.name,\r\n      url: DBHelper.urlForRestaurant(restaurant),\r\n      map: map,\r\n      animation: google.maps.Animation.DROP}\r\n    );\r\n    return marker;\r\n  }\r\n\r\n}\r\n\n\n//# sourceURL=webpack:///./src/dbhelper.js?");

/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/*! exports provided: fetchNeighborhoods, fillNeighborhoodsHTML, fetchCuisines, fillCuisinesHTML, updateRestaurants, resetRestaurants, fillRestaurantsHTML, createRestaurantHTML, addMarkersToMap */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"fetchNeighborhoods\", function() { return fetchNeighborhoods; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"fillNeighborhoodsHTML\", function() { return fillNeighborhoodsHTML; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"fetchCuisines\", function() { return fetchCuisines; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"fillCuisinesHTML\", function() { return fillCuisinesHTML; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"updateRestaurants\", function() { return updateRestaurants; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"resetRestaurants\", function() { return resetRestaurants; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"fillRestaurantsHTML\", function() { return fillRestaurantsHTML; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"createRestaurantHTML\", function() { return createRestaurantHTML; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"addMarkersToMap\", function() { return addMarkersToMap; });\n/* harmony import */ var _dbhelper_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dbhelper.js */ \"./src/dbhelper.js\");\n\r\n\r\nlet restaurants,\r\n  neighborhoods,\r\n  cuisines\r\nvar map\r\nvar markers = []\r\n/**\r\n * Initialize Google map, called from HTML.\r\n */\r\nwindow.initMap = () => {\r\n   let loc = {\r\n     lat: 40.722216,\r\n     lng: -73.987501\r\n   };\r\n   self.map = new google.maps.Map(document.getElementById('map'), {\r\n     zoom: 12,\r\n     center: loc,\r\n     scrollwheel: false\r\n   });\r\n   updateRestaurants();\r\n }\r\n\r\n window.updateRestaurants = updateRestaurants;\r\n/**\r\n * Fetch neighborhoods and cuisines as soon as the page is loaded.\r\n */\r\ndocument.addEventListener('DOMContentLoaded', (event) => {\r\n  fetchNeighborhoods();\r\n  fetchCuisines();\r\n});\r\n\r\n/**\r\n * Fetch all neighborhoods and set their HTML.\r\n */\r\nvar fetchNeighborhoods = () => {\r\n  _dbhelper_js__WEBPACK_IMPORTED_MODULE_0__[\"DBHelper\"].fetchNeighborhoods()\r\n  .then( neighborhoods => {\r\n    self.neighborhoods = neighborhoods;\r\n    fillNeighborhoodsHTML(neighborhoods);\r\n  });\r\n}\r\n\r\n/**\r\n * Set neighborhoods HTML.\r\n */\r\nvar fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {\r\n  const select = document.getElementById('neighborhoods-select');\r\n  neighborhoods.forEach(neighborhood => {\r\n    const option = document.createElement('option');\r\n    option.innerHTML = neighborhood;\r\n    option.value = neighborhood;\r\n    select.append(option);\r\n  });\r\n}\r\n\r\n/**\r\n * Fetch all cuisines and set their HTML.\r\n */\r\nvar fetchCuisines = () => {\r\n  _dbhelper_js__WEBPACK_IMPORTED_MODULE_0__[\"DBHelper\"].fetchCuisines()\r\n  .then(cuisines => {\r\n      self.cuisines = cuisines;\r\n      fillCuisinesHTML();\r\n  })\r\n  .catch(error => console.error(error));\r\n}\r\n\r\n/**\r\n * Set cuisines HTML.\r\n */\r\nvar fillCuisinesHTML = (cuisines = self.cuisines) => {\r\n  const select = document.getElementById('cuisines-select');\r\n\r\n  cuisines.forEach(cuisine => {\r\n    const option = document.createElement('option');\r\n    option.innerHTML = cuisine;\r\n    option.value = cuisine;\r\n    select.append(option);\r\n  });\r\n}\r\n\r\n/**\r\n * Update page and map for current restaurants.\r\n */\r\nfunction updateRestaurants() {\r\n  const cSelect = document.getElementById('cuisines-select');\r\n  const nSelect = document.getElementById('neighborhoods-select');\r\n\r\n  const cIndex = cSelect.selectedIndex;\r\n  const nIndex = nSelect.selectedIndex;\r\n\r\n  const cuisine = cSelect[cIndex].value;\r\n  const neighborhood = nSelect[nIndex].value;\r\n\r\n  _dbhelper_js__WEBPACK_IMPORTED_MODULE_0__[\"DBHelper\"].fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood)\r\n  .then(restaurants => {\r\n    resetRestaurants(restaurants);\r\n    fillRestaurantsHTML();\r\n  })\r\n  .catch(error => console.error(error) )\r\n}\r\n\r\n/**\r\n * Clear current restaurants, their HTML and remove their map markers.\r\n */\r\nvar resetRestaurants = (restaurants) => {\r\n  // Remove all restaurants\r\n  self.restaurants = [];\r\n  const ul = document.getElementById('restaurants-list');\r\n  ul.innerHTML = '';\r\n\r\n  // Remove all map markers\r\n  if (self.markers) {\r\n    self.markers.forEach(marker => marker.setMap(null));\r\n  }\r\n  self.markers = [];\r\n  self.restaurants = restaurants;\r\n}\r\n\r\n/**\r\n * Create all restaurants HTML and add them to the webpage.\r\n */\r\nvar fillRestaurantsHTML = (restaurants = self.restaurants) => {\r\n  const ul = document.getElementById('restaurants-list');\r\n  restaurants.forEach(restaurant => {\r\n    ul.append(createRestaurantHTML(restaurant));\r\n  });\r\n  addMarkersToMap();\r\n}\r\n\r\n/**\r\n * Create restaurant HTML.\r\n */\r\nvar createRestaurantHTML = (restaurant) => {\r\n  const li = document.createElement('li');\r\n\r\n  const src1 = _dbhelper_js__WEBPACK_IMPORTED_MODULE_0__[\"DBHelper\"].imageUrlForRestaurant(restaurant, \"600\")+' 400w';\r\n  const src2 = _dbhelper_js__WEBPACK_IMPORTED_MODULE_0__[\"DBHelper\"].imageUrlForRestaurant(restaurant, \"600\")+' 600w';\r\n  const src3 = _dbhelper_js__WEBPACK_IMPORTED_MODULE_0__[\"DBHelper\"].imageUrlForRestaurant(restaurant, \"1600\")+' 1600w';\r\n  \r\n  const liInner = `\r\n  <figure>\r\n    <img srcset=\"${src1}, ${src2}, ${src3}\" class=\"restaurant-img\" src=\"${src1}\" alt=\"${restaurant.name} Restaurant\" tabindex=\"0\">\r\n    <figcaption>\r\n      <h1 tabindex=\"0\">${restaurant.name}</h1>\r\n      <p tabindex=\"0\">${restaurant.neighborhood}</p>\r\n      <p tabindex=\"0\">${restaurant.address}</p>\r\n      \r\n    </figcaption>\r\n  </figure>\r\n  <a href=\"${_dbhelper_js__WEBPACK_IMPORTED_MODULE_0__[\"DBHelper\"].urlForRestaurant(restaurant)}\">View Details!</a>\r\n  `;\r\n  li.innerHTML = liInner;\r\n  return li;\r\n}\r\n\r\n/**\r\n * Add markers for current restaurants to the map.\r\n */\r\nvar addMarkersToMap = (restaurants = self.restaurants) => {\r\n  restaurants.forEach(restaurant => {\r\n    // Add marker to the map\r\n    const marker = _dbhelper_js__WEBPACK_IMPORTED_MODULE_0__[\"DBHelper\"].mapMarkerForRestaurant(restaurant, self.map);\r\n    google.maps.event.addListener(marker, 'click', () => {\r\n      window.location.href = marker.url\r\n    });\r\n    self.markers.push(marker);\r\n  });\r\n\r\n}\r\n\n\n//# sourceURL=webpack:///./src/main.js?");

/***/ })

/******/ });