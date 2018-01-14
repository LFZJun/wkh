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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ({

/***/ 1:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const FULL = "full";
/* harmony export (immutable) */ __webpack_exports__["b"] = FULL;

const VALUE = "value";
/* harmony export (immutable) */ __webpack_exports__["f"] = VALUE;

const HOME = "/inject/home";
/* harmony export (immutable) */ __webpack_exports__["c"] = HOME;

const MARKET = "/inject/market";
/* harmony export (immutable) */ __webpack_exports__["d"] = MARKET;

const ALERT = "/inject/alert";
/* harmony export (immutable) */ __webpack_exports__["a"] = ALERT;

const TRANSACTION = "/background/transaction";
/* harmony export (immutable) */ __webpack_exports__["e"] = TRANSACTION;



/***/ }),

/***/ 11:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__consts__ = __webpack_require__(1);


const interval = 'interval';
const mode = 'mode';
const min = 'min';
const kg = 'kg';
const coin = 'coin';

chrome.storage.sync.get({
    [mode]: __WEBPACK_IMPORTED_MODULE_0__consts__["f" /* VALUE */],
    [min]: 0.1,
    [kg]: false,
    [interval]: 5,
    [coin]: 0.1
}, function (result) {
    $("#mode").val(result.mode);
    $("#min").val(result.min);
    $("#kg").val(result.kg);
    $("#interval").val(result.interval);
    $('#coin').val(result.coin);
});

const DoUpdate = () => {
    console.log("update");
    chrome.storage.sync.set({
        [interval]: $('#interval').val(),
        [mode]: $("#mode").val(),
        [min]: $("#min").val(),
        [kg]: $("#kg").val(),
        [coin]: $("#coin").val()
    }, function (result) {
        console.log(result)
    })
};

$("input").change(DoUpdate);
$("#update").click(DoUpdate);

/***/ })

/******/ });