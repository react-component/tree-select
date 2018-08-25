webpackJsonp([2],{

/***/ 13:
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

    return null;
  }
  _loop(z);
  return gData;
}
function calcTotal() {
  var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;
  var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

  /* eslint no-param-reassign:0 */
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

/***/ 246:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(247);


/***/ }),

/***/ 247:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rc_tree_select_assets_index_less__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rc_tree_select_assets_index_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rc_tree_select_assets_index_less__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_dom__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rc_dialog_assets_index_css__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rc_dialog_assets_index_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rc_dialog_assets_index_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rc_tree_select__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__util__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__demo_less__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__demo_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7__demo_less__);

/* eslint react/no-multi-comp:0, no-console:0, no-alert: 0 */









var bubblePath = 'M632 888H392c-4.4 0-8 3.6-8 8v32c0 ' + '17.7 14.3 32 32 32h192c17.7 0 32-14.3 32-32v-3' + '2c0-4.4-3.6-8-8-8zM512 64c-181.1 0-328 146.9-3' + '28 328 0 121.4 66 227.4 164 284.1V792c0 17.7 1' + '4.3 32 32 32h264c17.7 0 32-14.3 32-32V676.1c98' + '-56.7 164-162.7 164-284.1 0-181.1-146.9-328-32' + '8-328z m127.9 549.8L604 634.6V752H420V634.6l-3' + '5.9-20.8C305.4 568.3 256 484.5 256 392c0-141.4' + ' 114.6-256 256-256s256 114.6 256 256c0 92.5-49' + '.4 176.3-128.1 221.8z';

var clearPath = 'M793 242H366v-74c0-6.7-7.7-10.4-12.9' + '-6.3l-142 112c-4.1 3.2-4.1 9.4 0 12.6l142 112c' + '5.2 4.1 12.9 0.4 12.9-6.3v-74h415v470H175c-4.4' + ' 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h618c35.3 0 64-' + '28.7 64-64V306c0-35.3-28.7-64-64-64z';

var arrowPath = 'M765.7 486.8L314.9 134.7c-5.3-4.1' + '-12.9-0.4-12.9 6.3v77.3c0 4.9 2.3 9.6 6.1 12.6l36' + '0 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6' + '.7 7.7 10.4 12.9 6.3l450.8-352.1c16.4-12.8 16.4-3' + '7.6 0-50.4z';

var getSvg = function getSvg(path) {
  var iStyle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var style = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  return __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(
    'i',
    { style: iStyle },
    __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(
      'svg',
      {
        viewBox: '0 0 1024 1024',
        width: '1em',
        height: '1em',
        fill: 'currentColor',
        style: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({ verticalAlign: '-.125em' }, style)
      },
      __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement('path', { d: path })
    )
  );
};

var switcherIcon = function switcherIcon(obj) {
  if (obj.isLeaf) {
    return getSvg(arrowPath, { cursor: 'pointer', backgroundColor: 'white' }, { transform: 'rotate(270deg)' });
  }
  return getSvg(arrowPath, { cursor: 'pointer', backgroundColor: 'white' }, { transform: 'rotate(' + (obj.expanded ? 90 : 0) + 'deg)' });
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
  return __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(
    'div',
    { className: 'custom-icon-demo' },
    __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(
      'h2',
      null,
      'Single'
    ),
    __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_5_rc_tree_select__["c" /* default */], __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({
      treeData: __WEBPACK_IMPORTED_MODULE_6__util__["b" /* gData */],
      placeholder: __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(
        'span',
        null,
        'Please Select'
      ),
      transitionName: 'rc-tree-select-dropdown-slide-up',
      style: { width: 300 },
      dropdownStyle: { maxHeight: 200, overflow: 'auto', zIndex: 1500 },
      showSearch: true, allowClear: true
    }, iconProps)),
    __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement('br', null),
    __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(
      'h2',
      null,
      'Multiple'
    ),
    __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_5_rc_tree_select__["c" /* default */], __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({
      treeData: __WEBPACK_IMPORTED_MODULE_6__util__["b" /* gData */],
      multiple: true,
      placeholder: __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(
        'span',
        null,
        'Please Select'
      ),
      transitionName: 'rc-tree-select-dropdown-slide-up',
      style: { width: 300 },
      dropdownStyle: { maxHeight: 200, overflow: 'auto', zIndex: 1500 },
      showSearch: true, allowClear: true
    }, iconPropsFunction))
  );
}

__WEBPACK_IMPORTED_MODULE_3_react_dom___default.a.render(__WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(Demo, null), document.getElementById('__react-content'));

/***/ }),

/***/ 29:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 77:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},[246]);
//# sourceMappingURL=custom-icons.js.map