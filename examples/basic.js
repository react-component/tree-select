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
	
	var _util = __webpack_require__(218);
	
	var Demo = _react2['default'].createClass({
	  displayName: 'Demo',
	
	  getInitialState: function getInitialState() {
	    return {
	      value: '0-0-0-value',
	      multipleValue: []
	    };
	  },
	  onChange: function onChange(value) {
	    console.log('onChange', value, arguments);
	    this.setState({ value: value });
	  },
	  onMultipleChange: function onMultipleChange(value) {
	    console.log('onMultipleChange', value);
	    this.setState({ multipleValue: value });
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
	      _react2['default'].createElement(_rcTreeSelect2['default'], { style: { width: 300 },
	        dropdownStyle: { maxHeight: 200, overflow: 'auto' },
	        treeData: _util.gData, showSearch: true, allowClear: true, treeLine: true,
	        value: this.state.value,
	        treeDefaultExpandAll: false,
	        placeholder: _react2['default'].createElement(
	          'i',
	          null,
	          '请下拉选择'
	        ),
	        searchPlaceholder: 'please search',
	        treeNodeFilterProp: 'title',
	        onChange: this.onChange }),
	      _react2['default'].createElement(
	        'h2',
	        null,
	        'multiple select'
	      ),
	      _react2['default'].createElement(_rcTreeSelect2['default'], { style: { width: 300 },
	        dropdownStyle: { maxHeight: 200, overflow: 'auto' },
	        treeData: _util.gData,
	        value: this.state.multipleValue,
	        treeDefaultExpandAll: true,
	        placeholder: _react2['default'].createElement(
	          'i',
	          null,
	          '请下拉选择'
	        ),
	        searchPlaceholder: 'please search',
	        treeNodeFilterProp: 'title',
	        multiple: true,
	        dropdownPopupAlign: { offset: [0, 0] },
	        onChange: this.onMultipleChange }),
	      _react2['default'].createElement(
	        'h2',
	        null,
	        'check select'
	      ),
	      _react2['default'].createElement(_rcTreeSelect2['default'], { style: { width: 300 },
	        dropdownStyle: { maxHeight: 200, overflow: 'auto' },
	        treeData: _util.gData, treeLine: true,
	        value: this.state.value,
	        treeDefaultExpandAll: true,
	        placeholder: _react2['default'].createElement(
	          'i',
	          null,
	          '请下拉选择'
	        ),
	        searchPlaceholder: 'please search',
	        treeNodeFilterProp: 'title',
	        treeCheckable: true,
	        showCheckedStrategy: _rcTreeSelect.SHOW_PARENT,
	        onChange: this.onChange }),
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
	          onChange: this.onChange },
	        _react2['default'].createElement(
	          _rcTreeSelect.TreeNode,
	          { value: 'parent 1', title: 'parent 1', key: '0-1' },
	          _react2['default'].createElement(
	            _rcTreeSelect.TreeNode,
	            { value: 'parent 1-0', title: 'parent 1-0', key: '0-1-1' },
	            _react2['default'].createElement(_rcTreeSelect.TreeNode, { value: 'leaf1', title: 'my leaf my leaf my leaf', key: 'random' }),
	            _react2['default'].createElement(_rcTreeSelect.TreeNode, { value: 'leaf2', title: 'your leaf', key: 'random1', disabled: true })
	          ),
	          _react2['default'].createElement(
	            _rcTreeSelect.TreeNode,
	            { value: 'parent 1-1', title: 'parent 1-1', key: 'random2' },
	            _react2['default'].createElement(_rcTreeSelect.TreeNode, { value: 'sss', title: _react2['default'].createElement(
	                'span',
	                { style: { color: 'red' } },
	                'sss'
	              ), key: 'random3' })
	          )
	        )
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