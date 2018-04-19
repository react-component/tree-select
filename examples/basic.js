webpackJsonp([1],{

/***/ 124:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(125);


/***/ }),

/***/ 125:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_inherits__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rc_tree_select_assets_index_less__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rc_tree_select_assets_index_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rc_tree_select_assets_index_less__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__demo_less__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__demo_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__demo_less__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react_dom__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rc_dialog_assets_index_css__ = __webpack_require__(167);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rc_dialog_assets_index_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_rc_dialog_assets_index_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rc_dialog__ = __webpack_require__(168);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_rc_tree_select__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__util__ = __webpack_require__(13);



/* eslint react/no-multi-comp:0, no-console:0, no-alert: 0 */










function isLeaf(value) {
  if (!value) {
    return false;
  }
  var queues = [].concat(__WEBPACK_IMPORTED_MODULE_10__util__["b" /* gData */]);
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

var Demo = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_inherits___default()(Demo, _React$Component);

  function Demo() {
    var _arguments = arguments;

    var _temp, _this, _ret;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default()(this, Demo);

    return _ret = (_temp = (_this = __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_possibleConstructorReturn___default()(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {
      tsOpen: false,
      visible: false,
      inputValue: '0-0-0-label',
      value: '0-0-0-value1',
      // value: ['0-0-0-0-value', '0-0-0-1-value', '0-0-0-2-value'],
      lv: { value: '0-0-0-value', label: 'spe label' },
      multipleValue: [],
      simpleTreeData: [{ key: 1, pId: 0, label: 'test1', value: 'test1' }, { key: 121, pId: 0, label: 'test1', value: 'test121' }, { key: 11, pId: 1, label: 'test11', value: 'test11' }, { key: 12, pId: 1, label: 'test12', value: 'test12' }, { key: 111, pId: 11, label: 'test111', value: 'test111' }],
      treeDataSimpleMode: {
        id: 'key',
        rootPId: 0
      }
    }, _this.onClick = function () {
      _this.setState({
        visible: true
      });
    }, _this.onClose = function () {
      _this.setState({
        visible: false
      });
    }, _this.onSearch = function (value) {
      console.log(value, _arguments);
    }, _this.onChange = function (value) {
      console.log('onChange', _arguments);
      _this.setState({ value: value });
    }, _this.onChangeChildren = function (value) {
      console.log('onChangeChildren', _arguments);
      var pre = value ? _this.state.value : undefined;
      _this.setState({ value: isLeaf(value) ? value : pre });
    }, _this.onChangeLV = function (value) {
      console.log('labelInValue', _arguments);
      if (!value) {
        _this.setState({ lv: undefined });
        return;
      }
      var path = findPath(value.value, __WEBPACK_IMPORTED_MODULE_10__util__["b" /* gData */]).map(function (i) {
        return i.label;
      }).reverse().join(' > ');
      _this.setState({ lv: { value: value.value, label: path } });
    }, _this.onMultipleChange = function (value) {
      console.log('onMultipleChange', _arguments);
      _this.setState({ multipleValue: value });
    }, _this.onSelect = function () {
      // use onChange instead
      console.log(_arguments);
    }, _this.onDropdownVisibleChange = function (visible, info) {
      console.log(visible, _this.state.value, info);
      if (Array.isArray(_this.state.value) && _this.state.value.length > 1 && _this.state.value.length < 3) {
        alert('please select more than two item or less than one item.');
        return false;
      }
      return true;
    }, _this.filterTreeNode = function (input, child) {
      return String(child.props.title).indexOf(input) === 0;
    }, _temp), __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_possibleConstructorReturn___default()(_this, _ret);
  }

  Demo.prototype.componentDidMount = function componentDidMount() {
    // console.log(this.refs.mul.getInputDOMNode());
    // this.refs.mul.getInputDOMNode().setAttribute('disabled', true);
  };

  Demo.prototype.render = function render() {
    var _arguments2 = arguments,
        _this2 = this;

    return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
      'div',
      { style: { margin: 20 } },
      __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'h2',
        null,
        'tree-select in dialog'
      ),
      __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'button',
        { className: 'btn btn-primary', onClick: this.onClick },
        'show dialog'
      ),
      this.state.visible ? __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        __WEBPACK_IMPORTED_MODULE_8_rc_dialog__["a" /* default */],
        {
          visible: this.state.visible,
          animation: 'zoom',
          maskAnimation: 'fade',
          onClose: this.onClose,
          style: { width: 600, height: 400, overflow: 'auto' },
          id: 'area'
        },
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'div',
          { style: { height: 600, paddingTop: 100 } },
          __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_9_rc_tree_select__["c" /* default */], {
            getPopupContainer: function getPopupContainer(triggerNode) {
              return triggerNode.parentNode;
            },
            style: { width: 300 },
            transitionName: 'rc-tree-select-dropdown-slide-up',
            choiceTransitionName: 'rc-tree-select-selection__choice-zoom',
            dropdownStyle: { maxHeight: 200, overflow: 'auto', zIndex: 1500 },
            placeholder: __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
              'i',
              null,
              '\u8BF7\u4E0B\u62C9\u9009\u62E9'
            ),
            searchPlaceholder: 'please search',
            showSearch: true, allowClear: true, treeLine: true,
            value: this.state.value,
            treeData: __WEBPACK_IMPORTED_MODULE_10__util__["b" /* gData */],
            treeNodeFilterProp: 'label',
            filterTreeNode: false,
            onSearch: this.onSearch,
            onChange: this.onChange,
            onSelect: this.onSelect
          })
        )
      ) : null,
      __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'h2',
        null,
        'single select'
      ),
      __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_9_rc_tree_select__["c" /* default */], {
        style: { width: 300 },
        transitionName: 'rc-tree-select-dropdown-slide-up',
        choiceTransitionName: 'rc-tree-select-selection__choice-zoom',
        dropdownStyle: { maxHeight: 200, overflow: 'auto' },
        placeholder: __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'i',
          null,
          '\u8BF7\u4E0B\u62C9\u9009\u62E9'
        ),
        searchPlaceholder: 'please search',
        showSearch: true, allowClear: true, treeLine: true,
        inputValue: this.state.inputValue,
        value: this.state.value,
        treeData: __WEBPACK_IMPORTED_MODULE_10__util__["b" /* gData */],
        treeNodeFilterProp: 'label',
        filterTreeNode: false,
        onSearch: this.onSearch,
        open: this.state.tsOpen,
        onChange: function onChange(value) {
          console.log('onChange', _arguments2);
          if (value === '0-0-0-0-value') {
            _this2.setState({ tsOpen: true });
          } else {
            _this2.setState({ tsOpen: false });
          }
          _this2.setState({ value: value });
        },
        onDropdownVisibleChange: function onDropdownVisibleChange(v, info) {
          console.log('single onDropdownVisibleChange', v, info);
          // document clicked
          if (info.documentClickClose && _this2.state.value === '0-0-0-0-value') {
            return false;
          }
          return true;
        },
        onSelect: this.onSelect
      }),
      __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'h2',
        null,
        'single select (just select children)'
      ),
      __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_9_rc_tree_select__["c" /* default */], {
        style: { width: 300 },
        transitionName: 'rc-tree-select-dropdown-slide-up',
        choiceTransitionName: 'rc-tree-select-selection__choice-zoom',
        dropdownStyle: { maxHeight: 200, overflow: 'auto' },
        placeholder: __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'i',
          null,
          '\u8BF7\u4E0B\u62C9\u9009\u62E9'
        ),
        searchPlaceholder: 'please search',
        showSearch: true, allowClear: true, treeLine: true,
        value: this.state.value,
        treeData: __WEBPACK_IMPORTED_MODULE_10__util__["b" /* gData */],
        treeNodeFilterProp: 'label',
        filterTreeNode: false,
        onChange: this.onChangeChildren
      }),
      __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'h2',
        null,
        'multiple select'
      ),
      __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_9_rc_tree_select__["c" /* default */], { ref: 'mul',
        style: { width: 300 },
        transitionName: 'rc-tree-select-dropdown-slide-up',
        choiceTransitionName: 'rc-tree-select-selection__choice-zoom',
        dropdownStyle: { maxHeight: 200, overflow: 'auto' },
        placeholder: __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'i',
          null,
          '\u8BF7\u4E0B\u62C9\u9009\u62E9'
        ),
        searchPlaceholder: 'please search',
        multiple: true,
        value: this.state.multipleValue,
        treeData: __WEBPACK_IMPORTED_MODULE_10__util__["b" /* gData */],
        treeNodeFilterProp: 'title',
        onChange: this.onMultipleChange,
        onSelect: this.onSelect,
        allowClear: true
      }),
      __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'h2',
        null,
        'check select'
      ),
      __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_9_rc_tree_select__["c" /* default */], {
        className: 'check-select',
        transitionName: 'rc-tree-select-dropdown-slide-up',
        choiceTransitionName: 'rc-tree-select-selection__choice-zoom',
        dropdownStyle: { height: 200, overflow: 'auto' },
        dropdownPopupAlign: { overflow: { adjustY: 0, adjustX: 0 }, offset: [0, 2] },
        onDropdownVisibleChange: this.onDropdownVisibleChange,
        placeholder: __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'i',
          null,
          '\u8BF7\u4E0B\u62C9\u9009\u62E9'
        ),
        searchPlaceholder: 'please search',
        treeLine: true, maxTagTextLength: 10,
        value: this.state.value,
        inputValue: null,
        treeData: __WEBPACK_IMPORTED_MODULE_10__util__["b" /* gData */],
        treeNodeFilterProp: 'title',
        treeCheckable: true, showCheckedStrategy: __WEBPACK_IMPORTED_MODULE_9_rc_tree_select__["a" /* SHOW_PARENT */],
        onChange: this.onChange,
        onSelect: this.onSelect
      }),
      __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'h2',
        null,
        'labelInValue & show path'
      ),
      __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_9_rc_tree_select__["c" /* default */], {
        style: { width: 500 },
        transitionName: 'rc-tree-select-dropdown-slide-up',
        choiceTransitionName: 'rc-tree-select-selection__choice-zoom',
        dropdownStyle: { maxHeight: 200, overflow: 'auto' },
        placeholder: __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'i',
          null,
          '\u8BF7\u4E0B\u62C9\u9009\u62E9'
        ),
        searchPlaceholder: 'please search',
        showSearch: true, allowClear: true, treeLine: true,
        value: this.state.lv, labelInValue: true,
        treeData: __WEBPACK_IMPORTED_MODULE_10__util__["b" /* gData */],
        treeNodeFilterProp: 'label',
        filterTreeNode: false,
        onChange: this.onChangeLV
      }),
      __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'h2',
        null,
        'use treeDataSimpleMode'
      ),
      __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_9_rc_tree_select__["c" /* default */], {
        style: { width: 300 },
        dropdownStyle: { maxHeight: 200, overflow: 'auto' },
        placeholder: __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'i',
          null,
          '\u8BF7\u4E0B\u62C9\u9009\u62E9'
        ),
        searchPlaceholder: 'please search',
        treeLine: true, maxTagTextLength: 10,
        inputValue: 'test111',
        value: this.state.value,
        treeData: this.state.simpleTreeData,
        treeNodeFilterProp: 'title',
        treeDataSimpleMode: this.state.treeDataSimpleMode,
        treeCheckable: true, showCheckedStrategy: __WEBPACK_IMPORTED_MODULE_9_rc_tree_select__["a" /* SHOW_PARENT */],
        onChange: this.onChange,
        onSelect: this.onSelect
      }),
      __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'h2',
        null,
        'Testing in extreme conditions (Boundary conditions test) '
      ),
      __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_9_rc_tree_select__["c" /* default */], {
        style: { width: 200 },
        dropdownStyle: { maxHeight: 200, overflow: 'auto' },
        defaultValue: 'leaf1', multiple: true, treeCheckable: true, showCheckedStrategy: __WEBPACK_IMPORTED_MODULE_9_rc_tree_select__["a" /* SHOW_PARENT */],
        treeDefaultExpandAll: true,
        treeData: [{ key: '', value: '', label: 'empty value', children: [] }, {
          key: '0', value: '0', label: '0 label', children: [{ key: '00', value: '00', label: '00 label', children: [] }, { key: '01', value: '01', label: '01 label', children: [] }]
        }],
        onChange: function onChange(val) {
          return console.log(val, _arguments2);
        }
      }),
      __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'h2',
        null,
        'use TreeNode Component (not recommend)'
      ),
      __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        __WEBPACK_IMPORTED_MODULE_9_rc_tree_select__["c" /* default */],
        {
          style: { width: 200 },
          dropdownStyle: { maxHeight: 200, overflow: 'auto' },
          defaultValue: 'leaf1',
          treeDefaultExpandAll: true,
          treeNodeFilterProp: 'title',
          filterTreeNode: this.filterTreeNode,
          onChange: function onChange(val) {
            return console.log(val, _arguments2);
          }
        },
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_9_rc_tree_select__["b" /* TreeNode */],
          { value: '', title: 'parent 1', key: '' },
          __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_9_rc_tree_select__["b" /* TreeNode */],
            { value: 'parent 1-0', title: 'parent 1-0', key: '0-1-0' },
            __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_9_rc_tree_select__["b" /* TreeNode */], { value: 'leaf1', title: 'my leaf', key: 'random' }),
            __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_9_rc_tree_select__["b" /* TreeNode */], { value: 'leaf2', title: 'your leaf', key: 'random1', disabled: true })
          ),
          __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_9_rc_tree_select__["b" /* TreeNode */],
            { value: 'parent 1-1', title: 'parent 1-1', key: '0-1-1' },
            __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_9_rc_tree_select__["b" /* TreeNode */], { value: 'sss',
              title: __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
                'span',
                { style: { color: 'red' } },
                'sss'
              ), key: 'random3'
            }),
            __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_9_rc_tree_select__["b" /* TreeNode */],
              { value: 'same value1', title: 'same txtle', key: '0-1-1-1' },
              __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_9_rc_tree_select__["b" /* TreeNode */], { value: 'same value10', title: 'same titlexd', key: '0-1-1-1-0' })
            )
          )
        ),
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_9_rc_tree_select__["b" /* TreeNode */],
          { value: 'same value2', title: 'same title', key: '0-2' },
          __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_9_rc_tree_select__["b" /* TreeNode */], { value: '2same value', title: '2same title', key: '0-2-0' })
        ),
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_9_rc_tree_select__["b" /* TreeNode */], { value: 'same value3', title: 'same title', key: '0-3' })
      )
    );
  };

  return Demo;
}(__WEBPACK_IMPORTED_MODULE_5_react___default.a.Component);

