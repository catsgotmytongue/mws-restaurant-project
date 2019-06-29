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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./js/dbhelper.js":
/*!************************!*\
  !*** ./js/dbhelper.js ***!
  \************************/
/*! exports provided: DBHelper */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"DBHelper\", function() { return DBHelper; });\n/**\r\n * Common database helper functions.\r\n */\r\nclass DBHelper {\r\n\r\n  /**\r\n   * Database URL.\r\n   * Change this to restaurants.json file location on your server.\r\n   */\r\n  static get DATABASE_URL() {\r\n    return `http://localhost:8001/restaurants`;\r\n  }\r\n\r\n  static get IMAGE_ROOT() {\r\n     return \"/img/\" \r\n  };\r\n\r\n  /**\r\n   * Fetch all restaurants.\r\n   */\r\n  static fetchRestaurants() {\r\n    return fetch(DBHelper.DATABASE_URL)\r\n    .then( res => res.json() )\r\n    .catch(err => console.log(\"Error in fetchRestaurants(): %o\", err));\r\n  }\r\n\r\n  /**\r\n   * Fetch a restaurant by its ID.\r\n   */\r\n  static fetchRestaurantById(id) {\r\n    // fetch all restaurants with proper error handling.\r\n    return DBHelper.fetchRestaurants()\r\n    .then(restaurants => restaurants.find(r => r.id == id))\r\n    .catch( err=> console.log('Restaurant does not exist') );\r\n  }\r\n\r\n  /**\r\n   * Fetch restaurants by a cuisine type with proper error handling.\r\n   */\r\n  static fetchRestaurantByCuisine(cuisine) {\r\n    // Fetch all restaurants  with proper error handling\r\n    return DBHelper.fetchRestaurants()\r\n    .then(restaurants => restaurants.filter(r => r.cuisine_type == cuisine))\r\n    .catch(err => null);\r\n  }\r\n\r\n  /**\r\n   * Fetch restaurants by a neighborhood with proper error handling.\r\n   */\r\n  static fetchRestaurantByNeighborhood(neighborhood) {\r\n    // Fetch all restaurants\r\n    return DBHelper.fetchRestaurants()\r\n    .then(restaurants => restaurants.filter(r => r.neighborhood == neighborhood))\r\n    .catch(err => null);\r\n  }\r\n\r\n  /**\r\n   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.\r\n   */\r\n  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood) {\r\n    return DBHelper.fetchRestaurants()\r\n    .then(restaurants => {\r\n        let results = restaurants;\r\n        if (cuisine != 'all') { // filter by cuisine\r\n          results = results.filter(r => r.cuisine_type == cuisine);\r\n        }\r\n        if (neighborhood != 'all') { // filter by neighborhood\r\n          results = results.filter(r => r.neighborhood == neighborhood);\r\n        }\r\n\r\n        return results;\r\n    })\r\n    .catch(err => null);\r\n  }\r\n\r\n  /**\r\n   * Fetch all neighborhoods with proper error handling.\r\n   */\r\n  static fetchNeighborhoods() {\r\n    return DBHelper.fetchRestaurants()\r\n    .then(restaurants => {\r\n      return restaurants.map((v, i) => restaurants[i].neighborhood)\r\n                          .filter((v, i, neighborhoods) => neighborhoods.indexOf(v) == i); \r\n                        } )\r\n    .catch(err => null);\r\n  }\r\n\r\n  /**\r\n   * Fetch all cuisines with proper error handling.\r\n   */\r\n  static fetchCuisines() {\r\n    return DBHelper.fetchRestaurants()\r\n    .then(restaurants => restaurants\r\n                          .map((v, i) => restaurants[i].cuisine_type)\r\n                          .filter((v, i, cuisines) => cuisines.indexOf(v) == i))\r\n    .catch(err => null);\r\n  }\r\n\r\n  /**\r\n   * Restaurant page URL.\r\n   */\r\n  static urlForRestaurant(restaurant) {\r\n    return (`./restaurant.html?id=${restaurant.id}`);\r\n  }\r\n\r\n  /**\r\n   * Restaurant image URL.\r\n   */\r\n  static imageUrlForRestaurant(restaurant, suffix = \"\") {\r\n    var photoSplit = restaurant.photograph.includes('.') ? restaurant.photograph.split('.') : [restaurant.photograph, 'jpg'];\r\n    return (`${DBHelper.IMAGE_ROOT}${photoSplit[0]}${suffix ? '-'+suffix: ''}.${photoSplit[1]}`);\r\n  }\r\n\r\n  /**\r\n   * Map marker for a restaurant.\r\n   */\r\n  static mapMarkerForRestaurant(restaurant, map) {\r\n    const marker = new google.maps.Marker({\r\n      position: restaurant.latlng,\r\n      title: restaurant.name,\r\n      url: DBHelper.urlForRestaurant(restaurant),\r\n      map: map,\r\n      animation: google.maps.Animation.DROP}\r\n    );\r\n    return marker;\r\n  }\r\n\r\n}\r\n\n\n//# sourceURL=webpack:///./js/dbhelper.js?");

