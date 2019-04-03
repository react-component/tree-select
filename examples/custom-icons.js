/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"examples/custom-icons": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
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
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push([3,"common"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./examples/custom-icons.js":
/*!**********************************!*\
  !*** ./examples/custom-icons.js ***!
  \**********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var rc_tree_select_assets_index_less__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rc-tree-select/assets/index.less */ "./assets/index.less");
/* harmony import */ var rc_tree_select_assets_index_less__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(rc_tree_select_assets_index_less__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/_react@16.8.6@react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-dom */ "./node_modules/_react-dom@16.8.6@react-dom/index.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var rc_dialog_assets_index_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rc-dialog/assets/index.css */ "./node_modules/_rc-dialog@7.3.0@rc-dialog/assets/index.css");
/* harmony import */ var rc_dialog_assets_index_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(rc_dialog_assets_index_css__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var rc_tree_select__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rc-tree-select */ "./index.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./util */ "./examples/util.js");
/* harmony import */ var _demo_less__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./demo.less */ "./examples/demo.less");
/* harmony import */ var _demo_less__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_demo_less__WEBPACK_IMPORTED_MODULE_6__);
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* eslint react/no-multi-comp:0, no-console:0, no-alert: 0 */







var bubblePath = 'M632 888H392c-4.4 0-8 3.6-8 8v32c0 ' + '17.7 14.3 32 32 32h192c17.7 0 32-14.3 32-32v-3' + '2c0-4.4-3.6-8-8-8zM512 64c-181.1 0-328 146.9-3' + '28 328 0 121.4 66 227.4 164 284.1V792c0 17.7 1' + '4.3 32 32 32h264c17.7 0 32-14.3 32-32V676.1c98' + '-56.7 164-162.7 164-284.1 0-181.1-146.9-328-32' + '8-328z m127.9 549.8L604 634.6V752H420V634.6l-3' + '5.9-20.8C305.4 568.3 256 484.5 256 392c0-141.4' + ' 114.6-256 256-256s256 114.6 256 256c0 92.5-49' + '.4 176.3-128.1 221.8z';
var clearPath = 'M793 242H366v-74c0-6.7-7.7-10.4-12.9' + '-6.3l-142 112c-4.1 3.2-4.1 9.4 0 12.6l142 112c' + '5.2 4.1 12.9 0.4 12.9-6.3v-74h415v470H175c-4.4' + ' 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h618c35.3 0 64-' + '28.7 64-64V306c0-35.3-28.7-64-64-64z';
var arrowPath = 'M765.7 486.8L314.9 134.7c-5.3-4.1' + '-12.9-0.4-12.9 6.3v77.3c0 4.9 2.3 9.6 6.1 12.6l36' + '0 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6' + '.7 7.7 10.4 12.9 6.3l450.8-352.1c16.4-12.8 16.4-3' + '7.6 0-50.4z';

var getSvg = function getSvg(path) {
  var iStyle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var style = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("i", {
    style: iStyle
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("svg", {
    viewBox: "0 0 1024 1024",
    width: "1em",
    height: "1em",
    fill: "currentColor",
    style: _objectSpread({
      verticalAlign: '-.125em'
    }, style)
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("path", {
    d: path
  })));
};

var switcherIcon = function switcherIcon(obj) {
  if (obj.isLeaf) {
    return getSvg(arrowPath, {
      cursor: 'pointer',
      backgroundColor: 'white'
    }, {
      transform: 'rotate(270deg)'
    });
  }

  return getSvg(arrowPath, {
    cursor: 'pointer',
    backgroundColor: 'white'
  }, {
    transform: "rotate(".concat(obj.expanded ? 90 : 0, "deg)")
  });
};

var _inputIcon = getSvg(bubblePath);

var _clearIcon = getSvg(clearPath);

var _removeIcon = getSvg(clearPath);

var iconProps = {
  inputIcon: _inputIcon,
  clearIcon: _clearIcon,
  removeIcon: _removeIcon,
  switcherIcon: switcherIcon
};
var iconPropsFunction = {
  inputIcon: function inputIcon() {
    return _inputIcon;
  },
  clearIcon: function clearIcon() {
    return _clearIcon;
  },
  removeIcon: function removeIcon() {
    return _removeIcon;
  },
  switcherIcon: switcherIcon
};

function Demo() {
  return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    className: "custom-icon-demo"
  }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("h2", null, "Single"), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(rc_tree_select__WEBPACK_IMPORTED_MODULE_4__["default"], _extends({
    treeData: _util__WEBPACK_IMPORTED_MODULE_5__["gData"],
    placeholder: react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("span", null, "Please Select"),
    transitionName: "rc-tree-select-dropdown-slide-up",
    style: {
      width: 300
    },
    dropdownStyle: {
      maxHeight: 200,
      overflow: 'auto',
      zIndex: 1500
    },
    showSearch: true,
    allowClear: true
  }, iconProps)), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("br", null), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("h2", null, "Multiple"), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(rc_tree_select__WEBPACK_IMPORTED_MODULE_4__["default"], _extends({
    treeData: _util__WEBPACK_IMPORTED_MODULE_5__["gData"],
    multiple: true,
    placeholder: react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("span", null, "Please Select"),
    transitionName: "rc-tree-select-dropdown-slide-up",
    style: {
      width: 300
    },
    dropdownStyle: {
      maxHeight: 200,
      overflow: 'auto',
      zIndex: 1500
    },
    showSearch: true,
    allowClear: true
  }, iconPropsFunction)));
}

react_dom__WEBPACK_IMPORTED_MODULE_2___default.a.render(react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(Demo, null), document.getElementById('__react-content'));

/***/ }),

/***/ 3:
/*!****************************************!*\
  !*** multi ./examples/custom-icons.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./examples/custom-icons.js */"./examples/custom-icons.js");


/***/ })

/******/ });
//# sourceMappingURL=custom-icons.js.map