webpackJsonp([3],{

/***/ 172:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_toConsumableArray__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_toConsumableArray___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_toConsumableArray__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rc_tree_select_assets_index_less__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rc_tree_select_assets_index_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rc_tree_select_assets_index_less__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_react_dom__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rc_tree_select__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__util__ = __webpack_require__(47);





/* eslint react/no-multi-comp:0, no-console:0 */







var Demo = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default()(Demo, _React$Component);

  function Demo() {
    var _ref,
        _arguments = arguments;

    var _temp, _this, _ret;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default()(this, Demo);

    return _ret = (_temp = (_this = __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(this, (_ref = Demo.__proto__ || Object.getPrototypeOf(Demo)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      value: '11',
      // value: ['0-0-0-0-value', '0-0-0-1-value', '0-0-0-2-value'],
      simpleTreeData: [{ key: 1, pId: 0, label: 'a', value: 'a' }, { key: 11, pId: 1, label: 'a12', value: 'a12', disabled: true }, { key: 111, pId: 11, label: 'a00', value: 'a00', selectable: false }, { key: 2, pId: 0, label: 'b', value: 'b' }, { key: 20, pId: 2, label: 'b10', value: 'b10' }, { key: 21, pId: 2, label: 'b1', value: 'b1' }, { key: 22, pId: 2, label: 'b12', value: 'b12' }],
      treeDataSimpleMode: {
        id: 'key',
        rootPId: 0
      }
    }, _this.onChange = function (value) {
      if (value.length === 1) {
        // return;
      }
      console.log('onChange', _arguments, _this.state.simpleTreeData);
      _this.setState({ value: value });
    }, _this.onSelect = function () {
      // use onChange instead
      // console.log(arguments);
    }, _this.onDataChange = function () {
      var data = [].concat(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_toConsumableArray___default()(_this.state.simpleTreeData));
      data.forEach(function (i) {
        if (i.key === 11) {
          delete i.disabled;
        }
        if (i.key === 20) {
          i.disabled = true;
        }
      });
      _this.setState({ simpleTreeData: data });
    }, _temp), __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(_this, _ret);
  }

  __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default()(Demo, [{
    key: 'render',
    value: function render() {
      return __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
        'div',
        { style: { margin: 20 } },
        __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
          'h2',
          null,
          'check select'
        ),
        __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_8_rc_tree_select__["a" /* default */], {
          style: { width: 300 },
          transitionName: 'rc-tree-select-dropdown-slide-up',
          choiceTransitionName: 'rc-tree-select-selection__choice-zoom',
          dropdownStyle: { height: 200, overflow: 'auto' },
          dropdownPopupAlign: { overflow: { adjustY: 0, adjustX: 0 }, offset: [0, 2] },
          placeholder: __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
            'i',
            null,
            '\u8BF7\u4E0B\u62C9\u9009\u62E9'
          ),
          searchPlaceholder: 'please search',
          treeLine: true, maxTagTextLength: 10,
          value: this.state.value,
          treeData: __WEBPACK_IMPORTED_MODULE_9__util__["a" /* gData */],
          treeNodeFilterProp: 'title',
          treeCheckable: true,
          onChange: this.onChange,
          onSelect: this.onSelect
        }),
        __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
          'h2',
          null,
          'use treeDataSimpleMode'
        ),
        __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_8_rc_tree_select__["a" /* default */], {
          style: { width: 300 },
          dropdownStyle: { maxHeight: 200, overflow: 'auto' },
          placeholder: __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
            'i',
            null,
            '\u8BF7\u4E0B\u62C9\u9009\u62E9'
          ),
          searchPlaceholder: 'please search',
          treeLine: true, maxTagTextLength: 10,
          inputValue: null,
          value: this.state.value,
          treeData: this.state.simpleTreeData,
          treeDefaultExpandAll: true,
          treeNodeFilterProp: 'title',
          treeDataSimpleMode: this.state.treeDataSimpleMode,
          treeCheckable: true, showCheckedStrategy: __WEBPACK_IMPORTED_MODULE_8_rc_tree_select__["SHOW_PARENT"],
          onChange: this.onChange,
          onSelect: this.onSelect
        }),
        __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
          'button',
          { onClick: this.onDataChange },
          'change data'
        )
      );
    }
  }]);

  return Demo;
}(__WEBPACK_IMPORTED_MODULE_6_react___default.a.Component);

__WEBPACK_IMPORTED_MODULE_7_react_dom___default.a.render(__WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(Demo, null), document.getElementById('__react-content'));

/***/ }),

/***/ 413:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(172);


/***/ })

},[413]);
//# sourceMappingURL=filter.js.map