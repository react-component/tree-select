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
/******/ 		"examples/basic": 0
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
/******/ 	deferredModules.push([0,"common"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./examples/basic.js":
/*!***************************!*\
  !*** ./examples/basic.js ***!
  \***************************/
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
/* harmony import */ var rc_dialog__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rc-dialog */ "./node_modules/_rc-dialog@7.3.0@rc-dialog/es/DialogWrap.js");
/* harmony import */ var rc_tree_select__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rc-tree-select */ "./index.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./util */ "./examples/util.js");
/* harmony import */ var _demo_less__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./demo.less */ "./examples/demo.less");
/* harmony import */ var _demo_less__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_demo_less__WEBPACK_IMPORTED_MODULE_7__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/* eslint react/no-multi-comp:0, no-console:0, no-alert: 0 */









function isLeaf(value) {
  if (!value) {
    return false;
  }

  var queues = _toConsumableArray(_util__WEBPACK_IMPORTED_MODULE_6__["gData"]);

  while (queues.length) {
    // BFS
    var item = queues.shift();

    if (item.value === value) {
      if (!item.children) {
        return true;
      }

      return false;
    }

    if (item.children) {
      queues = queues.concat(item.children);
    }
  }

  return false;
}

function findPath(value, data) {
  var sel = [];

  function loop(selected, children) {
    for (var i = 0; i < children.length; i++) {
      var item = children[i];

      if (selected === item.value) {
        sel.push(item);
        return;
      }

      if (item.children) {
        loop(selected, item.children, item);

        if (sel.length) {
          sel.push(item);
          return;
        }
      }
    }
  }

  loop(value, data);
  return sel;
}