/***/ }),

/***/ "./js/main.js":
/*!********************!*\
  !*** ./js/main.js ***!
  \********************/
/*! exports provided: fetchNeighborhoods, fillNeighborhoodsHTML, fetchCuisines, fillCuisinesHTML, updateRestaurants, resetRestaurants, fillRestaurantsHTML, createRestaurantHTML, addMarkersToMap */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"fetchNeighborhoods\", function() { return fetchNeighborhoods; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"fillNeighborhoodsHTML\", function() { return fillNeighborhoodsHTML; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"fetchCuisines\", function() { return fetchCuisines; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"fillCuisinesHTML\", function() { return fillCuisinesHTML; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"updateRestaurants\", function() { return updateRestaurants; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"resetRestaurants\", function() { return resetRestaurants; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"fillRestaurantsHTML\", function() { return fillRestaurantsHTML; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"createRestaurantHTML\", function() { return createRestaurantHTML; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"addMarkersToMap\", function() { return addMarkersToMap; });\n/* harmony import */ var _dbhelper_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dbhelper.js */ \"./js/dbhelper.js\");\n\r\n\r\nlet restaurants,\r\n  neighborhoods,\r\n  cuisines\r\nvar map\r\nvar markers = []\r\n\r\n/**\r\n * Fetch neighborhoods and cuisines as soon as the page is loaded.\r\n */\r\ndocument.addEventListener('DOMContentLoaded', (event) => {\r\n  fetchNeighborhoods();\r\n  fetchCuisines();\r\n});\r\n\r\n/**\r\n * Fetch all neighborhoods and set their HTML.\r\n */\r\nvar fetchNeighborhoods = () => {\r\n  _dbhelper_js__WEBPACK_IMPORTED_MODULE_0__[\"DBHelper\"].fetchNeighborhoods()\r\n  .then( neighborhoods => {\r\n    self.neighborhoods = neighborhoods;\r\n    fillNeighborhoodsHTML(neighborhoods);\r\n  });\r\n}\r\n\r\n/**\r\n * Set neighborhoods HTML.\r\n */\r\nvar fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {\r\n  const select = document.getElementById('neighborhoods-select');\r\n  neighborhoods.forEach(neighborhood => {\r\n    const option = document.createElement('option');\r\n    option.innerHTML = neighborhood;\r\n    option.value = neighborhood;\r\n    select.append(option);\r\n  });\r\n}\r\n\r\n/**\r\n * Fetch all cuisines and set their HTML.\r\n */\r\nvar fetchCuisines = () => {\r\n  _dbhelper_js__WEBPACK_IMPORTED_MODULE_0__[\"DBHelper\"].fetchCuisines()\r\n  .then(cuisines => {\r\n      self.cuisines = cuisines;\r\n      fillCuisinesHTML();\r\n  })\r\n  .catch(error => console.error(error));\r\n}\r\n\r\n/**\r\n * Set cuisines HTML.\r\n */\r\nvar fillCuisinesHTML = (cuisines = self.cuisines) => {\r\n  const select = document.getElementById('cuisines-select');\r\n\r\n  cuisines.forEach(cuisine => {\r\n    const option = document.createElement('option');\r\n    option.innerHTML = cuisine;\r\n    option.value = cuisine;\r\n    select.append(option);\r\n  });\r\n}\r\n\r\n/**\r\n * Update page and map for current restaurants.\r\n */\r\nvar updateRestaurants = () => {\r\n  const cSelect = document.getElementById('cuisines-select');\r\n  const nSelect = document.getElementById('neighborhoods-select');\r\n\r\n  const cIndex = cSelect.selectedIndex;\r\n  const nIndex = nSelect.selectedIndex;\r\n\r\n  const cuisine = cSelect[cIndex].value;\r\n  const neighborhood = nSelect[nIndex].value;\r\n\r\n  _dbhelper_js__WEBPACK_IMPORTED_MODULE_0__[\"DBHelper\"].fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood)\r\n  .then(restaurants => {\r\n    resetRestaurants(restaurants);\r\n    fillRestaurantsHTML();\r\n  })\r\n  .catch(error => console.error(error) )\r\n}\r\n\r\n/**\r\n * Clear current restaurants, their HTML and remove their map markers.\r\n */\r\nvar resetRestaurants = (restaurants) => {\r\n  // Remove all restaurants\r\n  self.restaurants = [];\r\n  const ul = document.getElementById('restaurants-list');\r\n  ul.innerHTML = '';\r\n\r\n  // Remove all map markers\r\n  if (self.markers) {\r\n    self.markers.forEach(marker => marker.setMap(null));\r\n  }\r\n  self.markers = [];\r\n  self.restaurants = restaurants;\r\n}\r\n\r\n/**\r\n * Create all restaurants HTML and add them to the webpage.\r\n */\r\nvar fillRestaurantsHTML = (restaurants = self.restaurants) => {\r\n  const ul = document.getElementById('restaurants-list');\r\n  restaurants.forEach(restaurant => {\r\n    ul.append(createRestaurantHTML(restaurant));\r\n  });\r\n  addMarkersToMap();\r\n}\r\n\r\n/**\r\n * Create restaurant HTML.\r\n */\r\nvar createRestaurantHTML = (restaurant) => {\r\n  const li = document.createElement('li');\r\n\r\n  const src1 = _dbhelper_js__WEBPACK_IMPORTED_MODULE_0__[\"DBHelper\"].imageUrlForRestaurant(restaurant, \"600\")+' 400w';\r\n  const src2 = _dbhelper_js__WEBPACK_IMPORTED_MODULE_0__[\"DBHelper\"].imageUrlForRestaurant(restaurant, \"600\")+' 600w';\r\n  const src3 = _dbhelper_js__WEBPACK_IMPORTED_MODULE_0__[\"DBHelper\"].imageUrlForRestaurant(restaurant, \"1600\")+' 1600w';\r\n  \r\n  const liInner = `\r\n  <figure>\r\n    <img srcset=\"${src1}, ${src2}, ${src3}\" class=\"restaurant-img\" src=\"${src1}\" alt=\"${restaurant.name} Restaurant\" tabindex=\"0\">\r\n    <figcaption>\r\n      <h1 tabindex=\"0\">${restaurant.name}</h1>\r\n      <p tabindex=\"0\">${restaurant.neighborhood}</p>\r\n      <p tabindex=\"0\">${restaurant.address}</p>\r\n      \r\n    </figcaption>\r\n  </figure>\r\n  <a href=\"${_dbhelper_js__WEBPACK_IMPORTED_MODULE_0__[\"DBHelper\"].urlForRestaurant(restaurant)}\">View Details!</a>\r\n  `;\r\n  li.innerHTML = liInner;\r\n  return li;\r\n}\r\n\r\n/**\r\n * Add markers for current restaurants to the map.\r\n */\r\nvar addMarkersToMap = (restaurants = self.restaurants) => {\r\n  restaurants.forEach(restaurant => {\r\n    // Add marker to the map\r\n    const marker = _dbhelper_js__WEBPACK_IMPORTED_MODULE_0__[\"DBHelper\"].mapMarkerForRestaurant(restaurant, self.map);\r\n    google.maps.event.addListener(marker, 'click', () => {\r\n      window.location.href = marker.url\r\n    });\r\n    self.markers.push(marker);\r\n  });\r\n\r\n}\r\n\n\n//# sourceURL=webpack:///./js/main.js?");

