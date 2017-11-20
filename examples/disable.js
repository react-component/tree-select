webpackJsonp([5],{

/***/ 220:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(221);


/***/ }),

/***/ 221:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rc_tree_select_assets_index_less__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rc_tree_select_assets_index_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_rc_tree_select_assets_index_less__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rc_tree_select__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_dom__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_react_dom__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* eslint react/no-multi-comp:0, no-console:0 */





var SHOW_PARENT = __WEBPACK_IMPORTED_MODULE_1_rc_tree_select__["c" /* default */].SHOW_PARENT;

var treeData = [{
  label: 'Node1',
  value: '0-0',
  key: '0-0',
  children: [{
    label: 'Child Node1',
    value: '0-0-0',
    key: '0-0-0'
  }]
}, {
  label: 'Node2',
  value: '0-1',
  key: '0-1',
  children: [{
    label: 'Child Node3',
    value: '0-1-0',
    key: '0-1-0'
  }, {
    label: 'Child Node4',
    value: '0-1-1',
    key: '0-1-1'
  }, {
    label: 'Child Node5',
    value: '0-1-2',
    key: '0-1-2'
  }]
}];

var Demo = function (_React$Component) {
  _inherits(Demo, _React$Component);

  function Demo() {
    var _arguments = arguments;

    var _temp, _this, _ret;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _classCallCheck(this, Demo);

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {
      value: ['0-0-0'],
      disabled: false
    }, _this.onChange = function (value) {
      console.log('onChange ', value, _arguments);
      _this.setState({ value: value });
    }, _this['switch'] = function (checked) {
      _this.setState({ disabled: checked });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  Demo.prototype.render = function render() {
    var _this2 = this;

    var tProps = {
      treeData: treeData,
      disabled: this.state.disabled,
      value: this.state.value,
      onChange: this.onChange,
      multiple: true,
      allowClear: true,
      treeCheckable: true,
      showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: 'Please select',
      style: {
        width: 300
      }
    };
    return __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(
      'div',
      null,
      __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1_rc_tree_select__["c" /* default */], tProps),
      __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement('input', { type: 'checkbox', onChange: function onChange(e) {
          return _this2['switch'](e.target.checked);
        } }),
      ' \u7981\u7528'
    );
  };

  return Demo;
}(__WEBPACK_IMPORTED_MODULE_2_react___default.a.Component);

__WEBPACK_IMPORTED_MODULE_3_react_dom___default.a.render(__WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(Demo, null), document.getElementById('__react-content'));

/***/ })

},[220]);
//# sourceMappingURL=disable.js.map