var Demo =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Demo, _React$Component);

  function Demo() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, Demo);

    for (var _len = arguments.length, _args = new Array(_len), _key = 0; _key < _len; _key++) {
      _args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Demo)).call.apply(_getPrototypeOf2, [this].concat(_args)));

    _defineProperty(_assertThisInitialized(_this), "state", {
      tsOpen: false,
      visible: false,
      searchValue: '0-0-0-label',
      value: '0-0-0-value1',
      // value: ['0-0-0-0-value', '0-0-0-1-value', '0-0-0-2-value'],
      lv: {
        value: '0-0-0-value',
        label: 'spe label'
      },
      multipleValue: [],
      simpleSearchValue: 'test111',
      simpleTreeData: [{
        key: 1,
        pId: 0,
        label: 'test1',
        value: 'test1'
      }, {
        key: 121,
        pId: 0,
        label: 'test2',
        value: 'test2'
      }, {
        key: 11,
        pId: 1,
        label: 'test11',
        value: 'test11'
      }, {
        key: 12,
        pId: 1,
        label: 'test12',
        value: 'test12'
      }, {
        key: 111,
        pId: 11,
        label: 'test111',
        value: 'test111'
      }],
      treeDataSimpleMode: {
        id: 'key',
        rootPId: 0
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onClick", function () {
      _this.setState({
        visible: true
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onClose", function () {
      _this.setState({
        visible: false
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onSearch", function (value) {
      var _console;

      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      (_console = console).log.apply(_console, ['Do Search:', value].concat(args));

      _this.setState({
        searchValue: value
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onChange", function (value) {
      var _console2;

      for (var _len3 = arguments.length, rest = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        rest[_key3 - 1] = arguments[_key3];
      }

      (_console2 = console).log.apply(_console2, ['onChange', value].concat(rest));

      _this.setState({
        value: value
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onChangeChildren", function () {
      var _console3;

      var preValue = _this.state.value;

      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      (_console3 = console).log.apply(_console3, ['onChangeChildren'].concat(args));

      var value = args[0];
      var pre = value ? preValue : undefined;

      _this.setState({
        value: isLeaf(value) ? value : pre
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onChangeLV", function (value) {
      var _console4;

      for (var _len5 = arguments.length, args = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
        args[_key5 - 1] = arguments[_key5];
      }

      (_console4 = console).log.apply(_console4, ['labelInValue', value].concat(args));

      if (!value) {
        _this.setState({
          lv: undefined
        });

        return;
      }

      var path = findPath(value.value, _util__WEBPACK_IMPORTED_MODULE_6__["gData"]).map(function (i) {
        return i.label;
      }).reverse().join(' > ');

      _this.setState({
        lv: {
          value: value.value,
          label: path
        }
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onMultipleChange", function (value) {
      console.log('onMultipleChange', value);

      _this.setState({
        multipleValue: value
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onSelect", function () {
      for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        args[_key6] = arguments[_key6];
      }

      // use onChange instead
      console.log(args);
    });

    _defineProperty(_assertThisInitialized(_this), "onDropdownVisibleChange", function (visible, info) {
      var value = _this.state.value;
      console.log(visible, value, info);

      if (Array.isArray(value) && value.length > 1 && value.length < 3) {
        window.alert('please select more than two item or less than one item.');
        return false;
      }

      return true;
    });

    _defineProperty(_assertThisInitialized(_this), "filterTreeNode", function (input, child) {
      return String(child.props.title).indexOf(input) === 0;
    });

    return _this;
  }

  _createClass(Demo, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$state = this.state,
          visible = _this$state.visible,
          value = _this$state.value,
          searchValue = _this$state.searchValue,
          tsOpen = _this$state.tsOpen,
          multipleValue = _this$state.multipleValue,
          lv = _this$state.lv,
          simpleTreeData = _this$state.simpleTreeData,
          simpleSearchValue = _this$state.simpleSearchValue,
          treeDataSimpleMode = _this$state.treeDataSimpleMode;
      return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
        style: {
          margin: 20
        }
      }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("h2", null, "tree-select in dialog"), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("button", {
        type: "button",
        className: "btn btn-primary",
        onClick: this.onClick
      }, "show dialog"), visible ? react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(rc_dialog__WEBPACK_IMPORTED_MODULE_4__["default"], {
        visible: visible,
        animation: "zoom",
        maskAnimation: "fade",
        onClose: this.onClose,
        style: {
          width: 600,
          height: 400,
          overflow: 'auto'
        },
        id: "area"
      }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
        style: {
          height: 600,
          paddingTop: 100
        }
      }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(rc_tree_select__WEBPACK_IMPORTED_MODULE_5__["default"], {
        getPopupContainer: function getPopupContainer(triggerNode) {
          return triggerNode.parentNode;
        },
        style: {
          width: 300
        },
        transitionName: "rc-tree-select-dropdown-slide-up",
        choiceTransitionName: "rc-tree-select-selection__choice-zoom",
        dropdownStyle: {
          maxHeight: 200,
          overflow: 'auto',
          zIndex: 1500
        },
        placeholder: react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("i", null, "\u8BF7\u4E0B\u62C9\u9009\u62E9"),
        searchPlaceholder: "please search",
        showSearch: true,
        allowClear: true,
        treeLine: true,
        value: value,
        treeData: _util__WEBPACK_IMPORTED_MODULE_6__["gData"],
        treeNodeFilterProp: "label",
        filterTreeNode: false,
        onSearch: this.onSearch,
        onChange: this.onChange,
        onSelect: this.onSelect
      }))) : null, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("h2", null, "single select"), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(rc_tree_select__WEBPACK_IMPORTED_MODULE_5__["default"], {
        style: {
          width: 300
        },
        transitionName: "rc-tree-select-dropdown-slide-up",
        choiceTransitionName: "rc-tree-select-selection__choice-zoom",
        dropdownStyle: {
          maxHeight: 200,
          overflow: 'auto'
        },
        placeholder: react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("i", null, "\u8BF7\u4E0B\u62C9\u9009\u62E9"),
        searchPlaceholder: "please search",
        showSearch: true,
        allowClear: true,
        treeLine: true,
        searchValue: searchValue,
        value: value,
        treeData: _util__WEBPACK_IMPORTED_MODULE_6__["gData"],
        treeNodeFilterProp: "label",
        filterTreeNode: false,
        onSearch: this.onSearch,
        open: tsOpen,
        onChange: function onChange(val) {
          var _console5;

          for (var _len7 = arguments.length, args = new Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
            args[_key7 - 1] = arguments[_key7];
          }

          (_console5 = console).log.apply(_console5, ['onChange', val].concat(args));

          if (val === '0-0-0-0-value') {
            _this2.setState({
              tsOpen: true
            });
          } else {
            _this2.setState({
              tsOpen: false
            });
          }

          _this2.setState({
            value: val
          });
        },
        onDropdownVisibleChange: function onDropdownVisibleChange(v, info) {
          console.log('single onDropdownVisibleChange', v, info); // document clicked

          if (info.documentClickClose && value === '0-0-0-0-value') {
            return false;
          }

          _this2.setState({
            tsOpen: v
          });

          return true;
        },
        onSelect: this.onSelect
      }), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("h2", null, "single select (just select children)"), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(rc_tree_select__WEBPACK_IMPORTED_MODULE_5__["default"], {
        style: {
          width: 300
        },
        transitionName: "rc-tree-select-dropdown-slide-up",
        choiceTransitionName: "rc-tree-select-selection__choice-zoom",
        dropdownStyle: {
          maxHeight: 200,
          overflow: 'auto'
        },
        placeholder: react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("i", null, "\u8BF7\u4E0B\u62C9\u9009\u62E9"),
        searchPlaceholder: "please search",
        showSearch: true,
        allowClear: true,
        treeLine: true,
        value: value,
        treeData: _util__WEBPACK_IMPORTED_MODULE_6__["gData"],
        treeNodeFilterProp: "label",
        filterTreeNode: false,
        onChange: this.onChangeChildren
      }), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("h2", null, "multiple select"), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(rc_tree_select__WEBPACK_IMPORTED_MODULE_5__["default"], {
        style: {
          width: 300
        },
        transitionName: "rc-tree-select-dropdown-slide-up",
        choiceTransitionName: "rc-tree-select-selection__choice-zoom",
        dropdownStyle: {
          maxHeight: 200,
          overflow: 'auto'
        },
        placeholder: react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("i", null, "\u8BF7\u4E0B\u62C9\u9009\u62E9"),
        searchPlaceholder: "please search",
        multiple: true,
        value: multipleValue,
        treeData: _util__WEBPACK_IMPORTED_MODULE_6__["gData"],
        treeNodeFilterProp: "title",
        onChange: this.onMultipleChange,
        onSelect: this.onSelect,
        allowClear: true
      }), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("h2", null, "check select"), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(rc_tree_select__WEBPACK_IMPORTED_MODULE_5__["default"], {
        className: "check-select",
        transitionName: "rc-tree-select-dropdown-slide-up",
        choiceTransitionName: "rc-tree-select-selection__choice-zoom",
        dropdownStyle: {
          height: 200,
          overflow: 'auto'
        },
        dropdownPopupAlign: {
          overflow: {
            adjustY: 0,
            adjustX: 0
          },
          offset: [0, 2]
        },
        onDropdownVisibleChange: this.onDropdownVisibleChange,
        placeholder: react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("i", null, "\u8BF7\u4E0B\u62C9\u9009\u62E9"),
        searchPlaceholder: "please search",
        treeLine: true,
        maxTagTextLength: 10,
        value: value,
        autoClearSearchValue: true,
        treeData: _util__WEBPACK_IMPORTED_MODULE_6__["gData"],
        treeNodeFilterProp: "title",
        treeCheckable: true,
        showCheckedStrategy: rc_tree_select__WEBPACK_IMPORTED_MODULE_5__["SHOW_PARENT"],
        onChange: this.onChange,
        onSelect: this.onSelect,
        maxTagCount: 2,
        maxTagPlaceholder: function maxTagPlaceholder(valueList) {
          console.log('Max Tag Rest Value:', valueList);
          return "".concat(valueList.length, " rest...");
        }
      }), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("h2", null, "labelInValue & show path"), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(rc_tree_select__WEBPACK_IMPORTED_MODULE_5__["default"], {
        style: {
          width: 500
        },
        transitionName: "rc-tree-select-dropdown-slide-up",
        choiceTransitionName: "rc-tree-select-selection__choice-zoom",
        dropdownStyle: {
          maxHeight: 200,
          overflow: 'auto'
        },
        placeholder: react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("i", null, "\u8BF7\u4E0B\u62C9\u9009\u62E9"),
        searchPlaceholder: "please search",
        showSearch: true,
        allowClear: true,
        treeLine: true,
        value: lv,
        labelInValue: true,
        treeData: _util__WEBPACK_IMPORTED_MODULE_6__["gData"],
        treeNodeFilterProp: "label",
        filterTreeNode: false,
        onChange: this.onChangeLV
      }), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("h2", null, "use treeDataSimpleMode"), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(rc_tree_select__WEBPACK_IMPORTED_MODULE_5__["default"], {
        style: {
          width: 300
        },
        dropdownStyle: {
          maxHeight: 200,
          overflow: 'auto'
        },
        placeholder: react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("i", null, "\u8BF7\u4E0B\u62C9\u9009\u62E9"),
        searchPlaceholder: "please search",
        treeLine: true,
        maxTagTextLength: 10,
        searchValue: simpleSearchValue,
        onSearch: function onSearch(val) {
          _this2.setState({
            simpleSearchValue: val
          });
        },
        value: value,
        treeData: simpleTreeData,
        treeNodeFilterProp: "title",
        treeDataSimpleMode: treeDataSimpleMode,
        treeCheckable: true,
        showCheckedStrategy: rc_tree_select__WEBPACK_IMPORTED_MODULE_5__["SHOW_PARENT"],
        onChange: this.onChange,
        onSelect: this.onSelect
      }), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("h2", null, "Testing in extreme conditions (Boundary conditions test) "), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(rc_tree_select__WEBPACK_IMPORTED_MODULE_5__["default"], {
        style: {
          width: 200
        },
        dropdownStyle: {
          maxHeight: 200,
          overflow: 'auto'
        },
        defaultValue: "leaf1",
        multiple: true,
        treeCheckable: true,
        showCheckedStrategy: rc_tree_select__WEBPACK_IMPORTED_MODULE_5__["SHOW_PARENT"],
        treeDefaultExpandAll: true,
        treeData: [{
          key: '',
          value: '',
          label: 'empty value',
          children: []
        }, {
          key: '0',
          value: '0',
          label: '0 label',
          children: [{
            key: '00',
            value: '00',
            label: '00 label',
            children: []
          }, {
            key: '01',
            value: '01',
            label: '01 label',
            children: []
          }]
        }],
        onChange: function onChange(val) {
          var _console6;

          for (var _len8 = arguments.length, args = new Array(_len8 > 1 ? _len8 - 1 : 0), _key8 = 1; _key8 < _len8; _key8++) {
            args[_key8 - 1] = arguments[_key8];
          }

          return (_console6 = console).log.apply(_console6, [val].concat(args));
        }
      }), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("h2", null, "use TreeNode Component (not recommend)"), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(rc_tree_select__WEBPACK_IMPORTED_MODULE_5__["default"], {
        style: {
          width: 200
        },
        dropdownStyle: {
          maxHeight: 200,
          overflow: 'auto'
        },
        defaultValue: "leaf1",
        treeDefaultExpandAll: true,
        treeNodeFilterProp: "title",
        filterTreeNode: this.filterTreeNode,
        onChange: function onChange(val) {
          var _console7;

          for (var _len9 = arguments.length, args = new Array(_len9 > 1 ? _len9 - 1 : 0), _key9 = 1; _key9 < _len9; _key9++) {
            args[_key9 - 1] = arguments[_key9];
          }

          return (_console7 = console).log.apply(_console7, [val].concat(args));
        }
      }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(rc_tree_select__WEBPACK_IMPORTED_MODULE_5__["TreeNode"], {
        value: "",
        title: "parent 1",
        key: ""
      }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(rc_tree_select__WEBPACK_IMPORTED_MODULE_5__["TreeNode"], {
        value: "parent 1-0",
        title: "parent 1-0",
        key: "0-1-0"
      }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(rc_tree_select__WEBPACK_IMPORTED_MODULE_5__["TreeNode"], {
        value: "leaf1",
        title: "my leaf",
        key: "random"
      }), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(rc_tree_select__WEBPACK_IMPORTED_MODULE_5__["TreeNode"], {
        value: "leaf2",
        title: "your leaf",
        key: "random1",
        disabled: true
      })), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(rc_tree_select__WEBPACK_IMPORTED_MODULE_5__["TreeNode"], {
        value: "parent 1-1",
        title: "parent 1-1",
        key: "0-1-1"
      }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(rc_tree_select__WEBPACK_IMPORTED_MODULE_5__["TreeNode"], {
        value: "sss",
        title: react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("span", {
          style: {
            color: 'red'
          }
        }, "sss"),
        key: "random3"
      }), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(rc_tree_select__WEBPACK_IMPORTED_MODULE_5__["TreeNode"], {
        value: "same value1",
        title: "same txtle",
        key: "0-1-1-1"
      }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(rc_tree_select__WEBPACK_IMPORTED_MODULE_5__["TreeNode"], {
        value: "same value10",
        title: "same titlexd",
        key: "0-1-1-1-0",
        style: {
          color: 'red',
          background: 'green'
        }
      })))), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(rc_tree_select__WEBPACK_IMPORTED_MODULE_5__["TreeNode"], {
        value: "same value2",
        title: "same title",
        key: "0-2"
      }, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(rc_tree_select__WEBPACK_IMPORTED_MODULE_5__["TreeNode"], {
        value: "2same value",
        title: "2same title",
        key: "0-2-0"
      })), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(rc_tree_select__WEBPACK_IMPORTED_MODULE_5__["TreeNode"], {
        value: "same value3",
        title: "same title",
        key: "0-3"
      })));
    }
  }]);

  return Demo;
}(react__WEBPACK_IMPORTED_MODULE_1___default.a.Component);

react_dom__WEBPACK_IMPORTED_MODULE_2___default.a.render(react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(Demo, null), document.getElementById('__react-content'));

/***/ }),

/***/ "./node_modules/_rc-dialog@7.3.0@rc-dialog/es/Dialog.js":
/*!**************************************************************!*\
  !*** ./node_modules/_rc-dialog@7.3.0@rc-dialog/es/Dialog.js ***!
  \**************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! babel-runtime/helpers/extends */ "./node_modules/_babel-runtime@6.26.0@babel-runtime/helpers/extends.js");
/* harmony import */ var babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ "./node_modules/_babel-runtime@6.26.0@babel-runtime/helpers/classCallCheck.js");
/* harmony import */ var babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! babel-runtime/helpers/possibleConstructorReturn */ "./node_modules/_babel-runtime@6.26.0@babel-runtime/helpers/possibleConstructorReturn.js");
/* harmony import */ var babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! babel-runtime/helpers/inherits */ "./node_modules/_babel-runtime@6.26.0@babel-runtime/helpers/inherits.js");
/* harmony import */ var babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react */ "./node_modules/_react@16.8.6@react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-dom */ "./node_modules/_react-dom@16.8.6@react-dom/index.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var rc_util_es_KeyCode__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rc-util/es/KeyCode */ "./node_modules/_rc-util@4.6.0@rc-util/es/KeyCode.js");
/* harmony import */ var rc_util_es_Dom_contains__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rc-util/es/Dom/contains */ "./node_modules/_rc-util@4.6.0@rc-util/es/Dom/contains.js");
/* harmony import */ var rc_animate__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rc-animate */ "./node_modules/_rc-animate@2.6.0@rc-animate/es/Animate.js");
/* harmony import */ var _LazyRenderBox__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./LazyRenderBox */ "./node_modules/_rc-dialog@7.3.0@rc-dialog/es/LazyRenderBox.js");
/* harmony import */ var rc_util_es_getScrollBarSize__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! rc-util/es/getScrollBarSize */ "./node_modules/_rc-util@4.6.0@rc-util/es/getScrollBarSize.js");