/***/ }),

/***/ "./node_modules/idb/build/esm/chunk.js":
/*!*********************************************!*\
  !*** ./node_modules/idb/build/esm/chunk.js ***!
  \*********************************************/
/*! exports provided: a, b, c, d, e */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"a\", function() { return wrap; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"b\", function() { return addTraps; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"c\", function() { return instanceOfAny; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"d\", function() { return reverseTransformCache; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"e\", function() { return unwrap; });\nconst instanceOfAny = (object, constructors) => constructors.some(c => object instanceof c);\n\nlet idbProxyableTypes;\r\nlet cursorAdvanceMethods;\r\n// This is a function to prevent it throwing up in node environments.\r\nfunction getIdbProxyableTypes() {\r\n    return idbProxyableTypes ||\r\n        (idbProxyableTypes = [IDBDatabase, IDBObjectStore, IDBIndex, IDBCursor, IDBTransaction]);\r\n}\r\n// This is a function to prevent it throwing up in node environments.\r\nfunction getCursorAdvanceMethods() {\r\n    return cursorAdvanceMethods || (cursorAdvanceMethods = [\r\n        IDBCursor.prototype.advance,\r\n        IDBCursor.prototype.continue,\r\n        IDBCursor.prototype.continuePrimaryKey,\r\n    ]);\r\n}\r\nconst cursorRequestMap = new WeakMap();\r\nconst transactionDoneMap = new WeakMap();\r\nconst transactionStoreNamesMap = new WeakMap();\r\nconst transformCache = new WeakMap();\r\nconst reverseTransformCache = new WeakMap();\r\nfunction promisifyRequest(request) {\r\n    const promise = new Promise((resolve, reject) => {\r\n        const unlisten = () => {\r\n            request.removeEventListener('success', success);\r\n            request.removeEventListener('error', error);\r\n        };\r\n        const success = () => {\r\n            resolve(wrap(request.result));\r\n            unlisten();\r\n        };\r\n        const error = () => {\r\n            reject(request.error);\r\n            unlisten();\r\n        };\r\n        request.addEventListener('success', success);\r\n        request.addEventListener('error', error);\r\n    });\r\n    promise.then((value) => {\r\n        // Since cursoring reuses the IDBRequest (*sigh*), we cache it for later retrieval\r\n        // (see wrapFunction).\r\n        if (value instanceof IDBCursor) {\r\n            cursorRequestMap.set(value, request);\r\n        }\r\n    });\r\n    // This mapping exists in reverseTransformCache but doesn't doesn't exist in transformCache. This\r\n    // is because we create many promises from a single IDBRequest.\r\n    reverseTransformCache.set(promise, request);\r\n    return promise;\r\n}\r\nfunction cacheDonePromiseForTransaction(tx) {\r\n    // Early bail if we've already created a done promise for this transaction.\r\n    if (transactionDoneMap.has(tx))\r\n        return;\r\n    const done = new Promise((resolve, reject) => {\r\n        const unlisten = () => {\r\n            tx.removeEventListener('complete', complete);\r\n            tx.removeEventListener('error', error);\r\n            tx.removeEventListener('abort', error);\r\n        };\r\n        const complete = () => {\r\n            resolve();\r\n            unlisten();\r\n        };\r\n        const error = () => {\r\n            reject(tx.error);\r\n            unlisten();\r\n        };\r\n        tx.addEventListener('complete', complete);\r\n        tx.addEventListener('error', error);\r\n        tx.addEventListener('abort', error);\r\n    });\r\n    // Cache it for later retrieval.\r\n    transactionDoneMap.set(tx, done);\r\n}\r\nlet idbProxyTraps = {\r\n    get(target, prop, receiver) {\r\n        if (target instanceof IDBTransaction) {\r\n            // Special handling for transaction.done.\r\n            if (prop === 'done')\r\n                return transactionDoneMap.get(target);\r\n            // Polyfill for objectStoreNames because of Edge.\r\n            if (prop === 'objectStoreNames') {\r\n                return target.objectStoreNames || transactionStoreNamesMap.get(target);\r\n            }\r\n            // Make tx.store return the only store in the transaction, or undefined if there are many.\r\n            if (prop === 'store') {\r\n                return receiver.objectStoreNames[1] ?\r\n                    undefined : receiver.objectStore(receiver.objectStoreNames[0]);\r\n            }\r\n        }\r\n        // Else transform whatever we get back.\r\n        return wrap(target[prop]);\r\n    },\r\n    has(target, prop) {\r\n        if (target instanceof IDBTransaction && (prop === 'done' || prop === 'store'))\r\n            return true;\r\n        return prop in target;\r\n    },\r\n};\r\nfunction addTraps(callback) {\r\n    idbProxyTraps = callback(idbProxyTraps);\r\n}\r\nfunction wrapFunction(func) {\r\n    // Due to expected object equality (which is enforced by the caching in `wrap`), we\r\n    // only create one new func per func.\r\n    // Edge doesn't support objectStoreNames (booo), so we polyfill it here.\r\n    if (func === IDBDatabase.prototype.transaction &&\r\n        !('objectStoreNames' in IDBTransaction.prototype)) {\r\n        return function (storeNames, ...args) {\r\n            const tx = func.call(unwrap(this), storeNames, ...args);\r\n            transactionStoreNamesMap.set(tx, storeNames.sort ? storeNames.sort() : [storeNames]);\r\n            return wrap(tx);\r\n        };\r\n    }\r\n    // Cursor methods are special, as the behaviour is a little more different to standard IDB. In\r\n    // IDB, you advance the cursor and wait for a new 'success' on the IDBRequest that gave you the\r\n    // cursor. It's kinda like a promise that can resolve with many values. That doesn't make sense\r\n    // with real promises, so each advance methods returns a new promise for the cursor object, or\r\n    // undefined if the end of the cursor has been reached.\r\n    if (getCursorAdvanceMethods().includes(func)) {\r\n        return function (...args) {\r\n            // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use\r\n            // the original object.\r\n            func.apply(unwrap(this), args);\r\n            return wrap(cursorRequestMap.get(this));\r\n        };\r\n    }\r\n    return function (...args) {\r\n        // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use\r\n        // the original object.\r\n        return wrap(func.apply(unwrap(this), args));\r\n    };\r\n}\r\nfunction transformCachableValue(value) {\r\n    if (typeof value === 'function')\r\n        return wrapFunction(value);\r\n    // This doesn't return, it just creates a 'done' promise for the transaction,\r\n    // which is later returned for transaction.done (see idbObjectHandler).\r\n    if (value instanceof IDBTransaction)\r\n        cacheDonePromiseForTransaction(value);\r\n    if (instanceOfAny(value, getIdbProxyableTypes()))\r\n        return new Proxy(value, idbProxyTraps);\r\n    // Return the same value back if we're not going to transform it.\r\n    return value;\r\n}\r\nfunction wrap(value) {\r\n    // We sometimes generate multiple promises from a single IDBRequest (eg when cursoring), because\r\n    // IDB is weird and a single IDBRequest can yield many responses, so these can't be cached.\r\n    if (value instanceof IDBRequest)\r\n        return promisifyRequest(value);\r\n    // If we've already transformed this value before, reuse the transformed value.\r\n    // This is faster, but it also provides object equality.\r\n    if (transformCache.has(value))\r\n        return transformCache.get(value);\r\n    const newValue = transformCachableValue(value);\r\n    // Not all types are transformed.\r\n    // These may be primitive types, so they can't be WeakMap keys.\r\n    if (newValue !== value) {\r\n        transformCache.set(value, newValue);\r\n        reverseTransformCache.set(newValue, value);\r\n    }\r\n    return newValue;\r\n}\r\nconst unwrap = (value) => reverseTransformCache.get(value);\n\n\n\n\n//# sourceURL=webpack:///./node_modules/idb/build/esm/chunk.js?");

