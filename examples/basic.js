webpackJsonp([0],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },

/***/ 1:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(2);
	
	__webpack_require__(3);
	
	var _react = __webpack_require__(4);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(36);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	__webpack_require__(175);
	
	var _rcDialog = __webpack_require__(176);
	
	var _rcDialog2 = _interopRequireDefault(_rcDialog);
	
	var _rcTreeSelect = __webpack_require__(191);
	
	var _rcTreeSelect2 = _interopRequireDefault(_rcTreeSelect);
	
	var _util = __webpack_require__(225);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /* eslint react/no-multi-comp:0, no-console:0 */
	
	function isLeaf(value) {
	  if (!value) {
	    return false;
	  }
	  var queues = [].concat(_toConsumableArray(_util.gData));
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
	
	var Demo = _react2.default.createClass({
	  displayName: 'Demo',
	  getInitialState: function getInitialState() {
	    return {
	      visible: false,
	      inputValue: '0-0-0-label',
	      value: '0-0-0-value',
	      // value: ['0-0-0-0-value', '0-0-0-1-value', '0-0-0-2-value'],
	      lv: { value: '0-0-0-value', label: 'spe label' },
	      multipleValue: [],
	      simpleTreeData: [{ key: 1, pId: 0, label: 'test1' }, { key: '1-1', pId: 0, label: 'test1' }, { key: 11, pId: 1, label: 'test11' }, { key: 12, pId: 1, label: 'test12' }, { key: 111, pId: 11, label: 'test111' }],
	      treeDataSimpleMode: {
	        id: 'key',
	        rootPId: 0
	      }
	    };
	  },
	  onClick: function onClick() {
	    this.setState({
	      visible: true
	    });
	  },
	  onClose: function onClose() {
	    this.setState({
	      visible: false
	    });
	  },
	  onSearch: function onSearch(value) {
	    console.log(value, arguments);
	  },
	  onChange: function onChange(value) {
	    console.log('onChange', arguments);
	    this.setState({ value: value });
	  },
	  onChangeChildren: function onChangeChildren(value) {
	    console.log('onChangeChildren', arguments);
	    var pre = value ? this.state.value : undefined;
	    this.setState({ value: isLeaf(value) ? value : pre });
	  },
	  onChangeLV: function onChangeLV(value) {
	    console.log('labelInValue', arguments);
	    if (!value) {
	      this.setState({ lv: undefined });
	      return;
	    }
	    var path = findPath(value.value, _util.gData).map(function (i) {
	      return i.label;
	    }).reverse().join(' > ');
	    this.setState({ lv: { value: value.value, label: path } });
	  },
	  onMultipleChange: function onMultipleChange(value) {
	    console.log('onMultipleChange', arguments);
	    this.setState({ multipleValue: value });
	  },
	  onSelect: function onSelect() {
	    // use onChange instead
	    console.log(arguments);
	  },
	  onDropdownVisibleChange: function onDropdownVisibleChange(visible) {
	    console.log(visible, this.state.value);
	    if (Array.isArray(this.state.value) && this.state.value.length > 1 && this.state.value.length < 3) {
	      alert('please select more than two item or less than one item.');
	      return false;
	    }
	    return true;
	  },
	  filterTreeNode: function filterTreeNode(input, child) {
	    return String(child.props.title).indexOf(input) === 0;
	  },
	  render: function render() {
	    return _react2.default.createElement(
	      'div',
	      { style: { margin: 20 } },
	      _react2.default.createElement(
	        'h2',
	        null,
	        'tree-select in dialog'
	      ),
	      _react2.default.createElement(
	        'button',
	        { className: 'btn btn-primary', onClick: this.onClick },
	        'show dialog'
	      ),
	      this.state.visible ? _react2.default.createElement(
	        _rcDialog2.default,
	        {
	          visible: this.state.visible,
	          animation: 'zoom',
	          maskAnimation: 'fade',
	          onClose: this.onClose,
	          style: { width: 600, height: 400 }
	        },
	        _react2.default.createElement(_rcTreeSelect2.default, {
	          style: { width: 300 },
	          transitionName: 'rc-tree-select-dropdown-slide-up',
	          choiceTransitionName: 'rc-tree-select-selection__choice-zoom',
	          dropdownStyle: { maxHeight: 200, overflow: 'auto', zIndex: 1500 },
	          placeholder: _react2.default.createElement(
	            'i',
	            null,
	            '请下拉选择'
	          ),
	          searchPlaceholder: 'please search',
	          showSearch: true, allowClear: true, treeLine: true,
	          inputValue: this.state.inputValue,
	          value: this.state.value,
	          treeData: _util.gData,
	          treeNodeFilterProp: 'label',
	          filterTreeNode: false,
	          onSearch: this.onSearch,
	          onChange: this.onChange,
	          onSelect: this.onSelect
	        })
	      ) : null,
	      _react2.default.createElement(
	        'h2',
	        null,
	        'single select'
	      ),
	      _react2.default.createElement(_rcTreeSelect2.default, {
	        style: { width: 300 },
	        transitionName: 'rc-tree-select-dropdown-slide-up',
	        choiceTransitionName: 'rc-tree-select-selection__choice-zoom',
	        dropdownStyle: { maxHeight: 200, overflow: 'auto' },
	        placeholder: _react2.default.createElement(
	          'i',
	          null,
	          '请下拉选择'
	        ),
	        searchPlaceholder: 'please search',
	        showSearch: true, allowClear: true, treeLine: true,
	        inputValue: this.state.inputValue,
	        value: this.state.value,
	        treeData: _util.gData,
	        treeNodeFilterProp: 'label',
	        filterTreeNode: false,
	        onSearch: this.onSearch,
	        onChange: this.onChange,
	        onSelect: this.onSelect
	      }),
	      _react2.default.createElement(
	        'h2',
	        null,
	        'single select (just select children)'
	      ),
	      _react2.default.createElement(_rcTreeSelect2.default, {
	        style: { width: 300 },
	        transitionName: 'rc-tree-select-dropdown-slide-up',
	        choiceTransitionName: 'rc-tree-select-selection__choice-zoom',
	        dropdownStyle: { maxHeight: 200, overflow: 'auto' },
	        placeholder: _react2.default.createElement(
	          'i',
	          null,
	          '请下拉选择'
	        ),
	        searchPlaceholder: 'please search',
	        showSearch: true, allowClear: true, treeLine: true,
	        inputValue: this.state.inputValue,
	        value: this.state.value,
	        treeData: _util.gData,
	        treeNodeFilterProp: 'label',
	        filterTreeNode: false,
	        onChange: this.onChangeChildren
	      }),
	      _react2.default.createElement(
	        'h2',
	        null,
	        'multiple select'
	      ),
	      _react2.default.createElement(_rcTreeSelect2.default, {
	        style: { width: 300 },
	        transitionName: 'rc-tree-select-dropdown-slide-up',
	        choiceTransitionName: 'rc-tree-select-selection__choice-zoom',
	        dropdownStyle: { maxHeight: 200, overflow: 'auto' },
	        placeholder: _react2.default.createElement(
	          'i',
	          null,
	          '请下拉选择'
	        ),
	        searchPlaceholder: 'please search',
	        multiple: true,
	        inputValue: this.state.inputValue,
	        value: this.state.multipleValue,
	        treeData: _util.gData,
	        treeNodeFilterProp: 'title',
	        onChange: this.onMultipleChange,
	        onSelect: this.onSelect
	      }),
	      _react2.default.createElement(
	        'h2',
	        null,
	        'check select'
	      ),
	      _react2.default.createElement(_rcTreeSelect2.default, {
	        className: 'check-select',
	        transitionName: 'rc-tree-select-dropdown-slide-up',
	        choiceTransitionName: 'rc-tree-select-selection__choice-zoom',
	        dropdownStyle: { height: 200, overflow: 'auto' },
	        dropdownPopupAlign: { overflow: { adjustY: 0, adjustX: 0 }, offset: [0, 2] },
	        onDropdownVisibleChange: this.onDropdownVisibleChange,
	        placeholder: _react2.default.createElement(
	          'i',
	          null,
	          '请下拉选择'
	        ),
	        searchPlaceholder: 'please search',
	        treeLine: true, maxTagTextLength: 10,
	        value: this.state.value,
	        treeData: _util.gData,
	        treeNodeFilterProp: 'title',
	        treeCheckable: true, showCheckedStrategy: _rcTreeSelect.SHOW_PARENT,
	        onChange: this.onChange,
	        onSelect: this.onSelect
	      }),
	      _react2.default.createElement(
	        'h2',
	        null,
	        'labelInValue & show path'
	      ),
	      _react2.default.createElement(_rcTreeSelect2.default, {
	        style: { width: 500 },
	        transitionName: 'rc-tree-select-dropdown-slide-up',
	        choiceTransitionName: 'rc-tree-select-selection__choice-zoom',
	        dropdownStyle: { maxHeight: 200, overflow: 'auto' },
	        placeholder: _react2.default.createElement(
	          'i',
	          null,
	          '请下拉选择'
	        ),
	        searchPlaceholder: 'please search',
	        showSearch: true, allowClear: true, treeLine: true,
	        value: this.state.lv, labelInValue: true,
	        treeData: _util.gData,
	        treeNodeFilterProp: 'label',
	        filterTreeNode: false,
	        onChange: this.onChangeLV
	      }),
	      _react2.default.createElement(
	        'h2',
	        null,
	        'use treeDataSimpleMode'
	      ),
	      _react2.default.createElement(_rcTreeSelect2.default, {
	        style: { width: 300 },
	        dropdownStyle: { maxHeight: 200, overflow: 'auto' },
	        placeholder: _react2.default.createElement(
	          'i',
	          null,
	          '请下拉选择'
	        ),
	        searchPlaceholder: 'please search',
	        treeLine: true, maxTagTextLength: 10,
	        inputValue: 'test111',
	        value: this.state.value,
	        treeData: this.state.simpleTreeData,
	        treeNodeFilterProp: 'title',
	        treeDataSimpleMode: this.state.treeDataSimpleMode,
	        treeCheckable: true, showCheckedStrategy: _rcTreeSelect.SHOW_PARENT,
	        onChange: this.onChange,
	        onSelect: this.onSelect
	      }),
	      _react2.default.createElement(
	        'h2',
	        null,
	        'use TreeNode Component (not recommend)'
	      ),
	      _react2.default.createElement(
	        _rcTreeSelect2.default,
	        {
	          style: { width: 200 },
	          dropdownStyle: { maxHeight: 200, overflow: 'auto' },
	          value: this.state.value || 'leaf1',
	          treeDefaultExpandAll: true, treeCheckable: true,
	          treeNodeFilterProp: 'title',
	          filterTreeNode: this.filterTreeNode,
	          onChange: this.onChange
	        },
	        _react2.default.createElement(
	          _rcTreeSelect.TreeNode,
	          { value: 'parent 1', title: 'parent 1', key: '0-1' },
	          _react2.default.createElement(
	            _rcTreeSelect.TreeNode,
	            { value: 'parent 1-0', title: 'parent 1-0', key: '0-1-0' },
	            _react2.default.createElement(_rcTreeSelect.TreeNode, { value: 'leaf1', title: 'my leaf', key: 'random' }),
	            _react2.default.createElement(_rcTreeSelect.TreeNode, { value: 'leaf2', title: 'your leaf', key: 'random1', disabled: true })
	          ),
	          _react2.default.createElement(
	            _rcTreeSelect.TreeNode,
	            { value: 'parent 1-1', title: 'parent 1-1', key: '0-1-1' },
	            _react2.default.createElement(_rcTreeSelect.TreeNode, { value: 'sss',
	              title: _react2.default.createElement(
	                'span',
	                { style: { color: 'red' } },
	                'sss'
	              ), key: 'random3'
	            }),
	            _react2.default.createElement(
	              _rcTreeSelect.TreeNode,
	              { value: 'same value', title: 'same txtle', key: '0-1-1-1' },
	              _react2.default.createElement(_rcTreeSelect.TreeNode, { value: 'same value', title: 'same titlexd', key: '0-1-1-1-0' })
	            )
	          )
	        ),
	        _react2.default.createElement(
	          _rcTreeSelect.TreeNode,
	          { value: 'same value', title: 'same title', key: '0-2' },
	          _react2.default.createElement(_rcTreeSelect.TreeNode, { value: '2same value', title: '2same title', key: '0-2-0' })
	        ),
	        _react2.default.createElement(_rcTreeSelect.TreeNode, { value: 'same value', title: 'same title', key: '0-3' }),
	        _react2.default.createElement(_rcTreeSelect.TreeNode, { value: 'same value', title: 'same title', key: '0-4' }),
	        _react2.default.createElement(_rcTreeSelect.TreeNode, { value: 'same value', title: 'same title', key: '0-5' })
	      )
	    );
	  }
	});
	
	_reactDom2.default.render(_react2.default.createElement(Demo, null), document.getElementById('__react-content'));

/***/ },

