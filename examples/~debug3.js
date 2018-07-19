webpackJsonp([4],{

/***/ 10:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 17:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 352:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(353);


/***/ }),

/***/ 353:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rc_tree_select_assets_index_less__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rc_tree_select_assets_index_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rc_tree_select_assets_index_less__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react_dom__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rc_dialog_assets_index_css__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rc_dialog_assets_index_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_rc_dialog_assets_index_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rc_tree_select__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__demo_less__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__demo_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9__demo_less__);




/* eslint react/no-multi-comp:0, no-console:0, no-alert: 0 */








var TreeNode = __WEBPACK_IMPORTED_MODULE_8_rc_tree_select__["c" /* default */].TreeNode;

var Demo = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits___default()(Demo, _React$Component);

  function Demo() {
    var _arguments = arguments;

    var _temp, _this, _ret;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default()(this, Demo);

    return _ret = (_temp = (_this = __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn___default()(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {
      value: undefined,
      treeData: []
    }, _this.componentWillMount = function () {
      _this.onChangeData({ target: { value: '1' } });
    }, _this.onChangeData = function (_ref) {
      var value = _ref.target.value;

      if (value === '1') {
        _this.setState({
          treeData: [{ title: 'load 0', key: '0' }, { title: 'load 1', key: '1' }]
        });
      } else {
        _this.setState({
          treeData: [{ title: 'load a', key: 'a' }, { title: 'load b', key: 'b' }]
        });
      }
    }, _this.onChange = function (_ref2) {
      var value = _ref2.target.value;

      console.log(_arguments);
      _this.setState({ value: value });
    }, _this.onLoadData = function (treeNode) {
      return new Promise(function (resolve) {
        if (treeNode.props.loaded) {
          resolve();
          return;
        }
        setTimeout(function () {
          treeNode.props.dataRef.children = [{ title: 'Child Node', key: treeNode.props.eventKey + '-0' }, { title: 'Child Node', key: treeNode.props.eventKey + '-1' }];
          _this.setState({
            treeData: [].concat(_this.state.treeData)
          });
          resolve();
        }, 1000);
      });
    }, _this.renderTreeNodes = function (data) {
      return data.map(function (item) {
        if (item.children) {
          return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
            TreeNode,
            { title: item.title, key: item.key, dataRef: item },
            _this.renderTreeNodes(item.children)
          );
        }
        return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(TreeNode, __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, item, { dataRef: item }));
      });
    }, _temp), __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn___default()(_this, _ret);
  }

  Demo.prototype.render = function render() {
    return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
      'div',
      null,
      __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'select',
        { defaultValue: '1', style: { width: 120 }, onChange: this.onChangeData },
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'option',
          { value: '1' },
          '\u6570\u636E1'
        ),
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'option',
          { value: '2' },
          '\u6570\u636E2'
        )
      ),
      __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement('br', null),
      __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement('br', null),
      __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        __WEBPACK_IMPORTED_MODULE_8_rc_tree_select__["c" /* default */],
        {
          style: { width: 300 },
          value: this.state.value,
          dropdownStyle: { maxHeight: 400, overflow: 'auto' },
          loadData: this.onLoadData,
          placeholder: 'Please select',
          onChange: this.onChange
        },
        this.renderTreeNodes(this.state.treeData)
      )
    );
  };

  return Demo;
}(__WEBPACK_IMPORTED_MODULE_5_react___default.a.Component);

__WEBPACK_IMPORTED_MODULE_6_react_dom___default.a.render(__WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(Demo, null), document.getElementById('__react-content'));

/***/ })

},[352]);
//# sourceMappingURL=~debug3.js.map