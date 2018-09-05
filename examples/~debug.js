webpackJsonp([8],{

/***/ 12:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 354:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(355);


/***/ }),

/***/ 355:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rc_tree_select_assets_index_less__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rc_tree_select_assets_index_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rc_tree_select_assets_index_less__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react_dom__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rc_dialog_assets_index_css__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rc_dialog_assets_index_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_rc_dialog_assets_index_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rc_tree_select__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__demo_less__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__demo_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9__demo_less__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__src__ = __webpack_require__(85);




/* eslint-disable */









var dataSource = {
  "result": 1,
  "categoryList": [{
    "categoryId": 0,
    "parentCategoryId": -1,
    "categoryName": "未知",
    "isLeaf": 0,
    "path": "0",
    "children": null
  }, {
    "categoryId": 1,
    "parentCategoryId": -1,
    "categoryName": "美妆",
    "isLeaf": 0,
    "path": "1",
    "children": [{
      "categoryId": 103,
      "parentCategoryId": 1,
      "categoryName": "美妆产品购买攻略",
      "isLeaf": 0,
      "path": "1,103",
      "children": [{
        "categoryId": 10301,
        "parentCategoryId": 103,
        "categoryName": "种草攻略",
        "isLeaf": 1,
        "path": "1,103,10301",
        "children": null
      }, {
        "categoryId": 10302,
        "parentCategoryId": 103,
        "categoryName": "购买地点",
        "isLeaf": 1,
        "path": "1,103,10302",
        "children": null
      }, {
        "categoryId": 10303,
        "parentCategoryId": 103,
        "categoryName": "其他",
        "isLeaf": 1,
        "path": "1,103,10303",
        "children": null
      }]
    }, {
      "categoryId": 104,
      "parentCategoryId": 1,
      "categoryName": "男士护肤",
      "isLeaf": 1,
      "path": "1,104",
      "children": null
    }, {
      "categoryId": 105,
      "parentCategoryId": 1,
      "categoryName": "秀晒炫",
      "isLeaf": 1,
      "path": "1,105",
      "children": null
    }, {
      "categoryId": 106,
      "parentCategoryId": 1,
      "categoryName": "其他",
      "isLeaf": 1,
      "path": "1,106",
      "children": null
    }, {
      "categoryId": 107,
      "parentCategoryId": 1,
      "categoryName": "保健品",
      "isLeaf": 1,
      "path": "1,107",
      "children": null
    }]
  }]
};

var Demo = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits___default()(Demo, _React$Component);

  function Demo() {
    var _ref;

    var _temp, _this, _ret;

    __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default()(this, Demo);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn___default()(this, (_ref = Demo.__proto__ || Object.getPrototypeOf(Demo)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      value: undefined
    }, _this.onChange = function (value) {
      console.log(value);
      _this.setState({ value: value });
    }, _temp), __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn___default()(_this, _ret);
  }

  __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass___default()(Demo, [{
    key: 'render',
    value: function render() {
      var loop = function loop(data) {
        return data.map(function (item) {
          var categoryId = item.categoryId,
              categoryName = item.categoryName,
              children = item.children,
              isLeaf = item.isLeaf,
              path = item.path;


          if (children && children.length) {
            return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_8_rc_tree_select__["b" /* TreeNode */],
              {
                key: categoryId,
                value: categoryId + '-' + path,
                title: categoryName
                // isLeaf={Boolean(isLeaf)}
                , disabled: !Boolean(isLeaf),
                disableCheckbox: true
              },
              loop(children)
            );
          }
          return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_8_rc_tree_select__["b" /* TreeNode */], {
            key: categoryId,
            value: categoryId + '-' + path,
            title: categoryName
            // isLeaf={Boolean(isLeaf)}
            , disabled: !Boolean(isLeaf),
            disableCheckbox: true
          });
        });
      };
      return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'div',
        { style: { paddingTop: 600 } },
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_8_rc_tree_select__["c" /* default */],
          {
            showSearch: true,
            style: { width: 300 },
            dropdownStyle: { maxHeight: 400, overflow: "auto" },
            treeDefaultExpandAll: true,
            placeholder: 'Please select',
            allowClear: true,
            multiple: true,
            treeNodeFilterProp: 'title'
          },
          loop(dataSource.categoryList)
        )
      );
    }
  }]);

  return Demo;
}(__WEBPACK_IMPORTED_MODULE_5_react___default.a.Component);

__WEBPACK_IMPORTED_MODULE_6_react_dom___default.a.render(__WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(Demo, null), document.getElementById('__react-content'));

/***/ }),

/***/ 9:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},[354]);
//# sourceMappingURL=~debug.js.map