/***/ 3:
2,

/***/ 175:
2,

/***/ 176:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = __webpack_require__(177);

/***/ },

/***/ 177:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _react = __webpack_require__(4);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _Dialog = __webpack_require__(178);
	
	var _Dialog2 = _interopRequireDefault(_Dialog);
	
	var _getContainerRenderMixin = __webpack_require__(190);
	
	var _getContainerRenderMixin2 = _interopRequireDefault(_getContainerRenderMixin);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
	
	var DialogWrap = _react2["default"].createClass({
	  displayName: 'DialogWrap',
	
	  propTypes: {
	    visible: _react.PropTypes.bool
	  },
	  mixins: [(0, _getContainerRenderMixin2["default"])({
	    isVisible: function isVisible(instance) {
	      return instance.props.visible;
	    },
	
	    autoDestroy: false,
	    getComponent: function getComponent(instance, extra) {
	      return _react2["default"].createElement(_Dialog2["default"], _extends({}, instance.props, extra, {
	        key: 'dialog'
	      }));
	    }
	  })],
	
	  getDefaultProps: function getDefaultProps() {
	    return {
	      visible: false
	    };
	  },
	  shouldComponentUpdate: function shouldComponentUpdate(_ref) {
	    var visible = _ref.visible;
	
	    return !!(this.props.visible || visible);
	  },
	  componentWillUnmount: function componentWillUnmount() {
	    if (this.props.visible) {
	      this.renderComponent({
	        onAfterClose: this.removeContainer,
	        onClose: function onClose() {},
	
	        visible: false
	      });
	    } else {
	      this.removeContainer();
	    }
	  },
	  getElement: function getElement(part) {
	    return this._component.getElement(part);
	  },
	  render: function render() {
	    return null;
	  }
	});
	
	exports["default"] = DialogWrap;
	module.exports = exports['default'];