var uuid = 0;
var openCount = 0;
/* eslint react/no-is-mounted:0 */
function getScroll(w, top) {
    var ret = w['page' + (top ? 'Y' : 'X') + 'Offset'];
    var method = 'scroll' + (top ? 'Top' : 'Left');
    if (typeof ret !== 'number') {
        var d = w.document;
        ret = d.documentElement[method];
        if (typeof ret !== 'number') {
            ret = d.body[method];
        }
    }
    return ret;
}
function setTransformOrigin(node, value) {
    var style = node.style;
    ['Webkit', 'Moz', 'Ms', 'ms'].forEach(function (prefix) {
        style[prefix + 'TransformOrigin'] = value;
    });
    style['transformOrigin'] = value;
}
function offset(el) {
    var rect = el.getBoundingClientRect();
    var pos = {
        left: rect.left,
        top: rect.top
    };
    var doc = el.ownerDocument;
    var w = doc.defaultView || doc.parentWindow;
    pos.left += getScroll(w);
    pos.top += getScroll(w, true);
    return pos;
}

var Dialog = function (_React$Component) {
    babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3___default()(Dialog, _React$Component);

    function Dialog() {
        babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default()(this, Dialog);

        var _this = babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(this, _React$Component.apply(this, arguments));

        _this.onAnimateLeave = function () {
            var afterClose = _this.props.afterClose;
            // need demo?
            // https://github.com/react-component/dialog/pull/28

            if (_this.wrap) {
                _this.wrap.style.display = 'none';
            }
            _this.inTransition = false;
            _this.removeScrollingEffect();
            if (afterClose) {
                afterClose();
            }
        };
        _this.onMaskClick = function (e) {
            // android trigger click on open (fastclick??)
            if (Date.now() - _this.openTime < 300) {
                return;
            }
            if (e.target === e.currentTarget) {
                _this.close(e);
            }
        };
        _this.onKeyDown = function (e) {
            var props = _this.props;
            if (props.keyboard && e.keyCode === rc_util_es_KeyCode__WEBPACK_IMPORTED_MODULE_6__["default"].ESC) {
                e.stopPropagation();
                _this.close(e);
                return;
            }
            // keep focus inside dialog
            if (props.visible) {
                if (e.keyCode === rc_util_es_KeyCode__WEBPACK_IMPORTED_MODULE_6__["default"].TAB) {
                    var activeElement = document.activeElement;
                    var sentinelStart = _this.sentinelStart;
                    if (e.shiftKey) {
                        if (activeElement === sentinelStart) {
                            _this.sentinelEnd.focus();
                        }
                    } else if (activeElement === _this.sentinelEnd) {
                        sentinelStart.focus();
                    }
                }
            }
        };
        _this.getDialogElement = function () {
            var props = _this.props;
            var closable = props.closable;
            var prefixCls = props.prefixCls;
            var dest = {};
            if (props.width !== undefined) {
                dest.width = props.width;
            }
            if (props.height !== undefined) {
                dest.height = props.height;
            }
            var footer = void 0;
            if (props.footer) {
                footer = react__WEBPACK_IMPORTED_MODULE_4__["createElement"]("div", { className: prefixCls + '-footer', ref: _this.saveRef('footer') }, props.footer);
            }
            var header = void 0;
            if (props.title) {
                header = react__WEBPACK_IMPORTED_MODULE_4__["createElement"]("div", { className: prefixCls + '-header', ref: _this.saveRef('header') }, react__WEBPACK_IMPORTED_MODULE_4__["createElement"]("div", { className: prefixCls + '-title', id: _this.titleId }, props.title));
            }
            var closer = void 0;
            if (closable) {
                closer = react__WEBPACK_IMPORTED_MODULE_4__["createElement"]("button", { onClick: _this.close, "aria-label": "Close", className: prefixCls + '-close' }, props.closeIcon || react__WEBPACK_IMPORTED_MODULE_4__["createElement"]("span", { className: prefixCls + '-close-x' }));
            }
            var style = babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0___default()({}, props.style, dest);
            var sentinelStyle = { width: 0, height: 0, overflow: 'hidden' };
            var transitionName = _this.getTransitionName();
            var dialogElement = react__WEBPACK_IMPORTED_MODULE_4__["createElement"](_LazyRenderBox__WEBPACK_IMPORTED_MODULE_9__["default"], { key: "dialog-element", role: "document", ref: _this.saveRef('dialog'), style: style, className: prefixCls + ' ' + (props.className || ''), visible: props.visible }, react__WEBPACK_IMPORTED_MODULE_4__["createElement"]("div", { tabIndex: 0, ref: _this.saveRef('sentinelStart'), style: sentinelStyle }, "sentinelStart"), react__WEBPACK_IMPORTED_MODULE_4__["createElement"]("div", { className: prefixCls + '-content' }, closer, header, react__WEBPACK_IMPORTED_MODULE_4__["createElement"]("div", babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0___default()({ className: prefixCls + '-body', style: props.bodyStyle, ref: _this.saveRef('body') }, props.bodyProps), props.children), footer), react__WEBPACK_IMPORTED_MODULE_4__["createElement"]("div", { tabIndex: 0, ref: _this.saveRef('sentinelEnd'), style: sentinelStyle }, "sentinelEnd"));
            return react__WEBPACK_IMPORTED_MODULE_4__["createElement"](rc_animate__WEBPACK_IMPORTED_MODULE_8__["default"], { key: "dialog", showProp: "visible", onLeave: _this.onAnimateLeave, transitionName: transitionName, component: "", transitionAppear: true }, props.visible || !props.destroyOnClose ? dialogElement : null);
        };
        _this.getZIndexStyle = function () {
            var style = {};
            var props = _this.props;
            if (props.zIndex !== undefined) {
                style.zIndex = props.zIndex;
            }
            return style;
        };
        _this.getWrapStyle = function () {
            return babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0___default()({}, _this.getZIndexStyle(), _this.props.wrapStyle);
        };
        _this.getMaskStyle = function () {
            return babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0___default()({}, _this.getZIndexStyle(), _this.props.maskStyle);
        };
        _this.getMaskElement = function () {
            var props = _this.props;
            var maskElement = void 0;
            if (props.mask) {
                var maskTransition = _this.getMaskTransitionName();
                maskElement = react__WEBPACK_IMPORTED_MODULE_4__["createElement"](_LazyRenderBox__WEBPACK_IMPORTED_MODULE_9__["default"], babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0___default()({ style: _this.getMaskStyle(), key: "mask", className: props.prefixCls + '-mask', hiddenClassName: props.prefixCls + '-mask-hidden', visible: props.visible }, props.maskProps));
                if (maskTransition) {
                    maskElement = react__WEBPACK_IMPORTED_MODULE_4__["createElement"](rc_animate__WEBPACK_IMPORTED_MODULE_8__["default"], { key: "mask", showProp: "visible", transitionAppear: true, component: "", transitionName: maskTransition }, maskElement);
                }
            }
            return maskElement;
        };
        _this.getMaskTransitionName = function () {
            var props = _this.props;
            var transitionName = props.maskTransitionName;
            var animation = props.maskAnimation;
            if (!transitionName && animation) {
                transitionName = props.prefixCls + '-' + animation;
            }
            return transitionName;
        };
        _this.getTransitionName = function () {
            var props = _this.props;
            var transitionName = props.transitionName;
            var animation = props.animation;
            if (!transitionName && animation) {
                transitionName = props.prefixCls + '-' + animation;
            }
            return transitionName;
        };
        _this.setScrollbar = function () {
            if (_this.bodyIsOverflowing && _this.scrollbarWidth !== undefined) {
                document.body.style.paddingRight = _this.scrollbarWidth + 'px';
            }
        };
        _this.addScrollingEffect = function () {
            openCount++;
            if (openCount !== 1) {
                return;
            }
            _this.checkScrollbar();
            _this.setScrollbar();
            document.body.style.overflow = 'hidden';
            // this.adjustDialog();
        };
        _this.removeScrollingEffect = function () {
            openCount--;
            if (openCount !== 0) {
                return;
            }
            document.body.style.overflow = '';
            _this.resetScrollbar();
            // this.resetAdjustments();
        };
        _this.close = function (e) {
            var onClose = _this.props.onClose;

            if (onClose) {
                onClose(e);
            }
        };
        _this.checkScrollbar = function () {
            var fullWindowWidth = window.innerWidth;
            if (!fullWindowWidth) {
                // workaround for missing window.innerWidth in IE8
                var documentElementRect = document.documentElement.getBoundingClientRect();
                fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left);
            }
            _this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth;
            if (_this.bodyIsOverflowing) {
                _this.scrollbarWidth = Object(rc_util_es_getScrollBarSize__WEBPACK_IMPORTED_MODULE_10__["default"])();
            }
        };
        _this.resetScrollbar = function () {
            document.body.style.paddingRight = '';
        };
        _this.adjustDialog = function () {
            if (_this.wrap && _this.scrollbarWidth !== undefined) {
                var modalIsOverflowing = _this.wrap.scrollHeight > document.documentElement.clientHeight;
                _this.wrap.style.paddingLeft = (!_this.bodyIsOverflowing && modalIsOverflowing ? _this.scrollbarWidth : '') + 'px';
                _this.wrap.style.paddingRight = (_this.bodyIsOverflowing && !modalIsOverflowing ? _this.scrollbarWidth : '') + 'px';
            }
        };
        _this.resetAdjustments = function () {
            if (_this.wrap) {
                _this.wrap.style.paddingLeft = _this.wrap.style.paddingLeft = '';
            }
        };
        _this.saveRef = function (name) {
            return function (node) {
                _this[name] = node;
            };
        };
        return _this;
    }

    Dialog.prototype.componentWillMount = function componentWillMount() {
        this.inTransition = false;
        this.titleId = 'rcDialogTitle' + uuid++;
    };

    Dialog.prototype.componentDidMount = function componentDidMount() {
        this.componentDidUpdate({});
        // if forceRender is true, set element style display to be none;
        if (this.props.forceRender && this.wrap) {
            this.wrap.style.display = 'none';
        }
    };

    Dialog.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
        var props = this.props;
        var mousePosition = this.props.mousePosition;
        if (props.visible) {
            // first show
            if (!prevProps.visible) {
                this.openTime = Date.now();
                this.addScrollingEffect();
                this.tryFocus();
                var dialogNode = react_dom__WEBPACK_IMPORTED_MODULE_5__["findDOMNode"](this.dialog);
                if (mousePosition) {
                    var elOffset = offset(dialogNode);
                    setTransformOrigin(dialogNode, mousePosition.x - elOffset.left + 'px ' + (mousePosition.y - elOffset.top) + 'px');
                } else {
                    setTransformOrigin(dialogNode, '');
                }
            }
        } else if (prevProps.visible) {
            this.inTransition = true;
            if (props.mask && this.lastOutSideFocusNode) {
                try {
                    this.lastOutSideFocusNode.focus();
                } catch (e) {
                    this.lastOutSideFocusNode = null;
                }
                this.lastOutSideFocusNode = null;
            }
        }
    };

    Dialog.prototype.componentWillUnmount = function componentWillUnmount() {
        if (this.props.visible || this.inTransition) {
            this.removeScrollingEffect();
        }
    };

    Dialog.prototype.tryFocus = function tryFocus() {
        if (!Object(rc_util_es_Dom_contains__WEBPACK_IMPORTED_MODULE_7__["default"])(this.wrap, document.activeElement)) {
            this.lastOutSideFocusNode = document.activeElement;
            this.sentinelStart.focus();
        }
    };

    Dialog.prototype.render = function render() {
        var props = this.props;
        var prefixCls = props.prefixCls,
            maskClosable = props.maskClosable;

        var style = this.getWrapStyle();
        // clear hide display
        // and only set display after async anim, not here for hide
        if (props.visible) {
            style.display = null;
        }
        return react__WEBPACK_IMPORTED_MODULE_4__["createElement"]("div", null, this.getMaskElement(), react__WEBPACK_IMPORTED_MODULE_4__["createElement"]("div", babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0___default()({ tabIndex: -1, onKeyDown: this.onKeyDown, className: prefixCls + '-wrap ' + (props.wrapClassName || ''), ref: this.saveRef('wrap'), onClick: maskClosable ? this.onMaskClick : undefined, role: "dialog", "aria-labelledby": props.title ? this.titleId : null, style: style }, props.wrapProps), this.getDialogElement()));
    };

    return Dialog;
}(react__WEBPACK_IMPORTED_MODULE_4__["Component"]);