__WEBPACK_IMPORTED_MODULE_6_react_dom___default.a.render(__WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(Demo, null), document.getElementById('__react-content'));

/***/ }),

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

/***/ 167:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 168:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react_dom__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__Dialog__ = __webpack_require__(173);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rc_util_es_ContainerRender__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rc_util_es_Portal__ = __webpack_require__(101);









var IS_REACT_16 = 'createPortal' in __WEBPACK_IMPORTED_MODULE_5_react_dom__;

var DialogWrap = function (_React$Component) {
    __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits___default()(DialogWrap, _React$Component);

    function DialogWrap() {
        __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default()(this, DialogWrap);

        var _this = __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn___default()(this, _React$Component.apply(this, arguments));

        _this.saveDialog = function (node) {
            _this._component = node;
        };
        _this.getComponent = function () {
            var extra = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            return __WEBPACK_IMPORTED_MODULE_4_react__["createElement"](__WEBPACK_IMPORTED_MODULE_6__Dialog__["a" /* default */], __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({ ref: _this.saveDialog }, _this.props, extra, { key: "dialog" }));
        };
        _this.getContainer = function () {
            if (_this.props.getContainer) {
                return _this.props.getContainer();
            }
            var container = document.createElement('div');
            document.body.appendChild(container);
            return container;
        };
        return _this;
    }

    DialogWrap.prototype.shouldComponentUpdate = function shouldComponentUpdate(_ref) {
        var visible = _ref.visible;

        return !!(this.props.visible || visible);
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

        var visible = this.props.visible;

        var portal = null;
        if (!IS_REACT_16) {
            return __WEBPACK_IMPORTED_MODULE_4_react__["createElement"](__WEBPACK_IMPORTED_MODULE_7_rc_util_es_ContainerRender__["a" /* default */], { parent: this, visible: visible, autoDestroy: false, getComponent: this.getComponent, getContainer: this.getContainer }, function (_ref2) {
                var renderComponent = _ref2.renderComponent,
                    removeContainer = _ref2.removeContainer;

                _this2.renderComponent = renderComponent;
                _this2.removeContainer = removeContainer;
                return null;
            });
        }
        if (visible || this._component) {
            portal = __WEBPACK_IMPORTED_MODULE_4_react__["createElement"](__WEBPACK_IMPORTED_MODULE_8_rc_util_es_Portal__["a" /* default */], { getContainer: this.getContainer }, this.getComponent());
        }
        return portal;
    };

    return DialogWrap;
}(__WEBPACK_IMPORTED_MODULE_4_react__["Component"]);

