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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/restaurant_info.js");
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

/***/ "./src/restaurant_info.js":
/*!********************************!*\
  !*** ./src/restaurant_info.js ***!
  \********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _dbhelper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dbhelper */ \"./src/dbhelper.js\");\n\r\nlet restaurant;\r\nvar map;\r\n\r\n/**\r\n * Initialize Google map, called from HTML.\r\n */\r\nwindow.initMap = () => {\r\n  fetchRestaurantFromURL()\r\n  .then( restaurant => {\r\n    self.map = new google.maps.Map(document.getElementById('map'), {\r\n        zoom: 16,\r\n        center: restaurant.latlng,\r\n        scrollwheel: false\r\n      });\r\n      fillBreadcrumb();\r\n      _dbhelper__WEBPACK_IMPORTED_MODULE_0__[\"DBHelper\"].mapMarkerForRestaurant(self.restaurant, self.map);\r\n  })\r\n  .catch( err => console.error(err) );\r\n}\r\n\r\n/**\r\n * Get current restaurant from page URL.\r\n */\r\nvar fetchRestaurantFromURL = () => {\r\n  return new Promise((resolve, reject) => {\r\n    if (self.restaurant) { // restaurant already fetched!\r\n      resolve(self.restaurant);\r\n      return;\r\n    }\r\n\r\n    const id = getParameterByName('id');\r\n    if (!id) { // no id found in URL\r\n      reject('No restaurant id in URL');\r\n    } else {\r\n      return _dbhelper__WEBPACK_IMPORTED_MODULE_0__[\"DBHelper\"].fetchRestaurantById(id)\r\n      .then( restaurant => {\r\n        self.restaurant = restaurant;\r\n        if (!restaurant) {\r\n          console.error(error);\r\n          return;\r\n        }\r\n        \r\n        fillRestaurantHTML(restaurant);\r\n        return resolve(restaurant);\r\n    });\r\n  }\r\n  })\r\n}\r\n\r\n/**\r\n * Create restaurant HTML and add it to the webpage\r\n */\r\nvar fillRestaurantHTML = (restaurant = self.restaurant) => {\r\n  const name = document.getElementById('restaurant-name');\r\n  name.innerHTML = restaurant.name;\r\n\r\n  const address = document.getElementById('restaurant-address');\r\n  address.innerHTML = restaurant.address;\r\n\r\n  const image = document.getElementById('restaurant-img');\r\n  image.className = 'restaurant-img'\r\n  \r\n  \r\n  const src1 = _dbhelper__WEBPACK_IMPORTED_MODULE_0__[\"DBHelper\"].imageUrlForRestaurant(restaurant, \"600\")+' 600w';\r\n  const src2 = _dbhelper__WEBPACK_IMPORTED_MODULE_0__[\"DBHelper\"].imageUrlForRestaurant(restaurant, \"600\")+' 600w';\r\n  const src3 = _dbhelper__WEBPACK_IMPORTED_MODULE_0__[\"DBHelper\"].imageUrlForRestaurant(restaurant, \"1600\")+' 800w';\r\n  image.src = src1;\r\n  image.srcset = `${src1}, ${src2}, ${src3}`\r\n  image.alt = `${restaurant.name}`;\r\n  const cuisine = document.getElementById('restaurant-cuisine');\r\n  cuisine.innerHTML = restaurant.cuisine_type;\r\n\r\n  // fill operating hours\r\n  if (restaurant.operating_hours) {\r\n    fillRestaurantHoursHTML();\r\n  }\r\n  // fill reviews\r\n  fillReviewsHTML();\r\n}\r\n\r\n/**\r\n * Create restaurant operating hours HTML table and add it to the webpage.\r\n */\r\nvar fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {\r\n  const hours = document.getElementById('restaurant-hours');\r\n  for (let key in operatingHours) {\r\n    const row = document.createElement('tr');\r\n\r\n    const day = document.createElement('td');\r\n    day.innerHTML = key;\r\n    row.appendChild(day);\r\n\r\n    const time = document.createElement('td');\r\n    time.innerHTML = operatingHours[key];\r\n    row.appendChild(time);\r\n\r\n    hours.appendChild(row);\r\n  }\r\n}\r\n\r\n/**\r\n * Create all reviews HTML and add them to the webpage.\r\n */\r\nvar fillReviewsHTML = (reviews = self.restaurant.reviews) => {\r\n  const container = document.getElementById('reviews-container');\r\n  const title = document.createElement('h3');\r\n  title.innerHTML = 'Reviews';\r\n  title.tabIndex = 0;\r\n  container.appendChild(title);\r\n\r\n  if (!reviews) {\r\n    const noReviews = document.createElement('p');\r\n    noReviews.innerHTML = 'No reviews yet!';\r\n    container.appendChild(noReviews);\r\n    return;\r\n  }\r\n  const ul = document.getElementById('reviews-list');\r\n  reviews.forEach(review => {\r\n    ul.appendChild(createReviewHTML(review));\r\n  });\r\n  container.appendChild(ul);\r\n}\r\n\r\n/**\r\n * Create review HTML and add it to the webpage.\r\n */\r\nvar createReviewHTML = (review) => {\r\n  const li = document.createElement('li');\r\n  const name = document.createElement('p');\r\n  name.innerHTML = review.name;\r\n  name.tabIndex = 0;\r\n  li.appendChild(name);\r\n  li.tabIndex = 0;\r\n\r\n  const date = document.createElement('p');\r\n  date.innerHTML = review.date;\r\n  date.tabIndex = 0;\r\n  li.appendChild(date);\r\n\r\n  const rating = document.createElement('p');\r\n  rating.innerHTML = `Rating: ${review.rating}`;\r\n  rating.tabIndex = 0;\r\n  li.appendChild(rating);\r\n\r\n  const comments = document.createElement('p');\r\n  comments.innerHTML = review.comments;\r\n  comments.tabIndex = 0;\r\n\r\n  li.appendChild(comments);\r\n\r\n  return li;\r\n}\r\n\r\n/**\r\n * Add restaurant name to the breadcrumb navigation menu\r\n */\r\nvar fillBreadcrumb = (restaurant=self.restaurant) => {\r\n  const breadcrumb = document.getElementById('breadcrumb');\r\n  const li = document.createElement('li');\r\n  li.innerHTML = restaurant.name;\r\n  li.tabIndex = 0;\r\n  breadcrumb.appendChild(li);\r\n}\r\n\r\n/**\r\n * Get a parameter by name from page URL.\r\n */\r\nvar getParameterByName = (name, url) => {\r\n  if (!url)\r\n    url = window.location.href;\r\n  name = name.replace(/[\\[\\]]/g, '\\\\$&');\r\n  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),\r\n    results = regex.exec(url);\r\n  if (!results)\r\n    return null;\r\n  if (!results[2])\r\n    return '';\r\n  return decodeURIComponent(results[2].replace(/\\+/g, ' '));\r\n}\r\n\n\n//# sourceURL=webpack:///./src/restaurant_info.js?");

/***/ })

/******/ });