/* harmony default export */ __webpack_exports__["default"] = (Dialog);

Dialog.defaultProps = {
    className: '',
    mask: true,
    visible: false,
    keyboard: true,
    closable: true,
    maskClosable: true,
    destroyOnClose: false,
    prefixCls: 'rc-dialog'
};

/***/ }),

/***/ "./node_modules/_rc-dialog@7.3.0@rc-dialog/es/DialogWrap.js":
/*!******************************************************************!*\
  !*** ./node_modules/_rc-dialog@7.3.0@rc-dialog/es/DialogWrap.js ***!
  \******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! babel-runtime/helpers/extends */ "./node_modules/_babel-runtime@6.26.0@babel-runtime/helpers/extends.js");
/* harmony import */ var babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ "./node_modules/_babel-runtime@6.26.0@babel-runtime/helpers/classCallCheck.js");
/* harmony import */ var babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! babel-runtime/helpers/possibleConstructorReturn */ "./node_modules/_babel-runtime@6.26.0@babel-runtime/helpers/possibleConstructorReturn.js");
/* harmony import */ var babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! babel-runtime/helpers/inherits */ "./node_modules/_babel-runtime@6.26.0@babel-runtime/helpers/inherits.js");
/* harmony import */ var babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react */ "./node_modules/_react@16.8.6@react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-dom */ "./node_modules/_react-dom@16.8.6@react-dom/index.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _Dialog__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Dialog */ "./node_modules/_rc-dialog@7.3.0@rc-dialog/es/Dialog.js");
/* harmony import */ var rc_util_es_ContainerRender__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rc-util/es/ContainerRender */ "./node_modules/_rc-util@4.6.0@rc-util/es/ContainerRender.js");
/* harmony import */ var rc_util_es_Portal__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rc-util/es/Portal */ "./node_modules/_rc-util@4.6.0@rc-util/es/Portal.js");









