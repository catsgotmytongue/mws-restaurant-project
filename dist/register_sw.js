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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/sw/register-sw.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/sw/register-sw.js":
/*!*******************************!*\
  !*** ./src/sw/register-sw.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var registerServiceWorker = function(serviceWorkerFile) {\r\n  if(navigator.serviceWorker) {\r\n    navigator.serviceWorker.register(serviceWorkerFile)\r\n    .then( swRegistration => {\r\n      console.log(\"Service worker registered: %o\", swRegistration);\r\n  \r\n      if (!navigator.serviceWorker.controller) {\r\n        return;\r\n      }\r\n  \r\n      // activate a waiting service worker\r\n      if (swRegistration.waiting) {\r\n        activateServiceWorker(swRegistration.waiting);\r\n        return;\r\n      }\r\n  \r\n      // watch a service working that's installing and activate when its done\r\n      if (swRegistration.installing) {\r\n        waitForInstalledServiceWorker(swRegistration.installing);\r\n        return;\r\n      }\r\n  \r\n      // if an updated service worker is found, activate when it's installed\r\n      swRegistration.addEventListener('updatefound', () => \r\n        waitForInstalledServiceWorker(swRegistration.installing)\r\n      );\r\n    })\r\n    .catch(err => {\r\n      console.log(\"Error registering service worker: %o\", err);\r\n    });\r\n  \r\n    navigator.serviceWorker.addEventListener('controllerchange', () => {\r\n      window.location.reload();\r\n    })\r\n  \r\n    function waitForInstalledServiceWorker(worker) {\r\n      worker.addEventListener('statechange', () => {\r\n        if (worker.state == 'installed') {\r\n          activateServiceWorker(worker);\r\n        }\r\n      });\r\n    }\r\n  \r\n    function activateServiceWorker(worker) {\r\n      worker.postMessage({action: 'skipWaiting'});\r\n    }\r\n  }\r\n};\r\n\r\nregisterServiceWorker(\"./dist/sw.js\");\n\n//# sourceURL=webpack:///./src/sw/register-sw.js?");

/***/ })

/******/ });