/***/ },

/***/ 178:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _react = __webpack_require__(4);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(36);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _KeyCode = __webpack_require__(179);
	
	var _KeyCode2 = _interopRequireDefault(_KeyCode);
	
	var _rcAnimate = __webpack_require__(180);
	
	var _rcAnimate2 = _interopRequireDefault(_rcAnimate);
	
	var _LazyRenderBox = __webpack_require__(189);
	
	var _LazyRenderBox2 = _interopRequireDefault(_LazyRenderBox);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
	
	var uuid = 0;
	var openCount = 0;
	
	// Measure scrollbar width for padding body during modal show/hide
	var scrollbarMeasure = {
	  position: 'absolute',
	  top: '-9999px',
	  width: '50px',
	  height: '50px',
	  overflow: 'scroll'
	};
	
	/* eslint react/no-is-mounted:0 */
	
	function noop() {}
	
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
	  pos.top += getScroll(w, 1);
	  return pos;
	}
	
	var Dialog = _react2["default"].createClass({
	  displayName: 'Dialog',
	
	  propTypes: {
	    className: _react.PropTypes.string,
	    keyboard: _react.PropTypes.bool,
	    style: _react.PropTypes.object,
	    mask: _react.PropTypes.bool,
	    children: _react.PropTypes.any,
	    onAfterClose: _react.PropTypes.func,
	    onClose: _react.PropTypes.func,
	    closable: _react.PropTypes.bool,
	    maskClosable: _react.PropTypes.bool,
	    visible: _react.PropTypes.bool,
	    mousePosition: _react.PropTypes.object,
	    wrapStyle: _react.PropTypes.object,
	    prefixCls: _react.PropTypes.string,
	    wrapClassName: _react.PropTypes.string
	  },
	
	  getDefaultProps: function getDefaultProps() {
	    return {
	      onAfterClose: noop,
	      className: '',
	      mask: true,
	      visible: false,
	      keyboard: true,
	      closable: true,
	      maskClosable: true,
	      prefixCls: 'rc-dialog',
	      onClose: noop
	    };
	  },
	  componentWillMount: function componentWillMount() {
	    this.titleId = 'rcDialogTitle' + uuid++;
	  },
	  componentDidMount: function componentDidMount() {
	    this.componentDidUpdate({});
	  },
	  componentDidUpdate: function componentDidUpdate(prevProps) {
	    var props = this.props;
	    var mousePosition = this.props.mousePosition;
	    if (props.visible) {
	      // first show
	      if (!prevProps.visible) {
	        this.lastOutSideFocusNode = document.activeElement;
	        this.addScrollingEffect();
	        this.refs.wrap.focus();
	        var dialogNode = _reactDom2["default"].findDOMNode(this.refs.dialog);
	        if (mousePosition) {
	          var elOffset = offset(dialogNode);
	          setTransformOrigin(dialogNode, mousePosition.x - elOffset.left + 'px ' + (mousePosition.y - elOffset.top) + 'px');
	        } else {
	          setTransformOrigin(dialogNode, '');
	        }
	      }
	    } else if (prevProps.visible) {
	      if (props.mask && this.lastOutSideFocusNode) {
	        try {
	          this.lastOutSideFocusNode.focus();
	        } catch (e) {
	          this.lastOutSideFocusNode = null;
	        }
	        this.lastOutSideFocusNode = null;
	      }
	    }
	  },
	  onAnimateLeave: function onAnimateLeave() {
	    // need demo?
	    // https://github.com/react-component/dialog/pull/28
	    if (this.refs.wrap) {
	      this.refs.wrap.style.display = 'none';
	    }
	    this.removeScrollingEffect();
	    this.props.onAfterClose();
	  },
	  onMaskClick: function onMaskClick(e) {
	    if (e.target === e.currentTarget && this.props.closable && this.props.maskClosable) {
	      this.close(e);
	    }
	  },
	  onKeyDown: function onKeyDown(e) {
	    var props = this.props;
	    if (props.closable && props.keyboard) {
	      if (e.keyCode === _KeyCode2["default"].ESC) {
	        this.close(e);
	      }
	    }
	    // keep focus inside dialog
	    if (props.visible) {
	      if (e.keyCode === _KeyCode2["default"].TAB) {
	        var activeElement = document.activeElement;
	        var dialogRoot = this.refs.wrap;
	        var sentinel = this.refs.sentinel;
	        if (e.shiftKey) {
	          if (activeElement === dialogRoot) {
	            sentinel.focus();
	          }
	        } else if (activeElement === this.refs.sentinel) {
	          dialogRoot.focus();
	        }
	      }
	    }
	  },
	  getDialogElement: function getDialogElement() {
	    var props = this.props;
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
	      footer = _react2["default"].createElement(
	        'div',
	        { className: prefixCls + '-footer', ref: 'footer' },
	        props.footer
	      );
	    }
	
	    var header = void 0;
	    if (props.title) {
	      header = _react2["default"].createElement(
	        'div',
	        { className: prefixCls + '-header', ref: 'header' },
	        _react2["default"].createElement(
	          'div',
	          { className: prefixCls + '-title', id: this.titleId },
	          props.title
	        )
	      );
	    }
	
	    var closer = void 0;
	    if (closable) {
	      closer = _react2["default"].createElement(
	        'button',
	        {
	          onClick: this.close,
	          'aria-label': 'Close',
	          className: prefixCls + '-close'
	        },
	        _react2["default"].createElement('span', { className: prefixCls + '-close-x' })
	      );
	    }
	
	    var style = _extends({}, props.style, dest);
	    var transitionName = this.getTransitionName();
	    var dialogElement = _react2["default"].createElement(
	      _LazyRenderBox2["default"],
	      {
	        role: 'document',
	        ref: 'dialog',
	        style: style,
	        className: prefixCls + ' ' + (props.className || ''),
	        visible: props.visible
	      },
	      _react2["default"].createElement(
	        'div',
	        { className: prefixCls + '-content' },
	        closer,
	        header,
	        _react2["default"].createElement(
	          'div',
	          { className: prefixCls + '-body', style: props.bodyStyle, ref: 'body' },
	          props.children
	        ),
	        footer
	      ),
	      _react2["default"].createElement(
	        'div',
	        { tabIndex: '0', ref: 'sentinel', style: { width: 0, height: 0, overflow: 'hidden' } },
	        'sentinel'
	      )
	    );
	    return _react2["default"].createElement(
	      _rcAnimate2["default"],
	      {
	        key: 'dialog',
	        showProp: 'visible',
	        onLeave: this.onAnimateLeave,
	        transitionName: transitionName,
	        component: '',
	        transitionAppear: true
	      },
	      dialogElement
	    );
	  },
	  getZIndexStyle: function getZIndexStyle() {
	    var style = {};
	    var props = this.props;
	    if (props.zIndex !== undefined) {
	      style.zIndex = props.zIndex;
	    }
	    return style;
	  },
	  getWrapStyle: function getWrapStyle() {
	    return _extends({}, this.getZIndexStyle(), this.props.wrapStyle);
	  },
	  getMaskElement: function getMaskElement() {
	    var props = this.props;
	    var maskElement = void 0;
	    if (props.mask) {
	      var maskTransition = this.getMaskTransitionName();
	      maskElement = _react2["default"].createElement(_LazyRenderBox2["default"], {
	        style: this.getZIndexStyle(),
	        key: 'mask',
	        className: props.prefixCls + '-mask',
	        hiddenClassName: props.prefixCls + '-mask-hidden',
	        visible: props.visible
	      });
	      if (maskTransition) {
	        maskElement = _react2["default"].createElement(
	          _rcAnimate2["default"],
	          {
	            key: 'mask',
	            showProp: 'visible',
	            transitionAppear: true,
	            component: '',
	            transitionName: maskTransition
	          },
	          maskElement
	        );
	      }
	    }
	    return maskElement;
	  },
	  getMaskTransitionName: function getMaskTransitionName() {
	    var props = this.props;
	    var transitionName = props.maskTransitionName;
	    var animation = props.maskAnimation;
	    if (!transitionName && animation) {
	      transitionName = props.prefixCls + '-' + animation;
	    }
	    return transitionName;
	  },
	  getTransitionName: function getTransitionName() {
	    var props = this.props;
	    var transitionName = props.transitionName;
	    var animation = props.animation;
	    if (!transitionName && animation) {
	      transitionName = props.prefixCls + '-' + animation;
	    }
	    return transitionName;
	  },
	  getElement: function getElement(part) {
	    return this.refs[part];
	  },
	  setScrollbar: function setScrollbar() {
	    if (this.bodyIsOverflowing && this.scrollbarWidth) {
	      document.body.style.paddingRight = this.scrollbarWidth + 'px';
	    }
	  },
	  addScrollingEffect: function addScrollingEffect() {
	    openCount++;
	    if (openCount !== 1) {
	      return;
	    }
	    this.checkScrollbar();
	    this.setScrollbar();
	    document.body.style.overflow = 'hidden';
	    // this.adjustDialog();
	  },
	  removeScrollingEffect: function removeScrollingEffect() {
	    openCount--;
	    if (openCount !== 0) {
	      return;
	    }
	    document.body.style.overflow = '';
	    this.resetScrollbar();
	    // this.resetAdjustments();
	  },
	  close: function close(e) {
	    this.props.onClose(e);
	  },
	  checkScrollbar: function checkScrollbar() {
	    var fullWindowWidth = window.innerWidth;
	    if (!fullWindowWidth) {
	      // workaround for missing window.innerWidth in IE8
	      var documentElementRect = document.documentElement.getBoundingClientRect();
	      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left);
	    }
	    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth;
	    if (this.bodyIsOverflowing) {
	      this.scrollbarWidth = this.measureScrollbar();
	    }
	  },
	  resetScrollbar: function resetScrollbar() {
	    document.body.style.paddingRight = '';
	  },
	  measureScrollbar: function measureScrollbar() {
	    if (this.scrollbarWidth !== undefined) {
	      return this.scrollbarWidth;
	    }
	    var scrollDiv = document.createElement('div');
	    for (var scrollProp in scrollbarMeasure) {
	      if (scrollbarMeasure.hasOwnProperty(scrollProp)) {
	        scrollDiv.style[scrollProp] = scrollbarMeasure[scrollProp];
	      }
	    }
	    document.body.appendChild(scrollDiv);
	    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
	    document.body.removeChild(scrollDiv);
	    this.scrollbarWidth = scrollbarWidth;
	    return scrollbarWidth;
	  },
	  adjustDialog: function adjustDialog() {
	    if (this.refs.wrap && this.scrollbarWidth) {
	      var modalIsOverflowing = this.refs.wrap.scrollHeight > document.documentElement.clientHeight;
	      this.refs.wrap.style.paddingLeft = (!this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '') + 'px';
	      this.refs.wrap.style.paddingRight = (this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : '') + 'px';
	    }
	  },
	  resetAdjustments: function resetAdjustments() {
	    if (this.refs.wrap) {
	      this.refs.wrap.style.paddingLeft = this.refs.wrap.style.paddingLeft = '';
	    }
	  },
	  render: function render() {
	    var props = this.props;
	    var prefixCls = props.prefixCls;
	    var style = this.getWrapStyle();
	    // clear hide display
	    // and only set display after async anim, not here for hide
	    if (props.visible) {
	      style.display = null;
	    }
	    return _react2["default"].createElement(
	      'div',
	      null,
	      this.getMaskElement(),
	      _react2["default"].createElement(
	        'div',
	        {
	          tabIndex: '-1',
	          onKeyDown: this.onKeyDown,
	          className: prefixCls + '-wrap ' + (props.wrapClassName || ''),
	          ref: 'wrap',
	          onClick: this.onMaskClick,
	          role: 'dialog',
	          'aria-labelledby': props.title ? this.titleId : null,
	          style: style
	        },
	        this.getDialogElement()
	      )
	    );
	  }
	});
	
	exports["default"] = Dialog;
	module.exports = exports['default'];

/***/ },

/***/ 189:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _react = __webpack_require__(4);
	
	var _react2 = _interopRequireDefault(_react);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
	
	var LazyRenderBox = _react2["default"].createClass({
	  displayName: 'LazyRenderBox',
	
	  propTypes: {
	    className: _react.PropTypes.string,
	    visible: _react.PropTypes.bool,
	    hiddenClassName: _react.PropTypes.string
	  },
	  shouldComponentUpdate: function shouldComponentUpdate(nextProps) {
	    return nextProps.hiddenClassName || nextProps.visible;
	  },
	  render: function render() {
	    var className = this.props.className;
	    if (this.props.hiddenClassName && !this.props.visible) {
	      className += ' ' + this.props.hiddenClassName;
	    }
	    var props = _extends({}, this.props);
	    delete props.hiddenClassName;
	    delete props.visible;
	    props.className = className;
	    return _react2["default"].createElement('div', props);
	  }
	});
	
	exports["default"] = LazyRenderBox;
	module.exports = exports['default'];

/***/ }

});
//# sourceMappingURL=basic.js.map