var IS_REACT_16 = 'createPortal' in react_dom__WEBPACK_IMPORTED_MODULE_5__;

var DialogWrap = function (_React$Component) {
    babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3___default()(DialogWrap, _React$Component);

    function DialogWrap() {
        babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default()(this, DialogWrap);

        var _this = babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(this, _React$Component.apply(this, arguments));

        _this.saveDialog = function (node) {
            _this._component = node;
        };
        _this.getComponent = function () {
            var extra = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            return react__WEBPACK_IMPORTED_MODULE_4__["createElement"](_Dialog__WEBPACK_IMPORTED_MODULE_6__["default"], babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0___default()({ ref: _this.saveDialog }, _this.props, extra, { key: "dialog" }));
        };
        // fix issue #10656
        /*
        * Custom container should not be return, because in the Portal component, it will remove the
        * return container element here, if the custom container is the only child of it's component,
        * like issue #10656, It will has a conflict with removeChild method in react-dom.
        * So here should add a child (div element) to custom container.
        * */
        _this.getContainer = function () {
            var container = document.createElement('div');
            if (_this.props.getContainer) {
                _this.props.getContainer().appendChild(container);
            } else {
                document.body.appendChild(container);
            }
            return container;
        };
        return _this;
    }

    DialogWrap.prototype.shouldComponentUpdate = function shouldComponentUpdate(_ref) {
        var visible = _ref.visible,
            forceRender = _ref.forceRender;

        return !!(this.props.visible || visible) || this.props.forceRender || forceRender;
    };

    DialogWrap.prototype.componentWillUnmount = function componentWillUnmount() {
        if (IS_REACT_16) {
            return;
        }
        if (this.props.visible) {
            this.renderComponent({
                afterClose: this.removeContainer,
                onClose: function onClose() {},

                visible: false
            });
        } else {
            this.removeContainer();
        }
    };

    DialogWrap.prototype.render = function render() {
        var _this2 = this;

        var _props = this.props,
            visible = _props.visible,
            forceRender = _props.forceRender;

        var portal = null;
        if (!IS_REACT_16) {
            return react__WEBPACK_IMPORTED_MODULE_4__["createElement"](rc_util_es_ContainerRender__WEBPACK_IMPORTED_MODULE_7__["default"], { parent: this, visible: visible, autoDestroy: false, getComponent: this.getComponent, getContainer: this.getContainer, forceRender: forceRender }, function (_ref2) {
                var renderComponent = _ref2.renderComponent,
                    removeContainer = _ref2.removeContainer;

                _this2.renderComponent = renderComponent;
                _this2.removeContainer = removeContainer;
                return null;
            });
        }
        if (visible || forceRender || this._component) {
            portal = react__WEBPACK_IMPORTED_MODULE_4__["createElement"](rc_util_es_Portal__WEBPACK_IMPORTED_MODULE_8__["default"], { getContainer: this.getContainer }, this.getComponent());
        }
        return portal;
    };

    return DialogWrap;
}(react__WEBPACK_IMPORTED_MODULE_4__["Component"]);

