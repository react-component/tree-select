webpackJsonp([1],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(225);


/***/ },

/***/ 3:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 225:
/***/ function(module, exports, __webpack_require__) {

	/* eslint react/no-multi-comp:0, no-console:0 */
	
	'use strict';
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }
	
	__webpack_require__(2);
	
	__webpack_require__(3);
	
	var _react = __webpack_require__(4);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(161);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _rcTreeSelect = __webpack_require__(176);
	
	var _rcTreeSelect2 = _interopRequireDefault(_rcTreeSelect);
	
	var _bigDataGenerator = __webpack_require__(226);
	
	var _bigDataGenerator2 = _interopRequireDefault(_bigDataGenerator);
	
	var Demo = _react2['default'].createClass({
	  displayName: 'Demo',
	
	  getInitialState: function getInitialState() {
	    return {
	      gData: [],
	      gData1: [],
	      value: '',
	      value1: ''
	    };
	  },
	  onChange: function onChange(value) {
	    console.log('onChange', arguments);
	    this.setState({ value: value });
	  },
	  onChangeStrictly: function onChangeStrictly(value1) {
	    console.log('onChangeStrictly', arguments);
	    var ind = parseInt(Math.random() * 3, 10);
	    value1.push({ value: '0-0-0-' + ind + '-value', label: '0-0-0-' + ind + '-label', halfChecked: true });
	    this.setState({
	      value1: value1
	    });
	  },
	  onGen: function onGen(data) {
	    this.setState({
	      gData: data,
	      gData1: [].concat(_toConsumableArray(data)),
	      value: '0-0-0-value',
	      value1: [{ value: '0-0-value', label: '0-0-label', halfChecked: true }, { value: '0-0-0-value', label: '0-0-0-label' }]
	    });
	  },
	  // value: ['0-0-0-0-value', '0-0-0-1-value', '0-0-0-2-value'],
	  render: function render() {
	    return _react2['default'].createElement(
	      'div',
	      { style: { padding: '0 20px' } },
	      _react2['default'].createElement(_bigDataGenerator2['default'], { onGen: this.onGen }),
	      _react2['default'].createElement(
	        'div',
	        { style: { display: 'flex' } },
	        _react2['default'].createElement(
	          'div',
	          { style: { marginRight: 20 } },
	          _react2['default'].createElement(
	            'h3',
	            null,
	            'normal check'
	          ),
	          _react2['default'].createElement(_rcTreeSelect2['default'], {
	            style: { width: 300 },
	            dropdownStyle: { maxHeight: 200, overflow: 'auto' },
	            treeData: this.state.gData, treeLine: true,
	            value: this.state.value,
	            placeholder: _react2['default'].createElement(
	              'i',
	              null,
	              '请下拉选择'
	            ),
	            treeCheckable: true,
	            showCheckedStrategy: _rcTreeSelect.SHOW_PARENT,
	            onChange: this.onChange
	          })
	        ),
	        _react2['default'].createElement(
	          'div',
	          null,
	          _react2['default'].createElement(
	            'h3',
	            null,
	            'checkStrictly'
	          ),
	          _react2['default'].createElement(_rcTreeSelect2['default'], {
	            style: { width: 300 },
	            dropdownStyle: { maxHeight: 200, overflow: 'auto' },
	            treeData: this.state.gData1, treeLine: true,
	            value: this.state.value1,
	            placeholder: _react2['default'].createElement(
	              'i',
	              null,
	              '请下拉选择'
	            ),
	            treeCheckable: true,
	            treeCheckStrictly: true,
	            showCheckedStrategy: _rcTreeSelect.SHOW_PARENT,
	            onChange: this.onChangeStrictly
	          })
	        )
	      )
	    );
	  }
	});
	
	_reactDom2['default'].render(_react2['default'].createElement(Demo, null), document.getElementById('__react-content'));

/***/ },

/***/ 226:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _react = __webpack_require__(4);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _util = __webpack_require__(224);
	
	var Gen = _react2['default'].createClass({
	  displayName: 'Gen',
	
	  propTypes: {
	    onGen: _react.PropTypes.func,
	    x: _react.PropTypes.number,
	    y: _react.PropTypes.number,
	    z: _react.PropTypes.number
	  },
	  getDefaultProps: function getDefaultProps() {
	    return {
	      onGen: function onGen() {},
	      x: 20,
	      y: 18,
	      z: 1
	    };
	  },
	  getInitialState: function getInitialState() {
	    return {
	      nums: ''
	    };
	  },
	  componentDidMount: function componentDidMount() {
	    var vals = this.getVals();
	    this.props.onGen((0, _util.generateData)(vals.x, vals.y, vals.z));
	  },
	  onGen: function onGen(e) {
	    e.preventDefault();
	    var vals = this.getVals();
	    this.props.onGen((0, _util.generateData)(vals.x, vals.y, vals.z));
	    this.setState({
	      nums: (0, _util.calcTotal)(vals.x, vals.y, vals.z)
	    });
	  },
	  getVals: function getVals() {
	    return {
	      x: parseInt(this.refs.x.value, 10),
	      y: parseInt(this.refs.y.value, 10),
	      z: parseInt(this.refs.z.value, 10)
	    };
	  },
	  render: function render() {
	    var _props = this.props;
	    var x = _props.x;
	    var y = _props.y;
	    var z = _props.z;
	
	    return _react2['default'].createElement(
	      'div',
	      { style: { padding: '0 20px' } },
	      _react2['default'].createElement(
	        'h2',
	        null,
	        'big data generator'
	      ),
	      _react2['default'].createElement(
	        'form',
	        { onSubmit: this.onGen },
	        _react2['default'].createElement(
	          'span',
	          { style: { marginRight: 10 } },
	          'x: ',
	          _react2['default'].createElement('input', { ref: 'x', defaultValue: x, type: 'number', min: '1', required: true, style: { width: 50 } })
	        ),
	        _react2['default'].createElement(
	          'span',
	          { style: { marginRight: 10 } },
	          'y: ',
	          _react2['default'].createElement('input', { ref: 'y', defaultValue: y, type: 'number', min: '1', required: true, style: { width: 50 } })
	        ),
	        _react2['default'].createElement(
	          'span',
	          { style: { marginRight: 10 } },
	          'z: ',
	          _react2['default'].createElement('input', { ref: 'z', defaultValue: z, type: 'number', min: '1', required: true, style: { width: 50 } })
	        ),
	        _react2['default'].createElement(
	          'button',
	          { type: 'submit' },
	          'Generate'
	        ),
	        _react2['default'].createElement(
	          'p',
	          null,
	          'total nodes: ',
	          this.state.nums || (0, _util.calcTotal)(x, y, z)
	        )
	      ),
	      _react2['default'].createElement(
	        'p',
	        { style: { fontSize: 12 } },
	        'x：每一级下的节点总数。y：每级节点里有y个节点、存在子节点。z：树的level层级数（0表示一级）'
	      )
	    );
	  }
	});
	exports['default'] = Gen;
	module.exports = exports['default'];

/***/ }

});
//# sourceMappingURL=big-data.js.map