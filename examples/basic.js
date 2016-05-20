webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* eslint react/no-multi-comp:0, no-console:0 */
	
	'use strict';
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	__webpack_require__(2);
	
	__webpack_require__(3);
	
	var _react = __webpack_require__(4);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(161);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _rcTreeSelect = __webpack_require__(162);
	
	var _rcTreeSelect2 = _interopRequireDefault(_rcTreeSelect);
	
	var _util = __webpack_require__(220);
	
	var Demo = _react2['default'].createClass({
	  displayName: 'Demo',
	
	  getInitialState: function getInitialState() {
	    return {
	      inputValue: '0-0-0-label',
	      value: '0-0-0-value',
	      // value: ['0-0-0-0-value', '0-0-0-1-value', '0-0-0-2-value'],
	      multipleValue: [],
	      simpleTreeData: [{ 'key': 1, 'pId': 0, 'label': 'test1' }, { 'key': '1-1', 'pId': 0, 'label': 'test1' }, { 'key': 11, 'pId': 1, 'label': 'test11' }, { 'key': 12, 'pId': 1, 'label': 'test12' }, { 'key': 111, 'pId': 11, 'label': 'test111' }],
	      treeDataSimpleMode: {
	        id: 'key',
	        rootPId: 0
	      }
	    };
	  },
	  onSearch: function onSearch(value) {
	    console.log(value, arguments);
	  },
	  onChange: function onChange(value) {
	    console.log('onChange', arguments);
	    this.setState({ value: value });
	  },
	  onMultipleChange: function onMultipleChange(value) {
	    console.log('onMultipleChange', arguments);
	    this.setState({ multipleValue: value });
	  },
	  onSelect: function onSelect() {
	    // use onChange instead
	    console.log(arguments);
	  },
	  filterTreeNode: function filterTreeNode(input, child) {
	    return String(child.props.title).indexOf(input) === 0;
	  },
	  render: function render() {
	    return _react2['default'].createElement(
	      'div',
	      { style: { margin: 20 } },
	      _react2['default'].createElement(
	        'h2',
	        null,
	        'single select'
	      ),
	      _react2['default'].createElement(_rcTreeSelect2['default'], { style: { width: 300 }, transitionName: 'rc-tree-select-dropdown-slide-up',
	        choiceTransitionName: 'rc-tree-select-selection__choice-zoom',
	        dropdownStyle: { maxHeight: 200, overflow: 'auto' },
	        placeholder: _react2['default'].createElement(
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
	        onSelect: this.onSelect }),
	      _react2['default'].createElement(
	        'h2',
	        null,
	        'multiple select'
	      ),
	      _react2['default'].createElement(_rcTreeSelect2['default'], { style: { width: 300 }, transitionName: 'rc-tree-select-dropdown-slide-up',
	        choiceTransitionName: 'rc-tree-select-selection__choice-zoom',
	        dropdownStyle: { maxHeight: 200, overflow: 'auto' },
	        placeholder: _react2['default'].createElement(
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
	        onSelect: this.onSelect }),
	      _react2['default'].createElement(
	        'h2',
	        null,
	        'check select'
	      ),
	      _react2['default'].createElement(_rcTreeSelect2['default'], { style: { width: 300 }, transitionName: 'rc-tree-select-dropdown-slide-up',
	        choiceTransitionName: 'rc-tree-select-selection__choice-zoom',
	        dropdownStyle: { maxHeight: 200, overflow: 'auto' },
	        dropdownPopupAlign: { overflow: { adjustY: 0, adjustX: 0 } },
	        placeholder: _react2['default'].createElement(
	          'i',
	          null,
	          '请下拉选择'
	        ),
	        searchPlaceholder: 'please search',
	        treeLine: true, maxTagTextLength: 10,
	        inputValue: '0-2',
	        value: this.state.value,
	        treeData: _util.gData,
	        treeNodeFilterProp: 'title',
	        treeCheckable: true, showCheckedStrategy: _rcTreeSelect.SHOW_PARENT,
	        onChange: this.onChange,
	        onSelect: this.onSelect }),
	      _react2['default'].createElement(
	        'h2',
	        null,
	        'use treeDataSimpleMode'
	      ),
	      _react2['default'].createElement(_rcTreeSelect2['default'], { style: { width: 300 },
	        dropdownStyle: { maxHeight: 200, overflow: 'auto' },
	        placeholder: _react2['default'].createElement(
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
	        onSelect: this.onSelect }),
	      _react2['default'].createElement(
	        'h2',
	        null,
	        'use TreeNode Component (not recommend)'
	      ),
	      _react2['default'].createElement(
	        _rcTreeSelect2['default'],
	        { style: { width: 200 },
	          dropdownStyle: { maxHeight: 200, overflow: 'auto' },
	          value: this.state.value || 'leaf1',
	          treeDefaultExpandAll: true,
	          treeNodeFilterProp: 'title',
	          filterTreeNode: this.filterTreeNode,
	          onChange: this.onChange },
	        _react2['default'].createElement(
	          _rcTreeSelect.TreeNode,
	          { value: 'parent 1', title: 'parent 1', key: '0-1' },
	          _react2['default'].createElement(
	            _rcTreeSelect.TreeNode,
	            { value: 'parent 1-0', title: 'parent 1-0', key: '0-1-0' },
	            _react2['default'].createElement(_rcTreeSelect.TreeNode, { value: 'leaf1', title: 'my leaf', key: 'random' }),
	            _react2['default'].createElement(_rcTreeSelect.TreeNode, { value: 'leaf2', title: 'your leaf', key: 'random1', disabled: true })
	          ),
	          _react2['default'].createElement(
	            _rcTreeSelect.TreeNode,
	            { value: 'parent 1-1', title: 'parent 1-1', key: '0-1-1' },
	            _react2['default'].createElement(_rcTreeSelect.TreeNode, { value: 'sss', title: _react2['default'].createElement(
	                'span',
	                { style: { color: 'red' } },
	                'sss'
	              ), key: 'random3' }),
	            _react2['default'].createElement(
	              _rcTreeSelect.TreeNode,
	              { value: 'same value', title: 'same txtle', key: '0-1-1-1' },
	              _react2['default'].createElement(_rcTreeSelect.TreeNode, { value: 'same value', title: 'same titlexd', key: '0-1-1-1-0' })
	            )
	          )
	        ),
	        _react2['default'].createElement(
	          _rcTreeSelect.TreeNode,
	          { value: 'same value', title: 'same title', key: '0-2' },
	          _react2['default'].createElement(_rcTreeSelect.TreeNode, { value: '2same value', title: '2same title', key: '0-2-0' })
	        ),
	        _react2['default'].createElement(_rcTreeSelect.TreeNode, { value: 'same value', title: 'same title', key: '0-3' }),
	        _react2['default'].createElement(_rcTreeSelect.TreeNode, { value: 'same value', title: 'same title', key: '0-4' }),
	        _react2['default'].createElement(_rcTreeSelect.TreeNode, { value: 'same value', title: 'same title', key: '0-5' })
	      )
	    );
	  }
	});
	
	_reactDom2['default'].render(_react2['default'].createElement(Demo, null), document.getElementById('__react-content'));

/***/ },
/* 2 */,
/* 3 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
]);
//# sourceMappingURL=basic.js.map