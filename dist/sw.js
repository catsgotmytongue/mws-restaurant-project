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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/sw/main-sw.js");
/******/ })
/************************************************************************/
/******/ ({

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

/***/ "./src/dbhelper.js":
/*!*************************!*\
  !*** ./src/dbhelper.js ***!
  \*************************/
/*! exports provided: DBHelper */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"DBHelper\", function() { return DBHelper; });\n/**\r\n * Common database helper functions.\r\n */\r\nclass DBHelper {\r\n  static get DbName() {return 'restaurants';};\r\n  static get DbVersion() {return 9;};\r\n  /**\r\n   * Url of the api server\r\n   */\r\n  static get ApiUrl() {\r\n    return `http://localhost:8001/restaurants`;\r\n  }\r\n\r\n  static get IMAGE_ROOT() {\r\n     return \"/img/\" \r\n  };\r\n\r\n  /**\r\n   * Fetch all restaurants.\r\n   */\r\n  static fetchRestaurants() {\r\n    return fetch(DBHelper.ApiUrl)\r\n    .then( res => res.json())\r\n    .catch(err => console.log(\"Error in fetchRestaurants(): %o\", err));\r\n  }\r\n\r\n  /**\r\n   * Fetch a restaurant by its ID.\r\n   */\r\n  static fetchRestaurantById(id) {\r\n    // fetch all restaurants with proper error handling.\r\n    return DBHelper.fetchRestaurants()\r\n    .then(restaurants => restaurants.find(r => r.id == id))\r\n    .catch( err=> console.log('Restaurant does not exist') );\r\n  }\r\n\r\n  /**\r\n   * Fetch restaurants by a cuisine type with proper error handling.\r\n   */\r\n  static fetchRestaurantByCuisine(cuisine) {\r\n    // Fetch all restaurants  with proper error handling\r\n    return DBHelper.fetchRestaurants()\r\n    .then(restaurants => restaurants.filter(r => r.cuisine_type == cuisine))\r\n    .catch(err => null);\r\n  }\r\n\r\n  /**\r\n   * Fetch restaurants by a neighborhood with proper error handling.\r\n   */\r\n  static fetchRestaurantByNeighborhood(neighborhood) {\r\n    // Fetch all restaurants\r\n    return DBHelper.fetchRestaurants()\r\n    .then(restaurants => restaurants.filter(r => r.neighborhood == neighborhood))\r\n    .catch(err => null);\r\n  }\r\n\r\n  /**\r\n   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.\r\n   */\r\n  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood) {\r\n    return DBHelper.fetchRestaurants()\r\n    .then(restaurants => {\r\n        let results = restaurants;\r\n        if (cuisine != 'all') { // filter by cuisine\r\n          results = results.filter(r => r.cuisine_type == cuisine);\r\n        }\r\n        if (neighborhood != 'all') { // filter by neighborhood\r\n          results = results.filter(r => r.neighborhood == neighborhood);\r\n        }\r\n\r\n        return results;\r\n    })\r\n    .catch(err => null);\r\n  }\r\n\r\n  /**\r\n   * Fetch all neighborhoods with proper error handling.\r\n   */\r\n  static fetchNeighborhoods() {\r\n    return DBHelper.fetchRestaurants()\r\n    .then(restaurants => {\r\n      return restaurants.map((v, i) => restaurants[i].neighborhood)\r\n                          .filter((v, i, neighborhoods) => neighborhoods.indexOf(v) == i); \r\n                        } )\r\n    .catch(err => null);\r\n  }\r\n\r\n  /**\r\n   * Fetch all cuisines with proper error handling.\r\n   */\r\n  static fetchCuisines() {\r\n    return DBHelper.fetchRestaurants()\r\n    .then(restaurants => restaurants\r\n                          .map((v, i) => restaurants[i].cuisine_type)\r\n                          .filter((v, i, cuisines) => cuisines.indexOf(v) == i))\r\n    .catch(err => null);\r\n  }\r\n\r\n  /**\r\n   * Restaurant page URL.\r\n   */\r\n  static urlForRestaurant(restaurant) {\r\n    return (`./restaurant.html?id=${restaurant.id}`);\r\n  }\r\n\r\n  /**\r\n   * Restaurant image URL.\r\n   */\r\n  static imageUrlForRestaurant(restaurant, suffix = \"\") {\r\n    var photoSplit = restaurant.photograph.includes('.') ? restaurant.photograph.split('.') : [restaurant.photograph, 'jpg'];\r\n    return (`${DBHelper.IMAGE_ROOT}${photoSplit[0]}${suffix ? '-'+suffix: ''}.${photoSplit[1]}`);\r\n  }\r\n\r\n  /**\r\n   * Map marker for a restaurant.\r\n   */\r\n  static mapMarkerForRestaurant(restaurant, map) {\r\n    const marker = new google.maps.Marker({\r\n      position: restaurant.latlng,\r\n      title: restaurant.name,\r\n      url: DBHelper.urlForRestaurant(restaurant),\r\n      map: map,\r\n      animation: google.maps.Animation.DROP}\r\n    );\r\n    return marker;\r\n  }\r\n\r\n}\r\n\n\n//# sourceURL=webpack:///./src/dbhelper.js?");

/***/ }),

