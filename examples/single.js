webpackJsonp([2],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(250);


/***/ },

/***/ 250:
/***/ function(module, exports, __webpack_require__) {

	/* eslint no-console: 0 */
	
	'use strict';
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	__webpack_require__(2);
	
	var _react = __webpack_require__(3);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(160);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _rcTreeSelect = __webpack_require__(161);
	
	var _rcTreeSelect2 = _interopRequireDefault(_rcTreeSelect);
	
	var _data = __webpack_require__(251);
	
	var _data2 = _interopRequireDefault(_data);
	
	var Demo = _react2['default'].createClass({
	  displayName: 'Demo',
	
	  getInitialState: function getInitialState() {
	    return {
	      value: 'leaf1'
	    };
	  },
	  onChange: function onChange(value) {
	    console.log('onChange', value);
	    this.setState({ value: value });
	  },
	
	  render: function render() {
	    return _react2['default'].createElement(
	      'div',
	      { style: { margin: 20 } },
	      _react2['default'].createElement(
	        'h2',
	        null,
	        'Single Select'
	      ),
	      _react2['default'].createElement(
	        _rcTreeSelect2['default'],
	        { style: { width: 300 },
	          dropdownMenuStyle: { maxHeight: 200, overflow: 'auto' },
	          value: this.state.value,
	          treeDefaultExpandAll: true,
	          onChange: this.onChange },
	        _react2['default'].createElement(
	          _rcTreeSelect.TreeNode,
	          { value: 'parent 1', title: 'parent 1', key: '0-1' },
	          _react2['default'].createElement(
	            _rcTreeSelect.TreeNode,
	            { value: 'parent 1-0', title: 'parent 1-0', key: '0-1-1' },
	            _react2['default'].createElement(_rcTreeSelect.TreeNode, { value: 'leaf1', title: 'my leaf', key: 'random' }),
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
	      ),
	      _react2['default'].createElement(
	        'h2',
	        null,
	        'treeData demo'
	      ),
	      _react2['default'].createElement(_rcTreeSelect2['default'], { style: { width: 300 },
	        dropdownMenuStyle: { maxHeight: 200, overflow: 'auto' },
	        treeData: _data2['default'],
	        value: this.state.value,
	        treeDefaultExpandAll: true,
	        onChange: this.onChange })
	    );
	  }
	});
	
	_reactDom2['default'].render(_react2['default'].createElement(Demo, null), document.getElementById('__react-content'));

/***/ },

/***/ 251:
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports['default'] = [{
	  label: '北京',
	  value: '01',
	  children: [{
	    label: '东城区',
	    value: '01-1'
	  }, {
	    label: '西城区',
	    value: '01-2'
	  }, {
	    label: '崇文区',
	    value: '01-3'
	  }, {
	    label: '宣武区',
	    value: '01-4'
	  }]
	}, {
	  label: '浙江',
	  value: '02',
	  children: [{
	    label: '杭州',
	    value: '02-1',
	    children: [{
	      label: '西湖区',
	      value: '02-1-1'
	    }, {
	      label: '上城区',
	      value: '02-1-2'
	    }, {
	      label: '江干区',
	      value: '02-1-3'
	    }, {
	      label: '下城区',
	      value: '02-1-4'
	    }]
	  }, {
	    label: '宁波',
	    value: '02-2',
	    children: [{
	      label: 'xx区',
	      value: '02-2-1'
	    }, {
	      label: 'yy区',
	      value: '02-2-2'
	    }]
	  }, {
	    label: '温州',
	    value: '02-3'
	  }, {
	    label: '嘉兴',
	    value: '02-4'
	  }, {
	    label: '湖州',
	    value: '02-5'
	  }, {
	    label: '绍兴',
	    value: '02-6'
	  }]
	}];
	module.exports = exports['default'];

/***/ }

});
//# sourceMappingURL=single.js.map