DialogWrap.defaultProps = {
    visible: false
};
/* harmony default export */ __webpack_exports__["a"] = (DialogWrap);

/***/ }),

/***/ 173:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react_dom__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rc_util_es_KeyCode__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rc_animate__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__LazyRenderBox__ = __webpack_require__(182);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_rc_util_es_getScrollBarSize__ = __webpack_require__(183);










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
    __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits___default()(Dialog, _React$Component);

    function Dialog() {
        __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default()(this, Dialog);

        var _this = __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn___default()(this, _React$Component.apply(this, arguments));

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
            if (props.keyboard && e.keyCode === __WEBPACK_IMPORTED_MODULE_6_rc_util_es_KeyCode__["a" /* default */].ESC) {
                _this.close(e);
            }
            // keep focus inside dialog
            if (props.visible) {
                if (e.keyCode === __WEBPACK_IMPORTED_MODULE_6_rc_util_es_KeyCode__["a" /* default */].TAB) {
                    var activeElement = document.activeElement;
                    var dialogRoot = _this.wrap;
                    if (e.shiftKey) {
                        if (activeElement === dialogRoot) {
                            _this.sentinel.focus();
                        }
                    } else if (activeElement === _this.sentinel) {
                        dialogRoot.focus();
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
                footer = __WEBPACK_IMPORTED_MODULE_4_react__["createElement"]("div", { className: prefixCls + '-footer', ref: _this.saveRef('footer') }, props.footer);
            }
            var header = void 0;
            if (props.title) {
                header = __WEBPACK_IMPORTED_MODULE_4_react__["createElement"]("div", { className: prefixCls + '-header', ref: _this.saveRef('header') }, __WEBPACK_IMPORTED_MODULE_4_react__["createElement"]("div", { className: prefixCls + '-title', id: _this.titleId }, props.title));
            }
            var closer = void 0;
            if (closable) {
                closer = __WEBPACK_IMPORTED_MODULE_4_react__["createElement"]("button", { onClick: _this.close, "aria-label": "Close", className: prefixCls + '-close' }, __WEBPACK_IMPORTED_MODULE_4_react__["createElement"]("span", { className: prefixCls + '-close-x' }));
            }
            var style = __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, props.style, dest);
            var transitionName = _this.getTransitionName();
            var dialogElement = __WEBPACK_IMPORTED_MODULE_4_react__["createElement"](__WEBPACK_IMPORTED_MODULE_8__LazyRenderBox__["a" /* default */], { key: "dialog-element", role: "document", ref: _this.saveRef('dialog'), style: style, className: prefixCls + ' ' + (props.className || ''), visible: props.visible }, __WEBPACK_IMPORTED_MODULE_4_react__["createElement"]("div", { className: prefixCls + '-content' }, closer, header, __WEBPACK_IMPORTED_MODULE_4_react__["createElement"]("div", __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({ className: prefixCls + '-body', style: props.bodyStyle, ref: _this.saveRef('body') }, props.bodyProps), props.children), footer), __WEBPACK_IMPORTED_MODULE_4_react__["createElement"]("div", { tabIndex: 0, ref: _this.saveRef('sentinel'), style: { width: 0, height: 0, overflow: 'hidden' } }, "sentinel"));
            return __WEBPACK_IMPORTED_MODULE_4_react__["createElement"](__WEBPACK_IMPORTED_MODULE_7_rc_animate__["a" /* default */], { key: "dialog", showProp: "visible", onLeave: _this.onAnimateLeave, transitionName: transitionName, component: "", transitionAppear: true }, props.visible || !props.destroyOnClose ? dialogElement : null);
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
            return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, _this.getZIndexStyle(), _this.props.wrapStyle);
        };
        _this.getMaskStyle = function () {
            return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, _this.getZIndexStyle(), _this.props.maskStyle);
        };
        _this.getMaskElement = function () {
            var props = _this.props;
            var maskElement = void 0;
            if (props.mask) {
                var maskTransition = _this.getMaskTransitionName();
                maskElement = __WEBPACK_IMPORTED_MODULE_4_react__["createElement"](__WEBPACK_IMPORTED_MODULE_8__LazyRenderBox__["a" /* default */], __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({ style: _this.getMaskStyle(), key: "mask", className: props.prefixCls + '-mask', hiddenClassName: props.prefixCls + '-mask-hidden', visible: props.visible }, props.maskProps));
                if (maskTransition) {
                    maskElement = __WEBPACK_IMPORTED_MODULE_4_react__["createElement"](__WEBPACK_IMPORTED_MODULE_7_rc_animate__["a" /* default */], { key: "mask", showProp: "visible", transitionAppear: true, component: "", transitionName: maskTransition }, maskElement);
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
                _this.scrollbarWidth = Object(__WEBPACK_IMPORTED_MODULE_9_rc_util_es_getScrollBarSize__["a" /* default */])();
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
    };

    Dialog.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
        var props = this.props;
        var mousePosition = this.props.mousePosition;
        if (props.visible) {
            // first show
            if (!prevProps.visible) {
                this.openTime = Date.now();
                this.lastOutSideFocusNode = document.activeElement;
                this.addScrollingEffect();
                this.wrap.focus();
                var dialogNode = __WEBPACK_IMPORTED_MODULE_5_react_dom__["findDOMNode"](this.dialog);
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
        return __WEBPACK_IMPORTED_MODULE_4_react__["createElement"]("div", null, this.getMaskElement(), __WEBPACK_IMPORTED_MODULE_4_react__["createElement"]("div", __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({ tabIndex: -1, onKeyDown: this.onKeyDown, className: prefixCls + '-wrap ' + (props.wrapClassName || ''), ref: this.saveRef('wrap'), onClick: maskClosable ? this.onMaskClick : undefined, role: "dialog", "aria-labelledby": props.title ? this.titleId : null, style: style }, props.wrapProps), this.getDialogElement()));
    };

    return Dialog;
}(__WEBPACK_IMPORTED_MODULE_4_react__["Component"]);

/* harmony default export */ __webpack_exports__["a"] = (Dialog);

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

/***/ 182:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_react__);






var LazyRenderBox = function (_React$Component) {
    __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_inherits___default()(LazyRenderBox, _React$Component);

    function LazyRenderBox() {
        __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default()(this, LazyRenderBox);

        return __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_possibleConstructorReturn___default()(this, _React$Component.apply(this, arguments));
    }

    LazyRenderBox.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
        return !!nextProps.hiddenClassName || !!nextProps.visible;
    };

    LazyRenderBox.prototype.render = function render() {
        var className = this.props.className;
        if (!!this.props.hiddenClassName && !this.props.visible) {
            className += " " + this.props.hiddenClassName;
        }
        var props = __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, this.props);
        delete props.hiddenClassName;
        delete props.visible;
        props.className = className;
        return __WEBPACK_IMPORTED_MODULE_4_react__["createElement"]("div", __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, props));
    };

    return LazyRenderBox;
}(__WEBPACK_IMPORTED_MODULE_4_react__["Component"]);

/* harmony default export */ __webpack_exports__["a"] = (LazyRenderBox);

/***/ }),

/***/ 183:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = getScrollBarSize;
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

/***/ 36:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })

},[124]);
//# sourceMappingURL=basic.js.map