/***/ "./src/sw/main-sw.js":
/*!***************************!*\
  !*** ./src/sw/main-sw.js ***!
  \***************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var idb__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! idb */ \"./node_modules/idb/build/esm/index.js\");\n/* harmony import */ var _dbhelper_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../dbhelper.js */ \"./src/dbhelper.js\");\n\r\n\r\n\r\nconst version = 49;\r\nconst cacheNamePrefix = 'restaurant-';\r\nconst staticCacheName = `${cacheNamePrefix}static-cache-v`;\r\nconst imgCacheName    = `${cacheNamePrefix}image-cache-v`;\r\nconst currentStaticCacheName = `${staticCacheName}${version}`;\r\nconst currentImgCacheName    = `${imgCacheName}${version}`;\r\nconst currentCaches = [\r\n  currentStaticCacheName,\r\n  currentImgCacheName\r\n];\r\nconsole.log('DBHELPER %o', _dbhelper_js__WEBPACK_IMPORTED_MODULE_1__[\"DBHelper\"]);\r\nconst dbPromise = \r\nObject(idb__WEBPACK_IMPORTED_MODULE_0__[\"openDB\"])(_dbhelper_js__WEBPACK_IMPORTED_MODULE_1__[\"DBHelper\"].DbName, _dbhelper_js__WEBPACK_IMPORTED_MODULE_1__[\"DBHelper\"].DbVersion, {\r\n  upgrade(db, oldVersion, newVersion, transaction) {\r\n    console.log(`OpenDB: upgrade... ${{db, oldVersion, newVersion, transaction}}`);\r\n    \r\n\r\n  },\r\n  blocked() {\r\n    console.log(`OpenDB: blocked...`);\r\n  },\r\n  blocking() {\r\n    console.log(`OpenDB: blocking...`);\r\n  }\r\n});\r\n\r\n// install is called when service worker is actually installed\r\nself.addEventListener('install', event => {\r\n  event.waitUntil(\r\n    caches.open(currentStaticCacheName)\r\n    .then(cache => cache.addAll([\r\n      `/css/restaurant-detail.css`,\r\n      `/css/restaurant-list.css`,\r\n      '/favicon.ico',\r\n      `/index.html`,\r\n      `/restaurant.html`,\r\n      `/main.js`,\r\n      `/dbhelper.js`,\r\n      `/restaurant_info.js`\r\n    ]))\r\n    .catch(err=> console.log('Error when adding cached items %o', err))\r\n  )\r\n});\r\n\r\n// activate is called when an installed service worker is becoming the active service worker\r\nself.addEventListener('activate', event => {\r\n  console.log(\"activating service worker with version %s\", version);\r\n\r\n  event.waitUntil(\r\n    caches.keys()\r\n    .then( cacheNames => \r\n      Promise.all(\r\n        cacheNames\r\n          .filter(cacheName => \r\n            (cacheName.startsWith(staticCacheName) || cacheName.startsWith(imgCacheName) ) && !currentCaches.includes(cacheName))\r\n          .map( cacheName => {\r\n            console.log('deleting cache named %s', cacheName);\r\n            caches.delete( cacheName).catch(\"Error deleting cache named %s\", cacheName);\r\n          })\r\n      )\r\n    ) \r\n  ); \r\n});\r\n\r\n// listen for requests\r\nself.addEventListener('fetch', event => {\r\n  \r\n  var requestUrl = new URL(event.request.url);\r\n\r\n  // make sure to handle only our origin's requests\r\n  if (requestUrl.origin === location.origin) {\r\n    // handle image requests\r\n    if(requestUrl.pathname.startsWith(_dbhelper_js__WEBPACK_IMPORTED_MODULE_1__[\"DBHelper\"].IMAGE_ROOT)) {\r\n      event.respondWith( serveImage(event.request) );\r\n      return;\r\n    }\r\n\r\n    if(requestUrl.pathname.startsWith('/restaurant.html')){\r\n      event.respondWith( caches.match(event.request, {ignoreSearch: true}));\r\n      return;\r\n    }\r\n\r\n    if(requestUrl.host == _dbhelper_js__WEBPACK_IMPORTED_MODULE_1__[\"DBHelper\"].ApiUrl)\r\n    {\r\n      console.log(\"API Call %o\", requestUrl.href);\r\n    }\r\n    // same origin .css or .js updates\r\n    // if(requestUrl.pathname.endsWith('.css') || requestUrl.pathname.endsWith('.js')) {\r\n    //   event.respondWith( serveAsset(event.request) );\r\n    //   return;\r\n    // }\r\n\r\n    // any other request return a cached response or fetch it\r\n    event.respondWith( \r\n      caches.match(event.request)\r\n      .then(response => response || fetch(event.request) )\r\n      .catch(reason => console.log(\"Cache miss: \",reason)) );\r\n    return;\r\n  }\r\n});\r\n\r\n// listen for service worker messages\r\nself.addEventListener('message', event => {\r\n  if(event.data.action === 'skipWaiting') {\r\n    self.skipWaiting();\r\n  }\r\n});\r\n\r\nfunction serveImage(request) {\r\n  let imgKey = request.url.replace(/-\\d+\\.jpg$/, '');\r\n  return caches\r\n          .open(currentImgCacheName)\r\n          .then(cache => \r\n            cache.match(imgKey)\r\n            .then(response => \r\n              response || fetch(request)\r\n              .then(imageResponse => {\r\n                cache.put(imgKey, imageResponse.clone()); \r\n                return imageResponse;\r\n              }) \r\n            )\r\n          );\r\n}\r\n\r\nfunction serveAsset(request) {\r\n  return caches\r\n  .open(currentStaticCacheName)\r\n  .then(cache => \r\n    cache.match(request)\r\n    .then(response => \r\n      response || fetch(request, {cache: \"no-cache\"})\r\n      .then(networkResponse => {\r\n        cache.put(request, networkResponse.clone());\r\n        return networkResponse;\r\n      }) \r\n    )\r\n  );\r\n}\r\n\n\n//# sourceURL=webpack:///./src/sw/main-sw.js?");

/***/ })

/******/ });