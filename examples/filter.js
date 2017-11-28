webpackJsonp([3],{

/***/ 16:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["c"] = generateData;
/* harmony export (immutable) */ __webpack_exports__["a"] = calcTotal;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return gData; });
/* harmony export (immutable) */ __webpack_exports__["d"] = generateTreeNodes;
/* harmony export (immutable) */ __webpack_exports__["e"] = getNewTreeData;
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

function isPositionPrefix(smallPos, bigPos) {
  if (bigPos.length < smallPos.length) {
    return false;
  }
  // attention: "0-0-1" "0-0-10"
  if (bigPos.length > smallPos.length && bigPos.charAt(smallPos.length) !== '-') {
    return false;
  }
  return bigPos.substr(0, smallPos.length) === smallPos;
}
// console.log(isPositionPrefix("0-1", "0-10-1"));

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
    allPos.forEach(function (i) {
      if (isPositionPrefix(item, i) || isPositionPrefix(i, item)) {
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

/***/ 223:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(224);


/***/ }),

/***/ 224:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rc_tree_select_assets_index_less__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rc_tree_select_assets_index_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_rc_tree_select_assets_index_less__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_dom__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rc_tree_select__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__util__ = __webpack_require__(16);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* eslint react/no-multi-comp:0, no-console:0 */







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
      var data = [].concat(_this.state.simpleTreeData);
      data.forEach(function (i) {
        if (i.key === 11) {
          delete i.disabled;
        }
        if (i.key === 20) {
          i.disabled = true;
        }
      });
      _this.setState({ simpleTreeData: data });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  Demo.prototype.render = function render() {
    return __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(
      'div',
      { style: { margin: 20 } },
      __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(
        'h2',
        null,
        'check select'
      ),
      __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3_rc_tree_select__["c" /* default */], {
        style: { width: 300 },
        transitionName: 'rc-tree-select-dropdown-slide-up',
        choiceTransitionName: 'rc-tree-select-selection__choice-zoom',
        dropdownStyle: { height: 200, overflow: 'auto' },
        dropdownPopupAlign: { overflow: { adjustY: 0, adjustX: 0 }, offset: [0, 2] },
        placeholder: __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(
          'i',
          null,
          '\u8BF7\u4E0B\u62C9\u9009\u62E9'
        ),
        searchPlaceholder: 'please search',
        treeLine: true, maxTagTextLength: 10,
        value: this.state.value,
        treeData: __WEBPACK_IMPORTED_MODULE_4__util__["b" /* gData */],
        treeNodeFilterProp: 'title',
        treeCheckable: true,
        onChange: this.onChange,
        onSelect: this.onSelect
      }),
      __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(
        'h2',
        null,
        'use treeDataSimpleMode'
      ),
      __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3_rc_tree_select__["c" /* default */], {
        style: { width: 300 },
        dropdownStyle: { maxHeight: 200, overflow: 'auto' },
        placeholder: __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(
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
        treeCheckable: true, showCheckedStrategy: __WEBPACK_IMPORTED_MODULE_3_rc_tree_select__["a" /* SHOW_PARENT */],
        onChange: this.onChange,
        onSelect: this.onSelect
      }),
      __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(
        'button',
        { onClick: this.onDataChange },
        'change data'
      )
    );
  };

  return Demo;
}(__WEBPACK_IMPORTED_MODULE_1_react___default.a.Component);

__WEBPACK_IMPORTED_MODULE_2_react_dom___default.a.render(__WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(Demo, null), document.getElementById('__react-content'));

/***/ })

},[223]);
//# sourceMappingURL=filter.js.map