/***/ }),

/***/ "./node_modules/idb/build/esm/index.js":
/*!*********************************************!*\
  !*** ./node_modules/idb/build/esm/index.js ***!
  \*********************************************/
/*! exports provided: unwrap, wrap, openDB, deleteDB */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"openDB\", function() { return openDB; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"deleteDB\", function() { return deleteDB; });\n/* harmony import */ var _chunk_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./chunk.js */ \"./node_modules/idb/build/esm/chunk.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"unwrap\", function() { return _chunk_js__WEBPACK_IMPORTED_MODULE_0__[\"e\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"wrap\", function() { return _chunk_js__WEBPACK_IMPORTED_MODULE_0__[\"a\"]; });\n\n\n\n\n/**\r\n * Open a database.\r\n *\r\n * @param name Name of the database.\r\n * @param version Schema version.\r\n * @param callbacks Additional callbacks.\r\n */\r\nfunction openDB(name, version, { blocked, upgrade, blocking } = {}) {\r\n    const request = indexedDB.open(name, version);\r\n    const openPromise = Object(_chunk_js__WEBPACK_IMPORTED_MODULE_0__[\"a\"])(request);\r\n    if (upgrade) {\r\n        request.addEventListener('upgradeneeded', (event) => {\r\n            upgrade(Object(_chunk_js__WEBPACK_IMPORTED_MODULE_0__[\"a\"])(request.result), event.oldVersion, event.newVersion, Object(_chunk_js__WEBPACK_IMPORTED_MODULE_0__[\"a\"])(request.transaction));\r\n        });\r\n    }\r\n    if (blocked)\r\n        request.addEventListener('blocked', () => blocked());\r\n    if (blocking)\r\n        openPromise.then(db => db.addEventListener('versionchange', blocking));\r\n    return openPromise;\r\n}\r\n/**\r\n * Delete a database.\r\n *\r\n * @param name Name of the database.\r\n */\r\nfunction deleteDB(name, { blocked } = {}) {\r\n    const request = indexedDB.deleteDatabase(name);\r\n    if (blocked)\r\n        request.addEventListener('blocked', () => blocked());\r\n    return Object(_chunk_js__WEBPACK_IMPORTED_MODULE_0__[\"a\"])(request).then(() => undefined);\r\n}\n\nconst readMethods = ['get', 'getKey', 'getAll', 'getAllKeys', 'count'];\r\nconst writeMethods = ['put', 'add', 'delete', 'clear'];\r\nconst cachedMethods = new Map();\r\nfunction getMethod(target, prop) {\r\n    if (!(target instanceof IDBDatabase &&\r\n        !(prop in target) &&\r\n        typeof prop === 'string'))\r\n        return;\r\n    if (cachedMethods.get(prop))\r\n        return cachedMethods.get(prop);\r\n    const targetFuncName = prop.replace(/FromIndex$/, '');\r\n    const useIndex = prop !== targetFuncName;\r\n    const isWrite = writeMethods.includes(targetFuncName);\r\n    if (\r\n    // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.\r\n    !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) ||\r\n        !(isWrite || readMethods.includes(targetFuncName)))\r\n        return;\r\n    const method = async function (storeName, ...args) {\r\n        const tx = this.transaction(storeName, isWrite ? 'readwrite' : 'readonly');\r\n        let target = tx.store;\r\n        if (useIndex)\r\n            target = target.index(args.shift());\r\n        const returnVal = target[targetFuncName](...args);\r\n        if (isWrite)\r\n            await tx.done;\r\n        return returnVal;\r\n    };\r\n    cachedMethods.set(prop, method);\r\n    return method;\r\n}\r\nObject(_chunk_js__WEBPACK_IMPORTED_MODULE_0__[\"b\"])(oldTraps => ({\r\n    get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),\r\n    has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop),\r\n}));\n\n\n\n\n//# sourceURL=webpack:///./node_modules/idb/build/esm/index.js?");