DialogWrap.defaultProps = {
    visible: false,
    forceRender: false
};
/* harmony default export */ __webpack_exports__["default"] = (DialogWrap);

/***/ }),

/***/ "./node_modules/_rc-dialog@7.3.0@rc-dialog/es/LazyRenderBox.js":
/*!*********************************************************************!*\
  !*** ./node_modules/_rc-dialog@7.3.0@rc-dialog/es/LazyRenderBox.js ***!
  \*********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! babel-runtime/helpers/extends */ "./node_modules/_babel-runtime@6.26.0@babel-runtime/helpers/extends.js");
/* harmony import */ var babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ "./node_modules/_babel-runtime@6.26.0@babel-runtime/helpers/classCallCheck.js");
/* harmony import */ var babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! babel-runtime/helpers/possibleConstructorReturn */ "./node_modules/_babel-runtime@6.26.0@babel-runtime/helpers/possibleConstructorReturn.js");
/* harmony import */ var babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! babel-runtime/helpers/inherits */ "./node_modules/_babel-runtime@6.26.0@babel-runtime/helpers/inherits.js");
/* harmony import */ var babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react */ "./node_modules/_react@16.8.6@react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_4__);






var LazyRenderBox = function (_React$Component) {
    babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3___default()(LazyRenderBox, _React$Component);

    function LazyRenderBox() {
        babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1___default()(this, LazyRenderBox);

        return babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(this, _React$Component.apply(this, arguments));
    }

    LazyRenderBox.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
        return !!nextProps.hiddenClassName || !!nextProps.visible;
    };

    LazyRenderBox.prototype.render = function render() {
        var className = this.props.className;
        if (!!this.props.hiddenClassName && !this.props.visible) {
            className += " " + this.props.hiddenClassName;
        }
        var props = babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0___default()({}, this.props);
        delete props.hiddenClassName;
        delete props.visible;
        props.className = className;
        return react__WEBPACK_IMPORTED_MODULE_4__["createElement"]("div", babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0___default()({}, props));
    };

    return LazyRenderBox;
}(react__WEBPACK_IMPORTED_MODULE_4__["Component"]);

