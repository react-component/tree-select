webpackJsonp([3],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(277);


/***/ },

/***/ 277:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(2);
	
	var _react = __webpack_require__(4);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(35);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _rcTreeSelect = __webpack_require__(197);
	
	var _rcTreeSelect2 = _interopRequireDefault(_rcTreeSelect);
	
	var _util = __webpack_require__(273);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /* eslint react/no-multi-comp:0, no-console:0 */
	
	var Demo = _react2.default.createClass({
	  displayName: 'Demo',
	  getInitialState: function getInitialState() {
	    return {
	      value: '11',
	      // value: ['0-0-0-0-value', '0-0-0-1-value', '0-0-0-2-value'],
	      simpleTreeData: [{ key: 1, pId: 0, label: 'a', value: 'a' }, { key: 11, pId: 1, label: 'a12', value: 'a12', disabled: true }, { key: 111, pId: 11, label: 'a00', value: 'a00', selectable: false }, { key: 2, pId: 0, label: 'b', value: 'b' }, { key: 20, pId: 2, label: 'b10', value: 'b10' }, { key: 21, pId: 2, label: 'b1', value: 'b1' }, { key: 22, pId: 2, label: 'b12', value: 'b12' }],
	      treeDataSimpleMode: {
	        id: 'key',
	        rootPId: 0
	      }
	    };
	  },
	  onChange: function onChange(value) {
	    if (value.length === 1) {
	      // return;
	    }
	    console.log('onChange', arguments, this.state.simpleTreeData);
	    this.setState({ value: value });
	  },
	  onSelect: function onSelect() {
	    // use onChange instead
	    // console.log(arguments);
	  },
	  onDataChange: function onDataChange() {
	    var data = [].concat(_toConsumableArray(this.state.simpleTreeData));
	    data.forEach(function (i) {
	      if (i.key === 11) {
	        delete i.disabled;
	      }
	      if (i.key === 20) {
	        i.disabled = true;
	      }
	    });
	    this.setState({ simpleTreeData: data });
	  },
	  render: function render() {
	    return _react2.default.createElement(
	      'div',
	      { style: { margin: 20 } },
	      _react2.default.createElement(
	        'h2',
	        null,
	        'check select'
	      ),
	      _react2.default.createElement(_rcTreeSelect2.default, {
	        style: { width: 300 },
	        transitionName: 'rc-tree-select-dropdown-slide-up',
	        choiceTransitionName: 'rc-tree-select-selection__choice-zoom',
	        dropdownStyle: { height: 200, overflow: 'auto' },
	        dropdownPopupAlign: { overflow: { adjustY: 0, adjustX: 0 }, offset: [0, 2] },
	        placeholder: _react2.default.createElement(
	          'i',
	          null,
	          '\u8BF7\u4E0B\u62C9\u9009\u62E9'
	        ),
	        searchPlaceholder: 'please search',
	        treeLine: true, maxTagTextLength: 10,
	        value: this.state.value,
	        treeData: _util.gData,
	        treeNodeFilterProp: 'title',
	        treeCheckable: true,
	        onChange: this.onChange,
	        onSelect: this.onSelect
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
	        treeCheckable: true, showCheckedStrategy: _rcTreeSelect.SHOW_PARENT,
	        onChange: this.onChange,
	        onSelect: this.onSelect
	      }),
	      _react2.default.createElement(
	        'button',
	        { onClick: this.onDataChange },
	        'change data'
	      )
	    );
	  }
	});
	
	_reactDom2.default.render(_react2.default.createElement(Demo, null), document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=filter.js.map