/***/ }),

/***/ "./src/IndexController.js":
/*!********************************!*\
  !*** ./src/IndexController.js ***!
  \********************************/
/*! exports provided: IndexController */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"IndexController\", function() { return IndexController; });\n/* harmony import */ var idb__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! idb */ \"./node_modules/idb/build/esm/index.js\");\n/* harmony import */ var _js_main_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../js/main.js */ \"./js/main.js\");\n\n\n\nfunction IndexController(container) {\n  this._container = container;\n  this._initMap = initMap;\n  this._dbPromise = openDatabase();\n  this._registerServiceWorker();\n}\n\nIndexController.prototype.initMap = function() {\n  let loc = {\n    lat: 40.722216,\n    lng: -73.987501\n  };\n  self.map = new google.maps.Map(document.getElementById('map'), {\n    zoom: 12,\n    center: loc,\n    scrollwheel: false\n  });\n  Object(_js_main_js__WEBPACK_IMPORTED_MODULE_1__[\"updateRestaurants\"])();\n};\n\nIndexController.prototype.openDatabase = function() {\n  console.log(\"Opening db\");\n\n  if (!navigator.serviceWorker) {\n    return Promise.resolve();\n  }\n\n  return Object(idb__WEBPACK_IMPORTED_MODULE_0__[\"openDB\"])(\"restaurants\", 1, upgradeDb => {\n    console.log(\"db: %o\", upgradeDb);\n  });\n};\n\nIndexController.prototype._registerServiceWorker = function() {\n  if(navigator.serviceWorker) {\n    navigator.serviceWorker.register(\"./main-sw.js\")\n    .then( swRegistration => {\n      console.log(\"Service worker registered: %o\", swRegistration);\n  \n      if (!navigator.serviceWorker.controller) {\n        return;\n      }\n  \n      // activate a waiting service worker\n      if (swRegistration.waiting) {\n        activateServiceWorker(swRegistration.waiting);\n        return;\n      }\n  \n      // watch a service working that's installing and activate when its done\n      if (swRegistration.installing) {\n        waitForInstalledServiceWorker(swRegistration.installing);\n        return;\n      }\n  \n      // if an updated service worker is found, activate when it's installed\n      swRegistration.addEventListener('updatefound', () => \n        waitForInstalledServiceWorker(swRegistration.installing)\n      );\n    })\n    .catch(err => {\n      console.log(\"Error registering service worker: %o\", err);\n    });\n  \n    navigator.serviceWorker.addEventListener('controllerchange', () => {\n      window.location.reload();\n    })\n  \n    function waitForInstalledServiceWorker(worker) {\n      worker.addEventListener('statechange', () => {\n        if (worker.state == 'installed') {\n          activateServiceWorker(worker);\n        }\n      });\n    }\n  \n    function activateServiceWorker(worker) {\n      worker.postMessage({action: 'skipWaiting'});\n    }\n  }\n};\n\n\n//# sourceURL=webpack:///./src/IndexController.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _IndexController_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./IndexController.js */ \"./src/IndexController.js\");\n\n\nconst indexController = new _IndexController_js__WEBPACK_IMPORTED_MODULE_0__[\"IndexController\"](document.querySelector('#maincontent'));\nwindow.initMap = indexController.initMap;\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

/******/ });