/* harmony default export */ __webpack_exports__["default"] = (LazyRenderBox);

/***/ }),

/***/ "./node_modules/_rc-util@4.6.0@rc-util/es/getScrollBarSize.js":
/*!********************************************************************!*\
  !*** ./node_modules/_rc-util@4.6.0@rc-util/es/getScrollBarSize.js ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return getScrollBarSize; });
var cached = void 0;

function getScrollBarSize(fresh) {
  if (fresh || cached === undefined) {
    var inner = document.createElement('div');
    inner.style.width = '100%';
    inner.style.height = '200px';

    var outer = document.createElement('div');
    var outerStyle = outer.style;

    outerStyle.position = 'absolute';
    outerStyle.top = 0;
    outerStyle.left = 0;
    outerStyle.pointerEvents = 'none';
    outerStyle.visibility = 'hidden';
    outerStyle.width = '200px';
    outerStyle.height = '150px';
    outerStyle.overflow = 'hidden';

    outer.appendChild(inner);

    document.body.appendChild(outer);

    var widthContained = inner.offsetWidth;
    outer.style.overflow = 'scroll';
    var widthScroll = inner.offsetWidth;

    if (widthContained === widthScroll) {
      widthScroll = outer.clientWidth;
    }

    document.body.removeChild(outer);

    cached = widthContained - widthScroll;
  }
  return cached;
}

/***/ }),

/***/ 0:
/*!*********************************!*\
  !*** multi ./examples/basic.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./examples/basic.js */"./examples/basic.js");


/***/ })

/******/ });
//# sourceMappingURL=basic.js.map