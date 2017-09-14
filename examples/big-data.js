webpackJsonp([2],{

/***/ 192:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_toConsumableArray__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_toConsumableArray___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_toConsumableArray__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rc_tree_select_assets_index_less__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rc_tree_select_assets_index_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rc_tree_select_assets_index_less__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__demo_less__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__demo_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__demo_less__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_react__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_react_dom__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_rc_tree_select__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__big_data_generator__ = __webpack_require__(222);





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
      gData: [],
      gData1: [],
      value: '',
      value1: ''
    }, _this.onChange = function (value) {
      console.log('onChange', _arguments);
      _this.setState({ value: value });
    }, _this.onChangeStrictly = function (value1) {
      console.log('onChangeStrictly', _arguments);
      var ind = parseInt(Math.random() * 3, 10);
      value1.push({ value: '0-0-0-' + ind + '-value', label: '0-0-0-' + ind + '-label', halfChecked: true });
      _this.setState({
        value1: value1
      });
    }, _this.onGen = function (data) {
      _this.setState({
        gData: data,
        gData1: [].concat(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_toConsumableArray___default()(data)),
        value: '0-0-0-value',
        value1: [{ value: '0-0-value', label: '0-0-label', halfChecked: true }, { value: '0-0-0-value', label: '0-0-0-label' }]
        // value: ['0-0-0-0-value', '0-0-0-1-value', '0-0-0-2-value'],
      });
    }, _temp), __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(_this, _ret);
  }

  __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default()(Demo, [{
    key: 'render',
    value: function render() {
      return __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
        'div',
        { style: { padding: '0 20px' } },
        __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_10__big_data_generator__["a" /* default */], { onGen: this.onGen }),
        __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
          'div',
          { style: { display: 'flex' } },
          __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
            'div',
            { style: { marginRight: 20 } },
            __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
              'h3',
              null,
              'normal check'
            ),
            __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_9_rc_tree_select__["a" /* default */], {
              style: { width: 300 },
              dropdownStyle: { maxHeight: 200, overflow: 'auto' },
              treeData: this.state.gData, treeLine: true,
              value: this.state.value,
              placeholder: __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                'i',
                null,
                '\u8BF7\u4E0B\u62C9\u9009\u62E9'
              ),
              treeCheckable: true,
              showCheckedStrategy: __WEBPACK_IMPORTED_MODULE_9_rc_tree_select__["b" /* SHOW_PARENT */],
              onChange: this.onChange
            })
          ),
          __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
            'div',
            null,
            __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
              'h3',
              null,
              'checkStrictly'
            ),
            __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_9_rc_tree_select__["a" /* default */], {
              style: { width: 300 },
              dropdownStyle: { maxHeight: 200, overflow: 'auto' },
              treeData: this.state.gData1, treeLine: true,
              value: this.state.value1,
              placeholder: __WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(
                'i',
                null,
                '\u8BF7\u4E0B\u62C9\u9009\u62E9'
              ),
              treeCheckable: true,
              treeCheckStrictly: true,
              showCheckedStrategy: __WEBPACK_IMPORTED_MODULE_9_rc_tree_select__["b" /* SHOW_PARENT */],
              onChange: this.onChangeStrictly
            })
          )
        )
      );
    }
  }]);

  return Demo;
}(__WEBPACK_IMPORTED_MODULE_7_react___default.a.Component);

__WEBPACK_IMPORTED_MODULE_8_react_dom___default.a.render(__WEBPACK_IMPORTED_MODULE_7_react___default.a.createElement(Demo, null), document.getElementById('__react-content'));

/***/ }),

/***/ 222:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_prop_types__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__util__ = __webpack_require__(26);








var Gen = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits___default()(Gen, _React$Component);

  function Gen() {
    var _ref;

    var _temp, _this, _ret;

    __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default()(this, Gen);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn___default()(this, (_ref = Gen.__proto__ || Object.getPrototypeOf(Gen)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      nums: ''
    }, _this.onGen = function (e) {
      e.preventDefault();
      var vals = _this.getVals();
      _this.props.onGen(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__util__["d" /* generateData */])(vals.x, vals.y, vals.z));
      _this.setState({
        nums: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__util__["e" /* calcTotal */])(vals.x, vals.y, vals.z)
      });
    }, _this.getVals = function () {
      return {
        x: parseInt(_this.refs.x.value, 10),
        y: parseInt(_this.refs.y.value, 10),
        z: parseInt(_this.refs.z.value, 10)
      };
    }, _temp), __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn___default()(_this, _ret);
  }

  __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass___default()(Gen, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var vals = this.getVals();
      this.props.onGen(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__util__["d" /* generateData */])(vals.x, vals.y, vals.z));
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          x = _props.x,
          y = _props.y,
          z = _props.z;

      return __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
        'div',
        { style: { padding: '0 20px' } },
        __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
          'h2',
          null,
          'big data generator'
        ),
        __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
          'form',
          { onSubmit: this.onGen },
          __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
            'span',
            { style: { marginRight: 10 } },
            'x: ',
            __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement('input', { ref: 'x', defaultValue: x, type: 'number', min: '1', required: true, style: { width: 50 } })
          ),
          __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
            'span',
            { style: { marginRight: 10 } },
            'y: ',
            __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement('input', { ref: 'y', defaultValue: y, type: 'number', min: '1', required: true, style: { width: 50 } })
          ),
          __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
            'span',
            { style: { marginRight: 10 } },
            'z: ',
            __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement('input', { ref: 'z', defaultValue: z, type: 'number', min: '1', required: true, style: { width: 50 } })
          ),
          __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
            'button',
            { type: 'submit' },
            'Generate'
          ),
          __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
            'p',
            null,
            'total nodes: ',
            this.state.nums || __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__util__["e" /* calcTotal */])(x, y, z)
          )
        ),
        __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
          'p',
          { style: { fontSize: 12 } },
          'x\uFF1A\u6BCF\u4E00\u7EA7\u4E0B\u7684\u8282\u70B9\u603B\u6570\u3002y\uFF1A\u6BCF\u7EA7\u8282\u70B9\u91CC\u6709y\u4E2A\u8282\u70B9\u3001\u5B58\u5728\u5B50\u8282\u70B9\u3002z\uFF1A\u6811\u7684level\u5C42\u7EA7\u6570\uFF080\u8868\u793A\u4E00\u7EA7\uFF09'
        )
      );
    }
  }]);

  return Gen;
}(__WEBPACK_IMPORTED_MODULE_4_react___default.a.Component);

