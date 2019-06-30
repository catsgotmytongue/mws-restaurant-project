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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/dbhelper.js");
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

/***/ })

/******/ });