Gen.propTypes = {
  onGen: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.func,
  x: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.number,
  y: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.number,
  z: __WEBPACK_IMPORTED_MODULE_5_prop_types___default.a.number
};
Gen.defaultProps = {
  onGen: function onGen() {},
  x: 20,
  y: 18,
  z: 1
};


/* harmony default export */ __webpack_exports__["a"] = (Gen);

/***/ }),

/***/ 26:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["d"] = generateData;
/* harmony export (immutable) */ __webpack_exports__["e"] = calcTotal;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return gData; });
/* harmony export (immutable) */ __webpack_exports__["c"] = generateTreeNodes;
/* harmony export (immutable) */ __webpack_exports__["b"] = getNewTreeData;
/* unused harmony export getFilterValue */
/* eslint no-loop-func: 0, no-console: 0 */

function generateData() {
  var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;
  var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var gData = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

  // x：每一级下的节点总数。y：每级节点里有y个节点、存在子节点。z：树的level层级数（0表示一级）
  function _loop(_level, _preKey, _tns) {
    var preKey = _preKey || '0';
    var tns = _tns || gData;

    var children = [];
    for (var i = 0; i < x; i++) {
      var key = preKey + '-' + i;
      tns.push({
        label: key + '-label',
        value: key + '-value',
        key: key,
        disabled: key === '0-0-0-1' || false
      });
      if (i < y) {
        children.push(key);
      }
    }
    if (_level < 0) {
      return tns;
    }
    var __level = _level - 1;
    children.forEach(function (key, index) {
      tns[index].children = [];
      return _loop(__level, key, tns[index].children);
    });
  }
  _loop(z);
  return gData;
}
function calcTotal() {
  var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;
  var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

  /* eslint no-param-reassign:0*/
  var rec = function rec(n) {
    return n >= 0 ? x * Math.pow(y, n--) + rec(n) : 0;
  };
  return rec(z + 1);
}
console.log('总节点数（单个tree）：', calcTotal());
var gData = generateData();

function generateTreeNodes(treeNode) {
  var arr = [];
  var key = treeNode.props.eventKey;
  for (var i = 0; i < 3; i++) {
    arr.push({ label: key + '-' + i + '-label', value: key + '-' + i + '-value', key: key + '-' + i });
  }
  return arr;
}

function setLeaf(treeData, curKey, level) {
  var loopLeaf = function loopLeaf(data, lev) {
    var l = lev - 1;
    data.forEach(function (item) {
      if (item.key.length > curKey.length ? item.key.indexOf(curKey) !== 0 : curKey.indexOf(item.key) !== 0) {
        return;
      }
      if (item.children) {
        loopLeaf(item.children, l);
      } else if (l < 1) {
        item.isLeaf = true;
      }
    });
  };
  loopLeaf(treeData, level + 1);
}

function getNewTreeData(treeData, curKey, child, level) {
  var loop = function loop(data) {
    if (level < 1 || curKey.length - 3 > level * 2) return;
    data.forEach(function (item) {
      if (curKey.indexOf(item.key) === 0) {
        if (item.children) {
          loop(item.children);
        } else {
          item.children = child;
        }
      }
    });
  };
  loop(treeData);
  setLeaf(treeData, curKey, level);
}

function loopData(data, callback) {
  var loop = function loop(d) {
    var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    d.forEach(function (item, index) {
      var pos = level + '-' + index;
      if (item.children) {
        loop(item.children, pos);
      }
      callback(item, index, pos);
    });
  };
  loop(data);
}

function isInclude(smallArray, bigArray) {
  return smallArray.every(function (ii, i) {
    return ii === bigArray[i];
  });
}
// console.log(isInclude(['0', '1'], ['0', '10', '1']));

function getFilterValue(val, sVal, delVal) {
  var allPos = [];
  var delPos = [];
  loopData(gData, function (item, index, pos) {
    if (sVal.indexOf(item.value) > -1) {
      allPos.push(pos);
    }
    if (delVal.indexOf(item.value) > -1) {
      delPos.push(pos);
    }
  });
  var newPos = [];
  delPos.forEach(function (item) {
    var nArr = item.split('-');
    allPos.forEach(function (i) {
      var iArr = i.split('-');
      if (item === i || nArr.length > iArr.length && isInclude(iArr, nArr) || nArr.length < iArr.length && isInclude(nArr, iArr)) {
        // 过滤掉 父级节点 和 所有子节点。
        // 因为 node节点 不选时，其 父级节点 和 所有子节点 都不选。
        return;
      }
      newPos.push(i);
    });
  });
  var newVal = [];
  if (newPos.length) {
    loopData(gData, function (item, index, pos) {
      if (newPos.indexOf(pos) > -1) {
        newVal.push(item.value);
      }
    });
  }
  return newVal;
}

/***/ }),

/***/ 473:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(192);


/***/ }),

/***/ 54:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},[473]);
//# sourceMappingURL=big-data.js.map